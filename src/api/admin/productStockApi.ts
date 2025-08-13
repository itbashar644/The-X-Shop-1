
import { API_BASE_URL } from "@/types/variables";

/**
 * Update product stock quantity directly via backend API
 */
export const updateProductStockApi = async (
  productId: string,
  stockQuantity: number,
  colorVariant?: string
): Promise<{ success: boolean; message?: string; error?: string }> => {
  try {
    let url = `${API_BASE_URL}/products/${productId}/stock`;
    const body: any = { stockQuantity };
    if (colorVariant) body.colorVariant = colorVariant;

    const res = await fetch(url, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const err = await res.json();
      return { success: false, error: err.error || "Ошибка обновления" };
    }
    return { success: true, message: "Stock updated successfully" };
  } catch (error: any) {
    return { success: false, error: error.message || "Unknown error" };
  }
};

/**
 * API endpoint for updating product stock (to be used by frontend)
 */
export const updateProductStockApiEndpoint = async (
  productId: string,
  stockQuantity: number,
  colorVariant?: string
): Promise<{
  success: boolean;
  message?: string;
  error?: string;
  stockQuantity?: number;
}> => {
  try {
    const result = await updateProductStockApi(productId, stockQuantity, colorVariant);
    return {
      ...result,
      stockQuantity: result.success ? stockQuantity : undefined,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "Unknown error",
    };
  }
};
