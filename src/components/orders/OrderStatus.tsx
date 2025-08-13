
import React from "react";
import { Badge } from "@/components/ui/badge";

type OrderStatusType = "new" | "processing" | "shipped" | "delivered" | "cancelled" | "archived";

interface OrderStatusProps {
  status: OrderStatusType;
}

export const getStatusText = (status: OrderStatusType) => {
  switch(status) {
    case "new": return "Новый";
    case "processing": return "В обработке";
    case "shipped": return "Отправлен";
    case "delivered": return "Доставлен";
    case "cancelled": return "Отменен";
    case "archived": return "Архивирован";
    default: return "Неизвестно";
  }
};

export const getStatusColor = (status: OrderStatusType) => {
  switch(status) {
    case "new": return "bg-blue-500";
    case "processing": return "bg-yellow-500";
    case "shipped": return "bg-orange-500";
    case "delivered": return "bg-green-500";
    case "cancelled": return "bg-red-500";
    case "archived": return "bg-gray-500";
    default: return "bg-gray-500";
  }
};

const OrderStatus: React.FC<OrderStatusProps> = ({ status }) => {
  return (
    <Badge className={getStatusColor(status) + " text-white"}>
      {getStatusText(status)}
    </Badge>
  );
};

export default OrderStatus;
