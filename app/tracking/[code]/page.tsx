"use client"

import { useParams, useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Package, 
  Plane, 
  Ship, 
  Truck, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  ArrowLeft,
  Search,
  Weight,
  Ruler,
  Shield,
  Calendar,
  FileSearch,
  Box,
  AlertCircle,
  Globe,
  Navigation,
  Warehouse,
  CircleDot,
  ChevronRight,
  Phone
} from "lucide-react"
import Link from "next/link"
import { getTrackingInfo, getStatusColor, type TrackingInfo } from "@/lib/tracking-data"
import { getShipmentByTrackingCode, type Shipment } from "@/lib/shipments"
import { Header } from "@/components/header"

function getEventIcon(status: string): React.ComponentType<{ className?: string }> {
  const statusLower = status.toLowerCase()
  if (statusLower.includes("recibido") || statusLower.includes("almacén")) return Warehouse
  if (statusLower.includes("aéreo") || statusLower.includes("vuelo")) return Plane
  if (statusLower.includes("marítimo") || statusLower.includes("puerto")) return Ship
  if (statusLower.includes("camino") || statusLower.includes("terrestre")) return Truck
  if (statusLower.includes("aduana")) return FileSearch
  if (statusLower.includes("entregado")) return CheckCircle2
  if (statusLower.includes("liberado") || statusLower.includes("despachado")) return Box
  if (statusLower.includes("llegada")) return MapPin
  return Clock
}

function getStatusMessage(status: TrackingInfo["status"]): { title: string; description: string } {
  switch (status) {
    case "delivered":
      return { 
        title: "Entregado exitosamente", 
        description: "Tu paquete ha sido entregado en el destino final." 
      }
    case "in_transit":
      return { 
        title: "En camino", 
        description: "Tu paquete está viajando hacia su destino." 
      }
    case "customs":
      return { 
        title: "En proceso de aduana", 
        description: "Tu paquete está siendo procesado en aduana." 
      }
    case "out_for_delivery":
      return { 
        title: "En reparto", 
        description: "Tu paquete está en camino a tu dirección." 
      }
    default:
      return { 
        title: "Pendiente", 
        description: "Estamos preparando tu envío." 
      }
  }
}

// Animated globe/map visualization
function ShippingRouteVisualization({ origin, destination, progress, status }: { 
  origin: string
  destination: string
  progress: number
  status: TrackingInfo["status"]
}) {
  return (
    <div className="relative w-full h-48 md:h-64 overflow-hidden rounded-2xl bg-gradient-to-br from-secondary via-card to-secondary/50 border border-border">
      {/* Animated background grid */}
      <div className="absolute inset-0 opacity-20">
        <svg className="w-full h-full" viewBox="0 0 400 200">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-primary/30" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Shipping route line */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 200" preserveAspectRatio="xMidYMid meet">
        {/* Route path */}
        <motion.path
          d="M 60 100 Q 200 40 340 100"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeDasharray="8 4"
          className="text-border"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
        />
        
        {/* Progress path */}
        <motion.path
          d="M 60 100 Q 200 40 340 100"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          className={status === "delivered" ? "text-green-500" : "text-primary"}
          initial={{ pathLength: 0 }}
          animate={{ pathLength: progress / 100 }}
          transition={{ duration: 2, ease: "easeOut", delay: 0.5 }}
        />

        {/* Origin point */}
        <motion.circle
          cx="60"
          cy="100"
          r="8"
          className="fill-primary"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: "spring" }}
        />
        <motion.circle
          cx="60"
          cy="100"
          r="14"
          className="fill-primary/20"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.4, type: "spring" }}
        />

        {/* Destination point */}
        <motion.circle
          cx="340"
          cy="100"
          r="8"
          className={status === "delivered" ? "fill-green-500" : "fill-muted-foreground/30"}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.5, type: "spring" }}
        />
        <motion.circle
          cx="340"
          cy="100"
          r="14"
          className={status === "delivered" ? "fill-green-500/20" : "fill-muted-foreground/10"}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.6, type: "spring" }}
        />

        {/* Moving package indicator */}
        {status !== "delivered" && (
          <motion.g
            initial={{ offsetDistance: "0%" }}
            animate={{ offsetDistance: `${progress}%` }}
            transition={{ duration: 2, ease: "easeOut", delay: 0.5 }}
            style={{ offsetPath: `path("M 60 100 Q 200 40 340 100")` }}
          >
            <circle r="12" className="fill-primary" />
            <circle r="18" className="fill-primary/30">
              <animate attributeName="r" values="18;24;18" dur="2s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.3;0.1;0.3" dur="2s" repeatCount="indefinite" />
            </circle>
            <path
              d="M -6 -4 L 0 -8 L 6 -4 L 6 4 L 0 8 L -6 4 Z"
              fill="white"
            />
          </motion.g>
        )}
      </svg>

      {/* Location labels */}
      <motion.div 
        className="absolute bottom-4 left-4 md:left-8"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <div className="flex items-center gap-2 bg-card/90 backdrop-blur-sm px-3 py-2 rounded-lg border border-border">
          <div className="w-3 h-3 rounded-full bg-primary" />
          <div>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Origen</p>
            <p className="text-xs font-medium text-foreground">{origin.split(",")[0]}</p>
          </div>
        </div>
      </motion.div>

      <motion.div 
        className="absolute bottom-4 right-4 md:right-8"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
      >
        <div className="flex items-center gap-2 bg-card/90 backdrop-blur-sm px-3 py-2 rounded-lg border border-border">
          <div className={`w-3 h-3 rounded-full ${status === "delivered" ? "bg-green-500" : "bg-muted-foreground/30"}`} />
          <div>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Destino</p>
            <p className="text-xs font-medium text-foreground">{destination.split(",")[0]}</p>
          </div>
        </div>
      </motion.div>

      {/* Globe icon */}
      <motion.div
        className="absolute top-4 right-4"
        initial={{ opacity: 0, rotate: -180 }}
        animate={{ opacity: 0.3, rotate: 0 }}
        transition={{ duration: 1.5 }}
      >
        <Globe className="w-24 h-24 text-primary/10" />
      </motion.div>
    </div>
  )
}

// Status badge with animation
function StatusBadge({ status, statusLabel }: { status: TrackingInfo["status"]; statusLabel: string }) {
  const statusConfig = {
    delivered: { icon: CheckCircle2, color: "bg-green-500/10 text-green-500 border-green-500/30" },
    in_transit: { icon: Truck, color: "bg-primary/10 text-primary border-primary/30" },
    customs: { icon: FileSearch, color: "bg-yellow-500/10 text-yellow-500 border-yellow-500/30" },
    out_for_delivery: { icon: Navigation, color: "bg-blue-500/10 text-blue-500 border-blue-500/30" },
    pending: { icon: Clock, color: "bg-muted text-muted-foreground border-border" }
  }

  const config = statusConfig[status] || statusConfig.pending
  const Icon = config.icon

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border ${config.color}`}
    >
      <Icon className="w-4 h-4" />
      <span className="text-sm font-medium">{statusLabel}</span>
      {status === "in_transit" && (
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
        </span>
      )}
    </motion.div>
  )
}

// Package info card
function PackageInfoCard({ trackingInfo }: { trackingInfo: TrackingInfo }) {
  const infoItems = [
    { icon: Weight, label: "Peso", value: trackingInfo.weight },
    { icon: Ruler, label: "Dimensiones", value: trackingInfo.dimensions },
    { icon: Plane, label: "Tipo de envío", value: trackingInfo.shippingType },
    { icon: Shield, label: "Seguro", value: trackingInfo.insurance },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="bg-card border border-border rounded-2xl overflow-hidden"
    >
      <div className="p-4 md:p-6 border-b border-border bg-secondary/30">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
            <Package className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Detalles del paquete</h3>
            <p className="text-sm text-muted-foreground">Información de tu envío</p>
          </div>
        </div>
      </div>
      <div className="p-4 md:p-6 grid grid-cols-2 gap-4 md:gap-6">
        {infoItems.map((item, index) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 + index * 0.1 }}
            className="flex items-start gap-3"
          >
            <div className="w-10 h-10 bg-secondary rounded-xl flex items-center justify-center shrink-0">
              <item.icon className="w-5 h-5 text-primary" />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-muted-foreground">{item.label}</p>
              <p className="font-medium text-foreground text-sm truncate">{item.value}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

// Delivery estimate card
function DeliveryEstimateCard({ trackingInfo }: { trackingInfo: TrackingInfo }) {
  const statusMessage = getStatusMessage(trackingInfo.status)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className={`bg-gradient-to-br ${
        trackingInfo.status === "delivered" 
          ? "from-green-500/10 via-green-500/5 to-transparent border-green-500/20" 
          : "from-primary/10 via-primary/5 to-transparent border-primary/20"
      } border rounded-2xl p-4 md:p-6`}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Calendar className={`w-5 h-5 ${trackingInfo.status === "delivered" ? "text-green-500" : "text-primary"}`} />
            <span className="text-sm font-medium text-muted-foreground">
              {trackingInfo.status === "delivered" ? "Fecha de entrega" : "Entrega estimada"}
            </span>
          </div>
          <p className={`text-2xl md:text-3xl font-bold ${trackingInfo.status === "delivered" ? "text-green-500" : "text-foreground"}`}>
            {trackingInfo.estimatedDelivery}
          </p>
          <div className="mt-4">
            <p className="font-medium text-foreground">{statusMessage.title}</p>
            <p className="text-sm text-muted-foreground">{statusMessage.description}</p>
          </div>
        </div>
        {trackingInfo.status === "delivered" && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.6, type: "spring" }}
            className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center"
          >
            <CheckCircle2 className="w-8 h-8 text-green-500" />
          </motion.div>
        )}
      </div>

      {/* Progress bar */}
      {trackingInfo.status !== "delivered" && (
        <div className="mt-6">
          <div className="flex justify-between text-xs text-muted-foreground mb-2">
            <span>Progreso del envío</span>
            <span className="font-medium text-foreground">{trackingInfo.progress}%</span>
          </div>
          <div className="h-2 bg-secondary rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${trackingInfo.progress}%` }}
              transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
              className="h-full bg-primary rounded-full relative"
            >
              <motion.div
                className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-primary rounded-full shadow-lg shadow-primary/50"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </motion.div>
          </div>
        </div>
      )}
    </motion.div>
  )
}

// Current location card
function CurrentLocationCard({ trackingInfo }: { trackingInfo: TrackingInfo }) {
  const currentEvent = trackingInfo.events.find(e => e.current) || trackingInfo.events[trackingInfo.events.length - 1]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="bg-card border border-border rounded-2xl overflow-hidden"
    >
      <div className="p-4 md:p-6 border-b border-border bg-secondary/30">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center relative">
            <MapPin className="w-6 h-6 text-primary" />
            {trackingInfo.status !== "delivered" && (
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
              </span>
            )}
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Ubicación actual</h3>
            <p className="text-sm text-muted-foreground">Última actualización</p>
          </div>
        </div>
      </div>
      <div className="p-4 md:p-6">
        <div className="flex items-start gap-4">
          <div className={`w-3 h-3 rounded-full mt-1.5 shrink-0 ${
            trackingInfo.status === "delivered" ? "bg-green-500" : "bg-primary animate-pulse"
          }`} />
          <div>
            <p className="font-semibold text-foreground text-lg">{currentEvent.location}</p>
            <p className="text-sm text-muted-foreground mt-1">{currentEvent.status}</p>
            <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {currentEvent.date}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

// Enhanced timeline
function EnhancedTimeline({ trackingInfo }: { trackingInfo: TrackingInfo }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
      className="bg-card border border-border rounded-2xl overflow-hidden"
    >
      <div className="p-4 md:p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-foreground">Historial de movimientos</h2>
            <p className="text-sm text-muted-foreground mt-1">
              {trackingInfo.events.length} eventos registrados
            </p>
          </div>
          <div className="hidden md:flex items-center gap-4 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-primary" />
              <span className="text-muted-foreground">Completado</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-primary/30 animate-pulse border-2 border-primary" />
              <span className="text-muted-foreground">Actual</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-muted" />
              <span className="text-muted-foreground">Pendiente</span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 md:p-6">
        <div className="relative">
          {trackingInfo.events.map((event, index) => {
            const EventIcon = getEventIcon(event.status)
            const isLast = index === trackingInfo.events.length - 1
            
            return (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.7 + index * 0.1 }}
                className="relative flex gap-4 md:gap-6"
              >
                {/* Timeline connector */}
                {!isLast && (
                  <div className="absolute left-6 top-14 bottom-0 w-0.5 bg-border">
                    {event.completed && (
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: "100%" }}
                        transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
                        className={`w-full ${trackingInfo.status === "delivered" ? "bg-green-500" : "bg-primary"}`}
                      />
                    )}
                  </div>
                )}

                {/* Icon node */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.75 + index * 0.1, type: "spring" }}
                  className={`relative z-10 w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 transition-all ${
                    event.completed 
                      ? trackingInfo.status === "delivered" && isLast
                        ? "bg-green-500 text-white shadow-lg shadow-green-500/30"
                        : "bg-primary text-primary-foreground shadow-lg shadow-primary/30" 
                      : event.current 
                        ? "bg-card text-primary border-2 border-primary shadow-lg shadow-primary/20" 
                        : "bg-secondary text-muted-foreground"
                  }`}
                >
                  {event.completed ? (
                    <CheckCircle2 className="w-5 h-5" />
                  ) : event.current ? (
                    <motion.div
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <EventIcon className="w-5 h-5" />
                    </motion.div>
                  ) : (
                    <CircleDot className="w-5 h-5" />
                  )}
                </motion.div>

                {/* Content */}
                <div className={`flex-1 pb-8 ${!event.completed && !event.current ? "opacity-50" : ""}`}>
                  <div className="bg-secondary/50 rounded-xl p-4 border border-border/50 hover:border-border transition-colors">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-2">
                      <h4 className={`font-semibold ${
                        event.current 
                          ? "text-primary" 
                          : event.completed && trackingInfo.status === "delivered" && isLast
                            ? "text-green-500"
                            : "text-foreground"
                      }`}>
                        {event.status}
                      </h4>
                      <span className="text-xs text-muted-foreground bg-card px-3 py-1 rounded-full border border-border w-fit">
                        {event.date}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-1 text-sm text-muted-foreground mb-2">
                      <MapPin className="w-3.5 h-3.5 shrink-0" />
                      <span>{event.location}</span>
                    </div>
                    
                    <p className="text-sm text-muted-foreground">
                      {event.description}
                    </p>

                    {event.current && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        transition={{ delay: 1 }}
                        className="mt-4 pt-4 border-t border-border/50"
                      >
                        <div className="flex items-center gap-3 p-3 bg-primary/5 rounded-lg border border-primary/20">
                          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                            <Navigation className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-primary">Estado actual del envío</p>
                            <p className="text-xs text-primary/70">
                              Última actualización hace unos momentos
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </motion.div>
  )
}

// ─── Firestore → TrackingInfo mappers ─────────────────────────────────────────

function mapFirestoreStatus(status: string): TrackingInfo["status"] {
  const map: Record<string, TrackingInfo["status"]> = {
    pendiente:   "pending",
    en_transito: "in_transit",
    en_aduana:   "customs",
    entregado:   "delivered",
  }
  return map[status] ?? "pending"
}

function getStatusLabel(status: string): string {
  const map: Record<string, string> = {
    pendiente:   "Pendiente",
    en_transito: "En tránsito",
    en_aduana:   "En aduana",
    entregado:   "Entregado",
  }
  return map[status] ?? "Pendiente"
}

function getProgressFromStatus(status: string): number {
  const map: Record<string, number> = {
    pendiente:   10,
    en_transito: 65,
    en_aduana:   80,
    entregado:   100,
  }
  return map[status] ?? 10
}

function generateEventsFromStatus(status: string, destination: string) {
  const now = new Date()
  const fmt = (d: Date) =>
    d.toLocaleDateString("es-AR", { day: "2-digit", month: "short", year: "numeric" }) +
    " - " +
    d.toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" })

  const d = (daysAgo: number) => {
    const dt = new Date(now)
    dt.setDate(dt.getDate() - daysAgo)
    return dt
  }

  const allEvents = [
    {
      id: 1,
      status: "Paquete recibido en almacén",
      location: "China",
      date: fmt(d(7)),
      description: "Tu paquete ha sido recibido en nuestro almacén y está siendo preparado para envío.",
      completed: true,
    },
    {
      id: 2,
      status: "En tránsito internacional",
      location: "China → Destino",
      date: fmt(d(5)),
      description: "El paquete está en camino hacia su destino.",
      completed: status !== "pendiente",
      current: status === "en_transito",
    },
    {
      id: 3,
      status: "En proceso de aduana",
      location: destination,
      date: fmt(d(2)),
      description: "Tu paquete está siendo procesado en aduana.",
      completed: status === "entregado" || status === "en_aduana",
      current: status === "en_aduana",
    },
    {
      id: 4,
      status: "Entregado",
      location: destination,
      date: status === "entregado" ? fmt(d(0)) : "Estimado próximamente",
      description: "Tu paquete ha sido entregado exitosamente.",
      completed: status === "entregado",
    },
  ]

  return allEvents
}

export default function TrackingPage() {
  const params = useParams()
  const router = useRouter()
  const code = params.code as string
  
  const [trackingInfo, setTrackingInfo] = useState<TrackingInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [searchCode, setSearchCode] = useState("")

  useEffect(() => {
    setLoading(true)
    setNotFound(false)
    setTrackingInfo(null)

    const fetchTracking = async () => {
      // 1. Try Firestore (real shipments from admin panel)
      try {
        const firestoreShipment = await getShipmentByTrackingCode(code)
        if (firestoreShipment) {
          // Map Firestore Shipment to TrackingInfo format
          const mappedInfo: TrackingInfo = {
            trackingNumber: firestoreShipment.trackingCode,
            status: mapFirestoreStatus(firestoreShipment.status),
            statusLabel: getStatusLabel(firestoreShipment.status),
            origin: "China",
            destination: firestoreShipment.destination,
            estimatedDelivery: firestoreShipment.estimatedDelivery || "Por confirmar",
            weight: firestoreShipment.weight || "Por confirmar",
            dimensions: "Por confirmar",
            shippingType: firestoreShipment.serviceType === "air" ? "Express Aéreo" : "Marítimo Express",
            insurance: "Incluido",
            progress: getProgressFromStatus(firestoreShipment.status),
            events: generateEventsFromStatus(firestoreShipment.status, firestoreShipment.destination),
          }
          setTrackingInfo(mappedInfo)
          setLoading(false)
          return
        }
      } catch (err) {
        console.warn("Firestore lookup failed, falling back to demo data:", err)
      }

      // 2. Fall back to static demo data (DCM-DEMO01, DCM-AR2401, CN-TRACK01)
      const info = getTrackingInfo(code)
      if (info) {
        setTrackingInfo(info)
      } else {
        setNotFound(true)
      }
      setLoading(false)
    }

    fetchTracking()
  }, [code])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchCode.trim()) {
      router.push(`/tracking/${encodeURIComponent(searchCode.trim())}`)
    }
  }

  return (
    <>
      <Header />
      <main className="min-h-screen pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Navigation bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8"
          >
            <Link 
              href="/" 
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span>Volver al inicio</span>
            </Link>

            <form onSubmit={handleSearch} className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Buscar otro código..."
                  value={searchCode}
                  onChange={(e) => setSearchCode(e.target.value)}
                  className="pl-10 pr-4 py-2.5 bg-card border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 w-full sm:w-64 transition-all"
                />
              </div>
              <button
                type="submit"
                className="px-5 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-medium hover:bg-primary/90 transition-colors flex items-center gap-2"
              >
                <Search className="w-4 h-4" />
                <span className="hidden sm:inline">Buscar</span>
              </button>
            </form>
          </motion.div>

          {/* Loading State */}
          <AnimatePresence mode="wait">
            {loading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center py-24"
              >
                <div className="relative">
                  <div className="w-20 h-20 border-4 border-primary/20 rounded-full" />
                  <div className="absolute inset-0 w-20 h-20 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                  <Package className="absolute inset-0 m-auto w-8 h-8 text-primary" />
                </div>
                <p className="text-muted-foreground mt-6">Buscando información del envío...</p>
                <p className="text-xs text-muted-foreground/60 mt-2 font-mono">{code}</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Not Found State */}
          <AnimatePresence mode="wait">
            {notFound && !loading && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="max-w-lg mx-auto text-center py-16"
              >
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", delay: 0.2 }}
                  className="w-24 h-24 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-6"
                >
                  <AlertCircle className="w-12 h-12 text-destructive" />
                </motion.div>
                <h1 className="text-2xl font-bold text-foreground mb-4">Envío no encontrado</h1>
                <p className="text-muted-foreground mb-8">
                  No pudimos encontrar información para el código de seguimiento{" "}
                  <span className="font-mono text-foreground bg-secondary px-2 py-1 rounded">{code}</span>. 
                  Por favor verificá que el código sea correcto.
                </p>
                <div className="p-6 bg-card border border-border rounded-2xl mb-8 shadow-sm">
                  <p className="text-sm font-medium text-muted-foreground mb-4">Seguimientos de demostración:</p>
                  <div className="flex flex-wrap gap-3 justify-center">
                    {["DCM-DEMO01", "DCM-AR2401", "CN-TRACK01"].map((demoCode) => (
                      <Link
                        key={demoCode}
                        href={`/tracking/${demoCode}`}
                        className="group px-5 py-2.5 bg-secondary text-sm font-mono font-medium text-foreground rounded-xl hover:bg-primary hover:text-primary-foreground hover:scale-105 hover:shadow-lg hover:shadow-primary/25 transition-all duration-300 flex items-center gap-2 border border-border hover:border-primary/50"
                      >
                        {demoCode}
                        <ChevronRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                      </Link>
                    ))}
                  </div>
                </div>
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Volver al inicio
                </Link>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Tracking Info */}
          {trackingInfo && !loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              {/* Header with tracking number and status */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Número de seguimiento</p>
                    <h1 className="text-2xl md:text-3xl font-mono font-bold text-foreground">
                      {trackingInfo.trackingNumber}
                    </h1>
                  </div>
                  <StatusBadge status={trackingInfo.status} statusLabel={trackingInfo.statusLabel} />
                </div>
              </motion.div>

              {/* Route visualization */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="mb-6"
              >
                <ShippingRouteVisualization 
                  origin={trackingInfo.origin}
                  destination={trackingInfo.destination}
                  progress={trackingInfo.progress}
                  status={trackingInfo.status}
                />
              </motion.div>

              {/* Info grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                <div className="lg:col-span-1">
                  <DeliveryEstimateCard trackingInfo={trackingInfo} />
                </div>
                <div className="lg:col-span-1">
                  <CurrentLocationCard trackingInfo={trackingInfo} />
                </div>
                <div className="lg:col-span-1">
                  <PackageInfoCard trackingInfo={trackingInfo} />
                </div>
              </div>

              {/* Timeline */}
              <EnhancedTimeline trackingInfo={trackingInfo} />

              {/* Help section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="mt-8 p-6 bg-gradient-to-r from-card via-card to-secondary/30 border border-border rounded-2xl"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center shrink-0">
                      <Phone className="w-6 h-6 text-green-500" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">¿Necesitás ayuda con tu envío?</h3>
                      <p className="text-sm text-muted-foreground">
                        Nuestro equipo de soporte está disponible 24/7 para asistirte.
                      </p>
                    </div>
                  </div>
                  <a
                    href="https://wa.me/5491157676423?text=Hola!%20Necesito%20ayuda%20con%20mi%20envío%20${trackingInfo.trackingNumber}"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-green-500 text-white rounded-xl font-medium hover:bg-green-600 transition-colors shadow-lg shadow-green-500/20 shrink-0"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                    Contactar soporte
                  </a>
                </div>
              </motion.div>
            </motion.div>
          )}
        </div>
      </main>
    </>
  )
}
