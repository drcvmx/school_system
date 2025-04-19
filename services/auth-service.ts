import { createClientComponentClient } from "@/lib/supabase-client"

export class AuthService {
  private supabase = createClientComponentClient()

  async login(email: string, password: string) {
    try {
      const { data, error } = await this.supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        throw error
      }

      return data
    } catch (error) {
      console.error("Error en login:", error)
      throw error
    }
  }

  async logout() {
    const { error } = await this.supabase.auth.signOut()

    if (error) {
      throw error
    }
  }

  async getSession() {
    const { data, error } = await this.supabase.auth.getSession()

    if (error) {
      throw error
    }

    return data.session
  }

  async getUserRole(userId: string) {
    try {
      const { data, error } = await this.supabase.from("usuarios").select("rol").eq("id", userId).single()

      if (error) {
        throw error
      }

      return data.rol
    } catch (error) {
      console.error("Error obteniendo rol:", error)
      throw error
    }
  }

  async resetPassword(email: string) {
    const { error } = await this.supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })

    if (error) {
      throw error
    }
  }

  async updatePassword(newPassword: string) {
    const { error } = await this.supabase.auth.updateUser({
      password: newPassword,
    })

    if (error) {
      throw error
    }
  }
}

export const authService = new AuthService()
