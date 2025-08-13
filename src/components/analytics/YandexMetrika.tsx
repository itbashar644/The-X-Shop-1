
"use client";

import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { Helmet } from "react-helmet-async";
import { trackPageView } from '@/utils/metrika';

/**
 * Компонент для отслеживания переходов между страницами с помощью Яндекс.Метрики
 */
const YandexMetrika = () => {
  const location = useLocation();
  const prevPath = useRef<string>(location.pathname);
  const isFirstRender = useRef<boolean>(true);

  // Отслеживаем все просмотры страниц при маршрутизации
  useEffect(() => {
    // При изменении пути отслеживаем просмотр страницы
    if (isFirstRender.current) {
      // Первичный просмотр при загрузке страницы
      trackPageView(location.pathname + location.search, {
        title: document.title,
        referer: document.referrer || undefined
      });
      isFirstRender.current = false;
      console.log('Initial page view tracked:', location.pathname + location.search);
    } 
    else if (prevPath.current !== location.pathname || location.search) {
      // Учитываем и параметры запроса при отслеживании новых просмотров страниц
      trackPageView(location.pathname + location.search, {
        title: document.title,
        referer: prevPath.current // Используем предыдущий путь как реферер
      });
      console.log('Tracked page view:', location.pathname + location.search, 'from', prevPath.current);
      prevPath.current = location.pathname;
    }
  }, [location.pathname, location.search]);

  return (
    <Helmet>
      {/* Дополнительные данные для Метрики через data-атрибуты */}
      <html data-page-url={location.pathname + location.search} data-page-title={document.title} />
    </Helmet>
  );
};

export default YandexMetrika;
