
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface Enrollment {
  id: string;
  student_id: string | null;
  course_id: string | null;
  enrolled_at: string | null;
  status: string | null;
  grade: string | null;
}

export const useEnrollments = () => {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchEnrollments = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        console.log('Fetching enrollments for user:', user.id);
        const { data, error } = await supabase
          .from('enrollments')
          .select('*')
          .eq('student_id', user.id)
          .order('enrolled_at', { ascending: false });

        if (error) {
          console.error('Error fetching enrollments:', error);
          setError(error.message);
        } else {
          console.log('Enrollments fetched:', data?.length || 0);
          setEnrollments(data || []);
        }
      } catch (err: any) {
        console.error('Error fetching enrollments:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEnrollments();
  }, [user]);

  const enrollInCourse = async (courseId: string) => {
    if (!user) return { error: 'User not authenticated' };

    try {
      console.log('Enrolling user', user.id, 'in course', courseId);
      const { data, error } = await supabase
        .from('enrollments')
        .insert({
          student_id: user.id,
          course_id: courseId,
          status: 'active'
        })
        .select()
        .single();

      if (error) {
        console.error('Error enrolling in course:', error);
        return { error: error.message };
      }

      console.log('Enrollment successful:', data);
      setEnrollments(prev => [data, ...prev]);
      return { data, error: null };
    } catch (err: any) {
      console.error('Error enrolling in course:', err);
      return { error: err.message };
    }
  };

  return { enrollments, loading, error, enrollInCourse };
};
