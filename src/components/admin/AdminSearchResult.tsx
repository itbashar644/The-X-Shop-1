import React from 'react';
import { CheckCircle, AlertCircle, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface AdminSearchResultProps {
  result?: { 
    email: string; 
    isAdmin: boolean 
  };
  onSearch: (query: string) => void;
  onClear: () => void;
}

const AdminSearchResult: React.FC<AdminSearchResultProps> = ({ 
  result,
  onSearch,
  onClear 
}) => {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [isSearching, setIsSearching] = React.useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setIsSearching(true);
      onSearch(searchQuery);
    }
  };

  const handleClear = () => {
    setSearchQuery('');
    setIsSearching(false);
    onClear();
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Поиск пользователей по email..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button type="submit" variant="outline">
          Найти
        </Button>
        {isSearching && (
          <Button variant="ghost" onClick={handleClear}>
            <X className="h-4 w-4" />
          </Button>
        )}
      </form>

      {result && (
        <div className="rounded-md border p-4">
          <div className="flex items-center gap-3">
            {result.isAdmin ? (
              <CheckCircle className="h-5 w-5 text-green-500" />
            ) : (
              <AlertCircle className="h-5 w-5 text-amber-500" />
            )}
            <div>
              <p className="font-medium">{result.email}</p>
              <p className="text-sm text-muted-foreground">
                {result.isAdmin ? "Имеет права администратора" : "Не имеет прав администратора"}
              </p>
            </div>
          </div>
        </div>
      )}

      {isSearching && !result && (
        <div className="text-center py-8 text-muted-foreground">
          Пользователь не найден
        </div>
      )}
    </div>
  );
};

export default AdminSearchResult;