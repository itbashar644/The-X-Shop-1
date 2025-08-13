
import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { exportProductsToExcel } from "@/utils/excelUtils";
import { Product } from "@/types/product";
import { Download, ChevronDown, BarChart as BarChartIcon } from "lucide-react";
import { toast } from "sonner";
import { formatPrice } from "@/lib/Image-utils";

const AdminReports = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [reportType, setReportType] = useState("category");
  const [timeframe, setTimeframe] = useState("all");

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        // Все импорты и обращения к supabase и supabase-файлам удалены. Если функционал больше не нужен — удалить/закомментировать соответствующий код.
        // const allProducts = await fetchProductsFromSupabase(true);
        // setProducts(allProducts);
      } catch (error) {
        console.error("Error loading products for reports:", error);
        toast.error("Не удалось загрузить данные для отчетов");
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // Generate chart data based on the selected report type
  const generateChartData = () => {
    if (!products || products.length === 0) return [];

    if (reportType === "category") {
      // Aggregate products by category
      const categoryCounts: Record<string, number> = {};
      products.forEach(product => {
        if (!product.archived) {
          const category = product.category;
          categoryCounts[category] = (categoryCounts[category] || 0) + 1;
        }
      });

      return Object.entries(categoryCounts)
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value);
    } 
    else if (reportType === "price") {
      // Create price ranges
      const priceRanges = [
        { range: "0-1000", min: 0, max: 1000, count: 0 },
        { range: "1001-3000", min: 1001, max: 3000, count: 0 },
        { range: "3001-5000", min: 3001, max: 5000, count: 0 },
        { range: "5001-10000", min: 5001, max: 10000, count: 0 },
        { range: "10000+", min: 10001, max: Infinity, count: 0 },
      ];

      products.forEach(product => {
        if (!product.archived) {
          const price = product.price;
          const range = priceRanges.find(r => price >= r.min && price <= r.max);
          if (range) range.count++;
        }
      });

      return priceRanges.map(r => ({ name: r.range, value: r.count }));
    }
    else if (reportType === "inStock") {
      // Count in stock vs out of stock products
      const inStockCount = products.filter(p => !p.archived && p.inStock).length;
      const outOfStockCount = products.filter(p => !p.archived && !p.inStock).length;
      
      return [
        { name: "В наличии", value: inStockCount },
        { name: "Нет в наличии", value: outOfStockCount }
      ];
    }
    else if (reportType === "country") {
      // Aggregate products by country of origin
      const countryCounts: Record<string, number> = {};
      products.forEach(product => {
        if (!product.archived) {
          const country = product.countryOfOrigin || "Неизвестно";
          countryCounts[country] = (countryCounts[country] || 0) + 1;
        }
      });

      return Object.entries(countryCounts)
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value);
    }
    
    return [];
  };

  const chartData = generateChartData();

  // Count statistics
  const totalActiveProducts = products.filter(p => !p.archived).length;
  const totalArchivedProducts = products.filter(p => p.archived).length;
  const totalCategories = new Set(products.map(p => p.category)).size;

  const handleExportClicked = async () => {
    try {
      await exportProductsToExcel(products);
      toast.success("Экспорт Excel успешно выполнен");
    } catch (error) {
      console.error("Error exporting products to Excel:", error);
      toast.error("Ошибка при экспорте отчета");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Отчеты</h2>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Активные товары</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{totalActiveProducts}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Архивировано товаров</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{totalArchivedProducts}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Категории</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{totalCategories}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <span>Аналитика товаров</span>
            <Button variant="outline" onClick={handleExportClicked}>
              <Download className="mr-2 h-4 w-4" /> Экспорт в Excel
            </Button>
          </CardTitle>
          <CardDescription>
            Анализ товаров по различным параметрам
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1">
                <label className="text-sm font-medium mb-2 block">Тип отчета</label>
                <Select value={reportType} onValueChange={setReportType}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Выберите тип отчета" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="category">По категориям</SelectItem>
                    <SelectItem value="price">По ценовым диапазонам</SelectItem>
                    <SelectItem value="inStock">Наличие товаров</SelectItem>
                    <SelectItem value="country">По странам производства</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex-1">
                <label className="text-sm font-medium mb-2 block">Временной период</label>
                <Select value={timeframe} onValueChange={setTimeframe}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Выберите период" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Все время</SelectItem>
                    <SelectItem value="month">Этот месяц</SelectItem>
                    <SelectItem value="quarter">Этот квартал</SelectItem>
                    <SelectItem value="year">Этот год</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {isLoading ? (
              <div className="h-[400px] w-full flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            ) : chartData.length > 0 ? (
              <div className="h-[400px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={chartData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" angle={-45} textAnchor="end" height={70} />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="value" name="Количество" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-[400px] w-full flex items-center justify-center text-muted-foreground">
                <p>Нет данных для отображения</p>
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="text-muted-foreground text-sm">
          {reportType === 'category' && "Распределение товаров по категориям"}
          {reportType === 'price' && "Распределение товаров по ценовым диапазонам"}
          {reportType === 'inStock' && "Соотношение товаров в наличии и отсутствующих"}
          {reportType === 'country' && "Распределение товаров по странам происхождения"}
        </CardFooter>
      </Card>
    </div>
  );
};

export default AdminReports;
