
import React from "react";

interface WhatsAppIconProps {
  className?: string;
  size?: number;
}

const WhatsAppIcon = ({ className, size = 16 }: WhatsAppIconProps) => {
  return (
    <img 
      src="/lovable-uploads/6fc205ab-6c5e-4d07-97bf-08052b285a4f.png" 
      alt="WhatsApp" 
      className={className}
      width={size} 
      height={size} 
      style={{ objectFit: "contain" }}
    />
  );
};

export default WhatsAppIcon;
