
import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface OrderTermsProps {
  termsAgreed: boolean;
  setTermsAgreed: React.Dispatch<React.SetStateAction<boolean>>;
  privacyAgreed: boolean;
  setPrivacyAgreed: React.Dispatch<React.SetStateAction<boolean>>;
  saveInfo: boolean;
  setSaveInfo: React.Dispatch<React.SetStateAction<boolean>>;
}

const OrderTerms = ({
  termsAgreed,
  setTermsAgreed,
  privacyAgreed,
  setPrivacyAgreed,
  saveInfo,
  setSaveInfo
}: OrderTermsProps) => {
  return (
    <div className="space-y-3">
      <div className="flex items-start space-x-2">
        <Checkbox 
          id="terms" 
          checked={termsAgreed} 
          onCheckedChange={() => setTermsAgreed(prev => !prev)}
        />
        <Label 
          htmlFor="terms" 
          className="text-sm font-normal cursor-pointer leading-tight"
        >
          Я согласен с <a href="/terms" className="text-primary underline">Условиями использования</a>
        </Label>
      </div>
      
      <div className="flex items-start space-x-2">
        <Checkbox 
          id="privacy" 
          checked={privacyAgreed} 
          onCheckedChange={() => setPrivacyAgreed(prev => !prev)}
        />
        <Label 
          htmlFor="privacy" 
          className="text-sm font-normal cursor-pointer leading-tight"
        >
          Я согласен с <a href="/privacy" className="text-primary underline">Политикой конфиденциальности</a>
        </Label>
      </div>
      
      <div className="flex items-start space-x-2">
        <Checkbox 
          id="save-info" 
          checked={saveInfo} 
          onCheckedChange={() => setSaveInfo(prev => !prev)}
        />
        <Label 
          htmlFor="save-info" 
          className="text-sm font-normal cursor-pointer leading-tight"
        >
          Сохранить информацию для следующих заказов
        </Label>
      </div>
    </div>
  );
};

export default OrderTerms;
