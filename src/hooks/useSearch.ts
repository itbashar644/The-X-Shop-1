
import { useRef, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

export function useSearch() {
  const navigate = useNavigate();
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [searchParams] = useSearchParams();
  
  // Проверяет, должен ли поиск получить фокус (на основе параметра URL)
  const shouldFocus = searchParams.get('focus') === 'search';
  
  // Устанавливает фокус на поле поиска при монтировании или изменении параметра focus
  useEffect(() => {
    if (shouldFocus && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [shouldFocus]);
  
  // Перенаправляет на страницу каталога с установленным фокусом на поиск
  const navigateToSearch = () => {
    navigate('/catalog?focus=search');
  };
  
  return {
    searchInputRef,
    shouldFocus,
    navigateToSearch
  };
}
