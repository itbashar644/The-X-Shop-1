import React from "react";
import { Button } from "@/components/ui/button";
import { Category } from "@/data/products/categoryData";
import CategoryFilter from "./filters/CategoryFilter";
import ColorFilter from "./filters/ColorFilter";
import PriceFilter from "./filters/PriceFilter";

interface CatalogFiltersProps {
  availableCategories: string[];
  categoryParam: string | null;
  colorParam: string | null;
  priceRange: { min: number; max: number };
  loading: boolean;
  showMobileFilters: boolean;
  activeFiltersCount: number;
  availableColors: string[];
  handleCategoryClick: (categoryId: string | null) => void;
  handleColorFilter: (color: string | null) => void;
  handlePriceChange: (type: "min" | "max", value: string) => void;
  handleClearAllFilters: () => void;
  findCategoryByName: (name: string) => Category;
}

const CatalogFilters: React.FC<CatalogFiltersProps> = ({
  availableCategories,
  categoryParam,
  colorParam,
  priceRange,
  loading,
  showMobileFilters,
  activeFiltersCount,
  availableColors,
  handleCategoryClick,
  handleColorFilter,
  handlePriceChange,
  handleClearAllFilters,
  findCategoryByName,
}) => {
  const [localPriceRange, setLocalPriceRange] = React.useState(priceRange);
  const [isPriceValid, setIsPriceValid] = React.useState(true);

  React.useEffect(() => {
    setLocalPriceRange(priceRange);
  }, [priceRange]);

  const handleLocalPriceChange = (type: "min" | "max", value: string) => {
    const numValue = parseInt(value) || 0;
    const newRange = { ...localPriceRange, [type]: numValue };
    setLocalPriceRange(newRange);
    
    const isValid = newRange.min <= newRange.max;
    setIsPriceValid(isValid);
    
    if (isValid) {
      handlePriceChange(type, value);
    }
  };

  const handleSliderChange = (values: number[]) => {
    const newRange = { min: values[0], max: values[1] };
    setLocalPriceRange(newRange);
    setIsPriceValid(true);
    handlePriceChange("min", values[0].toString());
    handlePriceChange("max", values[1].toString());
  };

  return (
    <div className={`space-y-6 ${showMobileFilters ? 'block' : 'hidden'} md:block`}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-bold text-lg">Фильтры</h2>
        {activeFiltersCount > 0 && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleClearAllFilters}
            className="text-destructive hover:text-destructive/90"
          >
            Сбросить все
          </Button>
        )}
      </div>
      
      <div>
        <h3 className="font-semibold mb-4">Категории</h3>
        <CategoryFilter 
          availableCategories={availableCategories}
          categoryParam={categoryParam}
          loading={loading}
          handleCategoryClick={handleCategoryClick}
          findCategoryByName={findCategoryByName}
        />
      </div>

      <ColorFilter 
        availableColors={availableColors}
        colorParam={colorParam}
        handleColorFilter={handleColorFilter}
      />

      <PriceFilter 
        priceRange={localPriceRange}
        handlePriceChange={handleLocalPriceChange}
        handleSliderChange={handleSliderChange}
        loading={loading}
        isPriceValid={isPriceValid}
      />
    </div>
  );
};

export default CatalogFilters;