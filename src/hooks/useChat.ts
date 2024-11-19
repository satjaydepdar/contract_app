import { useState, useCallback } from 'react';
import { Message } from '../types/chat';
import { sendMessage } from '../services/api';
import toast from 'react-hot-toast';

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const addMessage = useCallback((content: string, type: 'user' | 'assistant') => {
    const newMessage: Message = {
      id: crypto.randomUUID(),
      content,
      type,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, newMessage]);
  }, []);

  const sendChatMessage = useCallback(async (message: string, documentPath: string) => {
    try {
      setIsProcessing(true);
      addMessage(message, 'user');
      
      const response = await sendMessage(message, documentPath);
      addMessage(response, 'assistant');
    } catch (error) {
      toast.error('Failed to send message. Please try again.');
      console.error('Chat error:', error);
    } finally {
      setIsProcessing(false);
    }
  }, [addMessage]);

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  return {
    messages,
    isProcessing,
    sendMessage: sendChatMessage,
    clearMessages,
  };
}