import React, { useState, useRef, useEffect } from 'react';
import toast from 'react-hot-toast';
import ChatMessages from '../components/chat/ChatMessages';
import FileUpload from '../components/chat/FileUpload';
import ChatInput from '../components/chat/ChatInput';
import { useDocumentChat } from '../context/ChatContext';
import type { UploadedFile } from '../types/chat';
import { FileText } from 'lucide-react';

export default function DocumentChat() {
  const { messages, isProcessing, sendMessage, clearMessages } = useDocumentChat();
  const [inputMessage, setInputMessage] = useState('');
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Cleanup function to handle file cleanup
  useEffect(() => {
    return () => {
      if (uploadedFile?.url) {
        URL.revokeObjectURL(uploadedFile.url);
      }
    };
  }, [uploadedFile]);

  const handleFileUpload = (file: UploadedFile) => {
    // Clean up previous file if exists
    if (uploadedFile?.url) {
      URL.revokeObjectURL(uploadedFile.url);
    }
    
    setUploadedFile(file);
    clearMessages();
    toast.success('Document uploaded successfully');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inputMessage.trim() || !uploadedFile) return;

    try {
      await sendMessage(inputMessage, uploadedFile.path);
      setInputMessage('');
    } catch (error) {
      toast.error('Failed to process your request');
      console.error('Chat error:', error);
    }
  };

  const removeFile = () => {
    if (uploadedFile?.url) {
      URL.revokeObjectURL(uploadedFile.url);
    }
    setUploadedFile(null);
    clearMessages();
    toast.success('Document removed');
  };

  return (
    <div className="flex flex-col h-[calc(100vh-12rem)]">
      <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-4">
        Document Chat
      </h1>

      <div className="flex flex-col bg-white rounded-lg shadow-sm overflow-hidden flex-1">
        <ChatMessages messages={messages} messagesEndRef={messagesEndRef} />

        {!uploadedFile && <FileUpload onFileUpload={handleFileUpload} />}

        <div className="p-4 border-t border-gray-200">
          {uploadedFile && (
            <div className="flex items-center justify-between bg-purple-50 p-2 rounded-lg mb-4">
              <div className="flex items-center space-x-2">
                <FileText className="w-4 h-4 text-purple-600" />
                <span className="text-sm text-purple-900">{uploadedFile.name}</span>
                <span className="text-xs text-purple-700">
                  ({(uploadedFile.size / 1024 / 1024).toFixed(2)} MB)
                </span>
              </div>
              <button
                onClick={removeFile}
                className="text-red-600 hover:text-red-700 text-sm font-medium"
              >
                Remove
              </button>
            </div>
          )}

          <ChatInput
            value={inputMessage}
            onChange={setInputMessage}
            onSubmit={handleSubmit}
            isProcessing={isProcessing}
            disabled={isProcessing || !uploadedFile}
          />

          {!uploadedFile && (
            <p className="text-xs text-gray-500 mt-2">
              Please upload a document to start the conversation
            </p>
          )}
        </div>
      </div>
    </div>
  );
}