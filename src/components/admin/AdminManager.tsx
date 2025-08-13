import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import AdminActions from './AdminActions';
import AdminSearchResult from './AdminSearchResult';
import useAdminStatus from '@/hooks/useAdminStatus';
import { useAuth } from '@/context/AuthContext';

interface BackendUser {
  id: string | number;
  email: string;
  name?: string;
  roles?: string[];
}

const AdminManager = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchResult, setSearchResult] = useState<{
    email: string;
    isAdmin: boolean;
    id: string;
  } | null>(null);

  const { user } = useAuth();
  const { isSuperAdmin } = useAdminStatus({
    ...user,
    id: String(user.id),
    name: user.name ?? ''
  });

  const checkUserExistsAndIsAdmin = async (email: string): Promise<BackendUser | null> => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/users?email=${encodeURIComponent(email)}`);
      if (!res.ok) {
        setSearchResult(null);
        toast.error('Пользователь с таким email не найден');
        return null;
      }
      const user: BackendUser = await res.json();

      setSearchResult({
        email: user.email,
        isAdmin: user.roles?.includes('admin') ?? false,
        id: String(user.id)
      });

      return user;
    } catch (error) {
      console.error('Ошибка при проверке пользователя:', error);
      toast.error('Ошибка при проверке пользователя');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const handleAddAdmin = async () => {
    if (!isSuperAdmin) {
      toast.error('Только супер-администраторы могут управлять администраторами');
      return;
    }

    setLoading(true);
    try {
      const user = await checkUserExistsAndIsAdmin(email);
      if (!user) return;

      if (searchResult?.isAdmin) {
        toast.info('Пользователь уже является администратором');
        return;
      }

      const res = await fetch(`/api/admin/users/${user.id}/roles`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: 'admin' })
      });

      if (!res.ok) {
        toast.error('Ошибка при назначении прав администратора');
        return;
      }

      toast.success('Права администратора успешно предоставлены');
      setSearchResult({ ...searchResult!, isAdmin: true });

    } catch (error) {
      console.error('Ошибка при назначении прав администратора:', error);
      toast.error('Ошибка при назначении прав администратора');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveAdmin = async () => {
    if (!isSuperAdmin) {
      toast.error('Только супер-администраторы могут управлять администраторами');
      return;
    }

    setLoading(true);
    try {
      const user = await checkUserExistsAndIsAdmin(email);
      if (!user) return;

      if (!searchResult?.isAdmin) {
        toast.info('Пользователь не является администратором');
        return;
      }

      if (
        email === 'halafbashar@gmail.com' ||
        email === 'vipregitrator@gmail.com'
      ) {
        toast.error('Невозможно лишить прав администратора учетную запись основателя');
        return;
      }

      const res = await fetch(`/api/admin/users/${user.id}/roles`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: 'admin' })
      });

      if (!res.ok) {
        toast.error('Ошибка при удалении прав администратора');
        return;
      }

      toast.success('Права администратора успешно удалены');
      setSearchResult({ ...searchResult!, isAdmin: false });

    } catch (error) {
      console.error('Ошибка при удалении прав администратора:', error);
      toast.error('Ошибка при удалении прав администратора');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (email) await checkUserExistsAndIsAdmin(email);
  };

  const handleClear = () => {
    setEmail('');
    setSearchResult(null);
  };

  useEffect(() => {
    if (email) {
      const delay = setTimeout(() => {
        handleSearch();
      }, 500);
      return () => clearTimeout(delay);
    } else {
      setSearchResult(null);
    }
  }, [email]);

  if (!isSuperAdmin) {
    return (
      <Card>
        <CardContent className="p-6">
          <p>У вас недостаточно прав для управления администраторами.</p>
          <p className="text-sm text-muted-foreground mt-2">
            Эта функция доступна только для супер-администраторов.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="space-y-6 p-6">
        <div>
          <h2 className="text-xl font-semibold mb-2">Управление администраторами</h2>
          <p className="text-sm text-muted-foreground">
            Добавляйте или удаляйте администраторов системы
          </p>
        </div>

        <AdminActions
          email={email}
          setEmail={setEmail}
          loading={loading}
          onAddAdmin={handleAddAdmin}
          onRemoveAdmin={handleRemoveAdmin}
        />

        {searchResult && (
          <div className="mt-4">
            <h3 className="text-md font-medium mb-2">Результат поиска:</h3>
            <AdminSearchResult
              result={searchResult}
              onSearch={handleSearch}
              onClear={handleClear}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AdminManager;
