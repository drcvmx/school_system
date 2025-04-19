export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      usuarios: {
        Row: {
          id: string
          email: string
          password: string
          rol: "admin" | "profesor" | "alumno"
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          password: string
          rol: "admin" | "profesor" | "alumno"
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          password?: string
          rol?: "admin" | "profesor" | "alumno"
          created_at?: string
          updated_at?: string
        }
      }
      ciclos_escolares: {
        Row: {
          id: string
          nombre: string
          fecha_inicio: string
          fecha_fin: string
          activo: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          nombre: string
          fecha_inicio: string
          fecha_fin: string
          activo?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          nombre?: string
          fecha_inicio?: string
          fecha_fin?: string
          activo?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      grupos: {
        Row: {
          id: string
          grado: number
          seccion: string
          ciclo_escolar_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          grado: number
          seccion: string
          ciclo_escolar_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          grado?: number
          seccion?: string
          ciclo_escolar_id?: string
          created_at?: string
          updated_at?: string
        }
      }
      alumnos: {
        Row: {
          id: string
          usuario_id: string
          nombre: string
          apellido_paterno: string
          apellido_materno: string | null
          curp: string
          fecha_nacimiento: string
          grupo_id: string | null
          activo: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          usuario_id: string
          nombre: string
          apellido_paterno: string
          apellido_materno?: string | null
          curp: string
          fecha_nacimiento: string
          grupo_id?: string | null
          activo?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          usuario_id?: string
          nombre?: string
          apellido_paterno?: string
          apellido_materno?: string | null
          curp?: string
          fecha_nacimiento?: string
          grupo_id?: string | null
          activo?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      profesores: {
        Row: {
          id: string
          usuario_id: string
          nombre: string
          apellido_paterno: string
          apellido_materno: string | null
          especialidad: string | null
          activo: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          usuario_id: string
          nombre: string
          apellido_paterno: string
          apellido_materno?: string | null
          especialidad?: string | null
          activo?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          usuario_id?: string
          nombre?: string
          apellido_paterno?: string
          apellido_materno?: string | null
          especialidad?: string | null
          activo?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      materias: {
        Row: {
          id: string
          nombre: string
          creditos: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          nombre: string
          creditos?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          nombre?: string
          creditos?: number
          created_at?: string
          updated_at?: string
        }
      }
      asignaciones: {
        Row: {
          id: string
          profesor_id: string
          materia_id: string
          grupo_id: string
          ciclo_escolar_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          profesor_id: string
          materia_id: string
          grupo_id: string
          ciclo_escolar_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          profesor_id?: string
          materia_id?: string
          grupo_id?: string
          ciclo_escolar_id?: string
          created_at?: string
          updated_at?: string
        }
      }
      periodos_evaluacion: {
        Row: {
          id: string
          nombre: string
          ciclo_escolar_id: string
          fecha_inicio: string
          fecha_fin: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          nombre: string
          ciclo_escolar_id: string
          fecha_inicio: string
          fecha_fin: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          nombre?: string
          ciclo_escolar_id?: string
          fecha_inicio?: string
          fecha_fin?: string
          created_at?: string
          updated_at?: string
        }
      }
      calificaciones: {
        Row: {
          id: string
          alumno_id: string
          asignacion_id: string
          periodo_id: string
          calificacion: number
          observaciones: string | null
          created_at: string
          updated_at: string
          created_by: string | null
          updated_by: string | null
        }
        Insert: {
          id?: string
          alumno_id: string
          asignacion_id: string
          periodo_id: string
          calificacion: number
          observaciones?: string | null
          created_at?: string
          updated_at?: string
          created_by?: string | null
          updated_by?: string | null
        }
        Update: {
          id?: string
          alumno_id?: string
          asignacion_id?: string
          periodo_id?: string
          calificacion?: number
          observaciones?: string | null
          created_at?: string
          updated_at?: string
          created_by?: string | null
          updated_by?: string | null
        }
      }
    }
    Views: {
      vista_calificaciones_alumnos: {
        Row: {
          id: string
          nombre_alumno: string
          alumno_id: string
          materia: string
          materia_id: string
          nombre_profesor: string
          periodo: string
          grupo: string
          ciclo_escolar: string
          calificacion: number
          observaciones: string | null
        }
      }
      vista_boletas: {
        Row: {
          alumno_id: string
          nombre_alumno: string
          grupo: string
          ciclo_escolar: string
          ciclo_escolar_id: string
          materia: string
          materia_id: string
          promedio_materia: number | null
        }
      }
      vista_profesores_materias: {
        Row: {
          profesor_id: string
          nombre_profesor: string
          materia: string
          grupo: string
          ciclo_escolar: string
        }
      }
    }
    Functions: {
      calcular_promedio_alumno_materia: {
        Args: {
          p_alumno_id: string
          p_materia_id: string
          p_ciclo_escolar_id: string
        }
        Returns: number
      }
      calcular_promedio_general: {
        Args: {
          p_alumno_id: string
          p_ciclo_escolar_id: string
        }
        Returns: number
      }
    }
  }
}
