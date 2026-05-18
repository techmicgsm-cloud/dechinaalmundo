"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import {
  Users,
  Search,
  Plus,
  Mail,
  Phone,
  MapPin,
  Package,
  MoreHorizontal,
  UserPlus,
} from "lucide-react"

const clients = [
  {
    id: 1,
    name: "María García",
    email: "maria.garcia@email.com",
    phone: "+54 9 11 1234-5678",
    address: "Av. Corrientes 1234, Buenos Aires",
    totalShipments: 12,
    lastShipment: "2024-01-15",
  },
  {
    id: 2,
    name: "Carlos López",
    email: "carlos.lopez@email.com",
    phone: "+54 9 351 234-5678",
    address: "San Martín 567, Córdoba",
    totalShipments: 8,
    lastShipment: "2024-01-14",
  },
  {
    id: 3,
    name: "Ana Martínez",
    email: "ana.martinez@email.com",
    phone: "+54 9 261 345-6789",
    address: "Las Heras 890, Mendoza",
    totalShipments: 5,
    lastShipment: "2024-01-13",
  },
  {
    id: 4,
    name: "Roberto Sánchez",
    email: "roberto.sanchez@email.com",
    phone: "+54 9 341 456-7890",
    address: "Pellegrini 123, Rosario",
    totalShipments: 15,
    lastShipment: "2024-01-12",
  },
  {
    id: 5,
    name: "Laura Fernández",
    email: "laura.fernandez@email.com",
    phone: "+54 9 221 567-8901",
    address: "Calle 7 456, La Plata",
    totalShipments: 3,
    lastShipment: "2024-01-11",
  },
  {
    id: 6,
    name: "Diego Ramírez",
    email: "diego.ramirez@email.com",
    phone: "+54 9 11 678-9012",
    address: "Florida 789, Buenos Aires",
    totalShipments: 20,
    lastShipment: "2024-01-10",
  },
]

export default function ClientesPage() {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredClients = clients.filter(
    (client) =>
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

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
              <p className="text-2xl font-bold text-foreground">63</p>
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
              <p className="text-2xl font-bold text-foreground">3</p>
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
          placeholder="Buscar cliente..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-card border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-all"
        />
      </div>

      {/* Clients grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredClients.map((client, index) => (
          <motion.div
            key={client.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="bg-card border border-border rounded-2xl p-6 hover:border-primary/30 transition-colors"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                  {client.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{client.name}</h3>
                  <p className="text-xs text-muted-foreground">
                    {client.totalShipments} envíos
                  </p>
                </div>
              </div>
              <button className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors">
                <MoreHorizontal className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <Mail className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground truncate">{client.email}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Phone className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">{client.phone}</span>
              </div>
              <div className="flex items-start gap-2 text-sm">
                <MapPin className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
                <span className="text-muted-foreground">{client.address}</span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
              <span className="text-xs text-muted-foreground">
                Último envío: {client.lastShipment}
              </span>
              <button className="text-xs text-primary hover:underline">Ver envíos</button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
