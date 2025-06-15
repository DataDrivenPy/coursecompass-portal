
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface UserProfile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  email: string;
  role: string;
  created_at: string;
}

export const useUserProfile = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .maybeSingle();

        if (error) {
          setError(error.message);
        } else if (data) {
          // Create a complete profile object with email from user
          const completeProfile: UserProfile = {
            id: data.id,
            first_name: data.full_name?.split(' ')[0] || user.user_metadata?.first_name || null,
            last_name: data.full_name?.split(' ').slice(1).join(' ') || user.user_metadata?.last_name || null,
            email: user.email || '',
            role: data.role || 'student',
            created_at: data.created_at || new Date().toISOString(),
          };
          setProfile(completeProfile);
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  return { profile, loading, error };
};
