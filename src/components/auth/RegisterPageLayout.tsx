
import React from "react";
import { Link } from "react-router-dom";

interface RegisterPageLayoutProps {
  children: React.ReactNode;
}

const RegisterPageLayout: React.FC<RegisterPageLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex">
      <div className="hidden md:block md:w-1/2 bg-black">
        <div className="h-full flex items-center justify-center p-8">
          <img
            src="/lovable-uploads/96c6e31d-3cd8-496b-8495-1b63a8577aeb.png"
            alt="The X Shop"
            className="max-w-sm w-full"
          />
        </div>
      </div>
      <div className="w-full md:w-1/2 flex items-center justify-center p-4 md:p-8">
        <div className="max-w-md w-full">
          <div className="mb-8 text-center">
            <Link to="/" className="inline-block mb-6 md:hidden">
              <img
                src="/lovable-uploads/96c6e31d-3cd8-496b-8495-1b63a8577aeb.png"
                alt="Logo"
                className="h-12 mx-auto"
              />
            </Link>
            <h1 className="text-2xl font-bold">Регистрация</h1>
            <p className="text-muted-foreground mt-2">
              Создайте аккаунт для доступа к заказам и избранному
            </p>
          </div>
          
          {children}
        </div>
      </div>
    </div>
  );
};

export default RegisterPageLayout;
