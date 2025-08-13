export interface ChatMessage {
  id: string;
  chatId: string;
  message: string;
  isFromAdmin: boolean;
  isRead: boolean;
  createdAt: string;
  senderId?: string;
}

export interface ChatSession {
  id: string;
  customerName: string;
  customerEmail: string | null;
  createdAt: string;
  updatedAt: string;
  unreadCount?: number;
}

export interface ChatContextType {
  messages: ChatMessage[];
  sendMessage: (text: string) => Promise<void>;
  unreadCount: number;
  markAsRead: () => void;
}