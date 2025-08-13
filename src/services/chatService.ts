import { v4 as uuidv4 } from "uuid";
import { ChatMessage } from "@/types/chat";
import { API_BASE_URL } from "@/types/variables";

// Получение или создание ID чата с улучшенной идентификацией
let cachedChatId: string | null = null;

/**
 * Безопасное получение ID чата с поддержкой множественных устройств
 */
export const getChatId = (): string => {
  if (cachedChatId) {
    return cachedChatId;
  }

  try {
    // Пытаемся получить ID из localStorage
    const stored = typeof localStorage !== "undefined"
      ? localStorage.getItem("chat_id")
      : null;

    if (stored) {
      cachedChatId = stored;
    } else {
      // Генерируем новый уникальный ID
      cachedChatId = `chat_${Date.now()}_${uuidv4()}`;
      if (typeof localStorage !== "undefined") {
        localStorage.setItem("chat_id", cachedChatId);
      }
    }
  } catch (error) {
    console.error("Ошибка доступа к localStorage для chat_id:", error);
    if (!cachedChatId) {
      cachedChatId = `chat_${Date.now()}_${uuidv4()}`;
    }
  }

  return cachedChatId;
};

// Получение информации об устройстве для лучшей идентификации
const getDeviceInfo = () => {
  try {
    return {
      userAgent: navigator.userAgent,
      platform: navigator.platform,
      language: navigator.language,
      screenResolution: `${screen.width}x${screen.height}`,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
    };
  } catch (error) {
    return {};
  }
};

interface OrderItem {
  price: number;
  quantity: number;
  productId: string;
  productName: string;
  articleNumber: string;
}

interface Order {
  id: string;
  user_id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  items: OrderItem[];
  total: number;
  status: string;
  delivery_address: string;
  delivery_method: string;
  created_at: string;
  updated_at: string;
  order_number: number;
  tracking_number: string | null;
  tracking_url: string | null;
  source: string;
}

export const sendToTelegram = async (response: any): Promise<boolean> => {
  try {
      if (!response || !response.success || !response.order) {
          console.error("Неверный формат ответа:", response);
          return false;
      }

      const order = response.order;

      if (!order.items || !Array.isArray(order.items) || order.items.length === 0) {
          console.error("Отсутствуют товары в заказе:", order);
          return false;
      }

      const formatDate = (dateString: string) => {
          const date = new Date(dateString);
          return date.toLocaleString('ru-RU', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
          });
      };

      let message = `🛒 *Новый заказ #${order.order_number}*\n\n`;
      message += `📅 *Дата:* ${formatDate(order.created_at)}\n`;
      message += `👤 *Имя:* ${order.customer_name}\n`;
      message += `✉️ *Email:* ${order.customer_email || 'не указан'}\n`;
      message += `📱 *Телефон:* ${order.customer_phone}\n`;
      message += `🚚 *Способ доставки:* ${order.delivery_method}\n`;
      message += `🏠 *Адрес доставки:* ${order.delivery_address}\n\n`;
      message += `📦 *Товары:*\n`;

      order.items.forEach((item: any, index: number) => {
          const product = item.product;
          const sum = parseFloat(product.price) * item.quantity;
          
          message += `${index + 1}. *${product.title}*\n`;
          message += `   Артикул: ${product.article_number}\n`;
          message += `   Цена: ${parseFloat(product.price).toLocaleString('ru-RU')} ₽\n`;
          message += `   Кол-во: ${item.quantity}\n`;
          message += `   Сумма: ${sum.toLocaleString('ru-RU')} ₽\n\n`;
      });

      message += `💳 *Итого к оплате:* ${parseFloat(order.total).toLocaleString('ru-RU')} ₽\n`;
      message += `🟢 *Статус:* ${order.status === 'new' ? 'Новый' : order.status}`;

      return await sendTelegramMessage(message, {
          name: order.customer_name,
          email: order.customer_email
      });
  } catch (error) {
      console.error("Ошибка при отправке уведомления:", error);
      return false;
  }
};

export const sendTelegramMessage = async (
  message: string,
  userInfo?: { name?: string; email?: string }
): Promise<boolean> => {
  try {
    const chatId = getChatId();
    const deviceInfo = getDeviceInfo();
 
    const url = `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        chat_id: process.env.TELEGRAM_ADMIN_CHAT_ID,
        text: message,
        parse_mode: 'Markdown'
      })
    });

    if (!response.ok) {
      console.error('Ошибка HTTP:', response.status, await response.text());
      return false;
    }

    return (await response.json()).ok;
  } catch (error) {
    console.error('Ошибка:', error);
    return false;
  }
};

export const sendMessage = async (
  userId: string,
  text: string,
  senderId?: string
): Promise<ChatMessage | null> => {
  try {
    const response = await fetch(`${API_BASE_URL}/chat/${userId}/send`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text, senderId }),
    });
    if (!response.ok) {
      console.error('Ошибка:', response.status, await response.text());
      return null;
    }
    return await response.json();
  } catch (error) {
    console.error("Ошибка:", error);
    return null;
  }
};

export const getUnreadMessagesCount = async (userId: string): Promise<number> => {
  try {
    const response = await fetch(`${API_BASE_URL}/chat/${userId}/unread-count`);
    if (!response.ok) throw new Error('Ошибка HTTP');
    return (await response.json()).unreadCount || 0;
  } catch (error) {
    console.error("Ошибка:", error);
    return 0;
  }
};

export const getChatHistory = async (userId: string): Promise<ChatMessage[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/chat/${userId}/history`);
    if (!response.ok) throw new Error('Ошибка HTTP');
    return await response.json();
  } catch (error) {
    console.error("Ошибка:", error);
    return [];
  }
};

export const markAllMessagesAsRead = async (userId: string): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE_URL}/chat/${userId}/mark-all-read`, {
      method: 'POST',
    });
    return response.ok;
  } catch (error) {
    console.error("Ошибка:", error);
    return false;
  }
};

export const checkTelegramWebhookStatus = async (): Promise<any> => {
  try {
    const response = await fetch(`${API_BASE_URL}/telegram/webhook-status`);
    return response.ok ? await response.json() : { ok: false };
  } catch (error) {
    console.error("Ошибка:", error);
    return { ok: false };
  }
};

export const checkChatStatus = async (): Promise<{
  ok: boolean;
  config?: {
    telegram_bot_token_set: boolean;
    telegram_admin_chat_id_set: boolean;
    supabase_url_set: boolean;
    supabase_service_role_key_set: boolean;
  };
}> => {
  try {
    const response = await fetch(`${API_BASE_URL}/chat/status`);
    if (!response.ok) throw new Error('Ошибка HTTP');
    return await response.json();
  } catch (error) {
    console.error("Ошибка:", error);
    return {
      ok: false,
      config: {
        telegram_bot_token_set: false,
        telegram_admin_chat_id_set: false,
        supabase_url_set: false,
        supabase_service_role_key_set: false
      }
    };
  }
};

export const pollForNewMessages = async (
  lastMessageId: number | null,
  callback: (messages: ChatMessage[]) => void
): Promise<void> => {
  try {
    const response = await fetch(`${API_BASE_URL}/chat/poll?lastMessageId=${lastMessageId || ''}`);
    if (!response.ok) throw new Error('Ошибка HTTP');
    const messages = await response.json();
    if (messages?.length > 0) callback(messages);
  } catch (error) {
    console.error("Ошибка:", error);
  }
};

export const setupTelegramWebhook = async (url: string): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE_URL}/telegram/webhook`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url }),
    });
    return response.ok;
  } catch (error) {
    console.error("Ошибка:", error);
    return false;
  }
};

export const syncChatAcrossDevices = async (): Promise<void> => {
  try {
    const chatId = getChatId();
    const deviceInfo = getDeviceInfo();
    await fetch(`${API_BASE_URL}/chat/sync`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chatId, deviceInfo }),
    });
  } catch (error) {
    console.error("Ошибка синхронизации:", error);
  }
};

export const getMessages = async (userId: string): Promise<ChatMessage[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/chat/${userId}/messages`);
    if (!response.ok) throw new Error('Ошибка HTTP');
    return await response.json();
  } catch (error) {
    console.error("Ошибка:", error);
    return [];
  }
};

// Новая функция для уведомлений админа
export const subscribeToAdminNotifications = (
  callback: (count: number) => void
): (() => void) => {
  let active = true;
  
  const checkNotifications = async () => {
    if (!active) return;
    
    try {
      const count = await getUnreadMessagesCount('admin');
      callback(count);
    } catch (error) {
      console.error('Ошибка подписки:', error);
    }
    
    setTimeout(checkNotifications, 30000);
  };

  checkNotifications();
  
  return () => {
    active = false;
  };
};