"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import {
  MapPin,
  Search,
  Package,
  Truck,
  Plane,
  Ship,
  CheckCircle2,
  Clock,
  AlertCircle,
  ArrowRight,
  ExternalLink,
} from "lucide-react"
import Link from "next/link"

const activeShipments = [
  {
    id: "DCM-DEMO01",
    client: "María García",
    status: "en_transito",
    progress: 75,
    origin: "Shanghai, China",
    destination: "Buenos Aires, Argentina",
    currentLocation: "En vuelo - Sobre el Océano Pacífico",
    estimatedDate: "2024-01-25",
    type: "air",
  },
  {
    id: "CN-TRACK01",
    client: "Ana Martínez",
    status: "en_aduana",
    progress: 85,
    origin: "Guangzhou, China",
    destination: "Mendoza, Argentina",
    currentLocation: "Aduana Argentina - Buenos Aires",
    estimatedDate: "2024-01-28",
    type: "air",
  },
  {
    id: "DCM-LP2401",
    client: "Laura Fernández",
    status: "en_transito",
    progress: 45,
    origin: "Shanghai, China",
    destination: "La Plata, Argentina",
    currentLocation: "Puerto de Shenzhen - Carga en proceso",
    estimatedDate: "2024-02-10",
    type: "sea",
  },
  {
    id: "DCM-BA2401",
    client: "Diego Ramírez",
    status: "en_transito",
    progress: 90,
    origin: "Beijing, China",
    destination: "Buenos Aires, Argentina",
    currentLocation: "En camino a destino final",
    estimatedDate: "2024-01-20",
    type: "air",
  },
]

const statusConfig: Record<string, { label: string; icon: typeof Package; color: string }> = {
  pendiente: { label: "Pendiente", icon: Clock, color: "text-amber-400" },
  en_transito: { label: "En Tránsito", icon: Truck, color: "text-blue-400" },
  en_aduana: { label: "En Aduana", icon: AlertCircle, color: "text-purple-400" },
  entregado: { label: "Entregado", icon: CheckCircle2, color: "text-emerald-400" },
}

export default function TrackingPage() {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredShipments = activeShipments.filter(
    (shipment) =>
      shipment.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shipment.client.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Tracking en Vivo</h1>
          <p className="text-muted-foreground mt-1">Monitorea envíos en tiempo real</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-2xl p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-500/20">
              <Truck className="w-4 h-4 text-blue-400" />
            </div>
            <div>
              <p className="text-xl font-bold text-foreground">24</p>
              <p className="text-xs text-muted-foreground">En Tránsito</p>
            </div>
          </div>
        </div>
        <div className="bg-card border border-border rounded-2xl p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-purple-500/20">
              <AlertCircle className="w-4 h-4 text-purple-400" />
            </div>
            <div>
              <p className="text-xl font-bold text-foreground">8</p>
              <p className="text-xs text-muted-foreground">En Aduana</p>
            </div>
          </div>
        </div>
        <div className="bg-card border border-border rounded-2xl p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-500/20">
              <Clock className="w-4 h-4 text-amber-400" />
            </div>
            <div>
              <p className="text-xl font-bold text-foreground">5</p>
              <p className="text-xs text-muted-foreground">Pendientes</p>
            </div>
          </div>
        </div>
        <div className="bg-card border border-border rounded-2xl p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald-500/20">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <p className="text-xl font-bold text-foreground">156</p>
              <p className="text-xs text-muted-foreground">Entregados</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Buscar por código o cliente..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-card border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-all"
        />
      </div>

      {/* Active shipments */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-foreground">Envíos Activos</h2>
        
        <div className="grid gap-4">
          {filteredShipments.map((shipment, index) => {
            const StatusIcon = statusConfig[shipment.status].icon
            return (
              <motion.div
                key={shipment.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-card border border-border rounded-2xl p-6 hover:border-primary/30 transition-colors"
              >
                <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                  {/* Shipment info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 rounded-lg bg-primary/10">
                        {shipment.type === "air" ? (
                          <Plane className="w-4 h-4 text-primary" />
                        ) : (
                          <Ship className="w-4 h-4 text-primary" />
                        )}
                      </div>
                      <div>
                        <Link
                          href={`/tracking/${shipment.id}`}
                          className="font-mono font-semibold text-foreground hover:text-primary transition-colors"
                        >
                          {shipment.id}
                        </Link>
                        <p className="text-xs text-muted-foreground">{shipment.client}</p>
                      </div>
                      <span
                        className={`ml-auto lg:ml-0 inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-lg ${statusConfig[shipment.status].color} bg-current/10`}
                      >
                        <StatusIcon className="w-3 h-3" />
                        {statusConfig[shipment.status].label}
                      </span>
                    </div>

                    {/* Route */}
                    <div className="flex items-center gap-2 text-sm mb-3">
                      <span className="text-muted-foreground truncate">{shipment.origin}</span>
                      <ArrowRight className="w-4 h-4 text-muted-foreground shrink-0" />
                      <span className="text-foreground truncate">{shipment.destination}</span>
                    </div>

                    {/* Current location */}
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="w-4 h-4 text-primary shrink-0" />
                      <span className="text-primary font-medium">{shipment.currentLocation}</span>
                    </div>
                  </div>

                  {/* Progress */}
                  <div className="lg:w-64 space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Progreso</span>
                      <span className="font-medium text-foreground">{shipment.progress}%</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${shipment.progress}%` }}
                        transition={{ delay: index * 0.1 + 0.3, duration: 0.8 }}
                        className="h-full bg-gradient-to-r from-primary to-orange-500 rounded-full"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground text-right">
                      Llegada estimada: {shipment.estimatedDate}
                    </p>
                  </div>

                  {/* Action */}
                  <Link
                    href={`/tracking/${shipment.id}`}
                    className="shrink-0 flex items-center gap-2 px-4 py-2.5 bg-primary/10 text-primary rounded-xl text-sm font-medium hover:bg-primary/20 transition-colors"
                  >
                    Ver detalles
                    <ExternalLink className="w-4 h-4" />
                  </Link>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
