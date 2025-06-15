
-- First, let's drop all existing policies to start fresh
DROP POLICY IF EXISTS "Students can view own enrollments" ON public.enrollments;
DROP POLICY IF EXISTS "Faculty can view course enrollments" ON public.enrollments;
DROP POLICY IF EXISTS "Students can enroll themselves" ON public.enrollments;
DROP POLICY IF EXISTS "Students can view course assignments" ON public.assignments;
DROP POLICY IF EXISTS "Faculty can manage assignments" ON public.assignments;
DROP POLICY IF EXISTS "Students can view own submissions" ON public.submissions;
DROP POLICY IF EXISTS "Students can create submissions" ON public.submissions;
DROP POLICY IF EXISTS "Students can update own submissions" ON public.submissions;
DROP POLICY IF EXISTS "Faculty can manage all submissions" ON public.submissions;
DROP POLICY IF EXISTS "Users can view own notifications" ON public.notifications;
DROP POLICY IF EXISTS "Users can update own notifications" ON public.notifications;
DROP POLICY IF EXISTS "System can create notifications" ON public.notifications;
DROP POLICY IF EXISTS "Everyone can view active courses" ON public.courses;
DROP POLICY IF EXISTS "Faculty can manage courses" ON public.courses;

-- Create a security definer function to get current user role without recursion
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS TEXT AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for courses
CREATE POLICY "Everyone can view active courses" ON public.courses
  FOR SELECT USING (status = 'active');

CREATE POLICY "Faculty can manage courses" ON public.courses
  FOR ALL USING (public.get_current_user_role() IN ('faculty', 'admin'));

-- Create RLS policies for enrollments
CREATE POLICY "Students can view own enrollments" ON public.enrollments
  FOR SELECT USING (student_id = auth.uid());

CREATE POLICY "Faculty can view course enrollments" ON public.enrollments
  FOR SELECT USING (
    public.get_current_user_role() IN ('faculty', 'admin') OR 
    student_id = auth.uid()
  );

CREATE POLICY "Students can enroll themselves" ON public.enrollments
  FOR INSERT WITH CHECK (student_id = auth.uid());

-- Create RLS policies for assignments
CREATE POLICY "Students can view course assignments" ON public.assignments
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.enrollments 
      WHERE course_id = assignments.course_id 
      AND student_id = auth.uid()
    ) OR public.get_current_user_role() IN ('faculty', 'admin')
  );

CREATE POLICY "Faculty can manage assignments" ON public.assignments
  FOR ALL USING (public.get_current_user_role() IN ('faculty', 'admin'));

-- Create RLS policies for submissions
CREATE POLICY "Students can view own submissions" ON public.submissions
  FOR SELECT USING (student_id = auth.uid() OR public.get_current_user_role() IN ('faculty', 'admin'));

CREATE POLICY "Students can create submissions" ON public.submissions
  FOR INSERT WITH CHECK (student_id = auth.uid());

CREATE POLICY "Students can update own submissions" ON public.submissions
  FOR UPDATE USING (student_id = auth.uid());

CREATE POLICY "Faculty can manage all submissions" ON public.submissions
  FOR ALL USING (public.get_current_user_role() IN ('faculty', 'admin'));

-- Create RLS policies for notifications
CREATE POLICY "Users can view own notifications" ON public.notifications
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can update own notifications" ON public.notifications
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "System can create notifications" ON public.notifications
  FOR INSERT WITH CHECK (true);

-- Update the trigger function to handle new user profiles
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'first_name', '') || ' ' || COALESCE(NEW.raw_user_meta_data->>'last_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'role', 'student')
  );
  RETURN NEW;
END;
$$;

-- Recreate the trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Add some sample data for testing
INSERT INTO public.courses (title, code, description, department, semester, year, status) 
VALUES 
  ('Introduction to Computer Science', 'CS101', 'Basic programming concepts and problem solving', 'Computer Science', 'Fall', 2024, 'active'),
  ('Data Structures and Algorithms', 'CS201', 'Advanced programming concepts and algorithm design', 'Computer Science', 'Spring', 2024, 'active'),
  ('Web Development', 'CS301', 'Modern web development with React and Node.js', 'Computer Science', 'Fall', 2024, 'active')
ON CONFLICT DO NOTHING;

-- Add some sample assignments
INSERT INTO public.assignments (title, description, course_id, due_date, points, status)
SELECT 
  'Assignment 1: Hello World',
  'Create a simple hello world program',
  c.id,
  NOW() + INTERVAL '7 days',
  100,
  'published'
FROM public.courses c 
WHERE c.code = 'CS101'
ON CONFLICT DO NOTHING;

INSERT INTO public.assignments (title, description, course_id, due_date, points, status)
SELECT 
  'Assignment 2: Variables and Functions',
  'Learn about variables and function declarations',
  c.id,
  NOW() + INTERVAL '14 days',
  150,
  'published'
FROM public.courses c 
WHERE c.code = 'CS101'
ON CONFLICT DO NOTHING;
