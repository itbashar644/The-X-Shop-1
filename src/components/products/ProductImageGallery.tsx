import React, { useState, useEffect } from 'react';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Product, ColorVariant } from '@/types/product';
import ImageLightbox from '@/components/ui/image-lightbox';
import { buildProductImageUrl } from '@/lib/imageUtils';

interface ProductImageGalleryProps {
  product: Product;
  selectedColorVariant: ColorVariant | null;
  onColorVariantSelect: (variant: ColorVariant) => void;
  className?: string;
}

const ProductImageGallery: React.FC<ProductImageGalleryProps> = ({
  product,
  selectedColorVariant,
  onColorVariantSelect,
  className = '',
}) => {
  const [selectedImage, setSelectedImage] = useState<string>(product.imageUrl);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const allImages = React.useMemo(() => {
    const variantImages = product.colorVariants
      ?.filter((v) => v.imageUrl)
      .map((v) => v.imageUrl) ?? [];

    return [
      product.imageUrl,
      ...(product.additionalImages || []),
      ...variantImages,
    ].filter(Boolean);
  }, [product]);

  useEffect(() => {
    if (
      selectedColorVariant?.imageUrl &&
      allImages.includes(selectedColorVariant.imageUrl)
    ) {
      setSelectedImage(selectedColorVariant.imageUrl);
      setLightboxIndex(allImages.indexOf(selectedColorVariant.imageUrl));
    }
  }, [selectedColorVariant, allImages]);

  const handleThumbnailClick = (image: string, index: number) => {
    setSelectedImage(image);
    setLightboxIndex(index);
  };

  const handleMainImageClick = () => {
    const idx = allImages.indexOf(selectedImage);
    if (idx !== -1) {
      setLightboxIndex(idx);
      setLightboxOpen(true);
    }
  };

  const handleVariantSelect = (variant: ColorVariant) => {
    onColorVariantSelect(variant);
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <AspectRatio ratio={3 / 4} className="bg-gray-100 rounded-lg overflow-hidden border relative">
        <img
          src={buildProductImageUrl(selectedImage)}
          alt={product.title}
          className="absolute inset-0 w-full h-full object-contain cursor-pointer"
          onClick={handleMainImageClick}
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/images/placeholder.svg';
          }}
        />
      </AspectRatio>

      <div className="grid grid-cols-5 gap-2">
        {allImages.map((image, index) => (
          <button
            key={index}
            className={`aspect-[3/4] rounded-md overflow-hidden border-2 ${
              selectedImage === image ? 'border-blue-500' : 'border-transparent'
            }`}
            onClick={() => handleThumbnailClick(image, index)}
          >
            <AspectRatio ratio={3 / 4} className="bg-gray-50">
              <img
                src={buildProductImageUrl(image)}
                alt={`${product.title} - ${index + 1}`}
                className="absolute inset-0 w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/images/placeholder.svg';
                }}
              />
            </AspectRatio>
          </button>
        ))}
      </div>

      <ImageLightbox
        images={allImages.map(buildProductImageUrl)}
        initialIndex={lightboxIndex}
        open={lightboxOpen}
        onOpenChange={setLightboxOpen}
      />
    </div>
  );
};

export default ProductImageGallery;
