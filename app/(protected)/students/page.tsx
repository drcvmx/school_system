"use client"

import { StudentsTable } from "@/components/students-table"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function StudentsPage() {
  const { user } = useAuth()
  const router = useRouter()

  // Redirigir a estudiantes al dashboard si intentan acceder a esta página
  useEffect(() => {
    if (user?.role === "student") {
      router.push("/")
    }
  }, [user, router])

  if (!user || user.role === "student") return null

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Estudiantes</h1>
        {/* Solo los administradores pueden agregar estudiantes */}
        {user.role === "admin" && (
          <Button asChild>
            <Link href="/students/new">
              <PlusCircle className="mr-2 h-4 w-4" />
              Agregar Estudiante
            </Link>
          </Button>
        )}
      </div>
      <StudentsTable />
    </div>
  )
}
