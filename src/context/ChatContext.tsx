import React, { createContext, useContext, ReactNode } from 'react';
import { useChat } from '../hooks/useChat';
import type { Message } from '../types/chat';

interface ChatContextType {
  messages: Message[];
  isProcessing: boolean;
  sendMessage: (message: string, documentPath: string) => Promise<void>;
  clearMessages: () => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: ReactNode }) {
  const chat = useChat();

  return (
    <ChatContext.Provider value={chat}>
      {children}
    </ChatContext.Provider>
  );
}

export function useDocumentChat() {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useDocumentChat must be used within a ChatProvider');
  }
  return context;
}