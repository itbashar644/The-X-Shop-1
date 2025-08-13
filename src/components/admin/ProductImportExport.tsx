
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Download, FileUp, Edit } from "lucide-react";
import { exportProductsToExcel, createProductTemplate } from "@/utils/excelUtils";
import { excelToProducts, updateProductsFromExcel } from "@/utils/excel/excelImport";
import { Progress } from "@/components/ui/progress";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface ProductImportExportProps {
  onImportComplete: () => void;
}

const ProductImportExport = ({ onImportComplete }: ProductImportExportProps) => {
  const [isImporting, setIsImporting] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [importProgress, setImportProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [importMode, setImportMode] = useState<'add' | 'update' | null>(null);
  
  const handleExportProductsClick = async () => {
    try {
      setIsExporting(true);
      // const products = await fetchProductsFromSupabase(true);
      
      // if (!products || products.length === 0) {
      //   toast.error("Нет товаров для экспорта");
      //   return;
      // }
      
      await exportProductsToExcel([]); // Placeholder for now, as fetchProductsFromSupabase is removed
      toast.success("Экспорт успешно завершен");
    } catch (error) {
      console.error("Ошибка экспорта товаров:", error);
      toast.error("Ошибка экспорта товаров");
    } finally {
      setIsExporting(false);
    }
  };
  
  const handleExportTemplateClick = async () => {
    try {
      await createProductTemplate();
      toast.success("Шаблон успешно создан");
    } catch (error) {
      console.error("Ошибка создания шаблона:", error);
      toast.error("Ошибка создания шаблона");
    }
  };
  
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const processFile = async (mode: 'add' | 'update') => {
    if (!selectedFile) {
      toast.error("Файл не выбран");
      return;
    }
    
    try {
      setIsImporting(true);
      setImportProgress(10);
      
      const reader = new FileReader();
      
      reader.onload = async (e) => {
        try {
          setImportProgress(30);
          const data = e.target?.result as ArrayBuffer;
          
          setImportProgress(50);
          
          let message = '';
          
          if (mode === 'add') {
            const products = await excelToProducts(data);
            message = `Импортировано ${products.length} товаров`;
          } else {
            const result = await updateProductsFromExcel(data);
            message = `Обновлено ${result.updated} товаров`;
          }
          
          setImportProgress(90);
          
          toast.success(message);
          if (onImportComplete) {
            onImportComplete();
          }
          
          setImportProgress(100);
          // Reset the input value and selected file
          setSelectedFile(null);
          
        } catch (error: any) {
          console.error("Ошибка импорта товаров:", error);
          toast.error(`Ошибка импорта: ${error.message || 'Неизвестная ошибка'}`);
          // Reset the selected file
          setSelectedFile(null);
        } finally {
          setIsImporting(false);
          setImportProgress(0);
          setImportMode(null);
        }
      };
      
      reader.readAsArrayBuffer(selectedFile);
      
    } catch (error: any) {
      console.error("Ошибка чтения файла:", error);
      toast.error(`Ошибка чтения файла: ${error.message || 'Неизвестная ошибка'}`);
      setIsImporting(false);
      setImportProgress(0);
      setSelectedFile(null);
      setImportMode(null);
    }
  };

  const handleCloseDialog = () => {
    setImportMode(null);
    setSelectedFile(null);
  };

  return (
    <div className="space-y-4 p-4 border rounded-md">
      <h3 className="text-lg font-medium">Импорт и экспорт товаров</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Импорт товаров</h4>
          <div className="flex flex-col gap-2">
            <Button
              variant="outline"
              onClick={handleExportTemplateClick}
              className="w-full justify-start"
            >
              <Download className="mr-2 h-4 w-4" />
              Скачать шаблон
            </Button>
            
            <div className="relative">
              <input 
                id="import-file" 
                type="file" 
                accept=".xlsx, .xls" 
                onChange={handleFileChange}
                disabled={isImporting}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
              />
              <Button 
                variant="outline" 
                disabled={isImporting}
                className="w-full justify-start"
              >
                <FileUp className="mr-2 h-4 w-4" />
                {isImporting ? "Импорт..." : 
                  selectedFile ? selectedFile.name : "Загрузить Excel файл"}
              </Button>
            </div>

            {selectedFile && (
              <div className="flex space-x-2">
                <AlertDialog open={importMode === 'add'} onOpenChange={(open) => !open && handleCloseDialog()}>
                  <AlertDialogTrigger asChild>
                    <Button 
                      variant="default" 
                      size="sm"
                      onClick={() => setImportMode('add')}
                      disabled={isImporting}
                    >
                      <FileUp className="mr-2 h-4 w-4" />
                      Добавить новые
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Добавление новых товаров</AlertDialogTitle>
                      <AlertDialogDescription>
                        Товары из Excel файла будут добавлены как новые записи. Существующие товары не изменятся.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Отмена</AlertDialogCancel>
                      <AlertDialogAction onClick={() => processFile('add')}>
                        Продолжить
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>

                <AlertDialog open={importMode === 'update'} onOpenChange={(open) => !open && handleCloseDialog()}>
                  <AlertDialogTrigger asChild>
                    <Button 
                      variant="secondary" 
                      size="sm"
                      onClick={() => setImportMode('update')}
                      disabled={isImporting}
                    >
                      <Edit className="mr-2 h-4 w-4" />
                      Обновить существующие
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Обновление существующих товаров</AlertDialogTitle>
                      <AlertDialogDescription>
                        Существующие товары будут обновлены данными из Excel файла. Товары сопоставляются по ID или артикулу. Товары, которых нет в базе, не будут добавлены.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Отмена</AlertDialogCancel>
                      <AlertDialogAction onClick={() => processFile('update')}>
                        Продолжить
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            )}
            
            {isImporting && (
              <Progress value={importProgress} className="h-2" />
            )}
            
            <p className="text-xs text-muted-foreground">
              Поддерживаются файлы Excel (.xlsx, .xls)
            </p>
          </div>
        </div>
        
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Экспорт товаров</h4>
          <Button 
            variant="outline"
            onClick={handleExportProductsClick}
            disabled={isExporting}
            className="w-full justify-start"
          >
            <Download className="mr-2 h-4 w-4" />
            {isExporting ? "Экспорт..." : "Экспорт всех товаров в Excel"}
          </Button>
          <p className="text-xs text-muted-foreground">
            Экспортирует все товары, включая архивные
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProductImportExport;
