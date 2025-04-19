import { createClient } from "@supabase/supabase-js"
import type { Database } from "./database.types"

// Creamos un singleton para el cliente de Supabase
let supabaseInstance: ReturnType<typeof createClient<Database>> | null = null

export const getSupabaseClient = () => {
  if (supabaseInstance) return supabaseInstance

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Faltan las variables de entorno de Supabase")
  }

  supabaseInstance = createClient<Database>(supabaseUrl, supabaseAnonKey)
  return supabaseInstance
}

// Cliente para el servidor (con clave de servicio)
export const getSupabaseAdmin = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ""

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error("Faltan las variables de entorno de Supabase para el admin")
  }

  return createClient<Database>(supabaseUrl, supabaseServiceKey)
}

// Cliente para el lado del cliente
export const createClientComponentClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Faltan las variables de entorno de Supabase")
  }

  return createClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  })
}
