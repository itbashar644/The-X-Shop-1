
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, ArrowRight } from "lucide-react";

interface SearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const SearchDialog = ({ open, onOpenChange }: SearchDialogProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/catalog?search=${encodeURIComponent(searchTerm.trim())}`);
      onOpenChange(false);
      setSearchTerm("");
    }
  };

  const quickSearches = [
    "Платья",
    "Джинсы", 
    "Обувь",
    "Аксессуары",
    "Куртки"
  ];

  const handleQuickSearch = (term: string) => {
    navigate(`/catalog?search=${encodeURIComponent(term)}`);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Поиск товаров</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              type="text"
              placeholder="Введите название товара..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4"
              autoFocus
            />
          </div>
          
          <div className="flex justify-between items-center">
            <Button type="submit" disabled={!searchTerm.trim()}>
              <Search className="h-4 w-4 mr-2" />
              Найти
            </Button>
            <Button 
              type="button" 
              variant="outline"
              onClick={() => {
                navigate('/catalog');
                onOpenChange(false);
              }}
            >
              Перейти к каталогу
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </form>

        <div className="space-y-3">
          <h4 className="text-sm font-medium text-muted-foreground">Популярные запросы</h4>
          <div className="flex flex-wrap gap-2">
            {quickSearches.map((term) => (
              <Button
                key={term}
                variant="secondary"
                size="sm"
                onClick={() => handleQuickSearch(term)}
                className="text-xs"
              >
                {term}
              </Button>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
