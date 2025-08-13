import React, { useEffect, useState } from 'react';
import ImageLightbox from '@/components/ui/image-lightbox';

interface ImageGalleryProps {
  mainImage: string;
  additionalImages?: string[];
  videos?: string[];
}

const ImageGallery: React.FC<ImageGalleryProps> = ({ 
  mainImage, 
  additionalImages = [], 
  videos = [] 
}) => {
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [imageError, setImageError] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [jsonImages, setJsonImages] = useState<string[]>([]);

  const isVideo = (url: string) => /\.(mp4|webm|mov|avi)$/i.test(url);

  useEffect(() => {
    fetch('/images.json')
      .then(res => res.json())
      .then(data => {
        const combined = [...(data.images || []), ...(data['lovable-uploads'] || [])];
        setJsonImages(combined);
      })
      .catch(() => {
        setJsonImages([]);
      });
  }, []);

  const allMedia = [
    mainImage,
    ...additionalImages,
    ...videos,
    ...jsonImages,
    "/images/4f06c5b8-2ff1-40cd-8799-0dfd5d92a2fb.png",
    "/images/00b6e599-0376-4990-ac1b-b31b842005fe.jpg",
  ].filter(Boolean);

  const currentMedia = allMedia[currentMediaIndex] || "/placeholder.svg";

  return (
    <>
      {/* Основное отображение медиа */}
      <div className="border rounded-lg overflow-hidden">
        {isVideo(currentMedia) ? (
          <video 
            src={currentMedia}
            className="w-full h-auto max-h-[500px] object-contain"
            controls
            playsInline
          />
        ) : (
          <img
            src={imageError ? "/placeholder.svg" : currentMedia}
            alt="Product"
            className="object-contain w-full h-auto cursor-pointer"
            onError={() => setImageError(true)}
            onClick={() => setLightboxOpen(true)}
          />
        )}
      </div>

      {/* Галерея миниатюр */}
      {allMedia.length > 1 && (
        <div className="mt-4 grid grid-cols-5 gap-2">
          {allMedia.map((media, index) => (
            <button 
              key={index}
              className={`relative border rounded overflow-hidden aspect-[3/4] ${
                index === currentMediaIndex 
                  ? 'border-primary border-2' 
                  : 'border-gray-200'
              }`}
              onClick={() => setCurrentMediaIndex(index)}
            >
              {isVideo(media) ? (
                <>
                  <img 
                    src="/video-thumbnail-placeholder.jpg"
                    alt={`Video thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polygon points="5 3 19 12 5 21 5 3"></polygon>
                    </svg>
                  </div>
                </>
              ) : (
                <img 
                  src={media}
                  alt={`Product thumbnail ${index + 1}`}
                  className="w-full h-full object-cover"
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.src = "/placeholder.svg";
                  }}
                />
              )}
            </button>
          ))}
        </div>
      )}

      {/* Лайтбокс только для изображений */}
      <ImageLightbox 
        images={allMedia.filter(media => !isVideo(media))}
        initialIndex={currentMediaIndex}
        open={lightboxOpen}
        onOpenChange={setLightboxOpen}
      />
    </>
  );
};

export default ImageGallery;
