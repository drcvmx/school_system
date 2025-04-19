"use client"

import { useState, useEffect } from "react"
import { createClientComponentClient } from "@/lib/supabase-client"
import type { Database } from "@/lib/database.types"
import { useAuth } from "@/contexts/auth-context"

type Profesor = Database["public"]["Tables"]["profesores"]["Row"]
type ProfesorInsert = Database["public"]["Tables"]["profesores"]["Insert"]
type ProfesorUpdate = Database["public"]["Tables"]["profesores"]["Update"]

export function useProfesores() {
  const [profesores, setProfesores] = useState<Profesor[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const { userData } = useAuth()
  const supabase = createClientComponentClient()

  useEffect(() => {
    const fetchProfesores = async () => {
      try {
        setLoading(true)

        let query = supabase.from("profesores").select("*").order("apellido_paterno")

        // Si el usuario es un profesor, solo puede ver su propia información
        if (userData?.rol === "profesor") {
          query = query.eq("usuario_id", userData.id)
        }

        const { data, error } = await query

        if (error) {
          throw error
        }

        setProfesores(data || [])
      } catch (error) {
        console.error("Error al obtener profesores:", error)
        setError(error as Error)
      } finally {
        setLoading(false)
      }
    }

    if (userData) {
      fetchProfesores()
    }
  }, [supabase, userData])

  const agregarProfesor = async (profesor: ProfesorInsert, password: string) => {
    try {
      // Primero creamos el usuario en auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: profesor.nombre.toLowerCase() + "." + profesor.apellido_paterno.toLowerCase() + "@escuela.edu",
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
        rol: "profesor",
      })

      if (userError) {
        throw userError
      }

      // Finalmente creamos el registro del profesor
      const { data, error } = await supabase
        .from("profesores")
        .insert({
          ...profesor,
          usuario_id: authData.user.id,
        })
        .select()
        .single()

      if (error) {
        throw error
      }

      setProfesores((prev) => [...prev, data])
      return data
    } catch (error) {
      console.error("Error al agregar profesor:", error)
      throw error
    }
  }

  const actualizarProfesor = async (id: string, updates: ProfesorUpdate) => {
    try {
      const { data, error } = await supabase.from("profesores").update(updates).eq("id", id).select().single()

      if (error) {
        throw error
      }

      setProfesores((prev) => prev.map((profesor) => (profesor.id === id ? data : profesor)))
      return data
    } catch (error) {
      console.error("Error al actualizar profesor:", error)
      throw error
    }
  }

  const eliminarProfesor = async (id: string) => {
    try {
      // Primero obtenemos el usuario_id
      const { data: profesorData, error: profesorError } = await supabase
        .from("profesores")
        .select("usuario_id")
        .eq("id", id)
        .single()

      if (profesorError) {
        throw profesorError
      }

      // Eliminamos el profesor
      const { error } = await supabase.from("profesores").delete().eq("id", id)

      if (error) {
        throw error
      }

      // Eliminamos el usuario
      if (profesorData?.usuario_id) {
        const { error: userError } = await supabase.from("usuarios").delete().eq("id", profesorData.usuario_id)

        if (userError) {
          throw userError
        }

        // En un entorno real, también eliminaríamos el usuario de auth
        // Esto requiere una función serverless o un endpoint de API
      }

      setProfesores((prev) => prev.filter((profesor) => profesor.id !== id))
    } catch (error) {
      console.error("Error al eliminar profesor:", error)
      throw error
    }
  }

  return {
    profesores,
    loading,
    error,
    agregarProfesor,
    actualizarProfesor,
    eliminarProfesor,
  }
}
