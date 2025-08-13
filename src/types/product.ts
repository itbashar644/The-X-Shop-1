export interface DeliveryMethod {
  id: string;
  name: string;
  description: string;
  price: number;
  estimatedDays: string;
  icon: string;
}

export interface ColorVariant {
  id: string;
  color: string;
  colorCode: string;
  price: number;
  discountPrice?: number;
  articleNumber?: string;
  barcode?: string;
  stockQuantity?: number;
  imageUrl?: string;
  ozonUrl?: string;
  wildberriesUrl?: string;
  avitoUrl?: string;
  inStock: boolean;
  images: string[];
}

export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  discountPrice?: number;
  originalPrice?: number;
  category: string;
  imageUrl: string;

  // 👇 Добавлено для поддержки серверных данных
  image_url?: string;

  additionalImages?: string[];
  videoUrl?: string;
  videoType?: 'mp4' | 'vk' | 'youtube';
  rating: number;
  inStock: boolean;
  colors?: string[];
  sizes?: string[];
  countryOfOrigin: string;
  specifications?: Record<string, string>;
  isNew?: boolean;
  isBestseller?: boolean;
  isHit?: boolean;
  articleNumber?: string;
  barcode?: string;
  ozonUrl?: string;
  wildberriesUrl?: string;
  avitoUrl?: string;
  archived?: boolean;
  stockQuantity?: number;
  colorVariants?: ColorVariant[];
  material?: string;
  relatedColorProducts?: string[];
  isColorVariant?: boolean;
  parentProductId?: string;
  modelName?: string;
  popularity?: number;
  createdAt?: string;
  updatedAt?: string;
  reviewsCount?: number;
  wildberriesSku?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  color?: string;
  size?: string;
  selectedColorVariant?: ColorVariant;
}
