
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { UseFormReturn } from "react-hook-form";
import { Phone } from "lucide-react";
import TelegramIcon from "@/components/icons/TelegramIcon";
import WhatsAppIcon from "@/components/icons/WhatsAppIcon";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ContactMethodFieldProps {
  form: UseFormReturn<any>;
}

const ContactMethodField = ({ form }: ContactMethodFieldProps) => {
  return (
    <FormField
      control={form.control}
      name="preferredContactMethod"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Предпочтительный способ связи</FormLabel>
          <FormControl>
            <Select 
              value={field.value} 
              onValueChange={field.onChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Выберите способ связи" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="phone">
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 mr-2" />
                    По телефону
                  </div>
                </SelectItem>
                <SelectItem value="telegram">
                  <div className="flex items-center">
                    <TelegramIcon size={16} className="mr-2" />
                    Telegram
                  </div>
                </SelectItem>
                <SelectItem value="whatsapp">
                  <div className="flex items-center">
                    <WhatsAppIcon size={16} className="mr-2" />
                    WhatsApp
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default ContactMethodField;
