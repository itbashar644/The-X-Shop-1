
import React from 'react';
import { Label } from "@/components/ui/label";
import ImageUploader from "../../ImageUploader";
import MultipleImageUploader from "../../MultipleImageUploader";
import { FormSection } from "../FormSection";

interface ProductImagesProps {
  imageUrl: string;
  additionalImages: string[];
  handleMainImageUploaded: (url: string) => void;
  handleAdditionalImagesChange: (urls: string[]) => void;
  onMainImageFileSelected?: (file: File | null) => void;
}

export const ProductImages: React.FC<ProductImagesProps> = ({
  imageUrl,
  additionalImages,
  handleMainImageUploaded,
  handleAdditionalImagesChange,
  onMainImageFileSelected
}) => {
  return (
    <FormSection>
      <div className="flex flex-col space-y-4">
        <div>
          <Label htmlFor="mainImage">Главное изображение*</Label>
          <div className="mt-2">
            <ImageUploader
              initialImageUrl={imageUrl || "/placeholder.svg"}
              onImageUploaded={handleMainImageUploaded}
              onFileSelected={onMainImageFileSelected}
            />
          </div>
        </div>
        
        <div>
          <Label htmlFor="additionalImages">Дополнительные изображения</Label>
          <div className="mt-2">
            <MultipleImageUploader
              initialImageUrls={additionalImages || []}
              onImagesChange={handleAdditionalImagesChange}
            />
          </div>
        </div>
      </div>
    </FormSection>
  );
};
