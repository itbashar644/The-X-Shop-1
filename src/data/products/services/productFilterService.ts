import { Product } from '@/types/product';
import { getProductsCache, refreshCacheIfNeeded } from '../cache/productCache';

const fallbackProducts: Product[] = [
  {
    id: "1",
    title: "Умные часы DT-8 Mini",
    description: "Современные умные часы с множеством функций",
    price: 2999,
    originalPrice: 3999,
    category: "Электроника",
    imageUrl: "/placeholder.svg",
    inStock: true,
    stockQuantity: 10,
    rating: 4.5,
    reviewsCount: 128,
    archived: false,
    colorVariants: [],
    popularity: 85,
    createdAt: new Date(Date.now() - 86400000 * 7).toISOString(),
    countryOfOrigin: "Китай",
    specifications: {
      "Диагональ экрана": "1.4 дюйма",
      "Время работы": "7 дней"
    }
  },
  {
    id: "2", 
    title: "Детский планшет Android",
    description: "Безопасный планшет для детей с родительским контролем",
    price: 4999,
    originalPrice: 5999,
    category: "Электроника",
    imageUrl: "/placeholder.svg",
    inStock: true,
    stockQuantity: 15,
    rating: 4.3,
    reviewsCount: 89,
    archived: false,
    colorVariants: [],
    popularity: 72,
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    countryOfOrigin: "Китай"
  },
  {
    id: "3",
    title: "Беспроводные наушники Air Pro",
    description: "Наушники с активным шумоподавлением",
    price: 1999,
    originalPrice: 2499,
    category: "Электроника", 
    imageUrl: "/placeholder.svg",
    inStock: true,
    stockQuantity: 25,
    rating: 4.7,
    reviewsCount: 256,
    archived: false,
    colorVariants: [],
    popularity: 93,
    createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    countryOfOrigin: "Китай"
  },
  {
    id: "4",
    title: "Домашний проектор X9",
    description: "Мини проектор для просмотра фильмов дома",
    price: 8999,
    originalPrice: 10999,
    category: "Электроника",
    imageUrl: "/placeholder.svg", 
    inStock: true,
    stockQuantity: 8,
    rating: 4.6,
    reviewsCount: 67,
    archived: false,
    colorVariants: [],
    popularity: 68,
    createdAt: new Date(Date.now() - 86400000 * 14).toISOString(),
    countryOfOrigin: "Китай"
  },
  {
    id: "5",
    title: "Детский фотоаппарат Q5",
    description: "Фотоаппарат для мгновенной печати",
    price: 3999,
    originalPrice: 4999,
    category: "Электроника",
    imageUrl: "/placeholder.svg",
    inStock: true,
    stockQuantity: 12,
    rating: 4.4,
    reviewsCount: 45,
    archived: false,
    colorVariants: [],
    popularity: 59,
    createdAt: new Date(Date.now() - 86400000 * 30).toISOString(),
    countryOfOrigin: "Китай"
  }
];

export const getAllProductsCached = async (): Promise<Product[]> => {
  try {
    await refreshCacheIfNeeded();
    const products = getProductsCache();
    return products.length > 0 ? products : fallbackProducts;
  } catch (error) {
    console.error("Error loading products from cache, using fallback:", error);
    return fallbackProducts;
  }
};

export const getProductsByCategory = async (
  category: string
): Promise<Product[]> => {
  try {
    await refreshCacheIfNeeded();
    const products = getProductsCache();
    const filteredProducts = products.filter(product => 
      product.category === category && !product.archived
    );
    return filteredProducts.length > 0 ? filteredProducts : fallbackProducts.filter(p => p.category === category);
  } catch (error) {
    console.error("Error loading products by category, using fallback:", error);
    return fallbackProducts.filter(p => p.category === category);
  }
};

export const getActiveProducts = async (): Promise<Product[]> => {
  try {
    await refreshCacheIfNeeded();
    const products = getProductsCache();
    const activeProducts = products.filter(product => !product.archived);
    return activeProducts.length > 0 ? activeProducts : fallbackProducts;
  } catch (error) {
    console.error("Error loading active products, using fallback:", error);
    return fallbackProducts;
  }
};

export const getBestsellers = async (limit = 5): Promise<Product[]> => {
  try {
    await refreshCacheIfNeeded();
    const products = getProductsCache();
    const source = products.length > 0 ? products : fallbackProducts;
    
    return [...source]
      .sort((a, b) => (b.popularity || 0) - (a.popularity || 0))
      .slice(0, limit);
  } catch (error) {
    console.error("Error loading bestsellers, using fallback:", error);
    return fallbackProducts
      .sort((a, b) => (b.popularity || 0) - (a.popularity || 0))
      .slice(0, limit);
  }
};

export const getNewProducts = async (limit = 5): Promise<Product[]> => {
  try {
    await refreshCacheIfNeeded();
    const products = getProductsCache();
    const source = products.length > 0 ? products : fallbackProducts;
    
    return [...source]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, limit);
  } catch (error) {
    console.error("Error loading new products, using fallback:", error);
    return fallbackProducts
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, limit);
  }
};

export const getRelatedProducts = async (productId: string, limit = 4): Promise<Product[]> => {
  try {
    const product = await import("../product/productServiceSpecialized").then(module => module.getProductById(productId));
    
    if (!product) {
      return fallbackProducts.slice(0, limit);
    }
    
    const categoryProducts = (await getProductsByCategory(product.category))
      .filter(p => p.id !== productId && !p.archived);
    
    return categoryProducts.sort(() => 0.5 - Math.random()).slice(0, limit);
  } catch (error) {
    console.error("Error getting related products, using fallback:", error);
    return fallbackProducts.slice(0, limit);
  }
};

export const getPopularSearches = async (limit = 5): Promise<string[]> => {
  try {
    const searches = localStorage.getItem('popular_searches');
    if (searches) {
      return JSON.parse(searches).slice(0, limit);
    }
    return [];
  } catch (error) {
    console.error("Error loading popular searches:", error);
    return [];
  }
};

export const filterProductsByPrice = (products: Product[], min: number, max: number): Product[] => {
  return products.filter(product => 
    product.price >= min && product.price <= max
  );
};