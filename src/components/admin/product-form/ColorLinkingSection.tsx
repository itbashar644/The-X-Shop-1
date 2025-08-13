
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { X, Link as LinkIcon } from "lucide-react";
import { Product } from "@/types/product";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { getProductById } from "@/data/products";
import { linkProductsByColor } from "@/data/products/product/productServiceSpecialized";
import { toast } from "sonner";

interface ColorLinkingSectionProps {
  formData: Partial<Product>;
  products: Product[];
  handleRelatedColorProductsChange?: (productIds: string[]) => void;
  loading: boolean;
}

const ColorLinkingSection: React.FC<ColorLinkingSectionProps> = ({
  formData,
  products,
  handleRelatedColorProductsChange,
  loading
}) => {
  const [selectedProductId, setSelectedProductId] = useState<string>("");
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);

  // Load already related products
  useEffect(() => {
    const loadRelatedProducts = async () => {
      if (!formData.relatedColorProducts || formData.relatedColorProducts.length === 0) {
        setRelatedProducts([]);
        return;
      }
      
      try {
        const relatedProductsData = await Promise.all(
          formData.relatedColorProducts.map(id => getProductById(id))
        );
        
        setRelatedProducts(relatedProductsData.filter(p => p) as Product[]);
      } catch (error) {
        console.error("Ошибка загрузки связанных продуктов:", error);
      }
    };
    
    loadRelatedProducts();
  }, [formData.relatedColorProducts]);

  const handleAddRelatedProduct = async () => {
    if (!selectedProductId) return;
    
    const newRelatedProducts = [...(formData.relatedColorProducts || []), selectedProductId];
    
    if (handleRelatedColorProductsChange) {
      handleRelatedColorProductsChange(newRelatedProducts);
    } else {
      // If no handler is provided, update formData directly (not ideal)
      formData.relatedColorProducts = newRelatedProducts;
    }
    
    // Reset selection
    setSelectedProductId("");
  };

  const handleRemoveRelatedProduct = (productId: string) => {
    const updatedRelatedProducts = (formData.relatedColorProducts || []).filter(id => id !== productId);
    
    if (handleRelatedColorProductsChange) {
      handleRelatedColorProductsChange(updatedRelatedProducts);
    } else {
      // If no handler is provided, update formData directly (not ideal)
      formData.relatedColorProducts = updatedRelatedProducts;
    }
  };

  const handleLinkProducts = async () => {
    if (!formData.id || !formData.relatedColorProducts || formData.relatedColorProducts.length === 0) {
      return;
    }
    
    try {
      const productIds = [formData.id, ...formData.relatedColorProducts];
      const success = await linkProductsByColor(productIds);
      
      if (success) {
        toast.success("Продукты успешно связаны по цвету");
      } else {
        toast.error("Не удалось связать продукты");
      }
    } catch (error) {
      console.error("Ошибка при связывании продуктов:", error);
      toast.error("Ошибка при связывании продуктов");
    }
  };

  return (
    <div className="space-y-4">
      {/* Select product to link */}
      <div className="flex gap-2">
        <Select 
          value={selectedProductId}
          onValueChange={setSelectedProductId}
          disabled={loading}
        >
          <SelectTrigger className="flex-1">
            <SelectValue placeholder="Выберите товар для связывания" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Доступные товары</SelectLabel>
              {products.length === 0 && (
                <div className="px-2 py-1 text-sm text-muted-foreground">
                  Нет доступных товаров для связывания
                </div>
              )}
              {products.map((product) => (
                <SelectItem key={product.id} value={product.id}>
                  {product.title}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        <Button 
          type="button" 
          onClick={handleAddRelatedProduct}
          variant="secondary"
          disabled={!selectedProductId || loading}
        >
          Добавить
        </Button>
      </div>
      
      {/* Display related products */}
      {relatedProducts.length > 0 && (
        <div className="mt-4">
          <h4 className="text-sm font-medium mb-2">Связанные товары:</h4>
          <div className="space-y-2">
            {relatedProducts.map((product) => (
              <div key={product.id} className="flex items-center justify-between bg-background p-2 rounded-md">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 overflow-hidden rounded-md">
                    <img 
                      src={product.imageUrl} 
                      alt={product.title} 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "/placeholder.svg";
                      }}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{product.title}</p>
                    <div className="flex items-center gap-1">
                      {product.colorVariants && product.colorVariants.length > 0 && (
                        <Badge variant="outline" className="text-xs">
                          {product.colorVariants[0].color}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveRelatedProduct(product.id)}
                  disabled={loading}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
          
          {formData.id && (
            <Button 
              type="button" 
              onClick={handleLinkProducts}
              className="mt-4"
              disabled={loading || relatedProducts.length === 0}
            >
              <LinkIcon className="h-4 w-4 mr-2" />
              Применить связи
            </Button>
          )}
          
          <p className="text-xs text-muted-foreground mt-2">
            Для сохранения связей между товарами нажмите кнопку "Применить связи" после добавления всех связанных товаров.
            Эта операция изменит данные в базе данных немедленно.
          </p>
        </div>
      )}
    </div>
  );
};

export default ColorLinkingSection;
