
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import ContactMethodSelect from "./ContactMethodSelect";
import TelegramNicknameInput from "./TelegramNicknameInput";

interface OrderFormFieldsProps {
  orderForm: {
    name: string;
    email: string;
    phone: string;
    address: string;
    contactMethod: string;
    telegramNickname: string;
  };
  handleOrderFormChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleContactMethodChange: (value: string) => void;
}

const OrderFormFields = ({
  orderForm,
  handleOrderFormChange,
  handleContactMethodChange,
}: OrderFormFieldsProps) => {
  return (
    <>
      <div>
        <Label htmlFor="name">Имя</Label>
        <Input
          id="name"
          name="name"
          placeholder="Ваше имя"
          value={orderForm.name}
          onChange={handleOrderFormChange}
          required
        />
      </div>
      
      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="email@example.com"
          value={orderForm.email}
          onChange={handleOrderFormChange}
          required
        />
      </div>
      
      <div>
        <Label htmlFor="phone">Телефон</Label>
        <Input
          id="phone"
          name="phone"
          placeholder="+7 (XXX) XXX-XX-XX"
          value={orderForm.phone}
          onChange={handleOrderFormChange}
          required
        />
      </div>
      
      <div>
        <Label htmlFor="address">Адрес доставки</Label>
        <Input
          id="address"
          name="address"
          placeholder="Ваш адрес"
          value={orderForm.address}
          onChange={handleOrderFormChange}
          required
        />
      </div>

      <ContactMethodSelect 
        value={orderForm.contactMethod} 
        onValueChange={handleContactMethodChange}
      />
      
      {orderForm.contactMethod === "telegram" && (
        <TelegramNicknameInput
          value={orderForm.telegramNickname}
          onChange={handleOrderFormChange}
          required
        />
      )}
    </>
  );
};

export default OrderFormFields;
