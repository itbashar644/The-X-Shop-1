
export interface UserProfile {
  id: string;
  email: string;
  name: string;
  phone?: string;
  address?: string;
  avatar_url?: string;
  role?: 'admin' | 'editor' | 'user';
  isSuperAdmin?: boolean;
  preferredContactMethod?: 'phone' | 'telegram' | 'whatsapp';
  savedAddresses?: string[];
  telegramNickname?: string;
}
