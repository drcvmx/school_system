"use client"

import { useState, useEffect } from "react"
import { createClientComponentClient } from "@/lib/supabase-client"
import type { Database } from "@/lib/database.types"
import { useAuth } from "@/contexts/auth-context"

type Calificacion = Database["public"]["Tables"]["calificaciones"]["Row"]
type CalificacionInsert = Database["public"]["Tables"]["calificaciones"]["Insert"]
type CalificacionUpdate = Database["public"]["Tables"]["calificaciones"]["Update"]
type VistaCalificacion = Database["public"]["Views"]["vista_calificaciones_alumnos"]["Row"]

export function useCalificaciones() {
  const [calificaciones, setCalificaciones] = useState<VistaCalificacion[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const { userData, user } = useAuth()
  const supabase = createClientComponentClient()

  useEffect(() => {
    const fetchCalificaciones = async () => {
      try {
        setLoading(true)

        if (!userData) return

        let query = supabase.from("vista_calificaciones_alumnos").select("*")

        // Filtrar según el rol del usuario
        if (userData.rol === "alumno") {
          // Si es alumno, solo ve sus propias calificaciones
          const { data: alumnoData } = await supabase
            .from("alumnos")
            .select("id")
            .eq("usuario_id", userData.id)
            .single()

          if (alumnoData) {
            query = query.eq("alumno_id", alumnoData.id)
          }
        } else if (userData.rol === "profesor") {
          // Si es profesor, solo ve las calificaciones de sus materias asignadas
          const { data: profesorData } = await supabase
            .from("profesores")
            .select("id")
            .eq("usuario_id", userData.id)
            .single()

          if (profesorData) {
            // Obtenemos las asignaciones del profesor
            const { data: asignacionesData } = await supabase
              .from("asignaciones")
              .select("id")
              .eq("profesor_id", profesorData.id)

            if (asignacionesData && asignacionesData.length > 0) {
              const asignacionIds = asignacionesData.map((a) => a.id)
              // Filtramos por las asignaciones del profesor
              query = query.in("asignacion_id", asignacionIds)
            }
          }
        }
        // Si es admin, no aplicamos filtros adicionales

        const { data, error } = await query.order("nombre_alumno")

        if (error) {
          throw error
        }

        setCalificaciones(data || [])
      } catch (error) {
        console.error("Error al obtener calificaciones:", error)
        setError(error as Error)
      } finally {
        setLoading(false)
      }
    }

    if (userData) {
      fetchCalificaciones()
    }
  }, [supabase, userData, user])

  const agregarCalificacion = async (calificacion: CalificacionInsert) => {
    try {
      // Agregamos la calificación con el usuario actual como creador
      const calificacionConUsuario = {
        ...calificacion,
        created_by: user?.id,
        updated_by: user?.id,
      }

      const { data, error } = await supabase.from("calificaciones").insert(calificacionConUsuario).select().single()

      if (error) {
        throw error
      }

      // Obtenemos la calificación con todos los datos relacionados
      const { data: vistaData, error: vistaError } = await supabase
        .from("vista_calificaciones_alumnos")
        .select("*")
        .eq("id", data.id)
        .single()

      if (vistaError) {
        throw vistaError
      }

      setCalificaciones((prev) => [...prev, vistaData])
      return vistaData
    } catch (error) {
      console.error("Error al agregar calificación:", error)
      throw error
    }
  }

  const actualizarCalificacion = async (id: string, updates: CalificacionUpdate) => {
    try {
      // Actualizamos la calificación con el usuario actual
      const updatesConUsuario = {
        ...updates,
        updated_by: user?.id,
      }

      const { data, error } = await supabase
        .from("calificaciones")
        .update(updatesConUsuario)
        .eq("id", id)
        .select()
        .single()

      if (error) {
        throw error
      }

      // Obtenemos la calificación actualizada con todos los datos relacionados
      const { data: vistaData, error: vistaError } = await supabase
        .from("vista_calificaciones_alumnos")
        .select("*")
        .eq("id", data.id)
        .single()

      if (vistaError) {
        throw vistaError
      }

      setCalificaciones((prev) => prev.map((cal) => (cal.id === id ? vistaData : cal)))
      return vistaData
    } catch (error) {
      console.error("Error al actualizar calificación:", error)
      throw error
    }
  }

  const eliminarCalificacion = async (id: string) => {
    try {
      const { error } = await supabase.from("calificaciones").delete().eq("id", id)

      if (error) {
        throw error
      }

      setCalificaciones((prev) => prev.filter((cal) => cal.id !== id))
    } catch (error) {
      console.error("Error al eliminar calificación:", error)
      throw error
    }
  }

  return {
    calificaciones,
    loading,
    error,
    agregarCalificacion,
    actualizarCalificacion,
    eliminarCalificacion,
  }
}
