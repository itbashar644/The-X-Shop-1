
import React from "react";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import OrderStatus from "./OrderStatus";
import OrderItemTable from "./OrderItemTable";
import OrderTracking from "./OrderTracking";

interface OrderAccordionItemProps {
  id: string;
  order_number: number;
  date: string;
  status: "new" | "processing" | "shipped" | "delivered" | "cancelled" | "archived";
  items: any[];
  total: number;
  deliveryMethod: string;
  deliveryAddress: string;
  trackingNumber?: string;
  trackingUrl?: string;
}

const OrderAccordionItem: React.FC<OrderAccordionItemProps> = ({
  id,
  order_number,
  date,
  status,
  items,
  total,
  deliveryMethod,
  deliveryAddress,
  trackingNumber,
  trackingUrl,
}) => {
  // Убедимся, что у нас есть валидный массив items
  const safeItems = Array.isArray(items) ? items : [];
  
  // Проверка валидности даты
  let displayDate = "Нет данных";
  try {
    if (date) {
      const dateObj = new Date(date);
      displayDate = !isNaN(dateObj.getTime()) 
        ? dateObj.toLocaleDateString() 
        : "Нет данных";
    }
  } catch (e) {
    console.error("Error formatting date:", e);
  }
  
  // Безопасное отображение номера заказа
  const displayOrderNumber = order_number || "Номер не указан";
  // Безопасное преобразование в число
  let safeTotal = 0;

  if (total !== null && total !== undefined) {
    // Преобразуем в число, заменяя запятые на точки для корректного распознавания дробных чисел
    const numericValue = typeof total === 'string'
      ? parseFloat((total as string).replace(/,/g, '.'))
      : Number(total);

    // Проверяем результат преобразования
    if (!isNaN(numericValue) && isFinite(numericValue)) {
      safeTotal = numericValue;
      console.log("Успешное преобразование. safeTotal:", safeTotal);
    } else {
      console.warn("Некорректное числовое значение. Используется 0 по умолчанию.");
    }
  } else {
    console.warn("Значение total равно null или undefined. Используется 0 по умолчанию.");
  }

  return (
    <AccordionItem key={id} value={id}>
      <AccordionTrigger className="hover:no-underline">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between w-full">
          <div>
            <span className="font-medium">Заказ #{displayOrderNumber}</span>
            <span className="text-muted-foreground ml-4">{displayDate}</span>
          </div>
          <div className="flex items-center gap-3 mt-2 sm:mt-0">
            <Badge variant="secondary">
              {total.toLocaleString()} ₽
            </Badge>
            <OrderStatus status={status} />
          </div>
        </div>
      </AccordionTrigger>
      <AccordionContent>
        <div className="space-y-4 pt-2">
          <OrderItemTable items={safeItems} />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold mb-2">Способ доставки</h4>
              <p className="text-muted-foreground">{deliveryMethod || "Не указан"}</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Адрес доставки</h4>
              <p className="text-muted-foreground">{deliveryAddress || "Не указан"}</p>
            </div>
          </div>
          
          <OrderTracking trackingNumber={trackingNumber} trackingUrl={trackingUrl} />
          
          <div className="flex justify-between items-center pt-2">
            <span className="font-semibold">Итого</span>
            <span className="font-bold text-lg">{safeTotal.toLocaleString()} ₽</span>
          </div>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};

export default OrderAccordionItem;
