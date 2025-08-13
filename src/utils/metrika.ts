
/**
 * Utility functions for Yandex Metrika tracking
 */

// The counter ID from the Metrika initialization
const COUNTER_ID = 101964387;

/**
 * Track a page view
 * @param url - Optional URL to report (defaults to current URL)
 * @param options - Optional configuration
 */
export function trackPageView(url?: string, options?: {
  title?: string;
  referer?: string;
  params?: Record<string, any>;
}) {
  if (typeof window !== 'undefined' && (window as any).ym) {
    try {
      // Убедимся что счетчик инициализирован
      if (!(window as any)._ymCounterInitialized) {
        console.warn('Yandex Metrika counter might not be initialized yet');
      }
      
      // Добавляем текущее время для уникализации хитов
      const trackParams = {
        ...options,
        params: {
          ...(options?.params || {}),
          timestamp: new Date().getTime()
        }
      };
      
      // Отправляем хит в метрику
      (window as any).ym(COUNTER_ID, 'hit', url || window.location.href, trackParams);
      
      // Отладка
      console.debug('[Metrika] Tracked page view:', url || window.location.href, trackParams);
    } catch (error) {
      console.error('[Metrika] Error tracking page view:', error);
    }
  } else {
    console.warn('[Metrika] ym object is not available');
  }
}

/**
 * Track a goal conversion
 * @param target - Goal name in Yandex Metrika
 * @param params - Optional parameters for the goal
 */
export function trackGoal(target: string, params?: Record<string, any>) {
  if (typeof window !== 'undefined' && (window as any).ym) {
    if (params) {
      (window as any).ym(COUNTER_ID, 'reachGoal', target, params);
    } else {
      (window as any).ym(COUNTER_ID, 'reachGoal', target);
    }
  }
}

/**
 * Track a purchase completion
 * @param purchaseData - Purchase information
 */
export function trackPurchase(purchaseData: {
  orderId: string;
  revenue?: number;
  items?: Array<{
    id: string;
    name: string;
    category?: string;
    quantity?: number;
    price?: number;
  }>;
}) {
  if (typeof window !== 'undefined' && (window as any).ym) {
    try {
      // Track as a goal
      trackGoal('purchase', {
        order_id: purchaseData.orderId,
        revenue: purchaseData.revenue,
        items_count: purchaseData.items?.length || 0
      });
      
      // Also send ecommerce purchase data if available
      if ((window as any).dataLayer && purchaseData.items) {
        (window as any).dataLayer.push({
          'ecommerce': {
            'purchase': {
              'actionField': {
                'id': purchaseData.orderId,
                'revenue': purchaseData.revenue
              },
              'products': purchaseData.items
            }
          }
        });
      }
      
      console.debug('[Metrika] Tracked purchase:', purchaseData);
    } catch (error) {
      console.error('[Metrika] Error tracking purchase:', error);
    }
  }
}

/**
 * Set visit parameters
 * @param params - Parameters for the current visit
 */
export function setVisitParams(params: Record<string, any>) {
  if (typeof window !== 'undefined' && (window as any).ym) {
    (window as any).ym(COUNTER_ID, 'params', params);
  }
}

/**
 * Set user parameters
 * @param params - Parameters for the current user
 */
export function setUserParams(params: Record<string, any>) {
  if (typeof window !== 'undefined' && (window as any).ym) {
    (window as any).ym(COUNTER_ID, 'userParams', params);
  }
}

/**
 * Track an ecommerce product view
 * @param product - Product data
 */
export function trackProductView(product: {
  id: string;
  name: string;
  price?: number;
  category?: string;
}) {
  if (typeof window !== 'undefined' && (window as any).ym) {
    try {
      // Отслеживаем просмотр товара как отдельное событие
      trackGoal('product_view', {
        product_id: product.id,
        product_name: product.name,
        product_price: product.price,
        product_category: product.category
      });
      
      // Также отправляем данные для электронной коммерции
      if ((window as any).dataLayer) {
        (window as any).dataLayer.push({
          'ecommerce': {
            'detail': {
              'products': [{
                'name': product.name,
                'id': product.id,
                'price': product.price,
                'category': product.category
              }]
            }
          }
        });
      }
    } catch (error) {
      console.error('[Metrika] Error tracking product view:', error);
    }
  }
}

/**
 * Track an ecommerce product added to cart
 * @param product - Product data
 * @param quantity - Quantity added
 */
export function trackAddToCart(product: {
  id: string;
  name: string;
  price?: number;
  category?: string;
}, quantity: number = 1) {
  if (typeof window !== 'undefined' && (window as any).ym) {
    try {
      trackGoal('add_to_cart', {
        product_id: product.id,
        product_name: product.name,
        product_price: product.price,
        product_quantity: quantity,
        product_category: product.category,
        order_price: product.price ? product.price * quantity : undefined
      });
      
      // Также отправляем данные в формате электронной коммерции
      if ((window as any).dataLayer) {
        (window as any).dataLayer.push({
          'ecommerce': {
            'add': {
              'products': [{
                'name': product.name,
                'id': product.id,
                'price': product.price,
                'category': product.category,
                'quantity': quantity
              }]
            }
          }
        });
      }
    } catch (error) {
      console.error('[Metrika] Error tracking add to cart:', error);
    }
  }
}
