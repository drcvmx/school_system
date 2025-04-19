"use client"

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
  SidebarFooter,
} from "@/components/ui/sidebar"
import { BarChart3, GraduationCap, Users, ClipboardList, FileText, Settings, LogOut, UserCircle } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ModeToggle } from "./mode-toggle"
import { useAuth } from "@/contexts/auth-context"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"

export function AppSidebar() {
  const pathname = usePathname()
  const { user, logout } = useAuth()

  const isActive = (path: string) => {
    return pathname === path
  }

  // Si no hay usuario, no mostrar nada
  if (!user) return null

  // Determine which menu items to show based on user role
  const showStudentsMenu = user.role === "admin" || user.role === "profesor"
  const showTeachersMenu = user.role === "admin"
  const showGradesMenu = true // All roles can see grades, but with different permissions
  const showReportsMenu = user.role === "admin" || user.role === "profesor"
  const showSettingsMenu = user.role === "admin"

  return (
    <>
      <Sidebar>
        <SidebarHeader className="flex items-center justify-between">
          <div className="flex items-center gap-2 px-2">
            <GraduationCap className="h-6 w-6" />
            <span className="font-bold">SchoolMS</span>
          </div>
          <SidebarTrigger />
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={isActive("/dashboard")}>
                <Link href="/dashboard">
                  <BarChart3 />
                  <span>Dashboard</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>

            {showStudentsMenu && (
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive("/dashboard/students")}>
                  <Link href="/dashboard/students">
                    <Users />
                    <span>Estudiantes</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )}

            {showTeachersMenu && (
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive("/dashboard/teachers")}>
                  <Link href="/dashboard/teachers">
                    <Users />
                    <span>Profesores</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )}

            {showGradesMenu && (
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive("/dashboard/grades")}>
                  <Link href="/dashboard/grades">
                    <ClipboardList />
                    <span>Calificaciones</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )}

            {showReportsMenu && (
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive("/dashboard/reports")}>
                  <Link href="/dashboard/reports">
                    <FileText />
                    <span>Reportes</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )}

            {showSettingsMenu && (
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={isActive("/dashboard/settings")}>
                  <Link href="/dashboard/settings">
                    <Settings />
                    <span>Configuración</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )}

            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={isActive("/dashboard/profile")}>
                <Link href="/dashboard/profile">
                  <UserCircle />
                  <span>Mi Perfil</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter className="p-4 space-y-4">
          <div className="flex items-center gap-3 px-2">
            <Avatar>
              <AvatarImage src="/placeholder.svg" alt={user.name} />
              <AvatarFallback>{user.name?.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-sm font-medium">{user.name}</span>
              <span className="text-xs text-muted-foreground capitalize">{user.role}</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <ModeToggle />
            <Button variant="ghost" size="sm" onClick={logout} className="flex items-center gap-2">
              <LogOut className="h-4 w-4" />
              <span>Salir</span>
            </Button>
          </div>
        </SidebarFooter>
      </Sidebar>
    </>
  )
}
