
import { Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";
import AdminAuth from "@/components/admin/AdminAuth";
import AdminDashboard from "./AdminDashboard";
import AdminProducts from "./AdminProducts";
import AdminOrders from "./AdminOrders";
import AdminCustomers from "./AdminCustomers";
import AdminCategories from "./AdminCategories";
import AdminSettings from "./AdminSettings";
import AdminReports from "./AdminReports";
import AdminCustomerChat from "./AdminCustomerChat";
import { NewsletterManager } from "@/components/admin/marketing/NewsletterManager";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/Image-utils";
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar";

const AdminPanel = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigation = [
    { name: 'Дашборд', href: '/admin/dashboard', current: false },
    { name: 'Товары', href: '/admin/products', current: false },
    { name: 'Заказы', href: '/admin/orders', current: false },
    { name: 'Клиенты', href: '/admin/customers', current: false },
    { name: 'Категории', href: '/admin/categories', current: false },
    { name: 'Рассылка', href: '/admin/newsletter', current: false },
    { name: 'Отчеты', href: '/admin/reports', current: false },
    { name: 'Настройки', href: '/admin/settings', current: false },
  ];

  return (
    <AdminAuth>
      <div className="min-h-screen flex w-full">
        <SidebarProvider>
          {/* Desktop Sidebar */}
          <Sidebar className="hidden lg:flex">
            <SidebarHeader className="p-4 border-b">
              <h1 className="text-xl font-semibold text-gray-800">Админ-панель</h1>
            </SidebarHeader>
            <SidebarContent>
              <SidebarMenu className="p-2">
                {navigation.map((item) => (
                  <SidebarMenuItem key={item.name}>
                    <SidebarMenuButton asChild>
                      <a
                        href={item.href}
                        className="text-gray-600 hover:bg-gray-50 hover:text-gray-900 group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors"
                      >
                        {item.name}
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarContent>
          </Sidebar>

          {/* Mobile sidebar overlay */}
          {sidebarOpen && (
            <div 
              className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
          )}

          {/* Mobile Sidebar */}
          <div className={cn(
            "fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:hidden",
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          )}>
            <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200 flex-shrink-0">
              <h1 className="text-xl font-semibold text-gray-800">Админ-панель</h1>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarOpen(false)}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            
            <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
              {navigation.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-gray-600 hover:bg-gray-50 hover:text-gray-900 group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors"
                  onClick={() => setSidebarOpen(false)}
                >
                  {item.name}
                </a>
              ))}
            </nav>
          </div>

          {/* Main content area */}
          <SidebarInset className="flex-1 flex flex-col min-w-0 overflow-hidden">
            {/* Mobile header */}
            <div className="lg:hidden flex items-center justify-between h-16 px-4 bg-white border-b border-gray-200 flex-shrink-0">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="h-5 w-5" />
              </Button>
              <h1 className="text-lg font-semibold">Админ-панель</h1>
              <div className="w-8" />
            </div>

            {/* Content area */}
            <main className="flex-1 overflow-auto p-4 md:p-6 bg-gray-50">
              <div className="max-w-full mx-auto h-full">
                <Routes>
                  <Route index element={<Navigate to="dashboard" replace />} />
                  <Route path="dashboard" element={<AdminDashboard />} />
                  <Route path="products" element={<AdminProducts />} />
                  <Route path="orders" element={<AdminOrders />} />
                  <Route path="customers" element={<AdminCustomers />} />
                  <Route path="categories" element={<AdminCategories />} />
                  <Route path="newsletter" element={<NewsletterManager />} />
                  <Route path="reports" element={<AdminReports />} />
                  <Route path="settings" element={<AdminSettings />} />
                  <Route path="customer/chat/:id" element={<AdminCustomerChat />} />
                </Routes>
              </div>
            </main>
          </SidebarInset>
        </SidebarProvider>
      </div>
    </AdminAuth>
  );
};

export default AdminPanel;
