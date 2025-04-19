"use client"

import type React from "react"

import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { RouteGuard } from "@/components/route-guard"

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <RouteGuard>
      <SidebarProvider>
        <div className="flex h-screen">
          <AppSidebar />
          <main className="flex-1 overflow-auto bg-background p-6">{children}</main>
        </div>
      </SidebarProvider>
    </RouteGuard>
  )
}
