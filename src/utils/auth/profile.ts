import { supabase } from "@/integrations/supabase/client";
import { UserProfile } from "@/types/auth";

/**
 * Create a new user profile
 */
export async function createUserProfile(profileData: {
  id: string;
  name: string;
  email: string;
}) {
  try {
    const { data: existingProfile } = await supabase
      .from("profiles")
      .select("id")
      .eq("id", profileData.id)
      .single();

    if (existingProfile) {
      // Профиль уже существует, обновляем
      return await updateUserProfile({
        id: profileData.id,
        name: profileData.name,
        email: profileData.email,
      });
    }
    
    const { error } = await supabase
      .from("profiles")
      .insert([
        {
          id: profileData.id,
          email: profileData.email,
          name: profileData.name,
        },
      ]);

    if (error) {
      console.error("Error creating user profile:", error);
      return { success: false, error };
    }

    if (
      profileData.email === 'halafbashar@gmail.com' || 
      profileData.email === 'vipregitrator@gmail.com'
    ) {
      await supabase
        .from("user_roles")
        .insert([
          {
            user_id: profileData.id,
            role: 'admin',
            is_super_admin: true,
          },
        ]);
    } else {
      await supabase
        .from("user_roles")
        .insert([
          {
            user_id: profileData.id,
            role: 'user',
          },
        ]);
    }

    return { success: true };
  } catch (error) {
    console.error("Unexpected error creating profile:", error);
    return { success: false, error };
  }
}

/**
 * Update an existing user profile
 */
export async function updateUserProfile(profileData: Partial<UserProfile> & { id: string }) {
  try {
    const { error } = await supabase
      .from("profiles")
      .update({
        name: profileData.name,
        phone: profileData.phone,
        address: profileData.address,
        avatar_url: profileData.avatar_url,
        preferredcontactmethod: profileData.preferredContactMethod,
        savedaddresses: profileData.savedAddresses,
        telegramnickname: profileData.telegramNickname,
      })
      .eq("id", profileData.id);

    if (error) {
      console.error("Error updating user profile:", error);
      return { success: false, error };
    }

    return { success: true };
  } catch (error) {
    console.error("Unexpected error updating profile:", error);
    return { success: false, error };
  }
}

// Load user profile + roles
export const loadUserProfile = async (userId: string) => {
  try {
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (profileError) {
      console.error('Ошибка при загрузке профиля:', profileError);
      return { profile: null, roles: [] };
    }

    const { data: rolesData, error: rolesError } = await supabase
      .from('user_roles')
      .select('role, is_super_admin')
      .eq('user_id', userId);

    if (rolesError) {
      console.error('Ошибка при загрузке ролей:', rolesError);
      return { profile: null, roles: [] };
    }

    let isSuperAdmin = false;
    const roles = rolesData ? rolesData.map(r => {
      if (r.role === 'admin' && r.is_super_admin) {
        isSuperAdmin = true;
      }
      return r.role;
    }) : [];

    const isSpecialAdmin = profileData?.email === 'halafbashar@gmail.com';
    if (isSpecialAdmin && !roles.includes('admin')) {
      try {
        await supabase
          .from('user_roles')
          .insert([
            {
              user_id: userId,
              role: 'admin',
              is_super_admin: true
            }
          ]);
        if (!roles.includes('admin')) {
          roles.push('admin');
        }
        isSuperAdmin = true;
      } catch (error) {
        console.error('Ошибка при добавлении роли админа:', error);
      }
    }

    const typedProfileData = profileData as {
      id: string;
      email: string | null;
      name: string | null;
      phone: string | null;
      address: string | null;
      avatar_url: string | null;
      preferredcontactmethod: string | null;
      savedaddresses: any | null;
      telegramnickname: string | null;
    };

    const fullProfile: UserProfile = {
      id: typedProfileData.id,
      email: typedProfileData.email || '',
      name: typedProfileData.name || '',
      phone: typedProfileData.phone || undefined,
      address: typedProfileData.address || undefined,
      avatar_url: typedProfileData.avatar_url || undefined,
      role: isSpecialAdmin || isSuperAdmin 
        ? 'admin' 
        : roles.includes('admin') 
          ? 'admin' 
          : roles.includes('editor') 
            ? 'editor' 
            : 'user',
      isSuperAdmin: isSpecialAdmin || isSuperAdmin,
      preferredContactMethod: (typedProfileData.preferredcontactmethod as 'phone' | 'telegram' | 'whatsapp') || 'phone',
      savedAddresses: Array.isArray(typedProfileData.savedaddresses) ? typedProfileData.savedaddresses : [],
      telegramNickname: typedProfileData.telegramnickname || undefined,
    };

    return { profile: fullProfile, roles };
  } catch (error) {
    console.error('Ошибка при загрузке профиля:', error);
    return { profile: null, roles: [] };
  }
};
