
import { useMemo } from "react";
import { Product } from "@/types/product";

export const useProductStatistics = (products: Product[]) => {
  // Calculate counts for stock status using stockQuantity for accuracy
  const inStockCount = useMemo(() => {
    return products.filter(p => {
      if (p.stockQuantity !== undefined) {
        return p.stockQuantity > 0;
      }
      return p.inStock;
    }).length;
  }, [products]);
  
  const outOfStockCount = useMemo(() => {
    return products.filter(p => {
      if (p.stockQuantity !== undefined) {
        return p.stockQuantity <= 0;
      }
      return !p.inStock;
    }).length;
  }, [products]);
  
  return {
    inStockCount,
    outOfStockCount
  };
};
