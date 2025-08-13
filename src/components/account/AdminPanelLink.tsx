
import React, { useEffect } from "react";
import { Link } from 'react-router-dom';
import { Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const AdminPanelLink: React.FC = () => {
  const { hasRole } = useAuth();
  const [isAdmin, setIsAdmin] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const checkAdminRole = async () => {
      setIsLoading(true);
      try {
        const hasAdminRole = await hasRole('admin');
        const hasEditorRole = await hasRole('editor');
        setIsAdmin(hasAdminRole || hasEditorRole);
      } catch (error) {
        console.error('Error checking admin role:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAdminRole();
  }, [hasRole]);

  if (isLoading) {
    return null;
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <Card className="mb-6">
      <CardHeader className="pb-3">
        <CardTitle>Администрирование</CardTitle>
        <CardDescription>
          У вас есть доступ к панели администратора
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button asChild className="w-full" variant="default">
          <Link to="/admin" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Перейти в панель администратора
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
};

export default AdminPanelLink;
