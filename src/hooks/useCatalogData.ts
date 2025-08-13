
import { useState, useEffect } from "react";
import { getProductsByCategory, getAllCategories, getCategoryObjects, getActiveProducts, Category } from "@/data/products";
import { Product } from "@/types/product";
 

export const useCatalogData = (categoryParam: string | null) => {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [availableCategories, setAvailableCategories] = useState<string[]>([]);
  const [categoryObjects, setCategoryObjects] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Загружаем данные при монтировании компонента или изменении категории
  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        
        // Загружаем категории и продукты
        const [categoriesData, categoryObjsData, productsData] = await Promise.all([
          getAllCategories(),
          getCategoryObjects(),
          categoryParam ? getProductsByCategory(categoryParam) : getActiveProducts()
        ]);
        
        setAvailableCategories(categoriesData);
        setCategoryObjects(categoryObjsData);
        setAllProducts(productsData);
      } catch (error) {
        console.error("Ошибка при загрузке данных:", error);
      } finally {
        setLoading(false);
      }
    }
    
    loadData();
  }, [categoryParam]);

  return {
    allProducts,
    availableCategories,
    categoryObjects,
    loading
  };
};
