import React from 'react';
import { Send, Loader2 } from 'lucide-react';

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  isProcessing: boolean;
  disabled: boolean;
}

export default function ChatInput({ 
  value, 
  onChange, 
  onSubmit, 
  isProcessing, 
  disabled 
}: ChatInputProps) {
  return (
    <form onSubmit={onSubmit} className="flex space-x-2">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Ask a question about your document..."
        className="flex-1 rounded-md border border-gray-300 shadow-sm px-4 py-2 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 disabled:bg-gray-50 disabled:text-gray-500"
        disabled={disabled}
      />
      <button
        type="submit"
        disabled={disabled || !value.trim() || isProcessing}
        className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-md hover:from-purple-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[80px]"
      >
        {isProcessing ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          <Send className="w-5 h-5" />
        )}
      </button>
    </form>
  );
}