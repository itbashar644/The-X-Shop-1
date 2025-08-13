
import { useState, useEffect } from 'react';
 
import { UserProfile } from '@/types/auth';

const SUPER_ADMINS = [
  'halafbashar@gmail.com',
  'vipregitrator@gmail.com',
];

const useAdminStatus = (profile: UserProfile | null) => {
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);

  useEffect(() => {
    if (!profile) {
      setIsSuperAdmin(false);
      return;
    }
    if (SUPER_ADMINS.includes(profile.email)) {
      setIsSuperAdmin(true);
      return;
    }
    if (profile.isSuperAdmin === true || profile.role === 'admin') {
      setIsSuperAdmin(true);
      return;
    }
    setIsSuperAdmin(false);
  }, [profile]);

  return { isSuperAdmin };
};

export default useAdminStatus;
