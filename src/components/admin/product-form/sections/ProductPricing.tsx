import React from 'react';
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Product } from "@/types/product";
import { FormRow } from "../FormRow";
import { FormSection } from "../FormSection";

interface ProductPricingProps {
  formData: Partial<Product>;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleCheckboxChange: (checked: boolean, name: string) => void;
  handleStockQuantityChange: (e: React.ChangeEvent<HTMLInputElement>) => void; // Измененный тип
}

export const ProductPricing: React.FC<ProductPricingProps> = ({
  formData,
  handleInputChange,
  handleCheckboxChange,
  handleStockQuantityChange
}) => {
  // Automatically determine if product is in stock based on quantity
  const stockQuantity = formData.stockQuantity !== undefined ? formData.stockQuantity : 0;
  const isInStock = stockQuantity > 0;
  
  return (
    <FormSection>
      <FormRow label="Цена*" htmlFor="price">
        <div className="relative">
          <Input
            id="price"
            name="price"
            type="number"
            value={formData.price || ""}
            onChange={handleInputChange}
            required
            placeholder="0"
            min="0"
            className="w-full pr-8"
          />
          <span className="absolute right-3 top-2 text-gray-500">₽</span>
        </div>
      </FormRow>

      <FormRow label="Цена со скидкой" htmlFor="discountPrice">
        <div className="relative">
          <Input
            id="discountPrice"
            name="discountPrice"
            type="number"
            value={formData.discountPrice || ""}
            onChange={handleInputChange}
            placeholder="0"
            min="0"
            className="w-full pr-8"
          />
          <span className="absolute right-3 top-2 text-gray-500">₽</span>
        </div>
      </FormRow>

      <FormRow label="Количество на складе" htmlFor="stockQuantity">
       
          
        <Input
          id="stockQuantity"
          name="stockQuantity"
          type="number"
          value={formData.stockQuantity ?? ""}
          onChange={handleStockQuantityChange}
          placeholder="0"
          min="0"
          className="w-full"
        />
      </FormRow>

      <FormRow label="Артикул" htmlFor="articleNumber">
        <Input
          id="articleNumber"
          name="articleNumber"
          value={formData.articleNumber || ""}
          onChange={handleInputChange}
          placeholder="Введите артикул"
          className="w-full"
        />
      </FormRow>

      <FormRow label="Штрих-код" htmlFor="barcode">
        <Input
          id="barcode"
          name="barcode"
          value={formData.barcode || ""}
          onChange={handleInputChange}
          placeholder="Введите штрих-код"
          className="w-full"
        />
      </FormRow>

      <FormRow label="Наличие" htmlFor="inStock">
        <div className="flex flex-col space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="inStock"
              checked={formData.inStock ?? isInStock}
              onCheckedChange={(checked) => handleCheckboxChange(!!checked, "inStock")}
              disabled={true}
            />
            <label
              htmlFor="inStock"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Товар в наличии
            </label>
          </div>
          <p className="text-xs text-muted-foreground">
            Статус "В наличии" устанавливается автоматически на основе количества товара на складе.
          </p>
        </div>
      </FormRow>
    </FormSection>
  );
};