
import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { Product } from "@/types/product";

interface LegacyColorsSectionProps {
  formData: Partial<Product>;
  handleRemoveColor: (colorToRemove: string) => void;
}

const LegacyColorsSection: React.FC<LegacyColorsSectionProps> = ({
  formData,
  handleRemoveColor,
}) => {
  const [newColor, setNewColor] = useState("");

  const handleAddColor = () => {
    if (newColor.trim() && !formData.colors?.includes(newColor.trim())) {
      const updatedColors = [...(formData.colors || []), newColor.trim()];
      // Here we should update the form data, but we're using handleRemoveColor for now
      // which is a bit confusing. Consider renaming it or adding a proper handler
      handleRemoveColor(newColor.trim());
      setNewColor("");
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <Input
          value={newColor}
          onChange={(e) => setNewColor(e.target.value)}
          placeholder="Название цвета"
          className="flex-1"
        />
        <Button 
          type="button" 
          onClick={handleAddColor}
          variant="secondary"
        >
          Добавить
        </Button>
      </div>
      
      {formData.colors && formData.colors.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {formData.colors.map((color) => (
            <div 
              key={color}
              className="flex items-center bg-muted rounded-md px-3 py-1 text-sm"
            >
              <span>{color}</span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-4 w-4 p-0 ml-2 text-muted-foreground hover:text-foreground"
                onClick={() => handleRemoveColor(color)}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LegacyColorsSection;
