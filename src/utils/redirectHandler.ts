
// Обработчик редиректов для статических страниц товаров
export async function initRedirectHandler() {
  // Проверяем, находимся ли мы в браузере
  if (typeof window === 'undefined') return;
  
  const currentPath = window.location.pathname;
  
  // Проверяем, является ли это путем к товару вида /product/<slug>
  const productMatch = currentPath.match(/^\/product\/([^\/]+)$/);
  
  if (productMatch) {
    const slug = productMatch[1];
    
    try {
      // Загружаем маппинг ID -> slug
      const response = await fetch('/product-mapping.json');
      if (response.ok) {
        const mapping = await response.json();
        
        // Ищем ID товара по slug
        let productId = null;
        for (const [id, mappedSlug] of Object.entries(mapping)) {
          if (mappedSlug === slug) {
            productId = id;
            break;
          }
        }
        
        if (productId) {
          // Проверяем, существует ли статическая страница
          const staticPageUrl = `/product-${slug}.html`;
          const staticPageResponse = await fetch(staticPageUrl, { method: 'HEAD' });
          
          if (staticPageResponse.ok) {
            console.log(`Redirecting from ${currentPath} to ${staticPageUrl}`);
            window.location.replace(staticPageUrl);
            return;
          }
        }
      }
    } catch (error) {
      console.error('Error checking for static page:', error);
    }
    
    // Если статическая страница не найдена, продолжаем с обычной маршрутизацией
    console.log(`No static page found for ${slug}, using dynamic route`);
  }
}

// Функция для генерации URL статической страницы
export function getStaticPageUrl(productId: string, productTitle: string): string | null {
  const slug = generateSlug(productTitle);
  return `/product-${slug}.html`;
}

// Генерация slug (должна совпадать с логикой в staticPageGenerator.cjs)
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[а-я]/g, (char) => {
      const map: Record<string, string> = {
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
