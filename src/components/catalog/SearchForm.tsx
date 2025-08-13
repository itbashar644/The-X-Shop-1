import React, { useState, useCallback, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter, X, Zap, Settings, Tag, DollarSign, Package } from "lucide-react";
import { useSearch } from "@/hooks/useSearch";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface SearchFormProps {
  searchTerm: string;
  handleSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSearchSubmit: (e: React.FormEvent) => void;
  loading: boolean;
  priceRange?: { min: number; max: number };
  onPriceRangeChange?: (range: { min: number; max: number }) => void;
  selectedCategory?: string | null;
  onCategoryChange?: (category: string | null) => void;
  availableCategories?: string[];
  inStockOnly?: boolean;
  onInStockChange?: (inStock: boolean) => void;
  sortBy?: string;
  onSortChange?: (sort: string) => void;
  searchInFields?: string[];
  onSearchInFieldsChange?: (fields: string[]) => void;
  caseSensitive?: boolean;
  onCaseSensitiveChange?: (caseSensitive: boolean) => void;
}

const POPULAR_SEARCHES_KEY = 'popular_searches';
const MAX_POPULAR_SEARCHES = 5;

export const SearchForm: React.FC<SearchFormProps> = ({
  searchTerm,
  handleSearchChange,
  handleSearchSubmit,
  loading,
  priceRange = { min: 0, max: 100000 },
  onPriceRangeChange,
  selectedCategory,
  onCategoryChange,
  availableCategories = [],
  inStockOnly = false,
  onInStockChange,
  sortBy = "relevance",
  onSortChange,
  searchInFields = ["title", "description", "category"],
  onSearchInFieldsChange,
  caseSensitive = false,
  onCaseSensitiveChange
}) => {
  const { searchInputRef } = useSearch();
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [showSearchOptions, setShowSearchOptions] = useState(false);
  const [popularSearches, setPopularSearches] = useState<string[]>([]);
  const [isPriceRangeValid, setIsPriceRangeValid] = useState(true);

  useEffect(() => {
    // Загружаем популярные запросы из localStorage
    const savedSearches = localStorage.getItem(POPULAR_SEARCHES_KEY);
    if (savedSearches) {
      try {
        setPopularSearches(JSON.parse(savedSearches));
      } catch (e) {
        console.error("Failed to parse popular searches", e);
      }
    }
  }, []);

  const updatePopularSearches = (term: string) => {
    if (!term.trim()) return;
    
    const updatedSearches = [
      term,
      ...popularSearches.filter(search => search !== term)
    ].slice(0, MAX_POPULAR_SEARCHES);
    
    setPopularSearches(updatedSearches);
    localStorage.setItem(POPULAR_SEARCHES_KEY, JSON.stringify(updatedSearches));
  };

  const handleSearchSubmitWithTracking = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      updatePopularSearches(searchTerm);
    }
    handleSearchSubmit(e);
  };

  const handlePriceRangeChange = (newRange: { min: number; max: number }) => {
    const isValid = newRange.min <= newRange.max;
    setIsPriceRangeValid(isValid);
    if (isValid && onPriceRangeChange) {
      onPriceRangeChange(newRange);
    }
  };

  const searchFieldOptions = [
    { value: "title", label: "Название", icon: Tag },
    { value: "description", label: "Описание", icon: Package },
    { value: "category", label: "Категория", icon: Filter },
    { value: "articleNumber", label: "Артикул", icon: Zap },
    { value: "barcode", label: "Штрихкод", icon: Zap }
  ];

  const handleClearFilters = useCallback(() => {
    if (onPriceRangeChange) onPriceRangeChange({ min: 0, max: 100000 });
    if (onCategoryChange) onCategoryChange(null);
    if (onInStockChange) onInStockChange(false);
    if (onSortChange) onSortChange("relevance");
    if (onCaseSensitiveChange) onCaseSensitiveChange(false);
    if (onSearchInFieldsChange) onSearchInFieldsChange(["title", "description", "category"]);
    setIsPriceRangeValid(true);
  }, [onPriceRangeChange, onCategoryChange, onInStockChange, onSortChange, onCaseSensitiveChange, onSearchInFieldsChange]);

  const handleSearchFieldToggle = useCallback((field: string) => {
    if (!onSearchInFieldsChange) return;
    
    const newFields = searchInFields.includes(field)
      ? searchInFields.filter(f => f !== field)
      : [...searchInFields, field];
    
    if (newFields.length > 0) {
      onSearchInFieldsChange(newFields);
    }
  }, [searchInFields, onSearchInFieldsChange]);

  const hasActiveFilters = 
    priceRange.min > 0 || 
    priceRange.max < 100000 || 
    selectedCategory || 
    inStockOnly || 
    sortBy !== "relevance" ||
    caseSensitive ||
    searchInFields.length !== 3;

  const formatPrice = (price: number) => {
    if (price >= 1000000) {
      return `${(price / 1000000).toFixed(1)}M₽`;
    } else if (price >= 1000) {
      return `${(price / 1000).toFixed(0)}K₽`;
    }
    return `${price}₽`;
  };

  const hasSearchFilters = searchTerm.trim().length > 0;

  return (
    <TooltipProvider>
      <div className="space-y-4">
        <form onSubmit={handleSearchSubmitWithTracking} className="flex gap-2 w-full">
          <div className="relative w-full">
            <Input
              ref={searchInputRef}
              type="search"
              placeholder="Поиск товаров по названию, описанию, категории..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full pr-20 border-primary/20 focus-visible:border-primary focus-visible:ring-primary/20 bg-background placeholder:text-muted-foreground/70 h-11"
              disabled={loading}
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground pointer-events-none">
              <Search className="h-5 w-5" />
            </div>
            <div className="absolute right-10 top-1/2 transform -translate-y-1/2 flex gap-1">
              {hasSearchFilters && (
                <Tooltip>
                  <TooltipTrigger>
                    <Badge variant="outline" className="h-5 px-1 text-xs">
                      Поиск
                    </Badge>
                  </TooltipTrigger>
                </Tooltip>
              )}
            </div>
          </div>
          
          <Button 
            type="submit" 
            disabled={loading}
            size="lg"
            className="h-11 px-6"
          >
            Найти
          </Button>
        </form>

        {popularSearches.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {popularSearches.map((search, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={() => {
                  const event = {
                    target: { value: search }
                  } as React.ChangeEvent<HTMLInputElement>;
                  handleSearchChange(event);
                }}
                className="h-8 text-xs"
              >
                {search}
              </Button>
            ))}
          </div>
        )}

        {showAdvancedFilters && (
          <div className="bg-muted/30 border border-border rounded-lg p-4 space-y-4 animate-in slide-in-from-top-2 duration-200">
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-sm flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Расширенные фильтры
              </h3>
              {hasActiveFilters && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClearFilters}
                  className="h-7 px-2 text-xs"
                >
                  <X className="h-3 w-3 mr-1" />
                  Очистить все
                </Button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                  <Filter className="h-3 w-3" />
                  Категория
                </label>
                <Select
                  value={selectedCategory || ""}
                  onValueChange={(value) => onCategoryChange?.(value || null)}
                >
                  <SelectTrigger className="h-9">
                    <SelectValue placeholder="Все категории" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Все категории</SelectItem>
                    {availableCategories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                  <DollarSign className="h-3 w-3" />
                  Цена от
                </label>
                <Input
                  type="number"
                  placeholder="0"
                  value={priceRange.min || ""}
                  onChange={(e) => {
                    const value = parseInt(e.target.value) || 0;
                    handlePriceRangeChange({ ...priceRange, min: value });
                  }}
                  className="h-9"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                  <DollarSign className="h-3 w-3" />
                  Цена до
                </label>
                <Input
                  type="number"
                  placeholder="100000"
                  value={priceRange.max === 100000 ? "" : priceRange.max}
                  onChange={(e) => {
                    const value = parseInt(e.target.value) || 100000;
                    handlePriceRangeChange({ ...priceRange, max: value });
                  }}
                  className="h-9"
                />
                {!isPriceRangeValid && (
                  <p className="text-xs text-red-500">Максимальная цена должна быть больше минимальной</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                  <Zap className="h-3 w-3" />
                  Сортировка
                </label>
                <Select value={sortBy} onValueChange={onSortChange}>
                  <SelectTrigger className="h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="relevance">По релевантности</SelectItem>
                    <SelectItem value="price-asc">Цена: по возрастанию</SelectItem>
                    <SelectItem value="price-desc">Цена: по убыванию</SelectItem>
                    <SelectItem value="name-asc">Название: А-Я</SelectItem>
                    <SelectItem value="name-desc">Название: Я-А</SelectItem>
                    <SelectItem value="newest">Сначала новые</SelectItem>
                    <SelectItem value="popular">По популярности</SelectItem>
                    <SelectItem value="in-stock">В наличии</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center space-x-4 pt-2">
              <div className="flex items-center space-x-2">
                <Switch
                  id="in-stock-only"
                  checked={inStockOnly}
                  onCheckedChange={onInStockChange}
                />
                <Label htmlFor="in-stock-only" className="text-sm">
                  Только в наличии
                </Label>
              </div>
            </div>

            {hasActiveFilters && (
              <div className="flex flex-wrap gap-2 pt-2 border-t">
                {priceRange.min > 0 && (
                  <Badge variant="secondary" className="text-xs">
                    От {formatPrice(priceRange.min)}
                  </Badge>
                )}
                {priceRange.max < 100000 && (
                  <Badge variant="secondary" className="text-xs">
                    До {formatPrice(priceRange.max)}
                  </Badge>
                )}
                {selectedCategory && (
                  <Badge variant="secondary" className="text-xs">
                    {selectedCategory}
                  </Badge>
                )}
                {inStockOnly && (
                  <Badge variant="secondary" className="text-xs">
                    В наличии
                  </Badge>
                )}
                {hasSearchFilters && (
                  <Badge variant="secondary" className="text-xs">
                    Поиск
                  </Badge>
                )}
                {caseSensitive && (
                  <Badge variant="secondary" className="text-xs">
                    Регистр
                  </Badge>
                )}
                {sortBy !== "relevance" && (
                  <Badge variant="secondary" className="text-xs">
                    {sortBy === "price-asc" && "Цена ↑"}
                    {sortBy === "price-desc" && "Цена ↓"}
                    {sortBy === "name-asc" && "А-Я"}
                    {sortBy === "name-desc" && "Я-А"}
                    {sortBy === "newest" && "Новые"}
                    {sortBy === "popular" && "Популярные"}
                    {sortBy === "in-stock" && "В наличии"}
                  </Badge>
                )}
              </div>
            )}
          </div>
        )}

        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            className="h-8 px-3 text-xs"
          >
            <Filter className="h-3 w-3 mr-1" />
            {showAdvancedFilters ? "Скрыть фильтры" : "Показать фильтры"}
          </Button>
        </div>
      </div>
    </TooltipProvider>
  );
};