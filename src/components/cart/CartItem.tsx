import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CartItem as CartItemType } from "@/types/product";
import { toast } from "@/hooks/use-toast";
import { AlertTriangle } from "lucide-react";

interface CartItemProps {
  item: CartItemType;
  updateQuantity: (id: string, quantity: number) => void;
  removeItem: (id: string) => void;
}

const CartItem = ({ item, updateQuantity, removeItem }: CartItemProps) => {
  // Calculate max available quantity
  const maxQuantity = item.product.stockQuantity !== undefined ? 
    item.product.stockQuantity : 99;
    
  // Check if current quantity exceeds available stock
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
    <tr key={item.product.id} className="border-t">
      <td className="p-4">
        <div className="flex items-center gap-4">
          <img 
            src={item.product.imageUrl ? `images/${item.product.imageUrl}` : 'not-found.jpg'}
            alt={item.product.title} 
            className="w-16 h-16 object-cover rounded" 
          />
          <div>
            <h3 className="font-medium">
              <Link 
                to={`/product/${item.product.id}`} 
                className="hover:underline"
              >
                {item.product.title}
              </Link>
            </h3>
            {(item.color || item.size) && (
              <p className="text-sm text-muted-foreground">
                {item.color && `Цвет: ${item.color}`}{" "}
                {item.size && `Размер: ${item.size}`}
              </p>
            )}
            
            {/* Stock warning */}
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
        </div>
      </td>
      <td className="p-4 text-right hidden sm:table-cell">
        {price} ₽
      </td>
      <td className="p-4 text-right">
        <div className="flex items-center justify-end gap-1">
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
      </td>
      <td className="p-4 text-right font-medium">
        {totalPrice} ₽
      </td>
      <td className="p-4 text-right">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => removeItem(item.product.id)}
        >
          ×
        </Button>
      </td>
    </tr>
  );
}

export default CartItem;
