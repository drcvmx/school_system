"use client"

import type React from "react"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { useAuth } from "@/contexts/auth-context"
import { Loader2 } from "lucide-react"

export default function ProtectedLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login")
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <SidebarProvider>
      <div className="flex h-screen">
        <AppSidebar />
        <main className="flex-1 overflow-auto bg-background p-6">{children}</main>
      </div>
    </SidebarProvider>
  )
}
