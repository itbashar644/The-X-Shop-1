
import React from 'react';
import { Product } from "@/types/product";

interface ProductMicrodataProps {
  product: Product;
  selectedColor?: string;
  displayPrice: number;
  hasStock: boolean;
  displayArticleNumber?: string;
}

export const getProductStructuredData = (
  product: Product,
  selectedColor?: string,
  displayPrice?: number,
  hasStock?: boolean,
  displayArticleNumber?: string
) => {
  // Создаем структурированные данные для поисковых систем
  const structuredData = {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": product.title,
    "description": product.description,
    "image": [
      product.imageUrl,
      ...(product.additionalImages || [])
    ].filter(Boolean),
    "sku": displayArticleNumber || product.id,
    "mpn": displayArticleNumber || product.id,
    "brand": {
      "@type": "Brand",
      "name": "The X Shop"
    },
    "manufacturer": {
      "@type": "Organization", 
      "name": "The X Shop"
    },
    "category": product.category,
    "offers": {
      "@type": "Offer",
      "url": typeof window !== 'undefined' ? window.location.href : `https://the-x.shop/product/${product.id}`,
      "priceCurrency": "RUB",
      "price": displayPrice?.toString() || product.price.toString(),
      "priceValidUntil": new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      "availability": hasStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      "itemCondition": "https://schema.org/NewCondition",
      "seller": {
        "@type": "Organization",
        "name": "The X Shop",
        "url": "https://the-x.shop"
      }
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": product.rating?.toString() || "4.8",
      "bestRating": "5",
      "worstRating": "1", 
      "ratingCount": "47"
    }
  };

  // Хлебные крошки
  const breadcrumbData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList", 
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Главная",
        "item": "https://the-x.shop"
      },
      {
        "@type": "ListItem", 
        "position": 2,
        "name": "Каталог",
        "item": "https://the-x.shop/catalog"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": product.category,
        "item": `https://the-x.shop/catalog?category=${encodeURIComponent(product.category)}`
      },
      {
        "@type": "ListItem",
        "position": 4,
        "name": product.title,
        "item": typeof window !== 'undefined' ? window.location.href : `https://the-x.shop/product/${product.id}`
      }
    ]
  };

  return { structuredData, breadcrumbData };
};

const ProductMicrodata: React.FC<ProductMicrodataProps> = ({
  product,
  selectedColor,
  displayPrice,
  hasStock,
  displayArticleNumber
}) => {
  return (
    <>
      {/* Скрытые мета-теги для микроразметки */}
      <div style={{ display: 'none' }}>
        <span itemProp="name">{product.title}</span>
        <span itemProp="description">{product.description}</span>
        <span itemProp="image">{product.imageUrl}</span>
        <span itemProp="sku">{displayArticleNumber || product.id}</span>
        <span itemProp="mpn">{displayArticleNumber || product.id}</span>
        <span itemProp="category">{product.category}</span>
        
        <div itemProp="brand" itemScope itemType="https://schema.org/Brand">
          <span itemProp="name">The X Shop</span>
        </div>
        
        <div itemProp="aggregateRating" itemScope itemType="https://schema.org/AggregateRating">
          <span itemProp="ratingValue">{product.rating?.toString() || "4.8"}</span>
          <span itemProp="bestRating">5</span>
          <span itemProp="worstRating">1</span>
          <span itemProp="ratingCount">47</span>
        </div>
        
        <div itemProp="offers" itemScope itemType="https://schema.org/Offer">
          <span itemProp="priceCurrency">RUB</span>
          <span itemProp="price">{displayPrice?.toString() || product.price.toString()}</span>
          <link itemProp="availability" href={hasStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock"} />
          <link itemProp="itemCondition" href="https://schema.org/NewCondition" />
          <span itemProp="priceValidUntil">{new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}</span>
          
          <div itemProp="seller" itemScope itemType="https://schema.org/Organization">
            <span itemProp="name">The X Shop</span>
            <span itemProp="url">https://the-x.shop</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductMicrodata;
