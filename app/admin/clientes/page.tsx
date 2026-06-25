"use client"

import { useState, useEffect, useMemo } from "react"
import { motion } from "framer-motion"
import {
  Users,
  Search,
  Phone,
  MapPin,
  Package,
  MoreHorizontal,
  UserPlus,
  Loader2,
} from "lucide-react"
import { subscribeShipments, type Shipment } from "@/lib/shipments"

// Interfaz generada dinámicamente
interface ClientInfo {
  id: string
  name: string
  phone: string
  address: string
  totalShipments: number
  lastShipmentDate: Date
  firstShipmentDate: Date
}

export default function ClientesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [shipments, setShipments] = useState<Shipment[]>([])
  const [loading, setLoading] = useState(true)

  // Suscripción a los envíos en tiempo real
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

  // Extraer clientes únicos a partir de los envíos
  const clients = useMemo(() => {
    const clientMap = new Map<string, ClientInfo>()

    shipments.forEach((s) => {
      // Usamos el teléfono (y nombre) como identificador único
      const key = `${s.customerName.toLowerCase()}-${s.phone}`
      const shipmentDate = new Date(s.createdAt)

      if (clientMap.has(key)) {
        const existing = clientMap.get(key)!
        existing.totalShipments += 1
        
        // Actualizar la última fecha y dirección si este envío es más reciente
        if (shipmentDate > existing.lastShipmentDate) {
          existing.lastShipmentDate = shipmentDate
          // Tomar la dirección más reciente utilizada
          existing.address = s.address || s.destination
        }
        // Actualizar la primera fecha de envío (para saber si es nuevo este mes)
        if (shipmentDate < existing.firstShipmentDate) {
          existing.firstShipmentDate = shipmentDate
        }
      } else {
        clientMap.set(key, {
          id: key,
          name: s.customerName,
          phone: s.phone,
          address: s.address || s.destination,
          totalShipments: 1,
          lastShipmentDate: shipmentDate,
          firstShipmentDate: shipmentDate,
        })
      }
    })

    // Convertir a array y ordenar alfabéticamente
    return Array.from(clientMap.values()).sort((a, b) => a.name.localeCompare(b.name))
  }, [shipments])

  // Filtrar clientes
  const filteredClients = clients.filter(
    (client) =>
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.phone.includes(searchTerm)
  )

  // Calcular "Nuevos este mes"
  const currentMonth = new Date().getMonth()
  const currentYear = new Date().getFullYear()
  const newClientsThisMonth = clients.filter((c) => {
    return (
      c.firstShipmentDate.getMonth() === currentMonth &&
      c.firstShipmentDate.getFullYear() === currentYear
    )
  }).length

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
        <p className="text-muted-foreground text-sm">Cargando base de clientes...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Clientes</h1>
          <p className="text-muted-foreground mt-1">Gestiona tu base de clientes</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-xl font-medium text-sm hover:bg-primary/90 transition-colors">
          <UserPlus className="w-4 h-4" />
          Nuevo Cliente
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-card border border-border rounded-2xl p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600">
              <Users className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{clients.length}</p>
              <p className="text-sm text-muted-foreground">Total Clientes</p>
            </div>
          </div>
        </div>
        <div className="bg-card border border-border rounded-2xl p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600">
              <Package className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{shipments.length}</p>
              <p className="text-sm text-muted-foreground">Envíos Totales</p>
            </div>
          </div>
        </div>
        <div className="bg-card border border-border rounded-2xl p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-primary to-orange-600">
              <UserPlus className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{newClientsThisMonth}</p>
              <p className="text-sm text-muted-foreground">Nuevos este mes</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Buscar por nombre o teléfono..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-card border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-all"
        />
      </div>

      {/* Clients grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredClients.length === 0 ? (
          <div className="col-span-full py-12 text-center">
            <p className="text-muted-foreground">No se encontraron clientes.</p>
          </div>
        ) : filteredClients.map((client, index) => (
          <motion.div
            key={client.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="bg-card border border-border rounded-2xl p-6 hover:border-primary/30 transition-colors flex flex-col h-full"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                  {client.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-semibold text-foreground truncate max-w-[150px]">{client.name}</h3>
                  <p className="text-xs text-muted-foreground">
                    {client.totalShipments} envío{client.totalShipments !== 1 ? 's' : ''}
                  </p>
                </div>
              </div>
              <button className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors">
                <MoreHorizontal className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 flex-1">
              <div className="flex items-center gap-2 text-sm">
                <Phone className="w-4 h-4 text-muted-foreground shrink-0" />
                <span className="text-muted-foreground truncate">{client.phone}</span>
              </div>
              <div className="flex items-start gap-2 text-sm">
                <MapPin className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
                <span className="text-muted-foreground line-clamp-2">{client.address}</span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
              <span className="text-xs text-muted-foreground">
                Último envío: {client.lastShipmentDate.toLocaleDateString()}
              </span>
              <button className="text-xs text-primary hover:underline">Ver envíos</button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
