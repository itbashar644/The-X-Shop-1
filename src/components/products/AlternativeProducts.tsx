
import { useState, useEffect } from 'react';
import { getRelatedProducts } from '@/data/products';
import ProductGrid from './ProductGrid';
import { Product } from '@/types/product';

interface AlternativeProductsProps {
  productId: string;
  title?: string;
  limit?: number;
}

const AlternativeProducts = ({ productId, title = "Альтернативные товары", limit = 4 }: AlternativeProductsProps) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadRelatedProducts = async () => {
      try {
        setLoading(true);
        const relatedProducts = await getRelatedProducts(productId, limit);
        setProducts(relatedProducts);
      } catch (error) {
        console.error("Ошибка при загрузке альтернативных товаров:", error);
      } finally {
        setLoading(false);
      }
    };

    loadRelatedProducts();
  }, [productId, limit]);

  if (loading) {
    return (
      <div className="mt-10">
        <h3 className="text-lg font-medium mb-4">{title}</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {Array.from({ length: limit }).map((_, index) => (
            <div key={index} className="h-[250px] animate-pulse bg-gray-200 rounded-md"></div>
          ))}
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return null;
  }

  return (
    <div className="mt-10">
      <ProductGrid products={products} title={title} limit={limit} showExpand={true} />
    </div>
  );
};

export default AlternativeProducts;
