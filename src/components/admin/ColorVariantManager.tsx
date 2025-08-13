import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ColorVariant } from '@/types/product';
import { X, Plus, Upload } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { AspectRatio } from "@/components/ui/aspect-ratio";

interface ColorVariantManagerProps {
  colorVariants: ColorVariant[];
  onChange: (variants: ColorVariant[]) => void;
  basePrice: number;
}

const generateId = () => '_' + Math.random().toString(36).substr(2, 9);

const ColorVariantManager: React.FC<ColorVariantManagerProps> = ({ 
  colorVariants = [], 
  onChange,
  basePrice = 0
}) => {
  const [newColor, setNewColor] = useState('');

  const handleAddVariant = () => {
    if (!newColor.trim()) return;

    if (colorVariants.some(variant => variant.color.toLowerCase() === newColor.toLowerCase())) {
      alert('Этот цвет уже добавлен');
      return;
    }

    const newVariant: ColorVariant = {
      id: generateId(),
      color: newColor,
      colorCode: '', // можно пустую строку или сразу цветовой код, если есть
      price: basePrice,
      discountPrice: undefined,
      stockQuantity: 0,
      articleNumber: '',
      barcode: '',
      inStock: false,
      images: [], // пустой массив, если images - массив строк или объектов
      ozonUrl: '',
      wildberriesUrl: '',
      avitoUrl: '',
      imageUrl: '', // Если нужен для превью, иначе убери
    };

    onChange([...colorVariants, newVariant]);
    setNewColor('');
  };

  const handleRemoveVariant = (index: number) => {
    const updatedVariants = [...colorVariants];
    updatedVariants.splice(index, 1);
    onChange(updatedVariants);
  };

  const handleVariantChange = (index: number, field: keyof ColorVariant, value: any) => {
    const updatedVariants = [...colorVariants];
    updatedVariants[index] = { ...updatedVariants[index], [field]: value };
    onChange(updatedVariants);
  };

  const handleImageUpload = (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const fakeUrl = URL.createObjectURL(file);
    handleVariantChange(index, 'imageUrl', fakeUrl);
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input 
          placeholder="Название цвета"
          value={newColor}
          onChange={(e) => setNewColor(e.target.value)}
          className="flex-1"
        />
        <Button 
          type="button" 
          variant="secondary" 
          onClick={handleAddVariant}
        >
          <Plus className="h-4 w-4 mr-2" />
          Добавить цвет
        </Button>
      </div>

      {colorVariants.length > 0 ? (
        <div className="space-y-6 divide-y">
          {colorVariants.map((variant, index) => (
            <div key={variant.id} className="pt-4 first:pt-0">
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-medium flex items-center">
                  <span className="inline-block w-4 h-4 mr-2 rounded-full" style={{ 
                    backgroundColor: variant.color.toLowerCase() !== 'белый' ? variant.color.toLowerCase() : '#ffffff',
                    border: variant.color.toLowerCase() === 'белый' ? '1px solid #ccc' : 'none' 
                  }}></span>
                  {variant.color}
                </h4>
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => handleRemoveVariant(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label htmlFor={`color-${index}-price`}>Цена</Label>
                      <Input 
                        id={`color-${index}-price`}
                        type="number" 
                        value={variant.price || ''} 
                        onChange={(e) => handleVariantChange(index, 'price', Number(e.target.value))}
                        placeholder="Цена"
                      />
                    </div>
                    <div>
                      <Label htmlFor={`color-${index}-discount`}>Цена со скидкой</Label>
                      <Input 
                        id={`color-${index}-discount`}
                        type="number" 
                        value={variant.discountPrice || ''} 
                        onChange={(e) => handleVariantChange(index, 'discountPrice', e.target.value ? Number(e.target.value) : undefined)}
                        placeholder="Цена со скидкой"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label htmlFor={`color-${index}-article`}>Артикул</Label>
                      <Input 
                        id={`color-${index}-article`}
                        value={variant.articleNumber || ''} 
                        onChange={(e) => handleVariantChange(index, 'articleNumber', e.target.value)}
                        placeholder="Артикул"
                      />
                    </div>
                    <div>
                      <Label htmlFor={`color-${index}-barcode`}>Штрих-код</Label>
                      <Input 
                        id={`color-${index}-barcode`}
                        value={variant.barcode || ''} 
                        onChange={(e) => handleVariantChange(index, 'barcode', e.target.value)}
                        placeholder="Штрих-код"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor={`color-${index}-quantity`}>Количество на складе</Label>
                    <Input 
                      id={`color-${index}-quantity`}
                      type="number" 
                      value={variant.stockQuantity || 0} 
                      onChange={(e) => handleVariantChange(index, 'stockQuantity', Number(e.target.value))}
                      placeholder="Количество"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div>
                    <Label>Изображение цвета</Label>
                    <div className="mt-1 flex items-center">
                      <div className="rounded-md border overflow-hidden mr-3 w-16 h-16">
                        {variant.imageUrl ? (
                          <AspectRatio ratio={3/4}>
                            <img 
                              src={variant.imageUrl} 
                              alt={variant.color} 
                              className="w-full h-full object-cover"
                            />
                          </AspectRatio>
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-muted">
                            <span className="text-xs text-muted-foreground">Нет</span>
                          </div>
                        )}
                      </div>
                      <Label 
                        htmlFor={`color-${index}-image`}
                        className="cursor-pointer bg-muted hover:bg-muted/80 px-3 py-1.5 rounded-md text-sm font-medium flex items-center"
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        Загрузить
                      </Label>
                      <Input 
                        id={`color-${index}-image`}
                        type="file" 
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleImageUpload(index, e)}
                      />
                    </div>
                  </div>

                  <div className="mt-3 space-y-2">
                    <Label>Ссылки на маркетплейсы</Label>
                    <div className="grid grid-cols-1 gap-2">
                      <div>
                        <Label htmlFor={`color-${index}-ozon`} className="text-xs">OZON</Label>
                        <Input 
                          id={`color-${index}-ozon`}
                          value={variant.ozonUrl || ''} 
                          onChange={(e) => handleVariantChange(index, 'ozonUrl', e.target.value)}
                          placeholder="https://ozon.ru/..."
                        />
                      </div>
                      <div>
                        <Label htmlFor={`color-${index}-wb`} className="text-xs">Wildberries</Label>
                        <Input 
                          id={`color-${index}-wb`}
                          value={variant.wildberriesUrl || ''} 
                          onChange={(e) => handleVariantChange(index, 'wildberriesUrl', e.target.value)}
                          placeholder="https://wildberries.ru/..."
                        />
                      </div>
                      <div>
                        <Label htmlFor={`color-${index}-avito`} className="text-xs">Avito</Label>
                        <Input 
                          id={`color-${index}-avito`}
                          value={variant.avitoUrl || ''} 
                          onChange={(e) => handleVariantChange(index, 'avitoUrl', e.target.value)}
                          placeholder="https://avito.ru/..."
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-8 text-center">
          <p className="text-muted-foreground">Добавьте цветовые варианты товара</p>
        </div>
      )}
    </div>
  );
};

export default ColorVariantManager;
