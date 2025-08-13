import React, { useState, useEffect } from 'react';
import './GridCatalog.css';
import 'font-awesome/css/font-awesome.min.css';
import ProductCard from "./ProductCard";

const GridCatalog = ({ 
  products, 
  title, 
  showAsColorVariants = false, 
  limit,
  showExpand = false,
  columnsClass,
  rowsPerPage = 2 // Новый параметр для контроля количества рядов
}) => {
  // Конфигурация
  const itemsPerRow = 5; // Количество товаров в ряду
  const itemsPerPage = itemsPerRow * rowsPerPage;
  const totalPages = Math.ceil(products.length / itemsPerPage);
  
  // Состояние
  const [currentPage, setCurrentPage] = useState(0);
  
  // Сброс страницы при изменении продуктов
  useEffect(() => {
    setCurrentPage(0);
  }, [products]);

  // Обработчики навигации
  const goToPage = (pageIndex) => {
    setCurrentPage(pageIndex);
  };

  const handlePrev = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Получение продуктов для текущей страницы
  const getCurrentPageProducts = () => {
    const startIndex = currentPage * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, products.length);
    return products.slice(startIndex, endIndex);
  };

  // Создание точек пагинации
  const renderPaginationDots = () => {
    return Array.from({ length: totalPages }, (_, i) => (
      <div
        key={i}
        className={`pagination-dot ${i === currentPage ? 'active' : ''}`}
        onClick={() => goToPage(i)}
      />
    ));
  };

  return (
    <div className="catalog-container">
      {title && <h2 className="text-2xl font-bold mb-6">{title}</h2>}
      
      <div className="catalog-wrapper">
        <div className="catalog-pages">
          <div className={`grid ${columnsClass || "grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5"} gap-4`}>
            {getCurrentPageProducts().map(product => (
              <ProductCard 
                key={product.id} 
                product={product}
                showAsColorVariants={showAsColorVariants}
              />
            ))}
          </div>
        </div>
      </div>
      
      {/* Навигация с пагинацией */}
      {totalPages > 1 && (
        <div className="navigation-container mt-8">
          <div className="pagination">
            {renderPaginationDots()}
          </div>
          
          <div className="navigation">
            <button 
              className="nav-button" 
              onClick={handlePrev}
              disabled={currentPage === 0}
            >
              <i className="fas fa-chevron-left"></i>
            </button>
            <div className="page-indicator">
              Страница <span>{currentPage + 1}</span> из <span>{totalPages}</span>
            </div>
            <button 
              className="nav-button" 
              onClick={handleNext}
              disabled={currentPage === totalPages - 1}
            >
              <i className="fas fa-chevron-right"></i>
            </button>
          </div>
        </div>
      )}
      
      {/* Кнопка "Показать еще" если есть лимит */}
      {showExpand && limit && products.length > limit && (
        <div className="text-center mt-8">
          <button 
            className="expand-button"
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? (
              <>
                Показать меньше <i className="fas fa-chevron-up ml-2"></i>
              </>
            ) : (
              <>
                Показать все {products.length} товаров <i className="fas fa-chevron-down ml-2"></i>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default GridCatalog;