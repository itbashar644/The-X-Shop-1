import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import * as authService from '@/services/authService';
import { API_BASE_URL } from '@/types/variables';

export interface User {
  id: number;
  email: string;
  name?: string;
  avatar?: string;
  roles?: string[];
  chatId?: string;
  phone?: string;
  address?: string;
  preferredContactMethod?: 'phone' | 'telegram' | 'whatsapp';
  savedAddresses?: string[];
  telegramNickname?: string;
}

type AuthContextType = {
  user: User | null;
  loading: boolean;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, name?: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => void;
  hasRole: (role: string) => Promise<boolean>;
  getChatId: () => string;

  updateEmail: (newEmail: string) => Promise<boolean>;
  updatePassword: (newPassword: string) => Promise<{ success: boolean; error?: string }>;
  profile: User | null;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  isLoading: true,
  isAuthenticated: false,
  login: async () => false,
  register: async () => false,
  logout: () => {},
  updateProfile: () => {},
  hasRole: async () => false,
  getChatId: () => '',
  updateEmail: async () => false,
  updatePassword: async () => ({ success: false }),
  profile: null,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const getChatId = useCallback(() => {
    if (user?.chatId) return user.chatId;
    const chatId =
      localStorage.getItem('chat_id') ||
      `chat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem('chat_id', chatId);
    return chatId;
  }, [user]);

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      authService
        .getMe(token)
        .then((res) => {
          setUser({
            ...res.user,
            avatar: res.user.avatar_url, // Преобразование avatar_url -> avatar
            chatId: getChatId(),
            roles: res.user.roles || [],
          });
        })
        .catch(() => {
          localStorage.removeItem('auth_token');
          setUser(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [getChatId]);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const res = await authService.login(email, password);
      localStorage.setItem('auth_token', res.token);
      setUser({
        ...res.user,
        avatar: res.user.avatar_url, // Преобразование avatar_url -> avatar
        chatId: getChatId(),
        roles: res.user.roles || [],
      });
      return true;
    } catch (err) {
      setUser(null);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const register = async (email: string, password: string, name?: string) => {
    setLoading(true);
    try {
      const res = await authService.register(email, password, name);
      localStorage.setItem('auth_token', res.token);
      setUser({
        ...res.user,
        avatar: res.user.avatar_url, // Преобразование avatar_url -> avatar
        chatId: getChatId(),
        roles: res.user.roles || [],
      });
      return true;
    } catch (err) {
      setUser(null);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    setUser(null);
  };

  const updateProfile = (updates: Partial<User>) => {
    setUser((prev) => (prev ? { ...prev, ...updates } : null));
  };

  const hasRole = async (role: string) => {
    if (!user?.id) return false;
    const token = localStorage.getItem('auth_token');
    if (!token) return false;

    try {
      const response = await fetch(`${API_BASE_URL}/has-role`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ user_id: user.id, role }),
      });
      if (!response.ok) return false;
      const data = await response.json();
      return !!data.has_role;
    } catch (e) {
      console.error('Ошибка проверки роли:', e);
      return false;
    }
  };

  // Новые методы:

  const updateEmail = async (newEmail: string): Promise<boolean> => {
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) throw new Error('Нет токена');

      const response = await fetch(`${API_BASE_URL}/update-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ email: newEmail }),
      });

      if (!response.ok) throw new Error('Не удалось обновить email');

      setUser((prev) => (prev ? { ...prev, email: newEmail } : null));
      return true;
    } catch (error) {
      console.error('Ошибка обновления email:', error);
      return false;
    }
  };

  const updatePassword = async (
    newPassword: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) throw new Error('Нет токена');

      const response = await fetch(`${API_BASE_URL}/update-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ password: newPassword }),
      });

      if (!response.ok) {
        const errData = await response.json();
        return { success: false, error: errData.message || 'Ошибка' };
      }

      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message || 'Ошибка' };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isLoading: loading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        updateProfile,
        hasRole,
        getChatId,
        updateEmail,
        updatePassword,
        profile: user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
