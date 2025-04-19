"use client"

import { useState, useEffect } from "react"
import { createClientComponentClient } from "@/lib/supabase-client"
import type { Database } from "@/lib/database.types"
import { useAuth } from "@/contexts/auth-context"

type Materia = Database["public"]["Tables"]["materias"]["Row"]
type MateriaInsert = Database["public"]["Tables"]["materias"]["Insert"]
type MateriaUpdate = Database["public"]["Tables"]["materias"]["Update"]

export function useMaterias() {
  const [materias, setMaterias] = useState<Materia[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const { userData } = useAuth()
  const supabase = createClientComponentClient()

  useEffect(() => {
    const fetchMaterias = async () => {
      try {
        setLoading(true)

        let query = supabase.from("materias").select("*").order("nombre")

        // Si el usuario es un alumno, solo puede ver las materias de su grupo
        if (userData?.rol === "alumno") {
          const { data: alumnoData } = await supabase
            .from("alumnos")
            .select("grupo_id")
            .eq("usuario_id", userData.id)
            .single()

          if (alumnoData?.grupo_id) {
            // Obtenemos las materias asignadas a su grupo
            const { data: asignacionesData } = await supabase
              .from("asignaciones")
              .select("materia_id")
              .eq("grupo_id", alumnoData.grupo_id)

            if (asignacionesData && asignacionesData.length > 0) {
              const materiaIds = asignacionesData.map((a) => a.materia_id)
              query = query.in("id", materiaIds)
            }
          }
        }
        // Si es profesor, solo ve las materias que imparte
        else if (userData?.rol === "profesor") {
          const { data: profesorData } = await supabase
            .from("profesores")
            .select("id")
            .eq("usuario_id", userData.id)
            .single()

          if (profesorData) {
            // Obtenemos las materias asignadas al profesor
            const { data: asignacionesData } = await supabase
              .from("asignaciones")
              .select("materia_id")
              .eq("profesor_id", profesorData.id)

            if (asignacionesData && asignacionesData.length > 0) {
              const materiaIds = asignacionesData.map((a) => a.materia_id)
              query = query.in("id", materiaIds)
            }
          }
        }

        const { data, error } = await query

        if (error) {
          throw error
        }

        setMaterias(data || [])
      } catch (error) {
        console.error("Error al obtener materias:", error)
        setError(error as Error)
      } finally {
        setLoading(false)
      }
    }

    if (userData) {
      fetchMaterias()
    }
  }, [supabase, userData])

  const agregarMateria = async (materia: MateriaInsert) => {
    try {
      const { data, error } = await supabase.from("materias").insert(materia).select().single()

      if (error) {
        throw error
      }

      setMaterias((prev) => [...prev, data])
      return data
    } catch (error) {
      console.error("Error al agregar materia:", error)
      throw error
    }
  }

  const actualizarMateria = async (id: string, updates: MateriaUpdate) => {
    try {
      const { data, error } = await supabase.from("materias").update(updates).eq("id", id).select().single()

      if (error) {
        throw error
      }

      setMaterias((prev) => prev.map((materia) => (materia.id === id ? data : materia)))
      return data
    } catch (error) {
      console.error("Error al actualizar materia:", error)
      throw error
    }
  }

  const eliminarMateria = async (id: string) => {
    try {
      const { error } = await supabase.from("materias").delete().eq("id", id)

      if (error) {
        throw error
      }

      setMaterias((prev) => prev.filter((materia) => materia.id !== id))
    } catch (error) {
      console.error("Error al eliminar materia:", error)
      throw error
    }
  }

  return {
    materias,
    loading,
    error,
    agregarMateria,
    actualizarMateria,
    eliminarMateria,
  }
}
