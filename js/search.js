
/**
 * Функционал поиска
 */

// Инициализация поиска
function initSearch() {
  const searchButton = document.querySelector('.search-button');
  
  if (searchButton) {
    searchButton.addEventListener('click', function() {
      window.location.href = 'catalog.html?focus=search';
    });
  }
}
