
import { useEffect, useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';

const StaticProductRedirect = () => {
  const { filename } = useParams<{ filename: string }>();
  const [productId, setProductId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const loadProductMapping = async () => {
      if (!filename) {
        setLoading(false);
        return;
      }

      try {
        console.log('Processing filename:', filename);
        
        // Удаляем .html если есть
        const cleanFilename = filename.replace(/\.html$/, '');
        console.log('Clean filename:', cleanFilename);

        // Проверяем, является ли это прямым UUID (для старых ссылок)
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        if (uuidRegex.test(cleanFilename)) {
          console.log('Direct UUID detected:', cleanFilename);
          setProductId(cleanFilename);
          setLoading(false);
          return;
        }

        // Пытаемся извлечь slug из формата product-{slug}
        if (cleanFilename.startsWith('product-')) {
          const slug = cleanFilename.substring('product-'.length);
          console.log('Extracted slug from product- format:', slug);
          
          // Проверяем, не является ли slug UUID'ом
          if (uuidRegex.test(slug)) {
            console.log('Slug is UUID:', slug);
            setProductId(slug);
            setLoading(false);
            return;
          }

          // Загружаем маппинг для поиска ID по slug'у
          const response = await fetch('/product-mapping.json');
          if (!response.ok) {
            console.error('Failed to load product mapping');
            setLoading(false);
            return;
          }

          const mapping = await response.json();
          console.log('Product mapping loaded:', mapping);

          // Ищем продукт по slug'у
          const foundProductId = Object.keys(mapping).find(id => mapping[id] === slug);
          
          if (foundProductId) {
            console.log('Found product ID by slug:', foundProductId);
            setProductId(foundProductId);
          } else {
            console.log('Product not found in mapping for slug:', slug);
          }
        } else {
          console.log('Filename does not match expected patterns:', cleanFilename);
        }
      } catch (error) {
        console.error('Error loading product mapping:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProductMapping();
  }, [filename]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Загрузка...</p>
        </div>
      </div>
    );
  }

  if (!productId) {
    return <Navigate to="/catalog" replace />;
  }

  // Редиректим на правильный роут товара
  return <Navigate to={`/product/${productId}`} replace />;
};

export default StaticProductRedirect;
