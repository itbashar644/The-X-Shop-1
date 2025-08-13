
import React from "react";
import { Button } from "@/components/ui/button";

interface ResetPasswordErrorProps {
  onRequestReset: () => void;
}

const ResetPasswordError: React.FC<ResetPasswordErrorProps> = ({ onRequestReset }) => {
  return (
    <div className="text-center py-4">
      <p className="text-muted-foreground mb-4">
        Ссылка для сброса пароля недействительна или срок её действия истек.
      </p>
      <Button onClick={onRequestReset}>
        Запросить новую ссылку
      </Button>
    </div>
  );
};

export default ResetPasswordError;
