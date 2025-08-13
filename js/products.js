/**
 * Функционал для работы с товарами
 */

// Функция для загрузки выделенных товаров с Supabase
async function loadFeaturedProducts() {
  try {
    const productsContainer = document.querySelector('.featured-products');
    if (!productsContainer) return;
    
    // Показываем состояние загрузки
    productsContainer.innerHTML = '<div class="loading">Загрузка товаров...</div>';
    
    // Загружаем товары с Supabase
    const response = await fetch('https://lpwvhyawvxibtuxfhitx.supabase.co/rest/v1/products?select=*&archived=eq.false&order=created_at.desc&limit=8', {
      headers: CONFIG.apiHeaders
    });
    
    if (!response.ok) {
      throw new Error('Не удалось загрузить товары');
    }
    
    const products = await response.json();
    
    if (products.length === 0) {
      productsContainer.innerHTML = '<div class="empty-message">Товары не найдены</div>';
      return;
    }
    
    // Очищаем контейнер
    productsContainer.innerHTML = '';
    
    // Добавляем товары в контейнер
    products.forEach(product => {
      const productCard = createProductCard(product);
      productsContainer.appendChild(productCard);
    });
    
    // Инициализируем кнопки после добавления карточек
    if (typeof initAddToCartButtons === 'function') {
      initAddToCartButtons();
    }
    if (typeof initWishlistButtons === 'function') {
      initWishlistButtons();
    }
    if (typeof initWishlist === 'function') {
      initWishlist();
    }
  } catch (error) {
    console.error('Ошибка при загрузке товаров:', error);
    const productsContainer = document.querySelector('.featured-products');
    if (productsContainer) {
      productsContainer.innerHTML = '<div class="error-message">Ошибка при загрузке товаров</div>';
    }
  }
}

// Функция для загрузки товаров для каталога
async function loadCatalogProducts(category = null) {
  try {
    const productsContainer = document.getElementById('products-container');
    if (!productsContainer) return;
    
    // Показываем состояние загрузки
    productsContainer.innerHTML = '<div class="loading">Загрузка товаров...</div>';
    
    // Формируем URL запроса
    let url = 'https://lpwvhyawvxibtuxfhitx.supabase.co/rest/v1/products?select=*&archived=eq.false';
    
    // Добавляем фильтр по категории, если указана
    if (category) {
      url += `&category=eq.${encodeURIComponent(category)}`;
    }
    
    // Получаем параметры фильтрации из URL
    const urlParams = new URLSearchParams(window.location.search);
    const minPrice = urlParams.get('min_price');
    const maxPrice = urlParams.get('max_price');
    const searchQuery = urlParams.get('search');
    
    // Добавляем фильтры в запрос, если они указаны
    if (minPrice) {
      url += `&price=gte.${minPrice}`;
    }
    if (maxPrice) {
      url += `&price=lte.${maxPrice}`;
    }
    
    // Добавляем параметр сортировки, если указан
    const sortParam = urlParams.get('sort');
    if (sortParam) {
      switch (sortParam) {
        case 'price-asc':
          url += '&order=price.asc';
          break;
        case 'price-desc':
          url += '&order=price.desc';
          break;
        case 'new':
          url += '&order=created_at.desc';
          break;
        case 'bestseller':
          url += '&order=isBestseller.desc.nullsfirst';
          break;
        default:
          // По умолчанию сортируем по популярности (рейтингу)
          url += '&order=rating.desc';
      }
    } else {
      // Если сортировка не указана, сортируем по умолчанию по популярности
      url += '&order=rating.desc';
    }
    
    // Загружаем товары с Supabase
    const response = await fetch(url, {
      headers: CONFIG.apiHeaders
    });
    
    if (!response.ok) {
      throw new Error('Не удалось загрузить товары');
    }
    
    let products = await response.json();
    
    // Применяем поиск на стороне клиента, если указан поисковый запрос
    if (searchQuery) {
      const searchLower = searchQuery.toLowerCase();
      products = products.filter(product => 
        product.title.toLowerCase().includes(searchLower) || 
        (product.description && product.description.toLowerCase().includes(searchLower))
      );
    }
    
    if (products.length === 0) {
      productsContainer.innerHTML = '<div class="empty-message">Товары не найдены</div>';
      return;
    }
    
    // Очищаем контейнер
    productsContainer.innerHTML = '';
    
    // Добавляем товары в контейнер
    products.forEach(product => {
      const productCard = createProductCard(product);
      productsContainer.appendChild(productCard);
    });

    // После рендера товаров обновляем максимальную цену фильтра с задержкой
    if (typeof updatePriceFilterMax === 'function') {
      setTimeout(updatePriceFilterMax, 200);
    }

    // Инициализируем кнопки после добавления карточек
    if (typeof initAddToCartButtons === 'function') {
      initAddToCartButtons();
    }
    if (typeof initWishlistButtons === 'function') {
      initWishlistButtons();
    }
    if (typeof initWishlist === 'function') {
      initWishlist();
    }
  } catch (error) {
    console.error('Ошибка при загрузке товаров:', error);
    const productsContainer = document.getElementById('products-container');
    if (productsContainer) {
      productsContainer.innerHTML = '<div class="error-message">Ошибка при загрузке товаров: ' + error.message + '</div>';
    }
  }
}

// Функция для создания карточки товара
function createProductCard(product) {
  const card = document.createElement('div');
  card.className = 'product-card';
  
  const priceDisplay = product.discount_price 
    ? `<span class="old-price">${product.price} ₽</span><span class="current-price">${product.discount_price} ₽</span>` 
    : `<span class="current-price">${product.price} ₽</span>`;
  
  // Подготовка блока маркетплейсов
  const marketplaceLinks = createMarketplaceLinksHtml(product);
  const slug = generateSlug(product.title);

  // Подготовка плашек
  const badges = [];
  if (product.isHit) badges.push('<span class="product-badge hit">Хит</span>');
  if (product.isBestseller) badges.push('<span class="product-badge bestseller">Бестселлер</span>');
  if (product.isNew) badges.push('<span class="product-badge new">Новинка</span>');
  const badgesHtml = badges.length ? `<div class="product-badges">${badges.join('')}</div>` : '';
  
  card.innerHTML = `
    <div class="product-image">
      ${badgesHtml}
      <a href="product-${slug}.html" class="product-link" data-id="${product.id}">
        <img src="${product.image_url}" alt="${product.title}" loading="lazy">
      </a>
      <button class="wishlist-button" aria-label="Добавить в избранное" data-id="${product.id}">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path></svg>
      </button>
    </div>
    <div class="product-info">
      <h3>
        <a href="product-${slug}.html" class="product-link" data-id="${product.id}">${product.title}</a>
      </h3>
      <div class="product-price">
        ${priceDisplay}
      </div>
      ${marketplaceLinks}
      <button class="add-to-cart-btn" data-id="${product.id}">В корзину</button>
    </div>
  `;
  
  return card;
}

// Функция для создания HTML-блока с маркетплейсами
function createMarketplaceLinksHtml(product) {
  // Проверяем, есть ли у товара хотя бы одна ссылка на маркетплейс
  if (!product.ozon_url && !product.wildberries_url && !product.avito_url) {
    return '';
  }
  
  let marketplaceIconsHtml = '';
  
  if (product.wildberries_url) {
    marketplaceIconsHtml += `
      <a href="${product.wildberries_url}" target="_blank" rel="noopener noreferrer" class="marketplace-icon wildberries-icon" title="Открыть на Wildberries">
        <img src="/lovable-uploads/e338f2d1-bca5-46f1-b305-fdc8cff079f6.png" alt="Wildberries">
      </a>
    `;
  }
  
  if (product.ozon_url) {
    marketplaceIconsHtml += `
      <a href="${product.ozon_url}" target="_blank" rel="noopener noreferrer" class="marketplace-icon ozon-icon" title="Открыть на Ozon">
       <img src="/lovable-uploads/cdd6cfcc-2939-4048-ad14-0718ccb5108b.png" alt="Ozon">
      </a>
    `;
  }
  
  if (product.avito_url) {
    marketplaceIconsHtml += `
      <a href="${product.avito_url}" target="_blank" rel="noopener noreferrer" class="marketplace-icon avito-icon" title="Открыть на Авито">
         <img src="/lovable-uploads/c9a01e33-cfba-4882-bd76-bf5242276fda.png" alt="Авито">
      </a>
    `;
  }
  
  return `
    <div class="marketplace-links">
      <span class="marketplace-title">Доступно на:</span>
      <div class="marketplace-icons">
        ${marketplaceIconsHtml}
      </div>
    </div>
  `;
}

// Функция для загрузки данных о товаре на странице товара
async function loadProductDetails() {
  try {
    // Получаем ID товара из URL
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');
    
    if (!productId) {
      document.querySelector('.product-details-container').innerHTML = 
        '<div class="error-message">Товар не найден</div>';
      return;
    }
    
    // Показываем состояние загрузки
    document.querySelector('.product-details-container').innerHTML = 
      '<div class="loading">Загрузка информации о товаре...</div>';
    
    // Загружаем данные о товаре с Supabase
    const response = await fetch(`https://lpwvhyawvxibtuxfhitx.supabase.co/rest/v1/products?id=eq.${productId}&select=*`, {
      headers: CONFIG.apiHeaders
    });
    
    if (!response.ok) {
      throw new Error('Не удалось загрузить информацию о товаре');
    }
    
    const products = await response.json();
    
    if (products.length === 0) {
      document.querySelector('.product-details-container').innerHTML = 
        '<div class="error-message">Товар не найден</div>';
      return;
    }
    
    const product = products[0];
    
    // Обновляем заголовок страницы
    document.title = `${product.title} | The X Shop`;
    
    // Подготовка блока маркетплейсов
    const marketplaceLinks = createMarketplaceLinksHtml(product);

    // Подготовка плашек
    const badges = [];
    if (product.isHit) badges.push('<span class="product-badge hit">Хит</span>');
    if (product.isBestseller) badges.push('<span class="product-badge bestseller">Бестселлер</span>');
    if (product.isNew) badges.push('<span class="product-badge new">Новинка</span>');
    const badgesHtml = badges.length ? `<div class="product-badges">${badges.join('')}</div>` : '';
    
    // Формируем HTML для страницы товара
    const productHTML = `
      <div class="product-details">
        <div class="product-gallery">
          <div class="main-image">
            ${badgesHtml}
            <img src="${product.image_url}" alt="${product.title}">
          </div>
          ${product.additional_images && product.additional_images.length > 0 ? `
            <div class="additional-images">
              ${product.additional_images.map(img => `
                <div class="thumbnail">
                  <img src="${img}" alt="${product.title}">
                </div>
              `).join('')}
            </div>
          ` : ''}
        </div>
        <div class="product-info">
          <h1>${product.title}</h1>
          <div class="product-price">
            ${product.discount_price 
              ? `<span class="old-price">${product.price} ₽</span><span class="current-price">${product.discount_price} ₽</span>` 
              : `<span class="current-price">${product.price} ₽</span>`}
          </div>
          <div class="product-meta">
            <div class="product-rating">
              <span class="stars">${'★'.repeat(Math.floor(product.rating))}${product.rating % 1 > 0 ? '☆' : ''}</span>
              <span class="rating-value">${product.rating}</span>
            </div>
            <div class="product-availability">
              <span class="${product.in_stock ? 'in-stock' : 'out-of-stock'}">${product.in_stock ? 'В наличии' : 'Нет в наличии'}</span>
            </div>
          </div>
          <div class="product-description">
            <p>${product.description}</p>
          </div>
          ${marketplaceLinks}
          <div class="product-actions">
            <button class="btn add-to-cart-btn-large" data-id="${product.id}">В корзину</button>
            <button class="btn wishlist-btn-large" data-id="${product.id}">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path></svg>
              В избранное
            </button>
          </div>
          <div class="product-details-tabs">
            <ul class="tabs-nav">
              <li class="active" data-tab="description">Описание</li>
              <li data-tab="specifications">Характеристики</li>
            </ul>
            <div class="tabs-content">
              <div class="tab-pane active" id="description">
                <p>${product.description}</p>
              </div>
              <div class="tab-pane" id="specifications">
                <ul class="specs-list">
                  ${product.specifications ? Object.entries(product.specifications).map(([key, value]) => `
                    <li><strong>${key}:</strong> ${value}</li>
                  `).join('') : '<li>Нет данных о характеристиках</li>'}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
    
    // Обновляем контейнер
    document.querySelector('.product-details-container').innerHTML = productHTML;
    
    // Инициализируем табы
    initProductTabs();
    
    // Инициализируем галерею
    initProductGallery();
    
    // Инициализируем кнопки
    initProductButtons(product);
  } catch (error) {
    console.error('Ошибка при загрузке информации о товаре:', error);
    document.querySelector('.product-details-container').innerHTML = 
      '<div class="error-message">Ошибка при загрузке информации о товаре</div>';
  }
}

// Остальные функции остаются без изменений
// ... [остальной код остается точно таким же] ...

// Добавляем CSS для плашек
function addBadgesStyles() {
  const style = document.createElement('style');
  style.textContent = `
    .product-badges {
      position: absolute;
      top: 10px;
      left: 10px;
      z-index: 2;
      display: flex;
      flex-wrap: wrap;
      gap: 5px;
    }
    .product-badge {
      padding: 3px 8px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 600;
      color: white;
      text-transform: uppercase;
    }
    .product-badge.hit {
      background-color: #FF5722;
    }
    .product-badge.bestseller {
      background-color: #4CAF50;
    }
    .product-badge.new {
      background-color: #2196F3;
    }
  `;
  document.head.appendChild(style);
}

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', function() {
  addBadgesStyles();
});