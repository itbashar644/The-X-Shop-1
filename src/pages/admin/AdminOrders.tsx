
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Download, RefreshCw } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import OrdersTable from "@/components/admin/orders/OrdersTable";
import OrderFilter from "@/components/admin/orders/OrderFilter";
import { getAllOrders, updateOrderStatus, updateOrderTracking } from "@/services/orderService";

interface OrderItem {
  productId: string;
  productName: string;
  price: number;
  quantity: number;
  color?: string;
  size?: string;
  articleNumber?: string;
}

interface Order {
  id: string;
  orderNumber: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  items: OrderItem[];
  total: number;
  status: "new" | "processing" | "shipped" | "delivered" | "cancelled" | "archived";
  date: string;
  address: string;
  deliveryMethod: string;
  userId: string | null;
  trackingNumber?: string;
  trackingUrl?: string;
}

const AdminOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState<string>("all");

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    filterOrders();
  }, [orders, selectedStatus]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const result = await getAllOrders();
      if (result.success && result.orders) {
        const transformedOrders = result.orders.map((order: any) => ({
          id: order.id,
          orderNumber: order.order_number || 0,
          customerName: order.customer_name || '',
          customerEmail: order.customer_email || '',
          customerPhone: order.customer_phone || '',
          items: order.items || [],
          total: parseFloat(order.total) || 0,
          status: order.status || 'new',
          date: order.created_at,
          address: order.delivery_address || '',
          deliveryMethod: order.delivery_method || '',
          userId: order.user_id,
          trackingNumber: order.tracking_number,
          trackingUrl: order.tracking_url
        }));
        setOrders(transformedOrders);
      } else {
        toast({
          title: "Ошибка",
          description: "Не удалось загрузить заказы",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast({
        title: "Ошибка",
        description: "Произошла ошибка при загрузке заказов",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filterOrders = () => {
    if (selectedStatus === "all") {
      setFilteredOrders(orders);
    } else {
      setFilteredOrders(orders.filter(order => order.status === selectedStatus));
    }
  };

  const handleStatusChange = async (orderId: string, newStatus: Order["status"]) => {
    try {
      const result = await updateOrderStatus(orderId, newStatus);
      if (result.success) {
        setOrders(orders.map(order => 
          order.id === orderId ? { ...order, status: newStatus } : order
        ));
        toast({
          title: "Успешно",
          description: "Статус заказа обновлен",
        });
      } else {
        toast({
          title: "Ошибка",
          description: "Не удалось обновить статус заказа",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error updating order status:", error);
      toast({
        title: "Ошибка",
        description: "Произошла ошибка при обновлении статуса заказа",
        variant: "destructive",
      });
    }
  };

  const handleArchive = (orderId: string) => {
    handleStatusChange(orderId, "archived");
  };

  const handleRestore = (orderId: string) => {
    handleStatusChange(orderId, "new");
  };

  const handleTrackingUpdate = async (orderId: string, trackingNumber: string, trackingUrl: string) => {
    try {
      const result = await updateOrderTracking(orderId, trackingNumber, trackingUrl);
      if (result.success) {
        setOrders(orders.map(order => 
          order.id === orderId 
            ? { ...order, trackingNumber, trackingUrl } 
            : order
        ));
        toast({
          title: "Успешно",
          description: "Информация о трекинге обновлена",
        });
      } else {
        toast({
          title: "Ошибка",
          description: "Не удалось обновить информацию о трекинге",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error updating tracking info:", error);
      toast({
        title: "Ошибка",
        description: "Произошла ошибка при обновлении трекинга",
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (status: Order["status"]) => {
    switch (status) {
      case "new": return "bg-blue-100 text-blue-800";
      case "processing": return "bg-yellow-100 text-yellow-800";
      case "shipped": return "bg-purple-100 text-purple-800";
      case "delivered": return "bg-green-100 text-green-800";
      case "cancelled": return "bg-red-100 text-red-800";
      case "archived": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: Order["status"]) => {
    switch (status) {
      case "new": return "Новый";
      case "processing": return "В обработке";
      case "shipped": return "Отправлен";
      case "delivered": return "Доставлен";
      case "cancelled": return "Отменен";
      case "archived": return "Архивирован";
      default: return status;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Управление заказами</h1>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={fetchOrders} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Обновить
          </Button>
        </div>
      </div>

      <OrderFilter
        selectedStatus={selectedStatus}
        onStatusChange={setSelectedStatus}
        ordersCount={{
          all: orders.length,
          new: orders.filter(o => o.status === 'new').length,
          processing: orders.filter(o => o.status === 'processing').length,
          shipped: orders.filter(o => o.status === 'shipped').length,
          delivered: orders.filter(o => o.status === 'delivered').length,
          cancelled: orders.filter(o => o.status === 'cancelled').length,
          archived: orders.filter(o => o.status === 'archived').length,
        }}
      />

      <OrdersTable
        orders={filteredOrders}
        loading={loading}
        onStatusChange={handleStatusChange}
        onArchive={handleArchive}
        onRestore={handleRestore}
        onTrackingUpdate={handleTrackingUpdate}
        getStatusColor={getStatusColor}
        getStatusText={getStatusText}
      />
    </div>
  );
};

export default AdminOrders;
