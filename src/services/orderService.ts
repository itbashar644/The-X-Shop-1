import { CartItem } from "@/types/product";
import { API_BASE_URL } from "@/types/variables";

// Получить заказы пользователя с backend API
export async function getUserOrders(userId: string) {
  console.log(`Getting orders for user ID: ${userId}`);
  try {
    const response = await fetch(`${API_BASE_URL}/orders/user/${userId}`);
    const result = await response.json();
    if (!response.ok || !result.success) {
      console.error('Error fetching user orders:', result.error);
      return { success: false, error: result.error || { message: 'Ошибка при загрузке заказов' } };
    }
    return { success: true, orders: result.orders };
  } catch (error) {
    console.error('Unexpected error fetching user orders:', error);
    return { success: false, error };
  }
}

 



// Новый вариант placeOrder: отправка заказа на backend API
export async function placeOrder(orderData: {
  user_id?: string;
  items: CartItem[];
  total: number;
  delivery_method: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  delivery_address: string;
}) {
  try {
    console.log('Placing order with data:', orderData);
    const response = await fetch(`${API_BASE_URL}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData),
    });
    const result = await response.json();
    if (!response.ok || !result.success) {
      console.error('Error creating order:', result.error);
      return { success: false, error: result.error || { message: 'Ошибка при создании заказа' } };
    }
    return { success: true, order: result.order };
  } catch (error) {
    console.error('Unexpected error creating order:', error);
    return { success: false, error };
  }
}

// Обновить статус заказа через backend API
export async function updateOrderStatus(orderId: string, status: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/orders/${orderId}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    const result = await response.json();
    if (!response.ok || !result.success) {
      console.error('Error updating order status:', result.error);
      return { success: false, error: result.error || { message: 'Ошибка при обновлении статуса заказа' } };
    }
    return { success: true, order: result.order };
  } catch (error) {
    console.error('Unexpected error updating order status:', error);
    return { success: false, error };
  }
}

// Обновить трекинг-номер и ссылку через backend API
export async function updateOrderTracking(orderId: string, trackingNumber: string, trackingUrl: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/orders/${orderId}/tracking`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ trackingNumber, trackingUrl }),
    });
    const result = await response.json();
    if (!response.ok || !result.success) {
      console.error('Error updating order tracking:', result.error);
      return { success: false, error: result.error || { message: 'Ошибка при обновлении трекинга' } };
    }
    return { success: true, order: result.order };
  } catch (error) {
    console.error('Unexpected error updating order tracking:', error);
    return { success: false, error };
  }
}

 

export async function getAllOrders() {
  try {
    const response = await fetch(`${API_BASE_URL}/orders`);
    const result = await response.json();
    if (!response.ok || !result.success) {
      console.error('Error fetching all orders:', result.error);
      return { success: false, error: result.error || { message: 'Ошибка при загрузке заказов' } };
    }
    return { success: true, orders: result.orders };
  } catch (error) {
    console.error('Unexpected error fetching all orders:', error);
    return { success: false, error };
  }
}