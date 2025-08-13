
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Key, Mail, ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { API_BASE_URL } from "@/types/variables";
import { FcGoogle } from "react-icons/fc";

const loginSchema = z.object({
  email: z.string().email("Введите корректный email"),
  password: z.string().min(6, "Пароль должен содержать минимум 6 символов"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const Login = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated, loading: isLoading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [isFormLoading, setIsFormLoading] = useState(false);
  
  // Google OAuth: если есть token в query, логиним
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    if (token) {
      localStorage.setItem('auth_token', token);
      navigate('/account', { replace: true });
    }
  }, [navigate]);

  // Check if already authenticated and redirect if needed
  useEffect(() => {
    // Wait for auth to finish loading before redirecting
    if (!isLoading && isAuthenticated) {
      navigate('/account', { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate]);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Helper function to extract error message
  const getErrorMessage = (error: string | { message?: string } | undefined): string => {
    if (typeof error === 'string') {
      return error;
    } else if (error && typeof error === 'object' && 'message' in error) {
      return error.message || "Неизвестная ошибка";
    }
    return "Неизвестная ошибка";
  };

  const onSubmit = async (data: LoginFormValues) => {
    setIsFormLoading(true);
    try {
      const success = await login(data.email, data.password);
      if (success) {
        toast.success("Авторизация успешна", {
          description: "Вы успешно вошли в систему",
        });
        navigate('/account', { replace: true });
      } else {
        toast.error("Ошибка авторизации", {
          description: "Неверный email или пароль",
        });
      }
    } catch (error: any) {
      toast.error("Ошибка авторизации", {
        description: error.message || "Произошла ошибка при входе в систему",
      });
    } finally {
      setIsFormLoading(false);
    }
  };

  // Show loading while auth is being checked
  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Проверка авторизации...</p>
          <p className="text-xs text-muted-foreground mt-1">The X Shop</p>
        </div>
      </div>
    );
  }

  // If already authenticated, don't render the login form
  if (isAuthenticated) {
    return null;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <div className="flex-grow container max-w-md mx-auto px-4 py-8">
        <Card>
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl font-bold">Вход в аккаунт</CardTitle>
            <CardDescription>
              Введите ваши учетные данные для входа
            </CardDescription>
          </CardHeader>
          
          <CardContent>
           
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input 
                            type="email" 
                            placeholder="Введите email" 
                            className="pl-10" 
                            disabled={isFormLoading}
                            {...field} 
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center justify-between">
                        <FormLabel>Пароль</FormLabel>
                        <Link to="/forgot-password" className="text-sm text-primary hover:underline">
                          Забыли пароль?
                        </Link>
                      </div>
                      <FormControl>
                        <div className="relative">
                          <Key className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            type={showPassword ? "text" : "password"}
                            placeholder="Введите пароль"
                            className="pl-10"
                            disabled={isFormLoading}
                            {...field}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute right-2 top-1/2 transform -translate-y-1/2"
                            onClick={() => setShowPassword(!showPassword)}
                            disabled={isFormLoading}
                          >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button type="submit" className="w-full" disabled={isFormLoading}>
                  {isFormLoading ? "Вход..." : (
                    <>
                      Войти <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </form>
            </Form>
            
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <Separator />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                  <Button
                    type="button"
                    className="w-full mb-6 flex items-center justify-center gap-2 bg-white border border-gray-300 text-gray-800 hover:bg-gray-50 shadow-sm text-base font-medium"
                    onClick={() => { window.location.href = `${API_BASE_URL}/auth/google`; }}
                  >
                    <FcGoogle className="w-6 h-6" /> Войти через Google
                  </Button>

              </div>
            </div>
            
            <div className="grid grid-cols-1 gap-4">
              {/* Removed social login buttons as per edit hint */}
            </div>
          </CardContent>
          
          <CardFooter className="flex flex-col space-y-4 mt-2">
            <div className="text-center text-sm">
              <p className="text-muted-foreground">
                Ещё нет аккаунта?{" "}
                <Link to="/register" className="text-primary hover:underline">
                  Зарегистрироваться
                </Link>
              </p>
            </div>
          </CardFooter>
        </Card>
      </div>
      
      <Footer />
    </div>
  );
};

export default Login;
