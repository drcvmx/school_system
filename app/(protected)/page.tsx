import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Overview } from "@/components/overview"
import { RecentGrades } from "@/components/recent-grades"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function Home() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
      </div>
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Resumen</TabsTrigger>
          <TabsTrigger value="analytics">Análisis</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Estudiantes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">245</div>
                <p className="text-xs text-muted-foreground">+12 desde el mes pasado</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Profesores</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">32</div>
                <p className="text-xs text-muted-foreground">+2 desde el mes pasado</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Promedio de Calificaciones</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">8.2</div>
                <p className="text-xs text-muted-foreground">+0.3 desde el semestre pasado</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Reportes Pendientes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12</div>
                <p className="text-xs text-muted-foreground">-4 desde la semana pasada</p>
              </CardContent>
            </Card>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Resumen de Rendimiento</CardTitle>
                <CardDescription>Promedio de calificaciones por materia para el semestre actual</CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <Overview />
              </CardContent>
            </Card>
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Calificaciones Recientes</CardTitle>
                <CardDescription>Últimas calificaciones registradas en todas las clases</CardDescription>
              </CardHeader>
              <CardContent>
                <RecentGrades />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Análisis Avanzado</CardTitle>
              <CardDescription>Métricas detalladas de rendimiento y tendencias</CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
              <div className="h-[400px] flex items-center justify-center border border-dashed rounded-lg">
                <p className="text-muted-foreground">Análisis avanzado próximamente</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
