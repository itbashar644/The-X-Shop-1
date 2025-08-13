// MirPayment.tsx
import { useRef, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { initPayment, checkPaymentStatus, createMirPaymentForm } from "@/services/paymentService";

interface MirPaymentProps {
  amount: number;
  orderId: string;
  description?: string;
  email?: string;
  onSuccess?: (paymentData: { orderId: string; status: string }) => void;
  onError?: (error: string) => void;
  onCancel?: () => void;
}

const MirPayment = ({
  amount,
  orderId,
  description = "Оплата заказа",
  email = "",
  onSuccess,
  onError,
  onCancel
}: MirPaymentProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [paymentInitialized, setPaymentInitialized] = useState(false);
  const formContainerRef = useRef<HTMLDivElement>(null);
  const [paymentId, setPaymentId] = useState<string | null>(null);

  useEffect(() => {
    const initializePayment = async () => {
      try {
        setIsLoading(true);
        
        // Инициализация платежа на сервере
        const paymentData = await initPayment(orderId, amount, description, email);
        setPaymentId(paymentData.paymentId);

        if (formContainerRef.current) {
          const success = await createMirPaymentForm(formContainerRef.current, {
            amount,
            orderId,
            description,
            onSuccess: async (result) => {
              // Проверяем статус платежа на сервере
              const status = await checkPaymentStatus(paymentData.paymentId);
              
              if (status.status === 'SUCCESS') {
                toast.success("Платеж выполнен", {
                  description: `Оплачено ${amount.toLocaleString()} ₽`,
                });
                if (onSuccess) onSuccess(result);
              } else {
                toast.error("Ошибка платежа", {
                  description: "Платеж не был подтвержден",
                });
                if (onError) onError("Payment not confirmed");
              }
            },
            onError: (error) => {
              toast.error("Ошибка платежа", {
                description: error || "Произошла ошибка при выполнении платежа",
              });
              if (onError) onError(error);
            }
          });
          
          setPaymentInitialized(success);
        }
      } catch (error) {
        console.error("Payment initialization error:", error);
        toast.error("Ошибка инициализации", {
          description: "Не удалось загрузить платежную форму",
        });
        if (onError) onError("Initialization failed");
      } finally {
        setIsLoading(false);
      }
    };

    initializePayment();

    return () => {
      // Cleanup if needed
    };
  }, [amount, orderId, description, email, onSuccess, onError]);

  const handleCancel = () => {
    if (onCancel) onCancel();
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Оплата через систему МИР</CardTitle>
        <CardDescription>
          Сумма к оплате: {amount.toLocaleString()} ₽
          {email && <span className="block mt-1">Email: {email}</span>}
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
            <p className="text-muted-foreground">Загрузка платежной формы...</p>
          </div>
        ) : !paymentInitialized ? (
          <div className="text-center py-8">
            <div className="text-red-500 mb-4">
              <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium mb-2">Ошибка загрузки</h3>
            <p className="text-sm text-muted-foreground">
              Не удалось загрузить платежную форму. Пожалуйста, попробуйте позже.
            </p>
          </div>
        ) : (
          <div ref={formContainerRef} className="min-h-[200px]"></div>
        )}
      </CardContent>
      
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={handleCancel}>
          Отменить
        </Button>
        <div className="flex items-center text-xs text-muted-foreground">
          <img 
            src="/mir-logo.png" 
            alt="Платежная система МИР" 
            className="h-5 mr-2" 
          />
          Безопасные платежи
        </div>
      </CardFooter>
    </Card>
  );
};

export default MirPayment;