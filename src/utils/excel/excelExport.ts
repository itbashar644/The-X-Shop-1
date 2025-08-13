
import * as XLSX from 'xlsx';
import { Product } from '@/types/product';
import { productsToExcel, workbookToBlob, downloadExcelFile } from './excelCore';

// Export products to Excel and download the file
export const exportProductsToExcel = async (products: Product[]) => {
  console.log("Starting Excel export process with products:", products.length);
  
  // Create the Excel workbook from products
  const workbook = productsToExcel(products);
  
  // Convert to blob
  const blob = workbookToBlob(workbook);
  
  // Download the file
  const fileName = `товары_${new Date().toLocaleDateString('ru')}.xlsx`;
  downloadExcelFile(blob, fileName);
  
  console.log("Excel export completed");
};

// Alias for downloadProductsExcel for backward compatibility
export const downloadProductsExcel = exportProductsToExcel;
