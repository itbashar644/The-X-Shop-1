
import { useState, useEffect, useMemo } from "react";
import { Product } from "@/types/product";
import { UseProductFilteringProps, FilteringResult } from "./types";
import { transformProductsForColorDisplay, sortProducts } from "./helpers";
import { useFilterOptions } from "./useFilterOptions";
import { useProductStatistics } from "./useProductStatistics";

/**
 * Hook for filtering and sorting products based on various criteria
 */
export const useProductFiltering = ({
  allProducts,
  searchTerm,
  priceRange,
  inStockOnly,
  sortBy,
  loading,
  showColorVariants,
  colorParam
}: UseProductFilteringProps): FilteringResult => {
  // Use memoized transformations for better performance
  const transformedProducts = useMemo(() => {
    if (loading || !allProducts.length) return [];
    
    // Transform products for color display if needed
    return showColorVariants ? transformProductsForColorDisplay(allProducts) : [...allProducts];
  }, [allProducts, loading, showColorVariants]);
  
  // Apply filters with useMemo for better performance
  const filteredProducts = useMemo(() => {
    if (loading || !transformedProducts.length) return [];
    
    let result = transformedProducts;
    
    // Filter by color if color parameter is set
    if (colorParam) {
      result = result.filter(product => {
        if (product.colorVariants && product.colorVariants.length > 0) {
          return product.colorVariants.some(v => 
            v.color.toLowerCase() === colorParam.toLowerCase()
          );
        }
        return false;
      });
    }
    
    // Filter by search term
    if (searchTerm) {
      const searchTermLower = searchTerm.toLowerCase();
      result = result.filter(p => 
        p.title.toLowerCase().includes(searchTermLower) ||
        p.description.toLowerCase().includes(searchTermLower) ||
        p.category.toLowerCase().includes(searchTermLower)
      );
    }
    
    // Filter by price range
    result = result.filter(p => {
      const price = p.discountPrice !== undefined ? p.discountPrice : p.price;
      return price >= priceRange.min && price <= priceRange.max;
    });
    
    // Filter by stock status if required
    if (inStockOnly) {
      result = result.filter(p => p.inStock);
    }
    
    // Apply sorting
    return sortProducts(result, sortBy);
  }, [
    transformedProducts, 
    colorParam, 
    searchTerm, 
    priceRange, 
    inStockOnly, 
    sortBy, 
    loading
  ]);
  
  // Extract smaller hooks for better organization
  const { availableColors } = useFilterOptions(allProducts);
  const { inStockCount, outOfStockCount } = useProductStatistics(filteredProducts);

  return {
    filteredProducts,
    availableColors,
    inStockCount,
    outOfStockCount
  };
};

// Re-export types
export * from "./types";
