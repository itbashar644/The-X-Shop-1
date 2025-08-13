import React from "react";
import { Link } from "react-router-dom";
import { Product, ColorVariant } from "@/types/product";
import { formatPrice } from "@/lib/Imageutils";
import { Button } from "@/components/ui/button";
import { Heart, ShoppingCart } from "lucide-react";
import ProductColorOptions from "./ProductColorOptions";
import MarketplaceLinks from "./MarketplaceLinks";
import { AspectRatio } from "@/components/ui/aspect-ratio";

interface ProductCardFullProps {
  product: Product;
  currentProduct: Product;
  selectedColor: string | undefined;
  handleColorSelect: (colorName: string, variant?: ColorVariant) => void;
  handleAddToCart: () => void;
  handleToggleWishlist: (e: React.MouseEvent) => void;
  isInWishlist: (product: Product) => boolean;
  cartAvailable?: boolean;
}

const ProductCardFull: React.FC<ProductCardFullProps> = ({
  product,
  currentProduct,
  selectedColor,
  handleColorSelect,
  handleAddToCart,
  handleToggleWishlist,
  isInWishlist,
  cartAvailable = true
}) => {
  return (
    <div className="group relative bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
      <Link to={`/product/${product.id}`} className="block">
        <AspectRatio ratio={3/4} className="overflow-hidden rounded-t-lg bg-gray-50">
          <img
            src={currentProduct.image_url}
            alt={product.title}
            className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-200"
            loading="lazy"
          />
        </AspectRatio>
      </Link>

      <button
        onClick={handleToggleWishlist}
        className={`absolute top-3 right-3 p-2 rounded-full bg-white shadow-sm hover:shadow-md transition-all duration-200 ${
          isInWishlist(product) ? "text-red-500" : "text-gray-400"
        }`}
        aria-label={isInWishlist(product) ? "Удалить из избранного" : "Добавить в избранное"}
      >
        <Heart className={`h-4 w-4 ${isInWishlist(product) ? "fill-current" : ""}`} />
      </button>

      <div className="p-4">
        <Link to={`/product/${product.id}`}>
          <h3 className="text-sm font-medium text-gray-900 group-hover:text-gray-700 line-clamp-2 mb-2">
            {product.title}
          </h3>
        </Link>

        {/* Color Options */}
        {product.colors && product.colors.length > 0 && (
          <ProductColorOptions
            product={product}
            selectedColor={selectedColor}
            onColorSelect={handleColorSelect}
          />
        )}

        {/* Price */}
        <div className="flex items-center gap-2 mb-3">
          {currentProduct.discountPrice ? (
            <>
              <span className="text-lg font-bold text-gray-900">
                {formatPrice(currentProduct.discountPrice)}
              </span>
              <span className="text-sm text-gray-500 line-through">
                {formatPrice(currentProduct.price)}
              </span>
            </>
          ) : (
            <span className="text-lg font-bold text-gray-900">
              {formatPrice(currentProduct.price)}
            </span>
          )}
        </div>

        {/* Stock Status */}
        <div className={`text-xs font-medium mb-3 ${
          currentProduct.stockQuantity && currentProduct.stockQuantity > 0 
            ? "text-green-600" 
            : "text-red-500"
        }`}>
          {currentProduct.stockQuantity && currentProduct.stockQuantity > 0 ? "В наличии" : "Нет в наличии"}
        </div>

        {/* Marketplace Links */}
        <MarketplaceLinks product={currentProduct} />

        {/* Add to Cart Button */}
        {cartAvailable && (
          <Button
            onClick={handleAddToCart}
            disabled={!currentProduct.inStock || (currentProduct.stockQuantity !== undefined && currentProduct.stockQuantity <= 0)}
            className="w-full"
            size="sm"
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            В корзину
          </Button>
        )}
        
        {!cartAvailable && (
          <Link to={`/product/${product.id}`}>
            <Button className="w-full" size="sm" variant="outline">
              Подробнее
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
};

export default ProductCardFull;