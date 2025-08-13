
import { useState, useEffect } from "react";

interface UseActiveFiltersProps {
  categoryParam: string | null;
  colorParam: string | null;
  priceRange: { min: number; max: number };
  searchTerm: string;
}

interface UseActiveFiltersResult {
  activeFiltersCount: number;
}

export const useActiveFilters = ({
  categoryParam,
  colorParam,
  priceRange,
  searchTerm
}: UseActiveFiltersProps): UseActiveFiltersResult => {
  const [activeFiltersCount, setActiveFiltersCount] = useState(0);
  
  // Calculate number of active filters
  useEffect(() => {
    let count = 0;
    
    if (categoryParam) count++;
    if (colorParam) count++;
    if (priceRange.min > 0 || priceRange.max < 123) count++;
    if (searchTerm) count++;
    
    setActiveFiltersCount(count);
  }, [categoryParam, colorParam, priceRange, searchTerm]);
  
  return {
    activeFiltersCount
  };
};
