import React, { useState } from 'react';
import { Product } from "@/types/product";
import ProductMicrodata from "@/components/seo/ProductMicrodata";
import ProductHeader from "@/components/products/ProductHeader";
import ProductDetails from "@/components/products/ProductDetails";
import RelatedProducts from "@/components/products/RelatedProducts";

interface ProductDetailContainerProps {
  product: Product;
  relatedProducts: Product[];
  selectedColor?: string;
  displayPrice: number;
  hasStock: boolean;
  displayArticleNumber?: string;
  onColorChange: (color: string) => void;
  onAddToCart: () => void;
  quantity: number;
  onQuantityChange: (quantity: number) => void;
  currentProductId?: string;
}

const ProductDetailContainer: React.FC<ProductDetailContainerProps> = ({
  product,
  relatedProducts,
  selectedColor,
  displayPrice,
  hasStock,
  displayArticleNumber,
  onColorChange,
  onAddToCart,
  quantity,
  onQuantityChange,
  currentProductId
}) => {
  // Локальный стейт для выбранного таба в ProductDetails
  const [selectedTab, setSelectedTab] = useState<string>("description");

  return (
    <main className="flex-grow container px-4 py-8 md:px-6" itemScope itemType="https://schema.org/Product">
      {/* Основные Schema.org атрибуты для товара */}
      <meta itemProp="name" content={product.title} />
      <meta itemProp="description" content={product.description || product.title} />
      <meta itemProp="image" content={`/images/${product.imageUrl}` || 'not-found.jpg'} />
      <meta itemProp="sku" content={displayArticleNumber || product.id} />
      <meta itemProp="mpn" content={displayArticleNumber || product.id} />
      <meta itemProp="category" content={product.category} />

      {/* Бренд */}
      <div itemProp="brand" itemScope itemType="https://schema.org/Brand" style={{ display: 'none' }}>
        <meta itemProp="name" content="The X Shop" />
      </div>

      {/* Производитель */}
      <div itemProp="manufacturer" itemScope itemType="https://schema.org/Organization" style={{ display: 'none' }}>
        <meta itemProp="name" content="The X Shop" />
      </div>

      {/* Рейтинг */}
      <div itemProp="aggregateRating" itemScope itemType="https://schema.org/AggregateRating" style={{ display: 'none' }}>
        <meta itemProp="ratingValue" content={product.rating?.toString() || "4.8"} />
        <meta itemProp="bestRating" content="5" />
        <meta itemProp="worstRating" content="1" />
        <meta itemProp="ratingCount" content="47" />
      </div>

      {/* Предложение */}
      <div itemProp="offers" itemScope itemType="https://schema.org/Offer" style={{ display: 'none' }}>
        <link itemProp="url" href={typeof window !== 'undefined' ? window.location.href : `https://the-x.shop/product/${product.id}`} />
        <meta itemProp="priceCurrency" content="RUB" />
        <meta itemProp="price" content={displayPrice?.toString() || product.price.toString()} />
        <meta itemProp="priceValidUntil" content={new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]} />
        <link itemProp="availability" href={hasStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock"} />
        <link itemProp="itemCondition" href="https://schema.org/NewCondition" />

        <div itemProp="seller" itemScope itemType="https://schema.org/Organization">
          <meta itemProp="name" content="The X Shop" />
          <link itemProp="url" href="https://the-x.shop" />
        </div>
      </div>

      {/* Микроразметка товара - дополнительные скрытые данные */}
      <ProductMicrodata
        product={product}
        selectedColor={selectedColor}
        displayPrice={displayPrice}
        hasStock={hasStock}
        displayArticleNumber={displayArticleNumber}
      />

      <ProductHeader title={product.title} category={product.category} />
      
      {/* Здесь должен быть компонент, который содержит основной интерфейс с выбором цвета, добавлением в корзину и количеством */}
      {/* В твоём коде он назывался ProductDetailsSection, но ты его сюда не вставлял */}
      {/* Если он есть, добавь его тут и передай необходимые пропсы */}

      {/* Описание и характеристики с табами */}
      <div itemProp="description">
        <ProductDetails
          product={product}
          selectedTab={selectedTab}
          setSelectedTab={setSelectedTab}
        />
      </div>

      {/* Связанные товары */}
      <RelatedProducts products={relatedProducts} currentProductId={currentProductId} />
    </main>
  );
};

export default ProductDetailContainer;
