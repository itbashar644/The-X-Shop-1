// Re-export from cache/productCache
export * from './cache/productCache';

// Re-export from product/productServiceBase
export * from './product/productServiceBase';

// Re-export specialized functions 
export {
  getAllProductsCached,
  getActiveProducts,
  getBestsellers,
  getNewProducts,
  getRelatedProducts,
  getRelatedColorProducts,
  linkProductsByColor,
  invalidateCache,
  loadAllProducts,
  // Re-export getProductById from specialized service (will override the base one)
  getProductById,
  // Re-export specialized getProductsByCategory (will override the base one)
  getProductsByCategory,
  // Re-export stock related functions
  checkProductStock,
  decreaseProductStock,
} from './product/productServiceSpecialized';

// Export the getProductPrice function from utils 
export { getProductPrice } from '@/lib/Image-utils';
