
export interface AuthResult {
  success: boolean;
  error?: string | { message?: string };
  message?: string;
  isExistingUser?: boolean;
}

export interface PasswordUpdateResult extends AuthResult {
  // No need to redefine error here since we've made the parent type compatible
}

export interface ResetPasswordParams {
  accessToken: string;
  password: string;
}

export interface UserProfileUpdate {
  name?: string;
  phone?: string;
  address?: string;
  preferredContactMethod?: 'phone' | 'telegram' | 'whatsapp';
  telegramNickname?: string;
  savedAddresses?: string[];
}
