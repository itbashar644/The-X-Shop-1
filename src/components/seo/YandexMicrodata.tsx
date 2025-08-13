
import React from 'react';
import { Product } from "@/types/product";

interface YandexMicrodataProps {
  product: Product;
  selectedColor?: string;
  displayPrice: number;
  hasStock: boolean;
  displayArticleNumber?: string;
}

export const getYandexMetaTags = (
  product: Product,
  selectedColor?: string,
  displayPrice?: number,
  hasStock?: boolean,
  displayArticleNumber?: string
) => {
  const baseUrl = 'https://the-x.shop';
  const productUrl = `${baseUrl}/product/${product.id}`;
  
  return [
    { name: "yandex-verification", content: "товар" },
    { property: "product:price:amount", content: displayPrice?.toString() || product.price.toString() },
    { property: "product:price:currency", content: "RUB" },
    { property: "product:availability", content: hasStock ? "in stock" : "out of stock" },
    { property: "product:condition", content: "new" },
    { property: "product:brand", content: "The X Shop" },
    { property: "product:retailer_item_id", content: displayArticleNumber || product.id },
    { property: "og:type", content: "product" },
    { property: "og:title", content: `${product.title} - The X Shop` },
    { property: "og:description", content: product.description || `${product.title} - купить в The X Shop. Доставка по всей России.` },
    { property: "og:image", content: product.imageUrl.startsWith('http') ? product.imageUrl : `${baseUrl}${product.imageUrl}` },
    { property: "og:url", content: productUrl },
    { property: "og:site_name", content: "The X Shop" },
    { property: "product:category", content: product.category },
  ];
};

const YandexMicrodata: React.FC<YandexMicrodataProps> = ({
  product,
  selectedColor,
  displayPrice,
  hasStock,
  displayArticleNumber
}) => {
  return null; // Этот компонент теперь только экспортирует утилиты
};

export default YandexMicrodata;
