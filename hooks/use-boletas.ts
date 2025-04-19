"use client"

import { useState, useEffect } from "react"
import { createClientComponentClient } from "@/lib/supabase-client"
import type { Database } from "@/lib/database.types"
import { useAuth } from "@/contexts/auth-context"

type VistaBoleta = Database["public"]["Views"]["vista_boletas"]["Row"]

type BoletaAgrupada = {
  alumno_id: string
  nombre_alumno: string
  grupo: string
  ciclo_escolar: string
  ciclo_escolar_id: string
  materias: {
    materia_id: string
    materia: string
    promedio: number | null
  }[]
  promedio_general: number | null
}

export function useBoletas() {
  const [boletas, setBoletas] = useState<BoletaAgrupada[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const { userData } = useAuth()
  const supabase = createClientComponentClient()

  useEffect(() => {
    const fetchBoletas = async () => {
      try {
        setLoading(true)

        if (!userData) return

        let query = supabase.from("vista_boletas").select("*")

        // Filtrar según el rol del usuario
        if (userData.rol === "alumno") {
          // Si es alumno, solo ve su propia boleta
          const { data: alumnoData } = await supabase
            .from("alumnos")
            .select("id")
            .eq("usuario_id", userData.id)
            .single()

          if (alumnoData) {
            query = query.eq("alumno_id", alumnoData.id)
          }
        } else if (userData.rol === "profesor") {
          // Si es profesor, solo ve las boletas de sus grupos
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
              // Obtenemos los alumnos de esos grupos
              const grupoIds = asignacionesData.map((a) => a.grupo_id)
              const { data: alumnosData } = await supabase.from("alumnos").select("id").in("grupo_id", grupoIds)

              if (alumnosData && alumnosData.length > 0) {
                const alumnoIds = alumnosData.map((a) => a.id)
                query = query.in("alumno_id", alumnoIds)
              }
            }
          }
        }

        const { data, error } = await query

        if (error) {
          throw error
        }

        // Agrupar los datos por alumno
        const boletasAgrupadas: BoletaAgrupada[] = []

        if (data) {
          // Agrupar por alumno_id
          const alumnosMap = new Map<string, VistaBoleta[]>()

          data.forEach((item) => {
            if (!alumnosMap.has(item.alumno_id)) {
              alumnosMap.set(item.alumno_id, [])
            }
            alumnosMap.get(item.alumno_id)?.push(item)
          })

          // Convertir el mapa a un array de boletas agrupadas
          alumnosMap.forEach((items, alumnoId) => {
            if (items.length > 0) {
              const primerItem = items[0]

              // Calcular promedio general
              const promedios = items.map((item) => item.promedio_materia).filter((p) => p !== null) as number[]
              const promedioGeneral =
                promedios.length > 0 ? promedios.reduce((sum, p) => sum + p, 0) / promedios.length : null

              boletasAgrupadas.push({
                alumno_id: alumnoId,
                nombre_alumno: primerItem.nombre_alumno,
                grupo: primerItem.grupo,
                ciclo_escolar: primerItem.ciclo_escolar,
                ciclo_escolar_id: primerItem.ciclo_escolar_id,
                materias: items.map((item) => ({
                  materia_id: item.materia_id,
                  materia: item.materia,
                  promedio: item.promedio_materia,
                })),
                promedio_general: promedioGeneral,
              })
            }
          })
        }

        setBoletas(boletasAgrupadas)
      } catch (error) {
        console.error("Error al obtener boletas:", error)
        setError(error as Error)
      } finally {
        setLoading(false)
      }
    }

    if (userData) {
      fetchBoletas()
    }
  }, [supabase, userData])

  // Función para generar PDF de boleta (simulada)
  const generarPDFBoleta = async (alumnoId: string) => {
    try {
      // En una implementación real, aquí se generaría el PDF
      // Podríamos usar una librería como jsPDF o pdfmake
      // O hacer una llamada a una API que genere el PDF

      // Por ahora, solo simulamos la generación
      const boleta = boletas.find((b) => b.alumno_id === alumnoId)

      if (!boleta) {
        throw new Error("No se encontró la boleta del alumno")
      }

      // Simulamos un tiempo de generación
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // En una implementación real, aquí devolveríamos la URL del PDF o el blob
      return {
        success: true,
        message: `Boleta de ${boleta.nombre_alumno} generada correctamente`,
        // url: "https://ejemplo.com/boletas/alumno123.pdf"
      }
    } catch (error) {
      console.error("Error al generar PDF de boleta:", error)
      throw error
    }
  }

  return {
    boletas,
    loading,
    error,
    generarPDFBoleta,
  }
}
