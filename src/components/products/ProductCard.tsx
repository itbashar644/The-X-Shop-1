import React from "react";
import { Link } from "react-router-dom";
import { Product, ColorVariant } from "@/types/product";
import { formatPrice } from "@/lib/Imageutils";
import { Button } from "@/components/ui/button";
import { Heart, ShoppingCart } from "lucide-react";
import ProductColorOptions from "./ProductColorOptions";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";

interface ProductCardProps {
  product: Product;
  className?: string;
  selectedColor?: string;
  onColorSelect?: (colorName: string, variant?: ColorVariant) => void;
  currentProduct?: Product;
  compact?: boolean;
  cartAvailable?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  className = "",
  selectedColor,
  onColorSelect,
  currentProduct = product,
  compact = false,
  cartAvailable = true,
}) => {
  const { addItem } = useCart();
  const { isInWishlist, toggleWishlistItem } = useWishlist();

  // Функция для получения правильного пути к изображению
  const getImageUrl = (imageName?: string): string => {
    if (!imageName) return "/images/placeholder.svg";
    
    // Извлекаем UUID из строки (формат: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx)
    const uuidRegex = /([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})/i;
    const uuidMatch = imageName.match(uuidRegex);
    const uuid = uuidMatch ? uuidMatch[1] : null;

    if (uuid) {
      // Ваши файлы начинаются с Q + UUID
      return `/images/Q${uuid}.jpg`;
    }
    
    // Если это полный путь
    if (imageName.startsWith('/images/')) {
      return imageName;
    }
    
    // Дефолтный случай
    return "/images/placeholder.svg";
  };

  // Функция для логотипов маркетплейсов с обработкой ошибок
  const getMarketplaceLogo = (marketplace: string): string => {
    const logos: Record<string, string> = {
      wildberries: "/images/wb.png",
      ozon: "/images/ozon.png",
      avito: "/images/avito.png",
      wb: "/images/wb.png",
    };
    
    const logo = logos[marketplace.toLowerCase()] || "/images/marketplace-default.png";
    return logo.endsWith('.png') ? logo : `${logo}.png`;
  };

  const getStockStatus = (): { inStock: boolean; stockQuantity: number } => {
    let stockQuantity = currentProduct.stockQuantity || 0;

    if (selectedColor && currentProduct.colorVariants?.length) {
      const variant = currentProduct.colorVariants.find(
        (v) => v.color === selectedColor
      );
      if (variant) {
        stockQuantity = variant.stockQuantity || 0;
      }
    }

    return {
      inStock: stockQuantity > 0,
      stockQuantity,
    };
  };

  const stockStatus = getStockStatus();

  const handleAddToCart = () => {
    const selectedVariant =
      selectedColor && currentProduct.colorVariants
        ? currentProduct.colorVariants.find((v) => v.color === selectedColor)
        : undefined;

    addItem({
      product: currentProduct,
      quantity: 1,
      color: selectedColor,
      selectedColorVariant: selectedVariant,
    });
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlistItem(product);
  };

  return (
    <div
      className={`group relative flex flex-col h-full bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200 ${className}`}
      itemScope
      itemType="https://schema.org/Product"
    >
      {/* Изображение */}
      <Link to={`/product/${product.id}`} className="block" itemProp="url">
        <AspectRatio ratio={3 / 4} className="overflow-hidden rounded-t-lg bg-gray-50 relative">
          <img
            src={getImageUrl(currentProduct.image_url)}
            alt={product.title}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
            loading="lazy"
            itemProp="image"
            onError={(e) => {
              const img = e.target as HTMLImageElement;
              img.src = "/images/placeholder.svg";
              img.classList.add("opacity-70");
              console.error(`Failed to load image: ${currentProduct.image_url}`);
            }}
          />
        </AspectRatio>
      </Link>

      {/* Кнопка избранного */}
      <button
        onClick={handleToggleWishlist}
        className={`absolute top-3 right-3 p-2 rounded-full bg-white shadow-sm hover:shadow-md transition-all duration-200 z-10 ${
          isInWishlist(product.id) ? "text-red-500" : "text-gray-400"
        }`}
        aria-label={isInWishlist(product.id) ? "Удалить из избранного" : "Добавить в избранное"}
      >
        <Heart className={`h-4 w-4 ${isInWishlist(product.id) ? "fill-current" : ""}`} />
      </button>

      {/* Контент карточки */}
      <div className={`flex flex-col flex-grow ${compact ? "p-3" : "p-4"}`}>
        <div className="flex-grow">
          <Link to={`/product/${product.id}`}>
            <h3
              className={`font-medium text-gray-900 group-hover:text-gray-700 line-clamp-2 mb-2 ${
                compact ? "text-xs" : "text-sm"
              }`}
              itemProp="name"
            >
              {product.title}
            </h3>
          </Link>

          {/* Цвета */}
          {!compact && product.colorVariants && product.colorVariants.length > 0 && onColorSelect && (
            <ProductColorOptions
              product={product}
              selectedColor={selectedColor}
              onColorSelect={onColorSelect}
              className="mb-3"
            />
          )}

          {/* Цена */}
          <div
            className="flex items-center gap-2 mb-3"
            itemProp="offers"
            itemScope
            itemType="https://schema.org/Offer"
          >
            <meta itemProp="priceCurrency" content="RUB" />
            <link
              itemProp="availability"
              href={
                stockStatus.inStock
                  ? "https://schema.org/InStock"
                  : "https://schema.org/OutOfStock"
              }
            />
            <meta itemProp="url" content={`https://the-x.shop/product/${product.id}`} />

            {currentProduct.originalPrice && currentProduct.originalPrice > currentProduct.price ? (
              <>
                <span
                  className={`font-bold text-gray-900 ${compact ? "text-sm" : "text-lg"}`}
                  itemProp="price"
                  content={String(currentProduct.price)}
                >
                  {formatPrice(currentProduct.price)}
                </span>
                <span className={`text-gray-500 line-through ${compact ? "text-xs" : "text-sm"}`}>
                  {formatPrice(currentProduct.originalPrice)}
                </span>
              </>
            ) : (
              <span
                className={`font-bold text-gray-900 ${compact ? "text-sm" : "text-lg"}`}
                itemProp="price"
                content={String(currentProduct.price)}
              >
                {formatPrice(currentProduct.price)}
              </span>
            )}
          </div>

          {/* Наличие */}
          {!compact && (
            <div
              className={`text-xs font-medium mb-3 ${
                stockStatus.inStock ? "text-green-600" : "text-red-500"
              }`}
            >
              {stockStatus.inStock
                ? `В наличии · ${stockStatus.stockQuantity} шт`
                : "Нет в наличии"}
            </div>
          )}

          {/* Ссылки маркетплейсов */}
          <div className="flex gap-3 mb-3">
            {product.wildberriesUrl && (
              <a
                href={product.wildberriesUrl}
                target="_blank"
                rel="noopener noreferrer"
                title="Wildberries"
              >
                <img 
                  src={getMarketplaceLogo("wildberries")} 
                  alt="Wildberries" 
                  className="h-6"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "/images/marketplace-default.png";
                  }}
                />
              </a>
            )}
            {product.ozonUrl && (
              <a
                href={product.ozonUrl}
                target="_blank"
                rel="noopener noreferrer"
                title="Ozon"
              >
                <img 
                  src={getMarketplaceLogo("ozon")} 
                  alt="Ozon" 
                  className="h-6"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "/images/marketplace-default.png";
                  }}
                />
              </a>
            )}
            {product.avitoUrl && (
              <a
                href={product.avitoUrl}
                target="_blank"
                rel="noopener noreferrer"
                title="Avito"
              >
                <img 
                  src={getMarketplaceLogo("avito")} 
                  alt="Avito" 
                  className="h-6"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "/images/marketplace-default.png";
                  }}
                />
              </a>
            )}
          </div>
        </div>

        {/* Кнопки действий */}
        <div className="mt-auto">
          {cartAvailable ? (
            <Button
              onClick={handleAddToCart}
              disabled={!stockStatus.inStock}
              className="w-full"
              size={compact ? "sm" : "sm"}
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              {stockStatus.inStock ? "В корзину" : "Нет в наличии"}
            </Button>
          ) : (
            <Link to={`/product/${product.id}`}>
              <Button className="w-full" size={compact ? "sm" : "sm"} variant="outline">
                Подробнее
              </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;