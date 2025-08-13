import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Mail, Key, Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

const emailFormSchema = z.object({
  email: z.string().email("Введите корректный email"),
  confirmEmail: z.string().email("Введите корректный email"),
}).refine(data => data.email === data.confirmEmail, {
  message: "Email адреса не совпадают",
  path: ["confirmEmail"],
});

const passwordFormSchema = z.object({
  currentPassword: z.string().min(6, "Пароль должен содержать минимум 6 символов"),
  newPassword: z.string().min(6, "Пароль должен содержать минимум 6 символов"),
  confirmNewPassword: z.string().min(6, "Пароль должен содержать минимум 6 символов"),
}).refine(data => data.newPassword === data.confirmNewPassword, {
  message: "Пароли не совпадают",
  path: ["confirmNewPassword"],
});

type EmailFormValues = z.infer<typeof emailFormSchema>;
type PasswordFormValues = z.infer<typeof passwordFormSchema>;

// Предполагаемый тип результата updatePassword
type UpdatePasswordResult = {
  success: boolean;
  error?: string; // строка с ошибкой или undefined
};

const AccountSecurity = () => {
  const { updateEmail, updatePassword, profile } = useAuth();

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isEmailLoading, setIsEmailLoading] = useState(false);
  const [isPasswordLoading, setIsPasswordLoading] = useState(false);

  const emailForm = useForm<EmailFormValues>({
    resolver: zodResolver(emailFormSchema),
    defaultValues: {
      email: "",
      confirmEmail: "",
    },
  });

  const passwordForm = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    },
  });

  const onEmailSubmit = async (data: EmailFormValues) => {
    setIsEmailLoading(true);
    try {
      if (data.email === profile?.email) {
        toast("Внимание", {
          description: "Вы указали текущий email. Никаких изменений не требуется.",
        });
        return;
      }

      const success = await updateEmail(data.email);
      if (success) {
        emailForm.reset();
      }
    } finally {
      setIsEmailLoading(false);
    }
  };

  const onPasswordSubmit = async (data: PasswordFormValues) => {
    setIsPasswordLoading(true);
    try {
      const result: UpdatePasswordResult = await updatePassword(data.newPassword);

      if (!result.success) {
        // Здесь error — строка или undefined
        const errorMessage = result.error ?? "Не удалось обновить пароль";

        toast.error("Ошибка обновления пароля", {
          description: errorMessage,
        });
        return;
      }

      // Если успех — сбрасываем форму и показываем успех
      passwordForm.reset();
      toast.success("Пароль успешно обновлен");
    } finally {
      setIsPasswordLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Настройки безопасности</h2>

      <Card>
        <CardHeader>
          <CardTitle>Изменить email</CardTitle>
          <CardDescription>
            Обновите свой email адрес. После изменения вы получите письмо для подтверждения.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...emailForm}>
            <form onSubmit={emailForm.handleSubmit(onEmailSubmit)} className="space-y-4">
              <FormField
                control={emailForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Новый email</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Введите новый email"
                          className="pl-10"
                          disabled={isEmailLoading}
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={emailForm.control}
                name="confirmEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Подтвердите email</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Введите email повторно"
                          className="pl-10"
                          disabled={isEmailLoading}
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isEmailLoading}>
                {isEmailLoading ? "Сохранение..." : "Сохранить новый email"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Separator className="my-6" />

      <Card>
        <CardHeader>
          <CardTitle>Изменить пароль</CardTitle>
          <CardDescription>
            Обновите ваш пароль для аккаунта. Мы рекомендуем использовать уникальный пароль, который вы не используете нигде больше.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...passwordForm}>
            <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4">
              <FormField
                control={passwordForm.control}
                name="currentPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Текущий пароль</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Key className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          type={showCurrentPassword ? "text" : "password"}
                          placeholder="Введите текущий пароль"
                          className="pl-10"
                          disabled={isPasswordLoading}
                          {...field}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-2 top-1/2 transform -translate-y-1/2"
                          onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                          disabled={isPasswordLoading}
                        >
                          {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={passwordForm.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Новый пароль</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Key className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          type={showNewPassword ? "text" : "password"}
                          placeholder="Введите новый пароль"
                          className="pl-10"
                          disabled={isPasswordLoading}
                          {...field}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-2 top-1/2 transform -translate-y-1/2"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          disabled={isPasswordLoading}
                        >
                          {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={passwordForm.control}
                name="confirmNewPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Подтвердите новый пароль</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Key className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="Введите новый пароль повторно"
                          className="pl-10"
                          disabled={isPasswordLoading}
                          {...field}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-2 top-1/2 transform -translate-y-1/2"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          disabled={isPasswordLoading}
                        >
                          {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isPasswordLoading}>
                {isPasswordLoading ? "Сохранение..." : "Обновить пароль"}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex justify-between border-t pt-5">
          <p className="text-sm text-muted-foreground">
            Последнее изменение: {new Date().toLocaleDateString()}
          </p>
          <Button variant="outline" asChild>
            <a href="/forgot-password">Забыли пароль?</a>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default AccountSecurity;

