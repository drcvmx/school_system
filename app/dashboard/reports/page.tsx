"use client"

import { ReportsTable } from "@/components/reports-table"
import { Button } from "@/components/ui/button"
import { FileDown } from "lucide-react"
import { RouteGuard } from "@/components/route-guard"

export default function ReportsPage() {
  return (
    <RouteGuard allowedRoles={["admin", "teacher"]}>
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
    </RouteGuard>
  )
}
