-- Habilitar la extensión UUID si no está habilitada
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Crear ciclo escolar
INSERT INTO ciclos_escolares (id, nombre, fecha_inicio, fecha_fin, activo)
VALUES 
  ('ciclo_001', '2024-2025', '2024-08-01', '2025-07-31', true)
ON CONFLICT (id) DO NOTHING;

-- Crear grupo
INSERT INTO grupos (id, grado, seccion, ciclo_escolar_id)
VALUES 
  ('grupo_001', 2, 'A', 'ciclo_001')
ON CONFLICT (id) DO NOTHING;

-- Crear usuarios
INSERT INTO usuarios (id, email, password, rol)
VALUES 
  ('usr_001', 'admin@escuela.com', '123', 'admin'),
  ('usr_002', 'profe_math@escuela.com', '123', 'profesor'),
  ('usr_003', 'profe_ciencias@escuela.com', '123', 'profesor'),
  ('usr_004', 'profe_historia@escuela.com', '123', 'profesor'),
  ('usr_005', 'alumno1@escuela.com', '123', 'alumno'),
  ('usr_006', 'alumno2@escuela.com', '123', 'alumno'),
  ('usr_007', 'alumno3@escuela.com', '123', 'alumno'),
  ('usr_008', 'alumno4@escuela.com', '123', 'alumno'),
  ('usr_009', 'alumno5@escuela.com', '123', 'alumno')
ON CONFLICT (id) DO NOTHING;

-- Crear profesores
INSERT INTO profesores (id, nombre, apellido_paterno, apellido_materno, especialidad, usuario_id)
VALUES 
  ('prof_001', 'Juan', 'Pérez', 'García', 'Matemáticas', 'usr_002'),
  ('prof_002', 'María', 'López', 'Sánchez', 'Ciencias', 'usr_003'),
  ('prof_003', 'Carlos', 'Gómez', 'Rodríguez', 'Historia', 'usr_004')
ON CONFLICT (id) DO NOTHING;

-- Crear materias
INSERT INTO materias (id, nombre, creditos)
VALUES 
  ('mat_001', 'Matemáticas 2°', 5),
  ('mat_002', 'Ciencias 2°', 4),
  ('mat_003', 'Historia 2°', 3)
ON CONFLICT (id) DO NOTHING;

-- Crear alumnos
INSERT INTO alumnos (id, nombre, apellido_paterno, apellido_materno, curp, fecha_nacimiento, grupo_id, usuario_id)
VALUES 
  ('alu_001', 'Ana', 'Torres', 'Vega', 'CURP_ANA123', '2012-05-15', 'grupo_001', 'usr_005'),
  ('alu_002', 'Luis', 'Méndez', 'Ortiz', 'CURP_LUIS456', '2012-07-22', 'grupo_001', 'usr_006'),
  ('alu_003', 'Sofía', 'Ruiz', 'Jiménez', 'CURP_SOFI789', '2012-03-10', 'grupo_001', 'usr_007'),
  ('alu_004', 'Pedro', 'Díaz', 'Morales', 'CURP_PEDRO012', '2012-11-05', 'grupo_001', 'usr_008'),
  ('alu_005', 'Elena', 'Castro', 'Flores', 'CURP_ELENA345', '2012-09-18', 'grupo_001', 'usr_009')
ON CONFLICT (id) DO NOTHING;

-- Crear periodos de evaluación
INSERT INTO periodos_evaluacion (id, nombre, ciclo_escolar_id, fecha_inicio, fecha_fin)
VALUES 
  ('periodo_001', 'Primer Parcial', 'ciclo_001', '2024-08-01', '2024-10-31'),
  ('periodo_002', 'Segundo Parcial', 'ciclo_001', '2024-11-01', '2025-01-31'),
  ('periodo_003', 'Evaluación Final', 'ciclo_001', '2025-02-01', '2025-04-30')
ON CONFLICT (id) DO NOTHING;

-- Crear asignaciones (profesor-materia-grupo)
INSERT INTO asignaciones (id, profesor_id, materia_id, grupo_id, ciclo_escolar_id)
VALUES 
  ('asig_001', 'prof_001', 'mat_001', 'grupo_001', 'ciclo_001'),
  ('asig_002', 'prof_002', 'mat_002', 'grupo_001', 'ciclo_001'),
  ('asig_003', 'prof_003', 'mat_003', 'grupo_001', 'ciclo_001')
ON CONFLICT (id) DO NOTHING;

-- Crear calificaciones
INSERT INTO calificaciones (id, alumno_id, asignacion_id, periodo_id, calificacion, observaciones)
VALUES 
  -- Ana Torres - Matemáticas
  ('cal_001', 'alu_001', 'asig_001', 'periodo_001', 8.5, 'Buen desempeño'),
  ('cal_002', 'alu_001', 'asig_001', 'periodo_002', 9.0, 'Excelente participación'),
  ('cal_003', 'alu_001', 'asig_001', 'periodo_003', 8.7, 'Muy buen trabajo final'),
  
  -- Luis Méndez - Matemáticas
  ('cal_004', 'alu_002', 'asig_001', 'periodo_001', 7.0, 'Necesita mejorar en álgebra'),
  ('cal_005', 'alu_002', 'asig_001', 'periodo_002', 8.5, 'Ha mejorado notablemente'),
  ('cal_006', 'alu_002', 'asig_001', 'periodo_003', 7.8, 'Buen esfuerzo en el examen final'),
  
  -- Sofía Ruiz - Ciencias
  ('cal_007', 'alu_003', 'asig_002', 'periodo_001', 9.5, 'Excelente comprensión de conceptos'),
  ('cal_008', 'alu_003', 'asig_002', 'periodo_002', 9.0, 'Muy buenas prácticas de laboratorio'),
  ('cal_009', 'alu_003', 'asig_002', 'periodo_003', 9.2, 'Proyecto final sobresaliente'),
  
  -- Pedro Díaz - Ciencias
  ('cal_010', 'alu_004', 'asig_002', 'periodo_001', 6.5, 'Debe mejorar su atención en clase'),
  ('cal_011', 'alu_004', 'asig_002', 'periodo_002', 7.0, 'Ha mostrado más interés'),
  ('cal_012', 'alu_004', 'asig_002', 'periodo_003', 6.8, 'Aprobado con observaciones'),
  
  -- Elena Castro - Historia
  ('cal_013', 'alu_005', 'asig_003', 'periodo_001', 10.0, 'Dominio excepcional del tema'),
  ('cal_014', 'alu_005', 'asig_003', 'periodo_002', 9.5, 'Excelentes ensayos'),
  ('cal_015', 'alu_005', 'asig_003', 'periodo_003', 9.8, 'Trabajo final destacado')
ON CONFLICT (id) DO NOTHING;
