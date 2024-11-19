from langchain.chat_models import ChatOpenAI
from langchain.chains import ConversationChain
from langchain.memory import ConversationBufferMemory
from langchain.prompts import (
    ChatPromptTemplate,
    MessagesPlaceholder,
    SystemMessagePromptTemplate,
    HumanMessagePromptTemplate,
)

class ChatProcessor:
    def __init__(self):
        self.chat = ChatOpenAI(temperature=0.7)
        self.memory = ConversationBufferMemory(return_messages=True)
        
        prompt = ChatPromptTemplate.from_messages([
            SystemMessagePromptTemplate.from_template(
                "You are a helpful AI assistant that helps users understand their documents. "
                "Be concise and clear in your responses."
            ),
            MessagesPlaceholder(variable_name="history"),
            HumanMessagePromptTemplate.from_template("{input}")
        ])
        
        self.conversation = ConversationChain(
            memory=self.memory,
            prompt=prompt,
            llm=self.chat
        )

    def process_message(self, message: str) -> str:
        """Process a user message and return the response"""
        try:
            response = self.conversation.predict(input=message)
            return response
        except Exception as e:
            raise Exception(f"Error processing message: {str(e)}")

    def clear_history(self):
        """Clear the conversation history"""
        self.memory.clear()