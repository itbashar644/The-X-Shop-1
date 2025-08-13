import { useParams, useLocation } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { API_BASE_URL, WS_BASE_URL } from "@/types/variables";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Send, Loader2, ArrowLeft, MoreVertical, Smile, Paperclip } from "lucide-react";
import { format } from "date-fns";
import { ru } from "date-fns/locale";

interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
}

interface Message {
  id: string;
  senderId: string;
  text: string;
  createdAt: string;
  isAdmin: boolean;
}

const AdminCustomerChat = () => {
  const location = useLocation();
  const { id: userId } = useParams<{ id: string }>();
  const [customer, setCustomer] = useState<User | null>(location.state?.user);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Загружаем историю сообщений
  useEffect(() => {
    const fetchMessages = async () => {
      if (!userId) return;
      
      try {
        setIsLoading(true);
        const response = await fetch(`${API_BASE_URL}/chat/${userId}/history`);
        const data = await response.json();
        setMessages(data);
      } catch (error) {
        console.error("Ошибка загрузки сообщений:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMessages();
  }, [userId]);

  // Подключаемся к WebSocket
  useEffect(() => {
    if (!userId) return;
    
    const socket = new WebSocket(`${WS_BASE_URL}/chat/admin/${userId}`);
 
    socket.onopen = () => {
      console.log("WebSocket соединение установлено");
      wsRef.current = socket;
    };
    
    socket.onmessage = (event) => {
      try {
        const messageData = JSON.parse(event.data);
        if (messageData.type === 'message' || messageData.text || messageData.message) {
          const newMessage: Message = {
            id: messageData.id?.toString() || messageData._id?.toString() || Date.now().toString(),
            senderId: messageData.senderId || messageData.sender_id || '',
            text: messageData.text || messageData.message || '',
            createdAt: messageData.createdAt || messageData.created_at || new Date().toISOString(),
            isAdmin: (messageData.sender_id === 'admin')
          };
          setMessages(prev => {
            const exists = prev.some(msg => msg.id === newMessage.id);
            if (exists) return prev;
            return [...prev, newMessage];
          });
        }
      } catch (error) {
        console.error("Ошибка обработки сообщения:", error, event.data);
      }
    };
    
    socket.onclose = () => {
      console.log("WebSocket соединение закрыто");
      wsRef.current = null;
    };
    
    socket.onerror = (error) => {
      console.error("WebSocket ошибка:", error);
    };
    
    return () => {
      if (socket.readyState === WebSocket.OPEN) {
        socket.close();
      }
    };
  }, [userId]);

  // Прокручиваем вниз при новых сообщениях
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !userId || !wsRef.current) return;
    
    try {
      setIsSending(true);
      
      const tempMessage: Message = {
        id: `temp-${Date.now()}`,
        senderId: "admin",
        text: newMessage,
        createdAt: new Date().toISOString(),
        isAdmin: true
      };
      
      setMessages(prev => [...prev, tempMessage]);
      setNewMessage("");
      
      wsRef.current.send(JSON.stringify({
        type: "message",
        text: newMessage,
        userId: userId,
        senderId: "admin"
      }));
      
    } catch (error) {
      console.error("Ошибка отправки сообщения:", error);
      setMessages(prev => prev.filter(msg => !msg.id.startsWith("temp-")));
      setNewMessage(newMessage);
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[70vh] bg-gray-50 dark:bg-gray-900">
        <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="flex justify-center items-center min-h-[70vh] bg-gray-50 dark:bg-gray-900">
        <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg max-w-md w-[90%]">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Клиент не найден</h2>
          <p className="text-muted-foreground mt-2">
            Пользователь с ID {userId} не существует или был удален
          </p>
          <Button className="mt-4" onClick={() => window.history.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Назад
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[85vh] max-h-[700px] bg-gray-50 dark:bg-gray-900 rounded-lg shadow-lg overflow-hidden">
      {/* Шапка чата */}
      <div className="bg-white dark:bg-gray-800 p-3 md:p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Button variant="ghost" size="icon" onClick={() => window.history.back()} className="hidden sm:flex">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <Avatar className="h-9 w-9">
            <AvatarImage src={customer.avatar || "/default-avatar.jpg"} />
            <AvatarFallback className="bg-blue-100 dark:bg-blue-900 text-xs">
              {customer.name?.[0] || customer.email?.[0] || "U"}
            </AvatarFallback>
          </Avatar>
          <div className="max-w-[160px] sm:max-w-none">
            <h2 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white truncate">
              {customer.name || customer.email || `Клиент #${customer.id}`}
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
              {customer.email} {customer.phone && `• ${customer.phone}`}
            </p>
          </div>
        </div>
        <Button variant="ghost" size="icon">
          <MoreVertical className="h-5 w-5" />
        </Button>
      </div>

      {/* Область сообщений */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full">
            <div className="text-center max-w-md">
              <div className="mx-auto bg-gray-200 dark:bg-gray-700 h-16 w-16 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Чат с {customer.name || "клиентом"}</h3>
              <p className="text-gray-500 dark:text-gray-400 mt-2">
                Начните разговор с клиентом. Все сообщения будут сохранены здесь.
              </p>
            </div>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.isAdmin ? "justify-end" : "justify-start"}`}
            >
              <div className={`flex max-w-[85%] md:max-w-[70%] ${message.isAdmin ? "items-end" : "items-start"}`}>
                {!message.isAdmin && (
                  <Avatar className="mr-2 h-8 w-8">
                    <AvatarImage src={customer.avatar || "/default-avatar.jpg"} />
                    <AvatarFallback className="text-xs">
                      {customer.name?.[0] || customer.email?.[0] || "U"}
                    </AvatarFallback>
                  </Avatar>
                )}
                
                <div
                  className={`px-4 py-3 rounded-2xl ${
                    message.isAdmin
                      ? "bg-blue-500 text-white rounded-tr-none"
                      : "bg-white dark:bg-gray-700 rounded-tl-none"
                  } shadow-sm`}
                >
                  <p className="whitespace-pre-wrap">{message.text}</p>
                  <p
                    className={`text-xs mt-1.5 ${
                      message.isAdmin ? "text-blue-100" : "text-gray-500 dark:text-gray-400"
                    }`}
                  >
                    {format(new Date(message.createdAt), "HH:mm", { locale: ru })}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Поле ввода */}
      <div className="bg-white dark:bg-gray-800 p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-end space-x-2">
          <div className="flex space-x-1">
            <Button variant="ghost" size="icon" className="text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700">
              <Paperclip className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700">
              <Smile className="h-5 w-5" />
            </Button>
          </div>
          
          <div className="flex-1 relative">
            <textarea
              placeholder="Введите сообщение..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={handleKeyPress}
              disabled={isSending}
              className="pr-12 min-h-[44px] max-h-32 resize-none w-full rounded-md border border-gray-300 p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              rows={1}
            />
            {newMessage && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="absolute right-2 bottom-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                onClick={() => setNewMessage("")}
              >
                Очистить
              </Button>
            )}
          </div>
          
          <Button
            onClick={handleSendMessage}
            disabled={!newMessage.trim() || isSending}
            className="h-11 w-11"
            size="icon"
          >
            {isSending ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Send className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AdminCustomerChat;
