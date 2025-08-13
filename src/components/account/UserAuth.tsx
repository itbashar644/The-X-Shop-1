import { Navigate } from "react-router-dom";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";

interface UserAuthProps {
  children: React.ReactNode;
  requiredRole?: "admin" | "editor" | "user";
  redirectPath?: string;
  showLoader?: boolean;
}

const UserAuth = ({ 
  children, 
  requiredRole, 
  redirectPath = "/login", 
  showLoader = true 
}: UserAuthProps) => {
  const [isChecking, setIsChecking] = useState(true);
  const [hasShowError, setHasShowError] = useState(false);
  const { isAuthenticated, isLoading, user, hasRole } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      const verifyAccess = async () => {
        try {
          if (!isAuthenticated) {
            if (!hasShowError) {
              setHasShowError(true);
              toast.error("Требуется авторизация", {
                description: "Пожалуйста, войдите в аккаунт",
              });
            }
            return;
          }

          if (requiredRole) {
            const hasRequiredRole = await hasRole(requiredRole);
            if (!hasRequiredRole && !hasShowError) {
              setHasShowError(true);
              toast.warning("Недостаточно прав", {
                description: "У вас нет доступа к этому разделу",
              });
            }
          }
        } catch (error) {
          console.error("Auth verification error:", error);
        } finally {
          setIsChecking(false);
        }
      };

      verifyAccess();
    }
  }, [isLoading, isAuthenticated, requiredRole, hasShowError, hasRole]);

  if (isLoading || (isChecking && showLoader)) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Проверка доступа...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to={redirectPath} replace />;
  }

  return <>{children}</>;
};

export default UserAuth;