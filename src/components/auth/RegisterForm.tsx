
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/context/AuthContext";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import RegisterFormSchema from "@/pages/auth/schemas/registerFormSchema";
import { toast } from "sonner";

type FormData = z.infer<typeof RegisterFormSchema>;

export default function RegisterForm() {
  const { register } = useAuth();
 
  const [isLoading, setIsLoading] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(RegisterFormSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(data: FormData) {
    setIsLoading(true);
    setShowLoginPrompt(false);
    try {
      const success = await register(data.email, data.password, data.name);
      if (success) {
        toast.success("Регистрация успешна!", {
          description: "Теперь вы можете пользоваться своим аккаунтом.",
        });
  
      } else {
        setShowLoginPrompt(true);
        form.setError("email", {
          type: "manual",
          message: "Пользователь с таким email уже существует",
        });
        toast.error("Ошибка при регистрации", {
          description: "Пользователь с таким email уже существует",
        });
      }
    } catch (error: any) {
      toast.error("Ошибка при регистрации", {
        description: error.message || "Что-то пошло не так. Попробуйте еще раз.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Имя</FormLabel>
              <FormControl>
                <Input placeholder="Иван Иванов" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="mail@example.com"
                  autoComplete="username"
                  {...field}
                />
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
              <FormLabel>Пароль</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="••••••••"
                  autoComplete="new-password"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Подтвердите пароль</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="••••••••"
                  autoComplete="new-password"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {showLoginPrompt && (
          <div className="rounded-md bg-blue-50 p-3 text-sm text-blue-700">
            У вас уже есть аккаунт.{' '}
            <Link to="/login" className="font-medium underline">
              Войти сейчас
            </Link>
          </div>
        )}

        <Button
          type="submit"
          className="w-full"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Регистрация...
            </>
          ) : (
            "Зарегистрироваться"
          )}
        </Button>

        <div className="text-center text-sm">
          Уже есть аккаунт?{' '}
           <Link to="/login" className="font-medium">
            Войти
          </Link>
        </div>
      </form>
    </Form>
  );
}
