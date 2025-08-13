import React, { createContext, useState, useContext, useEffect } from "react";
import { CartItem, DeliveryMethod, Product } from "@/types/product"; // Импортируем из общего файла типов

// Заглушка useUser (оставляем, как было)
interface User {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  postalCode?: string;
}

function useUser() {
  // Возвращаем объект с user = null, чтобы не ломать логику
  return { user: null as User | null };
}

// Подключаем хуки — предполагается, что useCartCalculations и useCartActions реально есть
import { useCartCalculations } from "@/hooks/useCartCalculations";
import { useCartActions } from "@/hooks/useCartActions";

interface CartContextType {
  items: CartItem[];
  addItem: (item: CartItem) => Promise<void>;
  removeItem: (itemId: string, color?: string) => void;
  updateQuantity: (itemId: string, quantity: number, color?: string) => Promise<void>;
  clearCart: () => void;
  deliveryMethod: DeliveryMethod | null;
  setDeliveryMethod: React.Dispatch<React.SetStateAction<DeliveryMethod | null>>;
  subtotal: number;
  total: number;
  totalItems: number;
  decreaseStockForItems: (items: CartItem[]) => Promise<boolean>;
  autoFillUserData: () => void | null;
}

export const CartContext = createContext<CartContextType | undefined>(undefined);

const validateCartItems = (items: any[]): CartItem[] => {
  if (!Array.isArray(items)) return [];
  return items.filter(item =>
    item &&
    typeof item === "object" &&
    item.product &&
    typeof item.product === "object" &&
    typeof item.product.id === "string" &&
    typeof item.product.title === "string" &&
    typeof item.quantity === "number" &&
    item.quantity > 0
  );
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const savedItems = localStorage.getItem("cart");
      if (!savedItems) return [];
      const parsedItems = JSON.parse(savedItems);
      const validatedItems = validateCartItems(parsedItems);
      if (validatedItems.length !== parsedItems.length) {
        localStorage.setItem("cart", JSON.stringify(validatedItems));
      }
      return validatedItems;
    } catch (error) {
      localStorage.removeItem("cart");
      return [];
    }
  });

  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod | null>(null);
  const { user } = useUser();

  const { subtotal, total, totalItems } = useCartCalculations(items, deliveryMethod);

  const {
    addItem: addItemAction,
    removeItem: removeItemAction,
    updateQuantity: updateQuantityAction,
    clearCart: clearCartAction,
    decreaseStockForItems: decreaseStockForItemsAction,
  } = useCartActions();

  const autoFillUserData = () => {
    if (user) {
      const userData = {
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        phone: user.phone || "",
        address: user.address || "",
        city: user.city || "",
        postalCode: user.postalCode || "",
      };
      try {
        localStorage.setItem("checkoutData", JSON.stringify(userData));
      } catch {
        // Игнорируем ошибки записи
      }
      return userData;
    }
    return null;
  };

  useEffect(() => {
    try {
      const validItems = validateCartItems(items);
      if (validItems.length !== items.length) {
        setItems(validItems);
      }
      localStorage.setItem("cart", JSON.stringify(validItems));
    } catch (error) {
      console.error("Error saving cart:", error);
    }
  }, [items]);

  const addItem = async (item: CartItem) => {
    try {
      await addItemAction(items, item, setItems);
    } catch (error) {
      console.error("Error in addItem:", error);
    }
  };

  const removeItem = (itemId: string, color?: string) => {
    try {
      removeItemAction(itemId, color, setItems);
    } catch (error) {
      console.error("Error in removeItem:", error);
    }
  };

  const updateQuantity = async (itemId: string, quantity: number, color?: string) => {
    try {
      await updateQuantityAction(itemId, quantity, color, items, setItems);
    } catch (error) {
      console.error("Error in updateQuantity:", error);
    }
  };

  const clearCart = () => {
    try {
      clearCartAction(setItems);
    } catch (error) {
      console.error("Error in clearCart:", error);
    }
  };

  const decreaseStockForItems = async (cartItems: CartItem[]): Promise<boolean> => {
    try {
      return await decreaseStockForItemsAction(cartItems);
    } catch (error) {
      console.error("Error in decreaseStockForItems:", error);
      return false;
    }
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        deliveryMethod,
        setDeliveryMethod,
        subtotal,
        total,
        totalItems,
        decreaseStockForItems,
        autoFillUserData,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
