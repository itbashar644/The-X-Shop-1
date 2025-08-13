
import { useEffect, useState } from "react";
import { getBestsellers, getNewProducts, getAllCategories, getCategoryObjects, Category } from "@/data/products";
import { Product } from "@/types/product";
 

export const useHomeData = () => {
  const [bestsellers, setBestsellers] = useState<Product[]>([]);
  const [newProducts, setNewProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [categoryObjects, setCategoryObjects] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        
        const [bestSellersData, newProductsData, categoriesData, categoryObjectsData] = await Promise.all([
          getBestsellers(),
          getNewProducts(),
          getAllCategories(),
          getCategoryObjects()
        ]);
        
        setBestsellers(bestSellersData);
        setNewProducts(newProductsData);
        setCategories(categoriesData);
        setCategoryObjects(categoryObjectsData);
      } catch (error) {
        console.error("Ошибка при загрузке данных:", error);
      } finally {
        setLoading(false);
      }
    }
    
    loadData();
  }, []);

  return {
    bestsellers,
    newProducts,
    categories,
    categoryObjects,
    loading
  };
};
