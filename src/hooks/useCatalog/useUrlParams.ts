
import { useState, useCallback } from "react";
import { URLSearchParamsInit } from "react-router-dom";

interface UseUrlParamsResult {
  categoryParam: string | null;
  searchParam: string | null;
  colorParam: string | null;
  priceRange: { min: number; max: number };
  setPriceRange: React.Dispatch<React.SetStateAction<{ min: number; max: number }>>;
  updatePriceInUrl: () => void;
}

export const useUrlParams = (
  searchParams: URLSearchParams, 
  setSearchParams: (nextInit: URLSearchParamsInit) => void, 
  maxAllowedPrice: number
): UseUrlParamsResult => {
  console.log(maxAllowedPrice)
  const categoryParam = searchParams.get("category");
  const searchParam = searchParams.get("search");
  const colorParam = searchParams.get("color");
  
  // Get price range from URL parameters or use defaults
  const minPriceParam = searchParams.get("minPrice");
  const maxPriceParam = searchParams.get("maxPrice");
  
  const [priceRange, setPriceRange] = useState<{ min: number; max: number }>({
    min: minPriceParam ? parseInt(minPriceParam, 10) : 0,
    max: maxPriceParam ? parseInt(maxPriceParam, 10) : maxAllowedPrice,
  });
  
  // Update URL when price range changes
  const updatePriceInUrl = useCallback(() => {
    const minPriceChanged = priceRange.min > 0;
    const maxPriceChanged = priceRange.max !== maxAllowedPrice;
    
    if (minPriceChanged) {
      searchParams.set("minPrice", priceRange.min.toString());
    } else {
      searchParams.delete("minPrice");
    }
    
    if (maxPriceChanged) {
      searchParams.set("maxPrice", priceRange.max.toString());
    } else {
      searchParams.delete("maxPrice");
    }
    
    // Only update URL if price actually changed to avoid unnecessary history entries
    if (minPriceChanged || maxPriceChanged) {
      // Fixed: Pass searchParams as a single object without the replace option
      // The newer version of react-router-dom expects only one argument
      setSearchParams(searchParams);
    }
  }, [priceRange, searchParams, setSearchParams]);
  
  return {
    categoryParam,
    searchParam,
    colorParam,
    priceRange,
    setPriceRange,
    updatePriceInUrl
  };
};
