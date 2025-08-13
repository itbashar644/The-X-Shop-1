
import React from "react";
import { Product } from "@/types/product";

interface CatalogProductsInfoProps {
  filteredProducts: Product[];
  inStockCount: number;
  outOfStockCount: number;
}

const CatalogProductsInfo: React.FC<CatalogProductsInfoProps> = ({
  filteredProducts
}) => {
  return (
    <div className="flex items-center gap-4 mb-4">
      <div className="text-sm">
        <span className="font-medium">Всего товаров:</span> {filteredProducts.length}
      </div>
    </div>
  );
};

export default CatalogProductsInfo;
