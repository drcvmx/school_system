"use client"

import { useState, useEffect } from "react"
import { createClientComponentClient } from "@/lib/supabase-client"
import type { Database } from "@/lib/database.types"
import { useAuth } from "@/contexts/auth-context"

type Alumno = Database["public"]["Tables"]["alumnos"]["Row"]
type AlumnoInsert = Database["public"]["Tables"]["alumnos"]["Insert"]
type AlumnoUpdate = Database["public"]["Tables"]["alumnos"]["Update"]

type AlumnoConGrupo = Alumno & {
  grupos: {
    grado: number
    seccion: string
    ciclos_escolares: {
      nombre: string
    }
  } | null
}

export function useAlumnos() {
  const [alumnos, setAlumnos] = useState<AlumnoConGrupo[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const { userData } = useAuth()
  const supabase = createClientComponentClient()

  useEffect(() => {
    const fetchAlumnos = async () => {
      try {
        setLoading(true)

        let query = supabase
          .from("alumnos")
          .select(`
            *,
            grupos (
              grado,
              seccion,
              ciclos_escolares (
                nombre
              )
            )
          `)
          .order("apellido_paterno")

        // Si el usuario es un alumno, solo puede ver su propia información
        if (userData?.rol === "alumno") {
          query = query.eq("usuario_id", userData.id)
        }

        const { data, error } = await query

        if (error) {
          throw error
        }

        setAlumnos(data || [])
      } catch (error) {
        console.error("Error al obtener alumnos:", error)
        setError(error as Error)
      } finally {
        setLoading(false)
      }
    }

    if (userData) {
      fetchAlumnos()
    }
  }, [supabase, userData])

  const agregarAlumno = async (alumno: AlumnoInsert, password: string) => {
    try {
      // Primero creamos el usuario en auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: alumno.curp.toLowerCase() + "@escuela.edu", // Usamos el CURP como parte del email
        password: password,
      })

      if (authError) {
        throw authError
      }

      if (!authData.user) {
        throw new Error("No se pudo crear el usuario")
      }

      // Luego creamos el registro en la tabla usuarios
      const { error: userError } = await supabase.from("usuarios").insert({
        id: authData.user.id,
        email: authData.user.email!,
        password: password, // En producción, no almacenaríamos la contraseña en texto plano
        rol: "alumno",
      })

      if (userError) {
        throw userError
      }

      // Finalmente creamos el registro del alumno
      const { data, error } = await supabase
        .from("alumnos")
        .insert({
          ...alumno,
          usuario_id: authData.user.id,
        })
        .select(`
          *,
          grupos (
            grado,
            seccion,
            ciclos_escolares (
              nombre
            )
          )
        `)
        .single()

      if (error) {
        throw error
      }

      setAlumnos((prev) => [...prev, data])
      return data
    } catch (error) {
      console.error("Error al agregar alumno:", error)
      throw error
    }
  }

  const actualizarAlumno = async (id: string, updates: AlumnoUpdate) => {
    try {
      const { data, error } = await supabase
        .from("alumnos")
        .update(updates)
        .eq("id", id)
        .select(`
          *,
          grupos (
            grado,
            seccion,
            ciclos_escolares (
              nombre
            )
          )
        `)
        .single()

      if (error) {
        throw error
      }

      setAlumnos((prev) => prev.map((alumno) => (alumno.id === id ? data : alumno)))
      return data
    } catch (error) {
      console.error("Error al actualizar alumno:", error)
      throw error
    }
  }

  const eliminarAlumno = async (id: string) => {
    try {
      // Primero obtenemos el usuario_id
      const { data: alumnoData, error: alumnoError } = await supabase
        .from("alumnos")
        .select("usuario_id")
        .eq("id", id)
        .single()

      if (alumnoError) {
        throw alumnoError
      }

      // Eliminamos el alumno
      const { error } = await supabase.from("alumnos").delete().eq("id", id)

      if (error) {
        throw error
      }

      // Eliminamos el usuario
      if (alumnoData?.usuario_id) {
        const { error: userError } = await supabase.from("usuarios").delete().eq("id", alumnoData.usuario_id)

        if (userError) {
          throw userError
        }

        // En un entorno real, también eliminaríamos el usuario de auth
        // Esto requiere una función serverless o un endpoint de API
      }

      setAlumnos((prev) => prev.filter((alumno) => alumno.id !== id))
    } catch (error) {
      console.error("Error al eliminar alumno:", error)
      throw error
    }
  }

  return {
    alumnos,
    loading,
    error,
    agregarAlumno,
    actualizarAlumno,
    eliminarAlumno,
  }
}
