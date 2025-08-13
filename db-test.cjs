const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  password: 'Se11Rg79Ey', // Ваш пароль
  host: '185.207.1.214',
  port: 5432,
  database: 'thexshop',
  ssl: {
    rejectUnauthorized: false // Отключаем проверку сертификата
  }
});

async function testConnection() {
  try {
    const res = await pool.query('SELECT NOW()');
    console.log('✅ Успешное подключение! Серверное время:', res.rows[0].now);
  } catch (err) {
    console.error('❌ Ошибка подключения:', err);
  } finally {
    await pool.end();
  }
}

testConnection();