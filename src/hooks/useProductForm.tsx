// src/hooks/useProductForm.tsx
import { useState, useEffect } from "react";
import { toast } from "sonner";

// Временные типы, можно заменить на настоящие из твоей базы
export interface ColorVariant {
  id?: string;
  colorName?: string;
  articleNumber?: string;
  [key: string]: any;
}

export interface Product {
  id?: string;
  title?: string;
  category?: string;
  price?: number;
  imageUrl?: string;
  additionalImages?: string[];
  colors?: string[];
  colorVariants?: ColorVariant[];
  relatedColorProducts?: string[];
  stockQuantity?: number;
  inStock?: boolean;
  [key: string]: any;
}

interface UseProductFormProps {
  product: Partial<Product>;
  onSave: (product: Partial<Product>) => void;
}

export const useProductForm = ({ product, onSave }: UseProductFormProps) => {
  const [formData, setFormData] = useState<Partial<Product>>(product);
  const [newCategory, setNewCategory] = useState<string>("");
  const [showNewCategoryInput, setShowNewCategoryInput] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>("general");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  useEffect(() => {
    setFormData(product);
  }, [product]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;

    if (type === "number") {
      setFormData({
        ...formData,
        [name]: value === "" ? "" : Number(value),
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData({
      ...formData,
      [name]: checked,
    });
  };

  const handleSelectChange = (value: string, name: string) => {
    console.log(`Select changed: ${name} = ${value}`);

    if (name === "category" && value === "new") {
      setShowNewCategoryInput(true);
      setNewCategory("");
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleMainImageUploaded = (url: string) => {
    setFormData({
      ...formData,
      imageUrl: url,
    });
  };

  const handleAdditionalImagesChange = (urls: string[]) => {
    setFormData({
      ...formData,
      additionalImages: urls,
    });
  };

  const handleColorVariantsChange = (variants: ColorVariant[]) => {
    setFormData({
      ...formData,
      colorVariants: variants,
    });
  };

  const handleRemoveColor = (colorToRemove: string) => {
    const updatedColors = formData.colors ? formData.colors.filter((color) => color !== colorToRemove) : [];

    setFormData({
      ...formData,
      colors: updatedColors,
    });
  };

  const handleRelatedColorProductsChange = (productIds: string[]) => {
    setFormData({
      ...formData,
      relatedColorProducts: productIds,
    });
  };

  const handleStockQuantityChange = (value: number | "") => {
    setFormData((prev) => ({
      ...prev,
      stockQuantity: value === "" ? undefined : value,
    }));
  };

  const validateForm = (): boolean => {
    if (!formData.title) {
      toast.error("Необходимо указать название товара");
      setActiveTab("general");
      return false;
    }

    if (!formData.category && !newCategory) {
      toast.error("Необходимо указать категорию товара");
      setActiveTab("general");
      return false;
    }

    if (!formData.price || formData.price <= 0) {
      toast.error("Необходимо указать корректную цену товара");
      setActiveTab("general");
      return false;
    }

    if (formData.colorVariants && formData.colorVariants.length > 0) {
      const articleNumbers = formData.colorVariants
        .map((v) => v.articleNumber)
        .filter((a) => a && a.trim() !== "");

      const uniqueArticleNumbers = new Set(articleNumbers);

      if (articleNumbers.length !== uniqueArticleNumbers.size) {
        toast.error("Найдены дублирующиеся артикулы в цветовых вариантах");
        setActiveTab("colors");
        return false;
      }
    }

    return true;
  };

  const validateAndSubmitForm = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const finalFormData = {
        ...formData,
        category: showNewCategoryInput && newCategory ? newCategory : formData.category,
      };

      if (finalFormData.stockQuantity !== undefined) {
        finalFormData.inStock = finalFormData.stockQuantity > 0;
      } else {
        finalFormData.inStock = false;
      }

      console.log("Submitting product with category:", finalFormData.category);
      await onSave(finalFormData);
    } catch (error) {
      console.error("Error saving product:", error);
      toast.error("Ошибка при сохранении товара");
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    formData,
    setFormData,
    newCategory,
    showNewCategoryInput,
    activeTab,
    isSubmitting,
    setActiveTab,
    handleInputChange,
    handleCheckboxChange,
    handleSelectChange,
    handleMainImageUploaded,
    handleAdditionalImagesChange,
    handleColorVariantsChange,
    handleRemoveColor,
    handleRelatedColorProductsChange,
    handleStockQuantityChange,
    validateAndSubmitForm,
    setNewCategory,
    setShowNewCategoryInput,
  };
};
