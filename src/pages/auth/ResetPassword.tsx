import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";
import ResetPasswordWrapper from "@/components/auth/ResetPasswordWrapper";
import { supabase } from "@/integrations/supabase/client";

const ResetPassword: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [isRecoveryMode, setIsRecoveryMode] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const checkForRecoveryToken = async () => {
      try {
        setLoading(true);

        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const accessToken = hashParams.get("access_token");
        const refreshToken = hashParams.get("refresh_token");

        if (accessToken && refreshToken) {
          console.log("Found tokens in hash");

          const { data, error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });

          if (error) {
            throw error;
          }

          if (data.user) {
            setIsRecoveryMode(true);
            toast.info("Введите новый пароль", {
              description: "Вы можете установить новый пароль для своего аккаунта"
            });
          }
        } else {
          const { data: { session } } = await supabase.auth.getSession();
          if (session) {
            setIsRecoveryMode(true);
            toast.info("Введите новый пароль", {
              description: "Вы можете установить новый пароль для своего аккаунта"
            });
          } else {
            setIsRecoveryMode(false);
            toast.warning("Ссылка для сброса пароля не действительна", {
              description: "Пожалуйста, запросите новую ссылку для сброса пароля"
            });

            if (location.pathname === '/reset-password') {
              setTimeout(() => navigate("/forgot-password"), 2000);
            }
          }
        }
      } catch (error: any) {
        console.error("Error checking recovery token:", error);
        toast.error("Ошибка проверки токена", {
          description: error.message || "Не удалось проверить токен восстановления"
        });
        setIsRecoveryMode(false);
      } finally {
        setLoading(false);
      }
    };

    checkForRecoveryToken();
  }, [navigate, location.pathname]);

  return (
    <ResetPasswordWrapper 
      isRecoveryMode={isRecoveryMode} 
      loading={loading} 
      setLoading={setLoading}
      navigate={navigate}
    />
  );
};

export default ResetPassword;
