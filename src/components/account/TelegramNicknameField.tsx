
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import TelegramIcon from "@/components/icons/TelegramIcon";

interface TelegramNicknameFieldProps {
  form: UseFormReturn<any>;
}

const TelegramNicknameField = ({ form }: TelegramNicknameFieldProps) => {
  return (
    <FormField
      control={form.control}
      name="telegramNickname"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Ник в Telegram</FormLabel>
          <FormControl>
            <div className="flex items-center">
              <span className="bg-[#1EAEDB] p-2 rounded-l-md">
                <TelegramIcon className="h-5 w-5" />
              </span>
              <Input 
                placeholder="Введите ваш ник в Telegram" 
                className="rounded-l-none"
                {...field} 
              />
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default TelegramNicknameField;
