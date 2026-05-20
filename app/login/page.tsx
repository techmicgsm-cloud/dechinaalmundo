"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Lock, Mail, Eye, EyeOff, Loader2, AlertCircle, Package, Globe, Shield } from "lucide-react"
import Image from "next/image"
import { signIn, getAuthErrorMessage } from "@/lib/auth"
import { useAuth } from "@/contexts/AuthContext"

export default function LoginPage() {
  const router = useRouter()
  const { isAuthenticated, loading: authLoading } = useAuth()

  const [email,      setEmail]      = useState("")
  const [password,   setPassword]   = useState("")
  const [showPass,   setShowPass]   = useState(false)
  const [loading,    setLoading]    = useState(false)
  const [error,      setError]      = useState<string | null>(null)

  // If already authenticated, redirect straight to admin
  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      router.replace("/admin")
    }
  }, [isAuthenticated, authLoading, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim() || !password) return

    setLoading(true)
    setError(null)

    try {
      await signIn(email.trim(), password)
      router.replace("/admin")
    } catch (err: any) {
      const code = err?.code ?? ""
      setError(getAuthErrorMessage(code))
    } finally {
      setLoading(false)
    }
  }

  // Show nothing while checking auth state
  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="relative">
          <div className="w-12 h-12 border-3 border-primary/20 rounded-full" />
          <div className="absolute inset-0 w-12 h-12 border-3 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    )
  }

  // Don't render login if already redirecting
  if (isAuthenticated) return null

  return (
    <div className="min-h-screen bg-background flex">
      {/* ── Left panel – Branding ──────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-background via-secondary to-background border-r border-border flex-col justify-between p-12"
      >
        {/* Animated background grid */}
        <div className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`,
            backgroundSize: "40px 40px",
          }}
        />

        {/* Glowing orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Logo */}
        <div className="relative z-10">
          <Image
            src="/images/logo.png"
            alt="De China al Mundo"
            width={280}
            height={94}
            className="h-16 w-auto object-contain"
            priority
          />
        </div>

        {/* Center content */}
        <div className="relative z-10 space-y-8">
          <div>
            <h1 className="text-4xl font-bold text-foreground leading-tight">
              Panel de
              <span className="text-primary block">Administración</span>
            </h1>
            <p className="text-muted-foreground mt-4 text-lg leading-relaxed">
              Gestiona envíos, clientes y seguimientos internacionales desde un solo lugar.
            </p>
          </div>

          {/* Feature pills */}
          <div className="space-y-3">
            {[
              { icon: Globe,   text: "Tracking internacional en tiempo real" },
              { icon: Package, text: "Gestión completa de envíos" },
              { icon: Shield,  text: "Acceso seguro y protegido" },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
                className="flex items-center gap-3 text-sm text-muted-foreground"
              >
                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                  <item.icon className="w-4 h-4 text-primary" />
                </div>
                {item.text}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="relative z-10">
          <p className="text-xs text-muted-foreground/60">
            © 2024 De China al Mundo. Todos los derechos reservados.
          </p>
        </div>
      </motion.div>

      {/* ── Right panel – Login form ────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="flex-1 flex flex-col items-center justify-center p-6 lg:p-12"
      >
        {/* Mobile logo */}
        <div className="lg:hidden mb-8">
          <Image
            src="/images/logo.png"
            alt="De China al Mundo"
            width={200}
            height={67}
            className="h-12 w-auto object-contain"
            priority
          />
        </div>

        <div className="w-full max-w-md">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8"
          >
            <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 border border-primary/20">
              <Lock className="w-6 h-6 text-primary" />
            </div>
            <h2 className="text-2xl font-bold text-foreground">Iniciar sesión</h2>
            <p className="text-muted-foreground mt-1">
              Accede al panel de administración
            </p>
          </motion.div>

          {/* Form */}
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            onSubmit={handleSubmit}
            className="space-y-5"
          >
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Correo electrónico
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setError(null) }}
                  placeholder="admin@dechinaalmundo.com"
                  required
                  autoComplete="email"
                  disabled={loading}
                  className="w-full pl-10 pr-4 py-3 bg-card border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all disabled:opacity-60"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(null) }}
                  placeholder="••••••••••"
                  required
                  autoComplete="current-password"
                  disabled={loading}
                  className="w-full pl-10 pr-12 py-3 bg-card border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all disabled:opacity-60"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  disabled={loading}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Error message */}
            <AnimatePresence mode="wait">
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -8, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: "auto" }}
                  exit={{ opacity: 0, y: -8, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-start gap-3 p-3.5 bg-destructive/10 border border-destructive/30 rounded-xl text-sm text-destructive"
                >
                  <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                  <span>{error}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading || !email || !password}
              className="w-full flex items-center justify-center gap-2 py-3 px-6 bg-primary text-primary-foreground rounded-xl font-medium text-sm hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary/20"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Iniciando sesión...
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  Iniciar sesión
                </>
              )}
            </button>
          </motion.form>

          {/* Footer note */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-8 text-center text-xs text-muted-foreground/60"
          >
            Acceso restringido a administradores autorizados.
          </motion.p>
        </div>
      </motion.div>
    </div>
  )
}
