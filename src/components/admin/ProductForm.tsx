
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Product } from "@/types/product";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import GeneralInfoTab from "./product-form/GeneralInfoTab";
import AdditionalInfoTab from "./product-form/AdditionalInfoTab";
import {ProductPricing} from "./product-form/sections/ProductPricing"; // Import ProductPricing
import { useProductForm } from "@/hooks/useProductForm";
 
 

interface ProductFormProps {
  product: Partial<Product>;
  categories: string[];
  onSave: (product: Partial<Product>) => void;
  onCancel: () => void;
}

const ProductForm = ({ product, categories, onSave, onCancel }: ProductFormProps) => {
  const [mainImageFile, setMainImageFile] = useState<File | null>(null);
  const {
    formData,
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
    validateAndSubmitForm: baseValidateAndSubmitForm,
    setNewCategory,
    setShowNewCategoryInput,
    handleStockQuantityChange
  } = useProductForm( {product, onSave} );
  
  // Handle stock quantity change, pass it down to ProductPricing
 
  // Adapter for file selection
  const handleMainImageFileSelected = (file: File | null) => {
    setMainImageFile(file);
  };

  // Create an adapter function to fix the parameter order for checkbox
  const handleCheckboxChangeAdapter = (checked: boolean, name: string) => {
    handleCheckboxChange(name, checked); // Swap the parameters to match the expected order
  };
  
  // Create an adapter function to fix the parameter order for select
  const handleSelectChangeAdapter = (value: string, name: string) => {
    handleSelectChange(name, value); // Swap the parameters to match the expected order
  };

  return (
    <div className="space-y-4">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full">
          <TabsTrigger value="general" className="flex-1">Основная информация</TabsTrigger>
          <TabsTrigger value="additional" className="flex-1">Дополнительно</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="pt-4">
          <GeneralInfoTab
            formData={formData}
            categories={categories}
            showNewCategoryInput={showNewCategoryInput}
            newCategory={newCategory}
            setNewCategory={setNewCategory}
            setShowNewCategoryInput={setShowNewCategoryInput}
            handleInputChange={handleInputChange}
            handleSelectChange={handleSelectChangeAdapter} // Use the adapter function here
            handleCheckboxChange={handleCheckboxChangeAdapter} // Use the adapter function here
            handleMainImageUploaded={handleMainImageUploaded}
            handleAdditionalImagesChange={handleAdditionalImagesChange}
            onMainImageFileSelected={handleMainImageFileSelected}
            handleStockQuantityChange={handleStockQuantityChange}
          />
        </TabsContent>

        <TabsContent value="additional" className="pt-4">
          <AdditionalInfoTab
            formData={formData}
            handleInputChange={handleInputChange}
            handleSelectChange={handleSelectChangeAdapter} // Use the adapter function here
          />
        </TabsContent>

        <TabsContent value="pricing" className="pt-4">
          <ProductPricing
            formData={formData}
            handleInputChange={handleInputChange}
            handleCheckboxChange={handleCheckboxChangeAdapter}
            handleStockQuantityChange={handleStockQuantityChange}
          />
        </TabsContent>
      </Tabs>

      <div className="flex justify-end space-x-2 pt-4">
        <Button variant="outline" onClick={onCancel} disabled={isSubmitting}>
          Отмена
        </Button>
        <Button onClick={baseValidateAndSubmitForm} disabled={isSubmitting}>
          {isSubmitting ? "Сохранение..." : (product.id ? "Сохранить изменения" : "Добавить товар")}
        </Button>
      </div>
    </div>
  );
};

export default ProductForm;
