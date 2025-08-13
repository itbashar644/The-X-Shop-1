
import React from "react";
import { CartItem as CartItemType } from "@/types/product";
import CartItem from "./CartItem";
import CartItemMobile from "./CartItemMobile";
import { AlertTriangle } from "lucide-react";

interface CartTableProps {
  items: CartItemType[];
  updateQuantity: (id: string, quantity: number, color?: string) => void;
  removeItem: (id: string, color?: string) => void;
}

const CartTable = ({ items, updateQuantity, removeItem }: CartTableProps) => {
  // Check for low stock items
  const lowStockItems = items.filter(item => {
    return item.product.stockQuantity !== undefined && 
           item.product.stockQuantity <= 3 &&
           item.product.stockQuantity >= item.quantity;
  });

  return (
    <>
      {lowStockItems.length > 0 && (
        <div className="mb-4 p-4 border border-orange-200 bg-orange-50 rounded-lg flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-orange-500 mt-0.5" />
          <div>
            <p className="font-medium text-orange-700">Внимание: товары с низким остатком</p>
            <p className="text-sm text-orange-600">
              В вашей корзине есть товары, которые заканчиваются. Рекомендуем оформить заказ как можно скорее.
            </p>
          </div>
        </div>
      )}
      
      <div className="rounded-lg border overflow-hidden">
          <table className="w-full hidden sm:table">
          <thead className="bg-muted">
            <tr>
              <th className="text-left p-4">Товар</th>
              <th className="text-right p-4 hidden sm:table-cell">Цена</th>
              <th className="text-right p-4">Кол-во</th>
              <th className="text-right p-4">Сумма</th>
              <th className="p-4"></th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <CartItem 
                key={`${item.product.id}-${item.color || "default"}`}
                item={item} 
                updateQuantity={(id, quantity) => updateQuantity(id, quantity, item.color)}
                removeItem={(id) => removeItem(id, item.color)}
              />
            ))}
          </tbody>
        </table>
         <div className="sm:hidden divide-y">
          {items.map((item) => (
            <CartItemMobile
              key={`${item.product.id}-${item.color || "default"}`}
              item={item}
              updateQuantity={(id, quantity) => updateQuantity(id, quantity, item.color)}
              removeItem={(id) => removeItem(id, item.color)}
            />
          ))}
        </div>
      </div>
    </>
  );
}

export default CartTable;
