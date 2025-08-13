// src/hooks/useAuthMethods.ts

import { supabase } from "@/integrations/supabase/client";

export interface AuthResult {
  success: boolean;
  data?: any;
  error?: string;
}

export const authMethods = {
  signupWithEmail: async (email: string, password: string): Promise<AuthResult> => {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) return { success: false, error: error.message };
    return { success: true, data };
  },

  loginWithEmail: async (email: string, password: string): Promise<AuthResult> => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { success: false, error: error.message };
    return { success: true, data };
  },

  logout: async (): Promise<AuthResult> => {
    const { error } = await supabase.auth.signOut();
    if (error) return { success: false, error: error.message };
    return { success: true };
  },

  updatePassword: async (newPassword: string): Promise<AuthResult> => {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) return { success: false, error: "No user logged in" };
    const { data, error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) return { success: false, error: error.message };
    return { success: true, data };
  },

  sendPasswordResetEmail: async (email: string): Promise<AuthResult> => {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) return { success: false, error: error.message };
    return { success: true, data };
  },

  resetPassword: async (accessToken: string, newPassword: string): Promise<AuthResult> => {
    // Обычно не реализуется напрямую через supabase SDK
    return { success: false, error: "Not implemented" };
  },
};
