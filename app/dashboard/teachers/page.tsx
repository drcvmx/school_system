"use client"

import { TeachersTable } from "@/components/teachers-table"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import Link from "next/link"
import { RouteGuard } from "@/components/route-guard"

export default function TeachersPage() {
  return (
    <RouteGuard allowedRoles={["admin"]}>
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Profesores</h1>
          <Button asChild>
            <Link href="/dashboard/teachers/new">
              <PlusCircle className="mr-2 h-4 w-4" />
              Agregar Profesor
            </Link>
          </Button>
        </div>
        <TeachersTable />
      </div>
    </RouteGuard>
  )
}
