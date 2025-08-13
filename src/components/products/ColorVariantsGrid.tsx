
import React from 'react';
import { Product } from '@/types/product';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/Image-utils';
import { Palette } from 'lucide-react';

interface ColorVariantsGridProps {
  currentProduct: Product;
  relatedProducts: Product[];
}

const ColorVariantsGrid: React.FC<ColorVariantsGridProps> = ({ 
  currentProduct, 
  relatedProducts 
}) => {
  if (!relatedProducts || relatedProducts.length === 0) {
    return null;
  }

  // Get all products including current one for display
  const allProducts = [currentProduct, ...relatedProducts.filter(p => p.id !== currentProduct.id)];
  
  // Helper function to get color name from a product
  const getProductColor = (product: Product): string => {
    if (product.colorVariants && product.colorVariants.length > 0) {
      return product.colorVariants[0].color;
    }
    return 'Неизвестный';
  };

  return (
    <div className="mb-6">
      <h3 className="text-lg font-medium mb-3 flex items-center gap-2">
        <Palette className="h-5 w-5" />
        Доступные цвета
      </h3>
      
      <div className="flex flex-wrap gap-3">
        {allProducts.map(product => {
          const isCurrentProduct = product.id === currentProduct.id;
          const colorName = getProductColor(product);
          const imageUrl = product.colorVariants?.[0]?.imageUrl || product.imageUrl;
          
          return (
            <Link 
              key={product.id} 
              to={isCurrentProduct ? '#' : `/product/${product.id}`}
              className={cn(
                "relative border rounded-md overflow-hidden transition-all group",
                isCurrentProduct 
                  ? "border-primary ring-2 ring-primary ring-offset-2 cursor-default" 
                  : "hover:border-primary hover:shadow-md"
              )}
              aria-current={isCurrentProduct ? 'page' : undefined}
            >
              <div className="w-16 h-16 relative">
                <img 
                  src={imageUrl} 
                  alt={colorName} 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "/placeholder.svg";
                  }}
                />
                <div className={cn(
                  "absolute inset-0 flex items-center justify-center bg-white/60 backdrop-blur-sm opacity-0 transition-opacity",
                  !isCurrentProduct && "group-hover:opacity-100"
                )}>
                  {!isCurrentProduct && <span className="text-xs font-medium">Выбрать</span>}
                </div>
              </div>
              <div className="text-xs text-center py-1 bg-muted/30 truncate px-1">
                {colorName}
              </div>
              {isCurrentProduct && (
                <span className="absolute top-1 right-1 w-3 h-3 bg-primary rounded-full"></span>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default ColorVariantsGrid;
