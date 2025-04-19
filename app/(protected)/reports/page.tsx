"use client"

import { ReportsTable } from "@/components/reports-table"
import { Button } from "@/components/ui/button"
import { FileDown } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function ReportsPage() {
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
        <h1 className="text-3xl font-bold tracking-tight">Reportes</h1>
        <Button>
          <FileDown className="mr-2 h-4 w-4" />
          Exportar Todo
        </Button>
      </div>
      <ReportsTable />
    </div>
  )
}
