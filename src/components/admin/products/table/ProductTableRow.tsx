
import React, { useState } from "react";
import { TableRow, TableCell } from "@/components/ui/table";
import { Product } from "@/types/product";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, 
  AlertDialogFooter, AlertDialogTitle, AlertDialogDescription, AlertDialogAction, 
  AlertDialogCancel } from "@/components/ui/alert-dialog";
import { Pencil, Trash, RefreshCcw, ArchiveX, Link } from "lucide-react";
import StockQuantityEditor from "./StockQuantityEditor";
import MarketplaceLinks from "@/components/products/MarketplaceLinks";

interface ProductTableRowProps {
  product: Product;
  onSelectProduct?: (productId: string, selected: boolean) => void;
  isSelected?: boolean;
  onEdit: (product: Product) => void;
  onDelete: (productId: string) => void;
  onPermanentDelete?: (productId: string) => void;
  deleteButtonText: string;
  deleteButtonColor: "red" | "green" | "orange";
  mode: "active" | "archived";
}

const ProductTableRow = ({
  product,
  onSelectProduct,
  isSelected,
  onEdit,
  onDelete,
  onPermanentDelete,
  deleteButtonText,
  deleteButtonColor,
  mode
}: ProductTableRowProps) => {
  const [editingStockId, setEditingStockId] = useState<boolean>(false);

  // Get delete button classes based on color prop
  const getDeleteButtonClasses = () => {
    switch (deleteButtonColor) {
      case "green":
        return "text-green-500 hover:text-green-600 hover:bg-green-50";
      case "orange":
        return "text-orange-500 hover:text-orange-600 hover:bg-orange-50";
      default:
        return "text-red-500 hover:text-red-600 hover:bg-red-50";
    }
  };

  // Get delete button icon based on color prop
  const getDeleteButtonIcon = () => {
    switch (deleteButtonColor) {
      case "green":
        return <RefreshCcw className="h-4 w-4" />;
      case "orange":
        return <ArchiveX className="h-4 w-4" />;
      default:
        return <Trash className="h-4 w-4" />;
    }
  };

  // Helper function to check if product has any marketplace links
  const hasMarketplaceLinks = (product: Product) => {
    return Boolean(product.ozonUrl || product.wildberriesUrl || product.avitoUrl);
  };

  // Start editing stock
  const startEditStock = () => {
    setEditingStockId(true);
  };

  // Handle stock editor close
  const handleStockEditorClose = () => {
    setEditingStockId(false);
  };
  console.log(product)
  return (
    <TableRow>
      {onSelectProduct && (
        <TableCell>
          <Checkbox 
            checked={isSelected}
            onCheckedChange={(checked) => onSelectProduct(product.id, !!checked)}
            aria-label={`Выбрать товар ${product.title}`}
          />
        </TableCell>
      )}
      <TableCell className="font-medium">{product.id}</TableCell>
      <TableCell>
        <div className="w-12 h-12 border rounded overflow-hidden">
          <img 
            src={`/images/${product.image_url}`} 
            alt={product.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.src = "/placeholder.svg";
            }}
          />
        </div>
      </TableCell>
      <TableCell>{product.articleNumber || "-"}</TableCell>
      <TableCell>
        <div className="font-medium">{product.title}</div>
        <div className="text-xs text-muted-foreground truncate max-w-[250px]">
          {product.description}
        </div>
      </TableCell>
      <TableCell>{product.modelName || "-"}</TableCell>
      <TableCell>{product.category}</TableCell>
      <TableCell>
        {product.discountPrice ? (
          <div>
            <span className="font-medium">{`${product.discountPrice.toLocaleString()}₽`}</span>{" "}
            <span className="text-muted-foreground line-through text-sm">
              {`${product.price.toLocaleString()}₽`}
            </span>
          </div>
        ) : (
          product.price.toLocaleString() + "₽"
        )}
      </TableCell>
      <TableCell>
        {editingStockId ? (
          <StockQuantityEditor 
            product={product}
            onClose={handleStockEditorClose}
          />
        ) : (
          <Button
            variant="ghost"
            size="sm"
            className="px-2 h-7"
            onClick={startEditStock}
          >
            {product.stock_quantity !== undefined ? product.stock_quantity : "-"}
          </Button>
        )}
      </TableCell>
      <TableCell>
        <div className="flex flex-wrap gap-1">
          {product.stock_quantity != 0 ? (
            <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
              В наличии
            </span>
          ) : (
            <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs">
              Нет в наличии
            </span>
          )}
          {product.isNew && (
            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
              Новинка
            </span>
          )}
          {mode === "archived" && (
            <span className="px-2 py-1 bg-orange-100 text-orange-800 rounded-full text-xs">
              В архиве
            </span>
          )}
        </div>
      </TableCell>
      <TableCell>
        {true ? (
          <div className="flex gap-1">
            {product.wildberriesUrl && (
              <div className="w-5 h-5 rounded-full bg-purple-100 flex items-center justify-center" title="Доступен на Wildberries">
                <span className="text-purple-700 text-xs font-bold">W</span>
              </div>
            )}
            {product.ozonUrl && (
              <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center" title="Доступен на Ozon">
                <span className="text-blue-700 text-xs font-bold">O</span>
              </div>
            )}
            {product.avitoUrl && (
              <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center" title="Доступен на Авито">
                <span className="text-green-700 text-xs font-bold">А</span>
              </div>
            )}
          </div>
        ) : (
          <span className="text-xs text-muted-foreground">Нет</span>
        )}
      </TableCell>
      <TableCell className="text-right">
        <div className="flex justify-end space-x-2">
          {mode === "active" && (
            <Button
              variant="outline"
              size="icon"
              onClick={() => onEdit(product)}
            >
              <Pencil className="h-4 w-4" />
            </Button>
          )}
          
          {hasMarketplaceLinks(product) && (
            <div className="relative group">
              <Button
                variant="outline"
                size="icon"
                className="text-blue-500"
              >
                <Link className="h-4 w-4" />
              </Button>
              <div className="absolute right-0 top-full mt-2 z-50 hidden group-hover:block bg-white p-2 rounded-md shadow-md border">
                <MarketplaceLinks product={product} showLabels={true} />
              </div>
            </div>
          )}
          
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className={getDeleteButtonClasses()}
              >
                {getDeleteButtonIcon()}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  Вы уверены?
                </AlertDialogTitle>
                <AlertDialogDescription>
                  {mode === "active" 
                    ? "Товар будет перемещен в архив и скрыт с сайта. Вы сможете восстановить его позже."
                    : "Товар будет восстановлен из архива и станет снова доступен на сайте."
                  }
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Отмена</AlertDialogCancel>
                <AlertDialogAction onClick={() => onDelete(product.id)}>
                  {deleteButtonText}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          
          {mode === "archived" && onPermanentDelete && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="text-red-500 hover:text-red-600 hover:bg-red-50"
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    Удалить навсегда?
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    Товар будет удален навсегда без возможности восстановления. Это действие нельзя будет отменить.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Отмена</AlertDialogCancel>
                  <AlertDialogAction 
                    onClick={() => onPermanentDelete(product.id)}
                    className="bg-red-500 hover:bg-red-600"
                  >
                    Удалить навсегда
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
      </TableCell>
    </TableRow>
  );
};

export default ProductTableRow;
