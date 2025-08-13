
// Преобразовать текст цены в числовое значение
function parsePrice(value) {
  if (typeof value === 'number') return value;
  if (!value) return 0;
  const numeric = parseFloat(String(value).replace(/[^0-9.-]+/g, ''));
  return isNaN(numeric) ? 0 : numeric;
}
  
document.addEventListener('DOMContentLoaded', function() {
  // Функция для работы с корзиной
  initCart();
  
  // Функция для работы с избранным
  initWishlist();
  
  // Обработка кнопок добавления в корзину
  initAddToCartButtons();
  
  // Обработка кнопок добавления в избранное
  initWishlistButtons();
  
  // Инициализация поиска
  initSearch();
  
  // Загрузка товаров с Supabase, если мы находимся на главной странице
  if (window.location.pathname === '/' || window.location.pathname === '/index.html') {
    loadFeaturedProducts();
    loadCategories();
  }
  
  // Загрузка товаров в каталоге
  if (window.location.pathname === '/catalog.html') {
    const urlParams = new URLSearchParams(window.location.search);
    const categoryParam = urlParams.get('category');
    loadCatalogProducts(categoryParam);
  }
});

// Инициализация корзины
function initCart() {
  // Получаем сохраненную корзину из localStorage или создаем пустую
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  
  // Обновляем счетчик товаров в корзине
  updateCartCounter(cart);
}

// Обновление счетчика товаров в корзине
function updateCartCounter(cart) {
  const cartCounter = document.querySelector('.cart-counter');
  if (cartCounter) {
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    cartCounter.textContent = totalItems > 0 ? totalItems : '';
    cartCounter.style.display = totalItems > 0 ? 'flex' : 'none';
  }
}

// Инициализация избранного
function initWishlist() {
  // Получаем сохраненное избранное из localStorage или создаем пустой массив
  let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
  
  // Обновляем отображение кнопок избранного
  updateWishlistButtons(wishlist);
}

// Обновление кнопок избранного
function updateWishlistButtons(wishlist) {
  document.querySelectorAll('.wishlist-button').forEach(button => {
    const productCard = button.closest('.product-card');
    if (!productCard) return;
    
    const productLink = productCard.querySelector('.product-link');
    if (!productLink) return;
    
    // Получаем ID товара из URL или атрибута
    let productId;
    if (productLink.href.includes('id=')) {
      productId = productLink.href.split('id=')[1];
    } else if (productLink.dataset.id) {
      productId = productLink.dataset.id;
    }
    
    if (!productId) return;
    
    if (wishlist.includes(productId)) {
      button.classList.add('active');
      button.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path></svg>`;
    } else {
      button.classList.remove('active');
      button.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path></svg>`;
    }
  });
}

// Инициализация кнопок добавления в корзину
function initAddToCartButtons() {
  document.querySelectorAll('.add-to-cart-btn').forEach(button => {
    button.addEventListener('click', function(e) {
      e.preventDefault();
      
      const productCard = this.closest('.product-card');
      if (!productCard) return;
      
      const productLink = productCard.querySelector('.product-link');
      if (!productLink) return;
      
      // Получаем ID товара из URL или атрибута
      let productId;
      if (productLink.href.includes('id=')) {
        productId = productLink.href.split('id=')[1];
      } else if (productLink.dataset.id) {
        productId = productLink.dataset.id;
      }
      
      if (!productId) return;
      
      const productTitle = productCard.querySelector('h3').textContent;
      const priceText = productCard.querySelector('.current-price').textContent;
      const productPrice = parsePrice(priceText);
      const productImage = productCard.querySelector('.product-image img').src;
      
      addToCart({
        id: productId,
        title: productTitle,
        price: productPrice,
        image: productImage,
        quantity: 1
      });
      
      // Показываем уведомление
      showNotification(`"${productTitle}" добавлен в корзину`);
    });
  });
}

// Добавление товара в корзину
function addToCart(product) {
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  
  // Проверяем, есть ли уже такой товар в корзине
  const existingProductIndex = cart.findIndex(item => item.id === product.id);
  
  if (existingProductIndex !== -1) {
    // Если товар уже в корзине - увеличиваем количество
    cart[existingProductIndex].quantity += 1;
  } else {
    // Иначе добавляем новый товар
    cart.push(product);
  }
  
  // Сохраняем корзину в localStorage
  localStorage.setItem('cart', JSON.stringify(cart));
  
  // Обновляем счетчик товаров
  updateCartCounter(cart);
}

// Инициализация кнопок добавления в избранное
function initWishlistButtons() {
  document.querySelectorAll('.wishlist-button').forEach(button => {
    button.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      
      const productCard = this.closest('.product-card');
      if (!productCard) return;
      
      const productLink = productCard.querySelector('.product-link');
      if (!productLink) return;
      
      // Получаем ID товара из URL или атрибута
      let productId;
      if (productLink.href.includes('id=')) {
        productId = productLink.href.split('id=')[1];
      } else if (productLink.dataset.id) {
        productId = productLink.dataset.id;
      }
      
      if (!productId) return;
      
      const productTitle = productCard.querySelector('h3').textContent;
      
      toggleWishlist(productId, productTitle);
    });
  });
}

// Добавление/удаление товара из избранного
function toggleWishlist(productId, productTitle) {
  let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
  
  // Проверяем, есть ли товар в избранном
  const index = wishlist.indexOf(productId);
  
  if (index !== -1) {
    // Если товар уже в избранном - удаляем
    wishlist.splice(index, 1);
    showNotification(`"${productTitle}" удален из избранного`);
  } else {
    // Иначе добавляем
    wishlist.push(productId);
    showNotification(`"${productTitle}" добавлен в избранное`);
  }
  
  // Сохраняем избранное в localStorage
  localStorage.setItem('wishlist', JSON.stringify(wishlist));
  
  // Обновляем отображение кнопок
  updateWishlistButtons(wishlist);
}

// Инициализация поиска
function initSearch() {
  const searchButton = document.querySelector('.search-button');
  
  if (searchButton) {
    searchButton.addEventListener('click', function() {
      window.location.href = 'catalog.html?focus=search';
    });
  }
}

// Показать уведомление
function showNotification(message) {
  // Создаем элемент уведомления
  const notification = document.createElement('div');
  notification.className = 'notification';
  notification.textContent = message;
  
  // Добавляем стили
  notification.style.position = 'fixed';
  notification.style.bottom = '20px';
  notification.style.right = '20px';
  notification.style.backgroundColor = 'white';
  notification.style.color = 'var(--text-color)';
  notification.style.padding = '10px 15px';
  notification.style.borderRadius = '4px';
  notification.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.15)';
  notification.style.zIndex = '1000';
  notification.style.opacity = '0';
  notification.style.transform = 'translateY(20px)';
  notification.style.transition = 'opacity 0.3s, transform 0.3s';
  
  // Добавляем на страницу
  document.body.appendChild(notification);
  
  // Анимация появления
  setTimeout(() => {
    notification.style.opacity = '1';
    notification.style.transform = 'translateY(0)';
  }, 10);
  
  // Удаление через 3 секунды
  setTimeout(() => {
    notification.style.opacity = '0';
    notification.style.transform = 'translateY(20px)';
    
    setTimeout(() => {
      document.body.removeChild(notification);
    }, 300);
  }, 3000);
}

// Функция для загрузки выделенных товаров с Supabase
async function loadFeaturedProducts() {
  try {
    const productsContainer = document.querySelector('.featured-products');
    if (!productsContainer) return;
    
    // Показываем состояние загрузки
    productsContainer.innerHTML = '<div class="loading">Загрузка товаров...</div>';
    
    // Загружаем товары с Supabase
    const response = await fetch('https://lpwvhyawvxibtuxfhitx.supabase.co/rest/v1/products?select=*&archived=eq.false&order=created_at.desc&limit=8', {
      headers: {
        'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxwd3ZoeWF3dnhpYnR1eGZoaXR4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY1MzIyOTUsImV4cCI6MjA2MjEwODI5NX0.-2aL1s3lUq4Oeos9jWoEd0Fn1g_-_oaQ_QWVEDByaOI',
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxwd3ZoeWF3dnhpYnR1eGZoaXR4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY1MzIyOTUsImV4cCI6MjA2MjEwODI5NX0.-2aL1s3lUq4Oeos9jWoEd0Fn1g_-_oaQ_QWVEDByaOI',
      }
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
    initAddToCartButtons();
    initWishlistButtons();
    initWishlist();
  } catch (error) {
    console.error('Ошибка при загрузке товаров:', error);
    const productsContainer = document.querySelector('.featured-products');
    if (productsContainer) {
      productsContainer.innerHTML = '<div class="error-message">Ошибка при загрузке товаров</div>';
    }
  }
}

// Функция для загрузки категорий с Supabase
async function loadCategories() {
  const sectionContainer = document.querySelector('.categories-section');
  const listContainer = document.getElementById('categories-list');
  try {
    
    if (!sectionContainer && !listContainer) return;
    
    // Показываем состояние загрузки
    if (sectionContainer) {
      sectionContainer.innerHTML = '<div class="loading">Загрузка категорий...</div>';
    }
    if (listContainer) {
      listContainer.innerHTML = '<div class="loading">Загрузка категорий...</div>';
    }
    
    // Загружаем категории с Supabase
    const response = await fetch('https://lpwvhyawvxibtuxfhitx.supabase.co/rest/v1/categories?select=*', {
      headers: {
        'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxwd3ZoeWF3dnhpYnR1eGZoaXR4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY1MzIyOTUsImV4cCI6MjA2MjEwODI5NX0.-2aL1s3lUq4Oeos9jWoEd0Fn1g_-_oaQ_QWVEDByaOI',
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxwd3ZoeWF3dnhpYnR1eGZoaXR4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY1MzIyOTUsImV4cCI6MjA2MjEwODI5NX0.-2aL1s3lUq4Oeos9jWoEd0Fn1g_-_oaQ_QWVEDByaOI',
      }
    });
    
    if (!response.ok) {
      throw new Error('Не удалось загрузить категории');
    }
    
    const categories = await response.json();
    
    if (categories.length === 0) {
      if (sectionContainer) {
        sectionContainer.innerHTML = '<div class="empty-message">Категории не найдены</div>';
      }
      if (listContainer) {
        listContainer.innerHTML = '<div class="empty-message">Категории не найдены</div>';
      }
      return;
    }
   if (sectionContainer) {
      const sectionHTML = `
        <h2 class="section-title">Категории</h2>
        <div class="categories-grid">
          ${categories.map(category => `
            <a href="catalog.html?category=${category.name}" class="category-card">
              <div class="category-image">
                <img src="${category.image_url || '/placeholder.svg'}" alt="${category.name}">
              </div>
              <h3>${category.name}</h3>
            </a>
          `).join('')}
        </div>
      `;
      sectionContainer.innerHTML = sectionHTML;
    }

    if (listContainer) {
      const listHTML = categories
        .map(category => `<a href="catalog.html?category=${category.name}" class="category-link">${category.name}</a>`)
        .join('');
      listContainer.innerHTML = listHTML;
    }
  } catch (error) {
    console.error('Ошибка при загрузке категорий:', error);
     if (sectionContainer) {
      sectionContainer.innerHTML = '<div class="error-message">Ошибка при загрузке категорий</div>';
    }
    if (listContainer) {
      listContainer.innerHTML = '<div class="error-message">Ошибка при загрузке категорий</div>';
    }
  }
}

// Функция для загрузки товаров для каталога
async function loadCatalogProducts(category = null) {
  try {
    const productsContainer = document.querySelector('.catalog-products');
    if (!productsContainer) return;
    
    // Показываем состояние загрузки
    productsContainer.innerHTML = '<div class="loading">Загрузка товаров...</div>';
    
    // Формируем URL запроса
    let url = 'https://lpwvhyawvxibtuxfhitx.supabase.co/rest/v1/products?select=*&archived=eq.false';
    
    // Добавляем фильтр по категории, если указана
    if (category) {
      url += `&category=eq.${encodeURIComponent(category)}`;
    }
    
    // Загружаем товары с Supabase
    const response = await fetch(url, {
      headers: {
        'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxwd3ZoeWF3dnhpYnR1eGZoaXR4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY1MzIyOTUsImV4cCI6MjA2MjEwODI5NX0.-2aL1s3lUq4Oeos9jWoEd0Fn1g_-_oaQ_QWVEDByaOI',
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxwd3ZoeWF3dnhpYnR1eGZoaXR4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY1MzIyOTUsImV4cCI6MjA2MjEwODI5NX0.-2aL1s3lUq4Oeos9jWoEd0Fn1g_-_oaQ_QWVEDByaOI',
      }
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
    
    // Добавляем заголовок с категорией, если указана
    if (category) {
      const categoryTitle = document.createElement('h1');
      categoryTitle.className = 'category-title';
      categoryTitle.textContent = category;
      productsContainer.appendChild(categoryTitle);
    }
    
    // Создаем грид для товаров
    const productsGrid = document.createElement('div');
    productsGrid.className = 'products-grid';
    
    // Добавляем товары в грид
    products.forEach(product => {
      const productCard = createProductCard(product);
      productsGrid.appendChild(productCard);
    });
    
    productsContainer.appendChild(productsGrid);
    
    // Инициализируем кнопки после добавления карточек
    initAddToCartButtons();
    initWishlistButtons();
    initWishlist();
  } catch (error) {
    console.error('Ошибка при загрузке товаров:', error);
    const productsContainer = document.querySelector('.catalog-products');
    if (productsContainer) {
      productsContainer.innerHTML = '<div class="error-message">Ошибка при загрузке товаров</div>';
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
  
    const slug = generateSlug(product.title);
  
  card.innerHTML = `
    <div class="product-image">
      <a href="product-${slug}.html" class="product-link" data-id="${product.id}">
        <img src="${product.image_url}" alt="${product.title}" loading="lazy">
      </a>
      <button class="wishlist-button" aria-label="Добавить в избранное">
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
      <button class="add-to-cart-btn">В корзину</button>
    </div>
  `;
  
  return card;
}

// Функция для отправки формы обратной связи
async function submitContactForm(event) {
  event.preventDefault();
  
  const form = event.target;
  const name = form.querySelector('#name').value;
  const email = form.querySelector('#email').value;
  const message = form.querySelector('#message').value;
  
  try {
    // Отправляем данные формы в Supabase
    const response = await fetch('https://lpwvhyawvxibtuxfhitx.supabase.co/functions/v1/contact-form', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxwd3ZoeWF3dnhpYnR1eGZoaXR4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY1MzIyOTUsImV4cCI6MjA2MjEwODI5NX0.-2aL1s3lUq4Oeos9jWoEd0Fn1g_-_oaQ_QWVEDByaOI'
      },
      body: JSON.stringify({ name, email, message })
    });
    
    if (!response.ok) {
      throw new Error('Ошибка при отправке формы');
    }
    
    // Показываем уведомление об успешной отправке
    showNotification('Сообщение успешно отправлено! Мы свяжемся с вами в ближайшее время.');
    
    // Очищаем форму
    form.reset();
  } catch (error) {
    console.error('Ошибка при отправке формы:', error);
    showNotification('Ошибка при отправке формы. Пожалуйста, попробуйте еще раз.');
  }
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
      headers: {
        'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxwd3ZoeWF3dnhpYnR1eGZoaXR4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY1MzIyOTUsImV4cCI6MjA2MjEwODI5NX0.-2aL1s3lUq4Oeos9jWoEd0Fn1g_-_oaQ_QWVEDByaOI',
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxwd3ZoeWF3dnhpYnR1eGZoaXR4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY1MzIyOTUsImV4cCI6MjA2MjEwODI5NX0.-2aL1s3lUq4Oeos9jWoEd0Fn1g_-_oaQ_QWVEDByaOI'
      }
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
    
    // Формируем HTML для страницы товара
    const productHTML = `
      <div class="product-details">
        <div class="product-gallery">
          <div class="main-image">
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
          <div class="product-actions">
            <button class="btn add-to-cart-btn-large">В корзину</button>
            <button class="btn wishlist-btn-large">
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

// Инициализация табов на странице товара
function initProductTabs() {
  document.querySelectorAll('.tabs-nav li').forEach(tab => {
    tab.addEventListener('click', function() {
      // Убираем активный класс у всех табов
      document.querySelectorAll('.tabs-nav li').forEach(t => t.classList.remove('active'));
      
      // Добавляем активный класс к текущему табу
      this.classList.add('active');
      
      // Скрываем все панели табов
      document.querySelectorAll('.tab-pane').forEach(pane => pane.classList.remove('active'));
      
      // Показываем нужную панель
      const tabId = this.getAttribute('data-tab');
      document.getElementById(tabId).classList.add('active');
    });
  });
}

// Инициализация галереи на странице товара
function initProductGallery() {
  const thumbnails = document.querySelectorAll('.thumbnail img');
  const mainImage = document.querySelector('.main-image img');
  
  thumbnails.forEach(thumb => {
    thumb.addEventListener('click', function() {
      mainImage.src = this.src;
    });
  });
}

// Инициализация кнопок на странице товара
function initProductButtons(product) {
  // Кнопка "В корзину"
  const addToCartBtn = document.querySelector('.add-to-cart-btn-large');
  if (addToCartBtn) {
    addToCartBtn.addEventListener('click', function() {
      addToCart({
        id: product.id,
        title: product.title,
        price: product.discount_price || product.price,
        image: product.image_url,
        quantity: 1
      });
      
      showNotification(`"${product.title}" добавлен в корзину`);
    });
  }
  
  // Кнопка "В избранное"
  const wishlistBtn = document.querySelector('.wishlist-btn-large');
  if (wishlistBtn) {
    wishlistBtn.addEventListener('click', function() {
      toggleWishlist(product.id, product.title);
    });
  }
}

// Если страница загружена полностью, выполняем действия в зависимости от страницы
if (document.readyState === 'complete' || document.readyState === 'interactive') {

  
  // Находим форму обратной связи
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', submitContactForm);
  }
} else {
  // Если страница еще не загружена полностью, добавляем обработчик события DOMContentLoaded
  document.addEventListener('DOMContentLoaded', function() {

    
    // Находим форму обратной связи
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
      contactForm.addEventListener('submit', submitContactForm);
    }
  });
}
