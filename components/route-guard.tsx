"use client"

import type React from "react"
import { useAuth } from "@/contexts/auth-context"
import { useRouter, usePathname } from "next/navigation"
import { useEffect } from "react"
import { Loader2 } from "lucide-react"

interface RouteGuardProps {
  children: React.ReactNode
  allowedRoles?: Array<"admin" | "profesor" | "alumno">
}

export function RouteGuard({ children, allowedRoles }: RouteGuardProps) {
  const { user, loading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // Si no está cargando y no hay usuario, redirigir a login
    if (!loading && !user && pathname !== "/login") {
      router.push("/login")
      return
    }

    // Si hay usuario y hay roles permitidos definidos, verificar acceso
    if (!loading && user && allowedRoles && !allowedRoles.includes(user.role)) {
      router.push("/dashboard")
      return
    }
  }, [user, loading, router, allowedRoles, pathname])

  // Mostrar spinner mientras carga
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  // Si estamos en login, mostrar la página sin importar si hay usuario
  if (pathname === "/login") {
    return <>{children}</>
  }

  // Si no hay usuario y no estamos en login, no mostrar nada
  if (!user && pathname !== "/login") {
    return null
  }

  // Si hay roles permitidos y el usuario no tiene el rol adecuado, no mostrar nada
  if (user && allowedRoles && !allowedRoles.includes(user.role)) {
    return null
  }

  // Si todo está bien, mostrar el contenido
  return <>{children}</>
}
