import React from 'react';
import { Product } from "@/types/product";

interface MarketplaceLinksProps {
  product: Product;
  className?: string;
}

const MarketplaceLinks: React.FC<MarketplaceLinksProps> = ({ product, className = "" }) => {
  const marketplaces = [
    { name: 'ozon', url: product.ozonUrl, icon: '/icons/ozon.svg' },
    { name: 'wildberries', url: product.wildberriesUrl, icon: '/icons/wildberries.svg' },
    { name: 'avito', url: product.avitoUrl, icon: '/icons/avito.svg' }
  ].filter(m => m.url);

  if (marketplaces.length === 0) return null;

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <span className="text-xs text-gray-500">Также доступно:</span>
      <div className="flex gap-1">
        {marketplaces.map(m => (
          <a 
            key={m.name}
            href={m.url}
            target="_blank"
            rel="noopener noreferrer"
            className="w-5 h-5"
          >
            <img src={m.icon} alt={m.name} className="w-full h-full" />
          </a>
        ))}
      </div>
    </div>
  );
};

export default MarketplaceLinks;