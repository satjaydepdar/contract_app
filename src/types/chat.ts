export interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface FileInfo {
  id: string;
  name: string;
  size: number;
  type: string;
  lastModified: number;
}