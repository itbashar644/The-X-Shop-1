
import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
// import { supabase } from "@/integrations/supabase/client";

const formSchema = z.object({
  email: z.string().email("Введите корректный email адрес"),
  consent: z.boolean().refine((val) => val === true, {
    message: "Необходимо согласие на получение рассылки",
  }),
});

type NewsletterFormValues = z.infer<typeof formSchema>;

export function NewsletterSignup() {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<NewsletterFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      consent: false,
    },
  });

  const onSubmit = async (data: NewsletterFormValues) => {
    setIsLoading(true);
    
    try {
      // Save subscription to Supabase database
      // Вместо обращения к supabase просто показываем toast или возвращаем успех
      toast.success("Вы успешно подписались на рассылку!");
      
      form.reset();
    } catch (error) {
      console.error("Error subscribing to newsletter:", error);
      toast.error("Ошибка при подписке. Попробуйте позже.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      <h3 className="text-lg font-medium mb-2">Подпишитесь на нашу рассылку</h3>
      <p className="text-sm text-muted-foreground mb-4">
        Получайте информацию о новых товарах и специальных предложениях
      </p>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder="Ваш email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="consent"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <p className="text-sm text-muted-foreground">
                    Я согласен на получение рекламной рассылки и обработку моих персональных данных
                  </p>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Подписка..." : "Подписаться"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
