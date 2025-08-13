import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Upload, X, UploadCloud, Plus } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface MultipleImageUploaderProps {
  initialImageUrls?: string[];
  onImagesChange: (urls: string[]) => void;
}

export default function MultipleImageUploader({
  initialImageUrls = [],
  onImagesChange,
}: MultipleImageUploaderProps) {
  const [imageUrls, setImageUrls] = useState<string[]>(initialImageUrls);
  const [newImageUrl, setNewImageUrl] = useState("");
  const [mode, setMode] = useState<"upload" | "url">("upload");
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    setUploading(true);

    try {
      const uploadedUrls: string[] = [];

      for (let i = 0; i < e.target.files.length; i++) {
        const file = e.target.files[i];
        const formData = new FormData();
        formData.append("image", file);
        formData.append("filename", `${uuidv4()}.${file.name.split('.').pop()}`);

        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          throw new Error(`Ошибка при загрузке файла ${file.name}`);
        }

        const { url } = await response.json();
        uploadedUrls.push(url);
      }

      setImageUrls(prev => {
        const newUrls = [...prev, ...uploadedUrls];
        onImagesChange(newUrls);
        return newUrls;
      });

      toast.success("Изображения загружены", {
        description: `Успешно загружено ${uploadedUrls.length} изображений`,
      });
    } catch (error: any) {
      console.error("Ошибка при загрузке изображений:", error);
      toast.error("Ошибка загрузки", {
        description: error.message || "Произошла ошибка при загрузке файлов",
      });
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const handleUrlAdd = () => {
    if (newImageUrl.trim()) {
      setImageUrls(prev => {
        const newUrls = [...prev, newImageUrl];
        onImagesChange(newUrls);
        return newUrls;
      });
      setNewImageUrl("");
    }
  };

  const handleRemoveImage = (indexToRemove: number) => {
    setImageUrls(prev => {
      const newUrls = prev.filter((_, index) => index !== indexToRemove);
      onImagesChange(newUrls);
      return newUrls;
    });
  };

  return (
    <div className="space-y-4">
      <Tabs value={mode} onValueChange={(value) => setMode(value as "upload" | "url")}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="upload">Загрузить файлы</TabsTrigger>
          <TabsTrigger value="url">URL изображения</TabsTrigger>
        </TabsList>

        <TabsContent value="upload" className="pt-4">
          <label className="flex items-center justify-center border-2 border-dashed rounded-lg p-6 cursor-pointer hover:bg-muted/50 transition-colors">
            <input
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleFileChange}
              disabled={uploading}
            />
            <div className="text-center">
              {uploading ? (
                <div className="flex flex-col items-center">
                  <span className="animate-spin mb-2">
                    <UploadCloud className="h-8 w-8 text-primary" />
                  </span>
                  <p>Загрузка...</p>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <Upload className="h-8 w-8 mb-2 text-primary" />
                  <p className="font-medium">Нажмите или перетащите файлы</p>
                  <p className="text-sm text-muted-foreground">PNG, JPG, WEBP до 10MB</p>
                </div>
              )}
            </div>
          </label>
        </TabsContent>

        <TabsContent value="url" className="pt-4">
          <div className="flex space-x-2">
            <Input
              type="text"
              placeholder="https://example.com/image.jpg"
              value={newImageUrl}
              onChange={(e) => setNewImageUrl(e.target.value)}
              className="flex-1"
            />
            <Button onClick={handleUrlAdd} type="button">
              <Plus className="mr-2 h-4 w-4" />
              Добавить
            </Button>
          </div>
        </TabsContent>
      </Tabs>

      {imageUrls.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-4">
          {imageUrls.map((url, index) => (
            <div key={index} className="relative group border rounded-md overflow-hidden">
              <div className="aspect-[3/4]">
                <img
                  src={url}
                  alt={`Изображение ${index + 1}`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "/placeholder.svg";
                  }}
                />
              </div>
              <Button
                variant="destructive"
                size="sm"
                className="absolute top-1 right-1 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => handleRemoveImage(index)}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
