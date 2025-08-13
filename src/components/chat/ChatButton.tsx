
import React from "react";
import { MessageCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/Image-utils";

interface ChatButtonProps {
  isOpen: boolean;
  onClick: () => void;
  unreadCount?: number;
}

const ChatButton = ({ isOpen, onClick, unreadCount = 0 }: ChatButtonProps) => {
  return (
    <Button
      onClick={onClick}
      className={cn(
        "fixed bottom-4 right-4 flex h-12 w-12 items-center justify-center rounded-full p-0 shadow-lg transition-all",
        isOpen ? "bg-destructive text-destructive-foreground" : "bg-primary text-primary-foreground"
      )}
      aria-label={isOpen ? "Закрыть чат" : "Открыть чат"}
    >
      {isOpen ? (
        <X className="h-6 w-6" />
      ) : (
        <>
          <MessageCircle className="h-6 w-6" />
          {unreadCount > 0 && (
            <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-xs text-white">
              {unreadCount}
            </span>
          )}
        </>
      )}
    </Button>
  );
};

export default ChatButton;
