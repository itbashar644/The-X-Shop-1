import React, { useEffect, useState } from "react";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface PriceRangeSliderProps {
  priceRange: { min: number; max: number };
  handlePriceChange: (type: "min" | "max", value: string) => void;
  loading: boolean;
}

const PriceRangeSlider: React.FC<PriceRangeSliderProps> = ({
  priceRange,
  handlePriceChange,
  loading
}) => {
    const [localMin, setLocalMin] = useState(priceRange.min);
  const [localMax, setLocalMax] = useState(priceRange.max);

  useEffect(() => {
    setLocalMin(priceRange.min);
    setLocalMax(priceRange.max);
  }, [priceRange.min, priceRange.max]);

  const handleSliderChange = (value: number[]) => {
    if (value.length >= 2) {
      handlePriceChange("min", value[0].toString());
      handlePriceChange("max", value[1].toString());
    }
  };

  return (
    <div className="space-y-4">
      <div className="pt-4">
        <Slider
          disabled={loading}
          defaultValue={[priceRange.min, priceRange.max]}
          value={[priceRange.min, priceRange.max]}
          max={priceRange.max}
          step={500}
          onValueChange={handleSliderChange}
          className="my-6"
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="min-price">От</Label>
          <Input
            id="min-price"
            type="number"
            value={localMin}
            onChange={(e) => setLocalMin(parseInt(e.target.value || "0", 10))}
            onBlur={() => handlePriceChange("min", localMin.toString())}
            min={0}
            max={priceRange.max}
            disabled={loading}
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="max-price">До</Label>
          <Input
            id="max-price"
            type="number"
             value={localMax}
            onChange={(e) => setLocalMax(parseInt(e.target.value || "0", 10))}
            onBlur={() => handlePriceChange("max", localMax.toString())}
            min={priceRange.min}
            max={priceRange.max}
            disabled={loading}
            className="mt-1"
          />
        </div>
      </div>
    </div>
  );
};

export default PriceRangeSlider;
