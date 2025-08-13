
import React from 'react';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Product } from "@/types/product";
import { FormRow } from "../FormRow";
import { FormSection } from "../FormSection";

interface ProductBasicInfoProps {
  formData: Partial<Product>;
  categories: string[];
  showNewCategoryInput: boolean;
  newCategory: string;
  setNewCategory: (value: string) => void;
  setShowNewCategoryInput: (value: boolean) => void;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSelectChange: (value: string, name: string) => void;
}

export const ProductBasicInfo: React.FC<ProductBasicInfoProps> = ({
  formData,
  categories,
  showNewCategoryInput,
  newCategory,
  setNewCategory,
  setShowNewCategoryInput,
  handleInputChange,
  handleSelectChange
}) => {
  return (
    <FormSection>
      <FormRow label="Название товара*" htmlFor="title">
        <Input
          id="title"
          name="title"
          value={formData.title || ""}
          onChange={handleInputChange}
          required
          placeholder="Введите название товара"
          className="w-full"
        />
      </FormRow>

      <FormRow label="Описание товара*" htmlFor="description" isTextArea>
        <Textarea
          id="description"
          name="description"
          value={formData.description || ""}
          onChange={handleInputChange}
          required
          placeholder="Введите описание товара"
          className="w-full min-h-[100px]"
        />
      </FormRow>

      <FormRow label="Категория*" htmlFor="category">
        {showNewCategoryInput ? (
          <div className="flex gap-2">
            <Input
              id="newCategory"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              placeholder="Введите новую категорию"
              className="w-full"
            />
            <Button
              type="button"
              variant="ghost"
              onClick={() => setShowNewCategoryInput(false)}
            >
              Отмена
            </Button>
          </div>
        ) : (
          <div className="flex gap-2">
            <Select
              value={formData.category || ""}
              onValueChange={(value) => handleSelectChange(value, "category")}
            >
              <SelectTrigger id="category" className="w-full">
                <SelectValue placeholder="Выберите категорию" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowNewCategoryInput(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Новая
            </Button>
          </div>
        )}
      </FormRow>
    </FormSection>
  );
};
