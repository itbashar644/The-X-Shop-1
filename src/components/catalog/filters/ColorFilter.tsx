
import React from "react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface ColorFilterProps {
  availableColors: string[];
  colorParam: string | null;
  handleColorFilter: (color: string | null) => void;
}

const ColorFilter: React.FC<ColorFilterProps> = ({
  availableColors,
  colorParam,
  handleColorFilter,
}) => {
  if (availableColors.length === 0) return null;
  
  return (
    <div className="border-t pt-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold">Цвета</h3>
        {colorParam && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => handleColorFilter(null)}
            className="h-6 text-xs"
          >
            Сбросить
          </Button>
        )}
      </div>
      <div className="flex flex-wrap gap-2">
        {availableColors.map(color => (
          <TooltipProvider key={color}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={colorParam === color ? "default" : "outline"}
                  size="sm"
                  className="px-2 py-1 h-auto text-xs"
                  onClick={() => handleColorFilter(color)}
                >
                  <span 
                    className="w-3 h-3 mr-1.5 rounded-full" 
                    style={{ 
                      backgroundColor: color.toLowerCase() !== 'белый' ? color.toLowerCase() : '#ffffff',
                      border: color.toLowerCase() === 'белый' ? '1px solid #ccc' : 'none' 
                    }}
                  ></span>
                  {color}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                товаров
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ))}
      </div>
    </div>
  );
};

export default ColorFilter;
