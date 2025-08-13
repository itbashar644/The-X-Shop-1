
const fs = require('fs');
const path = require('path');
const SupabaseClient = require('./lib/supabaseClient');
const ProductPageGenerator = require('./lib/productPageGenerator');
const SitemapGenerator = require('./lib/sitemapGenerator');

async function generateProductPages() {
  try {
    console.log('🚀 Начало генерации статичных страниц товаров...');
    
    // Инициализация сервисов
    const supabaseClient = new SupabaseClient();
    const pageGenerator = new ProductPageGenerator();
    const sitemapGenerator = new SitemapGenerator();
    
    // Путь к публичной директории
    const publicDir = path.join(__dirname, '../public');
    
    // Создаем директорию если её нет
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }
    
    // Получаем товары из Supabase
    const products = await supabaseClient.getProducts();
    
    if (!products || products.length === 0) {
      console.log('❌ Товары не найдены');
      return;
    }
    
    console.log(`📦 Найдено ${products.length} товаров для генерации`);
    
    // Генерируем страницы для каждого товара
    let generatedCount = 0;
    let errorCount = 0;
    
    for (const product of products) {
      try {
        const htmlContent = pageGenerator.generateProductHTML(product);
        const fileName = `product-${product.id}.html`;
        const filePath = path.join(publicDir, fileName);
        
        fs.writeFileSync(filePath, htmlContent, 'utf8');
        
        console.log(`✅ Создана страница: ${fileName}`);
        generatedCount++;
      } catch (error) {
        console.error(`❌ Ошибка создания страницы для товара ${product.id}:`, error.message);
        errorCount++;
      }
    }
    
    // Генерируем sitemap
    try {
      sitemapGenerator.saveSitemap(products, publicDir);
    } catch (error) {
      console.error('❌ Ошибка создания sitemap:', error.message);
    }
    
    // Статистика
    console.log('\n📊 Статистика генерации:');
    console.log(`✅ Успешно создано: ${generatedCount} страниц`);
    console.log(`❌ Ошибок: ${errorCount}`);
    console.log(`📁 Страницы сохранены в: ${publicDir}`);
    
    if (generatedCount > 0) {
      console.log('\n🎉 Генерация завершена успешно!');
      console.log('💡 Все страницы содержат корректную микроразметку Яндекса');
    }
    
  } catch (error) {
    console.error('💥 Критическая ошибка:', error);
    process.exit(1);
  }
}

// Запуск генерации
if (require.main === module) {
  generateProductPages();
}

module.exports = generateProductPages;
