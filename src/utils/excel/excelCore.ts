
import * as XLSX from 'xlsx';
import { Product } from '@/types/product';

// Convert products array to Excel workbook
export const productsToExcel = (products: Product[]): XLSX.WorkBook => {
  console.log("Converting products to Excel format...", products.length);
  
  // Create a simplified array for export (excluding complex nested properties)
  const exportData = products.map(product => ({
    id: product.id,
    title: product.title,
    description: product.description,
    price: product.price,
    discountPrice: product.discountPrice || '',
    category: product.category,
    imageUrl: product.imageUrl,
    rating: product.rating,
    inStock: product.inStock ? 'Да' : 'Нет',
    colors: product.colors ? product.colors.join(', ') : '',
    sizes: product.sizes ? product.sizes.join(', ') : '',
    countryOfOrigin: product.countryOfOrigin,
    isNew: product.isNew ? 'Да' : 'Нет',
    isBestseller: product.isBestseller ? 'Да' : 'Нет',
    articleNumber: product.articleNumber || '',
    barcode: product.barcode || '',
    wildberriesUrl: product.wildberriesUrl || '',
    ozonUrl: product.ozonUrl || '',
    avitoUrl: product.avitoUrl || '',
    stockQuantity: product.stockQuantity || 0,
  }));

  // Create worksheet from data
  const worksheet = XLSX.utils.json_to_sheet(exportData);
  
  // Generate column widths based on content
  const maxWidth = (data: any[], index: string) => 
    Math.max(10, ...data.map(row => row[index] ? String(row[index]).length : 0));
  
  // Set column widths
  worksheet['!cols'] = [
    { wch: 8 }, // id
    { wch: Math.max(20, maxWidth(exportData, 'title')) }, // title
    { wch: Math.max(30, maxWidth(exportData, 'description')) }, // description
    { wch: 10 }, // price
    { wch: 10 }, // discountPrice
    { wch: Math.max(15, maxWidth(exportData, 'category')) }, // category
    { wch: 20 }, // imageUrl
    { wch: 8 }, // rating
    { wch: 8 }, // inStock
    { wch: 15 }, // colors
    { wch: 15 }, // sizes
    { wch: 15 }, // countryOfOrigin
    { wch: 8 }, // isNew
    { wch: 8 }, // isBestseller
    { wch: 15 }, // articleNumber 
    { wch: 15 }, // barcode
    { wch: 30 }, // wildberriesUrl
    { wch: 30 }, // ozonUrl
    { wch: 30 }, // avitoUrl
    { wch: 10 }, // stockQuantity
  ];
  
  // Create workbook and add the worksheet
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Товары');
  
  return workbook;
};

// Helper to create a blob from Excel workbook
export const workbookToBlob = (workbook: XLSX.WorkBook): Blob => {
  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  return new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
};

// Helper to download an Excel file
export const downloadExcelFile = (blob: Blob, filename: string): void => {
  console.log("Downloading Excel file:", filename);
  
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  
  // Clean up
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
  
  console.log("Excel file download initiated");
};
