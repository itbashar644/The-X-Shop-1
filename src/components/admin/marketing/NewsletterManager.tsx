
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
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Loader2, Mail, RefreshCw, Users } from "lucide-react";
import { useNewsletterSubscribers } from "@/hooks/useNewsletterSubscribers";
import { Badge } from "@/components/ui/badge";

const formSchema = z.object({
  subject: z.string().min(1, "Введите тему рассылки"),
  content: z.string().min(10, "Содержание должно быть не менее 10 символов"),
});

type NewsletterFormValues = z.infer<typeof formSchema>;

export function NewsletterManager() {
  const [isSending, setIsSending] = useState(false);
  const { subscribers, loading, error, fetchSubscribers, sendNewsletter } = useNewsletterSubscribers();

  const form = useForm<NewsletterFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      subject: "",
      content: "",
    },
  });

  const onSubmit = async (data: NewsletterFormValues) => {
    setIsSending(true);
    
    try {
      const success = await sendNewsletter(data.subject, data.content);
      if (success) {
        form.reset();
      }
    } finally {
      setIsSending(false);
    }
  };

  const handleRefresh = () => {
    fetchSubscribers();
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Управление рассылкой</CardTitle>
            <CardDescription>
              Отправка рекламной рассылки подписчикам
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="flex items-center gap-1">
              <Users className="h-3 w-3 mr-1" />
              {loading ? '...' : subscribers.length} подписчиков
            </Badge>
            <Button 
              variant="outline" 
              size="icon" 
              onClick={handleRefresh} 
              disabled={loading}
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="subject"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Тема письма</FormLabel>
                  <FormControl>
                    <Input placeholder="Введите тему письма" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Содержание письма</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Введите текст рассылки" 
                      className="min-h-[200px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Button 
              type="submit" 
              disabled={isSending || loading || subscribers.length === 0}
              className="w-full"
            >
              {isSending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Отправка...
                </>
              ) : (
                <>
                  <Mail className="mr-2 h-4 w-4" />
                  Отправить рассылку
                </>
              )}
            </Button>
          </form>
        </Form>
        
        {error && (
          <p className="text-center text-destructive mt-4">
            {error}
          </p>
        )}
        
        {subscribers.length === 0 && !loading && !error && (
          <p className="text-center text-muted-foreground mt-4">
            У вас пока нет подписчиков для рассылки
          </p>
        )}
      </CardContent>
      <CardFooter className="text-sm text-muted-foreground border-t pt-4">
        Рассылка будет отправлена всем активным подписчикам
      </CardFooter>
    </Card>
  );
}
