
import { useState } from "react";
import { CartItem } from "@/types/product";
import { useToast } from "@/hooks/use-toast";
import { checkProductStock, decreaseProductStock } from "@/data/products/services/productStockService";

export function useCartActions() {
  const { toast } = useToast();

  // Function to find an existing item with the same product ID and variant
  const findExistingItemIndex = (items: CartItem[], newItem: CartItem): number => {
    return items.findIndex(
      (i) => 
        i.product.id === newItem.product.id && 
        i.color === newItem.color && 
        i.size === newItem.size
    );
  };

  const addItem = async (items: CartItem[], item: CartItem, setItems: React.Dispatch<React.SetStateAction<CartItem[]>>) => {
    try {
      const existingItemIndex = findExistingItemIndex(items, item);
      
      // Check if there's enough stock for the requested quantity
      const stockAvailable = await checkProductStock(String(item.product.id), item.color);
      
      if (!stockAvailable) {
        toast({
          title: "Ошибка",
          description: "Недостаточно товара на складе",
          variant: "destructive"
        });
        return; // Don't update cart if not enough stock
      }

      setItems((prevItems) => {
        if (existingItemIndex >= 0) {
          // Item exists, update quantity
          const newItems = [...prevItems];
          newItems[existingItemIndex] = {
            ...newItems[existingItemIndex],
            quantity: newItems[existingItemIndex].quantity + item.quantity,
          };
          return newItems;
        } else {
          // Item doesn't exist, add it
          return [...prevItems, item];
        }
      });
      
      toast({
        title: "Товар добавлен в корзину",
        description: `${item.product.title} - ${item.color || ""}`
      });
    } catch (error) {
      console.error("Error adding item to cart:", error);
      toast({
        title: "Ошибка",
        description: "Не удалось добавить товар в корзину",
        variant: "destructive"
      });
    }
  };

  const removeItem = (itemId: string, color: string | undefined, setItems: React.Dispatch<React.SetStateAction<CartItem[]>>) => {
    setItems((prevItems) => {
      if (color) {
        // If color is specified, only remove items with that color
        return prevItems.filter(
          (item) => !(item.product.id === itemId && item.color === color)
        );
      } else {
        // Otherwise remove all items with the product ID
        return prevItems.filter((item) => item.product.id !== itemId);
      }
    });
    toast({
      title: "Товар удален из корзины"
    });
  };

  const updateQuantity = async (
    itemId: string, 
    quantity: number, 
    color: string | undefined,
    items: CartItem[],
    setItems: React.Dispatch<React.SetStateAction<CartItem[]>>
  ) => {
    if (quantity <= 0) {
      removeItem(itemId, color, setItems);
      return;
    }

    try {
      // Check product stock with the correct parameter types
      const stockAvailable = await checkProductStock(String(itemId), color);
      
      if (!stockAvailable) {
        toast({
          title: "Ошибка",
          description: "Недостаточно товара на складе",
          variant: "destructive"
        });
        return; // Don't update if not enough stock
      }

      setItems((prevItems) => {
        const itemIndex = color 
          ? prevItems.findIndex(item => item.product.id === itemId && item.color === color)
          : prevItems.findIndex(item => item.product.id === itemId);

        if (itemIndex === -1) return prevItems;
        
        const item = prevItems[itemIndex];
        
        const newItems = [...prevItems];
        newItems[itemIndex] = { ...item, quantity };
        return newItems;
      });
    } catch (error) {
      console.error("Error updating item quantity:", error);
      toast({
        title: "Ошибка",
        description: "Не удалось обновить количество товара",
        variant: "destructive"
      });
    }
  };

  // New function to decrease stock quantities for all items in cart
  const decreaseStockForItems = async (items: CartItem[]): Promise<boolean> => {
    try {
      console.log("Decreasing stock for all items in cart:", items);
      
      // Process each item in the cart
      for (const item of items) {
        console.log(`Decreasing stock for ${item.product.id}, quantity: ${item.quantity}, color: ${item.color || 'none'}`);
        
        // Decrease stock for this item
        const result = await decreaseProductStock(
          String(item.product.id),
          item.quantity,
          item.color
        );
        
        if (!result) {
          console.error(`Failed to decrease stock for product ${item.product.id}`);
          return false;
        }
      }
      
      console.log("All stock quantities updated successfully");
      return true;
    } catch (error) {
      console.error("Error decreasing stock for cart items:", error);
      return false;
    }
  };

  const clearCart = (setItems: React.Dispatch<React.SetStateAction<CartItem[]>>) => {
    setItems([]);
    toast({
      title: "Корзина очищена"
    });
  };

  return {
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    decreaseStockForItems
  };
}
