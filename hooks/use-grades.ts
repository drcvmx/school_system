"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase-client"
import type { Database } from "@/lib/database.types"

type Grade = Database["public"]["Tables"]["grades"]["Row"]

export function useGrades() {
  const [grades, setGrades] = useState<Grade[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    async function fetchGrades() {
      try {
        setLoading(true)
        const { data, error } = await supabase
          .from("grades")
          .select(`
            *,
            students(name),
            teachers(name)
          `)
          .order("date", { ascending: false })

        if (error) {
          throw error
        }

        setGrades(data || [])
      } catch (error) {
        setError(error as Error)
        console.error("Error fetching grades:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchGrades()
  }, [])

  async function addGrade(grade: Omit<Grade, "id" | "created_at">) {
    try {
      const { data, error } = await supabase
        .from("grades")
        .insert(grade)
        .select(`
          *,
          students(name),
          teachers(name)
        `)

      if (error) {
        throw error
      }

      setGrades((prev) => [data[0], ...prev])
      return data[0]
    } catch (error) {
      console.error("Error adding grade:", error)
      throw error
    }
  }

  async function updateGrade(id: string, updates: Partial<Grade>) {
    try {
      const { data, error } = await supabase
        .from("grades")
        .update(updates)
        .eq("id", id)
        .select(`
          *,
          students(name),
          teachers(name)
        `)

      if (error) {
        throw error
      }

      setGrades((prev) => prev.map((grade) => (grade.id === id ? { ...grade, ...data[0] } : grade)))
      return data[0]
    } catch (error) {
      console.error("Error updating grade:", error)
      throw error
    }
  }

  async function deleteGrade(id: string) {
    try {
      const { error } = await supabase.from("grades").delete().eq("id", id)

      if (error) {
        throw error
      }

      setGrades((prev) => prev.filter((grade) => grade.id !== id))
    } catch (error) {
      console.error("Error deleting grade:", error)
      throw error
    }
  }

  return {
    grades,
    loading,
    error,
    addGrade,
    updateGrade,
    deleteGrade,
  }
}
