const fs = require('fs');
const path = require('path');
const initSqlJs = require('sql.js');

async function initSQLite() {
  try {
    const SQL = await initSqlJs();
    const dbPath = path.join(process.cwd(), 'database.db');
    const db = fs.existsSync(dbPath)
      ? new SQL.Database(fs.readFileSync(dbPath))
      : new SQL.Database();

    db.run(`
      CREATE TABLE IF NOT EXISTS categories (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT,
        imageUrl TEXT,
        created_at TEXT,
        updated_at TEXT
      );
      CREATE TABLE IF NOT EXISTS products (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT,
        price REAL NOT NULL,
        category TEXT,
        imageUrl TEXT,
        rating REAL,
        inStock INTEGER,
        stockQuantity INTEGER,
        archived INTEGER,
        isNew INTEGER,
        isBestseller INTEGER
      );
    `);

    const dataPath = path.join(__dirname, '../src/data/mock-data.json');
    const data = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

    const insertCategory = db.prepare(
      'INSERT OR REPLACE INTO categories (id, name, description, imageUrl, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)'
    );
    data.categories.forEach((c) => {
      insertCategory.run([
        c.id,
        c.name,
        c.description || null,
        c.imageUrl || null,
        c.created_at || null,
        c.updated_at || null,
      ]);
    });
    insertCategory.free();

    const insertProduct = db.prepare(
      'INSERT OR REPLACE INTO products (id, title, description, price, category, imageUrl, rating, inStock, stockQuantity, archived, isNew, isBestseller) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
    );
    data.products.forEach((p) => {
      insertProduct.run([
        p.id,
        p.title,
        p.description || null,
        p.price,
        p.category,
        p.imageUrl || null,
        p.rating || null,
        p.inStock ? 1 : 0,
        p.stockQuantity || 0,
        p.archived ? 1 : 0,
        p.isNew ? 1 : 0,
        p.isBestseller ? 1 : 0,
      ]);
    });
    insertProduct.free();

    const buffer = Buffer.from(db.export());
    fs.writeFileSync(dbPath, buffer);
    console.log('SQLite database initialized at', dbPath);
  } catch (err) {
    console.error('Failed to initialize SQLite database:', err);
    process.exit(1);
  }
}

if (require.main === module) {
  initSQLite();
}

module.exports = initSQLite;
