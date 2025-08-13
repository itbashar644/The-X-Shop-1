
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
 
import { toast } from "sonner";
import { Upload, X, Image, UploadCloud } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { API_BASE_URL } from "@/types/variables";

interface ImageUploaderProps {
  initialImageUrl?: string;
  onImageUploaded: (url: string) => void;
  onFileSelected?: (file: File | null) => void;
  onRemoveImage?: () => void;
}

export default function ImageUploader({ 
  initialImageUrl, 
  onImageUploaded, 
  onFileSelected, 
  onRemoveImage 
}: ImageUploaderProps) {
  const [imageUrl, setImageUrl] = useState<string>(initialImageUrl || "");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [mode, setMode] = useState<"upload" | "url">(initialImageUrl ? "url" : "upload");
  const [externalUrl, setExternalUrl] = useState<string>(initialImageUrl || "");
  const [previewError, setPreviewError] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) {
      setSelectedFile(null);
      if (onFileSelected) onFileSelected(null);
      return;
    }
    const file = e.target.files[0];
    setSelectedFile(file);
    setImageUrl(""); // Clear any previous URL
    setPreviewError(false);
    if (onFileSelected) onFileSelected(file);
  };

  const handleUrlSubmit = () => {
    if (externalUrl.trim()) {
      setImageUrl(externalUrl);
      setSelectedFile(null);
      if (onFileSelected) onFileSelected(null);
      onImageUploaded(externalUrl);
      toast.success("URL изображения добавлен");
    }
  };

  const handleRemoveImage = () => {
    setImageUrl("");
    setExternalUrl("");
    setSelectedFile(null);
    setPreviewError(false);
    if (onFileSelected) onFileSelected(null);
    if (onRemoveImage) {
      onRemoveImage();
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-4">
      <Tabs value={mode} onValueChange={(value) => setMode(value as "upload" | "url")}> 
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="upload">Загрузить файл</TabsTrigger>
          <TabsTrigger value="url">URL изображения</TabsTrigger>
        </TabsList>

        <TabsContent value="upload" className="pt-4">
          <div className="flex items-center space-x-4">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
            <Button 
              onClick={triggerFileInput} 
              className="flex-shrink-0"
              variant="outline"
            >
              <span className="flex items-center">
                <Upload className="mr-2 h-4 w-4" />
                Выбрать файл
              </span>
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="url" className="pt-4">
          <div className="flex space-x-2">
            <Input
              type="text"
              placeholder="https://example.com/image.jpg"
              value={externalUrl}
              onChange={(e) => setExternalUrl(e.target.value)}
              className="flex-1"
            />
            <Button onClick={handleUrlSubmit} type="button">
              <Image className="mr-2 h-4 w-4" />
              Применить
            </Button>
          </div>
        </TabsContent>
      </Tabs>

      {(selectedFile || imageUrl) && (
        <div className="relative mt-4 border rounded-md overflow-hidden">
          {selectedFile ? (
            <img
              src={URL.createObjectURL(selectedFile)}
              alt="Предпросмотр"
              className="max-h-[200px] object-contain mx-auto"
              onError={() => setPreviewError(true)}
              style={{ display: previewError ? 'none' : 'block' }}
            />
          ) : (
            <img
              src={imageUrl}
              alt="Предпросмотр"
              className="max-h-[200px] object-contain mx-auto"
              onError={() => setPreviewError(true)}
              style={{ display: previewError ? 'none' : 'block' }}
            />
          )}
          {previewError && (
            <div className="h-[200px] flex items-center justify-center bg-muted">
              <p className="text-muted-foreground">Ошибка загрузки изображения</p>
            </div>
          )}
          <Button
            variant="destructive"
            size="sm"
            className="absolute top-2 right-2 h-8 w-8 p-0"
            onClick={handleRemoveImage}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
