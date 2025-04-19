-- Create tables
CREATE TABLE students (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  grade TEXT NOT NULL,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  enrollment_date DATE DEFAULT CURRENT_DATE
);

CREATE TABLE teachers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  subject TEXT NOT NULL,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  hire_date DATE DEFAULT CURRENT_DATE
);

CREATE TABLE grades (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  teacher_id UUID NOT NULL REFERENCES teachers(id) ON DELETE CASCADE,
  subject TEXT NOT NULL,
  value NUMERIC(3,1) NOT NULL CHECK (value >= 0 AND value <= 10),
  date DATE DEFAULT CURRENT_DATE
);

-- Create indexes
CREATE INDEX idx_students_name ON students(name);
CREATE INDEX idx_teachers_name ON teachers(name);
CREATE INDEX idx_grades_student_id ON grades(student_id);
CREATE INDEX idx_grades_teacher_id ON grades(teacher_id);
CREATE INDEX idx_grades_subject ON grades(subject);

-- Set up Row Level Security (RLS)
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE teachers ENABLE ROW LEVEL SECURITY;
ALTER TABLE grades ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Admin can do everything
CREATE POLICY "Admins have full access to students" ON students
  FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Admins have full access to teachers" ON teachers
  FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Admins have full access to grades" ON grades
  FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

-- Teachers can view all students
CREATE POLICY "Teachers can view students" ON students
  FOR SELECT USING (auth.jwt() ->> 'role' = 'teacher');

-- Teachers can view other teachers
CREATE POLICY "Teachers can view other teachers" ON teachers
  FOR SELECT USING (auth.jwt() ->> 'role' = 'teacher');

-- Teachers can view, insert and update grades
CREATE POLICY "Teachers can view all grades" ON grades
  FOR SELECT USING (auth.jwt() ->> 'role' = 'teacher');

CREATE POLICY "Teachers can insert grades" ON grades
  FOR INSERT WITH CHECK (auth.jwt() ->> 'role' = 'teacher');

CREATE POLICY "Teachers can update their own grades" ON grades
  FOR UPDATE USING (
    auth.jwt() ->> 'role' = 'teacher' AND
    teacher_id = (SELECT id FROM teachers WHERE email = auth.jwt() ->> 'email')
  );

-- Students can only view their own data and grades
CREATE POLICY "Students can view their own data" ON students
  FOR SELECT USING (
    auth.jwt() ->> 'role' = 'student' AND
    email = auth.jwt() ->> 'email'
  );

CREATE POLICY "Students can view their own grades" ON grades
  FOR SELECT USING (
    auth.jwt() ->> 'role' = 'student' AND
    student_id = (SELECT id FROM students WHERE email = auth.jwt() ->> 'email')
  );

-- Create function to calculate average grade
CREATE OR REPLACE FUNCTION calculate_average_grade(student_id UUID)
RETURNS NUMERIC AS $$
DECLARE
  avg_grade NUMERIC;
BEGIN
  SELECT AVG(value) INTO avg_grade
  FROM grades
  WHERE grades.student_id = calculate_average_grade.student_id;
  
  RETURN avg_grade;
END;
$$ LANGUAGE plpgsql;
