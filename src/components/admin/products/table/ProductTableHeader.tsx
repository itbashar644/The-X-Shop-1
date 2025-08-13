
import React from "react";
import { TableHead, TableRow, TableHeader } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowUpDown } from "lucide-react";

export type SortField = "id" | "articleNumber" | "title" | "modelName" | "category" | "price" | "stockQuantity";

interface ProductTableHeaderProps {
  onSelectProduct?: boolean;
  sortField: SortField;
  sortDirection: "asc" | "desc";
  handleSort: (field: SortField) => void;
  allSelected: boolean;
  someSelected: boolean;
  handleSelectAllChange: (checked: boolean) => void;
}

const ProductTableHeader = ({
  onSelectProduct,
  sortField,
  sortDirection,
  handleSort,
  allSelected,
  someSelected,
  handleSelectAllChange
}: ProductTableHeaderProps) => {
  // Get sort icon for column header
  const getSortIcon = (field: SortField) => {
    if (field === sortField) {
      return (
        <ArrowUpDown className={`ml-2 h-4 w-4 inline ${sortDirection === "desc" ? "transform rotate-180" : ""}`} />
      );
    }
    return <ArrowUpDown className="ml-2 h-4 w-4 text-gray-300 inline" />;
  };

  return (
    <TableHeader>
      <TableRow>
        {onSelectProduct && (
          <TableHead className="w-12">
            <Checkbox 
              checked={allSelected}
              indeterminate={someSelected}
              onCheckedChange={handleSelectAllChange}
              aria-label="Выбрать все товары"
            />
          </TableHead>
        )}
        <TableHead className="cursor-pointer" onClick={() => handleSort("id")}>
          ID {getSortIcon("id")}
        </TableHead>
        <TableHead className="w-16">Фото</TableHead>
        <TableHead className="cursor-pointer" onClick={() => handleSort("articleNumber")}>
          Артикул {getSortIcon("articleNumber")}
        </TableHead>
        <TableHead className="cursor-pointer" onClick={() => handleSort("title")}>
          Название {getSortIcon("title")}
        </TableHead>
        <TableHead className="cursor-pointer" onClick={() => handleSort("modelName")}>
          Модель {getSortIcon("modelName")}
        </TableHead>
        <TableHead className="cursor-pointer" onClick={() => handleSort("category")}>
          Категория {getSortIcon("category")}
        </TableHead>
        <TableHead className="cursor-pointer" onClick={() => handleSort("price")}>
          Цена (₽) {getSortIcon("price")}
        </TableHead>
        <TableHead className="cursor-pointer" onClick={() => handleSort("stockQuantity")}>
          Остаток {getSortIcon("stockQuantity")}
        </TableHead>
        <TableHead>Статус</TableHead>
        <TableHead>Маркетплейсы</TableHead>
        <TableHead className="text-right">Действия</TableHead>
      </TableRow>
    </TableHeader>
  );
};

export default ProductTableHeader;
