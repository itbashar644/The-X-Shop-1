
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface TelegramNicknameInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
}

const TelegramNicknameInput = ({ value, onChange, required = false }: TelegramNicknameInputProps) => {
  return (
    <div>
      <Label htmlFor="telegramNickname">Ваш Telegram nickname</Label>
      <Input
        id="telegramNickname"
        name="telegramNickname"
        placeholder="@username"
        value={value}
        onChange={onChange}
        required={required}
      />
    </div>
  );
};

export default TelegramNicknameInput;
