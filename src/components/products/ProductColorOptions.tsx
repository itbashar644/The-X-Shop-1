import React from 'react';
import { Product, ColorVariant } from '@/types/product';
import { cn } from "@/lib/Image-utils";

interface ProductColorOptionsProps {
  product: Product;
  selectedColor?: string;
  onColorSelect: (colorName: string, variant?: ColorVariant) => void;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const ProductColorOptions: React.FC<ProductColorOptionsProps> = ({
  product,
  selectedColor,
  onColorSelect,
  className = '',
  size = 'md'
}) => {
  const colorVariants = product.colorVariants || [];
  const colors = product.colors || [];

  if (colorVariants.length === 0 && colors.length === 0) {
    return null;
  }

  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-10 h-10'
  };

  return (
    <div className={cn("space-y-2", className)}>
      <span className="text-xs text-gray-500">Цвет:</span>
      
      <div className="flex flex-wrap gap-2">
        {colorVariants.length > 0 ? (
          colorVariants.map((variant) => {
            const isSelected = selectedColor === variant.color;
            const isOutOfStock = variant.stockQuantity === 0;

            return (
              <button
                key={variant.color}
                onClick={() => !isOutOfStock && onColorSelect(variant.color, variant)}
                className={cn(
                  "rounded-full border-2 transition-all relative",
                  sizeClasses[size],
                  isSelected 
                    ? 'border-primary scale-110' 
                    : 'border-transparent hover:border-gray-300',
                  isOutOfStock && 'opacity-50 cursor-not-allowed'
                )}
                style={{ 
                  backgroundColor: variant.colorCode || '#f0f0f0',
                }}
                aria-label={`Цвет ${variant.color}`}
                title={`${variant.color}${isOutOfStock ? ' (Нет в наличии)' : ''}`}
                disabled={isOutOfStock}
              >
                {isOutOfStock && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-full h-px bg-red-500 rotate-45 transform origin-center" />
                  </div>
                )}
              </button>
            );
          })
        ) : (
          colors.map((color) => (
            <button
              key={color}
              onClick={() => onColorSelect(color)}
              className={cn(
                "rounded-full border-2 transition-all",
                sizeClasses[size],
                selectedColor === color 
                  ? 'border-primary scale-110' 
                  : 'border-transparent hover:border-gray-300'
              )}
              style={{ backgroundColor: '#f0f0f0' }}
              aria-label={`Цвет ${color}`}
              title={color}
            >
              <span className="text-xs">{color.charAt(0)}</span>
            </button>
          ))
        )}
      </div>
    </div>
  );
};

export default ProductColorOptions;