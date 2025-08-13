
import React from "react";
import { Product } from "@/types/product";

import GridCatalog from "@/components/products/GridCatalog";

import CatalogActiveFilters from "./CatalogActiveFilters";
import CatalogHeader from "./CatalogHeader";
import CatalogProductsInfo from "./CatalogProductsInfo";
import { SearchForm } from "./SearchForm";

interface CatalogProductsSectionProps {
  categoryParam: string | null;
  searchTerm: string;
  colorParam: string | null;
  availableCategories: string[];
  loading: boolean;
  filteredProducts: Product[];
  inStockCount: number;
  outOfStockCount: number;
  activeFiltersCount: number;
  sortBy: string;
  handleSearchSubmit: (e: React.FormEvent) => void;
  handleSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setSortBy: (value: string) => void;
  handleCategoryClick: (categoryId: string | null) => void;
  handleColorFilter: (color: string | null) => void;
  handleClearAllFilters: () => void;
}

const CatalogProductsSection: React.FC<CatalogProductsSectionProps> = ({
  categoryParam,
  searchTerm,
  colorParam,
  availableCategories,
  loading,
  filteredProducts,
  inStockCount,
  outOfStockCount,
  activeFiltersCount,
  sortBy,
  handleSearchSubmit,
  handleSearchChange,
  setSortBy,
  handleCategoryClick,
  handleColorFilter,
  handleClearAllFilters
}) => {
  return (
    <div>
      {/* Header section */}
      <CatalogHeader
        categoryParam={categoryParam}
        searchTerm={searchTerm}
        colorParam={colorParam}
        availableCategories={availableCategories}
        sortBy={sortBy}
        setSortBy={setSortBy}
        loading={loading}
        handleSearchChange={handleSearchChange}
        handleSearchSubmit={handleSearchSubmit}
      />
      
      {/* Active filters display */}
      <CatalogActiveFilters
        categoryParam={categoryParam}
        colorParam={colorParam}
        searchTerm={searchTerm}
        activeFiltersCount={activeFiltersCount}
        handleCategoryClick={handleCategoryClick}
        handleColorFilter={handleColorFilter}
        handleClearAllFilters={handleClearAllFilters}
      />

      {/* Products count */}
      <CatalogProductsInfo 
        filteredProducts={filteredProducts}
        inStockCount={inStockCount}
        outOfStockCount={outOfStockCount}
      />

      {loading ? (
        // Loading placeholders
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4">
          {Array.from({length: 10}).map((_, i) => (
            <div key={i} className="h-[280px] bg-gray-200 animate-pulse rounded-lg"></div>
          ))}
        </div>
      ) : (
        // Product grid display
        <GridCatalog
          products={filteredProducts}
          showAsColorVariants={true}
          columnsClass="grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5"
        />
      )}
      
      {/* Empty state */}
      {!loading && filteredProducts.length === 0 && (
        <div className="py-8 text-center">
          <h2 className="text-xl font-semibold mb-2">Товары не найдены</h2>
          <p className="text-muted-foreground">
            Попробуйте изменить параметры фильтрации или поисковый запрос
          </p>
        </div>
      )}
    </div>
  );
};

export default CatalogProductsSection;
