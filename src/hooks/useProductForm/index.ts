
import { useState, useEffect } from "react";
import { Product } from "@/types/product";
import { toast } from "sonner";
import { useFormHandlers } from "./handlers";
import { validateForm, prepareFinalProduct } from "./validation";
import { UseProductFormProps, UseProductFormResult } from "./types";

export function useProductForm({ product, onSave }: UseProductFormProps): UseProductFormResult {
  const [formData, setFormData] = useState<Partial<Product>>(product);
  const [newCategory, setNewCategory] = useState<string>("");
  const [showNewCategoryInput, setShowNewCategoryInput] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>("general");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Initialize form data whenever product changes
  useEffect(() => {
    setFormData(product);
  }, [product]);

  // Get all the form handlers
  const handlers = useFormHandlers(
    setFormData,
    formData,
    setShowNewCategoryInput,
    setNewCategory
  );

  // Validate and submit form
  const validateAndSubmitForm = async () => {
    if (!validateForm(formData, newCategory, setActiveTab)) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Prepare final product with all necessary data
      const finalProduct = prepareFinalProduct(formData, showNewCategoryInput, newCategory);
      
      console.log("Submitting product with category:", finalProduct.category);
      await onSave(finalProduct);
    } catch (error) {
      console.error("Error saving product:", error);
      toast.error("Ошибка при сохранении товара");
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    formData,
    newCategory,
    showNewCategoryInput,
    activeTab,
    isSubmitting,
    setActiveTab,
    ...handlers,
    validateAndSubmitForm,
    setNewCategory,
    setShowNewCategoryInput
  };
}
