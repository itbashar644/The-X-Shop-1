
import React from 'react';
import { Search } from 'lucide-react';

interface SearchIconProps {
  onClick: () => void;
}

export const SearchIcon: React.FC<SearchIconProps> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="flex h-9 w-9 items-center justify-center rounded-md hover:bg-accent"
      aria-label="Поиск товаров"
    >
      <Search className="h-5 w-5" />
    </button>
  );
};
