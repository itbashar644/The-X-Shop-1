
"use client";

import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
  const { pathname, search, hash } = useLocation();

  useEffect(() => {
    // Если страница начинается с /admin, не прокручиваем вверх
    if (pathname.startsWith("/admin")) {
      return;
    }
    
    // Когда меняется маршрут, прокручиваем страницу в самое начало
    if (!hash) {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "instant" // Мгновенная прокрутка без анимации
      });
      
      // На мобильных устройствах и при прокрутке внутри контейнера
      const rootElement = document.getElementById("root");
      if (rootElement) {
        rootElement.scrollTo({
          top: 0,
          left: 0,
          behavior: "instant"
        });
      }
      
      // Сброс состояния фокуса для скринридеров
      document.body.setAttribute("tabindex", "-1");
      document.body.focus();
      document.body.removeAttribute("tabindex");
    }
  }, [pathname, search, hash]);

  return null;
}
