import { useState, useEffect, useRef, useCallback } from 'react';
import { ChatMessage } from '@/types/chat';
import { getMessages } from '@/services/chatService';
import { useAuth } from '@/context/AuthContext';
import { WS_BASE_URL, API_BASE_URL } from '@/types/variables';

export const useChatMessages = (isOpen: boolean) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const { user } = useAuth();

  // Helper function to fetch messages from backend (initial load)
  const fetchMessages = useCallback(async () => {
    if (!user || !user.id) return;
    try {
      const msgs = await getMessages(user.id.toString());
      setMessages(msgs);
      // Count unread messages from admin
      const newUnreadCount = msgs.filter(m => m.isFromAdmin && !m.isRead).length;
      setUnreadCount(newUnreadCount);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  }, [user]);

  // WebSocket setup
  useEffect(() => {
    if (!user || !user.id) return;

    const ws = new WebSocket(`${WS_BASE_URL}/chat/user/${user.id}`);
    wsRef.current = ws;

    ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);

        const userId = msg.user_id || msg.userId;
        const chatId = msg.chat_id || msg.chatId;

        if (userId === user.id || chatId === user.id) {

          const newMsg: ChatMessage = {
            id: (msg.id?.toString() || msg._id?.toString() || Date.now().toString()),
            chatId: chatId ? chatId.toString() : (userId ? userId.toString() : ''),
            message: msg.text || msg.message || '',
            isFromAdmin: (msg.sender_id === 'admin'),
            isRead: true,
            createdAt: msg.created_at || msg.createdAt || new Date().toISOString()
          };

          setMessages(prev => {
            if (prev.some(m => m.id === newMsg.id)) {
              return prev;
            }
            return [...prev, newMsg];
          });
        } else {
          console.log('[WS] Сообщение не для этого пользователя, игнорируем');
        }
      } catch (e) {
        console.error('Error parsing message', e);
      }
    };

    ws.onclose = () => {
      wsRef.current = null;
    };

    ws.onerror = (err) => {
      console.error('WebSocket error:', err);
    };

    return () => ws.close();
  }, [user]);

  // Initial fetch on mount
  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current && isOpen) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  // Send message
  const sendMessage = async (text: string) => {
    if (!user || !user.id) return;
    const tempId = -Math.abs(Date.now()); // временный уникальный числовой ID
    const now = new Date().toISOString();

    // Оптимистично добавляем сообщение в UI
    setMessages(prev => [
      ...prev,
      {
        id: tempId.toString(), // id — строка
        chatId: String(user.id),
        message: text,
        isFromAdmin: false,
        isRead: true,
        createdAt: now
      } as ChatMessage
    ]);

    const msgObj = {
      type: 'message',
      text,
      userId: user.id
    };

    try {
      // Try WebSocket first
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify(msgObj));
      } else {
        await fetch(`${API_BASE_URL}/chat/${user.id}/send`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(msgObj)
        });
      }
    } catch (error) {
      // Откатываем UI при ошибке — удаляем оптимистичное сообщение
      setMessages(prev => prev.filter(m => m.id !== tempId.toString()));
      console.error('Error sending message:', error);
    }
  };

  return {
    messages,
    unreadCount,
    messagesEndRef,
    sendMessage
  };
};
