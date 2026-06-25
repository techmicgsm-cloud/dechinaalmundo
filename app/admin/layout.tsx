"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Toaster } from "sonner"
import {
  LayoutDashboard,
  Package,
  Users,
  MapPin,
  Settings,
  Menu,
  X,
  LogOut,
  Bell,
  Search,
  ChevronDown,
  Loader2,
} from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import { signOut } from "@/lib/auth"

const sidebarItems = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Envíos", href: "/admin/envios", icon: Package },
  { name: "Clientes", href: "/admin/clientes", icon: Users },
  { name: "Tracking", href: "/admin/tracking", icon: MapPin },
  { name: "Configuración", href: "/admin/configuracion", icon: Settings },
]

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen,  setSidebarOpen]  = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [signingOut,   setSigningOut]   = useState(false)
  const pathname   = usePathname()
  const router     = useRouter()
  const { user, loading: authLoading, isAuthenticated } = useAuth()

  // ── Auth guard: redirect to /login if not authenticated or not allowed ──
  const allowedEmails = ["diazarielg@gmail.com", "techmicgsm@gmail.com"]
  const isAllowed = user?.email && allowedEmails.includes(user.email)

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="w-14 h-14 border-4 border-primary/20 rounded-full" />
            <div className="absolute inset-0 w-14 h-14 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            <Package className="absolute inset-0 m-auto w-5 h-5 text-primary" />
          </div>
          <p className="text-muted-foreground text-sm">Verificando acceso...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated || !isAllowed) {
    if (typeof window !== "undefined") {
      if (isAuthenticated && !isAllowed) {
        // If logged in with an unauthorized email, sign them out
        signOut().catch(console.error)
      }
      router.replace("/login")
    }
    return null
  }

  // ── Logout handler ────────────────────────────────────────────────────────
  const handleSignOut = async () => {
    setSigningOut(true)
    try {
      await signOut()
      router.replace("/login")
    } catch {
      setSigningOut(false)
    }
  }

  // Derive display info from Firebase user
  const userEmail    = user?.email ?? "admin@dechinaalmundo.com"
  const userInitial  = userEmail.charAt(0).toUpperCase()

  return (
    <div className="min-h-screen bg-background flex">
      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-72 bg-sidebar border-r border-sidebar-border transform transition-transform duration-300 ease-in-out lg:transform-none ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="py-8 px-6 border-b border-sidebar-border bg-gradient-to-b from-sidebar-accent/20 to-transparent">
            <Link href="/admin" className="flex items-center justify-center group relative">
              <div className="absolute inset-0 bg-primary/10 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              <Image
                src="/images/logo.png"
                alt="De China al Mundo"
                width={280}
                height={94}
                className="h-16 sm:h-16 lg:h-[80px] w-auto object-contain relative z-10 transition-transform duration-500 group-hover:scale-[1.02] drop-shadow-[0_0_15px_rgba(255,255,255,0.05)]"
                priority
              />
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1">
            {sidebarItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-lg shadow-primary/20"
                      : "text-muted-foreground hover:text-sidebar-foreground hover:bg-sidebar-accent"
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  {item.name}
                  {isActive && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="ml-auto w-1.5 h-1.5 bg-white rounded-full"
                    />
                  )}
                </Link>
              )
            })}
          </nav>

          {/* User section */}
          <div className="p-4 border-t border-sidebar-border">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-sidebar-accent/50">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold shrink-0">
                {userInitial}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-sidebar-foreground truncate">Administrador</p>
                <p className="text-xs text-muted-foreground truncate">{userEmail}</p>
              </div>
              <button
                onClick={handleSignOut}
                disabled={signingOut}
                title="Cerrar sesión"
                className="p-2 text-muted-foreground hover:text-sidebar-foreground transition-colors disabled:opacity-50"
              >
                {signingOut ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <LogOut className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top header */}
        <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-xl border-b border-border">
          <div className="flex items-center justify-between px-4 lg:px-8 h-16">
            {/* Mobile menu button */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <Menu className="w-6 h-6" />
            </button>

            {/* Search */}
            <div className="hidden md:flex items-center flex-1 max-w-md mx-4">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Buscar envíos, clientes..."
                  className="w-full pl-10 pr-4 py-2 bg-input border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-all"
                />
              </div>
            </div>

            {/* Right actions */}
            <div className="flex items-center gap-2">
              {/* Notifications */}
              <button className="relative p-2 text-muted-foreground hover:text-foreground transition-colors">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full" />
              </button>

              {/* User menu */}
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 p-2 rounded-xl hover:bg-muted transition-colors"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                    {userInitial}
                  </div>
                  <ChevronDown className="w-4 h-4 text-muted-foreground hidden sm:block" />
                </button>

                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 top-full mt-2 w-48 bg-card border border-border rounded-xl shadow-xl overflow-hidden"
                    >
                      <div className="p-2">
                        <Link
                          href="/admin/configuracion"
                          className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
                        >
                          <Settings className="w-4 h-4" />
                          Configuración
                        </Link>
                        <button
                          onClick={handleSignOut}
                          disabled={signingOut}
                          className="flex items-center gap-2 px-3 py-2 text-sm text-destructive hover:bg-destructive/10 rounded-lg transition-colors w-full disabled:opacity-50"
                        >
                          {signingOut ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <LogOut className="w-4 h-4" />
                          )}
                          Cerrar sesión
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 lg:p-8">
          {children}
        </main>
      </div>
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: "hsl(var(--card))",
            border: "1px solid hsl(var(--border))",
            color: "hsl(var(--foreground))",
          },
        }}
      />
    </div>
  )
}
