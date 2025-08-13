
import React, { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { sendMessage } from "@/services/chatService";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const Contacts = () => {
  const { user } = useAuth();
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim()) {
      toast.error("Ошибка", { description: "Введите текст сообщения" });
      return;
    }
    
    setLoading(true);
    
    try {
      const userInfo = {
        name: name,
        email: email
      };

      // Fix: sendMessage expects (message: string, userInfo: string)
      const success = await sendMessage(message, JSON.stringify(userInfo));

      if (success) {
        toast.success("Сообщение отправлено", { 
          description: "Мы свяжемся с вами в ближайшее время" 
        });
        setMessage("");
      } else {
        toast.error("Ошибка отправки", { 
          description: "Не удалось отправить сообщение. Пожалуйста, попробуйте позже." 
        });
      }
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Ошибка", { 
        description: "Произошла ошибка при отправке сообщения" 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-center">Свяжитесь с нами</h1>
          
          <Card className="border shadow-lg">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 border-b">
              <CardTitle className="text-2xl">Форма обратной связи</CardTitle>
              <CardDescription>
                Заполните форму, и мы свяжемся с вами в ближайшее время
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="name" className="font-medium text-sm">Ваше имя</label>
                    <Input 
                      type="text" 
                      id="name" 
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Иван Иванов" 
                      className="w-full"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="email" className="font-medium text-sm">Электронная почта</label>
                    <Input 
                      type="email" 
                      id="email" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="ivan@example.com" 
                      className="w-full"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="message" className="font-medium text-sm">Сообщение</label>
                  <Textarea 
                    id="message" 
                    rows={6} 
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full resize-none"
                    placeholder="Напишите ваш вопрос или сообщение..."
                    required
                  />
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-3"
                  disabled={loading}
                >
                  {loading ? "Отправляем..." : "Отправить сообщение"}
                </Button>
                
                <p className="text-center text-sm text-muted-foreground mt-4">
                  Мы обычно отвечаем в течение 24 часов
                </p>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Contacts;
