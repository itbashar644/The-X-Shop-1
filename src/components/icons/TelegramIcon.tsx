
import React from "react";

interface TelegramIconProps {
  className?: string;
  size?: number;
}

const TelegramIcon = ({ className, size = 16 }: TelegramIconProps) => {
  return (
    <img 
      src="/lovable-uploads/eeca568c-aa0a-4169-8a72-46a1d9746536.png" 
      alt="Telegram" 
      className={className}
      width={size} 
      height={size} 
      style={{ objectFit: "contain" }}
    />
  );
};

export default TelegramIcon;
