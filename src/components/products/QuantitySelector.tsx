import React from 'react';
import { Button } from '@/components/ui/button';
import { Product, ColorVariant } from '@/types/product';

interface QuantitySelectorProps {
  quantity: number;
  onChange: (value: number) => void;
  product: Product;
  selectedColorVariant?: ColorVariant;
}

const QuantitySelector: React.FC<QuantitySelectorProps> = ({
  quantity,
  onChange,
  product,
  selectedColorVariant,
}) => {
  const maxStock = selectedColorVariant?.stockQuantity ?? product.stockQuantity ?? Infinity;

  const handleQuantityChange = (value: number) => {
    if (value < 1) return;
    if (value > maxStock) {
      onChange(maxStock);
    } else {
      onChange(value);
    }
  };

  return (
    <div>
      <h3 className="font-medium mb-2">Количество</h3>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={() => handleQuantityChange(quantity - 1)}
          disabled={quantity <= 1}
        >
          -
        </Button>
        <span className="w-12 text-center">{quantity}</span>
        <Button
          variant="outline"
          size="icon"
          onClick={() => handleQuantityChange(quantity + 1)}
          disabled={quantity >= maxStock}
        >
          +
        </Button>
      </div>
    </div>
  );
};

export default QuantitySelector;
