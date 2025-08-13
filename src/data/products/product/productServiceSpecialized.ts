import { Product } from "@/types/product";
 

// Import the services
import * as ProductCacheService from "../services/productCacheService";
import * as ProductColorService from "../services/productColorService";
import * as ProductFilterService from "../services/productFilterService";
import * as ProductStockService from "../services/productStockService";
import { API_BASE_URL } from "@/types/variables";

// Export the services - avoid using ProductStockService.checkProductStock directly
// This fixes the circular dependency issue
export const invalidateCache = ProductCacheService.invalidateCache;
export const loadAllProducts = ProductCacheService.loadAllProducts;

export const linkProductsByColor = ProductColorService.linkProductsByColor;
export const getRelatedColorProducts = ProductColorService.getRelatedColorProducts;

export const getAllProductsCached = ProductFilterService.getAllProductsCached;
export const getProductsByCategory = ProductFilterService.getProductsByCategory;
export const getActiveProducts = ProductFilterService.getActiveProducts;
export const getBestsellers = ProductFilterService.getBestsellers;
export const getNewProducts = ProductFilterService.getNewProducts;
export const getRelatedProducts = ProductFilterService.getRelatedProducts;

export const checkProductStock = ProductStockService.checkProductStock;
export const decreaseProductStock = ProductStockService.decreaseProductStock;

 


function transformProductFromApi(apiProduct) {
  return {
    id: apiProduct.id,
    title: apiProduct.title,
    description: apiProduct.description,
    price: apiProduct.price,
    discountPrice: apiProduct.discount_price,
    category: apiProduct.category,
    imageUrl: apiProduct.image_url || '',
    additionalImages: Array.isArray(apiProduct.additional_images) ? apiProduct.additional_images : [],
    rating: apiProduct.rating,
    inStock: apiProduct.in_stock,
    colors: apiProduct.colors,
    sizes: apiProduct.sizes,
    material: apiProduct.material,
    countryOfOrigin: apiProduct.country_of_origin,
    specifications: apiProduct.specifications,
    isNew: apiProduct.is_new,
    isBestseller: apiProduct.is_bestseller,
    articleNumber: apiProduct.article_number,
    barcode: apiProduct.barcode,
    ozonUrl: apiProduct.ozon_url,
    wildberriesUrl: apiProduct.wildberries_url,
    avitoUrl: apiProduct.avito_url,
    archived: apiProduct.archived,
    stockQuantity: apiProduct.stock_quantity,
    colorVariants: apiProduct.color_variants,
    videoUrl: apiProduct.video_url,
    videoType: apiProduct.video_type,
    createdAt: apiProduct.created_at,
    updatedAt: apiProduct.updated_at,
    modelName: apiProduct.model_name,
    wildberriesSku: apiProduct.wildberries_sku,
  };
}

/**
 * Gets a product by ID from API
 */
export const getProductById = async (id: string): Promise<Product | null> => {
  try {
    console.log(`🔍 getProductById: Loading product with ID ${id} from API`);
    
    const response = await fetch(`${API_BASE_URL}/products/${id}`);
 
    if (!response.ok) {
      if (response.status === 404) {
        console.log(`❌ getProductById: Product with ID ${id} not found`);
        return null;
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const apiProduct = await response.json();
    const product = transformProductFromApi(apiProduct);
    console.log(`✅ getProductById: Loaded product "${product.title}" from API`);
    return product;
  } catch (error) {
    console.error('❌ getProductById: Error loading product from API:', error);
    
    return null;
  }
};
