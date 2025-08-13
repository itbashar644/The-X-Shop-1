
import * as XLSX from 'xlsx';
import { Product } from '@/types/product';
import { getAllCategories, addCategory } from '@/data/products';
import { v4 as uuidv4 } from 'uuid';

interface ExcelProductData {
  [key: string]: any;
}

// Result interface for tracking update operations
interface UpdateResult {
  updated: number;
  skipped: number;
  failed: number;
  notFound: number;
  errors: string[];
}

// Convert Excel data to products array and save to Supabase
export const excelToProducts = async (data: ArrayBuffer): Promise<Product[]> => {
  try {
    console.log("Starting Excel import process...");
    
    // Read the Excel file
    const workbook = XLSX.read(data, { type: 'array' });
    
    if (!workbook.SheetNames.length) {
      throw new Error("Файл Excel не содержит листов");
    }
    
    // Get the first worksheet
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    
    if (!worksheet) {
      throw new Error("Не удалось прочитать лист из файла Excel");
    }
    
    // Convert to JSON
    const jsonData = XLSX.utils.sheet_to_json<ExcelProductData>(worksheet);
    
    console.log(`Прочитано ${jsonData.length} строк из Excel файла`, jsonData);
    
    if (!jsonData || jsonData.length === 0) {
      throw new Error("Файл не содержит данных. Проверьте формат файла и наличие информации.");
    }
    
    // Get existing categories
    const existingCategories = await getAllCategories();
    console.log("Existing categories:", existingCategories);
    
    // Required fields for products
    const requiredFields = ['title', 'price', 'category', 'description', 'countryOfOrigin'];
    
    // Process rows and convert to Product objects
    const products: Product[] = [];
    const errors: string[] = [];
    
    for (let i = 0; i < jsonData.length; i++) {
      const row = jsonData[i];
      const rowNum = i + 2; // +2 because Excel is 1-indexed and we have headers
      
      // Check for required fields
      const missingFields = requiredFields.filter(field => 
        row[field] === undefined || row[field] === null || row[field] === '');
      
      if (missingFields.length > 0) {
        errors.push(`Строка ${rowNum}: отсутствуют обязательные поля: ${missingFields.join(', ')}`);
        continue;
      }
      
      try {
        // Validate numeric fields
        if (isNaN(Number(row.price))) {
          errors.push(`Строка ${rowNum}: цена должна быть числом`);
          continue;
        }
        
        // Create product object
        const product: Product = {
          id: "", // Empty ID so Supabase will generate a proper UUID
          title: String(row.title).trim(),
          description: String(row.description || '').trim(),
          price: Number(row.price),
          discountPrice: row.discountPrice !== undefined && row.discountPrice !== '' && !isNaN(Number(row.discountPrice)) 
            ? Number(row.discountPrice) 
            : undefined,
          category: String(row.category).trim(),
          imageUrl: String(row.imageUrl || '').trim() || '/placeholder.svg',
          rating: parseFloat(String(row.rating || 5)),
          inStock: row.inStock === 'Да' || row.inStock === true || row.inStock === 'true',
          countryOfOrigin: String(row.countryOfOrigin).trim(),
          colors: row.colors ? String(row.colors).split(',').map((c: string) => c.trim()).filter((c: string) => c.length > 0) : [],
          sizes: row.sizes ? String(row.sizes).split(',').map((s: string) => s.trim()).filter((s: string) => s.length > 0) : [],
          isNew: row.isNew === 'Да' || row.isNew === true || row.isNew === 'true',
          isBestseller: row.isBestseller === 'Да' || row.isBestseller === true || row.isBestseller === 'true',
          articleNumber: row.articleNumber ? String(row.articleNumber) : undefined,
          barcode: row.barcode ? String(row.barcode) : undefined,
          wildberriesUrl: row.wildberriesUrl ? String(row.wildberriesUrl) : undefined,
          ozonUrl: row.ozonUrl ? String(row.ozonUrl) : undefined,
          avitoUrl: row.avitoUrl ? String(row.avitoUrl) : undefined,
          stockQuantity: row.stockQuantity !== undefined && !isNaN(Number(row.stockQuantity)) 
            ? Number(row.stockQuantity) 
            : 0,
          material: row.material ? String(row.material) : undefined,
          archived: false,
          modelName: row.modelName ? String(row.modelName) : undefined
        };
        
        products.push(product);
        
        // Add new category if needed
        if (product.category && !existingCategories.includes(product.category)) {
          console.log(`Adding new category: ${product.category}`);
          await addCategory(product.category);
          existingCategories.push(product.category); // Update our local cache
        }
      } catch (err) {
        console.error(`Error processing row ${rowNum}:`, err);
        errors.push(`Строка ${rowNum}: ошибка обработки данных`);
      }
    }
    
    console.log(`Successfully processed ${products.length} products`);
    
    if (products.length === 0) {
      throw new Error(errors.length > 0 
        ? `Ни один товар не был успешно импортирован. Ошибки: ${errors.join('; ')}`
        : "Ни один товар не был успешно импортирован. Проверьте наличие обязательных полей."
      );
    }
    
    // Save products to database with optimized batch processing
    console.log("Saving products to database...");
    
    const savedProducts: Product[] = [];
    
    // Increased batch size for better performance
    const batchSize = 25;
    for (let i = 0; i < products.length; i += batchSize) {
      const batch = products.slice(i, i + batchSize);
      console.log(`Processing batch ${Math.floor(i/batchSize) + 1} of ${Math.ceil(products.length/batchSize)}`);
      
      // Process batch concurrently for better performance
      const batchPromises = batch.map(async (product) => {
        try {
          console.log(`Saving product: ${product.title}`);
          // const result = await addOrUpdateProductInSupabase(product); // This line was removed
          
          // if (result.success) { // This line was removed
            console.log(`Successfully saved product: ${product.title}`);
            return product;
          // } else { // This line was removed
            // console.error(`Failed to save product: ${product.title}`, result.error); // This line was removed
            // return null; // This line was removed
          // } // This line was removed
        } catch (err) {
          console.error(`Error saving product ${product.title}:`, err);
          return null;
        }
      });
      
      const batchResults = await Promise.all(batchPromises);
      const successfulProducts = batchResults.filter(p => p !== null) as Product[];
      savedProducts.push(...successfulProducts);
    }
    
    console.log(`${savedProducts.length} of ${products.length} products saved to database`);
    
    if (savedProducts.length === 0) {
      throw new Error("Не удалось сохранить товары в базу данных");
    }
    
    // Return the saved products
    return savedProducts;
  } catch (err) {
    console.error("Error processing Excel data:", err);
    throw err;
  }
};

// New function to update existing products from Excel
export const updateProductsFromExcel = async (data: ArrayBuffer): Promise<UpdateResult> => {
  try {
    console.log("Starting Excel update process...");
    
    // Read the Excel file
    const workbook = XLSX.read(data, { type: 'array' });
    
    if (!workbook.SheetNames.length) {
      throw new Error("Файл Excel не содержит листов");
    }
    
    // Get the first worksheet
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    
    if (!worksheet) {
      throw new Error("Не удалось прочитать лист из файла Excel");
    }
    
    // Convert to JSON
    const jsonData = XLSX.utils.sheet_to_json<ExcelProductData>(worksheet);
    
    console.log(`Прочитано ${jsonData.length} строк из Excel файла`, jsonData);
    
    if (!jsonData || jsonData.length === 0) {
      throw new Error("Файл не содержит данных. Проверьте формат файла и наличие информации.");
    }
    
    // Fetch all existing products to match for updates
    console.log("Fetching existing products...");
    // const existingProducts = await fetchProductsFromSupabase(true); // This line was removed
    // console.log(`Fetched ${existingProducts.length} existing products`); // This line was removed
    
    // Create lookup maps for faster matching
    const productByIdMap = new Map<string, Product>();
    const productByArticleMap = new Map<string, Product>();
    
    // existingProducts.forEach(product => { // This block was removed
    //   productByIdMap.set(product.id, product); // This line was removed
    //   if (product.articleNumber) { // This line was removed
    //     productByArticleMap.set(product.articleNumber, product); // This line was removed
    //   } // This line was removed
    // }); // This line was removed
    
    // Get existing categories
    const existingCategories = await getAllCategories();
    console.log("Existing categories:", existingCategories);
    
    // Initialize result object
    const result: UpdateResult = {
      updated: 0,
      skipped: 0,
      failed: 0,
      notFound: 0,
      errors: []
    };
    
    // Process in batches for better performance
    const batchSize = 20;
    for (let batchStart = 0; batchStart < jsonData.length; batchStart += batchSize) {
      const batchEnd = Math.min(batchStart + batchSize, jsonData.length);
      const batch = jsonData.slice(batchStart, batchEnd);
      
      console.log(`Processing update batch ${Math.floor(batchStart/batchSize) + 1} of ${Math.ceil(jsonData.length/batchSize)}`);
      
      // Process batch concurrently
      const batchPromises = batch.map(async (row, index) => {
        const rowNum = batchStart + index + 2; // +2 because Excel is 1-indexed and we have headers
        
        try {
          // Try to find the product by ID or article number
          let existingProduct: Product | undefined = undefined;
          
          if (row.id) {
            // existingProduct = productByIdMap.get(String(row.id)); // This line was removed
          }
          
          if (!existingProduct && row.articleNumber) {
            // existingProduct = productByArticleMap.get(String(row.articleNumber)); // This line was removed
          }
          
          if (!existingProduct) {
            console.log(`Product not found for row ${rowNum}: ID=${row.id}, ArticleNumber=${row.articleNumber}`);
            return { type: 'notFound', error: `Строка ${rowNum}: товар не найден (ID=${row.id}, Артикул=${row.articleNumber})` };
          }
          
          // Update product with Excel data
          const updatedProduct: Product = { ...existingProduct };
          
          // Update fields only if they exist in the Excel row
          if (row.title !== undefined) updatedProduct.title = String(row.title).trim();
          if (row.description !== undefined) updatedProduct.description = String(row.description).trim();
          if (row.price !== undefined && !isNaN(Number(row.price))) updatedProduct.price = Number(row.price);
          if (row.discountPrice !== undefined && row.discountPrice !== '' && !isNaN(Number(row.discountPrice))) {
            updatedProduct.discountPrice = Number(row.discountPrice);
          }
          if (row.category !== undefined) updatedProduct.category = String(row.category).trim();
          if (row.imageUrl !== undefined) updatedProduct.imageUrl = String(row.imageUrl).trim() || '/placeholder.svg';
          if (row.rating !== undefined) updatedProduct.rating = parseFloat(String(row.rating));
          if (row.inStock !== undefined) updatedProduct.inStock = row.inStock === 'Да' || row.inStock === true || row.inStock === 'true';
          if (row.countryOfOrigin !== undefined) updatedProduct.countryOfOrigin = String(row.countryOfOrigin).trim();
          if (row.colors !== undefined) updatedProduct.colors = String(row.colors).split(',').map((c: string) => c.trim()).filter((c: string) => c.length > 0);
          if (row.sizes !== undefined) updatedProduct.sizes = String(row.sizes).split(',').map((s: string) => s.trim()).filter((s: string) => s.length > 0);
          if (row.isNew !== undefined) updatedProduct.isNew = row.isNew === 'Да' || row.isNew === true || row.isNew === 'true';
          if (row.isBestseller !== undefined) updatedProduct.isBestseller = row.isBestseller === 'Да' || row.isBestseller === true || row.isBestseller === 'true';
          if (row.barcode !== undefined) updatedProduct.barcode = row.barcode ? String(row.barcode) : undefined;
          if (row.wildberriesUrl !== undefined) updatedProduct.wildberriesUrl = row.wildberriesUrl ? String(row.wildberriesUrl) : undefined;
          if (row.ozonUrl !== undefined) updatedProduct.ozonUrl = row.ozonUrl ? String(row.ozonUrl) : undefined;
          if (row.avitoUrl !== undefined) updatedProduct.avitoUrl = row.avitoUrl ? String(row.avitoUrl) : undefined;
          if (row.stockQuantity !== undefined && !isNaN(Number(row.stockQuantity))) {
            updatedProduct.stockQuantity = Number(row.stockQuantity);
          }
          if (row.material !== undefined) updatedProduct.material = row.material ? String(row.material) : undefined;
          if (row.modelName !== undefined) updatedProduct.modelName = row.modelName ? String(row.modelName) : undefined;
          
          // Add new category if needed
          if (updatedProduct.category && !existingCategories.includes(updatedProduct.category)) {
            console.log(`Adding new category: ${updatedProduct.category}`);
            await addCategory(updatedProduct.category);
            existingCategories.push(updatedProduct.category); // Update our local cache
          }
          
          // Update the product in the database
          console.log(`Updating product: ${updatedProduct.title}`);
          // const updateResult = await addOrUpdateProductInSupabase(updatedProduct); // This line was removed
          
          // if (updateResult.success) { // This line was removed
            console.log(`Successfully updated product: ${updatedProduct.title}`);
            return { type: 'updated' };
          // } else { // This line was removed
            // console.error(`Failed to update product: ${updatedProduct.title}`, updateResult.error); // This line was removed
            // return { type: 'failed', error: `Строка ${rowNum}: ошибка обновления товара: ${updateResult.error}` }; // This line was removed
          // } // This line was removed
        } catch (err: any) {
          console.error(`Error processing row ${rowNum}:`, err);
          return { type: 'failed', error: `Строка ${rowNum}: ошибка обработки данных: ${err.message || "Неизвестная ошибка"}` };
        }
      });
      
      const batchResults = await Promise.all(batchPromises);
      
      // Aggregate results
      batchResults.forEach(batchResult => {
        if (batchResult.type === 'updated') {
          result.updated++;
        } else if (batchResult.type === 'notFound') {
          result.notFound++;
          if (batchResult.error) result.errors.push(batchResult.error);
        } else if (batchResult.type === 'failed') {
          result.failed++;
          if (batchResult.error) result.errors.push(batchResult.error);
        }
      });
    }
    
    console.log(`Update complete. Results: ${JSON.stringify(result)}`);
    
    return result;
  } catch (err: any) {
    console.error("Error processing Excel update:", err);
    throw new Error(`Ошибка обновления товаров: ${err.message || "Неизвестная ошибка"}`);
  }
};
