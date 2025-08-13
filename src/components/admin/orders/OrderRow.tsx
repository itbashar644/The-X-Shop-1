
import React, { useState } from "react";
import { TableRow, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Archive, ChevronDown, ChevronUp, Truck, RotateCcw } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import TrackingDialog from "./TrackingDialog";
import OrderItemsDetails from "./OrderItemsDetails";

interface OrderItem {
  productId: string;
  productName: string;
  price: number;
  quantity: number;
  color?: string;
  size?: string;
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

interface OrderRowProps {
  order: Order;
  onStatusChange: (orderId: string, newStatus: Order["status"]) => void;
  onArchive: (orderId: string) => void;
  onRestore: (orderId: string) => void;
  onTrackingUpdate: (orderId: string, trackingNumber: string, trackingUrl: string) => void;
  getStatusColor: (status: Order["status"]) => string;
  getStatusText: (status: Order["status"]) => string;
}

const OrderRow: React.FC<OrderRowProps> = ({
  order,
  onStatusChange,
  onArchive,
  onRestore,
  onTrackingUpdate,
  getStatusColor,
  getStatusText
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <>
      <TableRow className={order.status === 'archived' ? 'opacity-60' : ''}>
        <TableCell className="font-medium">{order.orderNumber}</TableCell>
        <TableCell className="font-medium">{order.id.substring(0, 8)}</TableCell>
        <TableCell>
          <div className="font-medium">{order.customerName}</div>
          <div className="text-sm text-muted-foreground">
            {order.customerEmail}
          </div>
          <div className="text-sm text-muted-foreground">
            {order.customerPhone}
          </div>
        </TableCell>
        <TableCell>
          {new Date(order.date).toLocaleDateString()}
        </TableCell>
        <TableCell>{order.total.toLocaleString()} ₽</TableCell>
        <TableCell>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
            {getStatusText(order.status)}
          </span>
        </TableCell>
        <TableCell>{order.deliveryMethod}</TableCell>
        <TableCell>
          {order.trackingNumber ? (
            <div className="flex items-center">
              <Truck className="h-4 w-4 mr-1" />
              <span className="text-xs">{order.trackingNumber}</span>
            </div>
          ) : (
            <span className="text-muted-foreground text-xs">Не задан</span>
          )}
        </TableCell>
        <TableCell className="text-right">
          <div className="flex items-center justify-end space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              title="Подробнее"
            >
              {isExpanded ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
            
            <TrackingDialog
              orderNumber={order.orderNumber}
              initialTrackingNumber={order.trackingNumber || ''}
              initialTrackingUrl={order.trackingUrl || ''}
              onSubmit={(trackingNumber, trackingUrl) => 
                onTrackingUpdate(order.id, trackingNumber, trackingUrl)
              }
            />

            {order.status === 'archived' ? (
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => onRestore(order.id)}
                className="text-green-600"
                title="Восстановить заказ"
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
            ) : (
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => onArchive(order.id)}
                className="text-gray-500"
                title="Архивировать заказ"
              >
                <Archive className="h-4 w-4" />
              </Button>
            )}
            
            <Select
              value={order.status}
              onValueChange={(value) => onStatusChange(order.id, value as Order["status"])}
              disabled={order.status === 'archived'}
            >
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Изменить статус" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="new">Новый</SelectItem>
                <SelectItem value="processing">В обработке</SelectItem>
                <SelectItem value="shipped">Отправлен</SelectItem>
                <SelectItem value="delivered">Доставлен</SelectItem>
                <SelectItem value="cancelled">Отменен</SelectItem>
                <SelectItem value="archived">Архивирован</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </TableCell>
      </TableRow>
      
      {isExpanded && (
        <TableRow className="bg-slate-50">
          <TableCell colSpan={9} className="p-4">
            <div className="rounded-md overflow-hidden">
              <OrderItemsDetails items={order.items} />
              
              <div className="mt-4 bg-white p-4 border rounded-md">
                <h4 className="text-sm font-medium mb-1">Адрес доставки:</h4>
                <p className="text-sm text-muted-foreground">{order.address}</p>
              </div>
              <div className="mt-2 bg-white p-4 border rounded-md">
                <h4 className="text-sm font-medium mb-1">Телефон:</h4>
                <p className="text-sm text-muted-foreground">{order.customerPhone}</p>
              </div>
            </div>
          </TableCell>
        </TableRow>
      )}
    </>
  );
};

export default OrderRow;
