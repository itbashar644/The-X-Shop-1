import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { sendMessage } from '@/services/chatService';
import { toast } from 'sonner';

export const useChatSender = (fetchMessages: () => Promise<void>) => {
  const [isSending, setIsSending] = useState(false);
  const { user } = useAuth();

  const handleSendMessage = async (messageText: string): Promise<void> => {
    if (!messageText.trim() || isSending) {
      return;
    }

    setIsSending(true);

    try {
      // Передаём messageText, имя и email как отдельные аргументы
      const success = await sendMessage(
        messageText,
        user?.name || '',
        user?.email || ''
      );

      if (success) {
        await fetchMessages();
        toast.success("Сообщение отправлено");
      } else {
        toast.error("Ошибка отправки сообщения", {
          description: "Не удалось отправить сообщение. Пожалуйста, попробуйте позже."
        });
        throw new Error("Failed to send message");
      }
    } catch (error) {
      toast.error("Ошибка отправки сообщения");
      throw error;
    } finally {
      setIsSending(false);
    }
  };

  return {
    isSending,
    handleSendMessage
  };
};
