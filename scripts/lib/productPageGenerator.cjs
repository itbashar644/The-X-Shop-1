const fs = require('fs');
const path = require('path');

class ProductPageGenerator {
  constructor() {
    this.baseUrl = 'https://the-x.shop';
    this.publicDir = path.join(__dirname, '../../public');
    this.organizationInfo = {
      name: "The X Shop",
      address: "Россия, Москва",
      telephone: "+7 (800) 123-45-67",
      url: "https://the-x.shop"
    };
  }

  // Генерация JSON-LD разметки для товара
  generateJsonLD(product) {
    const images = this.getProductImages(product);
    
    return {
      "@context": "https://schema.org/",
      "@type": "Product",
      "name": product.title,
      "image": images,
      "description": product.description,
      "sku": product.article_number || `product-${product.id}`,
      "mpn": product.article_number || `product-${product.id}`,
      "brand": {
        "@type": "Brand",
        "name": "The X Shop"
      },
      "manufacturer": {
        "@type": "Organization",
        "name": "The X Shop",
        "address": this.organizationInfo.address,
        "telephone": this.organizationInfo.telephone,
        "url": this.organizationInfo.url
      },
      "category": product.category,
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": product.rating?.toString() || "4.8",
        "bestRating": "5",
        "worstRating": "1",
        "ratingCount": "47"
      },
      "offers": {
        "@type": "Offer",
        "url": `${this.baseUrl}/product-${product.id}.html`,
        "priceCurrency": "RUB",
        "price": product.price?.toString() || "0",
        "priceValidUntil": this.getFutureDate(),
        "availability": product.in_stock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
        "itemCondition": "https://schema.org/NewCondition",
        "seller": {
          "@type": "Organization",
          "name": "The X Shop",
          "address": this.organizationInfo.address,
          "telephone": this.organizationInfo.telephone,
          "url": this.organizationInfo.url
        }
      }
    };
  }

  // Генерация хлебных крошек
  generateBreadcrumbsJsonLD(product) {
    return {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Главная",
          "item": this.baseUrl
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Каталог",
          "item": `${this.baseUrl}/catalog`
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": product.category,
          "item": `${this.baseUrl}/catalog?category=${encodeURIComponent(product.category)}`
        },
        {
          "@type": "ListItem",
          "position": 4,
          "name": product.title,
          "item": `${this.baseUrl}/product-${product.id}.html`
        }
      ]
    };
  }

  // Получение изображений товара
  getProductImages(product) {
    const images = [];
    
    if (product.image_url && product.image_url !== '/placeholder.svg') {
      images.push(product.image_url);
    }
    
    if (product.additional_images && Array.isArray(product.additional_images)) {
      product.additional_images.forEach(img => {
        if (img && img !== '/placeholder.svg') {
          images.push(img);
        }
      });
    }
    
    // Если нет изображений, используем заглушку
    if (images.length === 0) {
      images.push(`${this.baseUrl}/images/placeholder-product.jpg`);
    }
    
    return images;
  }

  // Получение даты на год вперед
  getFutureDate() {
    const date = new Date();
    date.setFullYear(date.getFullYear() + 1);
    return date.toISOString();
  }

  // Форматирование цены
  formatPrice(price) {
    return Number(price).toFixed(0);
  }

  // Генерация дополнительных изображений
  generateAdditionalImages(product) {
    const images = this.getProductImages(product);
    if (images.length <= 1) return '';
    
    const additionalImages = images.slice(1);
    return `
      <div style="margin-top: 10px; display: grid; grid-template-columns: repeat(auto-fit, minmax(100px, 1fr)); gap: 10px;">
        ${additionalImages.map(img => 
          `<img src="${img}" alt="${product.title}" style="width: 100%; height: auto; border-radius: 4px;" itemprop="image">`
        ).join('')}
      </div>
    `;
  }

  // Генерация характеристик
  generateSpecifications(product) {
    if (!product.specifications || typeof product.specifications !== 'object') {
      return '';
    }

    return `
      <div class="specs">
        <h3>Характеристики</h3>
        <dl>
          ${Object.entries(product.specifications).map(([key, value]) => `
            <dt>${key}</dt>
            <dd>${value}</dd>
          `).join('')}
        </dl>
      </div>
    `;
  }

  // Генерация HTML страницы товара
  generateProductHTML(product) {
    const images = this.getProductImages(product);
    const mainImage = images[0];
    const jsonLD = this.generateJsonLD(product);
    const breadcrumbsJsonLD = this.generateBreadcrumbsJsonLD(product);
    
    const price = this.formatPrice(product.price);
    const originalPrice = product.discount_price ? this.formatPrice(product.discount_price) : price;
    
    return `<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${product.title} - купить в The X Shop</title>
    <meta name="description" content="${product.description.substring(0, 160)}">
    <meta name="keywords" content="${product.title}, ${product.category}, купить ${product.title}, товары из Китая, интернет-магазин">
    
    <!-- Open Graph -->
    <meta property="og:title" content="${product.title} - The X Shop">
    <meta property="og:description" content="${product.description}">
    <meta property="og:image" content="${mainImage}">
    <meta property="og:type" content="product">
    <meta property="og:url" content="${this.baseUrl}/product-${product.id}.html">
    
    <!-- Canonical URL -->
    <link rel="canonical" href="${this.baseUrl}/product-${product.id}.html">
    
    <!-- Микроразметка Schema.org для товара (JSON-LD) -->
    <script type="application/ld+json">
    ${JSON.stringify(jsonLD, null, 4)}
    </script>
    
    <!-- Микроразметка хлебных крошек -->
    <script type="application/ld+json">
    ${JSON.stringify(breadcrumbsJsonLD, null, 4)}
    </script>
    
    <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background: #f5f5f5; }
        .container { max-width: 1200px; margin: 0 auto; background: white; border-radius: 8px; padding: 20px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .product-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; margin-bottom: 40px; }
        .product-image { width: 100%; height: auto; border-radius: 8px; }
        .price { font-size: 24px; font-weight: bold; color: #e74c3c; margin: 10px 0; }
        .original-price { text-decoration: line-through; color: #666; margin-left: 10px; }
        .stock-status { padding: 5px 10px; border-radius: 4px; margin: 10px 0; }
        .in-stock { background: #d4edda; color: #155724; }
        .out-of-stock { background: #f8d7da; color: #721c24; }
        .breadcrumb { margin-bottom: 20px; color: #666; }
        .breadcrumb a { color: #007bff; text-decoration: none; }
        .specs { margin-top: 20px; }
        .specs dt { font-weight: bold; margin-top: 10px; }
        .specs dd { margin-left: 20px; margin-bottom: 5px; }
        .cta-button { background: #007bff; color: white; padding: 15px 30px; border: none; border-radius: 5px; font-size: 18px; cursor: pointer; text-decoration: none; display: inline-block; margin: 20px 0; }
        @media (max-width: 768px) { 
            .product-grid { grid-template-columns: 1fr; }
            .container { padding: 10px; }
        }
    </style>
</head>
<body>
    <!-- Микроразметка товара с использованием Microdata -->
    <div class="container" itemscope itemtype="https://schema.org/Product">
        <!-- Хлебные крошки -->
        <nav class="breadcrumb">
            <a href="/">Главная</a> → 
            <a href="/catalog">Каталог</a> → 
            <a href="/catalog?category=${encodeURIComponent(product.category)}">${product.category}</a> → 
            <span itemprop="name">${product.title}</span>
        </nav>
        
        <div class="product-grid">
            <div>
                <!-- Главное изображение товара -->
                <img src="${mainImage}" alt="${product.title}" class="product-image" itemprop="image">
                
                <!-- Дополнительные изображения -->
                ${this.generateAdditionalImages(product)}
                
                <!-- Скрытые мета-теги для микроразметки -->
                <meta itemprop="sku" content="${product.article_number || `product-${product.id}`}">
                <meta itemprop="mpn" content="${product.article_number || `product-${product.id}`}">
                <meta itemprop="category" content="${product.category}">
                
                <!-- Бренд товара -->
                <div itemprop="brand" itemscope itemtype="https://schema.org/Brand">
                    <meta itemprop="name" content="The X Shop">
                </div>
                
                <!-- Производитель -->
                <div itemprop="manufacturer" itemscope itemtype="https://schema.org/Organization">
                    <meta itemprop="name" content="The X Shop">
                    <meta itemprop="address" content="${this.organizationInfo.address}">
                    <meta itemprop="telephone" content="${this.organizationInfo.telephone}">
                </div>
                
                <!-- Рейтинг товара -->
                <div itemprop="aggregateRating" itemscope itemtype="https://schema.org/AggregateRating">
                    <meta itemprop="ratingValue" content="${product.rating || '4.8'}">
                    <meta itemprop="bestRating" content="5">
                    <meta itemprop="worstRating" content="1">
                    <meta itemprop="ratingCount" content="47">
                </div>
            </div>
            
            <div>
                <!-- Название товара -->
                <h1 itemprop="name">${product.title}</h1>
                
                <p><strong>Артикул:</strong> <span>${product.article_number || `product-${product.id}`}</span></p>
                
                <!-- Описание товара -->
                <div itemprop="description"><p>${product.description}</p></div>
                
                <!-- Предложение с ценой -->
                <div itemprop="offers" itemscope itemtype="https://schema.org/Offer">
                    <div class="price">
                        <meta itemprop="priceCurrency" content="RUB">
                        <meta itemprop="price" content="${price}">
                        <link itemprop="availability" href="${product.in_stock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock'}">
                        <link itemprop="itemCondition" href="https://schema.org/NewCondition">
                        <meta itemprop="priceValidUntil" content="${this.getFutureDate()}">
                        
                        ${price} ₽
                        ${product.discount_price ? `<span class="original-price">${originalPrice} ₽</span>` : ''}
                    </div>
                    
                    <!-- Продавец -->
                    <div itemprop="seller" itemscope itemtype="https://schema.org/Organization">
                        <meta itemprop="name" content="The X Shop">
                        <meta itemprop="address" content="${this.organizationInfo.address}">
                        <meta itemprop="telephone" content="${this.organizationInfo.telephone}">
                    </div>
                </div>
                
                <div class="stock-status ${product.in_stock ? 'in-stock' : 'out-of-stock'}">
                    ${product.in_stock ? '✓ В наличии' : '✗ Нет в наличии'}
                </div>
                
                <a href="/#/product/${product.id}" class="cta-button">
                    ${product.in_stock ? `Купить за ${price} ₽` : 'Уведомить о поступлении'}
                </a>
                
                <!-- Характеристики -->
                ${this.generateSpecifications(product)}
                
                <p><strong>Страна происхождения:</strong> ${product.country_of_origin || 'Нет'}</p>
            </div>
        </div>
        
        <!-- Дополнительная информация -->
        <div style="border-top: 1px solid #eee; padding-top: 20px; margin-top: 20px;">
            <h2>О товаре</h2>
            <p>Этот товар доступен в интернет-магазине The X Shop. Мы гарантируем качество всех представленных товаров и обеспечиваем быструю доставку по всей России.</p>
            
            <h3>Доставка и оплата</h3>
            <ul>
                <li>Бесплатная доставка при заказе от 3000 ₽</li>
                <li>Доставка по России: 3-14 рабочих дней</li>
                <li>Оплата при получении или картой онлайн</li>
                <li>Гарантия возврата в течение 14 дней</li>
            </ul>
            
            <!-- Контактная информация организации -->
            <div style="margin-top: 20px; font-size: 14px; color: #666;">
                <p><strong>Контакты:</strong></p>
                <p>Адрес: ${this.organizationInfo.address}</p>
                <p>Телефон: ${this.organizationInfo.telephone}</p>
                <p>Сайт: ${this.organizationInfo.url}</p>
            </div>
        </div>
    </div>
    
    <!-- Переход на основной сайт -->
    <script>
        document.querySelector('.cta-button').addEventListener('click', function(e) {
            e.preventDefault();
            window.location.href = '/#/product/${product.id}';
        });
    </script>
</body>
</html>`;
  }
}

module.exports = ProductPageGenerator;
