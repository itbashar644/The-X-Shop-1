
import * as XLSX from 'xlsx';
import { workbookToBlob, downloadExcelFile } from './excelCore';

// Create and download a template for product import
export const downloadImportTemplate = async (): Promise<void> => {
  // Create a template with sample data and headers
  const template = [
    {
      title: 'Пример товара', // ОБЯЗАТЕЛЬНОЕ ПОЛЕ
      description: 'Подробное описание товара', // ОБЯЗАТЕЛЬНОЕ ПОЛЕ
      price: 1000, // ОБЯЗАТЕЛЬНОЕ ПОЛЕ (число)
      discountPrice: 800, // необязательное поле (число)
      category: 'Сумки и рюкзаки', // ОБЯЗАТЕЛЬНОЕ ПОЛЕ
      imageUrl: '/placeholder.svg', // необязательное поле (URL изображения)
      rating: 4.8, // необязательное поле (число от 0 до 5)
      inStock: 'Да', // необязательное поле ('Да' или 'Нет')
      colors: 'Красный, Синий, Зеленый', // необязательное поле (через запятую)
      sizes: 'S, M, L, XL', // необязательное поле (через запятую)
      countryOfOrigin: 'Россия', // ОБЯЗАТЕЛЬНОЕ ПОЛЕ
      isNew: 'Да', // необязательное поле ('Да' или 'Нет')
      isBestseller: 'Да', // необязательное поле ('Да' или 'Нет')
      articleNumber: 'AP-12345', // необязательное поле
      barcode: '4607001234567', // необязательное поле
      wildberriesUrl: 'https://www.wildberries.ru/catalog/12345', // необязательное поле
      ozonUrl: 'https://www.ozon.ru/context/detail/id/12345/', // необязательное поле
      avitoUrl: 'https://www.avito.ru/item/12345', // необязательное поле
      stockQuantity: 10, // необязательное поле (число)
      material: 'Натуральная кожа' // необязательное поле
    },
    {
      title: 'Второй пример товара', 
      description: 'Еще одно описание', 
      price: 2500,
      category: 'Аксессуары',
      countryOfOrigin: 'Италия'
    }
  ];

  // Create a new workbook and add the template data
  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.json_to_sheet(template);
  
  // Set column widths
  worksheet['!cols'] = [
    { wch: 25 }, // title
    { wch: 35 }, // description
    { wch: 10 }, // price
    { wch: 15 }, // discountPrice
    { wch: 20 }, // category
    { wch: 30 }, // imageUrl
    { wch: 8 },  // rating
    { wch: 8 },  // inStock
    { wch: 20 }, // colors
    { wch: 15 }, // sizes
    { wch: 15 }, // countryOfOrigin
    { wch: 8 },  // isNew
    { wch: 8 },  // isBestseller
    { wch: 15 }, // articleNumber
    { wch: 15 }, // barcode
    { wch: 30 }, // wildberriesUrl
    { wch: 30 }, // ozonUrl
    { wch: 30 }, // avitoUrl
    { wch: 10 }, // stockQuantity
    { wch: 20 }  // material
  ];
  
  // Apply styling to header row
  const range = XLSX.utils.decode_range(worksheet['!ref'] as string);
  const headerRow = range.s.r;
  
  // Add comments/notes to headers for helping users understand requirements
  if (!worksheet['!comments']) {
    worksheet['!comments'] = {};
  }
  
  const comments = {
    A1: { t: "ОБЯЗАТЕЛЬНОЕ ПОЛЕ: Название товара" },
    B1: { t: "ОБЯЗАТЕЛЬНОЕ ПОЛЕ: Описание товара" },
    C1: { t: "ОБЯЗАТЕЛЬНОЕ ПОЛЕ: Цена товара (число)" },
    D1: { t: "Цена со скидкой (число, необязательно)" },
    E1: { t: "ОБЯЗАТЕЛЬНОЕ ПОЛЕ: Категория товара" },
    F1: { t: "URL изображения (необязательно)" },
    G1: { t: "Рейтинг от 0 до 5 (необязательно)" },
    H1: { t: "В наличии, укажите 'Да' или 'Нет' (необязательно)" },
    I1: { t: "Цвета через запятую (необязательно)" },
    J1: { t: "Размеры через запятую (необязательно)" },
    K1: { t: "ОБЯЗАТЕЛЬНОЕ ПОЛЕ: Страна происхождения" },
    L1: { t: "Новинка, укажите 'Да' или 'Нет' (необязательно)" },
    M1: { t: "Бестселлер, укажите 'Да' или 'Нет' (необязательно)" },
    N1: { t: "Артикул (необязательно)" },
    O1: { t: "Штрихкод (необязательно)" },
    P1: { t: "Ссылка на Wildberries (необязательно)" },
    Q1: { t: "Ссылка на Ozon (необязательно)" },
    R1: { t: "Ссылка на Avito (необязательно)" },
    S1: { t: "Количество на складе (необязательно)" },
    T1: { t: "Материал (необязательно)" }
  };
  
  Object.assign(worksheet['!comments'], comments);
  
  // Add sheet to workbook
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Шаблон товаров');
  
  // Add instructions sheet
  const instructionsData = [
    ["Инструкция по импорту товаров"],
    [""],
    ["1. Не изменяйте названия столбцов в шаблоне."],
    ["2. Обязательные поля должны быть заполнены для каждого товара:"],
    ["   - title (название товара)"],
    ["   - price (цена)"],
    ["   - category (категория)"],
    ["   - description (описание)"],
    ["   - countryOfOrigin (страна происхождения)"],
    [""],
    ["3. Числовые поля должны содержать только числа без пробелов и специальных символов."],
    ["4. Для полей с вариантами 'Да'/'Нет' используйте только эти значения."],
    ["5. Поля со списками значений (colors, sizes) должны быть разделены запятой."],
    [""]
  ];
  
  const instructionsSheet = XLSX.utils.aoa_to_sheet(instructionsData);
  instructionsSheet['!cols'] = [{ wch: 70 }]; // Set column width
  
  XLSX.utils.book_append_sheet(workbook, instructionsSheet, 'Инструкция');
  
  // Create a blob and download the file
  const blob = workbookToBlob(workbook);
  downloadExcelFile(blob, 'шаблон_импорта_товаров.xlsx');
};

// Export the template download function with the expected name for compatibility
export const createProductTemplate = downloadImportTemplate;
