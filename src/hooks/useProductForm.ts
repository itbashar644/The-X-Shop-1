
import { useState, useEffect } from "react";
import { Product, ColorVariant } from "@/types/product";
import { toast } from "sonner";

interface UseProductFormProps {
  product: Partial<Product>;
  onSave: (product: Partial<Product>) => void;
}

export function useProductForm({ product, onSave }: UseProductFormProps) {
  const [formData, setFormData] = useState<Partial<Product>>(product);
  const [newCategory, setNewCategory] = useState<string>("");
  const [showNewCategoryInput, setShowNewCategoryInput] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>("general");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Initialize form data whenever product changes
  useEffect(() => {
    setFormData(product);
  }, [product]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    // Handle number inputs
    if (type === "number") {
      setFormData({
        ...formData,
        [name]: value === "" ? "" : Number(value)
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData({
      ...formData,
      [name]: checked
    });
  };

  // Fixed this function to properly handle category selection
  const handleSelectChange = (name: string, value: string) => {
    console.log(`Select changed: ${name} = ${value}`);
    
    if (name === "category" && value === "new") {
      // Show input for new category
      setShowNewCategoryInput(true);
      setNewCategory("");
      return;
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleMainImageUploaded = (url: string) => {
    setFormData({
      ...formData,
      imageUrl: url
    });
  };

  const handleAdditionalImagesChange = (urls: string[]) => {
    setFormData({
      ...formData,
      additionalImages: urls
    });
  };

  const handleColorVariantsChange = (variants: ColorVariant[]) => {
    setFormData({
      ...formData,
      colorVariants: variants
    });
  };

  const handleRemoveColor = (colorToRemove: string) => {
    // Handling legacy colors array 
    const updatedColors = formData.colors ? formData.colors.filter(color => color !== colorToRemove) : [];
    
    setFormData({
      ...formData,
      colors: updatedColors
    });
  };

  const handleRelatedColorProductsChange = (productIds: string[]) => {
    setFormData({
      ...formData,
      relatedColorProducts: productIds
    });
  };

  const validateForm = (): boolean => {
    // Validate required fields
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
    
    // Check for duplicate article numbers in color variants
    if (formData.colorVariants && formData.colorVariants.length > 0) {
      const articleNumbers = formData.colorVariants
        .map(v => v.articleNumber)
        .filter(a => a && a.trim() !== "");
      
      const uniqueArticleNumbers = new Set(articleNumbers);
      
      if (articleNumbers.length !== uniqueArticleNumbers.size) {
        toast.error("Найдены дублирующиеся артикулы в цветовых вариантах");
        setActiveTab("colors");
        return false;
      }
    }
    
    return true;
  };

  const handleStockQuantityChangeAdapter = (value: number | undefined) => {
  setFormData(prev => ({
    ...prev,
    stockQuantity: value,
    inStock: value !== undefined && value > 0
  }));
};


  const handleStockQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    if (value === "") {
      handleStockQuantityChangeAdapter(undefined);
      return;
    }
    
    const numValue = parseInt(value, 10);
    
    if (!isNaN(numValue)) {
      handleStockQuantityChangeAdapter(numValue);
  }
  };

  const validateAndSubmitForm = async () => {
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // If new category was entered, use it
      const finalProduct = {
        ...formData,
        category: showNewCategoryInput && newCategory ? newCategory : formData.category
      };
      
      // Set inStock status based on stockQuantity
      finalProduct.inStock = finalProduct.stockQuantity !== undefined && finalProduct.stockQuantity > 0;
      
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
    validateAndSubmitForm,
    setNewCategory,
    setShowNewCategoryInput,
    handleStockQuantityChange
  };
}
