
import { Product, ColorVariant } from "@/types/product";

/**
 * Transforms products for color display
 * If a product has color variants, creates a separate "product" for each color
 */
export const transformProductsForColorDisplay = (products: Product[]): Product[] => {
  if (!products || products.length === 0) return [];
  
  const transformedProducts: Product[] = [];
  
  products.forEach(product => {
    // If the product has color variants, create a separate "product" for each color
    if (product.colorVariants && product.colorVariants.length > 0) {
      product.colorVariants.forEach(variant => {
        // Determine if this variant is in stock based on stockQuantity
        // If stockQuantity is undefined, fallback to the parent product's inStock status
        const variantInStock = variant.stockQuantity !== undefined 
          ? variant.stockQuantity > 0 
          : product.inStock;
        
        const variantProduct: Product = {
          ...product,
          id: `${product.id}-${variant.color.replace(/\s+/g, '-').toLowerCase()}`,
          price: variant.price,
          discountPrice: variant.discountPrice,
          imageUrl: variant.imageUrl || product.imageUrl,
          articleNumber: variant.articleNumber || product.articleNumber,
          barcode: variant.barcode || product.barcode,
          stockQuantity: variant.stockQuantity,
          inStock: variantInStock,
          ozonUrl: variant.ozonUrl || product.ozonUrl,
          wildberriesUrl: variant.wildberriesUrl || product.wildberriesUrl,
          avitoUrl: variant.avitoUrl || product.avitoUrl,
          isColorVariant: true,
          parentProductId: product.id
          // Removed the selectedColor property that was causing the error
        };
        
        transformedProducts.push(variantProduct);
      });
    } else {
      // If no color variants, add the original product
      transformedProducts.push({ ...product });
    }
  });
  
  return transformedProducts;
};

/**
 * Sorts products based on the sortBy parameter
 */
export const sortProducts = (products: Product[], sortBy: string): Product[] => {
  if (!products || products.length === 0) return [];
  
  const sortedProducts = [...products];
  
  switch (sortBy) {
    case "price-asc":
      return sortedProducts.sort((a, b) => {
        const priceA = a.discountPrice !== undefined ? a.discountPrice : a.price;
        const priceB = b.discountPrice !== undefined ? b.discountPrice : b.price;
        return priceA - priceB;
      });
    
    case "price-desc":
      return sortedProducts.sort((a, b) => {
        const priceA = a.discountPrice !== undefined ? a.discountPrice : a.price;
        const priceB = b.discountPrice !== undefined ? b.discountPrice : b.price;
        return priceB - priceA;
      });
      
    case "in-stock":
      // Move in-stock products to the top
      return sortedProducts.sort((a, b) => {
        // If one is in stock and the other isn't, the in-stock one comes first
        if (a.inStock && !b.inStock) return -1;
        if (!a.inStock && b.inStock) return 1;
        
        // If both have the same stock status, sort by default criteria (alphabetical)
        return a.title.localeCompare(b.title);
      });
    
    case "new":
      return sortedProducts.sort((a, b) => {
        if (a.isNew && !b.isNew) return -1;
        if (!a.isNew && b.isNew) return 1;
        return 0;
      });
    
    case "popular":
      return sortedProducts.sort((a, b) => {
        // Sort by rating first
        if (a.rating !== b.rating) return b.rating - a.rating;
        
        // If ratings are equal, bestsellers come first
        if (a.isBestseller && !b.isBestseller) return -1;
        if (!a.isBestseller && b.isBestseller) return 1;
        
        return 0;
      });
      
    default:
      // Default: sort alphabetically by title
      return sortedProducts.sort((a, b) => a.title.localeCompare(b.title));
  }
};
