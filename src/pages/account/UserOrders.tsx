import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Accordion } from "@/components/ui/accordion";
import { toast } from "@/hooks/use-toast";
import { getUserOrders } from "@/services/orderService";
import OrderAccordionItem from "@/components/orders/OrderAccordionItem";
import { Order, OrderFromDB } from "@/types/orderTypes"; // Предполагается наличие типов

const STATUS_MAP: Record<string, Order["status"]> = {
  new: "new",
  processing: "processing",
  shipped: "shipped",
  delivered: "delivered",
  cancelled: "cancelled",
  archived: "archived"
};

const UserOrders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      setIsLoading(true);
      setError(null);
      
      if (!user) {
        setIsLoading(false);
        return;
      }

      try {
        const result = await getUserOrders(user.id.toString());
        
        if (!result.success || !result.orders) {
          throw new Error(result.error?.message || "Failed to fetch orders");
        }

        const formattedOrders: Order[] = result.orders.map((order: OrderFromDB) => ({
          id: order.id,
          order_number: Number(order.order_number),  // Приводим к числу
          date: order.created_at,
          status: STATUS_MAP[order.status] || "new",
          items: Array.isArray(order.items) ? order.items : [],
          total: order.total,
          deliveryMethod: order.delivery_method,
          deliveryAddress: order.delivery_address,
          ...(order.tracking_number && { 
            trackingNumber: order.tracking_number,
            trackingUrl: order.tracking_url
          })
        }));

        setOrders(formattedOrders);
      } catch (err) {
        const message = err instanceof Error ? err.message : "Unknown error";
        setError(`Не удалось загрузить заказы: ${message}`);
        toast({
          title: "Ошибка загрузки",
          description: message,
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
        </div>
      );
    }

    if (error) {
      return (
        <div className="py-8 text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-primary text-white rounded hover:bg-opacity-90"
          >
            Обновить страницу
          </button>
        </div>
      );
    }

    if (orders.length === 0) {
      return (
        <div className="py-8 text-center">
          <p className="text-muted-foreground">У вас пока нет заказов</p>
        </div>
      );
    }

    return (
      <Accordion type="single" collapsible className="w-full">
        {orders.map(order => (
          <OrderAccordionItem 
            key={order.id} 
            {...order} 
          />
        ))}
      </Accordion>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>История ваших заказов</CardTitle>
      </CardHeader>
      <CardContent>
        {renderContent()}
      </CardContent>
    </Card>
  );
};

export default UserOrders;
