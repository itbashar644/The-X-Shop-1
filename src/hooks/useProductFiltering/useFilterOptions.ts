
import { useMemo } from "react";
import { Product } from "@/types/product";

export const useFilterOptions = (products: Product[]) => {
  // Get all available colors from products
  const availableColors = useMemo(() => {
    if (!products.length) return [];
    
    const colorSet = new Set<string>();
    
    products.forEach(product => {
      if (product.colorVariants && product.colorVariants.length > 0) {
        product.colorVariants.forEach(variant => {
          colorSet.add(variant.color);
        });
      }
    });
    
    return Array.from(colorSet).sort();
  }, [products]);
  
  return {
    availableColors
  };
};
