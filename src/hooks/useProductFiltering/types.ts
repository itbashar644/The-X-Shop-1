
import { Product } from "@/types/product";

export interface UseProductFilteringProps {
  allProducts: Product[];
  searchTerm: string;
  priceRange: { min: number; max: number };
  inStockOnly: boolean;  // Keeping for backward compatibility
  sortBy: string;
  loading: boolean;
  showColorVariants: boolean;  // Keeping for backward compatibility
  colorParam: string | null;
}

export interface FilteringResult {
  filteredProducts: Product[];
  availableColors: string[];
  inStockCount: number;
  outOfStockCount: number;
}
