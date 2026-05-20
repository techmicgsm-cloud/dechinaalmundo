"use client"

import { useState } from "react"
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
  Calendar,
  DollarSign,
} from "lucide-react"
import Link from "next/link"

// Dashboard data
const stats = [
  {
    name: "Total Envíos",
    value: "1,284",
    change: "+12.5%",
    trend: "up",
    icon: Package,
    color: "from-blue-500 to-blue-600",
  },
  {
    name: "En Tránsito",
    value: "342",
    change: "+8.2%",
    trend: "up",
    icon: Truck,
    color: "from-primary to-orange-600",
  },
  {
    name: "Entregados",
    value: "891",
    change: "+15.3%",
    trend: "up",
    icon: CheckCircle2,
    color: "from-emerald-500 to-emerald-600",
  },
  {
    name: "Pendientes",
    value: "51",
    change: "-5.1%",
    trend: "down",
    icon: Clock,
    color: "from-amber-500 to-amber-600",
  },
]

const recentShipments = [
  {
    id: "DCM-DEMO01",
    client: "María García",
    status: "en_transito",
    origin: "Shanghai, China",
    destination: "Buenos Aires, Argentina",
    date: "2024-01-15",
    type: "air",
  },
  {
    id: "DCM-AR2401",
    client: "Carlos López",
    status: "entregado",
    origin: "Shenzhen, China",
    destination: "Córdoba, Argentina",
    date: "2024-01-14",
    type: "sea",
  },
  {
    id: "CN-TRACK01",
    client: "Ana Martínez",
    status: "en_aduana",
    origin: "Guangzhou, China",
    destination: "Mendoza, Argentina",
    date: "2024-01-13",
    type: "air",
  },
  {
    id: "DCM-RS2401",
    client: "Roberto Sánchez",
    status: "pendiente",
    origin: "Beijing, China",
    destination: "Rosario, Argentina",
    date: "2024-01-12",
    type: "sea",
  },
  {
    id: "DCM-LP2401",
    client: "Laura Fernández",
    status: "en_transito",
    origin: "Shanghai, China",
    destination: "La Plata, Argentina",
    date: "2024-01-11",
    type: "air",
  },
]

const recentActivity = [
  {
    id: 1,
    action: "Nuevo envío creado",
    shipment: "DCM-DEMO01",
    time: "Hace 2 horas",
  },
  {
    id: 2,
    action: "Estado actualizado a En Tránsito",
    shipment: "DCM-AR2401",
    time: "Hace 4 horas",
  },
  {
    id: 3,
    action: "Envío entregado",
    shipment: "CN-TRACK01",
    time: "Hace 6 horas",
  },
  {
    id: 4,
    action: "Cliente registrado",
    shipment: "Roberto Sánchez",
    time: "Hace 8 horas",
  },
]

const statusConfig: Record<string, { label: string; class: string }> = {
  pendiente: { label: "Pendiente", class: "bg-amber-500/20 text-amber-400 border-amber-500/30" },
  en_transito: { label: "En Tránsito", class: "bg-blue-500/20 text-blue-400 border-blue-500/30" },
  en_aduana: { label: "En Aduana", class: "bg-purple-500/20 text-purple-400 border-purple-500/30" },
  entregado: { label: "Entregado", class: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" },
}

export default function AdminDashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState("7d")

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
        <div className="lg:col-span-2 bg-card border border-border rounded-2xl overflow-hidden">
          <div className="p-6 border-b border-border flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-foreground">Envíos Recientes</h2>
              <p className="text-sm text-muted-foreground">Últimos 5 envíos registrados</p>
            </div>
            <Link
              href="/admin/envios"
              className="flex items-center gap-1 text-sm text-primary hover:text-primary/80 transition-colors"
            >
              Ver todos
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="overflow-x-auto">
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
                {recentShipments.map((shipment, index) => (
                  <motion.tr
                    key={shipment.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-muted/30 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <Link
                        href={`/tracking/${shipment.id}`}
                        className="text-sm font-mono font-medium text-primary hover:underline"
                      >
                        {shipment.id}
                      </Link>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-foreground">{shipment.client}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-lg border ${
                          statusConfig[shipment.status].class
                        }`}
                      >
                        {statusConfig[shipment.status].label}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {shipment.type === "air" ? (
                          <Plane className="w-4 h-4 text-blue-400" />
                        ) : (
                          <Ship className="w-4 h-4 text-cyan-400" />
                        )}
                        <span className="text-sm text-muted-foreground capitalize">
                          {shipment.type === "air" ? "Aéreo" : "Marítimo"}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/tracking/${shipment.id}`}
                          className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <button className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors">
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
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
            {recentActivity.map((activity, index) => (
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
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-6">
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
              <p className="text-2xl font-bold text-foreground">156</p>
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
              <p className="text-2xl font-bold text-foreground">186</p>
              <p className="text-sm text-muted-foreground">Envíos Marítimos</p>
            </div>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-card border border-border rounded-2xl p-6"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-500 to-green-500">
              <DollarSign className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">$45.2K</p>
              <p className="text-sm text-muted-foreground">Ingresos del Mes</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
