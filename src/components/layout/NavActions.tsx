import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { Menu, Heart, ShoppingCart, User, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

// Заглушка для AdminSearchResult, если нужен — добавить в проект отдельно
const AdminSearchResult = ({
  onSearch,
  onClear,
}: {
  onSearch: (query: string) => void;
  onClear: () => void;
}) => {
  // Заглушка: можно реализовать позже
  return <div>Функция поиска пока не реализована</div>;
};

interface NavActionsProps {
  onToggleMenu: () => void;
  onAdminSearch?: (query: string) => void;
  onOpenSearch?: () => void; // добавим, если нужно
}

export const NavActions: React.FC<NavActionsProps> = ({
  onToggleMenu,
  onAdminSearch,
  onOpenSearch,
}) => {
  const { user } = useAuth();
  const { items } = useCart();
  const { wishlist } = useWishlist();

  const cartCount = items?.length || 0;
  const wishlistCount = wishlist?.length || 0;
  const isAdmin = user?.roles?.includes('admin'); // проверка на роль admin

  return (
    <div className="flex items-center gap-1 md:gap-2">
      {/* Кнопка поиска для админов */}
      {isAdmin && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <Search className="h-5 w-5" />
              <span className="sr-only">Поиск пользователей</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-80 p-4" align="end">
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Поиск пользователей</h3>
              <p className="text-sm text-muted-foreground">
                Введите email для проверки прав администратора
              </p>
              {onAdminSearch && (
                <AdminSearchResult onSearch={onAdminSearch} onClear={() => {}} />
              )}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      )}

      {onOpenSearch && (
        <Button variant="ghost" size="icon" onClick={onOpenSearch} className="md:inline-flex hidden">
          <Search className="h-5 w-5" />
          <span className="sr-only">Поиск</span>
        </Button>
      )}

      <Link
        to="/wishlist"
        className="relative flex h-9 w-9 items-center justify-center rounded-md hover:bg-accent"
      >
        <Heart className="h-5 w-5" />
        {wishlistCount > 0 && (
          <span className="absolute right-0 top-0 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-xs text-white">
            {wishlistCount}
          </span>
        )}
      </Link>

      <Link
        to="/cart"
        className="relative flex h-9 w-9 items-center justify-center rounded-md hover:bg-accent"
      >
        <ShoppingCart className="h-5 w-5" />
        {cartCount > 0 && (
          <span className="absolute right-0 top-0 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-xs text-white">
            {cartCount}
          </span>
        )}
      </Link>

      <Link
        to={user ? '/account' : '/login'}
        className="flex h-9 w-9 items-center justify-center rounded-md hover:bg-accent"
      >
        <User className="h-5 w-5" />
      </Link>

      <Button variant="ghost" size="icon" className="md:hidden" onClick={onToggleMenu}>
        <Menu className="h-5 w-5" />
        <span className="sr-only">Toggle menu</span>
      </Button>
    </div>
  );
};
