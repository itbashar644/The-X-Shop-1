// Export from productData with the original name
export * from "./productData";

// Импортируем addCategory, updateCategoryImage, removeCategory, updateProductsCategory и getProductsByCategory из categoryData
import { addCategory, updateCategoryImage, removeCategory, updateProductsCategory, getProductsByCategory as getProductsByCategoryFromCategoryData } from './categoryData';
export { addCategory, updateCategoryImage, removeCategory, updateProductsCategory };

// Определяем тип Category локально, так как SQLite удален
export interface Category {
  id: string;
  name: string;
  description?: string;
  imageUrl?: string;
  productCount?: number;
}

import { Product } from '@/types/product';
import { fetchProductsFromPostgres, getProductsByCategoryFromPostgres } from './postgres/productApi';
import { fetchCategoriesFromPostgres } from './postgres/categoryApi';

// Экспортируем getCategoryProducts как алиас для getProductsByCategoryFromCategoryData после всех импортов
export const getCategoryProducts = getProductsByCategoryFromCategoryData;

/**
 * Универсальная функция для получения всех продуктов
 */
export const getActiveProducts = async (): Promise<Product[]> => {
  console.log('📦 getActiveProducts: Loading from PostgreSQL');
  try {
    const products = await fetchProductsFromPostgres();
    console.log(`✅ getActiveProducts: PostgreSQL returned ${products.length} products`);
    return products;
  } catch (error) {
    console.error('❌ getActiveProducts: Error with PostgreSQL:', error);
    throw new Error('Не удалось загрузить товары из PostgreSQL');
  }
};

/**
 * Универсальная функция для получения продуктов по категории
 */
export const getProductsByCategory = async (category: string): Promise<Product[]> => {
  console.log('📂 getProductsByCategory: Loading from PostgreSQL for category:', category);
  try {
    const products = await getProductsByCategoryFromPostgres(category);
    console.log(`✅ getProductsByCategory: PostgreSQL returned ${products.length} products for category "${category}"`);
    return products;
  } catch (error) {
    console.error('❌ getProductsByCategory: Error with PostgreSQL:', error);
    throw new Error(`Не удалось загрузить товары категории "${category}" из PostgreSQL`);
  }
};

/**
 * Универсальная функция для получения всех категорий
 */
export const getAllCategories = async (): Promise<string[]> => {
  console.log('📂 getAllCategories: Loading from PostgreSQL');
  try {
    const categories = await fetchCategoriesFromPostgres();
    const categoryNames = categories.map(cat => cat.name);
    console.log(`✅ getAllCategories: PostgreSQL returned ${categoryNames.length} categories`);
    return categoryNames.length > 0 ? categoryNames : ["Электроника", "Игрушки", "Для дома"];
  } catch (error) {
    console.error('❌ getAllCategories: Error with PostgreSQL, using fallback:', error);
    return ["Электроника", "Игрушки", "Для дома"];
  }
};

/**
 * Универсальная функция для получения объектов категорий
 */
export const getCategoryObjects = async (): Promise<Category[]> => {
  console.log('📂 getCategoryObjects: Loading from PostgreSQL');
  try {
    const categories = await fetchCategoriesFromPostgres();
    console.log(`✅ getCategoryObjects: PostgreSQL returned ${categories.length} category objects`);
    if (categories.length > 0) {
      return categories;
    } else {
      // Fallback категории
      return [
        {
          id: "electronics",
          name: "Электроника",
          description: "Современная электроника для дома и офиса",
          imageUrl: "/placeholder.svg",
          productCount: 0
        },
        {
          id: "toys", 
          name: "Игрушки",
          description: "Развивающие игрушки для детей",
          imageUrl: "/placeholder.svg",
          productCount: 0
        },
        {
          id: "home",
          name: "Для дома", 
          description: "Товары для дома и быта",
          imageUrl: "/placeholder.svg",
          productCount: 0
        }
      ];
    }
  } catch (error) {
    console.error('❌ getCategoryObjects: Error with PostgreSQL, using fallback:', error);
    // Fallback категории
    return [
      {
        id: "electronics",
        name: "Электроника",
        description: "Современная электроника для дома и офиса",
        imageUrl: "/placeholder.svg",
        productCount: 0
      },
      {
        id: "toys",
        name: "Игрушки", 
        description: "Развивающие игрушки для детей",
        imageUrl: "/placeholder.svg",
        productCount: 0
      },
      {
        id: "home",
        name: "Для дома",
        description: "Товары для дома и быта", 
        imageUrl: "/placeholder.svg",
        productCount: 0
      }
    ];
  }
};
