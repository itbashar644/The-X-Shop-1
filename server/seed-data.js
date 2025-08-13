const { Pool } = require('pg');

// Конфигурация подключения к PostgreSQL
const pool = new Pool({
  user: 'postgres',                 // твой пользователь PostgreSQL
  password: 'Se11Rg79Ey',            // твой пароль
  host: '185.207.1.214',           // твой хост сервера
  port: 5432,                      // стандартный порт PostgreSQL
  database: 'thexshop',            // твоя база данных
  ssl: {
    rejectUnauthorized: false      // если SSL нужен — так, чтобы не ругался на сертификат
  }
});

async function seedData() {
  try {
    console.log('🌱 Запуск заполнения базы данных...');

    // Создаем таблицы, если их нет
    await pool.query(`
      CREATE TABLE IF NOT EXISTS categories (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL UNIQUE,
        image_url VARCHAR(500) DEFAULT '/placeholder.svg',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS products (
        id UUID PRIMARY KEY,
        title VARCHAR(500) NOT NULL,
        description TEXT,
        price DECIMAL(10,2) NOT NULL,
        discount_price DECIMAL(10,2),
        category VARCHAR(255) NOT NULL,
        image_url VARCHAR(500) DEFAULT '/placeholder.svg',
        additional_images JSONB,
        rating DECIMAL(3,2) DEFAULT 4.8,
        in_stock BOOLEAN DEFAULT true,
        colors JSONB,
        sizes JSONB,
        country_of_origin VARCHAR(100) DEFAULT 'Россия',
        specifications JSONB,
        is_new BOOLEAN DEFAULT false,
        is_bestseller BOOLEAN DEFAULT false,
        article_number VARCHAR(100),
        barcode VARCHAR(100),
        ozon_url VARCHAR(500),
        wildberries_url VARCHAR(500),
        avito_url VARCHAR(500),
        archived BOOLEAN DEFAULT false,
        stock_quantity INTEGER,
        color_variants JSONB,
        video_url VARCHAR(500),
        video_type VARCHAR(50),
        material VARCHAR(100),
        model_name VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Добавляем категории
    const categories = [
      { name: 'Электроника', image_url: '/placeholder.svg' },
      { name: 'Одежда', image_url: '/placeholder.svg' },
      { name: 'Дом и сад', image_url: '/placeholder.svg' },
      { name: 'Спорт', image_url: '/placeholder.svg' }
    ];

    for (const category of categories) {
      await pool.query(
        `INSERT INTO categories (name, image_url) VALUES ($1, $2) ON CONFLICT (name) DO NOTHING`,
        [category.name, category.image_url]
      );
    }

    // Добавляем тестовый товар
    const testProduct = {
      id: '7aa5d2eb-0c86-4b53-aa41-024a36457606',
      title: 'Тестовый товар',
      description: 'Это тестовый товар для проверки работы API',
      price: 999.99,
      discount_price: 799.99,
      category: 'Электроника',
      image_url: '/placeholder.svg',
      additional_images: [],
      rating: 4.8,
      in_stock: true,
      colors: ['Черный', 'Белый'],
      sizes: ['M', 'L', 'XL'],
      country_of_origin: 'Россия',
      specifications: { 'Вес': '100г', 'Размер': '10x5x2см' },
      is_new: true,
      is_bestseller: false,
      article_number: 'TEST001',
      barcode: '1234567890123',
      stock_quantity: 50,
      color_variants: [
        {
          color: 'Черный',
          price: 999.99,
          discountPrice: 799.99,
          stockQuantity: 25,
          imageUrl: '/placeholder.svg'
        },
        {
          color: 'Белый',
          price: 999.99,
          discountPrice: 799.99,
          stockQuantity: 25,
          imageUrl: '/placeholder.svg'
        }
      ],
      archived: false
    };

    await pool.query(`
      INSERT INTO products (
        id, title, description, price, discount_price, category, image_url, 
        additional_images, rating, in_stock, colors, sizes, country_of_origin,
        specifications, is_new, is_bestseller, article_number, barcode,
        stock_quantity, color_variants, archived
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21)
      ON CONFLICT (id) DO UPDATE SET
        title = EXCLUDED.title,
        description = EXCLUDED.description,
        price = EXCLUDED.price,
        discount_price = EXCLUDED.discount_price,
        category = EXCLUDED.category,
        image_url = EXCLUDED.image_url,
        additional_images = EXCLUDED.additional_images,
        rating = EXCLUDED.rating,
        in_stock = EXCLUDED.in_stock,
        colors = EXCLUDED.colors,
        sizes = EXCLUDED.sizes,
        country_of_origin = EXCLUDED.country_of_origin,
        specifications = EXCLUDED.specifications,
        is_new = EXCLUDED.is_new,
        is_bestseller = EXCLUDED.is_bestseller,
        article_number = EXCLUDED.article_number,
        barcode = EXCLUDED.barcode,
        stock_quantity = EXCLUDED.stock_quantity,
        color_variants = EXCLUDED.color_variants,
        archived = EXCLUDED.archived
    `, [
      testProduct.id, testProduct.title, testProduct.description, testProduct.price,
      testProduct.discount_price, testProduct.category, testProduct.image_url,
      JSON.stringify(testProduct.additional_images), testProduct.rating, testProduct.in_stock,
      JSON.stringify(testProduct.colors), JSON.stringify(testProduct.sizes),
      testProduct.country_of_origin, JSON.stringify(testProduct.specifications),
      testProduct.is_new, testProduct.is_bestseller, testProduct.article_number,
      testProduct.barcode, testProduct.stock_quantity, JSON.stringify(testProduct.color_variants),
      testProduct.archived
    ]);

    console.log('✅ Данные успешно добавлены!');
    console.log('📊 Добавлено категорий:', categories.length);
    console.log('📦 Добавлен тестовый товар с ID:', testProduct.id);

  } catch (error) {
    console.error('❌ Ошибка при заполнении данных:', error);
  } finally {
    await pool.end();
  }
}

seedData();
