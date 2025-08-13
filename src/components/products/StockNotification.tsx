
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { Bell } from "lucide-react";

interface StockNotificationProps {
  productId: string;
  productName: string;
  variant?: string;
}

const StockNotification = ({ productId, productName, variant }: StockNotificationProps) => {
  const [email, setEmail] = useState("");
  const [isSubscribing, setIsSubscribing] = useState(false);
  const { user } = useAuth();

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setIsSubscribing(true);
    
    try {
      // В будущей реализации здесь будет API-запрос для сохранения подписки
      // Пример заглушки для демонстрации функциональности
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const emailToUse = user?.email || email;
      
      if (!emailToUse) {
        toast("Необходим email", {
          description: "Пожалуйста, введите email для получения уведомлений",
        });
        return;
      }
      
      toast("Подписка оформлена", {
        description: `Мы уведомим вас на ${emailToUse}, когда ${productName}${variant ? ` (${variant})` : ''} появится в наличии.`,
      });
      
      setEmail("");
    } catch (error) {
      toast("Ошибка", {
        description: "Не удалось оформить подписку. Пожалуйста, попробуйте позже.",
      });
    } finally {
      setIsSubscribing(false);
    }
  };

  return (
    <div className="mt-4 bg-muted/50 p-4 rounded-lg border border-border">
      <h3 className="font-semibold flex items-center gap-2 mb-3">
        <Bell className="h-4 w-4" />
        Уведомить о поступлении
      </h3>
      
      <form onSubmit={handleSubscribe} className="flex flex-col gap-2">
        {!user && (
          <Input
            type="email"
            placeholder="Ваш email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required={!user}
            className="bg-background"
          />
        )}
        
        <Button 
          type="submit" 
          disabled={isSubscribing || (!email && !user)}
          className="w-full"
        >
          {isSubscribing ? "Оформляем..." : "Уведомить меня"}
        </Button>
        
        <p className="text-xs text-muted-foreground mt-1">
          {user 
            ? `Уведомление будет отправлено на ${user.email}` 
            : "Мы отправим вам одно письмо, когда товар появится в наличии"}
        </p>
      </form>
    </div>
  );
};

export default StockNotification;
