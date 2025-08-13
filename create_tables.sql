-- Создание таблицы categories
CREATE TABLE IF NOT EXISTS categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    image_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Создание таблицы products
CREATE TABLE IF NOT EXISTS products (
    id VARCHAR(255) PRIMARY KEY,
    title VARCHAR(500) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    discount_price DECIMAL(10,2),
    category VARCHAR(255) REFERENCES categories(name),
    image_url VARCHAR(500),
    additional_images JSONB,
    rating DECIMAL(3,2),
    in_stock BOOLEAN DEFAULT true,
    colors JSONB,
    sizes JSONB,
    country_of_origin VARCHAR(100),
    specifications JSONB,
    is_new BOOLEAN DEFAULT false,
    is_bestseller BOOLEAN DEFAULT false,
    article_number VARCHAR(100),
    barcode VARCHAR(100),
    ozon_url VARCHAR(500),
    wildberries_url VARCHAR(500),
    avito_url VARCHAR(500),
    archived BOOLEAN DEFAULT false,
    stock_quantity INTEGER DEFAULT 0,
    color_variants JSONB,
    video_url VARCHAR(500),
    video_type VARCHAR(50),
    material VARCHAR(200),
    model_name VARCHAR(200),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Создание индексов для улучшения производительности
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_archived ON products(archived);
CREATE INDEX IF NOT EXISTS idx_products_in_stock ON products(in_stock);

CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY,
  user_id UUID,
  items JSONB NOT NULL,
  total NUMERIC(12,2) NOT NULL,
  delivery_method TEXT NOT NULL,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  delivery_address TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'new',
  created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW()
); 