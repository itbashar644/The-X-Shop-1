import { createContext } from 'react';

export interface UserProfile {
  id: string;
  email: string;
  name?: string;
  phone?: string;
  address?: string;
  city?: string;
  postalCode?: string;
  avatarUrl?: string;
  roles?: string[];
  chatId?: string;
  isAdmin?: boolean;
}

export const UserContext = createContext<{
  profile: UserProfile | null;
  updateProfile: (updates: Partial<UserProfile>) => void;
  refreshProfile: () => Promise<void>;
}>({
  profile: null,
  updateProfile: () => {},
  refreshProfile: async () => {},
});