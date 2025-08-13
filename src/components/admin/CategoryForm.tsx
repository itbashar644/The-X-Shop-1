
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import { toast } from "sonner";

interface CategoryFormProps {
  categories: string[];
  onAddCategory: (category: string) => void;
}

const CategoryForm: React.FC<CategoryFormProps> = ({ categories, onAddCategory }) => {
  const [newCategory, setNewCategory] = useState<string>("");

  const handleAddCategory = () => {
    if (newCategory.trim()) {
      if (categories.includes(newCategory.trim())) {
        toast("Ошибка", {
          description: "Такая категория уже существует",
        });
      } else {
        onAddCategory(newCategory.trim());
        setNewCategory("");
      }
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <Input
        placeholder="Название новой категории"
        value={newCategory}
        onChange={(e) => setNewCategory(e.target.value)}
        className="max-w-sm"
      />
      <Button onClick={handleAddCategory}>
        <Plus className="h-4 w-4 mr-2" /> Добавить
      </Button>
    </div>
  );
};

export default CategoryForm;
