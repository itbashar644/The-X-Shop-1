import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Helmet } from 'react-helmet-async';
import { Settings } from 'lucide-react';
import AdminManager from '@/components/admin/AdminManager';
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import useAdminStatus from "@/hooks/useAdminStatus";

const AdminSettings = () => {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { hasRole, profile } = useAuth();

  const { isSuperAdmin } = useAdminStatus(
    profile?.id && profile?.email
      ? {
          ...profile,
          id: String(profile.id),
          name: profile.name ?? "Админ", // добавлено имя по умолчанию
        }
      : undefined
  );

  useEffect(() => {
    const checkAdminAccess = async () => {
      try {
        const isAdmin = await hasRole('admin');
        setIsAuthorized(isAdmin);
        if (!isAdmin) {
          toast.error("У вас нет прав для доступа к этой странице");
        }
      } catch (error) {
        console.error("Error checking admin access:", error);
        toast.error("Ошибка при проверке прав доступа");
      } finally {
        setIsLoading(false);
      }
    };

    checkAdminAccess();
  }, [hasRole]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthorized) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center justify-center p-6">
              <Settings className="h-12 w-12 text-muted-foreground mb-4" />
              <h2 className="text-xl font-semibold">Доступ запрещен</h2>
              <p className="text-center text-muted-foreground mt-2">
                У вас нет прав для доступа к настройкам администратора
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Helmet>
        <title>Settings | Admin Panel</title>
      </Helmet>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold md:text-2xl">Настройки администратора</h1>
          <p className="text-muted-foreground">
            Управление системными настройками и правами пользователей
          </p>
        </div>
        <Settings className="h-8 w-8 text-muted-foreground" />
      </div>

      <div className="grid gap-6">
        <AdminManager />
      </div>
    </div>
  );
};

export default AdminSettings;
