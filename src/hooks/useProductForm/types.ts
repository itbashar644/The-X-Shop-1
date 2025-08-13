
import { Product, ColorVariant } from "@/types/product";

export interface UseProductFormProps {
  product: Partial<Product>;
  onSave: (product: Partial<Product>) => void;
}

export interface UseProductFormResult {
  formData: Partial<Product>;
  newCategory: string;
  showNewCategoryInput: boolean;
  activeTab: string;
  isSubmitting: boolean;
  setActiveTab: (tab: string) => void;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleCheckboxChange: (name: string, checked: boolean) => void;
  handleSelectChange: (name: string, value: string) => void;
  handleMainImageUploaded: (url: string) => void;
  handleAdditionalImagesChange: (urls: string[]) => void;
  handleColorVariantsChange: (variants: ColorVariant[]) => void;
  handleRemoveColor: (colorToRemove: string) => void;
  handleRelatedColorProductsChange: (productIds: string[]) => void;
  validateAndSubmitForm: () => Promise<void>;
  setNewCategory: (category: string) => void;
  setShowNewCategoryInput: (show: boolean) => void;
}
