import {
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  type User,
} from "firebase/auth"
import { auth } from "./firebase"

/**
 * Sign in with email and password using Firebase Auth.
 * Throws a typed error that can be shown in the UI.
 */
export async function signIn(email: string, password: string): Promise<User> {
  const credential = await signInWithEmailAndPassword(auth, email, password)
  return credential.user
}

/**
 * Sign out the current user.
 */
export async function signOut(): Promise<void> {
  await firebaseSignOut(auth)
}

/**
 * Subscribe to authentication state changes.
 * Returns an unsubscribe function.
 */
export function onAuthChange(callback: (user: User | null) => void): () => void {
  return onAuthStateChanged(auth, callback)
}

/**
 * Maps Firebase Auth error codes to user-friendly Spanish messages.
 */
export function getAuthErrorMessage(code: string): string {
  const messages: Record<string, string> = {
    "auth/invalid-email":          "El correo electrónico no es válido.",
    "auth/user-not-found":         "No existe una cuenta con ese correo.",
    "auth/wrong-password":         "Contraseña incorrecta. Intentá de nuevo.",
    "auth/invalid-credential":     "Correo o contraseña incorrectos.",
    "auth/too-many-requests":      "Demasiados intentos fallidos. Esperá unos minutos.",
    "auth/network-request-failed": "Error de red. Verificá tu conexión.",
    "auth/user-disabled":          "Esta cuenta ha sido deshabilitada.",
  }
  return messages[code] ?? "Ocurrió un error inesperado. Intentá de nuevo."
}
