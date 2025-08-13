
import React from "react";
import { NavigateFunction } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ResetPasswordForm from "@/components/auth/ResetPasswordForm";
import ResetPasswordError from "@/components/auth/ResetPasswordError";

interface ResetPasswordWrapperProps {
  isRecoveryMode: boolean;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  navigate: NavigateFunction;
}

const ResetPasswordWrapper: React.FC<ResetPasswordWrapperProps> = ({
  isRecoveryMode,
  loading,
  setLoading,
  navigate
}) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>{isRecoveryMode ? "Установка нового пароля" : "Сброс пароля"}</CardTitle>
            <CardDescription>
              {isRecoveryMode
                ? "Придумайте новый пароль для вашего аккаунта"
                : "Запросите ссылку для сброса пароля"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isRecoveryMode ? (
              <ResetPasswordForm loading={loading} setLoading={setLoading} />
            ) : (
              <ResetPasswordError onRequestReset={() => navigate("/forgot-password")} />
            )}
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button variant="link" onClick={() => navigate("/login")}>
              Вернуться на страницу входа
            </Button>
          </CardFooter>
        </Card>
      </div>
      <Footer />
    </div>
  );
};

export default ResetPasswordWrapper;
