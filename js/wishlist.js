
/**
 * Функционал для работы с избранным
 */

// Функция для инициализации избранного
function initWishlist() {
  updateWishlistButtons();
}

// Функция для добавления/удаления товара в избранное
function toggleWishlist(productId, productTitle) {
  try {
    // Получаем текущий список избранных товаров из localStorage
    let wishlist = getFromStorage('wishlist', []);
    
    // Проверяем, есть ли уже этот товар в избранном
    const existingIndex = wishlist.findIndex(item => item.id === productId);
    
    if (existingIndex >= 0) {
      // Если товар уже в избранном, удаляем его
      wishlist.splice(existingIndex, 1);
      
      // Сохраняем обновленный список
      saveToStorage('wishlist', wishlist);
      
      // Обновляем статус кнопок избранного
      updateWishlistButtons();
      
      if (typeof showNotification === 'function') {
        showNotification(`"${productTitle}" удален из избранного`);
      }
    } else {
      // Если товара нет в избранном, добавляем его
      wishlist.push({
        id: productId,
        title: productTitle,
        addedAt: new Date().toISOString()
      });
      
      // Сохраняем обновленный список
      saveToStorage('wishlist', wishlist);
      
      // Обновляем статус кнопок избранного
      updateWishlistButtons();
      
      if (typeof showNotification === 'function') {
        showNotification(`"${productTitle}" добавлен в избранное`);
      }
    }
    
    // Обновляем страницу избранного, если мы на ней находимся
    if (window.location.pathname.endsWith('wishlist.html') && typeof renderWishlist === 'function') {
      renderWishlist();
    }
    
    return true;
  } catch (error) {
    console.error('Ошибка при работе с избранным:', error);
    return false;
  }
}

// Функция для рендеринга страницы избранного
function renderWishlist() {
  const wishlistContainer = document.getElementById('wishlist-container');
  if (!wishlistContainer) return;
  
  // Получаем текущий список избранных товаров из localStorage
  const wishlist = getFromStorage('wishlist', []);
  
  if (wishlist.length === 0) {
    // Если список пуст, показываем соответствующее сообщение
    wishlistContainer.innerHTML = `
      <div class="empty-wishlist">
        <h2>Список избранного пуст</h2>
        <p>Добавьте товары в избранное, чтобы вернуться к ним позже.</p>
        <a href="catalog.html" class="btn primary-btn">Перейти в каталог</a>
      </div>
    `;
    return;
  }
  
  // Показываем состояние загрузки
  wishlistContainer.innerHTML = '<div class="loading">Загрузка товаров...</div>';
  
  // Формируем строку с ID товаров для запроса
  const ids = wishlist.map(item => item.id).join(',');
  
  // Загружаем информацию о товарах из Supabase
  fetch(`https://lpwvhyawvxibtuxfhitx.supabase.co/rest/v1/products?id=in.(${ids})`, {
    headers: CONFIG.apiHeaders
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('Ошибка при загрузке избранных товаров');
      }
      return response.json();
    })
    .then(products => {
      if (products.length === 0) {
        wishlistContainer.innerHTML = `
          <div class="empty-wishlist">
            <h2>Товары не найдены</h2>
            <p>Возможно, они были удалены или перемещены.</p>
            <a href="catalog.html" class="btn primary-btn">Перейти в каталог</a>
          </div>
        `;
        return;
      }
      
      // Формируем HTML для списка избранного
      const wishlistHTML = `
        <div class="wishlist-content">
          <h2>Избранное</h2>
          <div class="wishlist-items products-grid">
            ${products.map(product => {
              const priceDisplay = product.discount_price 
                ? `<span class="old-price">${product.price} ₽</span><span class="current-price">${product.discount_price} ₽</span>` 
                : `<span class="current-price">${product.price} ₽</span>`;
              
              return `
                <div class="product-card">
                  <div class="product-image">
                    <a href="product-${generateSlug(product.title)}.html">
                      <img src="${product.image_url}" alt="${product.title}">
                    </a>
                    <button class="wishlist-button active" data-id="${product.id}">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path></svg>
                    </button>
                  </div>
                  <div class="product-info">
                    <h3><a href="product-${generateSlug(product.title)}.html">${product.title}</a></h3>
                    <div class="product-price">
                      ${priceDisplay}
                    </div>
                    <button class="add-to-cart-btn" data-id="${product.id}">В корзину</button>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>
      `;
      
      // Обновляем контейнер
      wishlistContainer.innerHTML = wishlistHTML;
      
      // Инициализируем кнопки
      document.querySelectorAll('.wishlist-button').forEach(button => {
        button.addEventListener('click', function() {
          const productId = this.getAttribute('data-id');
          const productTitle = this.closest('.product-card').querySelector('h3 a').textContent;
          toggleWishlist(productId, productTitle);
        });
      });
      
      document.querySelectorAll('.add-to-cart-btn').forEach(button => {
        button.addEventListener('click', function() {
          const productId = this.getAttribute('data-id');
          const product = products.find(p => p.id === productId);
          
          if (product && typeof addToCart === 'function') {
            addToCart({
              id: product.id,
              title: product.title,
              price: parsePrice(product.discount_price || product.price),
              image: product.image_url,
              quantity: 1
            });
            
            if (typeof showNotification === 'function') {
              showNotification(`"${product.title}" добавлен в корзину`);
            }
          }
        });
      });
    })
    .catch(error => {
      console.error('Ошибка при загрузке избранных товаров:', error);
      wishlistContainer.innerHTML = '<div class="error-message">Ошибка при загрузке избранных товаров</div>';
    });
}

// Инициализация кнопок избранного на странице
function initWishlistButtons() {
  document.querySelectorAll('.wishlist-button, .wishlist-btn-large').forEach(button => {
    button.addEventListener('click', function() {
      const productId = this.getAttribute('data-id');
      let productTitle = '';
      
      // Определяем заголовок товара в зависимости от страницы
      if (/product-.*\.html$/.test(window.location.pathname)) {
        productTitle = document.querySelector('h1').textContent;
      } else {
        productTitle = this.closest('.product-card').querySelector('h3 a').textContent;
      }
      
      toggleWishlist(productId, productTitle);
    });
  });
  
  // Обновляем состояние кнопок
  updateWishlistButtons();
}

// Инициализируем избранное при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
  initWishlist();
  
  // Если мы на странице избранного, рендерим ее
  if (window.location.pathname.endsWith('wishlist.html')) {
    renderWishlist();
  }
});
