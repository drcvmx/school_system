"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { useRouter } from "next/navigation"

type UserRole = "admin" | "profesor" | "alumno"

type MockUser = {
  id: string
  name: string
  role: UserRole
  materias?: string[]
  grupos?: string[]
  grupo?: string
  grado?: string
  seccion?: string
  ciclo?: string
}

type AuthContextType = {
  user: MockUser | null
  loading: boolean
  error: Error | null
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<MockUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const router = useRouter()

  useEffect(() => {
    // Verificar si hay un usuario en localStorage
    const storedUser = localStorage.getItem("mockUser")

    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch (error) {
        console.error("Error al parsear el usuario:", error)
        localStorage.removeItem("mockUser")
      }
    }

    setLoading(false)
  }, [])

  const logout = () => {
    localStorage.removeItem("mockUser")
    setUser(null)
    router.push("/login")
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth debe ser usado dentro de un AuthProvider")
  }
  return context
}
