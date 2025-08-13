
import React from "react";
import { cn } from "@/lib/Image-utils";
import { ChatMessage } from "@/types/chat";
import { format } from "date-fns";
import { ru } from "date-fns/locale";

interface ChatBubbleProps {
  message: ChatMessage;
  isFromAdmin: boolean;
  timestamp: Date;
}

const ChatBubble = ({ message, isFromAdmin, timestamp }: ChatBubbleProps) => {
  const messageText = message.message;
  
  // Форматируем время в московском часовом поясе
  // Форматируем время в московском часовом поясе
  // date-fns не поддерживает timeZone напрямую, поэтому преобразуем вручную
  const moscowTimestamp = new Date(
    timestamp.toLocaleString("en-US", { timeZone: "Europe/Moscow" })
  );
  const formattedTime = format(moscowTimestamp, "HH:mm", { 
    locale: ru
  });

  return (
    <div
      className={cn(
        "mb-4 max-w-[80%] rounded-lg p-3",
        isFromAdmin
          ? "mr-auto bg-muted text-foreground" // Сообщения поддержки слева
          : "ml-auto bg-primary text-primary-foreground" // Сообщения пользователя справа
      )}
    >
      <div className="text-sm">{messageText}</div>
      <div className={cn(
        "mt-1 text-xs",
        isFromAdmin ? "text-muted-foreground" : "text-primary-foreground/70"
      )}>
        {formattedTime}
      </div>
    </div>
  );
};

export default ChatBubble;
