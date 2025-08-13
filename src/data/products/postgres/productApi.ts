import { Product } from '@/types/product';
import { API_BASE_URL } from '@/types/variables';

function validateMarketplaceUrl(url: string | undefined): string {
  if (!url) return '';
  try {
    new URL(url);
    return url;
  } catch {
    return '';
  }
}

function transformProductFromApi(apiProduct: any): Product {
  const price = Number(apiProduct.price) || 0;
  const originalPrice = Number(apiProduct.original_price) || price;
  const discountPrice = Number(apiProduct.discount_price) || 0;

  return {
    id: apiProduct.id,
    title: apiProduct.title,
    description: apiProduct.description,
    price: price,
    originalPrice: originalPrice,
    discountPrice: discountPrice > 0 && discountPrice < price ? discountPrice : undefined,
    category: apiProduct.category,
    imageUrl: apiProduct.image_url || '',
    additionalImages: Array.isArray(apiProduct.additional_images) ? apiProduct.additional_images : [],
    rating: apiProduct.rating || 0,
    inStock: apiProduct.in_stock || false,
    stockQuantity: apiProduct.stock_quantity || 0,
    colors: apiProduct.colors || [],
    sizes: apiProduct.sizes || [],
    material: apiProduct.material || '',
    countryOfOrigin: apiProduct.country_of_origin || '',
    specifications: apiProduct.specifications || {},
    isNew: apiProduct.is_new || false,
    isBestseller: apiProduct.is_bestseller || false,
    articleNumber: apiProduct.article_number || '',
    barcode: apiProduct.barcode || '',
    ozonUrl: validateMarketplaceUrl(apiProduct.ozon_url),
    wildberriesUrl: validateMarketplaceUrl(apiProduct.wildberries_url),
    avitoUrl: validateMarketplaceUrl(apiProduct.avito_url),
    archived: apiProduct.archived || false,
    colorVariants: apiProduct.color_variants || [],
    videoUrl: apiProduct.video_url || '',
    videoType: apiProduct.video_type || 'mp4',
    createdAt: apiProduct.created_at || '',
    updatedAt: apiProduct.updated_at || '',
    modelName: apiProduct.model_name || '',
    wildberriesSku: apiProduct.wildberries_sku || '',
  };
}

export const fetchProductsFromPostgres = async (): Promise<Product[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/products`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const products = await response.json();
    return products.map(transformProductFromApi);
  } catch (error) {
    console.error('Error loading products from API:', error);
    throw error;
  }
};

export const getProductsByCategoryFromPostgres = async (category: string): Promise<Product[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/products/category/${encodeURIComponent(category)}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const products = await response.json();
    return products.map(transformProductFromApi);
  } catch (error) {
    console.error('Error loading products by category from API:', error);
    throw error;
  }
};

export const addOrUpdateProduct = async (product: Product): Promise<Product> => {
  const method = product.id ? 'PUT' : 'POST';
  const url = product.id ? `${API_BASE_URL}/products/${product.id}` : `${API_BASE_URL}/products`;
  const response = await fetch(url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(product),
  });
  if (!response.ok) throw new Error('Ошибка при сохранении товара');
  return transformProductFromApi(await response.json());
};

export const deleteProduct = async (id: string): Promise<boolean> => {
  const response = await fetch(`${API_BASE_URL}/products/${id}`, { method: 'DELETE' });
  return response.ok;
};

export const archiveProduct = async (id: string, archive: boolean): Promise<boolean> => {
  const response = await fetch(`${API_BASE_URL}/products/${id}/archive`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ archived: archive }),
  });
  return response.ok;
};

export const bulkDeleteProducts = async (ids: string[]): Promise<boolean> => {
  const response = await fetch(`${API_BASE_URL}/products/bulk-delete`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ids }),
  });
  return response.ok;
};

export const bulkArchiveProducts = async (ids: string[], archive: boolean): Promise<boolean> => {
  const response = await fetch(`${API_BASE_URL}/products/bulk-archive`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ids, archive }),
  });
  return response.ok;
};

export const mergeProductsByModelName = async (ids: string[]): Promise<boolean> => {
  const response = await fetch(`${API_BASE_URL}/products/bulk-merge`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ids }),
  });
  return response.ok;
};

export const getProductById = async (id: string): Promise<Product | null> => {
  try {
    const response = await fetch(`${API_BASE_URL}/products/${id}`);
    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const apiProduct = await response.json();
    return transformProductFromApi(apiProduct);
  } catch (error) {
    console.error('Error loading product from API:', error);
    return null;
  }
};