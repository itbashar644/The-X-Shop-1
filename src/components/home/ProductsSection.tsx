
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import ProductGrid from '@/components/products/ProductGrid';
import { Product } from '@/types/product';

interface ProductsSectionProps {
  title: string;
  products: Product[];
  loading: boolean;
  className?: string;
  schemaType?: string;
}

const ProductsSection: React.FC<ProductsSectionProps> = ({ 
  title, 
  products, 
  loading, 
  className = "",
  schemaType = "https://schema.org/CollectionPage"
}) => {
  return (
    <section className={`py-12 ${className}`} itemScope itemType={schemaType}>
      <meta itemProp="name" content={`${title} The X Shop`} />
      <meta itemProp="description" content={`Раздел ${title} - качественные товары из Китая по доступным ценам`} />
      <div className="container px-4 md:px-6">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold" itemProp="headline">{title}</h2>
          <Button variant="link" asChild>
            <Link to="/catalog" itemProp="url">Смотреть все</Link>
          </Button>
        </div>
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-[300px] bg-gray-200 animate-pulse rounded-lg"></div>
            ))}
          </div>
        ) : (
          <div itemProp="mainEntity" itemScope itemType="https://schema.org/ItemList">
            <meta itemProp="itemListOrder" content="https://schema.org/ItemListOrderDescending" />
            <meta itemProp="numberOfItems" content={String(products.length)} />
            <ProductGrid products={products} />
            
            {/* Ссылка на статичную версию для роботов */}
            <div style={{ display: 'none' }}>
              <a href="/static-catalog.html" itemProp="url">Статичная версия каталога</a>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductsSection;
