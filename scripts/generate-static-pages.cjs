const fs = require('fs');
const path = require('path');
const SQLiteDatabase      = require('../src/data/sqlite/database');
const StaticPageGenerator = require('./lib/staticPageGenerator.cjs');
const SitemapGenerator    = require('./lib/sitemapGenerator.cjs');


async function generateStaticPages() {
  try {
    // Инициализация сервисов
    const SQLiteClient = new SQLiteDatabase();
    const pageGenerator = new StaticPageGenerator();
    const sitemapGenerator = new SitemapGenerator();
    
    // Путь к публичной директории
    const publicDir = path.join(__dirname, '../public');
    
    // Создаем директорию если её нет
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }
    
    // Получаем товары из Supabase
    const products = await SQLiteClient.getProducts();
   
    if (!products || products.length === 0) {
      return;
    }
    
    // Удаляем старые файлы товаров
    const existingFiles = fs.readdirSync(publicDir);
    const productFiles = existingFiles.filter(file => file.startsWith('product-') && file.endsWith('.html'));
    
    productFiles.forEach(file => {
      fs.unlinkSync(path.join(publicDir, file));
    });
    
    // Генерируем новые страницы товаров
    let generatedCount = 0;
    let errorCount = 0;
    
    for (const product of products) {
      try {
        const slug = pageGenerator.generateSlug(product.title);
        const htmlContent = pageGenerator.generateProductHTML(product, slug);
        const fileName = `product-${slug}.html`;
        const filePath = path.join(publicDir, fileName);
        
        fs.writeFileSync(filePath, htmlContent, 'utf8');
        
        generatedCount++;
      } catch (error) {
        errorCount++;
      }
    }
    
    // Генерируем sitemap
    try {
      sitemapGenerator.saveSitemap(products, publicDir);
    } catch (error) {
    }
    
    // Создаем файл с маппингом ID -> slug для редиректов
    const mapping = {};
    products.forEach(product => {
      const slug = pageGenerator.generateSlug(product.title);
      mapping[product.id] = slug;
    });
    
    const mappingPath = path.join(publicDir, 'product-mapping.json');
    fs.writeFileSync(mappingPath, JSON.stringify(mapping, null, 2), 'utf8');
    
    // Статистика
    if (generatedCount > 0) {
    }
    
  } catch (error) {
    process.exit(1);
  }
}

// Запуск генерации
if (require.main === module) {
  generateStaticPages();
}

module.exports = generateStaticPages;
