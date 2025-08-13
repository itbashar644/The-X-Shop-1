const fs = require('fs');
const path = require('path');

class SitemapGenerator {
  constructor(baseUrl = 'https://the-x.shop') {
    this.baseUrl = baseUrl;
  }

  // Генерация XML sitemap
  generateSitemap(products) {
    const staticPages = [
      { url: '', priority: '1.0', changefreq: 'daily' },
      { url: '/catalog', priority: '0.9', changefreq: 'daily' },
      { url: '/auth', priority: '0.5', changefreq: 'monthly' },
      { url: '/profile', priority: '0.5', changefreq: 'weekly' },
      { url: '/cart', priority: '0.7', changefreq: 'daily' },
      { url: '/orders', priority: '0.6', changefreq: 'weekly' }
    ];

    // Генератор слагов (должен совпадать с логикой в StaticPageGenerator)
    const generateSlug = (title) => {
      return title
        .toLowerCase()
        .replace(/[а-я]/g, (char) => {
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
    };

    const productPages = products.map(product => ({
      url: `/product/${generateSlug(product.title)}`,
      priority: '0.8',
      changefreq: 'weekly',
      lastmod: product.updated_at || new Date().toISOString()
    }));

    const allPages = [...staticPages, ...productPages];

    const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages.map(page => `  <url>
    <loc>${this.baseUrl}${page.url}</loc>
    <lastmod>${page.lastmod || new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

    return sitemapXml;
  }

  // Сохранение sitemap в файл
  saveSitemap(products, outputPath) {
    const sitemapContent = this.generateSitemap(products);
    const sitemapPath = path.join(outputPath, 'sitemap.xml');
    
    fs.writeFileSync(sitemapPath, sitemapContent, 'utf8');
    console.log(`✅ Sitemap сохранен: ${sitemapPath}`);
    
    return sitemapPath;
  }
}

module.exports = SitemapGenerator;
