import { Product } from "@/types/product";
import { getProductById } from "../product/productServiceSpecialized";
import { invalidateCache } from "../cache/productCache";
import { getAllProductsCached } from "./productFilterService";

/**
 * Link products by color (same model, different colors)
 * @param productIds Array of product IDs to link
 * @returns Boolean indicating success
 */
export const linkProductsByColor = async (productIds: string[]): Promise<boolean> => {
  try {
    if (!productIds || productIds.length < 2) {
      return false;
    }
    
    // Generate a model name if products don't have one
    const modelName = `model_${Date.now()}`;
    
    // Update each product with the same model name
    for (const id of productIds) {
      const product = await getProductById(id);
      if (product) {
        product.modelName = modelName;
        // TODO: Update product in database
        console.log('Linking product by color:', { id, modelName });
      }
    }
    
    // Invalidate cache to reflect changes
    invalidateCache();
    
    return true;
  } catch (error) {
    console.error("Error linking products by color:", error);
    return false;
  }
};

/**
 * Gets related products by color for a product
 * @param productId ID of the product
 * @returns Array of related color products
 */
export const getRelatedColorProducts = async (productId: string): Promise<Product[]> => {
  try {
    const product = await getProductById(productId);
    
    if (!product || !product.modelName) {
      return [];
    }
    
    // Get all products with the same model name
    const allProducts = await getAllProductsCached();
    const relatedProducts = allProducts.filter(p => p.modelName === product.modelName);
    
    // Filter out the current product
    return relatedProducts.filter(p => p.id !== productId);
  } catch (error) {
    console.error("Error getting related color products:", error);
    return [];
  }
};
