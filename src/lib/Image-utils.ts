import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { ColorVariant, Product } from "@/types/product";

/**
 * Объединяет классы с учётом tailwind-merge и clsx
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Форматирует цену в рублях с разделением тысяч и знаком ₽
 */
export function formatPrice(price: number): string {
  return (
    new Intl.NumberFormat("ru-RU", {
      style: "decimal",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price) + "\u00A0₽" // неразрывный пробел + ₽
  );
}

/**
 * Получает цену для товара с учётом выбранного цвета (варианта)
 */
export function getProductPrice(product: Product, selectedColor?: string): number {
  if (selectedColor && product.colorVariants) {
    const variant = product.colorVariants.find((v) => v.color === selectedColor);
    if (variant) {
      return variant.discountPrice || variant.price;
    }
  }
  return product.discountPrice || product.price;
}

/**
 * Форматирует URL видео для различных платформ
 */
export function formatVideoUrl(
  url: string,
  type: "vk" | "youtube" | "mp4"
): string {
  if (!url) return "";

  switch (type) {
    case "vk":
      try {
        if (url.includes("video_ext.php")) {
          const params = new URL(url).searchParams;
          const oid = params.get("oid");
          const id = params.get("id");
          if (oid && id) {
            return `https://vk.com/video_ext.php?oid=${oid}&id=${id}&hd=2`;
          }
          return url;
        } else if (url.includes("vkvideo.ru/video")) {
          const match = url.match(/video([-\d]+)_(\d+)/);
          if (match && match[1] && match[2]) {
            return `https://vk.com/video_ext.php?oid=${match[1]}&id=${match[2]}&hd=2`;
          }
        } else if (url.includes("vk.com/video")) {
          const match = url.match(/video([-\d]+)_(\d+)/);
          if (match && match[1] && match[2]) {
            return `https://vk.com/video_ext.php?oid=${match[1]}&id=${match[2]}&hd=2`;
          }
        }
      } catch (e) {
        console.error("Ошибка при обработке URL видео ВКонтакте:", e);
      }
      return url;

    case "youtube":
      try {
        if (url.includes("youtube.com/embed/")) {
          return url;
        }
        let videoId = "";
        if (url.includes("youtube.com/watch")) {
          const urlObj = new URL(url);
          videoId = urlObj.searchParams.get("v") || "";
        } else if (url.includes("youtu.be/")) {
          videoId = url.split("youtu.be/")[1]?.split("?")[0] || "";
        }
        if (videoId) {
          return `https://www.youtube.com/embed/${videoId}`;
        }
      } catch (e) {
        console.error("Ошибка при обработке URL видео YouTube:", e);
      }
      return url;

    case "mp4":
    default:
      return url;
  }
}

/**
 * Универсальная функция для построения URL изображения.
 * Если путь уже абсолютный (начинается с http), возвращает как есть.
 * Если начинается с /images/ или /lovable-uploads/ — возвращает без изменений.
 * Иначе — добавляет /images/ как префикс.
 */
export function buildProductImageUrl(imagePath?: string | null): string {
  if (!imagePath) return "/images/placeholder.svg";

  if (
    imagePath.startsWith("http://") ||
    imagePath.startsWith("https://") ||
    imagePath.startsWith("//")
  ) {
    return imagePath;
  }

  if (
    imagePath.startsWith("/images/") ||
    imagePath.startsWith("/lovable-uploads/")
  ) {
    return imagePath;
  }

  // По умолчанию считаем, что файл лежит в /images/
  return `/images/${imagePath}`;
}
