
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
  ogType?: 'website' | 'article' | 'product';
  canonicalUrl?: string;
  noindex?: boolean;
  children?: React.ReactNode;
}

export const SEOHead: React.FC<SEOProps> = ({
  title,
  description = 'The X Shop: Товары из Китая для вашего дома. Минималистичный дизайн, высокое качество, доступные цены.',
  keywords = 'товары из Китая, минималистичный дизайн, товары для дома, доступные цены',
  ogImage = '/lovable-uploads/20f4bfd6-6f1c-40b7-9d9c-9b1be8939979.png',
  ogType = 'website',
  canonicalUrl,
  noindex = false,
  children,
}) => {
  const location = useLocation();
  const domain = 'https://the-x.shop';
  const currentPath = location.pathname;
  const fullUrl = canonicalUrl || `${domain}${currentPath}`;
  const fullTitle = title ? `${title} | The X Shop` : 'The X Shop';
  
  return (
    <Helmet>
      {/* Базовые мета-теги */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      
      {/* Canonical URL для предотвращения дублирования контента */}
      <link rel="canonical" href={fullUrl} />
      
      {/* Альтернативная статичная страница для роботов */}
      <link rel="alternate" type="text/html" href={`${domain}/static-catalog.html`} />
      
      {/* Open Graph мета-теги для социальных сетей */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:image" content={ogImage.startsWith('http') ? ogImage : `${domain}${ogImage}`} />
      <meta property="og:site_name" content="The X Shop" />
      
      {/* Twitter мета-теги */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage.startsWith('http') ? ogImage : `${domain}${ogImage}`} />
      
      {/* Указания для индексации */}
      {noindex ? (
        <meta name="robots" content="noindex, nofollow" />
      ) : (
        <meta name="robots" content="index, follow" />
      )}
      
      {/* Дополнительные мета-теги */}
      <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
      
      {/* Дополнительные теги, переданные в компонент */}
      {children}
    </Helmet>
  );
};
