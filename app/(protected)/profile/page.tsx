"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/contexts/auth-context"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

export default function ProfilePage() {
  const { user } = useAuth()

  if (!user) {
    return null
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Mi Perfil</h1>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Información Personal</CardTitle>
            <CardDescription>Tu información de perfil en el sistema</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center space-y-4">
            <Avatar className="h-24 w-24">
              <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
              <AvatarFallback className="text-2xl">{user.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="space-y-1 text-center">
              <h3 className="text-xl font-medium">{user.name}</h3>
              <p className="text-sm text-muted-foreground">{user.email}</p>
              <Badge variant="outline" className="capitalize">
                {user.role}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Permisos del Sistema</CardTitle>
            <CardDescription>Acciones que puedes realizar según tu rol</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {user.role === "admin" && (
                <div className="space-y-2">
                  <h4 className="font-medium">Administrador</h4>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    <li>Gestión completa de estudiantes</li>
                    <li>Gestión completa de profesores</li>
                    <li>Gestión completa de calificaciones</li>
                    <li>Generación y descarga de reportes</li>
                    <li>Configuración del sistema</li>
                  </ul>
                </div>
              )}

              {user.role === "teacher" && (
                <div className="space-y-2">
                  <h4 className="font-medium">Profesor</h4>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    <li>Ver lista de estudiantes</li>
                    <li>Asignar calificaciones a estudiantes</li>
                    <li>Editar calificaciones asignadas</li>
                    <li>Generar reportes de calificaciones</li>
                  </ul>
                </div>
              )}

              {user.role === "student" && (
                <div className="space-y-2">
                  <h4 className="font-medium">Estudiante</h4>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    <li>Ver tus calificaciones</li>
                    <li>Ver tu promedio general</li>
                    <li>Ver tu historial académico</li>
                    <li>Descargar boleta de calificaciones</li>
                  </ul>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
