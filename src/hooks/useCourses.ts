
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface Course {
  id: string;
  title: string;
  code: string;
  description: string | null;
  department: string | null;
  semester: string | null;
  year: number | null;
  credits: number | null;
  status: string | null;
  instructor_id: string | null;
  created_at: string | null;
}

export const useCourses = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchCourses = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        console.log('Fetching courses for user:', user.id);
        const { data, error } = await supabase
          .from('courses')
          .select('*')
          .eq('status', 'active')
          .order('title');

        if (error) {
          console.error('Error fetching courses:', error);
          setError(error.message);
        } else {
          console.log('Courses fetched:', data?.length || 0);
          setCourses(data || []);
        }
      } catch (err: any) {
        console.error('Error fetching courses:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [user]);

  return { courses, loading, error };
};
