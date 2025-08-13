
import { CartItem, DeliveryMethod } from "@/types/product";

export function useCartCalculations(items: CartItem[], deliveryMethod: DeliveryMethod | null) {
  // Filter out invalid items and calculate total number of items
  const validItems = items.filter(item => item && item.product && item.product.title);
  const totalItems = validItems.reduce((total, item) => total + item.quantity, 0);

  // Calculate subtotal
  const subtotal = validItems.reduce((total, item) => {
    // Get the price based on the selected color variant
    const price = getItemPrice(item);
    console.log(`Item ${item.product.title}, price: ${price}, quantity: ${item.quantity}`);
    return total + (price * item.quantity);
  }, 0);

  // Calculate total with delivery
  const deliveryPrice = deliveryMethod?.price || 0;
  const total = subtotal + deliveryPrice;

  console.log(`Subtotal: ${subtotal}, Delivery: ${deliveryPrice}, Total: ${total}`);
  
  return {
    totalItems,
    subtotal,
    total
  };
}

// Helper function to get the correct price for an item
function getItemPrice(item: CartItem): number {
  try {
    // Validate that item and product exist
    if (!item || !item.product) {
      console.warn("Invalid cart item or missing product:", item);
      return 0;
    }

    // Check if there's a selected color variant with price
    if (item.selectedColorVariant && (item.selectedColorVariant.discountPrice || item.selectedColorVariant.price)) {
      const price = item.selectedColorVariant.discountPrice || item.selectedColorVariant.price;
      return typeof price === 'number' ? price : 0;
    }
    
    // Check if there's a color and color variants
    if (item.color && item.product.colorVariants && item.product.colorVariants.length > 0) {
      const variant = item.product.colorVariants.find(v => v.color === item.color);
      if (variant && (variant.discountPrice || variant.price)) {
        const price = variant.discountPrice || variant.price;
        return typeof price === 'number' ? price : 0;
      }
    }
    
    // Fallback to product prices
    if (typeof item.product.discountPrice === 'number') {
      return item.product.discountPrice;
    }
    
    if (typeof item.product.price === 'number') {
      return item.product.price;
    }
    
    console.warn("No valid price found for product:", item.product.title);
    return 0;
  } catch (error) {
    console.error("Error calculating item price:", error, item);
    return 0;
  }
}
