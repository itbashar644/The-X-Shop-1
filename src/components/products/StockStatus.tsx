import React from 'react';
import { Loader2 } from 'lucide-react';

interface StockStatusProps {
  inStock: boolean;
  quantity?: number;
  isLoading?: boolean;
  className?: string;
}

const StockStatus: React.FC<StockStatusProps> = ({ 
  inStock, 
  quantity,
  isLoading = false,
  className = "" 
}) => {
  if (isLoading) {
    return (
      <div className={`flex items-center text-gray-500 text-sm ${className}`}>
        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
        Проверяем наличие...
      </div>
    );
  }

  const stockStatus = {
    inStock: {
      text: quantity ? `В наличии · ${quantity} шт` : 'В наличии',
      className: 'text-green-600'
    },
    outOfStock: {
      text: 'Нет в наличии',
      className: 'text-red-500'
    }
  };

  const status = inStock ? stockStatus.inStock : stockStatus.outOfStock;

  return (
    <div className={`${status.className} ${className} flex items-center text-sm font-medium`}>
      <span className="relative flex h-2 w-2 mr-2">
        <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${inStock ? 'bg-green-400' : 'bg-red-400'}`}></span>
        <span className={`relative inline-flex rounded-full h-2 w-2 ${inStock ? 'bg-green-500' : 'bg-red-500'}`}></span>
      </span>
      {status.text}
    </div>
  );
};

export default StockStatus;