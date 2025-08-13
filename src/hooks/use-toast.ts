
import * as React from "react";
import { 
  useToast as useToastOriginal, 
  toast as toastOriginal,
  ToasterToast,
  type Toast as BaseToast
} from "@/components/ui/use-toast";

export interface Toast extends Omit<ToasterToast, "id"> {}

// Re-export the enhanced toast hook
export function useToast() {
  // Return the original hook as it already has the variant methods
  return useToastOriginal();
}

// Re-export the standalone toast function
export const toast = toastOriginal;
