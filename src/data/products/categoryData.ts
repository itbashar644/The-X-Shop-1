// Определяю интерфейс Category локально, чтобы избежать циклической зависимости
export interface Category {
  id: string;
  name: string;
  description?: string;
  imageUrl?: string;
  productCount?: number;
}

import { fetchCategoriesFromPostgres } from "./postgres/categoryApi";
import { getProductsByCategoryFromPostgres } from "./postgres/productApi";

// Хранение текущих категорий
let categories: Category[] = [];
let categoriesLoaded = false;

// Функция для получения всех уникальных категорий
export const getAllCategories = async (): Promise<string[]> => {
  // Всегда обновляем категории из PostgreSQL
  await loadCategoriesFromPostgres();
  
  // Возвращаем только имена категорий для совместимости с существующим кодом
  return categories.map(category => category.name);
};

// Функция для получения объектов категорий
export const getCategoryObjects = async (): Promise<Category[]> => {
  // Всегда обновляем категории из PostgreSQL
  await loadCategoriesFromPostgres();
  
  return [...categories];
};

// Функция для загрузки категорий из PostgreSQL
async function loadCategoriesFromPostgres(): Promise<void> {
  try {
    // Загружаем категории из PostgreSQL без учета локального кэша
    const postgresCategories = await fetchCategoriesFromPostgres();
   
    categories = postgresCategories;
    categoriesLoaded = true;
    
    console.log("Категории загружены из PostgreSQL:", categories);
  } catch (error) {
    console.error("Ошибка при загрузке категорий из PostgreSQL:", error);
    categories = [];
  }
}

// Функция для добавления новой категории
export const addCategory = async (categoryName: string, imageUrl: string = "/placeholder.svg"): Promise<void> => {
  // TODO: Реализовать добавление категории в PostgreSQL
  console.log("Добавление категории в PostgreSQL:", categoryName, imageUrl);
  
  // Перезагружаем категории из базы
  await loadCategoriesFromPostgres();
};

// Функция для обновления изображения категории
export const updateCategoryImage = async (categoryName: string, imageUrl: string): Promise<void> => {
  // TODO: Реализовать обновление изображения в PostgreSQL
  console.log("Обновление изображения категории в PostgreSQL:", categoryName, imageUrl);
  
  // Перезагружаем категории из базы
  await loadCategoriesFromPostgres();
};

// Функция для удаления категории
export const removeCategory = async (categoryName: string): Promise<boolean> => {
  // Проверяем, используется ли категория в продуктах
  const productsInCategory = await getProductsByCategory(categoryName);
  
  if (productsInCategory.length === 0) {
    // TODO: Реализовать удаление категории в PostgreSQL
    console.log("Удаление категории из PostgreSQL:", categoryName);
    
    // Перезагружаем категории из базы
    await loadCategoriesFromPostgres();
    return true;
  }
  
  return false; // Если категория используется
};

// Функция для обновления продуктов при удалении категории
export const updateProductsCategory = async (oldCategory: string, newCategory: string): Promise<void> => {
  // TODO: Реализовать обновление категории продуктов в PostgreSQL
  console.log("Обновление категории продуктов в PostgreSQL:", oldCategory, "->", newCategory);
  
  // Удаляем старую категорию после обновления продуктов
  await removeCategory(oldCategory);
};

// Функция для получения продуктов по категории
export const getProductsByCategory = async (category: string) => {
  return await getProductsByCategoryFromPostgres(category);
};

// Загружаем категории при импорте модуля
loadCategoriesFromPostgres();
