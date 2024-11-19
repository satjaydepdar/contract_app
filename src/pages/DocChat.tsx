import React, { useState, useRef, useEffect } from 'react';
import { Folder, Plus, RefreshCw, Send, Loader2, Bot, User } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import toast from 'react-hot-toast';
import axios from 'axios';
import type { Message } from '../types/chat';

interface ChatFolder {
  id: string;
  name: string;
  files: File[];
}

export default function DocChat() {
  const [folders, setFolders] = useState<ChatFolder[]>([]);
  const [activeFolder, setActiveFolder] = useState<ChatFolder | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadedFilePath, setUploadedFilePath] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const onDrop = async (acceptedFiles: File[]) => {
    if (!activeFolder) {
      toast.error('Please select or create a folder first');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('file', acceptedFiles[0]);

      const response = await axios.post(`${import.meta.env.VITE_API_URL}/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setUploadedFilePath(response.data.filepath);

      const safeFiles = acceptedFiles.map(file => {
        return new File([file], file.name, {
          type: file.type,
          lastModified: file.lastModified
        });
      });

      setFolders(prev => prev.map(folder => {
        if (folder.id === activeFolder.id) {
          return {
            ...folder,
            files: [...folder.files, ...safeFiles]
          };
        }
        return folder;
      }));

      setActiveFolder(prev => prev ? {
        ...prev,
        files: [...prev.files, ...safeFiles]
      } : null);

      toast.success('Document uploaded successfully');
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload document');
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt']
    }
  });

  const createNewFolder = () => {
    const folderName = prompt('Enter folder name:');
    if (folderName) {
      const newFolder: ChatFolder = {
        id: crypto.randomUUID(),
        name: folderName,
        files: []
      };
      setFolders(prev => [...prev, newFolder]);
      setActiveFolder(newFolder);
      toast.success('New folder created');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || !uploadedFilePath || !activeFolder?.files.length) return;

    try {
      setIsProcessing(true);

      const response = await axios.post(`${import.meta.env.VITE_API_URL}/chat`, {
        message: inputMessage,
        filepath: uploadedFilePath
      });

      const userMessage: Message = {
        id: crypto.randomUUID(),
        content: inputMessage,
        type: 'user',
        timestamp: new Date()
      };

      const assistantMessage: Message = {
        id: crypto.randomUUID(),
        content: response.data.response,
        type: 'assistant',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, userMessage, assistantMessage]);
      setInputMessage('');
      scrollToBottom();
    } catch (error) {
      console.error('Chat error:', error);
      toast.error('Failed to process your request');
    } finally {
      setIsProcessing(false);
    }
  };

  const resetChat = () => {
    setMessages([]);
    toast.success('Chat reset successfully');
  };

  return (
    <div className="flex h-[calc(100vh-12rem)]">
      {/* Folders Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <button
            onClick={createNewFolder}
            className="w-full btn-primary flex items-center justify-center"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Folder
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {folders.map(folder => (
            <button
              key={folder.id}
              onClick={() => setActiveFolder(folder)}
              className={`w-full flex items-center p-2 rounded-lg transition-colors ${
                activeFolder?.id === folder.id
                  ? 'bg-purple-100 text-purple-900'
                  : 'hover:bg-gray-100 text-gray-700'
              }`}
            >
              <Folder className={`w-4 h-4 mr-2 ${
                activeFolder?.id === folder.id ? 'text-purple-600' : 'text-gray-400'
              }`} />
              <span className="flex-1 text-left truncate">{folder.name}</span>
              <span className="text-xs text-gray-500">{folder.files.length}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col bg-gray-50">
        <div className="p-4 bg-white border-b border-gray-200 flex justify-between items-center">
          <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Chat with Docs
          </h1>
          <button
            onClick={resetChat}
            className="btn-secondary flex items-center"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            New Chat
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map(message => (
            <div
              key={message.id}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className="flex items-start space-x-2 max-w-[80%]">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  message.type === 'user'
                    ? 'bg-gradient-to-r from-purple-600 to-blue-600'
                    : 'bg-gray-100'
                }`}>
                  {message.type === 'user' ? (
                    <User className="w-4 h-4 text-white" />
                  ) : (
                    <Bot className="w-4 h-4 text-gray-600" />
                  )}
                </div>
                <div className={`rounded-lg p-4 ${
                  message.type === 'user'
                    ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                    : 'bg-white text-gray-900'
                }`}>
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  <span className="text-xs opacity-75 mt-2 block">
                    {message.timestamp.toLocaleTimeString()}
                  </span>
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Upload Area */}
        {activeFolder && activeFolder.files.length === 0 && (
          <div
            {...getRootProps()}
            className={`m-4 border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
              isDragActive
                ? 'border-purple-500 bg-purple-50'
                : 'border-gray-300 hover:border-purple-500 hover:bg-purple-50'
            }`}
          >
            <input {...getInputProps()} />
            <p className="text-sm text-gray-600">
              {isDragActive
                ? 'Drop your documents here...'
                : 'Drag & drop your documents here, or click to select'}
            </p>
            <p className="text-xs text-gray-500 mt-2">
              Supported formats: PDF, DOC, DOCX, TXT
            </p>
          </div>
        )}

        {/* Input Area */}
        <div className="p-4 bg-white border-t border-gray-200">
          <form onSubmit={handleSubmit} className="flex space-x-2">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Ask a question about your documents..."
              className="flex-1 rounded-md border border-gray-300 shadow-sm px-4 py-2 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 disabled:bg-gray-50 disabled:text-gray-500"
              disabled={!activeFolder?.files.length || isProcessing}
            />
            <button
              type="submit"
              disabled={!activeFolder?.files.length || !inputMessage.trim() || isProcessing}
              className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-md hover:from-purple-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[80px]"
            >
              {isProcessing ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}