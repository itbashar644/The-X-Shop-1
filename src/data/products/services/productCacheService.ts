
import { refreshCacheIfNeeded } from "../cache/productCache";

/**
 * Invalidates product cache
 */
export const invalidateCache = async (): Promise<void> => {
  console.log("Invalidating product cache");
  try {
    // Force refresh the cache
    await refreshCacheIfNeeded(true);
    console.log("Product cache invalidated successfully");
  } catch (error) {
    console.error("Error invalidating product cache:", error);
    // Try one more time after a short delay
    setTimeout(async () => {
      try {
        await refreshCacheIfNeeded(true);
        console.log("Product cache invalidated on retry");
      } catch (retryError) {
        console.error("Failed to invalidate product cache even after retry:", retryError);
      }
    }, 1000);
  }
};

/**
 * Loads products into cache
 */
export const loadAllProducts = async (): Promise<void> => {
  console.log("Loading all products into cache");
  try {
    // Force refresh the cache
    await refreshCacheIfNeeded(true);
    console.log("All products loaded into cache successfully");
  } catch (error) {
    console.error("Error loading products into cache:", error);
    throw error; // Let callers know about the error
  }
};
