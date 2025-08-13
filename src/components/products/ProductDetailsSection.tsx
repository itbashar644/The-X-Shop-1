import React from 'react';
import { Product, ColorVariant } from "@/types/product";
import Carousel from '../ui/mainCarousel.jsx';
import ProductPricing from "@/components/products/ProductPricing";
import MarketplaceLinks from "@/components/products/MarketplaceLinks";
import ColorSelection from "@/components/products/ColorSelection";
import QuantitySelector from "@/components/products/QuantitySelector";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";

const isVideo = (url: string) => /\.(mp4|webm|mov|avi)$/i.test(url);

const prepareMediaForCarousel = (mediaUrls: string[]) => {
  return mediaUrls.map(url => {
    const isVideoFile = isVideo(url);
    const filename = url.split('/').pop()?.trim() || '';
    
    return {
      type: isVideoFile ? 'video' : 'image',
      mediaUrl: url,
      thumbnailUrl: url,
    };
  });
};

interface ProductDetailsSectionProps {
  product: Product;
  selectedColor?: string;
  displayPrice: number;
  displayArticleNumber?: string;
  onColorChange: (color: string) => void;
  onAddToCart: () => void;
  quantity: number;
  onQuantityChange: (quantity: number) => void;
}

const ProductDetailsSection: React.FC<ProductDetailsSectionProps> = ({
  product,
  selectedColor,
  displayPrice,
  displayArticleNumber,
  onColorChange,
  onAddToCart,
  quantity,
  onQuantityChange
}) => {
  const selectedColorVariant = product?.colorVariants?.find(
    v => v.color === selectedColor
  ) || null;

  const localMedia = [
    `/images/${product.imageUrl}`,
    "/images/00099aa0-4965-4836-89c9-6a5533fe4e4e.png",
    "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
  ];

  const isProductInStock = () => {
    if (!product) return false;
    if (selectedColorVariant) {
      return selectedColorVariant.stockQuantity !== undefined && selectedColorVariant.stockQuantity > 0;
    }
    return product.stockQuantity !== undefined && product.stockQuantity > 0;
  };

  const inStock = isProductInStock();

  return (
    <div className="grid md:grid-cols-2 gap-8">
      {/* Left side - media carousel */}
      <div>
        <Carousel 
          slides={prepareMediaForCarousel(localMedia)}
        />
      </div>

      {/* Right side - product info */}
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2" itemProp="name">{product.title}</h1>
          {displayArticleNumber && (
            <div className="text-sm text-muted-foreground mb-2">
              Артикул: <span itemProp="sku">{displayArticleNumber}</span>
            </div>
          )}
        </div>

        <div itemProp="offers" itemScope itemType="https://schema.org/Offer">
          {/* Передаём только нужные пропсы без quantity */}
          <ProductPricing 
            product={product} 
            selectedColorVariant={selectedColorVariant}
          />
          <meta itemProp="priceCurrency" content="RUB" />
          <link itemProp="availability" href={inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock"} />
        </div>

        <MarketplaceLinks product={product} className="mb-3" />

        <ColorSelection 
          product={product} 
          selectedColor={selectedColor} 
          onColorChange={onColorChange} 
        />

        <QuantitySelector 
          quantity={quantity} 
          onChange={onQuantityChange} 
          product={product} 
          selectedColorVariant={selectedColorVariant} 
        />

        <div className="pt-4">
          <Button 
            size="lg" 
            className="w-full"
            onClick={onAddToCart}
            disabled={!inStock}
          >
            <ShoppingCart className="mr-2 h-5 w-5" />
            {inStock ? `Купить за ${displayPrice} ₽` : "Нет в наличии"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsSection;
