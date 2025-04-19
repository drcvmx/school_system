"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase-client"
import type { Database } from "@/lib/database.types"

type Teacher = Database["public"]["Tables"]["teachers"]["Row"]

export function useTeachers() {
  const [teachers, setTeachers] = useState<Teacher[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    async function fetchTeachers() {
      try {
        setLoading(true)
        const { data, error } = await supabase.from("teachers").select("*").order("name")

        if (error) {
          throw error
        }

        setTeachers(data || [])
      } catch (error) {
        setError(error as Error)
        console.error("Error fetching teachers:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchTeachers()
  }, [])

  async function addTeacher(teacher: Omit<Teacher, "id" | "created_at">) {
    try {
      const { data, error } = await supabase.from("teachers").insert(teacher).select()

      if (error) {
        throw error
      }

      setTeachers((prev) => [...prev, data[0]])
      return data[0]
    } catch (error) {
      console.error("Error adding teacher:", error)
      throw error
    }
  }

  async function updateTeacher(id: string, updates: Partial<Teacher>) {
    try {
      const { data, error } = await supabase.from("teachers").update(updates).eq("id", id).select()

      if (error) {
        throw error
      }

      setTeachers((prev) => prev.map((teacher) => (teacher.id === id ? { ...teacher, ...data[0] } : teacher)))
      return data[0]
    } catch (error) {
      console.error("Error updating teacher:", error)
      throw error
    }
  }

  async function deleteTeacher(id: string) {
    try {
      const { error } = await supabase.from("teachers").delete().eq("id", id)

      if (error) {
        throw error
      }

      setTeachers((prev) => prev.filter((teacher) => teacher.id !== id))
    } catch (error) {
      console.error("Error deleting teacher:", error)
      throw error
    }
  }

  return {
    teachers,
    loading,
    error,
    addTeacher,
    updateTeacher,
    deleteTeacher,
  }
}
