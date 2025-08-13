
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Plus } from "lucide-react";
 
import { Product } from "@/types/product";
import ProductForm from "@/components/admin/ProductForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProductTabContent from "@/components/admin/products/ProductTabContent";

import {
  fetchProductsFromPostgres,
  addOrUpdateProduct,
  deleteProduct,
  archiveProduct,
  bulkDeleteProducts,
  bulkArchiveProducts,
  mergeProductsByModelName
} from '@/data/products/postgres/productApi';
import {
  fetchCategoriesFromPostgres
} from '@/data/products/postgres/categoryApi';

interface Order {
  id: string;
  customer_name: string;
  customer_email: string;
  total: number;
  status: string;
  created_at: string;
}



const AdminProducts = () => {

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  


  const [productsList, setProductsList] = useState<Product[]>([]);
  const [activeTab, setActiveTab] = useState<string>("active");
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

 

  // Default product state for new products
  const defaultProduct: Partial<Product> = {
    title: "",
    description: "",
    price: 0,
    category: "",
    imageUrl: "/placeholder.svg",
    additionalImages: [],
    rating: 5,
    inStock: true,
    countryOfOrigin: "Россия",
    articleNumber: "",
    barcode: "",
    colors: [],
    videoUrl: "",
    videoType: "mp4",
    archived: false,
    modelName: "", // Add modelName field to default product
  };

  // Загрузка товаров и категорий при монтировании
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const products = await fetchProductsFromPostgres();
 
        setProductsList(products);
        const categoriesData = await fetchCategoriesFromPostgres();
        setCategories(categoriesData.map(cat => cat.name));
      } catch (error) {
        toast.error('Ошибка загрузки данных');
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  // Функция для обновления списка товаров и категорий
  async function refreshProductsList() {
    try {
      const allProducts = await fetchProductsFromPostgres();
  
      if (activeTab === 'active') {
        setProductsList(allProducts.filter(product => !product.archived));
      } else {
        setProductsList(allProducts.filter(product => product.archived));
      }
      const categoriesData = await fetchCategoriesFromPostgres();
      setCategories(categoriesData.map(cat => cat.name));
    } catch (error) {
      console.error('Ошибка обновления списка товаров:', error);
      toast.error('Ошибка загрузки данных', {
        description: error instanceof Error ? error.message : 'Неизвестная ошибка',
      });
    }
  }

  // Сохранение товара (добавление/редактирование)
  const handleSaveProduct = async (formData: Partial<Product>) => {
    setIsLoading(true);
    try {
      await addOrUpdateProduct(formData as Product);
      toast.success(formData.id ? 'Товар обновлен' : 'Товар добавлен');
      setShowForm(false);
      setEditingProduct(null);
      await refreshProductsList();
    } catch (error) {
      toast.error('Ошибка при сохранении товара', {
        description: error instanceof Error ? error.message : 'Неизвестная ошибка',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Архивировать товар
  const handleArchiveProduct = async (productId: string) => {
    setIsLoading(true);
    try {
      await archiveProduct(productId, true);
      toast.info('Товар архивирован');
      await refreshProductsList();
    } catch (error) {
      toast.error('Ошибка при архивировании товара');
    } finally {
      setIsLoading(false);
    }
  };

  // Восстановить товар из архива
  const handleRestoreProduct = async (productId: string) => {
    setIsLoading(true);
    try {
      await archiveProduct(productId, false);
      toast.success('Товар восстановлен');
      await refreshProductsList();
    } catch (error) {
      toast.error('Ошибка при восстановлении товара');
    } finally {
      setIsLoading(false);
    }
  };

  // Удалить товар навсегда
  const handleDeleteProduct = async (productId: string) => {
    setIsLoading(true);
    try {
      await deleteProduct(productId);
      toast('Товар удален', { description: 'Товар был удален навсегда' });
      await refreshProductsList();
    } catch (error) {
      toast.error('Ошибка при удалении товара');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleAddNewProduct = () => {
    setEditingProduct(null);
    setShowForm(true);
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setSearchTerm("");
    setCategoryFilter("all");
  };

  // Массовое удаление
  const handleBulkDelete = async (productIds: string[]) => {
    setIsLoading(true);
    try {
      const success = await bulkDeleteProducts(productIds);
      if (success) {
        toast.success('Товары удалены', {
          description: `${productIds.length} товаров было успешно удалено`,
        });
        await refreshProductsList();
      } else {
        toast.error('Ошибка при удалении товаров');
      }
    } catch (error) {
      toast.error('Ошибка при массовом удалении', {
        description: error instanceof Error ? error.message : 'Неизвестная ошибка',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Массовая архивация/восстановление
  const handleBulkArchive = async (productIds: string[]) => {
    setIsLoading(true);
    try {
      const archive = activeTab === 'active';
      const success = await bulkArchiveProducts(productIds, archive);
      if (success) {
        toast.success(archive ? 'Товары архивированы' : 'Товары восстановлены', {
          description: `${productIds.length} товаров было успешно ${archive ? 'архивировано' : 'восстановлено'}`,
        });
        await refreshProductsList();
      } else {
        toast.error(`Ошибка при ${archive ? 'архивации' : 'восстановлении'} товаров`);
      }
    } catch (error) {
      toast.error(`Ошибка при массовом ${activeTab === 'active' ? 'архивировании' : 'восстановлении'}`, {
        description: error instanceof Error ? error.message : 'Неизвестная ошибка',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Массовое объединение по modelName
  const handleBulkMerge = async (productIds: string[]) => {
    if (productIds.length < 2) {
      toast.error('Для объединения нужно выбрать минимум два товара');
      return;
    }
    setIsLoading(true);
    try {
      const success = await mergeProductsByModelName(productIds);
      if (success) {
        toast.success('Товары объединены', {
          description: `${productIds.length} товаров было успешно объединено в одну модель`,
        });
        await refreshProductsList();
      } else {
        toast.error('Ошибка при объединении товаров');
      }
    } catch (error) {
      toast.error('Ошибка при объединении товаров', {
        description: error instanceof Error ? error.message : 'Неизвестная ошибка',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Filter products based on search term and category
  const filteredProducts = productsList.filter((product) => {
    const matchesSearch = 
      product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (product.articleNumber && product.articleNumber.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (product.barcode && product.barcode.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (product.modelName && product.modelName.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesCategory = categoryFilter === "all" || product.category === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Управление товарами</h2>
        
        <Button onClick={handleAddNewProduct} disabled={activeTab === "archived" || isLoading}>
          <Plus className="mr-2 h-4 w-4" />
          Добавить товар
        </Button>
      </div>

      <Tabs defaultValue="active" value={activeTab} onValueChange={handleTabChange}>
        <TabsList className="grid grid-cols-2 w-[400px]">
          <TabsTrigger value="active">Активные товары</TabsTrigger>
          <TabsTrigger value="archived">Архив</TabsTrigger>
        </TabsList>
        
        <TabsContent value="active">
          <ProductTabContent
            products={filteredProducts}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            categoryFilter={categoryFilter}
            onCategoryChange={setCategoryFilter}
            categories={categories}
            onEdit={handleEditProduct}
            onDelete={handleArchiveProduct}
            onImportComplete={refreshProductsList}
            isLoading={isLoading}
            mode="active"
            deleteButtonText="Архивировать"
            deleteButtonColor="orange"
            onBulkDelete={handleBulkDelete}
            onBulkArchive={handleBulkArchive}
            onBulkMerge={handleBulkMerge}
          />
        </TabsContent>
        
        <TabsContent value="archived">
          <ProductTabContent
            products={filteredProducts}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            categoryFilter={categoryFilter}
            onCategoryChange={setCategoryFilter}
            categories={categories}
            onEdit={handleEditProduct}
            onDelete={handleRestoreProduct}
            onPermanentDelete={handleDeleteProduct}
            onImportComplete={refreshProductsList}
            isLoading={isLoading}
            mode="archived"
            deleteButtonText="Восстановить"
            deleteButtonColor="green"
            onBulkDelete={handleBulkDelete}
            onBulkArchive={handleBulkArchive}
          />
        </TabsContent>
      </Tabs>

      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingProduct ? "Редактировать товар" : "Добавить новый товар"}
            </DialogTitle>
            <DialogDescription>
              Заполните форму ниже. Поля, отмеченные звездочкой (*), обязательны для заполнения.
            </DialogDescription>
          </DialogHeader>
          
          <ProductForm 
            product={editingProduct || defaultProduct}
            categories={categories}
            onSave={handleSaveProduct}
            onCancel={() => setShowForm(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminProducts;