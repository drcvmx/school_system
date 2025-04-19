"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { Check, Save, Loader2 } from "lucide-react"
import { createClientComponentClient } from "@/lib/supabase-client"

// Tipos simplificados
type Materia = {
  id: string
  nombre: string
}

type Alumno = {
  id: string
  nombre: string
  apellido_paterno: string
  apellido_materno: string | null
}

export function TeacherDashboard() {
  const { user } = useAuth()
  const { toast } = useToast()
  const supabase = createClientComponentClient()

  // Estados para los datos
  const [materias, setMaterias] = useState<Materia[]>([])
  const [alumnos, setAlumnos] = useState<Alumno[]>([])
  const [calificaciones, setCalificaciones] = useState<Record<string, { value: number; saved: boolean }>>({})

  // Estados para las selecciones
  const [selectedMateriaId, setSelectedMateriaId] = useState<string>("")

  // Estados para carga
  const [loadingMaterias, setLoadingMaterias] = useState(true)
  const [loadingAlumnos, setLoadingAlumnos] = useState(false)
  const [savingGrades, setSavingGrades] = useState(false)

  // Efecto para cargar las materias que imparte el profesor
  useEffect(() => {
    const fetchMaterias = async () => {
      try {
        setLoadingMaterias(true)

        // En un entorno real, obtendríamos el ID del profesor desde la base de datos
        // y luego consultaríamos las materias que imparte
        // Para simplificar, usaremos datos simulados

        // Simulación de materias que imparte el profesor
        const materiasSimuladas = [
          { id: "mat_001", nombre: "Matemáticas 2°" },
          { id: "mat_002", nombre: "Matemáticas 3°" },
          { id: "mat_003", nombre: "Álgebra Avanzada" },
        ]

        setMaterias(materiasSimuladas)

        // Seleccionar la primera materia por defecto
        if (materiasSimuladas.length > 0) {
          setSelectedMateriaId(materiasSimuladas[0].id)
        }
      } catch (error) {
        console.error("Error al cargar materias:", error)
        toast({
          title: "Error",
          description: "No se pudieron cargar las materias",
          variant: "destructive",
        })
      } finally {
        setLoadingMaterias(false)
      }
    }

    fetchMaterias()
  }, [toast])

  // Efecto para cargar los alumnos cuando se selecciona una materia
  useEffect(() => {
    const fetchAlumnos = async () => {
      if (!selectedMateriaId) return

      try {
        setLoadingAlumnos(true)
        setAlumnos([]) // Resetear alumnos

        // En un entorno real, consultaríamos los alumnos inscritos en esta materia
        // Para simplificar, usaremos datos simulados según la materia seleccionada

        // Simulación de alumnos por materia
        const alumnosPorMateria = {
          mat_001: [
            { id: "alu_001", nombre: "Ana", apellido_paterno: "Torres", apellido_materno: "Vega" },
            { id: "alu_002", nombre: "Luis", apellido_paterno: "Méndez", apellido_materno: "Ortiz" },
            { id: "alu_003", nombre: "Sofía", apellido_paterno: "Ruiz", apellido_materno: "Jiménez" },
          ],
          mat_002: [
            { id: "alu_004", nombre: "Pedro", apellido_paterno: "Díaz", apellido_materno: "Morales" },
            { id: "alu_005", nombre: "Elena", apellido_paterno: "Castro", apellido_materno: "Flores" },
            { id: "alu_006", nombre: "Miguel", apellido_paterno: "López", apellido_materno: "Sánchez" },
          ],
          mat_003: [
            { id: "alu_007", nombre: "Carla", apellido_paterno: "Martínez", apellido_materno: "Gómez" },
            { id: "alu_008", nombre: "Roberto", apellido_paterno: "Fernández", apellido_materno: "Pérez" },
            { id: "alu_009", nombre: "Laura", apellido_paterno: "González", apellido_materno: "Ramírez" },
          ],
        }

        const alumnosMateria = alumnosPorMateria[selectedMateriaId] || []
        setAlumnos(alumnosMateria)

        // Inicializar calificaciones para estos alumnos
        const calificacionesSimuladas = {
          mat_001: {
            alu_001: 8.5,
            alu_002: 7.0,
            alu_003: 9.5,
          },
          mat_002: {
            alu_004: 8.0,
            alu_005: 9.0,
            alu_006: 7.5,
          },
          mat_003: {
            alu_007: 8.0,
            alu_008: 9.0,
            alu_009: 7.0,
          },
        }

        // Inicializar calificaciones para cada alumno
        const nuevasCalificaciones: Record<string, { value: number; saved: boolean }> = {}
        alumnosMateria.forEach((alumno) => {
          nuevasCalificaciones[alumno.id] = {
            value: calificacionesSimuladas[selectedMateriaId]?.[alumno.id] || 0,
            saved: true,
          }
        })

        setCalificaciones(nuevasCalificaciones)
      } catch (error) {
        console.error("Error al cargar alumnos:", error)
        toast({
          title: "Error",
          description: "No se pudieron cargar los alumnos para esta materia",
          variant: "destructive",
        })
      } finally {
        setLoadingAlumnos(false)
      }
    }

    fetchAlumnos()
  }, [selectedMateriaId, toast])

  const handleGradeChange = (alumnoId: string, value: string) => {
    // Validar que sea un número entre 0 y 10
    const numValue = Number.parseFloat(value)
    if (isNaN(numValue) || numValue < 0 || numValue > 10) return

    setCalificaciones({
      ...calificaciones,
      [alumnoId]: {
        ...calificaciones[alumnoId],
        value: numValue,
        saved: false,
      },
    })
  }

  const handleSaveGrade = async (alumnoId: string) => {
    try {
      // En un entorno real, aquí guardaríamos la calificación en la base de datos
      // Para este ejemplo, simplemente marcamos la calificación como guardada
      setCalificaciones({
        ...calificaciones,
        [alumnoId]: {
          ...calificaciones[alumnoId],
          saved: true,
        },
      })

      toast({
        title: "Calificación guardada",
        description: "La calificación ha sido guardada exitosamente",
      })
    } catch (error) {
      console.error("Error al guardar calificación:", error)
      toast({
        title: "Error",
        description: "No se pudo guardar la calificación",
        variant: "destructive",
      })
    }
  }

  const handleSaveAllGrades = async () => {
    try {
      setSavingGrades(true)

      // En un entorno real, aquí guardaríamos todas las calificaciones en la base de datos
      // Para este ejemplo, simplemente marcamos todas las calificaciones como guardadas
      const newCalificaciones = { ...calificaciones }
      Object.keys(newCalificaciones).forEach((id) => {
        newCalificaciones[id] = { ...newCalificaciones[id], saved: true }
      })

      setCalificaciones(newCalificaciones)

      toast({
        title: "Calificaciones guardadas",
        description: "Todas las calificaciones han sido guardadas exitosamente",
      })
    } catch (error) {
      console.error("Error al guardar calificaciones:", error)
      toast({
        title: "Error",
        description: "No se pudieron guardar todas las calificaciones",
        variant: "destructive",
      })
    } finally {
      setSavingGrades(false)
    }
  }

  // Función para obtener el nombre completo del alumno
  const getNombreCompleto = (alumno: Alumno) => {
    return `${alumno.nombre} ${alumno.apellido_paterno} ${alumno.apellido_materno || ""}`.trim()
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Bienvenido, {user?.name}</h1>
          <p className="text-muted-foreground">Registro de calificaciones</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Registro de Calificaciones</CardTitle>
          <CardDescription>Ingresa las calificaciones para tus estudiantes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="w-full md:w-2/3">
              <label className="text-sm font-medium mb-1 block">Materia</label>
              {loadingMaterias ? (
                <div className="flex items-center space-x-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Cargando materias...</span>
                </div>
              ) : (
                <Select value={selectedMateriaId} onValueChange={setSelectedMateriaId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona una materia" />
                  </SelectTrigger>
                  <SelectContent>
                    {materias.map((materia) => (
                      <SelectItem key={materia.id} value={materia.id}>
                        {materia.nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>

            <div className="w-full md:w-1/3 flex items-end">
              <Button
                onClick={handleSaveAllGrades}
                className="w-full"
                disabled={savingGrades || loadingAlumnos || !selectedMateriaId}
              >
                {savingGrades ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Guardando...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Guardar Todas
                  </>
                )}
              </Button>
            </div>
          </div>

          {loadingAlumnos ? (
            <div className="flex items-center justify-center p-8">
              <Loader2 className="h-8 w-8 animate-spin mr-2" />
              <span>Cargando alumnos...</span>
            </div>
          ) : alumnos.length === 0 ? (
            <div className="text-center p-8 border rounded-md">
              {selectedMateriaId ? (
                <p>No hay alumnos registrados en esta materia.</p>
              ) : (
                <p>Selecciona una materia para ver los alumnos.</p>
              )}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Estudiante</TableHead>
                  <TableHead>Calificación (0-10)</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Acción</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {alumnos.map((alumno) => (
                  <TableRow key={alumno.id}>
                    <TableCell>{getNombreCompleto(alumno)}</TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        min="0"
                        max="10"
                        step="0.1"
                        value={calificaciones[alumno.id]?.value || ""}
                        onChange={(e) => handleGradeChange(alumno.id, e.target.value)}
                        className="w-24"
                      />
                    </TableCell>
                    <TableCell>
                      {calificaciones[alumno.id]?.saved ? (
                        <span className="text-green-500 flex items-center">
                          <Check className="mr-1 h-4 w-4" /> Guardado
                        </span>
                      ) : (
                        <span className="text-yellow-500">Pendiente</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleSaveGrade(alumno.id)}
                        disabled={calificaciones[alumno.id]?.saved}
                      >
                        Guardar
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
