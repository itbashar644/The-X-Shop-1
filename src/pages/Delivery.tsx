
import React from "react";
import { Link } from "react-router-dom";
import { Truck, Package, Mail, MapPin } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const DeliveryOption = ({ 
  title, 
  description, 
  icon: Icon 
}: { 
  title: string; 
  description: string; 
  icon: React.ElementType 
}) => (
  <div className="flex gap-4 p-4 border rounded-lg">
    <div className="flex items-center justify-center bg-primary/10 p-3 rounded-full">
      <Icon className="h-6 w-6 text-primary" />
    </div>
    <div>
      <h3 className="font-medium text-lg">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  </div>
);

const Delivery = () => {
  const deliveryOptions = [
    {
      title: "Ozon",
      description: "Удобная доставка через маркетплейс Ozon со всеми преимуществами платформы",
      icon: Package
    },
    {
      title: "Wildberries",
      description: "Быстрая доставка через сеть пунктов выдачи Wildberries",
      icon: Truck
    },
    {
      title: "Wildberries Track",
      description: "Отслеживание доставки в режиме реального времени через сервис WB Track",
      icon: Package
    },
    {
      title: "Почта России",
      description: "Доставка в любой населенный пункт России через отделения Почты России",
      icon: Mail
    },
    {
      title: "СДЭК",
      description: "Курьерская доставка и самовывоз из пунктов выдачи СДЭК",
      icon: Truck
    },
    {
      title: "Авито",
      description: "Удобная доставка через сервис Авито Доставка",
      icon: MapPin
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Доставка</h1>
          <p className="text-lg mb-6">
            Мы предлагаем несколько способов доставки ваших заказов по всей России.
            Выберите наиболее удобный для вас вариант:
          </p>
          
          <div className="grid gap-4 mb-8">
            {deliveryOptions.map((option, index) => (
              <DeliveryOption 
                key={index}
                title={option.title}
                description={option.description}
                icon={option.icon}
              />
            ))}
          </div>
          
          <div className="bg-muted p-4 rounded-lg mb-6">
            <h3 className="font-medium text-lg mb-2">Важная информация:</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>Сроки доставки зависят от выбранного способа и региона</li>
              <li>Стоимость доставки рассчитывается автоматически при оформлении заказа</li>
              <li>При возникновении вопросов о доставке, обращайтесь в нашу службу поддержки</li>
            </ul>
          </div>
          
          <p>
            Если у вас остались вопросы о доставке, пожалуйста, посетите страницу{" "}
            <Link to="/contacts" className="text-primary hover:underline">
              Контакты
            </Link>
            , чтобы связаться с нашими специалистами.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Delivery;
