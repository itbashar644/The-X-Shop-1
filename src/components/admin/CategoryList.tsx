
import React from "react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Trash2 } from "lucide-react";
import { Category } from "@/data/products";
import ImageUploader from "@/components/admin/ImageUploader";

interface CategoryListProps {
  categories: Category[];
  onDeleteAttempt: (category: string) => void;
  onUpdateImage: (category: string, imageUrl: string) => void;
}

const CategoryList: React.FC<CategoryListProps> = ({ 
  categories, 
  onDeleteAttempt,
  onUpdateImage
}) => {
  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[250px]">Название</TableHead>
            <TableHead>Изображение</TableHead>
            <TableHead className="text-right w-[120px]">Действия</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {categories.length === 0 ? (
            <TableRow>
              <TableCell colSpan={3} className="text-center text-muted-foreground h-24">
                Нет категорий
              </TableCell>
            </TableRow>
          ) : (
            categories.map((category) => (
              <TableRow key={category.name}>
                <TableCell className="font-medium">{category.name}</TableCell>
                <TableCell className="max-w-[500px]">
                  <div className="flex flex-col gap-2">
                    <div className="h-20 w-20 overflow-hidden border rounded-md">
                      {category.imageUrl && (
                        <img 
                          src={category.imageUrl} 
                          alt={category.name}
                          className="h-full w-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = "/placeholder.svg";
                          }}
                        />
                      )}
                    </div>
                    <ImageUploader
                      initialImageUrl={category.imageUrl}
                      onImageUploaded={(url) => onUpdateImage(category.name, url)}
                    />
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onDeleteAttempt(category.name)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default CategoryList;
