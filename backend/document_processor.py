import os
from typing import Optional
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.embeddings import OpenAIEmbeddings
from langchain.vectorstores import Chroma
from langchain.chains import ConversationalRetrievalChain
from langchain.memory import ConversationBufferMemory
from langchain.chat_models import ChatOpenAI
import pypdf
from docx import Document
import pandas as pd

class DocumentProcessor:
    def __init__(self, filepath: str):
        self.filepath = filepath
        self.text_content = self._extract_text()
        self.qa_chain = self._setup_qa_chain()
        self.chat_history = []

    def _extract_text(self) -> str:
        """Extract text from various document formats"""
        if not os.path.exists(self.filepath):
            raise FileNotFoundError(f"File not found: {self.filepath}")
            
        file_extension = os.path.splitext(self.filepath)[1].lower()
        
        try:
            if file_extension == '.pdf':
                return self._extract_from_pdf()
            elif file_extension in ['.doc', '.docx']:
                return self._extract_from_docx()
            elif file_extension == '.txt':
                return self._extract_from_txt()
            else:
                raise ValueError(f"Unsupported file format: {file_extension}")
        except Exception as e:
            raise Exception(f"Error extracting text from document: {str(e)}")

    def _extract_from_pdf(self) -> str:
        """Extract text from PDF files"""
        text = ""
        with open(self.filepath, 'rb') as file:
            pdf_reader = pypdf.PdfReader(file)
            for page in pdf_reader.pages:
                text += page.extract_text() + "\n"
        return text

    def _extract_from_docx(self) -> str:
        """Extract text from DOCX files"""
        doc = Document(self.filepath)
        return "\n".join([paragraph.text for paragraph in doc.paragraphs])

    def _extract_from_txt(self) -> str:
        """Extract text from TXT files"""
        with open(self.filepath, 'r', encoding='utf-8') as file:
            return file.read()

    def _setup_qa_chain(self) -> ConversationalRetrievalChain:
        """Set up the QA chain with the document content"""
        try:
            # Split the text into chunks
            text_splitter = RecursiveCharacterTextSplitter(
                chunk_size=1000,
                chunk_overlap=200,
                length_function=len
            )
            texts = text_splitter.split_text(self.text_content)

            # Create embeddings and vector store
            embeddings = OpenAIEmbeddings()
            vectorstore = Chroma.from_texts(texts, embeddings)

            # Set up the conversational chain
            memory = ConversationBufferMemory(
                memory_key="chat_history",
                return_messages=True
            )

            qa_chain = ConversationalRetrievalChain.from_llm(
                llm=ChatOpenAI(temperature=0),
                retriever=vectorstore.as_retriever(),
                memory=memory,
            )

            return qa_chain
        except Exception as e:
            raise Exception(f"Error setting up QA chain: {str(e)}")

    def process_query(self, query: str) -> str:
        """Process a query about the document"""
        try:
            result = self.qa_chain({"question": query, "chat_history": self.chat_history})
            self.chat_history.append((query, result['answer']))
            return result['answer']
        except Exception as e:
            raise Exception(f"Error processing query: {str(e)}")

    def clear_history(self):
        """Clear the conversation history"""
        self.chat_history = []