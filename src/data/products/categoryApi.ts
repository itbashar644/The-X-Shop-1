// src/data/products/categoryApi.ts

import { Pool } from 'pg';

export interface Category {
  id: string;
  name: string;
  description?: string;
  imageUrl?: string;
  created_at?: string;
  updated_at?: string;
}

const pool = new Pool({
  user: 'postgres',
  password: 'Se11Rg79Ey',
  host: '185.207.1.214',
  port: 5432,
  database: 'thexshop',
  ssl: {
    rejectUnauthorized: false
  }
});

// Получение всех категорий
export const fetchCategories = async (): Promise<Category[]> => {
  const res = await pool.query('SELECT * FROM categories ORDER BY created_at DESC');
  return res.rows;
};

// Добавление новой категории
export const addCategory = async (name: string, imageUrl: string = "/placeholder.svg", description?: string): Promise<boolean> => {
  await pool.query(
    'INSERT INTO categories (name, description, imageurl) VALUES ($1, $2, $3)',
    [name, description || '', imageUrl]
  );
  return true;
};

// Обновление изображения категории
export const updateCategoryImage = async (name: string, imageUrl: string): Promise<boolean> => {
  await pool.query(
    'UPDATE categories SET imageurl = $1 WHERE name = $2',
    [imageUrl, name]
  );
  return true;
};

// Удаление категории
export const removeCategory = async (name: string): Promise<boolean> => {
  await pool.query('DELETE FROM categories WHERE name = $1', [name]);
  return true;
};

// Обновление категории у продуктов
export const updateProductsCategory = async (oldCategory: string, newCategory: string): Promise<boolean> => {
  await pool.query(
    'UPDATE products SET category = $1 WHERE category = $2',
    [newCategory, oldCategory]
  );
  return true;
};

// Получение продуктов по категории
export const getProductsByCategoryName = async (category: string) => {
  const res = await pool.query(
    'SELECT * FROM products WHERE category = $1 ORDER BY created_at DESC',
    [category]
  );
  return res.rows;
};

// Получение категории по ID
export const getCategoryById = async (id: string): Promise<Category | undefined> => {
  const res = await pool.query('SELECT * FROM categories WHERE id = $1', [id]);
  return res.rows[0];
};

// Получение категории по имени
export const getCategoryByName = async (name: string): Promise<Category | undefined> => {
  const res = await pool.query('SELECT * FROM categories WHERE name = $1', [name]);
  return res.rows[0];
};

// Обновление категории
export const updateCategory = async (id: string, updates: Partial<Category>): Promise<boolean> => {
  const fields: string[] = [];
  const values: any[] = [];
  let idx = 1;

  if (updates.name) {
    fields.push(`name = $${idx++}`);
    values.push(updates.name);
  }
  if (updates.description) {
    fields.push(`description = $${idx++}`);
    values.push(updates.description);
  }
  if (updates.imageUrl) {
    fields.push(`imageurl = $${idx++}`);
    values.push(updates.imageUrl);
  }

  if (fields.length === 0) return false;

  values.push(id);
  const query = `UPDATE categories SET ${fields.join(', ')} WHERE id = $${idx}`;
  await pool.query(query, values);
  return true;
};

// Подсчёт количества продуктов в категории
export const getCategoryProductCount = async (categoryName: string): Promise<number> => {
  const res = await pool.query(
    'SELECT COUNT(*) FROM products WHERE category = $1',
    [categoryName]
  );
  return parseInt(res.rows[0].count, 10);
};
