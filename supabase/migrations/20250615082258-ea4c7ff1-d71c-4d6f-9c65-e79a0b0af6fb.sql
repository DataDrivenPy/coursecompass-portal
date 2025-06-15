
-- Create a table for student grades
CREATE TABLE public.grades (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID REFERENCES auth.users NOT NULL,
  course_id UUID REFERENCES public.courses(id) NOT NULL,
  assignment_id UUID REFERENCES public.assignments(id),
  grade_value DECIMAL(5,2) NOT NULL,
  grade_letter TEXT,
  points_earned INTEGER,
  points_possible INTEGER,
  graded_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create a table for class schedules
CREATE TABLE public.schedules (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  course_id UUID REFERENCES public.courses(id) NOT NULL,
  day_of_week INTEGER NOT NULL, -- 0 = Sunday, 1 = Monday, etc.
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  location TEXT,
  semester TEXT,
  year INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS for grades table
ALTER TABLE public.grades ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for grades
CREATE POLICY "Students can view their own grades" 
  ON public.grades 
  FOR SELECT 
  USING (auth.uid() = student_id);

CREATE POLICY "Faculty can view grades for their courses" 
  ON public.grades 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.courses 
      WHERE courses.id = grades.course_id 
      AND courses.instructor_id = auth.uid()
    )
  );

CREATE POLICY "Faculty can insert grades for their courses" 
  ON public.grades 
  FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.courses 
      WHERE courses.id = grades.course_id 
      AND courses.instructor_id = auth.uid()
    )
  );

CREATE POLICY "Faculty can update grades for their courses" 
  ON public.grades 
  FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM public.courses 
      WHERE courses.id = grades.course_id 
      AND courses.instructor_id = auth.uid()
    )
  );

-- Enable RLS for schedules table
ALTER TABLE public.schedules ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for schedules
CREATE POLICY "Everyone can view schedules" 
  ON public.schedules 
  FOR SELECT 
  USING (true);

CREATE POLICY "Faculty can manage schedules for their courses" 
  ON public.schedules 
  FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM public.courses 
      WHERE courses.id = schedules.course_id 
      AND courses.instructor_id = auth.uid()
    )
  );

-- Add some sample data for testing
INSERT INTO public.schedules (course_id, day_of_week, start_time, end_time, location, semester, year)
SELECT 
  id,
  1, -- Monday
  '09:00:00'::TIME,
  '10:30:00'::TIME,
  'Room 101',
  'Fall',
  2024
FROM public.courses
LIMIT 3;

INSERT INTO public.schedules (course_id, day_of_week, start_time, end_time, location, semester, year)
SELECT 
  id,
  3, -- Wednesday
  '09:00:00'::TIME,
  '10:30:00'::TIME,
  'Room 101',
  'Fall',
  2024
FROM public.courses
LIMIT 3;
