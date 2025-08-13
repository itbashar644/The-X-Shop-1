
/**
 * Основной скрипт приложения
 */

document.addEventListener('DOMContentLoaded', function() {
  // Функция для работы с корзиной
  if (typeof initCart === 'function') {
    initCart();
  }
  
  // Функция для работы с избранным
  if (typeof initWishlist === 'function') {
    initWishlist();
  }
  
  // Обработка кнопок добавления в корзину
  if (typeof initAddToCartButtons === 'function') {
    initAddToCartButtons();
  }
  
  // Обработка кнопок добавления в избранное
  if (typeof initWishlistButtons === 'function') {
    initWishlistButtons();
  }
  
  // Инициализация поиска
  if (typeof initSearch === 'function') {
    initSearch();
  }
  // Загрузка товаров с Supabase, если мы находимся на главной странице
  if (window.location.pathname === '/' || window.location.pathname === '/index.html') {
    loadCategories(); // Сначала загружаем категории
    
    if (typeof loadFeaturedProducts === 'function') {
      loadFeaturedProducts(); // Затем популярные товары
    }
  }
  
  // Загрузка товаров в каталоге
  if (window.location.pathname === '/catalog.html') {
    const urlParams = new URLSearchParams(window.location.search);
    const categoryParam = urlParams.get('category');
    
    // Загружаем категории для сайдбара каталога
    loadCategories();
    
    if (typeof loadCatalogProducts === 'function') {
      loadCatalogProducts(categoryParam);
    }
  }
  
  
  // Находим форму обратной связи
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      if (typeof submitContactForm === 'function') {
        submitContactForm(e);
      }
    });
  }
  
  // Если мы на странице корзины, рендерим корзину
  if (window.location.pathname.endsWith('cart.html')) {
    if (typeof renderCart === 'function') {
      renderCart();
    }
  }
  
  // Инициализация чата, если он есть на странице
  if (typeof initChat === 'function') {
    initChat();
  }
  
  // Инициализация мобильного меню
  initMobileMenu();
});

// Функция для инициализации мобильного меню
function initMobileMenu() {
  const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
  
  if (mobileMenuToggle) {
    mobileMenuToggle.addEventListener('click', function() {
      // Здесь должен быть код для открытия/закрытия мобильного меню
      // Для простоты реализации просто переключаем видимость навигации
      const mainNav = document.querySelector('.main-nav');
      
      if (mainNav) {
        if (mainNav.style.display === 'flex') {
          mainNav.style.display = 'none';
        } else {
          mainNav.style.display = 'flex';
        }
      }
    });
  }
}
