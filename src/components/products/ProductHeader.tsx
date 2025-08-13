import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { trackPageView } from '@/utils/metrika';

interface ProductHeaderProps {
  title: string;
  category: string;
  isHit?: boolean;
  isBestseller?: boolean;
  isNew?: boolean;
}

const ProductHeader: React.FC<ProductHeaderProps> = ({ 
  title, 
  category,
  isHit = false,
  isBestseller = false,
  isNew = false
}) => {
  return (
    <div className="mb-6">
      <nav aria-label="Breadcrumb">
        <ol className="flex flex-wrap items-center text-sm">
          <li className="flex items-center">
            <Link 
              to="/" 
              className="text-muted-foreground hover:text-foreground flex items-center"
              onClick={() => trackPageView('/')}
            >
              <Home className="h-4 w-4 mr-1" />
              <span>Главная</span>
            </Link>
            <ChevronRight className="h-4 w-4 mx-2 text-muted-foreground" />
          </li>
          <li className="flex items-center">
            <Link 
              to="/catalog" 
              className="text-muted-foreground hover:text-foreground"
              onClick={() => trackPageView('/catalog')}
            >
              Каталог
            </Link>
            <ChevronRight className="h-4 w-4 mx-2 text-muted-foreground" />
          </li>
          {category && (
            <li className="flex items-center">
              <Link 
                to={`/catalog?category=${category}`} 
                className="text-muted-foreground hover:text-foreground"
                onClick={() => trackPageView(`/catalog?category=${category}`)}
              >
                {category}
              </Link>
              <ChevronRight className="h-4 w-4 mx-2 text-muted-foreground" />
            </li>
          )}
          <li className="text-foreground font-medium line-clamp-1">
            {title}
            {(isHit || isBestseller || isNew) && (
              <div className="flex gap-2 mt-1">
                {isHit && <span className="bg-red-500 text-white text-xs px-2 py-1 rounded">Хит</span>}
                {isBestseller && <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded">Бестселлер</span>}
                {isNew && <span className="bg-green-500 text-white text-xs px-2 py-1 rounded">Новинка</span>}
              </div>
            )}
          </li>
        </ol>
      </nav>
    </div>
  );
};

export default ProductHeader;