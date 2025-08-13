
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';
import { UserProfile } from '@/types/auth';
import { UserProfileUpdate } from '@/utils/auth/types';

export function useUserProfile(user: User | null) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  
  // Fetch user profile when user changes
  useEffect(() => {
    if (user) {
      fetchUserProfile(user.id);
    } else {
      setProfile(null);
    }
  }, [user]);
  
  // Fetch user profile data
  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error) {
        console.error("Error fetching profile:", error);
        return;
      }
      
      if (data) {
        // Transform database fields to match our UserProfile interface
        const userProfile: UserProfile = {
          id: data.id,
          email: data.email || user?.email || '',
          name: data.name || '',
          phone: data.phone || '',
          address: data.address || '',
          avatar_url: data.avatar_url,
          role: user?.app_metadata?.role as 'admin' | 'editor' | 'user' || 'user',
          preferredContactMethod: data.preferredcontactmethod as 'phone' | 'telegram' | 'whatsapp',
          // Convert any JSON array to an array of strings
          savedAddresses: Array.isArray(data.savedaddresses) 
            ? data.savedaddresses.map(item => String(item))
            : [],
          telegramNickname: data.telegramnickname || ''
        };
        
        setProfile(userProfile);
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };
  
  // Update user profile
  const updateProfile = async (profileData: UserProfileUpdate): Promise<boolean> => {
    try {
      if (!user) return false;
      
      const updates = {
        id: user.id,
        name: profileData.name,
        phone: profileData.phone,
        address: profileData.address,
        preferredcontactmethod: profileData.preferredContactMethod,
        telegramnickname: profileData.telegramNickname,
        savedaddresses: profileData.savedAddresses,
        updated_at: new Date().toISOString()
      };
      
      const { error } = await supabase
        .from('profiles')
        .upsert(updates);
        
      if (error) {
        console.error("Error updating profile:", error);
        return false;
      }
      
      // Update local profile state
      if (profile) {
        setProfile({
          ...profile,
          name: profileData.name || profile.name,
          phone: profileData.phone || profile.phone,
          address: profileData.address || profile.address,
          preferredContactMethod: profileData.preferredContactMethod || profile.preferredContactMethod,
          telegramNickname: profileData.telegramNickname || profile.telegramNickname,
          savedAddresses: profileData.savedAddresses || profile.savedAddresses
        });
      }
      
      return true;
    } catch (error) {
      console.error("Error updating profile:", error);
      return false;
    }
  };

  return { profile, setProfile, updateProfile };
}
