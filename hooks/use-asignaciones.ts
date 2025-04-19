"use client"

import { useState, useEffect } from "react"
import { createClientComponentClient } from "@/lib/supabase-client"
import { useAuth } from "@/contexts/auth-context"

type Asignacion = {
  id: string
  profesor_id: string
  materia_id: string
  grupo_id: string
  ciclo_escolar_id: string
  materia?: {
    id: string
    nombre: string
  }
  grupo?: {
    id: string
    grado: number
    seccion: string
    ciclo_escolar?: {
      id: string
      nombre: string
    }
  }
}

export function useAsignaciones() {
  const [asignaciones, setAsignaciones] = useState<Asignacion[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const { user } = useAuth()
  const supabase = createClientComponentClient()

  useEffect(() => {
    const fetchAsignaciones = async () => {
      if (!user) return

      try {
        setLoading(true)

        // En un entorno real, obtendríamos el ID del profesor desde el usuario autenticado
        // Para este ejemplo, usaremos un ID fijo del profesor de la semilla de datos
        let profesorId = "prof_001"

        // Si estamos en un entorno real, obtendríamos el ID del profesor desde la base de datos
        if (user.role === "profesor") {
          const { data: profesorData } = await supabase
            .from("profesores")
            .select("id")
            .eq("usuario_id", user.id)
            .single()

          if (profesorData) {
            profesorId = profesorData.id
          }
        }

        const { data, error } = await supabase
          .from("asignaciones")
          .select(`
            id,
            profesor_id,
            materia_id,
            grupo_id,
            ciclo_escolar_id,
            materias (
              id,
              nombre
            ),
            grupos (
              id,
              grado,
              seccion,
              ciclos_escolares (
                id,
                nombre
              )
            )
          `)
          .eq("profesor_id", profesorId)

        if (error) throw error

        setAsignaciones(data || [])
      } catch (error) {
        console.error("Error al obtener asignaciones:", error)
        setError(error as Error)
      } finally {
        setLoading(false)
      }
    }

    fetchAsignaciones()
  }, [supabase, user])

  // Función para obtener grupos únicos de las asignaciones
  const getGruposUnicos = () => {
    const gruposMap = new Map()

    asignaciones.forEach((asignacion) => {
      if (asignacion.grupo && !gruposMap.has(asignacion.grupo.id)) {
        gruposMap.set(asignacion.grupo.id, {
          id: asignacion.grupo.id,
          grado: asignacion.grupo.grado,
          seccion: asignacion.grupo.seccion,
          ciclo_escolar: asignacion.grupo.ciclo_escolar,
        })
      }
    })

    return Array.from(gruposMap.values())
  }

  // Función para obtener materias por grupo
  const getMateriasPorGrupo = (grupoId: string) => {
    const materiasMap = new Map()

    asignaciones
      .filter((asignacion) => asignacion.grupo_id === grupoId)
      .forEach((asignacion) => {
        if (asignacion.materia && !materiasMap.has(asignacion.materia.id)) {
          materiasMap.set(asignacion.materia.id, {
            id: asignacion.materia.id,
            nombre: asignacion.materia.nombre,
          })
        }
      })

    return Array.from(materiasMap.values())
  }

  // Función para obtener una asignación específica
  const getAsignacion = (grupoId: string, materiaId: string) => {
    return asignaciones.find((asignacion) => asignacion.grupo_id === grupoId && asignacion.materia_id === materiaId)
  }

  return {
    asignaciones,
    loading,
    error,
    getGruposUnicos,
    getMateriasPorGrupo,
    getAsignacion,
  }
}
