export interface OrderFromDB {
  id: string;
  order_number: string; // из БД приходит строка
  created_at: string;
  status: string;
  items: any[];
  total: number;
  delivery_method: string;
  delivery_address: string;
  tracking_number?: string;
  tracking_url?: string;
}

export interface Order {
  id: string;
  order_number: number; // преобразуем в число
  date: string;
  status: "new" | "processing" | "shipped" | "delivered" | "cancelled" | "archived";
  items: any[];
  total: number;
  deliveryMethod: string;
  deliveryAddress: string;
  trackingNumber?: string;
  trackingUrl?: string;
}
