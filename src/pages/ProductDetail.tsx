import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getProductById, getRelatedProducts } from "@/data/products";
import { Product } from "@/types/product";
import { useCart } from "@/context/CartContext";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ProductSkeleton from "@/components/products/ProductSkeleton";
import ProductNotFound from "@/components/products/ProductNotFound";
import ProductDetailContainer from "@/components/products/ProductDetailContainer";
import YandexMicrodata from "@/components/seo/YandexMicrodata";
import { SEOHead } from "@/components/seo/SEOHead";
import { trackPageView, trackProductView, trackAddToCart } from "@/utils/metrika";
import { getProductPrice } from "@/lib/Image-utils";
import { getProductStructuredData } from "@/components/seo/ProductMicrodata";
import { getYandexMetaTags } from "@/components/seo/YandexMicrodata";

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { addItem } = useCart();
  
  const [selectedColor, setSelectedColor] = useState<string | undefined>(undefined);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) {
        setError("ID товара не найден");
        setLoading(false);
        return;
      }
      
      console.log("Загружаю товар с ID:", id);
      setLoading(true);
      setError(null);
      setProduct(null);
      
      try {
        const productData = await getProductById(id);
        console.log("Товар загружен:", productData);
        
        if (!productData) {
          setError("Товар не найден");
          setProduct(null);
        } else {
          setProduct(productData);
          
          // Установка заголовка страницы для SEO
          document.title = `${productData.title} | The X Shop`;
          
          // Track product page view after data is loaded
          trackProductView({
            id: productData.id,
            name: productData.title,
            price: productData.discountPrice || productData.price,
            category: productData.category
          });
          
          // Set default color when product is loaded
          if (productData.colorVariants && productData.colorVariants.length > 0) {
            setSelectedColor(productData.colorVariants[0].color);
          } else if (productData.colors && productData.colors.length > 0) {
            setSelectedColor(productData.colors[0]);
          }
          
          // Load related products
          try {
            const related = await getRelatedProducts(id, 4);
            setRelatedProducts(related);
          } catch (relatedError) {
            console.error("Ошибка загрузки связанных товаров:", relatedError);
          }
        }
      } catch (error) {
        console.error("Ошибка загрузки товара:", error);
        setError("Ошибка загрузки товара");
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProduct();
  }, [id]);

  // Track page view when product ID changes
  useEffect(() => {
    if (id) {
      trackPageView();
    }
  }, [id]);

  const selectedColorVariant = product?.colorVariants?.find(
    v => v.color === selectedColor
  );

  const hasStock = () => {
    if (!product) return false;
    
    if (selectedColor && product.colorVariants?.length) {
      const variant = product.colorVariants.find(v => v.color === selectedColor);
      return variant?.stockQuantity !== undefined && variant.stockQuantity > 0;
    }
    
    return product.inStock && (product.stockQuantity !== undefined ? product.stockQuantity > 0 : true);
  };

  const handleColorChange = (color: string) => {
    setSelectedColor(color);
    setQuantity(1);
  };

  const handleAddToCart = () => {
    if (product && hasStock()) {
      addItem({
        product,
        quantity,
        color: selectedColor,
        selectedColorVariant
      });
      
      trackAddToCart({
        id: product.id,
        name: product.title,
        price: selectedColorVariant ? 
          (selectedColorVariant.discountPrice || selectedColorVariant.price) : 
          (product.discountPrice || product.price),
        category: product.category
      }, quantity);
    }
  };

  const getArticleNumber = () => {
    if (selectedColor && product?.colorVariants) {
      const variant = product.colorVariants.find(v => v.color === selectedColor);
      if (variant?.articleNumber) {
        return variant.articleNumber;
      }
    }
    return product?.articleNumber;
  };

  const displayArticleNumber = getArticleNumber();
  const displayPrice = product ? getProductPrice(product, selectedColor) : 0;

  if (loading) {
    return <ProductSkeleton />;
  }

  if (error || !product) {
    return <ProductNotFound />;
  }
 
   // Подготовка расширенной SEO данных для товара
  const productSEO = {
    title: `${product.title} - купить в The X Shop`,
    description: product.description ? 
      (product.description.length > 160 ? product.description.substring(0, 157) + '...' : product.description)
      : `${product.title} - купить в The X Shop. Доставка по всей России.`,
    keywords: `${product.title}, ${product.category}, купить ${product.title}, товары из Китая, интернет-магазин`,
    ogImage: product.imageUrl,
    ogType: 'product' as const,
  };
 
  // Получаем структурированные данные
  const { structuredData, breadcrumbData } = getProductStructuredData(
    product, 
    selectedColor, 
    displayPrice, 
    hasStock(), 
    displayArticleNumber
  );

  // Получаем Яндекс мета-теги
  const yandexMetaTags = getYandexMetaTags(
    product, 
    selectedColor, 
    displayPrice, 
    hasStock(), 
    displayArticleNumber
  );

  return (
    <div className="flex flex-col min-h-screen">
      <SEOHead 
        title={productSEO.title}
        description={productSEO.description}
        keywords={productSEO.keywords}
        ogImage={productSEO.ogImage}
        ogType={productSEO.ogType}
      >
        {/* JSON-LD микроразметка товара */}
        <script 
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData, null, 2)
          }}
        />
        
        {/* JSON-LD хлебные крошки */}
        <script 
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(breadcrumbData, null, 2)
          }}
        />

        {/* Яндекс и Open Graph мета-теги */}
        {yandexMetaTags.map((tag, index) => (
          tag.property ? (
            <meta key={index} property={tag.property} content={tag.content} />
          ) : (
            <meta key={index} name={tag.name} content={tag.content} />
          )
        ))}
      </SEOHead>

      <Navbar />

      <ProductDetailContainer
        product={product}
        relatedProducts={relatedProducts}
        selectedColor={selectedColor}
        displayPrice={displayPrice}
        hasStock={hasStock()}
        displayArticleNumber={displayArticleNumber}
        onColorChange={handleColorChange}
        onAddToCart={handleAddToCart}
        quantity={quantity}
        onQuantityChange={setQuantity}
        currentProductId={id}
      />

      <Footer />
    </div>
  );
};

export default ProductDetail;
