
import { updateProductStock } from "@/data/products/services/productStockService";

/**
 * API handler for updating product stock quantities
 */
export async function updateProductStockHandler(
  productId: string,
  stockQuantity: number,
  colorVariant?: string
): Promise<{
  success: boolean;
  message?: string;
  error?: string;
  stockQuantity?: number;
}> {
  try {
    if (!productId || typeof productId !== 'string') {
      return { success: false, error: 'Product ID is required' };
    }

    if (stockQuantity === undefined || typeof stockQuantity !== 'number') {
      return { success: false, error: 'Valid stock quantity is required' };
    }

    // Update the product stock
    const success = await updateProductStock(
      productId,
      stockQuantity,
      colorVariant || undefined
    );

    if (success) {
      return { 
        success: true,
        message: 'Stock updated successfully',
        stockQuantity
      };
    } else {
      return { 
        success: false,
        error: 'Failed to update stock' 
      };
    }
    
  } catch (error) {
    console.error('Error updating product stock:', error);
    return { 
      success: false,
      error: 'Internal server error' 
    };
  }
}
