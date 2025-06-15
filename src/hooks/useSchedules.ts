
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface Schedule {
  id: string;
  course_id: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
  location: string | null;
  semester: string | null;
  year: number | null;
  created_at: string | null;
  updated_at: string | null;
  course?: {
    title: string;
    code: string;
    instructor_id: string | null;
  };
}

export const useSchedules = () => {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchSchedules = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        console.log('Fetching schedules for user:', user.id);
        
        // First get user's enrolled courses
        const { data: enrollments, error: enrollmentError } = await supabase
          .from('enrollments')
          .select('course_id')
          .eq('student_id', user.id)
          .eq('status', 'active');

        if (enrollmentError) {
          console.error('Error fetching enrollments:', enrollmentError);
          setError(enrollmentError.message);
          setLoading(false);
          return;
        }

        const courseIds = enrollments?.map(e => e.course_id) || [];
        
        if (courseIds.length === 0) {
          console.log('No enrolled courses found');
          setSchedules([]);
          setLoading(false);
          return;
        }

        // Then get schedules for those courses
        const { data, error } = await supabase
          .from('schedules')
          .select(`
            *,
            course:courses(title, code, instructor_id)
          `)
          .in('course_id', courseIds)
          .order('day_of_week')
          .order('start_time');

        if (error) {
          console.error('Error fetching schedules:', error);
          setError(error.message);
        } else {
          console.log('Schedules fetched:', data?.length || 0);
          setSchedules(data || []);
        }
      } catch (err: any) {
        console.error('Error fetching schedules:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSchedules();
  }, [user]);

  return { schedules, loading, error };
};
