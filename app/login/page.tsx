"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { GraduationCap, User, Users, BookOpen } from "lucide-react"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"

// Datos de usuario simulados
const MOCK_USERS = {
  admin: {
    id: "admin-id",
    name: "Administrador del Sistema",
    role: "admin",
  },
  profesor: {
    id: "profesor-id",
    name: "Prof. Juan Pérez",
    role: "profesor",
    materias: ["Matemáticas", "Física"],
    grupos: ["2°A", "2°B", "3°A"],
  },
  alumno: {
    id: "alumno-id",
    name: "Ana Torres García",
    role: "alumno",
    grupo: "2°B",
    grado: "2°",
    seccion: "B",
    ciclo: "2024-2025",
  },
}

export default function LoginPage() {
  const [selectedRole, setSelectedRole] = useState<"admin" | "profesor" | "alumno" | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  const handleLogin = async () => {
    if (!selectedRole) {
      toast({
        title: "Error",
        description: "Por favor selecciona un rol para continuar",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      // Guardar el usuario simulado en localStorage
      localStorage.setItem("mockUser", JSON.stringify(MOCK_USERS[selectedRole]))

      toast({
        title: "Acceso concedido",
        description: `Has ingresado como ${MOCK_USERS[selectedRole].name}`,
      })

      // Redirigir al dashboard
      router.push("/dashboard")
    } catch (error) {
      console.error("Error al iniciar sesión:", error)
      toast({
        title: "Error",
        description: "Ocurrió un error al iniciar sesión",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-2">
            <GraduationCap className="h-10 w-10" />
          </div>
          <CardTitle className="text-2xl">Sistema de Control Escolar</CardTitle>
          <CardDescription>Selecciona un rol para acceder al sistema</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <RadioGroup
            value={selectedRole || ""}
            onValueChange={(value) => setSelectedRole(value as "admin" | "profesor" | "alumno")}
          >
            <div className="flex items-center space-x-2 border rounded-lg p-4 cursor-pointer hover:bg-accent">
              <RadioGroupItem value="admin" id="admin" />
              <Label htmlFor="admin" className="flex items-center cursor-pointer flex-1">
                <Users className="mr-2 h-5 w-5" />
                <div>
                  <div className="font-medium">Administrador</div>
                  <div className="text-sm text-muted-foreground">Acceso completo al sistema</div>
                </div>
              </Label>
            </div>

            <div className="flex items-center space-x-2 border rounded-lg p-4 cursor-pointer hover:bg-accent">
              <RadioGroupItem value="profesor" id="profesor" />
              <Label htmlFor="profesor" className="flex items-center cursor-pointer flex-1">
                <BookOpen className="mr-2 h-5 w-5" />
                <div>
                  <div className="font-medium">Profesor</div>
                  <div className="text-sm text-muted-foreground">Gestión de calificaciones y reportes</div>
                </div>
              </Label>
            </div>

            <div className="flex items-center space-x-2 border rounded-lg p-4 cursor-pointer hover:bg-accent">
              <RadioGroupItem value="alumno" id="alumno" />
              <Label htmlFor="alumno" className="flex items-center cursor-pointer flex-1">
                <User className="mr-2 h-5 w-5" />
                <div>
                  <div className="font-medium">Alumno</div>
                  <div className="text-sm text-muted-foreground">Consulta de calificaciones y boletas</div>
                </div>
              </Label>
            </div>
          </RadioGroup>
        </CardContent>
        <CardFooter>
          <Button onClick={handleLogin} className="w-full" disabled={isLoading || !selectedRole}>
            {isLoading ? "Accediendo..." : "Ingresar al Sistema"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
