
import { Product, ColorVariant } from "@/types/product";

export const useFormHandlers = (
  setFormData: React.Dispatch<React.SetStateAction<Partial<Product>>>,
  formData: Partial<Product>,
  setShowNewCategoryInput: React.Dispatch<React.SetStateAction<boolean>>,
  setNewCategory: React.Dispatch<React.SetStateAction<string>>
) => {
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
    setFormData(prev => ({
      ...prev,
      [name]: checked
    }));
  };

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
    setFormData(prev => ({
      ...prev,
      imageUrl: url
    }));
  };

  const handleAdditionalImagesChange = (urls: string[]) => {
    setFormData(prev => ({
      ...prev,
      additionalImages: urls
    }));
  };

  const handleColorVariantsChange = (variants: ColorVariant[]) => {
    setFormData(prev => ({
      ...prev,
      colorVariants: variants
    }));
  };

  const handleRemoveColor = (colorToRemove: string) => {
    // Handling legacy colors array 
    setFormData(prev => {
      const updatedColors = prev.colors ? prev.colors.filter(color => color !== colorToRemove) : [];
      return {
        ...prev,
        colors: updatedColors
      };
    });
  };

  const handleRelatedColorProductsChange = (productIds: string[]) => {
    setFormData(prev => ({
      ...prev,
      relatedColorProducts: productIds
    }));
  };

  return {
    handleInputChange,
    handleCheckboxChange,
    handleSelectChange,
    handleMainImageUploaded,
    handleAdditionalImagesChange,
    handleColorVariantsChange,
    handleRemoveColor,
    handleRelatedColorProductsChange,
  };
};
