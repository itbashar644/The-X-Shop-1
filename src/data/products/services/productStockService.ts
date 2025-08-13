import { Product } from "@/types/product";
import { invalidateCache } from "./productCacheService";
import { API_BASE_URL } from "@/types/variables";

interface StockUpdatePayload {
  quantity: number;
  colorVariant?: string;
  operation?: 'set' | 'increment';
}

export const checkProductStock = async (
  productId: string, 
  colorVariant?: string
): Promise<{ inStock: boolean; quantity: number }> => {
  try {
    const url = colorVariant 
      ? `${API_BASE_URL}/products/${productId}/stock?color=${encodeURIComponent(colorVariant)}`
      : `${API_BASE_URL}/products/${productId}/stock`;

    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const quantity = colorVariant 
      ? data.colorVariants?.[colorVariant]?.stockQuantity ?? 0
      : data.stockQuantity ?? 0;

    return {
      inStock: quantity > 0,
      quantity: quantity
    };
  } catch (error) {
    console.error('Error checking product stock:', error);
    return {
      inStock: false,
      quantity: 0
    };
  }
};

export const updateProductStock = async (
  productId: string,
  payload: StockUpdatePayload
): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE_URL}/products/${productId}/stock`, {
      method: 'PATCH',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Stock update failed:', errorData.message);
      return false;
    }

    await invalidateCache();
    return true;
  } catch (error) {
    console.error('Error updating product stock:', error);
    return false;
  }
};

export const decreaseProductStock = async (
  productId: string,
  quantity: number = 1,
  colorVariant?: string
): Promise<boolean> => {
  return updateProductStock(productId, {
    quantity: Math.abs(quantity),
    colorVariant,
    operation: 'increment'
  });
};

export const increaseProductStock = async (
  productId: string,
  quantity: number = 1,
  colorVariant?: string
): Promise<boolean> => {
  return updateProductStock(productId, {
    quantity: -Math.abs(quantity),
    colorVariant,
    operation: 'increment'
  });
};

export const setProductStock = async (
  productId: string,
  newQuantity: number,
  colorVariant?: string
): Promise<boolean> => {
  return updateProductStock(productId, {
    quantity: Math.max(0, newQuantity),
    colorVariant,
    operation: 'set'
  });
};