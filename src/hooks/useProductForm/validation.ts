
import { Product } from "@/types/product";
import { toast } from "sonner";

export const validateForm = (
  formData: Partial<Product>, 
  newCategory: string,
  setActiveTab: (tab: string) => void
): boolean => {
  // Validate required fields
  if (!formData.title) {
    toast.error("Необходимо указать название товара");
    setActiveTab("general");
    return false;
  }
  
  if (!formData.category && !newCategory) {
    toast.error("Необходимо указать категорию товара");
    setActiveTab("general");
    return false;
  }
  
  if (!formData.price || formData.price <= 0) {
    toast.error("Необходимо указать корректную цену товара");
    setActiveTab("general");
    return false;
  }
  
  // Check for duplicate article numbers in color variants
  if (formData.colorVariants && formData.colorVariants.length > 0) {
    const articleNumbers = formData.colorVariants
      .map(v => v.articleNumber)
      .filter(a => a && a.trim() !== "");
    
    const uniqueArticleNumbers = new Set(articleNumbers);
    
    if (articleNumbers.length !== uniqueArticleNumbers.size) {
      toast.error("Найдены дублирующиеся артикулы в цветовых вариантах");
      setActiveTab("colors");
      return false;
    }
  }
  
  return true;
};

export const prepareFinalProduct = (
  formData: Partial<Product>,
  showNewCategoryInput: boolean,
  newCategory: string
): Partial<Product> => {
  // Prepare the final product with all necessary data
  const finalProduct = {
    ...formData,
    category: showNewCategoryInput && newCategory ? newCategory : formData.category
  };
  
  // Set inStock status based on stockQuantity
  finalProduct.inStock = finalProduct.stockQuantity !== undefined && finalProduct.stockQuantity > 0;
  
  return finalProduct;
};
