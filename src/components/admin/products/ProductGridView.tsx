
import React from 'react';
import { Product } from "@/types/product";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import ProductActionButtons from './ProductActionButtons';

interface ProductGridViewProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (productId: string) => void;
  onPermanentDelete?: (productId: string) => void;
  deleteButtonText: string;
  deleteButtonColor: string;
  mode: 'active' | 'archived';
}

const ProductGridView = ({
  products,
  onEdit,
  onDelete,
  onPermanentDelete,
  deleteButtonText,
  deleteButtonColor,
  mode
}: ProductGridViewProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {products.map((product) => (
        <Card key={product.id} className="overflow-hidden">
          <div className="h-40 overflow-hidden">
            <img
              src={product.imageUrl}
              alt={product.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.src = "/placeholder.svg";
              }}
            />
          </div>
          
          <CardHeader className="p-3">
            <CardTitle className="text-sm font-medium line-clamp-2">
              {product.title}
            </CardTitle>
          </CardHeader>
          
          <CardContent className="p-3 pt-0 space-y-2">
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="bg-primary/10">
                {product.category}
              </Badge>
              
              {product.inStock ? (
                <Badge className="bg-green-500">В наличии</Badge>
              ) : (
                <Badge variant="destructive">Нет в наличии</Badge>
              )}
            </div>
            
            <div className="flex items-center justify-between">
              <div className="font-semibold">
                {product.discountPrice ? (
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground line-through">
                      {product.price} ₽
                    </span>
                    <span className="text-primary">
                      {product.discountPrice} ₽
                    </span>
                  </div>
                ) : (
                  <span>{product.price} ₽</span>
                )}
              </div>
            </div>
          </CardContent>
          
          <CardFooter className="p-3 pt-0 flex-col space-y-2">
            <ProductActionButtons
              product={product}
              mode={mode}
              onEdit={onEdit}
              onDelete={onDelete}
              onPermanentDelete={onPermanentDelete}
              deleteButtonText={deleteButtonText}
              deleteButtonColor={deleteButtonColor}
            />
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default ProductGridView;
