import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"

// Esta ruta debe estar protegida en producción
export async function GET() {
  try {
    // Crear cliente de Supabase con clave de servicio para tener acceso admin
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || "",
      process.env.SUPABASE_SERVICE_ROLE_KEY || "",
    )

    // Usuarios a crear
    const users = [
      { email: "admin@escuela.com", password: "123456", role: "admin" },
      { email: "profe_math@escuela.com", password: "123456", role: "profesor" },
      { email: "profe_ciencias@escuela.com", password: "123456", role: "profesor" },
      { email: "profe_historia@escuela.com", password: "123456", role: "profesor" },
      { email: "alumno1@escuela.com", password: "123456", role: "alumno" },
      { email: "alumno2@escuela.com", password: "123456", role: "alumno" },
      { email: "alumno3@escuela.com", password: "123456", role: "alumno" },
      { email: "alumno4@escuela.com", password: "123456", role: "alumno" },
      { email: "alumno5@escuela.com", password: "123456", role: "alumno" },
    ]

    const results = []

    // Crear cada usuario
    for (const user of users) {
      try {
        // Verificar si el usuario ya existe
        const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers({
          filter: {
            email: user.email,
          },
        })

        if (existingUsers && existingUsers.users.length > 0) {
          results.push({ email: user.email, status: "already exists" })
          continue
        }

        // Crear usuario en Auth
        const { data, error } = await supabaseAdmin.auth.admin.createUser({
          email: user.email,
          password: user.password,
          email_confirm: true,
        })

        if (error) {
          results.push({ email: user.email, status: "error", message: error.message })
          continue
        }

        // Actualizar o insertar en la tabla usuarios
        const { error: userError } = await supabaseAdmin.from("usuarios").upsert({
          id: data.user.id,
          email: user.email,
          password: user.password, // En producción, no almacenar contraseñas en texto plano
          rol: user.role,
        })

        if (userError) {
          results.push({ email: user.email, status: "auth created, db error", message: userError.message })
          continue
        }

        results.push({ email: user.email, status: "created", id: data.user.id })
      } catch (error: any) {
        results.push({ email: user.email, status: "error", message: error.message })
      }
    }

    return NextResponse.json({ success: true, results })
  } catch (error: any) {
    console.error("Error setting up users:", error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
