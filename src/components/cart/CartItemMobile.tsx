
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CartItem as CartItemType } from "@/types/product";

interface CartItemMobileProps {
  item: CartItemType;
  updateQuantity: (id: string, quantity: number) => void;
  removeItem: (id: string) => void;
}

const CartItemMobile = ({ item, updateQuantity, removeItem }: CartItemMobileProps) => {
  const maxQuantity = item.product.stockQuantity !== undefined ?
    item.product.stockQuantity : 99;
  const isOutOfStock = item.product.stockQuantity !== undefined &&
    item.quantity > item.product.stockQuantity;

  // Get the correct price
  const getItemPrice = (): number => {
    if (item.selectedColorVariant) {
      return item.selectedColorVariant.discountPrice || item.selectedColorVariant.price || 0;
    }
    
    if (item.color && item.product.colorVariants) {
      const variant = item.product.colorVariants.find(v => v.color === item.color);
      if (variant) {
        return variant.discountPrice || variant.price || 0;
      }
    }
    
    return item.product.discountPrice || item.product.price || 0;
  };

  const price = getItemPrice();
  const totalPrice = price * item.quantity;

  return (
    <div className="border-t py-4 flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <img
          src={item.product.imageUrl}
          alt={item.product.title}
          className="w-20 h-20 object-cover rounded"
        />
        <div className="flex-1">
          <h3 className="font-medium">
            <Link to={`/product/${item.product.id}`} className="hover:underline">
              {item.product.title}
            </Link>
          </h3>
          {(item.color || item.size) && (
            <p className="text-sm text-muted-foreground">
              {item.color && `Цвет: ${item.color}`}{" "}
              {item.size && `Размер: ${item.size}`}
            </p>
          )}
          {isOutOfStock && (
            <p className="text-sm text-red-500 font-medium">
              Доступно только {item.product.stockQuantity} шт.
            </p>
          )}
          {!isOutOfStock && item.product.stockQuantity !== undefined && item.product.stockQuantity <= 3 && (
            <p className="text-sm text-orange-500">
              Осталось всего {item.product.stockQuantity} шт.
            </p>
          )}
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => removeItem(item.product.id)}
        >
          ×
        </Button>
      </div>
      <div className="flex items-center justify-between">
        <p className="font-medium">
          {totalPrice} ₽
        </p>
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
            disabled={item.quantity <= 1}
          >
            -
          </Button>
          <span className="w-8 text-center">{item.quantity}</span>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
            disabled={item.quantity >= maxQuantity}
          >
            +
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CartItemMobile;
