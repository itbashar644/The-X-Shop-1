import React, { useMemo, useState } from "react";
import { Product } from "@/types/product";
import ProductCard from "./ProductCard";
import { Button } from "../ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";

interface ProductGridProps {
  products: Product[];
  title?: string;
  limit?: number;
  showExpand?: boolean;
  columnsClass?: string;
  rows?: number; // default 2
  itemsPerRow?: number; // default 5
  className?: string;
}

const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  title,
  limit,
  showExpand = false,
  columnsClass,
  rows = 2,
  itemsPerRow = 5,
  className = "",
}) => {
  const [expanded, setExpanded] = useState(false);

  const displayLimit = useMemo(() => {
    if (!limit || expanded) return products.length;
    return Math.min(limit, rows * itemsPerRow);
  }, [products, limit, expanded, rows, itemsPerRow]);

  const displayProducts = useMemo(() => {
    if (expanded || !limit) {
      return products;
    }
    return products.slice(0, displayLimit);
  }, [products, limit, expanded, displayLimit]);

  if (products.length === 0) {
    return (
      <div className="py-12 text-center">
        <h2 className="text-2xl font-bold mb-2">Нет товаров</h2>
        <p className="text-muted-foreground">Попробуйте изменить параметры поиска</p>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {title && <h2 className="text-2xl font-bold mb-6">{title}</h2>}

      <div
        className={`grid ${
          columnsClass ?? `grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-${itemsPerRow}`
        } gap-4`}
      >
        {displayProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {showExpand && limit && products.length > limit && (
        <div className="text-center mt-8">
          <Button
            variant="outline"
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-1"
          >
            {expanded ? (
              <>
                Показать меньше <ChevronUp className="h-4 w-4" />
              </>
            ) : (
              <>
                Показать все {products.length} товаров <ChevronDown className="h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
};

export default ProductGrid;
