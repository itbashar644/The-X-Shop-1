
import React from 'react';

interface FormSectionProps {
  children: React.ReactNode;
}

export const FormSection = ({ children }: FormSectionProps) => (
  <div className="space-y-4">
    {children}
  </div>
);
