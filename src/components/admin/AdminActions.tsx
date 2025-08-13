// AdminActions.tsx
import React, { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { UserPlus, UserMinus, Bell, BellOff } from "lucide-react";
import { getUnreadMessagesCount, markAllMessagesAsRead } from "@/services/chatService";
import { useToast } from "@/components/ui/use-toast";

interface AdminActionsProps {
  email: string;
  setEmail: (email: string) => void;
  loading: boolean;
  onAddAdmin: () => void;
  onRemoveAdmin: () => void;
}

const AdminActions: React.FC<AdminActionsProps> = ({ 
  email, 
  setEmail, 
  loading, 
  onAddAdmin, 
  onRemoveAdmin 
}) => {
  const [unreadCount, setUnreadCount] = useState(0);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (!notificationsEnabled) return;

    const checkUnreadMessages = async () => {
      try {
        const count = await getUnreadMessagesCount('admin');
        setUnreadCount(count);
        
        if (count > 0 && notificationsEnabled) {
          toast({
            title: "Новые сообщения",
            description: `У вас ${count} непрочитанных сообщений`,
          });
        }
      } catch (error) {
        console.error("Ошибка при проверке сообщений:", error);
      }
    };

    checkUnreadMessages();
    const interval = setInterval(checkUnreadMessages, 30000);
    return () => clearInterval(interval);
  }, [notificationsEnabled, toast]);

  const handleMarkAsRead = async () => {
    try {
      await markAllMessagesAsRead('admin');
      setUnreadCount(0);
      toast({
        title: "Сообщения прочитаны",
        description: "Все сообщения отмечены как прочитанные",
      });
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось отметить сообщения как прочитанные",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Управление администраторами</h3>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => setNotificationsEnabled(!notificationsEnabled)}
          className="relative"
        >
          {notificationsEnabled ? (
            <>
              <Bell className="h-4 w-4 mr-2" />
              {unreadCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </>
          ) : (
            <BellOff className="h-4 w-4 mr-2" />
          )}
          Уведомления
        </Button>
      </div>

      <div className="flex gap-2">
        <Input
          placeholder="Email администратора"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="flex-1"
        />
      </div>

      <div className="flex gap-2">
        <Button 
          onClick={onAddAdmin}
          disabled={loading || !email}
          className="flex-1"
        >
          <UserPlus className="h-4 w-4 mr-2" />
          {loading ? "Обработка..." : "Добавить"}
        </Button>
        <Button 
          onClick={onRemoveAdmin}
          disabled={loading || !email}
          variant="destructive"
          className="flex-1"
        >
          <UserMinus className="h-4 w-4 mr-2" />
          {loading ? "Обработка..." : "Удалить"}
        </Button>
      </div>

      {unreadCount > 0 && notificationsEnabled && (
        <div className="mt-4">
          <Button 
            variant="outline" 
            onClick={handleMarkAsRead}
            className="w-full"
          >
            Отметить все как прочитанные ({unreadCount})
          </Button>
        </div>
      )}
    </div>
  );
};

export default AdminActions;