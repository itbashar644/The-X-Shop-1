
import React from "react";
import { X, Tag, Palette } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface CatalogActiveFiltersProps {
  categoryParam: string | null;
  colorParam: string | null;
  searchTerm: string;
  activeFiltersCount: number;
  handleCategoryClick: (categoryId: string | null) => void;
  handleColorFilter: (color: string | null) => void;
  handleClearAllFilters: () => void;
}

const CatalogActiveFilters: React.FC<CatalogActiveFiltersProps> = ({
  categoryParam,
  colorParam,
  searchTerm,
  activeFiltersCount,
  handleCategoryClick,
  handleColorFilter,
  handleClearAllFilters
}) => {
  if (activeFiltersCount === 0) return null;
  
  return (
    <div className="mb-6">
      <div className="text-sm mb-2 text-muted-foreground">Активные фильтры:</div>
      <div className="flex flex-wrap gap-2">
        {categoryParam && (
          <Badge variant="secondary" className="flex gap-1 items-center">
            <Tag className="h-3 w-3" />
            {categoryParam}
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-4 w-4 p-0 ml-1" 
              onClick={() => handleCategoryClick(null)}
            >
              <X className="h-3 w-3" />
              <span className="sr-only">Remove</span>
            </Button>
          </Badge>
        )}
        
        {colorParam && (
          <Badge variant="secondary" className="flex gap-1 items-center">
            <Palette className="h-3 w-3" />
            {colorParam}
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-4 w-4 p-0 ml-1" 
              onClick={() => handleColorFilter(null)}
            >
              <X className="h-3 w-3" />
              <span className="sr-only">Remove</span>
            </Button>
          </Badge>
        )}
        
        {searchTerm && (
          <Badge variant="secondary" className="flex gap-1 items-center">
            Поиск: {searchTerm}
          </Badge>
        )}
        
        <Button 
          variant="outline" 
          size="sm" 
          className="h-7 text-xs" 
          onClick={handleClearAllFilters}
        >
          Сбросить все
        </Button>
      </div>
    </div>
  );
};

export default CatalogActiveFilters;
