
import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SearchForm } from "./SearchForm";

interface CatalogHeaderProps {
  categoryParam: string | null;
  searchTerm: string;
  colorParam: string | null;
  availableCategories: string[];
  sortBy: string;
  setSortBy: (value: string) => void;
  loading: boolean;
  handleSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSearchSubmit: (e: React.FormEvent) => void;
}

const CatalogHeader: React.FC<CatalogHeaderProps> = ({
  categoryParam,
  searchTerm,
  colorParam,
  availableCategories,
  sortBy,
  setSortBy,
  loading,
  handleSearchChange,
  handleSearchSubmit
}) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
      <h1 className="text-2xl font-bold">
        {categoryParam 
          ? availableCategories.includes(categoryParam) ? categoryParam : "Каталог"
          : searchTerm ? `Поиск: ${searchTerm}` : "Каталог товаров"}
        {colorParam && ` / Цвет: ${colorParam}`}
      </h1>
      <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4">
        <SearchForm
          searchTerm={searchTerm}
          handleSearchChange={handleSearchChange}
          handleSearchSubmit={handleSearchSubmit}
          loading={loading}
        />
        <Select 
          value={sortBy}
          onValueChange={setSortBy}
          disabled={loading}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Сортировать по" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="in-stock">Сначала в наличии</SelectItem>
            <SelectItem value="price-asc">Цена (по возрастанию)</SelectItem>
            <SelectItem value="price-desc">Цена (по убыванию)</SelectItem>
            <SelectItem value="name-asc">Название (А-Я)</SelectItem>
            <SelectItem value="name-desc">Название (Я-А)</SelectItem>
            <SelectItem value="rating">По рейтингу</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default CatalogHeader;
