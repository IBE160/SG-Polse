// src/lib/types/chat.ts
export interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  isError?: boolean;
  isLoading?: boolean;
  sources?: Array<{ documentName: string; pageNumber?: number; url?: string; }>;
  teacherContactInfo?: {
    method: string;
    details: string;
  };
  confidenceScore?: number;
}

export interface ChatbotResponse {
  answer: string;
  sources: Array<{ documentName: string; pageNumber?: number; url?: string; }>;
  teacherContactInfo?: {
    method: string;
    details: string;
  };
  confidenceScore?: number;
}
