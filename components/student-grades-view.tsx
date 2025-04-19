"use client"

import { useAuth } from "@/contexts/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"
import { ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

// Datos de ejemplo para un estudiante
const studentGrades = [
  { id: "1", subject: "Matemáticas", value: 8.5, teacher: "Mr. Johnson", date: "2023-10-15" },
  { id: "2", subject: "Ciencias", value: 9.2, teacher: "Mrs. Smith", date: "2023-10-12" },
  { id: "3", subject: "Historia", value: 7.8, teacher: "Mr. Williams", date: "2023-10-10" },
  { id: "4", subject: "Lenguaje", value: 8.0, teacher: "Ms. Brown", date: "2023-10-08" },
  { id: "5", subject: "Arte", value: 9.5, teacher: "Mrs. Davis", date: "2023-10-05" },
]

// Datos para el gráfico
const chartData = studentGrades.map((grade) => ({
  subject: grade.subject,
  value: grade.value,
}))

function getGradeColor(grade: number) {
  if (grade >= 9) return "text-green-500"
  if (grade >= 7) return "text-yellow-500"
  return "text-red-500"
}

export function StudentGradesView() {
  const { user } = useAuth()

  // Calcular promedio
  const average = studentGrades.reduce((sum, grade) => sum + grade.value, 0) / studentGrades.length

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Mis Calificaciones</h1>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Promedio General</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getGradeColor(average)}`}>{average.toFixed(1)}</div>
            <p className="text-xs text-muted-foreground">Semestre actual</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Mejor Calificación</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">
              {Math.max(...studentGrades.map((g) => g.value)).toFixed(1)}
            </div>
            <p className="text-xs text-muted-foreground">
              {studentGrades.reduce((best, grade) => (grade.value > best.value ? grade : best)).subject}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Materias Aprobadas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {studentGrades.filter((g) => g.value >= 7).length}/{studentGrades.length}
            </div>
            <p className="text-xs text-muted-foreground">Calificación mínima: 7.0</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="table" className="space-y-4">
        <TabsList>
          <TabsTrigger value="table">Tabla</TabsTrigger>
          <TabsTrigger value="chart">Gráfico</TabsTrigger>
        </TabsList>

        <TabsContent value="table">
          <Card>
            <CardHeader>
              <CardTitle>Detalle de Calificaciones</CardTitle>
              <CardDescription>Calificaciones del semestre actual</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Materia</TableHead>
                    <TableHead>Calificación</TableHead>
                    <TableHead>Profesor</TableHead>
                    <TableHead>Fecha</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {studentGrades.map((grade) => (
                    <TableRow key={grade.id}>
                      <TableCell>{grade.subject}</TableCell>
                      <TableCell className={getGradeColor(grade.value)}>{grade.value.toFixed(1)}</TableCell>
                      <TableCell>{grade.teacher}</TableCell>
                      <TableCell>{new Date(grade.date).toLocaleDateString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="chart">
          <Card>
            <CardHeader>
              <CardTitle>Gráfico de Calificaciones</CardTitle>
              <CardDescription>Visualización de calificaciones por materia</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={chartData}>
                  <XAxis dataKey="subject" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    domain={[0, 10]}
                    tickFormatter={(value) => `${value}`}
                  />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <ChartTooltip>
                            <ChartTooltipContent
                              content={
                                <div className="flex flex-col gap-2">
                                  <p className="text-sm font-medium">{payload[0].payload.subject}</p>
                                  <p className="text-sm">Calificación: {payload[0].value}</p>
                                </div>
                              }
                            />
                          </ChartTooltip>
                        )
                      }
                      return null
                    }}
                  />
                  <Bar dataKey="value" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
