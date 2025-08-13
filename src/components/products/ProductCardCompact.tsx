import React from "react";
import { Link } from "react-router-dom";
import { Product } from "@/types/product";
import { formatPrice } from "@/lib/Imageutils";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";

interface ProductCardCompactProps {
  product: Product;
  currentProduct: Product;
}

const ProductCardCompact: React.FC<ProductCardCompactProps> = ({ product, currentProduct }) => {
  // Проверяем фактическое наличие на основе stockQuantity
  const isAvailable = currentProduct.stockQuantity !== undefined 
    ? currentProduct.stockQuantity > 0 
    : currentProduct.inStock;
  
  return (
    <Card className={`h-full ${!isAvailable ? 'opacity-75' : ''}`}>
      <Link to={`/product/${product.id}`} className="block h-full">
        <div className="relative overflow-hidden">
          <AspectRatio ratio={3/4} className="bg-white">
            <img
              src={currentProduct.image_url || "/placeholder.svg"}
              alt={product.title}
              className={`h-full w-full object-contain transition-all hover:scale-105 ${!isAvailable ? 'grayscale-[30%]' : ''}`}
            />
          </AspectRatio>
          {!isAvailable && (
            <Badge variant="outline" className="absolute top-2 left-2 bg-gray-700 text-white text-xs">
              Нет в наличии
            </Badge>
          )}
          
        </div>
        <CardHeader className="p-2">
          <CardTitle className="line-clamp-1 text-xs sm:text-sm">
            {product.title}
          </CardTitle>
          <CardDescription className="flex justify-between items-center">
            <span className="font-medium whitespace-nowrap text-xs sm:text-sm">
              {currentProduct.discountPrice
                ? formatPrice(currentProduct.discountPrice)
                : formatPrice(currentProduct.price)}
            </span>
            {currentProduct.discountPrice && (
              <span className="text-xs line-through text-muted-foreground whitespace-nowrap">
                {formatPrice(currentProduct.price)}
              </span>
            )}
          </CardDescription>
        </CardHeader>
      </Link>
    </Card>
  );
};

export default ProductCardCompact;