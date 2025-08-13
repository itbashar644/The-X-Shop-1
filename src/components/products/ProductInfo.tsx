
import React, { useState, useEffect } from 'react';
import { Product, ColorVariant } from "@/types/product";
import { formatPrice } from "@/lib/Image-utils";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useCart } from "@/context/CartContext";
import StockNotification from './StockNotification';
import AlternativeProducts from './AlternativeProducts';
import { trackAddToCart } from "@/utils/metrika";
import StockStatus from './StockStatus';

interface ProductInfoProps {
  product: Product;
  // Add the missing properties to match what's being passed in Product.tsx
  relatedColorProducts?: Product[];
  selectedColorVariant?: ColorVariant | null;
  onColorVariantSelect?: (variant: ColorVariant) => void;
}

const ProductInfo = ({ product, selectedColorVariant: propSelectedColorVariant = null, onColorVariantSelect }: ProductInfoProps) => {
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedColorVariant, setSelectedColorVariant] = useState<ColorVariant | null>(propSelectedColorVariant);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const { addItem } = useCart();

  useEffect(() => {
    // Reset selected color when product changes
    setSelectedColor(null);
    setSelectedColorVariant(propSelectedColorVariant);
  }, [product, propSelectedColorVariant]);

  useEffect(() => {
    // Update selected color variant when selected color changes
    if (selectedColor) {
      const variant = product.colorVariants?.find(v => v.color === selectedColor) || null;
      setSelectedColorVariant(variant);
      
      // Call the parent's handler if provided
      if (variant && onColorVariantSelect) {
        onColorVariantSelect(variant);
      }
    } else {
      setSelectedColorVariant(null);
    }
  }, [selectedColor, product.colorVariants, onColorVariantSelect]);

  const handleAddToCart = async () => {
    setIsAddingToCart(true);
    try {
     await addItem({
        product,
        quantity,
        color: selectedColor || undefined,
        selectedColorVariant: selectedColorVariant || undefined
      });

      // Track add to cart event
      trackAddToCart({
        id: product.id,
        name: product.title,
        price: selectedColorVariant ?
          (selectedColorVariant.price) :
          (product.discountPrice || product.price),
        category: product.category
      }, quantity);

      toast("Товар добавлен в корзину", {
        description: `${product.title} (${quantity} шт.)`,
      });
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast("Ошибка", {
        description: "Не удалось добавить товар в корзину. Пожалуйста, попробуйте позже.",
      });
    } finally {
      setIsAddingToCart(false);
    }
  };
  
  // Проверяем доступность товара на основе stockQuantity
  const isProductAvailable = selectedColorVariant 
    ? (selectedColorVariant.stockQuantity || 0) > 0
    : product.stockQuantity !== undefined ? product.stockQuantity > 0 : product.inStock;

  return (
    <div>
      <h1 className="text-2xl font-bold">{product.title}</h1>
      <p className="text-muted-foreground mt-2">{product.description}</p>
      
      {/* Price section */}
      <div className="mt-4">
        {product.discountPrice ? (
          <div className="flex items-center space-x-2">
            <span className="text-xl font-bold">{formatPrice(product.discountPrice)}</span>
            <span className="text-gray-500 line-through">{formatPrice(product.price)}</span>
          </div>
        ) : (
          <span className="text-xl font-bold">{formatPrice(product.price)}</span>
        )}
      </div>
    
  
    
      {/* Product actions */}
      <div className="mt-6 space-y-4">
        {isProductAvailable ? (
          <div className="flex flex-col space-y-4">
            {/* Quantity selector */}
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium">Количество:</span>
              <div className="flex items-center border rounded-md">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-2 border-r"
                  aria-label="Уменьшить количество"
                  style={{ cursor: 'pointer' }}
                >
                  −
                </button>
                <span className="px-4 py-2">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3 py-2 border-l"
                  aria-label="Увеличить количество"
                  style={{ cursor: 'pointer' }}
                >
                  +
                </button>
              </div>
            </div>
            
            <Button
              onClick={handleAddToCart}
              className="w-full"
              disabled={isAddingToCart}
            >
              {isAddingToCart ? "Добавляем..." : "Добавить в корзину"}
            </Button>
          </div>
        ) : (
          <StockNotification 
            productId={product.id} 
            productName={product.title} 
            variant={selectedColor}
          />
        )}
      </div>
    
      {/* Show alternative products if current one is not available */}
      {!isProductAvailable && (
        <AlternativeProducts productId={product.id} title="Похожие товары в наличии" />
      )}
    
      {/* Color variants */}
      {product.colors && product.colors.length > 0 && (
        <div className="mt-6">
          <h3 className="text-sm font-medium mb-2">Цвет:</h3>
          <div className="flex items-center space-x-3">
            {product.colors.map((color) => (
              <button
                key={color}
                className={`
                  w-8 h-8 rounded-full shadow-sm
                  ${selectedColor === color ? 'ring-2 ring-primary' : ''}
                `}
                style={{ backgroundColor: color }}
                onClick={() => setSelectedColor(color)}
                aria-label={`Выбрать цвет ${color}`}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductInfo;
