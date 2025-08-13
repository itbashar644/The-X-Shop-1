
import React, { useState, useEffect } from 'react';
import { Product, ColorVariant } from "@/types/product";
import ColorVariantManager from "@/components/admin/ColorVariantManager";
import { getActiveProducts } from "@/data/products";
import ColorLinkingSection from "./ColorLinkingSection";
import LegacyColorsSection from "./LegacyColorsSection";

interface ColorsTabProps {
  formData: Partial<Product>;
  handleColorVariantsChange: (variants: ColorVariant[]) => void;
  handleRemoveColor: (colorToRemove: string) => void;
  handleRelatedColorProductsChange?: (productIds: string[]) => void;
}

const ColorsTab = ({
  formData,
  handleColorVariantsChange,
  handleRemoveColor,
  handleRelatedColorProductsChange
}: ColorsTabProps) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  // Load available products for color linking
  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      try {
        const allProducts = await getActiveProducts();
        // Filter out current product and already linked products
        const filteredProducts = allProducts.filter(p => 
          p.id !== formData.id && 
          !formData.relatedColorProducts?.includes(p.id)
        );
        setProducts(filteredProducts);
      } catch (error) {
        console.error("Ошибка загрузки продуктов:", error);
      } finally {
        setLoading(false);
      }
    };
    
    loadProducts();
  }, [formData.id, formData.relatedColorProducts]);

  return (
    <div className="space-y-6">
      {/* Color Variants Management */}
      <div className="bg-muted/30 p-4 rounded-lg">
        <h3 className="text-sm font-medium mb-2">Управление цветовыми вариантами</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Здесь вы можете добавить варианты товара с разными цветами. Для каждого цвета можно указать свою цену, артикул и количество на складе.
        </p>
        
        <ColorVariantManager
          colorVariants={formData.colorVariants || []}
          onChange={handleColorVariantsChange}
          basePrice={formData.price || 0}
        />
      </div>
      
      {/* Related Color Products */}
      <div className="bg-muted/30 p-4 rounded-lg">
        <h3 className="text-sm font-medium mb-2">Связанные цветовые варианты (отдельные товары)</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Здесь вы можете связать этот товар с другими товарами, которые являются его цветовыми вариантами. На странице товара будут показаны все доступные цвета.
        </p>
        
        <ColorLinkingSection 
          formData={formData}
          products={products}
          handleRelatedColorProductsChange={handleRelatedColorProductsChange}
          loading={loading}
        />
      </div>
      
      {/* Legacy Colors - Simple list */}
      <div className="bg-muted/30 p-4 rounded-lg">
        <h3 className="text-sm font-medium mb-2">Список доступных цветов (устаревший)</h3>
        <p className="text-sm text-muted-foreground mb-2">
          Простой список доступных цветов для совместимости. Рекомендуем использовать цветовые варианты выше.
        </p>
        
        <LegacyColorsSection 
          formData={formData}
          handleRemoveColor={handleRemoveColor}
        />
      </div>
    </div>
  );
};

export default ColorsTab;
