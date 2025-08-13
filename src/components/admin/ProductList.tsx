
import React, { useState } from "react";
import { Table, TableBody } from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Product } from "@/types/product";
import ProductTableHeader, { SortField } from "./products/table/ProductTableHeader";
import ProductTableRow from "./products/table/ProductTableRow";

interface ProductListProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (productId: string) => void;
  deleteButtonText?: string;
  deleteButtonColor?: "red" | "green" | "orange";
  onPermanentDelete?: (productId: string) => void;
  mode?: "active" | "archived";
  selectedProducts?: string[];
  onSelectProduct?: (productId: string, selected: boolean) => void;
  onSelectAll?: (selected: boolean) => void;
}

const ProductList = ({ 
  products, 
  onEdit, 
  onDelete,
  deleteButtonText = "Удалить",
  deleteButtonColor = "red",
  onPermanentDelete,
  mode = "active",
  selectedProducts = [],
  onSelectProduct,
  onSelectAll
}: ProductListProps) => {
  const [sortField, setSortField] = useState<SortField>("title");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  
  // Sort products based on the selected field and direction
  const sortedProducts = [...products].sort((a, b) => {
    let aValue, bValue;
    
    switch (sortField) {
      case "id":
        aValue = a.id;
        bValue = b.id;
        break;
      case "articleNumber":
        aValue = a.articleNumber || "";
        bValue = b.articleNumber || "";
        break;
      case "title":
        aValue = a.title;
        bValue = b.title;
        break;
      case "modelName":
        aValue = a.modelName || "";
        bValue = b.modelName || "";
        break;
      case "category":
        aValue = a.category;
        bValue = b.category;
        break;
      case "price":
        aValue = a.discountPrice || a.price;
        bValue = b.discountPrice || b.price;
        break;
      case "stockQuantity":
        aValue = a.stockQuantity || 0;
        bValue = b.stockQuantity || 0;
        break;
      default:
        aValue = a.title;
        bValue = b.title;
    }
    
    if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
    if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

  // Handle column sorting
  const handleSort = (field: SortField) => {
    if (field === sortField) {
      // Toggle direction if clicking on the same field
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      // Set new field and default to ascending
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Calculate if all products are selected
  const allSelected = products.length > 0 && selectedProducts?.length === products.length;
  const someSelected = selectedProducts && selectedProducts.length > 0 && selectedProducts.length < products.length;

  // Handle select all checkbox change
  const handleSelectAllChange = (checked: boolean) => {
    if (onSelectAll) {
      onSelectAll(checked);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {mode === "active" ? "Список товаров" : "Архив товаров"}
        </CardTitle>
        <CardDescription>
          Всего товаров: {products.length}
          {selectedProducts && selectedProducts.length > 0 && (
            <span className="ml-2">| Выбрано: {selectedProducts.length}</span>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="border rounded-md">
          <Table>
            <ProductTableHeader 
              onSelectProduct={!!onSelectProduct}
              sortField={sortField}
              sortDirection={sortDirection}
              handleSort={handleSort}
              allSelected={allSelected}
              someSelected={someSelected}
              handleSelectAllChange={handleSelectAllChange}
            />
            <TableBody>
              {sortedProducts.length === 0 ? (
                <tr>
                  <td colSpan={onSelectProduct ? 12 : 11} className="text-center py-4">
                    {mode === "active" ? "Товары не найдены" : "Архив пуст"}
                  </td>
                </tr>
              ) : (
                sortedProducts.map((product) => (
                  <ProductTableRow
                    key={product.id}
                    product={product}
                    onSelectProduct={onSelectProduct}
                    isSelected={selectedProducts?.includes(product.id)}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onPermanentDelete={onPermanentDelete}
                    deleteButtonText={deleteButtonText}
                    deleteButtonColor={deleteButtonColor}
                    mode={mode}
                  />
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductList;
