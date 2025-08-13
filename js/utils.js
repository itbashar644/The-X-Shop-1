
/**
 * Вспомогательные функции
 */

// Функция для преобразования строки цены в число
function parsePrice(price) {
  if (typeof price === 'number') {
    return price;
  }
  if (!price) {
    return 0;
  }
  const numeric = parseFloat(String(price).replace(/[^0-9.-]+/g, ''));
  return isNaN(numeric) ? 0 : numeric;
}

// Функция для форматирования цены
function formatPrice(price) {
  const value = parsePrice(price);
  return value.toLocaleString('ru-RU') + ' ₽';
}

// Функция для генерации slug из названия
function generateSlug(title) {
  return title
    .toLowerCase()
    .replace(/[а-я]/g, char => {
      const map = {
        'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'yo',
        'ж': 'zh', 'з': 'z', 'и': 'i', 'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm',
        'н': 'n', 'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u',
        'ф': 'f', 'х': 'h', 'ц': 'ts', 'ч': 'ch', 'ш': 'sh', 'щ': 'sch',
        'ъ': '', 'ы': 'y', 'ь': '', 'э': 'e', 'ю': 'yu', 'я': 'ya'
      };
      return map[char] || char;
    })
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, 100);
}

// Функция для отображения уведомления
function showNotification(message, type = 'success') {
  // Создаем элемент уведомления
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.textContent = message;
  
  // Добавляем уведомление на страницу
  document.body.appendChild(notification);
  
  // Показываем уведомление с анимацией
  setTimeout(() => {
    notification.classList.add('show');
  }, 10);
  
  // Скрываем и удаляем уведомление через 3 секунды
  setTimeout(() => {
    notification.classList.remove('show');
    setTimeout(() => {
      notification.remove();
    }, 300);
  }, 3000);
}

// Функция для получения данных из локального хранилища с проверкой наличия
function getFromStorage(key, defaultValue = null) {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error('Ошибка при чтении из localStorage:', error);
    return defaultValue;
  }
}

// Функция для сохранения данных в локальное хранилище с обработкой ошибок
function saveToStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error('Ошибка при сохранении в localStorage:', error);
    showNotification('Не удалось сохранить данные в локальное хранилище', 'error');
    return false;
  }
}

// Функция для обновления счетчика корзины
function updateCartCounter() {
  const cart = getFromStorage('cart', []);
  const counter = document.getElementById('cart-counter');
  
  if (counter) {
    const itemCount = cart.reduce((total, item) => total + item.quantity, 0);
    counter.textContent = itemCount;
    
    if (itemCount > 0) {
      counter.classList.add('active');
    } else {
      counter.classList.remove('active');
    }
  }
}

// Функция для обновления статуса кнопок избранного
function updateWishlistButtons() {
  const wishlist = getFromStorage('wishlist', []);
  
  // Обновляем все кнопки избранного
  document.querySelectorAll('.wishlist-button, .wishlist-btn-large').forEach(button => {
    const productId = button.getAttribute('data-id');
    
    if (wishlist.some(item => item.id === productId)) {
      button.classList.add('active');
    } else {
      button.classList.remove('active');
    }
  });
}

// Функция для создания HTML из шаблонной строки
function createElementFromHTML(html) {
  const div = document.createElement('div');
  div.innerHTML = html.trim();
  return div.firstChild;
}

// Функция для отправки данных на сервер
async function sendData(url, data, method = 'POST') {
  try {
    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...CONFIG.apiHeaders
      },
      body: JSON.stringify(data)
    });
    
    if (!response.ok) {
      throw new Error(`Ошибка HTTP: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Ошибка при отправке данных:', error);
    throw error;
  }
}
