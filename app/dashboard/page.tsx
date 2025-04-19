"use client"

import { useAuth } from "@/contexts/auth-context"
import { StudentDashboard } from "@/components/student-dashboard"
import { TeacherDashboard } from "@/components/teacher-dashboard"
import { AdminDashboard } from "@/components/admin-dashboard"
import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function DashboardPage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // Si no está cargando y no hay usuario, redirigir a login
    if (!loading && !user) {
      router.push("/login")
    }
  }, [user, loading, router])

  // Si está cargando o no hay usuario, no mostrar nada
  if (loading || !user) {
    return null
  }

  return (
    <>
      {user.role === "alumno" && <StudentDashboard />}
      {user.role === "profesor" && <TeacherDashboard />}
      {user.role === "admin" && <AdminDashboard />}
    </>
  )
}
