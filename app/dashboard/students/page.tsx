"use client"

import { StudentsTable } from "@/components/students-table"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"
import { RouteGuard } from "@/components/route-guard"

export default function StudentsPage() {
  const { user } = useAuth()

  return (
    <RouteGuard allowedRoles={["admin", "teacher"]}>
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Estudiantes</h1>
          {/* Solo los administradores pueden agregar estudiantes */}
          {user?.role === "admin" && (
            <Button asChild>
              <Link href="/dashboard/students/new">
                <PlusCircle className="mr-2 h-4 w-4" />
                Agregar Estudiante
              </Link>
            </Button>
          )}
        </div>
        <StudentsTable />
      </div>
    </RouteGuard>
  )
}
