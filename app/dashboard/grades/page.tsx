"use client"

import { GradesTable } from "@/components/grades-table"
import { StudentGradesView } from "@/components/student-grades-view"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"
import { RouteGuard } from "@/components/route-guard"

export default function GradesPage() {
  const { user } = useAuth()

  if (!user) return null

  // Estudiantes ven una vista diferente de calificaciones
  if (user.role === "student") {
    return (
      <RouteGuard>
        <StudentGradesView />
      </RouteGuard>
    )
  }

  // Administradores y profesores ven la tabla completa con diferentes permisos
  return (
    <RouteGuard allowedRoles={["admin", "teacher"]}>
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Calificaciones</h1>
          {/* Solo administradores y profesores pueden agregar calificaciones */}
          <Button asChild>
            <Link href="/dashboard/grades/new">
              <PlusCircle className="mr-2 h-4 w-4" />
              Agregar Calificación
            </Link>
          </Button>
        </div>
        <GradesTable />
      </div>
    </RouteGuard>
  )
}
