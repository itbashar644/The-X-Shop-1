import React from 'react';
import { Product } from "@/types/product";
import ProductVideo from './ProductVideo';

interface ProductDetailsProps {
  product: Product;
  selectedTab: string;
  setSelectedTab: (tab: string) => void;
  className?: string;
}

const ProductDetails: React.FC<ProductDetailsProps> = ({
  product,
  selectedTab,
  setSelectedTab,
  className = "",
}) => {
  const renderSpecifications = () => {
    if (!product.specifications || Object.keys(product.specifications).length === 0) {
      return null;
    }

    return (
      <div className="mt-8">
        <h3 className="text-lg font-medium mb-4 text-gray-900">Характеристики</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {Object.entries(product.specifications).map(([key, value], index) => (
            <div key={index} className="flex border-b pb-2">
              <span className="text-gray-600 font-medium w-1/2">{key}:</span>
              <span className="text-gray-800 w-1/2">{value}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderDescription = () => {
    if (!product.description) return null;

    const paragraphs = product.description.split('\n\n').filter(Boolean);

    return (
      <>
        <h2 className="text-xl font-semibold mb-5 text-gray-900 border-b pb-3">Описание товара</h2>
        <div className="prose prose-lg max-w-none text-gray-800">
          {paragraphs.map((paragraph, index) => (
            <p key={index} className="mb-4 last:mb-0">
              {paragraph}
            </p>
          ))}
        </div>
      </>
    );
  };

  return (
    <div className={`bg-white rounded-lg shadow-sm p-6 ${className}`}>
      {/* Видео товара */}
      {product.videoUrl && (
        <div className="mb-8">
          <ProductVideo
            videoUrl={product.videoUrl}
            videoType={product.videoType}
            thumbnailUrl={product.imageUrl}
            autoPlay={false}
            loop={false}
          />
        </div>
      )}

      {/* Табы */}
      <div className="flex space-x-4 mb-6 border-b pb-2">
        <button
          onClick={() => setSelectedTab("description")}
          className={`pb-2 border-b-2 ${
            selectedTab === "description"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground"
          } transition-colors duration-150 font-medium`}
        >
          Описание
        </button>
        <button
          onClick={() => setSelectedTab("specifications")}
          className={`pb-2 border-b-2 ${
            selectedTab === "specifications"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground"
          } transition-colors duration-150 font-medium`}
        >
          Характеристики
        </button>
      </div>

      {selectedTab === "description" && renderDescription()}
      {selectedTab === "specifications" && renderSpecifications()}
    </div>
  );
};

export default ProductDetails;
