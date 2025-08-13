
import { Navigate, Outlet } from "react-router-dom";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";

interface AdminAuthProps {
  children?: React.ReactNode;
  editorAccess?: boolean; // Если true, то редакторы также имеют доступ
}

export const AdminAuth = ({ children, editorAccess = false }: AdminAuthProps) => {
  const [isChecking, setIsChecking] = useState(true);
  const { isAuthenticated, isLoading, hasRole, user } = useAuth();
  const [hasAccess, setHasAccess] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const checkAccess = async () => {
      try {
        console.log('AdminAuth: Checking access...', { isAuthenticated, isLoading, user });
        
        if (isLoading) {
          console.log('AdminAuth: Still loading auth state');
          return;
        }

        if (!isAuthenticated || !user) {
          console.log('AdminAuth: User not authenticated');
          if (isMounted) {
            setHasAccess(false);
            setIsChecking(false);
          }
          return;
        }

        console.log('AdminAuth: User authenticated, checking roles for user:', user.id);

        // Проверяем роль пользователя
        const isAdmin = await hasRole('admin');
        const isEditor = editorAccess && await hasRole('editor');
        const access = isAdmin || isEditor;
        
        console.log('AdminAuth: Role check results:', { isAdmin, isEditor, access });
        
        if (isMounted) {
          setHasAccess(access);
          setIsChecking(false);

          if (!access) {
        
            console.log('AdminAuth: Access denied for user');
            toast("Недостаточно прав", {
              description: "У вас нет доступа к административной панели",
            });
          } else {
            console.log('AdminAuth: Access granted');
          }
        }
      } catch (error) {
        console.error("AdminAuth: Ошибка при проверке прав доступа:", error);
        if (isMounted) {
          setHasAccess(false);
          setIsChecking(false);
          toast("Ошибка проверки доступа", {
            description: "Произошла ошибка при проверке прав доступа",
          });
        }
      }
    };

    checkAccess();

    return () => {
      isMounted = false;
    };
  }, [isLoading, isAuthenticated, hasRole, editorAccess, user]);

  console.log('AdminAuth: Current state:', { isLoading, isChecking, isAuthenticated, hasAccess });

  if (isLoading || isChecking) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Проверка авторизации...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    console.log('AdminAuth: Redirecting to admin login - not authenticated');
    return <Navigate to="/admin/login" replace />;
  }

  if (!hasAccess) {
    console.log('AdminAuth: Redirecting to home - no access');
    return <Navigate to="/" replace />;
  }

  return children ? <>{children}</> : <Outlet />;
};

export default AdminAuth;
