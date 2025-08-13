import { Category } from '@/data/products';
import React from 'react';
import { Link } from 'react-router-dom';

interface CategoriesSectionProps {
  categoryObjects: Category[];
  loading: boolean;
}

const CategoriesSection: React.FC<CategoriesSectionProps> = ({ categoryObjects, loading }) => {
  console.log("categoryObjects");
  console.log(categoryObjects);
  
  return (
    <section className="py-12">
      <div className="container px-4 md:px-6">
        <h2 className="text-2xl font-bold mb-8">Категории</h2>
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-gray-200 animate-pulse rounded-lg">
                <div style={{ paddingTop: "133.33%" }} className="relative"></div>
              </div>
            ))}
          </div>
        ) : (
          <div
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
            itemScope
            itemType="https://schema.org/ItemList"
          >
            {categoryObjects.map((category, index) => (
              <Link
                key={category.name}
                to={`/catalog?category=${category.name}`}
                className="group relative overflow-hidden rounded-lg"
                itemProp="itemListElement"
                itemScope
                itemType="https://schema.org/ListItem"
              >
                <meta itemProp="position" content={String(index + 1)} />
                <div className="relative" style={{ paddingTop: "133.33%" }}>
                  <img
                    itemProp="image"
                    alt={category.name}
                    className="absolute top-0 left-0 h-full w-full object-cover transition-transform group-hover:scale-105"
                    src={`images/${category.imageUrl}` || 'not-found.jpg'}
                    loading="lazy"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "/placeholder.svg";
                    }}
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-black/50 py-1 px-2">
                    <h3 className="text-center text-base font-medium text-white" itemProp="name">
                      {category.name}
                    </h3>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default CategoriesSection;
