import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { LockIcon, User, ArrowRight } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setIsLoading] = useState(false);
  const [isCheckingAdmin, setIsCheckingAdmin] = useState(true);
  const navigate = useNavigate();
  const { isAuthenticated, hasRole, login } = useAuth();

  useEffect(() => {
    const checkAdminAccess = async () => {
      if (isAuthenticated) {
        try {
          const isAdmin = await hasRole('admin');
          if (isAdmin) {
            navigate('/admin', { replace: true });
            return;
          }
        } catch (error) {
          console.error("Error checking admin role:", error);
        }
      }
      setIsCheckingAdmin(false);
    };

    checkAdminAccess();
  }, [isAuthenticated, hasRole, navigate]);

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await login(email, password);

      if (!result) {
        toast.error("Ошибка авторизации", {
          description: "Неверный email или пароль",
        });
        setIsLoading(false);
        return;
      }

      const isAdmin = await hasRole('admin');

      if (isAdmin) {
        toast.success("Авторизация успешна", {
          description: "Добро пожаловать в административную панель",
        });

        setTimeout(() => {
          navigate('/admin');
        }, 500);
      } else {
        toast.error("Ошибка авторизации", {
          description: "У вас нет прав доступа к админ-панели",
        });
        setIsLoading(false);
      }
    } catch (error: any) {
      console.error("Login error:", error);
      toast.error("Ошибка авторизации", {
        description: error.message || "Произошла ошибка при входе в систему",
      });
      setIsLoading(false);
    }
  };

  if (isCheckingAdmin) {
    return (
      <div className="flex min-h-screen bg-gray-50 items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Проверка авторизации...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50 items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
              <LockIcon className="w-8 h-8 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-center">Вход в админ-панель</CardTitle>
          <CardDescription className="text-center">
            Введите свои учетные данные для доступа к административной панели
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <User className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@example.com"
                  className="pl-10"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label htmlFor="password">Пароль</Label>
                <Link to="/forgot-password" className="text-sm text-primary hover:underline">
                  Забыли пароль?
                </Link>
              </div>
              <div className="relative">
                <LockIcon className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  className="pl-10"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
            </div>
            <Button
              type="submit"
              className="w-full"
              disabled={loading}
            >
              {loading ? (
                "Проверка..."
              ) : (
                <>
                  Войти <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </form>
          <div className="mt-4 text-center text-sm text-muted-foreground">
            <p>Доступ только для администраторов системы</p>
          </div>
        </CardContent>
        <CardFooter className="border-t pt-4">
          <Button variant="outline" className="w-full" asChild>
            <Link to="/">Вернуться на главную страницу</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default AdminLogin;
