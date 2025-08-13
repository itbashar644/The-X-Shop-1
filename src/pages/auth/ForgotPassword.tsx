
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, ArrowLeft } from "lucide-react";

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
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { requestPasswordReset } from "@/services/passwordService";

const forgotPasswordSchema = z.object({
  email: z.string().email("Введите корректный email"),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: ForgotPasswordFormValues) => {
    setIsLoading(true);
    setError(null);
    try {
      await requestPasswordReset(data.email);
      setIsSuccess(true);
      form.reset();
    } catch (err: any) {
      setError(err.message || "Ошибка запроса");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <div className="flex-grow container max-w-md mx-auto px-4 py-8">
        <Card>
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl font-bold">Восстановление пароля</CardTitle>
            <CardDescription>
              {!isSuccess 
                ? "Введите email для получения инструкций по сбросу пароля"
                : "Проверьте вашу почту для получения инструкций по сбросу пароля"
              }
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            {!isSuccess ? (
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
                              disabled={isLoading}
                              {...field} 
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Отправка..." : "Отправить инструкции по сбросу"}
                  </Button>
                </form>
              </Form>
            ) : (
              <div className="text-center py-4">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-gray-600 mb-4">
                  Инструкции по сбросу пароля отправлены на указанный email.
                  Проверьте вашу почту и следуйте инструкциям.
                </p>
                <Button 
                  onClick={() => setIsSuccess(false)} 
                  variant="outline"
                >
                  Отправить еще раз
                </Button>
              </div>
            )}
            {error && (
              <div className="text-red-500 text-sm text-center mt-2">{error}</div>
            )}
          </CardContent>
          
          <CardFooter className="flex justify-center">
            <Button variant="link" asChild>
              <Link to="/login" className="flex items-center">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Вернуться на страницу входа
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
      
      <Footer />
    </div>
  );
};

export default ForgotPassword;
