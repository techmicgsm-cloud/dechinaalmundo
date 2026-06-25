"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import {
  Package,
  Truck,
  CheckCircle2,
  Clock,
  TrendingUp,
  TrendingDown,
  ArrowRight,
  Plus,
  Eye,
  MoreHorizontal,
  Plane,
  Ship,
  DollarSign,
  Loader2,
} from "lucide-react"
import Link from "next/link"
import { subscribeShipments, type Shipment } from "@/lib/shipments"

const statusConfig: Record<string, { label: string; class: string }> = {
  pendiente: { label: "Pendiente", class: "bg-amber-500/20 text-amber-400 border-amber-500/30" },
  en_transito: { label: "En Tránsito", class: "bg-blue-500/20 text-blue-400 border-blue-500/30" },
  en_aduana: { label: "En Aduana", class: "bg-purple-500/20 text-purple-400 border-purple-500/30" },
  entregado: { label: "Entregado", class: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" },
}

export default function AdminDashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState("7d")
  const [shipments, setShipments] = useState<Shipment[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = subscribeShipments(
      (data) => {
        setShipments(data)
        setLoading(false)
      },
      (error) => {
        console.error("Error fetching shipments:", error)
        setLoading(false)
      }
    )
    return () => unsubscribe()
  }, [])

  // ── Cálculos Dinámicos ──

  const totalShipments = shipments.length
  const inTransitCount = shipments.filter((s) => s.status === "en_transito").length
  const deliveredCount = shipments.filter((s) => s.status === "entregado").length
  const pendingCount = shipments.filter((s) => s.status === "pendiente").length

  const airCount = shipments.filter((s) => s.serviceType === "air").length
  const seaCount = shipments.filter((s) => s.serviceType === "sea").length

  // Mostrar los últimos 5 envíos (ya vienen ordenados por fecha desc desde lib)
  const recentShipments = shipments.slice(0, 5)

  // Usaremos los envíos recientes como "Actividad reciente"
  const recentActivity = recentShipments.map((s, index) => ({
    id: s.id,
    action: `Nuevo envío ${s.serviceType === "air" ? "Aéreo" : "Marítimo"} registrado`,
    shipment: s.trackingCode,
    time: s.createdAt ? new Date(s.createdAt).toLocaleDateString() : "Reciente",
  }))

  const stats = [
    {
      name: "Total Envíos",
      value: totalShipments.toString(),
      change: "+0.0%",
      trend: "up",
      icon: Package,
      color: "from-blue-500 to-blue-600",
    },
    {
      name: "En Tránsito",
      value: inTransitCount.toString(),
      change: "+0.0%",
      trend: "up",
      icon: Truck,
      color: "from-primary to-orange-600",
    },
    {
      name: "Entregados",
      value: deliveredCount.toString(),
      change: "+0.0%",
      trend: "up",
      icon: CheckCircle2,
      color: "from-emerald-500 to-emerald-600",
    },
    {
      name: "Pendientes",
      value: pendingCount.toString(),
      change: "+0.0%",
      trend: "down",
      icon: Clock,
      color: "from-amber-500 to-amber-600",
    },
  ]

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
        <p className="text-muted-foreground text-sm">Cargando dashboard...</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Resumen de operaciones y envíos</p>
        </div>
        <div className="flex items-center gap-3">
          {/* Period selector */}
          <div className="flex items-center bg-card border border-border rounded-xl p-1">
            {["24h", "7d", "30d", "90d"].map((period) => (
              <button
                key={period}
                onClick={() => setSelectedPeriod(period)}
                className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-all ${
                  selectedPeriod === period
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {period}
              </button>
            ))}
          </div>
          <Link
            href="/admin/envios"
            className="flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-xl font-medium text-sm hover:bg-primary/90 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Nuevo Envío
          </Link>
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-card border border-border rounded-2xl p-6 hover:border-primary/30 transition-colors"
          >
            <div className="flex items-start justify-between">
              <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color}`}>
                <stat.icon className="w-5 h-5 text-white" />
              </div>
              <div
                className={`flex items-center gap-1 text-sm font-medium ${
                  stat.trend === "up" ? "text-emerald-400" : "text-red-400"
                }`}
              >
                {stat.trend === "up" ? (
                  <TrendingUp className="w-4 h-4" />
                ) : (
                  <TrendingDown className="w-4 h-4" />
                )}
                {stat.change}
              </div>
            </div>
            <div className="mt-4">
              <h3 className="text-3xl font-bold text-foreground">{stat.value}</h3>
              <p className="text-sm text-muted-foreground mt-1">{stat.name}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts and tables section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent shipments table */}
        <div className="lg:col-span-2 bg-card border border-border rounded-2xl overflow-hidden flex flex-col">
          <div className="p-6 border-b border-border flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-foreground">Envíos Recientes</h2>
              <p className="text-sm text-muted-foreground">Últimos {recentShipments.length} envíos registrados</p>
            </div>
            <Link
              href="/admin/envios"
              className="flex items-center gap-1 text-sm text-primary hover:text-primary/80 transition-colors"
            >
              Ver todos
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="overflow-x-auto flex-1">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-4">
                    Tracking
                  </th>
                  <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-4">
                    Cliente
                  </th>
                  <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-4">
                    Estado
                  </th>
                  <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-4">
                    Tipo
                  </th>
                  <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-4">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {recentShipments.length === 0 ? (
                   <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-sm text-muted-foreground">
                      No hay envíos registrados
                    </td>
                  </tr>
                ) : recentShipments.map((shipment, index) => (
                  <motion.tr
                    key={shipment.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-muted/30 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <Link
                        href={`/tracking/${shipment.trackingCode}`}
                        className="text-sm font-mono font-medium text-primary hover:underline"
                        target="_blank"
                      >
                        {shipment.trackingCode}
                      </Link>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-foreground">{shipment.customerName}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-lg border ${
                          statusConfig[shipment.status]?.class || ""
                        }`}
                      >
                        {statusConfig[shipment.status]?.label || shipment.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {shipment.serviceType === "air" ? (
                          <Plane className="w-4 h-4 text-blue-400" />
                        ) : (
                          <Ship className="w-4 h-4 text-cyan-400" />
                        )}
                        <span className="text-sm text-muted-foreground capitalize">
                          {shipment.serviceType === "air" ? "Aéreo" : "Marítimo"}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/tracking/${shipment.trackingCode}`}
                          className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
                          title="Ver tracking"
                          target="_blank"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <Link href="/admin/envios" className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors" title="Gestionar">
                          <MoreHorizontal className="w-4 h-4" />
                        </Link>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent activity */}
        <div className="bg-card border border-border rounded-2xl overflow-hidden">
          <div className="p-6 border-b border-border">
            <h2 className="text-lg font-semibold text-foreground">Actividad Reciente</h2>
            <p className="text-sm text-muted-foreground">Últimos movimientos</p>
          </div>
          <div className="p-4 space-y-3">
            {recentActivity.length === 0 ? (
               <p className="text-sm text-muted-foreground text-center py-4">Sin actividad</p>
            ) : recentActivity.map((activity, index) => (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start gap-3 p-3 rounded-xl hover:bg-muted/30 transition-colors"
              >
                <div className="w-2 h-2 mt-2 bg-primary rounded-full" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground">{activity.action}</p>
                  <p className="text-xs text-primary font-mono truncate">{activity.shipment}</p>
                  <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 lg:gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card border border-border rounded-2xl p-6"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500">
              <Plane className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{airCount}</p>
              <p className="text-sm text-muted-foreground">Envíos Aéreos</p>
            </div>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card border border-border rounded-2xl p-6"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-cyan-500 to-teal-500">
              <Ship className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{seaCount}</p>
              <p className="text-sm text-muted-foreground">Envíos Marítimos</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
