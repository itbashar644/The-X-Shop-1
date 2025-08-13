
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import OrderRow from "./OrderRow";

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

interface OrdersTableProps {
  orders: Order[];
  loading: boolean;
  onStatusChange: (orderId: string, newStatus: Order["status"]) => void;
  onArchive: (orderId: string) => void;
  onRestore: (orderId: string) => void;
  onTrackingUpdate: (orderId: string, trackingNumber: string, trackingUrl: string) => void;
  getStatusColor: (status: Order["status"]) => string;
  getStatusText: (status: Order["status"]) => string;
}

const OrdersTable: React.FC<OrdersTableProps> = ({
  orders,
  loading,
  onStatusChange,
  onArchive,
  onRestore,
  onTrackingUpdate,
  getStatusColor,
  getStatusText
}) => {
  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>№</TableHead>
            <TableHead>ID заказа</TableHead>
            <TableHead>Клиент</TableHead>
            <TableHead>Дата</TableHead>
            <TableHead>Сумма</TableHead>
            <TableHead>Статус</TableHead>
            <TableHead>Доставка</TableHead>
            <TableHead>Трекинг</TableHead>
            <TableHead className="text-right">Действия</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.length === 0 ? (
            <TableRow>
              <TableCell colSpan={9} className="text-center py-4">
                Заказы не найдены
              </TableCell>
            </TableRow>
          ) : (
            orders.map((order) => (
              <OrderRow
                key={order.id}
                order={order}
                onStatusChange={onStatusChange}
                onArchive={onArchive}
                onRestore={onRestore}
                onTrackingUpdate={onTrackingUpdate}
                getStatusColor={getStatusColor}
                getStatusText={getStatusText}
              />
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default OrdersTable;
