import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { DeliveryMethod } from "@/types/product";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import OrderFormFields from "./OrderFormFields";
import OrderTerms from "./OrderTerms";

interface OrderSummaryProps {
  subtotal: number;
  total: number;
  deliveryMethod: DeliveryMethod | null;
  onSubmit: (formData: {
    name: string;
    email: string;
    phone: string;
    address: string;
    contactMethod: string;
    telegramNickname?: string;
  }) => void;
  isSubmitting: boolean;
  hasStockIssues: boolean;
}

interface SavedCheckoutInfo {
  name: string;
  email: string;
  phone: string;
  address: string;
  contactMethod: string;
  telegramNickname?: string;
}

const OrderSummary = ({
  subtotal,
  total,
  deliveryMethod,
  onSubmit,
  isSubmitting,
  hasStockIssues
}: OrderSummaryProps) => {
  const { user, updateProfile } = useAuth();
  const { toast } = useToast();
  
  // Form state
  const [orderForm, setOrderForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    contactMethod: "phone",
    telegramNickname: "",
  });
  
  // UI state
  const [saveInfo, setSaveInfo] = useState(false);
  const [hasSavedInfo, setHasSavedInfo] = useState(false);
  const [useSavedInfo, setUseSavedInfo] = useState(false);
  const [termsAgreed, setTermsAgreed] = useState(false);
  const [privacyAgreed, setPrivacyAgreed] = useState(false);

  // Load saved checkout info on mount and when user changes
  useEffect(() => {
    loadSavedInfo();
  }, [user]);

  // Load saved checkout information from localStorage and user
  const loadSavedInfo = () => {
    const savedInfoString = localStorage.getItem("savedCheckoutInfo");
    
    if (savedInfoString) {
      setHasSavedInfo(true);
    }
    
    // Auto-populate with user data if available
    if (user) {
      setOrderForm(prev => ({
        ...prev,
        name: user.name || prev.name,
        email: user.email || prev.email,
        phone: user.phone || prev.phone,
        address: user.address || prev.address,
        contactMethod: user.preferredContactMethod || prev.contactMethod,
        telegramNickname: user.telegramNickname || prev.telegramNickname
      }));
    }
  };

  // Handle loading saved checkout information
  const handleUseSavedInfo = () => {
    const savedInfoString = localStorage.getItem("savedCheckoutInfo");
    
    if (savedInfoString) {
      try {
        const savedInfo: SavedCheckoutInfo = JSON.parse(savedInfoString);
        
        setOrderForm({
          name: savedInfo.name,
          email: savedInfo.email,
          phone: savedInfo.phone,
          address: savedInfo.address,
          contactMethod: savedInfo.contactMethod,
          telegramNickname: savedInfo.telegramNickname || "",
        });
        
        setUseSavedInfo(true);
        toast({
          title: "Информация загружена",
          description: "Сохраненная информация о доставке загружена"
        });
      } catch (error) {
        console.error("Failed to parse saved checkout info", error);
        toast({
          title: "Ошибка",
          description: "Не удалось загрузить сохраненную информацию",
          variant: "destructive"
        });
      }
    }
  };

  // Form field change handlers
  const handleOrderFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setOrderForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleContactMethodChange = (value: string) => {
    setOrderForm((prev) => ({ ...prev, contactMethod: value }));
  };

  // Form submission handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!termsAgreed || !privacyAgreed) {
      toast({
        title: "Ошибка",
        description: "Необходимо согласиться с Условиями использования и Политикой конфиденциальности",
        variant: "destructive"
      });
      return;
    }
    
    // Save checkout information if requested
    if (saveInfo) {
      saveCheckoutInfo();
    }
    
    // Submit the form
    onSubmit(orderForm);
  };
  
  // Save checkout info to localStorage and update user profile
  const saveCheckoutInfo = () => {
    try {
      localStorage.setItem("savedCheckoutInfo", JSON.stringify(orderForm));
      toast({
        title: "Информация сохранена",
        description: "Данные о доставке сохранены для будущих заказов"
      });
    } catch (error) {
      console.error("Failed to save checkout info", error);
    }
    
    if (user) {
      try {
        updateProfile({
          name: orderForm.name,
          phone: orderForm.phone,
          address: orderForm.address,
          preferredContactMethod: orderForm.contactMethod as any,
          telegramNickname: orderForm.telegramNickname,
        });
      } catch (error) {
        console.error("Failed to update profile with checkout info", error);
      }
    }
  };
  
  // Ensure the values are numbers
  const formattedSubtotal = typeof subtotal === 'number' ? subtotal : 0;
  const formattedTotal = typeof total === 'number' ? total : 0;
  
  // Render summary
  return (
    <div className="rounded-lg border p-6 sticky top-20">
      <h2 className="text-xl font-semibold mb-4">Информация о заказе</h2>
      
      <div className="space-y-2 mb-6">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Товары:</span>
          <span>{formattedSubtotal} ₽</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Доставка:</span>
          <span>{deliveryMethod ? deliveryMethod.price : 0} ₽</span>
        </div>
        <div className="border-t my-2"></div>
        <div className="flex justify-between font-medium text-lg">
          <span>Итого:</span>
          <span>{formattedTotal} ₽</span>
        </div>
      </div>
      
      {/* Saved information button */}
      {hasSavedInfo && !useSavedInfo && (
        <div className="mb-4">
          <Button 
            variant="outline"
            className="w-full"
            onClick={handleUseSavedInfo}
            type="button"
          >
            Использовать сохраненную информацию
          </Button>
        </div>
      )}
      
      {/* Order form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <OrderFormFields 
          orderForm={orderForm}
          handleOrderFormChange={handleOrderFormChange}
          handleContactMethodChange={handleContactMethodChange}
        />
        
        <OrderTerms
          termsAgreed={termsAgreed}
          setTermsAgreed={setTermsAgreed}
          privacyAgreed={privacyAgreed}
          setPrivacyAgreed={setPrivacyAgreed}
          saveInfo={saveInfo}
          setSaveInfo={setSaveInfo}
        />
        
        <Button 
          type="submit" 
          className="w-full"
          disabled={isSubmitting || hasStockIssues || !termsAgreed || !privacyAgreed}
        >
          {isSubmitting ? "Оформление..." : "Оформить заказ"}
        </Button>
        
        {hasStockIssues && (
          <p className="text-sm text-red-500 text-center">
            Некоторые товары недоступны в запрашиваемом количестве
          </p>
        )}
      </form>
    </div>
  );
};

export default OrderSummary;
