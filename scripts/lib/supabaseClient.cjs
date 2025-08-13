require('dotenv').config();

class SupabaseClient {
  constructor() {
    this.supabaseUrl = process.env.SUPABASE_URL;
    this.supabaseKey = process.env.SUPABASE_ANON_KEY;
    
    if (!this.supabaseUrl || !this.supabaseKey) {
      throw new Error('Отсутствуют переменные окружения SUPABASE_URL или SUPABASE_ANON_KEY');
    }
  }

  async getProducts() {
    try {
      const response = await fetch(`${this.supabaseUrl}/rest/v1/products?select=*`, {
        headers: {
          'apikey': this.supabaseKey,
          'Authorization': `Bearer ${this.supabaseKey}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const products = await response.json();
      return products;
    } catch (error) {
      console.error('❌ Ошибка получения товаров:', error.message);
      throw error;
    }
  }
}

module.exports = SupabaseClient;
