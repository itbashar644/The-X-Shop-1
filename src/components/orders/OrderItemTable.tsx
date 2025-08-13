
import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface OrderItemTableProps {
  items: any[];
}

const OrderItemTable: React.FC<OrderItemTableProps> = ({ items }) => {
  // Проверка на пустой массив или отсутствие данных
  if (!Array.isArray(items) || items.length === 0) {
    return (
      <div className="border rounded-lg p-4 text-center text-muted-foreground">
        Информация о товарах недоступна
      </div>
    );
  }

  // Проверка структуры данных
  const hasValidItems = items.some(item => 
    item && (typeof item === 'object') && 
    (item.product || item.productName)
  );

  if (!hasValidItems) {
    return (
      <div className="border rounded-lg p-4 text-center text-muted-foreground">
        Некорректный формат данных товаров
      </div>
    );
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Товар</TableHead>
            <TableHead className="text-center">Количество</TableHead>
            <TableHead className="text-right">Цена</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item, index) => {
            try {
              // Безопасное получение данных о товаре
              const product = item?.product || {};
              const quantity = item?.quantity || 1;
              
              // Get price from multiple possible locations
              const itemPrice = item?.price || 0;
              const productPrice = product?.price || 0;
              const price = itemPrice > 0 ? itemPrice : productPrice;
              
              const title = product?.title || item?.productName || "Товар";
              
              // Улучшенная логика получения изображения товара
              let imageUrl = "";
              console.log(product)
              // Сначала пытаемся получить изображение из продукта
              if (product?.image_url) {
                imageUrl =  "./images/" + product.image_url;
              }
              // Если есть цветовые варианты и выбран цвет, ищем соответствующее изображение
              else if (item?.color && product?.colorVariants && Array.isArray(product.colorVariants)) {
                const colorVariant = product.colorVariants.find(variant => 
                  variant.color && variant.color.toLowerCase() === item.color.toLowerCase()
                );
                if (colorVariant?.image_url) {
                  imageUrl = colorVariant.image_url;
                } else if (product?.image_url) {
                  imageUrl = product.image_url;
                }
              }
              // Попытка получить изображение из дополнительных изображений
              else if (product?.additionalImages && Array.isArray(product.additionalImages) && product.additionalImages.length > 0) {
                imageUrl = product.additionalImages[0];
              }
              // Fallback к основному изображению продукта
              else if (product?.image_url) {
                imageUrl = product.image_url;
              }
              
              const color = item?.color || null;
              const size = item?.size || null;
              const articleNumber = item?.articleNumber || product?.articleNumber || null;
              
              return (
                <TableRow key={index}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="h-16 w-16 flex-shrink-0 rounded overflow-hidden">
                        {imageUrl ? (
                          <img 
                            src={imageUrl} 
                            alt={title}
                            className="h-full w-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = '/placeholder.svg';
                            }}
                          />
                        ) : (
                          <div className="h-full w-full bg-gray-200 flex items-center justify-center">
                            <span className="text-xs text-gray-500">Нет фото</span>
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="font-medium">{title}</p>
                        {color && (
                          <p className="text-xs text-muted-foreground">Цвет: {color}</p>
                        )}
                        {size && (
                          <p className="text-xs text-muted-foreground">Размер: {size}</p>
                        )}
                        {articleNumber && (
                          <p className="text-xs text-muted-foreground">Артикул: {articleNumber}</p>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">{quantity}</TableCell>
                  <TableCell className="text-right">
                    {(price * quantity).toLocaleString()} ₽
                  </TableCell>
                </TableRow>
              );
            } catch (error) {
              console.error("Ошибка при рендеринге товара:", error, item);
              return (
                <TableRow key={index}>
                  <TableCell colSpan={3} className="text-center text-red-500">
                    Ошибка отображения товара
                  </TableCell>
                </TableRow>
              );
            }
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default OrderItemTable;
