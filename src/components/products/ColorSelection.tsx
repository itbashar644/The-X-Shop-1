import React from 'react';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Product, ColorVariant } from "@/types/product";
import { cn } from "@/lib/Image-utils";

interface ColorSelectionProps {
  product: Product;
  selectedColor?: string;
  onColorChange: (color: string, variant?: ColorVariant) => void;
  className?: string;
  showPrice?: boolean;
}

const ColorSelection: React.FC<ColorSelectionProps> = ({ 
  product, 
  selectedColor, 
  onColorChange,
  className = "",
  showPrice = true
}) => {
  const availableVariants = product.colorVariants || [];
  const availableColors = product.colors || [];

  if (availableVariants.length === 0 && availableColors.length === 0) {
    return null;
  }

  const handleChange = (value: string) => {
    const variant = availableVariants.find(v => v.color === value);
    onColorChange(value, variant);
  };

  return (
    <div className={cn("space-y-3", className)}>
      <h3 className="font-medium text-sm">Выберите цвет</h3>
      
      {availableVariants.length > 0 ? (
        <RadioGroup 
          value={selectedColor || ""} 
          onValueChange={handleChange}
          className="flex flex-wrap gap-2"
        >
          {availableVariants.map((variant) => {
            const isSelected = selectedColor === variant.color;
            const isOutOfStock = variant.stockQuantity === 0;
            
            return (
              <div key={variant.color} className="flex flex-col items-center">
                <RadioGroupItem 
                  value={variant.color} 
                  id={`color-${variant.color}`}
                  disabled={isOutOfStock}
                  className="sr-only peer"
                />
                <Label
                  htmlFor={`color-${variant.color}`}
                  className={cn(
                    "flex flex-col items-center gap-1 cursor-pointer",
                    isOutOfStock && "cursor-not-allowed opacity-60"
                  )}
                >
                  <div className={cn(
                    "w-10 h-10 rounded-full border-2 flex items-center justify-center",
                    isSelected ? "border-primary" : "border-transparent",
                    isOutOfStock && "relative overflow-hidden"
                  )}>
                    {variant.colorCode ? (
                      <div 
                        className="w-8 h-8 rounded-full"
                        style={{ backgroundColor: variant.colorCode }}
                      />
                    ) : (
                      <span className="text-xs text-center">{variant.color}</span>
                    )}
                    {isOutOfStock && (
                      <div className="absolute inset-0 bg-gray-100 opacity-70" />
                    )}
                  </div>
                  {showPrice && variant.price !== product.price && (
                    <span className="text-xs text-gray-500">
                      {variant.price} ₽
                    </span>
                  )}
                </Label>
              </div>
            );
          })}
        </RadioGroup>
      ) : (
        <RadioGroup 
          value={selectedColor || ""} 
          onValueChange={handleChange}
          className="flex flex-wrap gap-2"
        >
          {availableColors.map((color) => (
            <div key={color} className="flex items-center">
              <RadioGroupItem 
                value={color} 
                id={`color-${color}`}
                className="sr-only peer"
              />
              <Label
                htmlFor={`color-${color}`}
                className="px-3 py-1.5 border rounded-md text-sm cursor-pointer peer-data-[state=checked]:bg-primary peer-data-[state=checked]:text-primary-foreground peer-data-[state=checked]:border-primary"
              >
                {color}
              </Label>
            </div>
          ))}
        </RadioGroup>
      )}
    </div>
  );
};

export default ColorSelection;