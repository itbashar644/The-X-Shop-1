
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { 
  getAllCategories,
  getCategoryObjects, 
  addCategory, 
  removeCategory,
  getCategoryProducts,
  updateProductsCategory,
  updateCategoryImage,
  Category
} from "@/data/products";
import CategoryForm from "./CategoryForm";
import CategoryList from "./CategoryList";
import CategoryMoveDialog from "./CategoryMoveDialog";

const CategoryManager = () => {
  const [categories, setCategories] = useState<string[]>([]);
  const [categoryObjects, setCategoryObjects] = useState<Category[]>([]);
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);
  const [targetCategory, setTargetCategory] = useState<string>("");
  const [showMoveDialog, setShowMoveDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setIsLoading(true);
      const allCategories = await getAllCategories();
      const categoryObjs = await getCategoryObjects();
      
      setCategories(allCategories);
      setCategoryObjects(categoryObjs);
      
      console.log("Loaded categories:", allCategories);
      console.log("Category objects:", categoryObjs);
    } catch (error) {
      console.error("Ошибка при загрузке категорий:", error);
      toast.error("Ошибка при загрузке категорий", {
        description: "Пожалуйста, попробуйте позже"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddCategory = async (newCategory: string) => {
    try {
      setIsLoading(true);
      await addCategory(newCategory);
      await loadCategories();
      toast("Категория добавлена", {
        description: `Категория "${newCategory}" была успешно добавлена`,
      });
    } catch (error) {
      console.error("Ошибка при добавлении категории:", error);
      toast.error("Ошибка при добавлении категории", {
        description: "Пожалуйста, попробуйте позже"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateCategoryImage = async (categoryName: string, imageUrl: string) => {
    try {
      setIsLoading(true);
      await updateCategoryImage(categoryName, imageUrl);
      await loadCategories();
      toast("Изображение обновлено", {
        description: `Изображение для категории "${categoryName}" было успешно обновлено`,
      });
    } catch (error) {
      console.error("Ошибка при обновлении изображения категории:", error);
      toast.error("Ошибка при обновлении изображения", {
        description: "Пожалуйста, попробуйте позже"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAttempt = async (category: string) => {
    setCategoryToDelete(category);
    
    try {
      // Проверяем, есть ли продукты в этой категории
      setIsLoading(true);
      const productsInCategory = await getCategoryProducts(category);
      setIsLoading(false);
      
      if (productsInCategory.length > 0) {
        // Если есть продукты, предложим переместить их в другую категорию
        setShowMoveDialog(true);
      } else {
        // Если нет продуктов, удаляем категорию
        const success = await removeCategory(category);
        if (success) {
          toast("Категория удалена", {
            description: `Категория "${category}" была успешно удалена`,
          });
        } else {
          toast.error("Ошибка", {
            description: "Не удалось удалить категорию",
          });
        }
        setCategoryToDelete(null);
        await loadCategories();
      }
    } catch (error) {
      console.error("Ошибка при удалении категории:", error);
      setIsLoading(false);
      toast.error("Ошибка при удалении категории", {
        description: "Пожалуйста, попробуйте позже"
      });
    }
  };

  const handleMoveProducts = async () => {
    if (categoryToDelete && targetCategory) {
      try {
        setIsLoading(true);
        // Перемещаем продукты из удаляемой категории в выбранную
        await updateProductsCategory(categoryToDelete, targetCategory);
        
        toast("Категория удалена", {
          description: `Продукты перемещены в категорию "${targetCategory}" и категория "${categoryToDelete}" удалена`,
        });
        
        setCategoryToDelete(null);
        setShowMoveDialog(false);
        setTargetCategory("");
        await loadCategories();
      } catch (error) {
        console.error("Ошибка при перемещении продуктов:", error);
        toast.error("Ошибка при перемещении продуктов", {
          description: "Пожалуйста, попробуйте позже"
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleCancelMove = () => {
    setShowMoveDialog(false);
    setCategoryToDelete(null);
    setTargetCategory("");
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6 flex justify-center items-center min-h-[300px]">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Управление категориями</CardTitle>
        <CardDescription>
          Добавляйте, удаляйте и редактируйте категории товаров
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <CategoryForm 
          categories={categories} 
          onAddCategory={handleAddCategory} 
        />

        <CategoryList 
          categories={categoryObjects} 
          onDeleteAttempt={handleDeleteAttempt} 
          onUpdateImage={handleUpdateCategoryImage}
        />

        <CategoryMoveDialog
          open={showMoveDialog}
          onOpenChange={setShowMoveDialog}
          categoryToDelete={categoryToDelete}
          categories={categories}
          targetCategory={targetCategory}
          onTargetCategoryChange={setTargetCategory}
          onMoveProducts={handleMoveProducts}
          onCancel={handleCancelMove}
        />
      </CardContent>
    </Card>
  );
};

export default CategoryManager;
