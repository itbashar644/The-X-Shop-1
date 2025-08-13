
import React from 'react';
import { useWishlist } from '@/context/WishlistContext';
import ProductGrid from '@/components/products/ProductGrid';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Heart, Trash2 } from 'lucide-react';

const Wishlist = () => {
  const { wishlist, clearWishlist } = useWishlist();
  
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <div className="container px-4 py-8 md:px-6 flex-grow">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Heart className="h-6 w-6" /> Избранное
            </h1>
            <p className="text-muted-foreground mt-1">
              {wishlist.length > 0
                ? `${wishlist.length} ${wishlist.length === 1 ? 'товар' : wishlist.length < 5 ? 'товара' : 'товаров'} в избранном`
                : 'Ваш список избранного пуст'}
            </p>
          </div>
          
          {wishlist.length > 0 && (
            <Button 
              variant="outline" 
              className="mt-4 md:mt-0 flex items-center gap-2"
              onClick={clearWishlist}
            >
              <Trash2 className="h-4 w-4" /> Очистить список
            </Button>
          )}
        </div>
        
        {wishlist.length > 0 ? (
          <ProductGrid products={wishlist} />
        ) : (
          <div className="py-16 text-center">
            <Heart className="mx-auto h-16 w-16 text-gray-300 mb-4" />
            <h2 className="text-xl font-semibold mb-2">В избранном пока ничего нет</h2>
            <p className="text-muted-foreground mb-6">Добавляйте понравившиеся товары в избранное, нажимая на значок сердца</p>
            <Button asChild>
              <a href="/catalog">Перейти в каталог</a>
            </Button>
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  );
};

export default Wishlist;
