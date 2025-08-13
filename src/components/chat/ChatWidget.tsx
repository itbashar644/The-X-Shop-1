// ChatWidget.tsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, X } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Input } from '@/components/ui/input';

interface ChatMessage {
  id: string;
  text: string;
  isFromAdmin: boolean;
  timestamp?: Date;
}

const useChatMessages = (isOpen: boolean) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const saveToLocalStorage = useCallback((msgs: ChatMessage[]) => {
    localStorage.setItem('chatMessages', JSON.stringify(msgs));
  }, []);

  const loadFromLocalStorage = useCallback(() => {
    const saved = localStorage.getItem('chatMessages');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setMessages(Array.isArray(parsed) ? parsed : []);
      } catch {
        setMessages([]);
      }
    }
  }, []);

  const sendMessage = useCallback(async (text: string) => {
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      text,
      isFromAdmin: false,
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, newMessage]);
    
    // Здесь можно добавить вызов API для отправки сообщения админу
    // await api.sendChatMessage(text);
    
    // Имитация ответа админа
    setTimeout(() => {
      const adminReply: ChatMessage = {
        id: Date.now().toString(),
        text: 'Спасибо за ваше сообщение! Мы ответим вам в ближайшее время.',
        isFromAdmin: true,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, adminReply]);
    }, 2000);
  }, []);

  useEffect(() => {
    if (!isOpen && messages.length > 0) {
      setUnreadCount(prev => prev + 1);
    }
  }, [messages, isOpen]);

  useEffect(() => {
    if (isOpen) {
      setUnreadCount(0);
      scrollToBottom();
    }
  }, [isOpen, messages]);

  return {
    messages,
    unreadCount,
    messagesEndRef,
    sendMessage,
    saveToLocalStorage,
    loadFromLocalStorage,
  };
};

const ChatWindow: React.FC<{
  messages: ChatMessage[];
  onClose: () => void;
  onSendMessage: (text: string) => void;
  isSending: boolean;
  messagesEndRef: React.RefObject<HTMLDivElement>;
}> = ({ messages, onClose, onSendMessage, isSending, messagesEndRef }) => {
  const [messageText, setMessageText] = useState('');
  const { isAuthenticated } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (messageText.trim()) {
      onSendMessage(messageText);
      setMessageText('');
    }
  };

  return (
    <div className="fixed bottom-4 right-4 w-80 h-96 bg-white rounded-lg shadow-xl border border-gray-200 flex flex-col z-50">
      <div className="bg-primary text-white p-3 rounded-t-lg flex justify-between items-center">
        <h3 className="font-medium">Чат поддержки</h3>
        <button onClick={onClose} className="text-white hover:text-gray-200">
          <X size={18} />
        </button>
      </div>
      
      <div className="flex-1 p-3 overflow-y-auto">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 mt-10">
            Напишите ваш вопрос...
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`mb-2 ${message.isFromAdmin ? 'text-left' : 'text-right'}`}
            >
              <div
                className={`inline-block px-3 py-2 rounded-lg ${message.isFromAdmin ? 'bg-gray-100' : 'bg-primary text-white'}`}
              >
                {message.text}
                <div className="text-xs mt-1 opacity-70">
                  {message.timestamp?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="p-3 border-t border-gray-200">
        <div className="flex gap-2">
          <Input
            type="text"
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            placeholder="Введите сообщение..."
            className="flex-1"
            disabled={isSending}
          />
          <Button type="submit" disabled={isSending || !messageText.trim()}>
            Отправить
          </Button>
        </div>
        {!isAuthenticated && (
          <p className="text-xs text-gray-500 mt-1">
            Вы не авторизованы. Сообщения будут сохранены временно.
          </p>
        )}
      </form>
    </div>
  );
};

const ChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated } = useAuth();
  const {
    messages,
    unreadCount,
    messagesEndRef,
    sendMessage,
    saveToLocalStorage,
    loadFromLocalStorage
  } = useChatMessages(isOpen);

  useEffect(() => {
    if (!isAuthenticated) {
      loadFromLocalStorage();
    }
  }, [isAuthenticated, loadFromLocalStorage]);

  const handleToggleChat = () => {
    setIsOpen(!isOpen);
  };

  const handleSendMessage = (text: string) => {
    sendMessage(text);
    if (!isAuthenticated) {
      saveToLocalStorage([...messages, { 
        id: Date.now().toString(), 
        text, 
        isFromAdmin: false,
        timestamp: new Date()
      }]);
    }
  };

  return (
    <>
      {isOpen ? (
        <ChatWindow
          messages={messages}
          onClose={handleToggleChat}
          onSendMessage={handleSendMessage}
          isSending={false}
          messagesEndRef={messagesEndRef}
        />
      ) : (
        <Button
          onClick={handleToggleChat}
          variant="outline"
          size="icon"
          className="fixed bottom-4 right-4 h-12 w-12 rounded-full shadow-lg z-40 bg-white border-2"
          aria-label="Открыть чат"
        >
          <MessageSquare />
          {unreadCount > 0 && (
            <Badge className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 flex items-center justify-center text-xs">
              {unreadCount}
            </Badge>
          )}
        </Button>
      )}
    </>
  );
};

export default ChatWidget;