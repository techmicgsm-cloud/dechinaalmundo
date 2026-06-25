import { type User } from "@supabase/supabase-js"
import { supabase } from "./supabase"

/**
 * Sign in with email and password using Supabase Auth.
 * Throws a typed error that can be shown in the UI.
 */
export async function signIn(email: string, password: string): Promise<User> {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) throw error
  if (!data.user) throw new Error("User not found")
  return data.user
}

/**
 * Sign out the current user.
 */
export async function signOut(): Promise<void> {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

/**
 * Subscribe to authentication state changes.
 * Returns an unsubscribe function.
 */
export function onAuthChange(callback: (user: User | null) => void): () => void {
  const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
    callback(session?.user ?? null)
  })
  return () => {
    subscription.unsubscribe()
  }
}

/**
 * Maps Supabase Auth error codes to user-friendly Spanish messages.
 */
export function getAuthErrorMessage(code: string): string {
  const messages: Record<string, string> = {
    "invalid_credentials":         "Correo o contraseña incorrectos.",
    "user_not_found":              "No existe una cuenta con ese correo.",
  }
  return messages[code] ?? "Ocurrió un error inesperado. Intentá de nuevo."
}
