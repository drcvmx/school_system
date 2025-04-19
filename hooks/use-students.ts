"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase-client"
import type { Database } from "@/lib/database.types"

type Student = Database["public"]["Tables"]["students"]["Row"]

export function useStudents() {
  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    async function fetchStudents() {
      try {
        setLoading(true)
        const { data, error } = await supabase.from("students").select("*").order("name")

        if (error) {
          throw error
        }

        setStudents(data || [])
      } catch (error) {
        setError(error as Error)
        console.error("Error fetching students:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchStudents()
  }, [])

  async function addStudent(student: Omit<Student, "id" | "created_at">) {
    try {
      const { data, error } = await supabase.from("students").insert(student).select()

      if (error) {
        throw error
      }

      setStudents((prev) => [...prev, data[0]])
      return data[0]
    } catch (error) {
      console.error("Error adding student:", error)
      throw error
    }
  }

  async function updateStudent(id: string, updates: Partial<Student>) {
    try {
      const { data, error } = await supabase.from("students").update(updates).eq("id", id).select()

      if (error) {
        throw error
      }

      setStudents((prev) => prev.map((student) => (student.id === id ? { ...student, ...data[0] } : student)))
      return data[0]
    } catch (error) {
      console.error("Error updating student:", error)
      throw error
    }
  }

  async function deleteStudent(id: string) {
    try {
      const { error } = await supabase.from("students").delete().eq("id", id)

      if (error) {
        throw error
      }

      setStudents((prev) => prev.filter((student) => student.id !== id))
    } catch (error) {
      console.error("Error deleting student:", error)
      throw error
    }
  }

  return {
    students,
    loading,
    error,
    addStudent,
    updateStudent,
    deleteStudent,
  }
}
