import React from 'react';
import { AspectRatio } from '@/components/ui/aspect-ratio';

interface ProductVideoProps {
  videoUrl: string;
  videoType?: string;
  className?: string;
  thumbnailUrl?: string;
  autoPlay?: boolean;
  loop?: boolean;
  muted?: boolean;
}

const ProductVideo: React.FC<ProductVideoProps> = ({ 
  videoUrl, 
  videoType = 'mp4',
  className = '',
  thumbnailUrl = '',
  autoPlay = false,
  loop = false,
  muted = false
}) => {
  if (!videoUrl) return null;

  return (
    <div className={`product-video mt-4 ${className}`}>
      <AspectRatio ratio={3/4} className="bg-gray-100 rounded-lg overflow-hidden">
        <video
          controls
          className="w-full h-full object-cover"
          poster={thumbnailUrl}
          autoPlay={autoPlay}
          loop={loop}
          muted={muted}
          playsInline
          preload="metadata"
          aria-label="Видео товара"
        >
          <source src={videoUrl} type={`video/${videoType}`} />
          <track
            kind="captions"
            srcLang="ru"
            label="Русские субтитры"
          />
          Ваш браузер не поддерживает видео элемент.
        </video>
      </AspectRatio>
    </div>
  );
};

export default ProductVideo;