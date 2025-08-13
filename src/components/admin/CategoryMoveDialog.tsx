
import React from "react";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { ArrowRight } from "lucide-react";

interface CategoryMoveDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  categoryToDelete: string | null;
  categories: string[];
  targetCategory: string;
  onTargetCategoryChange: (value: string) => void;
  onMoveProducts: () => void;
  onCancel: () => void;
}

const CategoryMoveDialog: React.FC<CategoryMoveDialogProps> = ({
  open,
  onOpenChange,
  categoryToDelete,
  categories,
  targetCategory,
  onTargetCategoryChange,
  onMoveProducts,
  onCancel,
}) => {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Переместить товары
          </AlertDialogTitle>
          <AlertDialogDescription>
            В категории "{categoryToDelete}" есть товары. Выберите категорию, в которую хотите переместить эти товары.
          </AlertDialogDescription>
        </AlertDialogHeader>
        
        <div className="flex items-center space-x-2 my-4">
          <div className="flex-1 text-center font-medium">{categoryToDelete}</div>
          <ArrowRight className="h-4 w-4 text-muted-foreground" />
          <div className="flex-1">
            <Select
              value={targetCategory}
              onValueChange={onTargetCategoryChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Выберите категорию" />
              </SelectTrigger>
              <SelectContent>
                {categories
                  .filter((cat) => cat !== categoryToDelete)
                  .map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onCancel}>
            Отмена
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onMoveProducts}
            disabled={!targetCategory}
          >
            Переместить и удалить
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default CategoryMoveDialog;
