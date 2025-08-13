
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Product } from "@/types/product";
import { MinusCircle, PlusCircle } from "lucide-react";
import { toast } from "sonner";
import { decreaseProductStock } from "@/data/products/services/productStockService";
import { updateProductStockApiEndpoint } from "@/api/admin/productStockApi";

interface StockQuantityEditorProps {
  product: Product;
  onClose: (updated: boolean) => void;
}

const StockQuantityEditor = ({ product, onClose }: StockQuantityEditorProps) => {
  const [stockQuantity, setStockQuantity] = useState<number>(product.stockQuantity || 0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle stock change
  const handleStockChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    setStockQuantity(isNaN(value) ? 0 : value);
  };

  // Increment/decrement stock
  const adjustStock = (increment: boolean) => {
    setStockQuantity(prev => increment ? prev + 1 : Math.max(0, prev - 1));
  };

  // Save stock updates
  const saveStockUpdate = async () => {
    if (stockQuantity < 0) {
      toast.error("Количество товара не может быть отрицательным");
      return;
    }
    
    setIsSubmitting(true);
    try {
      // Calculate difference to determine if we need to increase or decrease stock
      const difference = stockQuantity - (product.stockQuantity || 0);
      
      if (difference !== 0) {
        // Update the product's stock by difference
        if (difference < 0) {
          // Need to decrease stock
          const success = await decreaseProductStock(product.id, Math.abs(difference));
          if (!success) {
            throw new Error("Failed to update stock quantity");
          }
        } else {
          // Need to increase stock
          const response = await updateProductStockApiEndpoint(product.id, stockQuantity);
          
          if (!response.success) {
            throw new Error(response.error || "Failed to update stock quantity");
          }
        }
        
        toast.success(`Остаток товара обновлен до ${stockQuantity}`);
        
        // Update the local product object
        product.stockQuantity = stockQuantity;
        product.inStock = stockQuantity > 0;
        
        onClose(true);
      } else {
        // No change in quantity
        onClose(false);
      }
    } catch (error) {
      console.error("Error updating stock:", error);
      toast.error("Ошибка при обновлении остатка товара");
      onClose(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex items-center gap-1">
      <Button
        variant="outline"
        size="icon"
        className="h-7 w-7"
        onClick={() => adjustStock(false)}
        disabled={isSubmitting}
      >
        <MinusCircle className="h-4 w-4" />
      </Button>
      <Input
        type="number"
        value={stockQuantity}
        onChange={handleStockChange}
        min="0"
        className="w-16 h-7 text-center"
        disabled={isSubmitting}
      />
      <Button
        variant="outline"
        size="icon"
        className="h-7 w-7"
        onClick={() => adjustStock(true)}
        disabled={isSubmitting}
      >
        <PlusCircle className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="sm"
        className="ml-1 h-7"
        onClick={saveStockUpdate}
        disabled={isSubmitting}
      >
        {isSubmitting ? "..." : "ОК"}
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className="h-7"
        onClick={() => onClose(false)}
        disabled={isSubmitting}
      >
        Отмена
      </Button>
    </div>
  );
};

export default StockQuantityEditor;
