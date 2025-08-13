
import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Product } from "@/types/product";

interface AdditionalInfoTabProps {
  formData: Partial<Product>;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSelectChange: (value: string, name: string) => void;
}

const AdditionalInfoTab = ({
  formData,
  handleInputChange,
  handleSelectChange
}: AdditionalInfoTabProps) => {
  return (
    <div className="space-y-4">
      <div className="space-y-4 p-4 border rounded-lg bg-muted/30">
        <h3 className="text-sm font-medium">Ссылки на маркетплейсы</h3>
        
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="ozonUrl" className="text-right">
            Ссылка на Ozon
          </Label>
          <Input
            id="ozonUrl"
            name="ozonUrl"
            placeholder="https://www.ozon.ru/product/..."
            value={formData.ozonUrl || ""}
            onChange={handleInputChange}
            className="col-span-3"
          />
        </div>
        
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="wildberriesUrl" className="text-right">
            Ссылка на Wildberries
          </Label>
          <Input
            id="wildberriesUrl"
            name="wildberriesUrl"
            placeholder="https://www.wildberries.ru/catalog/..."
            value={formData.wildberriesUrl || ""}
            onChange={handleInputChange}
            className="col-span-3"
          />
        </div>
        
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="avitoUrl" className="text-right">
            Ссылка на Авито
          </Label>
          <Input
            id="avitoUrl"
            name="avitoUrl"
            placeholder="https://www.avito.ru/..."
            value={formData.avitoUrl || ""}
            onChange={handleInputChange}
            className="col-span-3"
          />
        </div>
      </div>
      
      <div className="space-y-4 p-4 border rounded-lg bg-muted/30">
        <h3 className="text-sm font-medium">Видео товара</h3>
        
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="videoType" className="text-right">
            Тип видео
          </Label>
          <Select
            value={formData.videoType || "mp4"}
            onValueChange={(value) => handleSelectChange(value, "videoType")}
          >
            <SelectTrigger className="col-span-3">
              <SelectValue placeholder="Выберите тип видео" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="mp4">MP4 (прямая ссылка)</SelectItem>
              <SelectItem value="vk">ВКонтакте</SelectItem>
              <SelectItem value="youtube">YouTube</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="videoUrl" className="text-right">
            URL видео
          </Label>
          <Input
            id="videoUrl"
            name="videoUrl"
            value={formData.videoUrl || ""}
            onChange={handleInputChange}
            placeholder={
              formData.videoType === "vk"
                ? "https://vkvideo.ru/video-123456_789012 или с video_ext.php"
                : formData.videoType === "youtube"
                ? "https://youtube.com/watch?v=AbCdEfG или https://youtu.be/AbCdEfG"
                : "https://example.com/video.mp4"
            }
            className="col-span-3"
          />
        </div>
        
        <div className="col-span-4 text-xs text-muted-foreground pl-4 md:pl-[calc(25%+1rem)]">
          {formData.videoType === "vk" ? (
            <p>Принимаются ссылки на видео ВКонтакте в форматах: vkvideo.ru/video-ID_ID, vk.com/video-ID_ID или с video_ext.php</p>
          ) : formData.videoType === "youtube" ? (
            <p>Принимаются ссылки на видео YouTube в форматах: youtube.com/watch?v=ID или youtu.be/ID</p>
          ) : (
            <p>Укажите прямую ссылку на MP4-видеофайл</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdditionalInfoTab;
