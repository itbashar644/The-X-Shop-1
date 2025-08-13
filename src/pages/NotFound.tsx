
import { useLocation, Link, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [redirectPath, setRedirectPath] = useState<string | null>(null);

  // Check if this might be a failed auth redirect with access token
  const hasAccessToken = location.hash.includes("access_token");
  
  useEffect(() => {
    // Handle potential auth callback
    if (hasAccessToken) {
      const handleAuthCallback = async () => {
        setIsRedirecting(true);
        // This helps clean up any potential token issues
        try {
          // const { data, error } = await supabase.auth.getSession();
          if (location.pathname.includes('admin')) {
            setRedirectPath("/admin");
          } else {
            setRedirectPath("/account");
          }
        } catch (e) {
          console.error("Error processing auth callback on 404 page:", e);
          setIsRedirecting(false);
        }
      };
      handleAuthCallback();
    } else {
      console.error(
        "404 Error: User attempted to access non-existent route:",
        location.pathname,
        "with search params:",
        location.search,
        "and hash:",
        location.hash
      );
    }
  }, [location.pathname, location.search, location.hash, hasAccessToken]);

  // If redirecting to a valid path, use Navigate
  if (redirectPath) {
    return <Navigate to={redirectPath} replace />;
  }

  // If there's an access token in the URL, let's show a loading state while we process it
  if (hasAccessToken) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center max-w-md p-6 bg-white rounded-lg shadow-md">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <h2 className="text-xl font-bold mb-4">Обработка авторизации...</h2>
          <p className="text-gray-600 mb-4">
            Пожалуйста, подождите, мы обрабатываем данные вашей авторизации.
          </p>
        </div>
      </div>
    );
  }
  
  // Check if this might be a failed password reset
  const isLikelyPasswordReset = location.pathname.includes("reset") || 
                               location.pathname.includes("password") || 
                               location.hash.includes("access_token");

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center max-w-md p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-4">Страница не найдена</p>
        
        {isLikelyPasswordReset && (
          <div className="mb-6">
            <p className="text-amber-600 mb-4">
              Похоже, вы перешли по ссылке для сброса пароля.
            </p>
            <p className="text-gray-600 mb-4">
              Если вы пытаетесь сбросить пароль, пожалуйста, перейдите на страницу сброса пароля.
            </p>
            <Button asChild className="mb-4">
              <Link to="/reset-password">
                Перейти к сбросу пароля
              </Link>
            </Button>
          </div>
        )}

        <div className="flex flex-col gap-3">
          <Button asChild variant="default">
            <Link to="/" className="flex items-center justify-center">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Вернуться на главную
            </Link>
          </Button>
          
          <Button asChild variant="outline">
            <Link to="/login" className="flex items-center justify-center">
              Перейти на страницу входа
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
