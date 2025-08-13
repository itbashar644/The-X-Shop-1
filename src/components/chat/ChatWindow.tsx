import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import ChatBubble from './ChatBubble';
import ChatInput from './ChatInput';
import { ChatMessage } from '@/types/chat';

interface ChatWindowProps {
  messages: ChatMessage[];
  onClose: () => void;
  onSendMessage: (message: string) => Promise<void>;
  isSending: boolean;
  messagesEndRef: React.RefObject<HTMLDivElement>;
}

const ChatWindow: React.FC<ChatWindowProps> = ({
  messages,
  onClose,
  onSendMessage,
  isSending,
  messagesEndRef,
}) => {
  return (
    <Card className="fixed bottom-4 right-4 w-80 sm:w-96 h-[500px] max-h-[80vh] flex flex-col shadow-lg animate-in slide-in-from-bottom-5 z-50 bg-white">
      <CardHeader className="p-3 border-b flex-shrink-0">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">Чат с поддержкой</CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>

      <ScrollArea className="flex-1 p-3">
        <div className="space-y-4">
          {messages.length === 0 ? (
            <div className="text-center text-muted-foreground p-4">
              Нет сообщений. Начните разговор!
            </div>
          ) : (
            messages.map((msg) => (
              <ChatBubble
                key={msg.id}
                message={msg}
                isFromAdmin={msg.isFromAdmin} // camelCase
                timestamp={new Date(msg.createdAt)} // camelCase
              />
            ))
          )}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      <CardFooter className="p-3 border-t flex-shrink-0">
        <ChatInput onSendMessage={onSendMessage} isSending={isSending} />
      </CardFooter>
    </Card>
  );
};

export default ChatWindow;
