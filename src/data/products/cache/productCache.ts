import { fetchProductsFromPostgres } from "../postgres/productApi";
import { Product } from "@/types/product";

// Кэш продуктов
let productsCache: Product[] = [];
let lastCacheUpdate = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 минут

/**
 * Получает продукты из кэша
 */
export const getProductsCache = (): Product[] => {
  return productsCache;
};

/**
 * Обновляет кэш продуктов, если прошло достаточно времени или принудительно
 */
export const refreshCacheIfNeeded = async (force = false): Promise<void> => {
  const now = Date.now();
  const shouldRefresh = force || (now - lastCacheUpdate) > CACHE_DURATION;
  
  if (!shouldRefresh && productsCache.length > 0) {
    return;
  }
  
  try {
    const products = await fetchProductsFromPostgres();
    productsCache = products.map(product => ({
      ...product,
      isHit: product.isHit || false,
      isBestseller: product.isBestseller || false,
      isNew: product.isNew || false
    }));
    lastCacheUpdate = now;
  } catch (error) {
    throw error;
  }
};

/**
 * Очищает кэш продуктов
 */
export const invalidateCache = (): void => {
  productsCache = [];
  lastCacheUpdate = 0;
};