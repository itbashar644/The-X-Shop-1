
import React, { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { SEOHead } from "@/components/seo/SEOHead";
import { useCart } from "@/context/CartContext";
import { trackPageView, trackPurchase } from "@/utils/metrika";

const OrderSuccess = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("orderId");
  const { clearCart } = useCart();

  // Clear the cart once the success page is shown
  useEffect(() => {
    clearCart();
  }, [clearCart]);

  // Track page view and purchase event for analytics
  useEffect(() => {
    // Track specific success page view
    trackPageView("/order-success", {
      title: "Заказ успешно оформлен",
      params: {
        order_id: orderId || 'unknown',
        page_type: 'order_success'
      }
    });
    
    if (orderId) {
      // Track the purchase completion event
      trackPurchase({ 
        orderId,
        // Additional purchase data could be added here if stored in sessionStorage
      });
    }
  }, [orderId]);

  return (
    <div className="flex flex-col min-h-screen">
      <SEOHead
        title="Заказ успешно оформлен - The X Shop"
        description="Спасибо за ваш заказ в The X Shop! Наш менеджер свяжется с вами в ближайшее время для подтверждения деталей."
      />
      
      <Navbar />

      <main className="flex-grow container px-4 py-16 md:px-6 flex flex-col items-center justify-center">
        <div className="max-w-md w-full mx-auto text-center space-y-6">
          <div className="flex justify-center">
            <CheckCircle className="h-16 w-16 text-green-500" />
          </div>

          <h1 className="text-3xl font-bold">Заказ успешно оформлен!</h1>
          
          {orderId && (
            <p className="text-lg">
              Номер вашего заказа: <span className="font-semibold">{orderId}</span>
            </p>
          )}

          <div className="bg-muted/50 rounded-lg p-6 text-left">
            <p className="mb-4">Ваш заказ успешно принят в обработку. Наш менеджер свяжется с вами в ближайшее время для подтверждения заказа и уточнения деталей доставки.</p>
            <p>Информация о заказе была отправлена на указанный вами email. Проверьте, пожалуйста, вашу почту, включая папку "Спам".</p>
          </div>

          <div className="space-y-4 pt-4">
            <Button asChild className="w-full">
              <a href="/catalog">Продолжить покупки</a>
            </Button>
            <Button variant="outline" asChild className="w-full">
              <a href="/">На главную</a>
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default OrderSuccess;
