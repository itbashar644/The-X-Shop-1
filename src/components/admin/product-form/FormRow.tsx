
import React from 'react';
import { Label } from "@/components/ui/label";

interface FormRowProps {
  label: string;
  htmlFor?: string;
  children: React.ReactNode;
  isTextArea?: boolean;
  isImage?: boolean;
}

export const FormRow = ({ 
  label, 
  htmlFor, 
  children, 
  isTextArea = false,
  isImage = false
}: FormRowProps) => (
  <div className="grid grid-cols-1 md:grid-cols-4 items-start gap-4">
    <Label 
      htmlFor={htmlFor} 
      className="text-right md:pt-2"
    >
      {label}
    </Label>
    <div className={`col-span-1 md:col-span-3 ${isTextArea || isImage ? 'items-start' : ''}`}>
      {children}
    </div>
  </div>
);
