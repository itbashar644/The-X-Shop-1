import React from 'react';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/Image-utils';

interface PriceFilterProps {
  priceRange: { min: number; max: number };
  handlePriceChange: (type: "min" | "max", value: string) => void;
  handleSliderChange: (values: number[]) => void;
  loading: boolean;
  isPriceValid: boolean;
  className?: string;
}

const PriceFilter: React.FC<PriceFilterProps> = ({
  priceRange,
  handlePriceChange,
  handleSliderChange,
  loading,
  isPriceValid,
  className,
}) => {
  const maxPrice = 100000;

  const formatPrice = (value: number) => {
    if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M₽`;
    if (value >= 1000) return `${(value / 1000).toFixed(0)}K₽`;
    return `${value}₽`;
  };

  return (
    <div className={cn('space-y-4', className)}>
      <h3 className="font-semibold text-sm">Диапазон цен</h3>
      
      <div className="space-y-2">
        <Slider
          value={[priceRange.min, priceRange.max]}
          onValueChange={handleSliderChange}
          min={0}
          max={maxPrice}
          step={100}
          disabled={loading}
          showValues
          formatValue={formatPrice}
        />
      </div>

      <div className="flex items-center gap-3">
        <div className="flex-1 space-y-1">
          <Label htmlFor="minPrice" className="text-xs text-muted-foreground">
            От
          </Label>
          <Input
            id="minPrice"
            type="number"
            placeholder="0"
            value={priceRange.min || ''}
            onChange={(e) => handlePriceChange('min', e.target.value)}
            disabled={loading}
            min={0}
            max={priceRange.max}
            className="h-9"
          />
        </div>
        
        <div className="flex-1 space-y-1">
          <Label htmlFor="maxPrice" className="text-xs text-muted-foreground">
            До
          </Label>
          <Input
            id="maxPrice"
            type="number"
            placeholder={maxPrice.toString()}
            value={priceRange.max === maxPrice ? '' : priceRange.max}
            onChange={(e) => handlePriceChange('max', e.target.value)}
            disabled={loading}
            min={priceRange.min}
            max={maxPrice}
            className="h-9"
          />
        </div>
      </div>

      <div className="flex items-center justify-between text-sm">
        <span className={cn(
          "px-2 py-1 rounded-md",
          isPriceValid ? "bg-muted" : "bg-destructive/10 text-destructive"
        )}>
          {formatPrice(priceRange.min)}
        </span>
        <span className="text-muted-foreground mx-2">—</span>
        <span className={cn(
          "px-2 py-1 rounded-md",
          isPriceValid ? "bg-muted" : "bg-destructive/10 text-destructive"
        )}>
          {formatPrice(priceRange.max)}
        </span>
      </div>

      {!isPriceValid && (
        <p className="text-xs text-destructive">
          Максимальная цена должна быть больше минимальной
        </p>
      )}
    </div>
  );
};

export default PriceFilter;