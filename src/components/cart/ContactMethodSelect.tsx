
import React from "react";
import { Phone, MessageSquare, ChevronDown } from "lucide-react";
import TelegramIcon from "@/components/icons/TelegramIcon";
import WhatsAppIcon from "@/components/icons/WhatsAppIcon";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface ContactMethodSelectProps {
  value: string;
  onValueChange: (value: string) => void;
}

const ContactMethodSelect = ({ value, onValueChange }: ContactMethodSelectProps) => {
  return (
    <div className="space-y-2">
      <Label className="block text-sm font-medium">Предпочтительный способ связи</Label>
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Выберите способ связи" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="phone" className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              <span>По телефону</span>
            </div>
          </SelectItem>
          
          <SelectItem value="telegram" className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              <TelegramIcon size={16} className="text-[#0088cc]" />
              <span>Telegram</span>
            </div>
          </SelectItem>
          
          <SelectItem value="whatsapp" className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              <WhatsAppIcon size={16} className="text-[#25D366]" />
              <span>WhatsApp</span>
            </div>
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default ContactMethodSelect;
