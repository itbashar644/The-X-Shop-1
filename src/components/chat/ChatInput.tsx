
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send } from 'lucide-react';

interface ChatInputProps {
  onSendMessage: (message: string) => Promise<void>;
  isSending: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isSending }) => {
  const [message, setMessage] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input when component mounts
  useEffect(() => {
    const timer = setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const handleSendMessage = async () => {
    const messageToSend = message.trim();
    if (!messageToSend || isSending) return;
    
    console.log('Sending message:', messageToSend);
    setMessage('');
    
    try {
      await onSendMessage(messageToSend);
      console.log('Message sent successfully');
      
      // Refocus input after sending
      if (inputRef.current) {
        setTimeout(() => {
          if (inputRef.current) {
            inputRef.current.focus();
          }
        }, 100);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      // Restore message on error
      setMessage(messageToSend);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Enhanced mobile event handling with proper preventDefault
  const handleButtonInteraction = async (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!message.trim() || isSending) return;
    
    console.log('Button interaction triggered');
    await handleSendMessage();
  };

  return (
    <div className="flex w-full gap-2">
      <Input
        ref={inputRef}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Введите сообщение..."
        disabled={isSending}
        className="flex-1"
        autoComplete="off"
        inputMode="text"
        enterKeyHint="send"
      />
      <Button
        type="button"
        size="icon"
        disabled={isSending || !message.trim()}
        className="flex-shrink-0 touch-manipulation"
        onClick={handleButtonInteraction}
        onTouchEnd={handleButtonInteraction}
        style={{ 
          WebkitTapHighlightColor: 'transparent', 
          touchAction: 'manipulation',
          userSelect: 'none'
        }}
      >
        <Send className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default ChatInput;
