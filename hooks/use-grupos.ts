"use client"

import { useState, useEffect } from "react"
import { createClientComponentClient } from "@/lib/supabase-client"
import type { Database } from "@/lib/database.types"
import { useAuth } from "@/contexts/auth-context"

type Grupo = Database["public"]["Tables"]["grupos"]["Row"]
type GrupoInsert = Database["public"]["Tables"]["grupos"]["Insert"]
type GrupoUpdate = Database["public"]["Tables"]["grupos"]["Update"]

type GrupoConCiclo = Grupo & {
  ciclos_escolares: {
    nombre: string
    fecha_inicio: string
    fecha_fin: string
    activo: boolean
  }
}

export function useGrupos() {
  const [grupos, setGrupos] = useState<GrupoConCiclo[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const { userData } = useAuth()
  const supabase = createClientComponentClient()

  useEffect(() => {
    const fetchGrupos = async () => {
      try {
        setLoading(true)

        let query = supabase
          .from("grupos")
          .select(`
            *,
            ciclos_escolares (
              nombre,
              fecha_inicio,
              fecha_fin,
              activo
            )
          `)
          .order("grado")
          .order("seccion")

        // Si el usuario es un alumno, solo puede ver su propio grupo
        if (userData?.rol === "alumno") {
          const { data: alumnoData } = await supabase
            .from("alumnos")
            .select("grupo_id")
            .eq("usuario_id", userData.id)
            .single()

          if (alumnoData?.grupo_id) {
            query = query.eq("id", alumnoData.grupo_id)
          }
        }
        // Si es profesor, solo ve los grupos asignados
        else if (userData?.rol === "profesor") {
          const { data: profesorData } = await supabase
            .from("profesores")
            .select("id")
            .eq("usuario_id", userData.id)
            .single()

          if (profesorData) {
            // Obtenemos los grupos asignados al profesor
            const { data: asignacionesData } = await supabase
              .from("asignaciones")
              .select("grupo_id")
              .eq("profesor_id", profesorData.id)

            if (asignacionesData && asignacionesData.length > 0) {
              const grupoIds = asignacionesData.map((a) => a.grupo_id)
              query = query.in("id", grupoIds)
            }
          }
        }

        const { data, error } = await query

        if (error) {
          throw error
        }

        setGrupos(data || [])
      } catch (error) {
        console.error("Error al obtener grupos:", error)
        setError(error as Error)
      } finally {
        setLoading(false)
      }
    }

    if (userData) {
      fetchGrupos()
    }
  }, [supabase, userData])

  const agregarGrupo = async (grupo: GrupoInsert) => {
    try {
      const { data, error } = await supabase
        .from("grupos")
        .insert(grupo)
        .select(`
          *,
          ciclos_escolares (
            nombre,
            fecha_inicio,
            fecha_fin,
            activo
          )
        `)
        .single()

      if (error) {
        throw error
      }

      setGrupos((prev) => [...prev, data])
      return data
    } catch (error) {
      console.error("Error al agregar grupo:", error)
      throw error
    }
  }

  const actualizarGrupo = async (id: string, updates: GrupoUpdate) => {
    try {
      const { data, error } = await supabase
        .from("grupos")
        .update(updates)
        .eq("id", id)
        .select(`
          *,
          ciclos_escolares (
            nombre,
            fecha_inicio,
            fecha_fin,
            activo
          )
        `)
        .single()

      if (error) {
        throw error
      }

      setGrupos((prev) => prev.map((grupo) => (grupo.id === id ? data : grupo)))
      return data
    } catch (error) {
      console.error("Error al actualizar grupo:", error)
      throw error
    }
  }

  const eliminarGrupo = async (id: string) => {
    try {
      const { error } = await supabase.from("grupos").delete().eq("id", id)

      if (error) {
        throw error
      }

      setGrupos((prev) => prev.filter((grupo) => grupo.id !== id))
    } catch (error) {
      console.error("Error al eliminar grupo:", error)
      throw error
    }
  }

  return {
    grupos,
    loading,
    error,
    agregarGrupo,
    actualizarGrupo,
    eliminarGrupo,
  }
}
