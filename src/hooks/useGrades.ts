
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface Grade {
  id: string;
  student_id: string;
  course_id: string;
  assignment_id: string | null;
  grade_value: number;
  grade_letter: string | null;
  points_earned: number | null;
  points_possible: number | null;
  graded_at: string | null;
  created_at: string | null;
  updated_at: string | null;
  course?: {
    title: string;
    code: string;
  };
  assignment?: {
    title: string;
  };
}

export const useGrades = () => {
  const [grades, setGrades] = useState<Grade[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchGrades = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        console.log('Fetching grades for user:', user.id);
        const { data, error } = await supabase
          .from('grades')
          .select(`
            *,
            course:courses(title, code),
            assignment:assignments(title)
          `)
          .eq('student_id', user.id)
          .order('graded_at', { ascending: false });

        if (error) {
          console.error('Error fetching grades:', error);
          setError(error.message);
        } else {
          console.log('Grades fetched:', data?.length || 0);
          setGrades(data || []);
        }
      } catch (err: any) {
        console.error('Error fetching grades:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchGrades();
  }, [user]);

  return { grades, loading, error };
};
