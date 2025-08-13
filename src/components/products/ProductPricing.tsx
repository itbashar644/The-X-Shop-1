import React from 'react';
import { Product, ColorVariant } from "@/types/product";
import { formatPrice } from "@/lib/Image-utils";

interface ProductPricingProps {
  product: Product;
  selectedColorVariant?: ColorVariant;
}

const ProductPricing: React.FC<ProductPricingProps> = ({ product, selectedColorVariant }) => {
  const price = selectedColorVariant?.price ?? product.price;
  const discountPrice = selectedColorVariant?.discountPrice ?? product.discountPrice;

  if (discountPrice && discountPrice < price) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-lg font-bold">{formatPrice(discountPrice)}</span>
        <span className="text-sm text-gray-500 line-through">{formatPrice(price)}</span>
      </div>
    );
  }

  return <span className="text-lg font-bold">{formatPrice(price)}</span>;
};

export default ProductPricing;