"use client"

import { GradesTable } from "@/components/grades-table"
import { StudentGradesView } from "@/components/student-grades-view"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"

export default function GradesPage() {
  const { user } = useAuth()

  if (!user) return null

  // Estudiantes ven una vista diferente de calificaciones
  if (user.role === "student") {
    return <StudentGradesView />
  }

  // Administradores y profesores ven la tabla completa con diferentes permisos
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Calificaciones</h1>
        {/* Solo administradores y profesores pueden agregar calificaciones */}
        {(user.role === "admin" || user.role === "teacher") && (
          <Button asChild>
            <Link href="/grades/new">
              <PlusCircle className="mr-2 h-4 w-4" />
              Agregar Calificación
            </Link>
          </Button>
        )}
      </div>
      <GradesTable />
    </div>
  )
}
