
import React from 'react';
import { Checkbox } from "@/components/ui/checkbox";
import { Product } from "@/types/product";
import { FormSection } from "../FormSection";

interface ProductFlagsProps {
  formData: Partial<Product>;
  handleCheckboxChange: (checked: boolean, name: string) => void;
}

export const ProductFlags: React.FC<ProductFlagsProps> = ({
  formData,
  handleCheckboxChange
}) => {
  return (
    <FormSection>
      <div className="flex flex-wrap gap-6">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="isNew"
            checked={formData.isNew ?? false}
            onCheckedChange={(checked) => handleCheckboxChange(!!checked, "isNew")}
          />
          <label
            htmlFor="isNew"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Новинка
          </label>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="isBestseller"
            checked={formData.isBestseller ?? false}
            onCheckedChange={(checked) => handleCheckboxChange(!!checked, "isBestseller")}
          />
          <label
            htmlFor="isBestseller"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Хит продаж
          </label>
        </div>
      </div>
    </FormSection>
  );
};
