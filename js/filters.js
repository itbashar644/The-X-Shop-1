/**
 * Функционал для работы с фильтрами в каталоге
 */

// Функция для инициализации фильтров
function initFilters() {
  const urlParams = new URLSearchParams(window.location.search);
  
  // Focus search input if requested via URL
  if (urlParams.get('focus') === 'search') {
    const searchField = document.getElementById('search-input');
    if (searchField) {
      searchField.focus();
    }
  }
  
  // Фильтр по цене
  const priceMinInput = document.getElementById('min-price');
  const priceMaxInput = document.getElementById('max-price');
  const priceSlider = document.getElementById('price-slider');
  const applyPriceBtn = document.getElementById('apply-price-filter');

  // Динамически определяем максимальную цену среди всех товаров
  if (priceMinInput && priceMaxInput) {
    const productCards = document.querySelectorAll('.product-card');
    let maxPrice = 0;
    
    productCards.forEach(card => {
      let priceEl = card.querySelector('.current-price');
      if (priceEl) {
        let price = parseInt(priceEl.textContent.replace(/[^0-9]/g, ''), 10);
        if (!isNaN(price) && price > maxPrice) {
          maxPrice = price;
        }
      }
    });
    
    if (maxPrice === 0) maxPrice = 100000;
    priceMinInput.max = maxPrice;
    priceMaxInput.max = maxPrice;
    priceMaxInput.setAttribute('data-max-price', maxPrice);
    
    // Инициализация ползунка
    if (priceSlider) {
      noUiSlider.create(priceSlider, {
        start: [0, maxPrice],
        connect: true,
        range: {
          'min': 0,
          'max': maxPrice
        },
        step: 100,
        format: {
          to: function(value) {
            return Math.round(value);
          },
          from: function(value) {
            return Number(value);
          }
        }
      });
      
      // Обновление полей ввода при изменении ползунка
      priceSlider.noUiSlider.on('update', function(values, handle) {
        const value = parseInt(values[handle]);
        if (handle) {
          priceMaxInput.value = value;
        } else {
          priceMinInput.value = value;
        }
      });
    }
  }

  if (priceMinInput && priceMaxInput && applyPriceBtn) {
    // Восстанавливаем фильтры из URL
    const minPrice = urlParams.get('min_price');
    const maxPrice = urlParams.get('max_price');
    
    if (minPrice) {
      priceMinInput.value = minPrice;
      if (priceSlider) {
        priceSlider.noUiSlider.set([minPrice, null]);
      }
    }
    
    if (maxPrice) {
      priceMaxInput.value = maxPrice;
      if (priceSlider) {
        priceSlider.noUiSlider.set([null, maxPrice]);
      }
    }
    
    // Обработчики изменения цены в полях ввода
    priceMinInput.addEventListener('change', function() {
      if (priceSlider) {
        priceSlider.noUiSlider.set([this.value, null]);
      }
      validatePriceInputs();
    });
    
    priceMaxInput.addEventListener('change', function() {
      if (priceSlider) {
        priceSlider.noUiSlider.set([null, this.value]);
      }
      validatePriceInputs();
    });
    
    // Обработчик применения фильтра цены
    applyPriceBtn.addEventListener('click', function() {
      if (validatePriceInputs()) {
        applyFilters();
      }
    });
  }
  
  // Фильтр по поиску
  const searchInput = document.getElementById('search-input');
  const searchButton = document.getElementById('search-button');
  
  if (searchInput && searchButton) {
    // Восстанавливаем поисковый запрос из URL
    const searchQuery = urlParams.get('search');
    if (searchQuery) {
      searchInput.value = searchQuery;
    }
    
    // Обработчик нажатия на кнопку поиска
    searchButton.addEventListener('click', function() {
      applyFilters();
    });
    
    // Обработчик нажатия Enter в поле поиска
    searchInput.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        applyFilters();
      }
    });
  }
  
  // Сортировка
  const sortSelect = document.getElementById('sort-select');
  if (sortSelect) {
    // Восстанавливаем сортировку из URL
    const sortParam = urlParams.get('sort');
    if (sortParam) {
      sortSelect.value = sortParam;
    }
    
    // Обработчик изменения сортировки
    sortSelect.addEventListener('change', function() {
      applyFilters();
    });
  }
  
  // Инициализация отображения активных фильтров
  updateActiveFilters();
}

// Функция для валидации ценовых полей
function validatePriceInputs() {
  const priceMinInput = document.getElementById('min-price');
  const priceMaxInput = document.getElementById('max-price');
  const priceError = document.getElementById('price-error');
  
  if (!priceMinInput || !priceMaxInput) return true;
  
  const minPrice = parseInt(priceMinInput.value) || 0;
  const maxPrice = parseInt(priceMaxInput.value) || parseInt(priceMaxInput.max);
  
  if (minPrice > maxPrice) {
    if (priceError) {
      priceError.textContent = 'Минимальная цена не может превышать максимальную';
      priceError.style.display = 'block';
    }
    return false;
  }
  
  if (priceError) {
    priceError.style.display = 'none';
  }
  return true;
}

// Функция для применения фильтров
function applyFilters() {
  const urlParams = new URLSearchParams(window.location.search);
  
  // Сохраняем категорию, если она была выбрана
  const category = urlParams.get('category');
  
  // Создаем новый URLSearchParams
  const newParams = new URLSearchParams();
  
  // Добавляем категорию, если она была
  if (category) {
    newParams.set('category', category);
  }
  
  // Добавляем фильтр по цене
  const priceMinInput = document.getElementById('min-price');
  const priceMaxInput = document.getElementById('max-price');
  
  if (priceMinInput && priceMinInput.value && parseInt(priceMinInput.value) > 0) {
    newParams.set('min_price', priceMinInput.value);
  }
  
  if (priceMaxInput && priceMaxInput.value && parseInt(priceMaxInput.value) < parseInt(priceMaxInput.max)) {
    newParams.set('max_price', priceMaxInput.value);
  }
  
  // Добавляем поисковый запрос
  const searchInput = document.getElementById('search-input');
  if (searchInput && searchInput.value.trim()) {
    newParams.set('search', searchInput.value.trim());
  }
  
  // Добавляем сортировку
  const sortSelect = document.getElementById('sort-select');
  if (sortSelect && sortSelect.value !== 'default') {
    newParams.set('sort', sortSelect.value);
  }
  
  // Обновляем URL с новыми параметрами
  window.location.href = `${window.location.pathname}?${newParams.toString()}`;
}

// Функция для обновления отображения активных фильтров
function updateActiveFilters() {
  const activeFiltersContainer = document.getElementById('active-filters');
  if (!activeFiltersContainer) return;
  
  const urlParams = new URLSearchParams(window.location.search);
  let hasActiveFilters = false;
  let filtersHTML = '';
  
  // Проверяем наличие категории
  const category = urlParams.get('category');
  if (category) {
    filtersHTML += createFilterTag('Категория', category, () => removeFilter('category'));
    hasActiveFilters = true;
  }
  
  // Проверяем фильтр по цене
  const minPrice = urlParams.get('min_price');
  const maxPrice = urlParams.get('max_price');
  
  if (minPrice && maxPrice) {
    filtersHTML += createFilterTag('Цена', `${formatPrice(minPrice)} - ${formatPrice(maxPrice)}`, () => removeFilter('min_price', 'max_price'));
    hasActiveFilters = true;
  } else if (minPrice) {
    filtersHTML += createFilterTag('Цена от', formatPrice(minPrice), () => removeFilter('min_price'));
    hasActiveFilters = true;
  } else if (maxPrice) {
    filtersHTML += createFilterTag('Цена до', formatPrice(maxPrice), () => removeFilter('max_price'));
    hasActiveFilters = true;
  }
  
  // Проверяем поисковый запрос
  const searchQuery = urlParams.get('search');
  if (searchQuery) {
    filtersHTML += createFilterTag('Поиск', searchQuery, () => removeFilter('search'));
    hasActiveFilters = true;
  }
  
  // Проверяем сортировку
  const sortParam = urlParams.get('sort');
  if (sortParam) {
    const sortText = getSortText(sortParam);
    filtersHTML += createFilterTag('Сортировка', sortText, () => removeFilter('sort'));
    hasActiveFilters = true;
  }
  
  // Добавляем кнопку сброса всех фильтров, если есть активные фильтры
  if (hasActiveFilters) {
    filtersHTML += `
      <button class="filter-tag clear-all" onclick="clearAllFilters()">
        Сбросить все <i class="fas fa-times"></i>
      </button>
    `;
  }
  
  // Обновляем контейнер активных фильтров
  if (hasActiveFilters) {
    activeFiltersContainer.innerHTML = filtersHTML;
    activeFiltersContainer.style.display = 'flex';
  } else {
    activeFiltersContainer.style.display = 'none';
  }
}

// Вспомогательная функция для форматирования цены
function formatPrice(price) {
  price = parseInt(price);
  if (price >= 1000000) {
    return `${(price / 1000000).toFixed(1)}M₽`;
  } else if (price >= 1000) {
    return `${(price / 1000).toFixed(0)}K₽`;
  }
  return `${price}₽`;
}

// Вспомогательная функция для получения текста сортировки
function getSortText(sortParam) {
  const sortOptions = {
    'price_asc': 'Цена по возрастанию',
    'price_desc': 'Цена по убыванию',
    'popular': 'По популярности',
    'newest': 'Новинки',
    'rating': 'По рейтингу'
  };
  return sortOptions[sortParam] || sortParam;
}

// Функция для создания тега фильтра
function createFilterTag(name, value, removeCallback) {
  const displayText = value ? `${name}: ${value}` : name;
  return `
    <div class="filter-tag">
      ${displayText}
      <button class="filter-tag-remove" onclick="event.preventDefault(); ${removeCallback.toString().replace(/function\s*\(\)\s*\{\s*(return\s*)?|\s*\}$/g, '')}">
        <i class="fas fa-times"></i>
      </button>
    </div>
  `;
}

// Функция для удаления фильтра из URL
function removeFilter(...paramNames) {
  const urlParams = new URLSearchParams(window.location.search);
  
  // Удаляем указанные параметры
  paramNames.forEach(param => {
    urlParams.delete(param);
  });
  
  // Обновляем URL с новыми параметрами
  window.location.href = `${window.location.pathname}?${urlParams.toString()}`;
}

// Функция для сброса всех фильтров
function clearAllFilters() {
  const urlParams = new URLSearchParams(window.location.search);
  const category = urlParams.get('category');
  
  if (category) {
    // Если была выбрана категория, оставляем только её
    window.location.href = `${window.location.pathname}?category=${category}`;
  } else {
    // Если категории не было, полностью очищаем URL
    window.location.href = window.location.pathname;
  }
}
 
// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
  // Проверяем, находимся ли мы на странице каталога
  if (document.getElementById('products-container')) {
    initFilters();
  }
});

// Добавляем функции в глобальную область видимости
window.initFilters = initFilters;
window.applyFilters = applyFilters;
window.updateActiveFilters = updateActiveFilters;
window.removeFilter = removeFilter;
window.clearAllFilters = clearAllFilters;
window.validatePriceInputs = validatePriceInputs;