
import React, { useState } from 'react';
import { Product } from "@/types/product";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import ProductFilters from "@/components/admin/ProductFilters";
import ProductList from "@/components/admin/ProductList";
import ProductImportExport from "@/components/admin/ProductImportExport";
import ConfirmDialog from './ConfirmDialog';
import { Button } from "@/components/ui/button";
import { Merge, Trash2, Archive } from "lucide-react";

interface ProductTabContentProps {
  products: Product[];
  searchTerm: string;
  onSearchChange: (term: string) => void;
  categoryFilter: string;
  onCategoryChange: (category: string) => void;
  categories: string[];
  onEdit: (product: Product) => void;
  onDelete: (productId: string) => void;
  onPermanentDelete?: (productId: string) => void;
  onImportComplete: () => Promise<void>;
  isLoading: boolean;
  mode: 'active' | 'archived';
  deleteButtonText: string;
  deleteButtonColor: "orange" | "green";
  onBulkDelete?: (productIds: string[]) => Promise<void>;
  onBulkArchive?: (productIds: string[]) => Promise<void>;
  onBulkMerge?: (productIds: string[]) => Promise<void>;
}

const ProductTabContent = ({
  products,
  searchTerm,
  onSearchChange,
  categoryFilter,
  onCategoryChange,
  categories,
  onEdit,
  onDelete,
  onPermanentDelete,
  onImportComplete,
  isLoading,
  mode,
  deleteButtonText,
  deleteButtonColor,
  onBulkDelete,
  onBulkArchive,
  onBulkMerge
}: ProductTabContentProps) => {
  // State for confirmation dialogs
  const [confirmDelete, setConfirmDelete] = useState<{isOpen: boolean, productId: string}>({
    isOpen: false,
    productId: ''
  });
  
  const [confirmPermanentDelete, setConfirmPermanentDelete] = useState<{isOpen: boolean, productId: string}>({
    isOpen: false,
    productId: ''
  });

  const [confirmBulkAction, setConfirmBulkAction] = useState<{
    isOpen: boolean, 
    action: 'delete' | 'archive' | 'merge',
    title: string,
    description: string
  }>({
    isOpen: false,
    action: 'delete',
    title: '',
    description: ''
  });
  
  // Selected products for bulk actions
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  
  // Handle delete button click
  const handleDeleteClick = (productId: string) => {
    setConfirmDelete({
      isOpen: true,
      productId
    });
  };
  
  // Handle permanent delete button click
  const handlePermanentDeleteClick = (productId: string) => {
    setConfirmPermanentDelete({
      isOpen: true,
      productId
    });
  };
  
  // Handle delete confirmation
  const handleDeleteConfirm = () => {
    if (confirmDelete.productId) {
      onDelete(confirmDelete.productId);
    }
    setConfirmDelete({isOpen: false, productId: ''});
  };
  
  // Handle permanent delete confirmation
  const handlePermanentDeleteConfirm = () => {
    if (confirmPermanentDelete.productId && onPermanentDelete) {
      onPermanentDelete(confirmPermanentDelete.productId);
    }
    setConfirmPermanentDelete({isOpen: false, productId: ''});
  };

  // Handle product selection
  const handleProductSelection = (productId: string, selected: boolean) => {
    if (selected) {
      setSelectedProducts([...selectedProducts, productId]);
    } else {
      setSelectedProducts(selectedProducts.filter(id => id !== productId));
    }
  };

  // Handle select all products
  const handleSelectAll = (selected: boolean) => {
    if (selected) {
      setSelectedProducts(products.map(p => p.id));
    } else {
      setSelectedProducts([]);
    }
  };

  // Initialize bulk action
  const handleBulkAction = (action: 'delete' | 'archive' | 'merge') => {
    if (selectedProducts.length === 0) return;

    let title = '';
    let description = '';

    if (action === 'delete') {
      title = 'Удалить выбранные товары?';
      description = 'Выбранные товары будут безвозвратно удалены. Это действие нельзя отменить.';
    } else if (action === 'archive') {
      title = mode === 'active' ? 'Архивировать выбранные товары?' : 'Восстановить выбранные товары?';
      description = mode === 'active' 
        ? 'Выбранные товары будут перемещены в архив и скрыты с сайта.' 
        : 'Выбранные товары будут восстановлены из архива и станут видны на сайте.';
    } else if (action === 'merge') {
      title = 'Объединить выбранные товары?';
      description = 'Выбранные товары будут объединены по модели. Первый выбранный товар станет основным, остальные будут перемещены в архив.';
    }

    setConfirmBulkAction({
      isOpen: true,
      action,
      title,
      description
    });
  };
 
  // Handle bulk action confirmation
  const handleBulkActionConfirm = () => {
    const action = confirmBulkAction.action;
    setConfirmBulkAction({ ...confirmBulkAction, isOpen: false });

    if (selectedProducts.length === 0) return;

    if (action === 'delete' && onBulkDelete) {
      onBulkDelete(selectedProducts);
    } else if (action === 'archive' && onBulkArchive) {
      onBulkArchive(selectedProducts);
    } else if (action === 'merge' && onBulkMerge && selectedProducts.length >= 2) {
      onBulkMerge(selectedProducts);
    }

    // Clear selections after action
    setSelectedProducts([]);
  };

  return (
    <>
      {mode === 'active' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Импорт/Экспорт</span>
            </CardTitle>
            <CardDescription>
              Массовое управление товарами через Excel-файлы
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ProductImportExport onImportComplete={onImportComplete} />
          </CardContent>
        </Card>
      )}

      <ProductFilters
        searchTerm={searchTerm}
        onSearchChange={onSearchChange}
        categoryFilter={categoryFilter}
        onCategoryChange={onCategoryChange}
        categories={categories}
      />

      {/* Bulk Actions */}
      <div className="flex flex-wrap gap-2 mb-4">
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => handleBulkAction('delete')}
          disabled={selectedProducts.length === 0 || !onBulkDelete}
          className="text-red-500 hover:text-red-600 hover:bg-red-50"
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Удалить выбранные ({selectedProducts.length})
        </Button>
        
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => handleBulkAction('archive')}
          disabled={selectedProducts.length === 0 || !onBulkArchive}
          className={mode === 'active' 
            ? "text-orange-500 hover:text-orange-600 hover:bg-orange-50"
            : "text-green-500 hover:text-green-600 hover:bg-green-50"
          }
        >
          <Archive className="h-4 w-4 mr-2" />
          {mode === 'active' ? 'Архивировать' : 'Восстановить'} выбранные ({selectedProducts.length})
        </Button>
        
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => handleBulkAction('merge')}
          disabled={selectedProducts.length < 2 || !onBulkMerge}
        >
          <Merge className="h-4 w-4 mr-2" />
          Объединить выбранные ({selectedProducts.length})
        </Button>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center p-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : (
        <ProductList
          products={products}
          onEdit={onEdit} // Still pass onEdit for the edit button
          onDelete={handleDeleteClick}
          deleteButtonText={deleteButtonText}
          deleteButtonColor={deleteButtonColor}
          mode={mode}
          onPermanentDelete={mode === 'archived' ? handlePermanentDeleteClick : undefined}
          selectedProducts={selectedProducts}
          onSelectProduct={handleProductSelection}
          onSelectAll={handleSelectAll}
        />
      )}
      
      <ConfirmDialog
        isOpen={confirmDelete.isOpen}
        onClose={() => setConfirmDelete({isOpen: false, productId: ''})}
        onConfirm={handleDeleteConfirm}
        title={mode === 'active' ? "Архивировать товар" : "Восстановить товар"}
        description={
          mode === 'active' 
            ? "Вы действительно хотите переместить этот товар в архив? Товар будет скрыт от покупателей."
            : "Вы действительно хотите восстановить этот товар из архива? Товар будет виден покупателям."
        }
        confirmText={mode === 'active' ? "Архивировать" : "Восстановить"}
      />
      
      <ConfirmDialog
        isOpen={confirmPermanentDelete.isOpen}
        onClose={() => setConfirmPermanentDelete({isOpen: false, productId: ''})}
        onConfirm={handlePermanentDeleteConfirm}
        title="Удалить товар навсегда"
        description="Вы действительно хотите удалить этот товар безвозвратно? Это действие нельзя отменить."
        confirmText="Удалить навсегда"
        variant="destructive"
      />

      <ConfirmDialog
        isOpen={confirmBulkAction.isOpen}
        onClose={() => setConfirmBulkAction({...confirmBulkAction, isOpen: false})}
        onConfirm={handleBulkActionConfirm}
        title={confirmBulkAction.title}
        description={confirmBulkAction.description}
        confirmText={
          confirmBulkAction.action === 'delete' ? "Удалить" : 
          confirmBulkAction.action === 'archive' ? (mode === 'active' ? "Архивировать" : "Восстановить") : 
          "Объединить"
        }
        variant={confirmBulkAction.action === 'delete' ? "destructive" : "default"}
      />
    </>
  );
};

export default ProductTabContent;
