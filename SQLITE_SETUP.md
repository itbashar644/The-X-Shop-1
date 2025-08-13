# Настройка SQLite для The X Shop

## Обзор

Проект был обновлен для использования SQLite в качестве локальной базы данных вместо Supabase. Это решает проблемы с блокировкой доменов мобильными операторами и обеспечивает автономную работу сайта.

## Структура изменений

### 1. База данных SQLite
- **Файл**: `database.db` (создается автоматически)
- **Скрипт инициализации**: `scripts/init-sqlite.js`
- **Класс базы данных**: `src/data/sqlite/database.ts`

### 2. API для работы с данными
- **Продукты**: `src/data/products/sqlite/productApi.ts`
- **Категории**: `src/data/products/sqlite/categoryApi.ts`
- **Универсальные API**: `src/data/products/index.ts`

### 3. Обновленные сервисы
- **Кэш продуктов**: `src/data/products/cache/productCache.ts`
- **Фильтрация**: `src/data/products/product/services/productFilterService.ts`
- **Цвета**: `src/data/products/product/services/productColorService.ts`
- **Остатки**: `src/data/products/product/services/productStockService.ts`

## Установка и настройка

### 1. Инициализация базы данных

```bash
# Установка зависимостей
npm install

# Инициализация SQLite базы данных
npm run init-sqlite
```

### 2. Запуск проекта

```bash
# Разработка
npm run dev

# Сборка
npm run build

# Предварительный просмотр
npm run preview
```

## Структура базы данных

### Таблица `products`
```sql
CREATE TABLE products (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  price REAL NOT NULL,
  discount_price REAL,
  category TEXT NOT NULL,
  image_url TEXT,
  additional_images TEXT,
  rating REAL DEFAULT 4.7,
  in_stock BOOLEAN DEFAULT TRUE,
  colors TEXT,
  sizes TEXT,
  material TEXT,
  country_of_origin TEXT,
  specifications TEXT,
  is_new BOOLEAN DEFAULT FALSE,
  is_bestseller BOOLEAN DEFAULT FALSE,
  article_number TEXT,
  barcode TEXT,
  ozon_url TEXT,
  wildberries_url TEXT,
  avito_url TEXT,
  archived BOOLEAN DEFAULT FALSE,
  stock_quantity INTEGER DEFAULT 0,
  color_variants TEXT,
  video_url TEXT,
  video_type TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
  model_name TEXT,
  wildberries_sku TEXT
);
```

### Таблица `categories`
```sql
CREATE TABLE categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  image TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);
```

### Таблица `users`
```sql
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  role TEXT DEFAULT 'user',
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);
```

### Таблицы заказов
```sql
CREATE TABLE orders (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  total REAL NOT NULL,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users (id)
);

CREATE TABLE order_items (
  id TEXT PRIMARY KEY,
  order_id TEXT NOT NULL,
  product_id TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  price REAL NOT NULL,
  FOREIGN KEY (order_id) REFERENCES orders (id),
  FOREIGN KEY (product_id) REFERENCES products (id)
);
```

## API функции

### Продукты
- `fetchProductsFromSQLite()` - получение всех продуктов
- `getProductByIdFromSQLite(id)` - получение продукта по ID
- `addOrUpdateProductInSQLite(product)` - добавление/обновление продукта
- `archiveProductInSQLite(id)` - архивирование продукта
- `restoreProductInSQLite(id)` - восстановление продукта
- `removeProductFromSQLite(id)` - удаление продукта
- `getProductsByCategoryFromSQLite(category)` - получение продуктов по категории

### Категории
- `fetchCategoriesFromSQLite()` - получение всех категорий
- `addCategoryToSQLite(name, imageUrl)` - добавление категории
- `updateCategoryImageInSQLite(name, imageUrl)` - обновление изображения категории
- `removeCategoryFromSQLite(name)` - удаление категории
- `updateProductsCategoryInSQLite(oldCategory, newCategory)` - обновление категории товаров

## Кэширование

Проект использует систему кэширования для оптимизации производительности:

- **Время жизни кэша**: 5 минут
- **Автоматическое обновление**: при истечении времени
- **Принудительное обновление**: при изменении данных

## Миграция данных

Для переноса данных из Supabase в SQLite:

1. Экспортируйте данные из Supabase
2. Преобразуйте формат данных в соответствии с SQLite схемой
3. Используйте скрипт миграции (будет создан позже)

## Преимущества SQLite

1. **Автономность**: сайт работает без интернета
2. **Скорость**: локальный доступ к данным
3. **Надежность**: нет зависимости от внешних сервисов
4. **Простота**: один файл базы данных
5. **Безопасность**: данные хранятся локально

## Ограничения

1. **Размер**: база данных ограничена размером файла
2. **Одновременный доступ**: ограниченная поддержка множественных пользователей
3. **Резервное копирование**: необходимо вручную копировать файл базы данных

## Резервное копирование

```bash
# Создание резервной копии
cp database.db database_backup_$(date +%Y%m%d_%H%M%S).db

# Восстановление из резервной копии
cp database_backup_YYYYMMDD_HHMMSS.db database.db
```

## Устранение неполадок

### Проблема: База данных не создается
```bash
# Удалите старый файл и пересоздайте
rm database.db
npm run init-sqlite
```

### Проблема: Ошибки доступа к файлу
```bash
# Проверьте права доступа
chmod 644 database.db
```

### Проблема: Повреждение базы данных
```bash
# Восстановите из резервной копии
cp database_backup.db database.db
```

## Дальнейшее развитие

1. **Полная реализация API**: завершение всех функций SQLite
2. **Синхронизация**: автоматическая синхронизация с Supabase
3. **Миграция**: скрипты для переноса данных
4. **Оптимизация**: индексы и оптимизация запросов
5. **Безопасность**: шифрование базы данных 