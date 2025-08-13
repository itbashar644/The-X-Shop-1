
import React from 'react';
import { Button } from "@/components/ui/button";
import { Product } from "@/types/product";
import { Pencil, Trash, RefreshCw, Archive } from "lucide-react";

interface ProductActionButtonsProps {
  product: Product;
  mode: 'active' | 'archived';
  onEdit: (product: Product) => void;
  onDelete: (productId: string) => void;
  onPermanentDelete?: (productId: string) => void;
  deleteButtonText: string;
  deleteButtonColor: string;
}

const ProductActionButtons = ({ 
  product, 
  mode, 
  onEdit, 
  onDelete, 
  onPermanentDelete,
  deleteButtonText,
  deleteButtonColor
}: ProductActionButtonsProps) => {
  return (
    <div className="flex space-x-2">
      <Button 
        onClick={() => onEdit(product)} 
        size="sm" 
        variant="outline"
      >
        <Pencil className="h-4 w-4 mr-1" />
        Редактировать
      </Button>
      
      <Button 
        onClick={() => onDelete(product.id)} 
        size="sm" 
        variant={deleteButtonColor === "green" ? "secondary" : "default"}
        className={deleteButtonColor === "orange" ? "bg-orange-500 hover:bg-orange-600" : 
                   deleteButtonColor === "green" ? "bg-green-500 hover:bg-green-600" : ""}
      >
        {mode === 'active' ? (
          <Archive className="h-4 w-4 mr-1" />
        ) : (
          <RefreshCw className="h-4 w-4 mr-1" />
        )}
        {deleteButtonText}
      </Button>
      
      {mode === 'archived' && onPermanentDelete && (
        <Button 
          onClick={() => onPermanentDelete(product.id)} 
          size="sm" 
          variant="destructive"
        >
          <Trash className="h-4 w-4 mr-1" />
          Удалить
        </Button>
      )}
    </div>
  );
};

export default ProductActionButtons;
