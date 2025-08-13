
import React from "react";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

interface OrderFilterProps {
  selectedStatus: string;
  onStatusChange: (value: string) => void;
  ordersCount: {
    all: number;
    new: number;
    processing: number;
    shipped: number;
    delivered: number;
    cancelled: number;
    archived: number;
  };
}

const OrderFilter: React.FC<OrderFilterProps> = ({
  selectedStatus,
  onStatusChange,
  ordersCount,
}) => {
  const statusOptions = [
    { value: "all", label: "Все статусы", count: ordersCount.all },
    { value: "new", label: "Новые", count: ordersCount.new },
    { value: "processing", label: "В обработке", count: ordersCount.processing },
    { value: "shipped", label: "Отправленные", count: ordersCount.shipped },
    { value: "delivered", label: "Доставленные", count: ordersCount.delivered },
    { value: "cancelled", label: "Отмененные", count: ordersCount.cancelled },
    { value: "archived", label: "Архивированные", count: ordersCount.archived },
  ];

  return (
    <div className="flex flex-col md:flex-row gap-4 items-start">
      <div className="w-full md:w-1/3">
        <Select value={selectedStatus} onValueChange={onStatusChange}>
          <SelectTrigger>
            <SelectValue placeholder="Все статусы" />
          </SelectTrigger>
          <SelectContent>
            {statusOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                <div className="flex items-center justify-between w-full">
                  <span>{option.label}</span>
                  <Badge variant="secondary" className="ml-2">
                    {option.count}
                  </Badge>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default OrderFilter;
