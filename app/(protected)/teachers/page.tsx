"use client"

import { TeachersTable } from "@/components/teachers-table"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function TeachersPage() {
  const { user } = useAuth()
  const router = useRouter()

  // Redirigir a no-administradores al dashboard si intentan acceder a esta página
  useEffect(() => {
    if (user && user.role !== "admin") {
      router.push("/")
    }
  }, [user, router])

  if (!user || user.role !== "admin") return null

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Profesores</h1>
        <Button asChild>
          <Link href="/teachers/new">
            <PlusCircle className="mr-2 h-4 w-4" />
            Agregar Profesor
          </Link>
        </Button>
      </div>
      <TeachersTable />
    </div>
  )
}
