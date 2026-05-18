"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Package,
  Plus,
  Search,
  Filter,
  Download,
  Eye,
  Pencil,
  Trash2,
  Plane,
  Ship,
  X,
  Check,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
} from "lucide-react"
import Link from "next/link"

// Mock shipments data
const initialShipments = [
  {
    id: "DCM-2024-X8K9P2",
    client: "María García",
    phone: "+54 9 11 1234-5678",
    address: "Av. Corrientes 1234, Buenos Aires",
    status: "en_transito",
    date: "2024-01-15",
    estimatedDate: "2024-01-25",
    weight: "12.5 kg",
    type: "air",
    destination: "Buenos Aires, Argentina",
  },
  {
    id: "DCM-2024-Y7M3N5",
    client: "Carlos López",
    phone: "+54 9 351 234-5678",
    address: "San Martín 567, Córdoba",
    status: "entregado",
    date: "2024-01-14",
    estimatedDate: "2024-01-20",
    weight: "8.2 kg",
    type: "sea",
    destination: "Córdoba, Argentina",
  },
  {
    id: "DCM-2024-Z1P8Q4",
    client: "Ana Martínez",
    phone: "+54 9 261 345-6789",
    address: "Las Heras 890, Mendoza",
    status: "en_aduana",
    date: "2024-01-13",
    estimatedDate: "2024-01-28",
    weight: "25.0 kg",
    type: "air",
    destination: "Mendoza, Argentina",
  },
  {
    id: "DCM-2024-W5R2T8",
    client: "Roberto Sánchez",
    phone: "+54 9 341 456-7890",
    address: "Pellegrini 123, Rosario",
    status: "pendiente",
    date: "2024-01-12",
    estimatedDate: "2024-02-05",
    weight: "45.0 kg",
    type: "sea",
    destination: "Rosario, Argentina",
  },
  {
    id: "DCM-2024-V3K7L1",
    client: "Laura Fernández",
    phone: "+54 9 221 567-8901",
    address: "Calle 7 456, La Plata",
    status: "en_transito",
    date: "2024-01-11",
    estimatedDate: "2024-01-22",
    weight: "5.8 kg",
    type: "air",
    destination: "La Plata, Argentina",
  },
  {
    id: "DCM-2024-U9J4M6",
    client: "Diego Ramírez",
    phone: "+54 9 11 678-9012",
    address: "Florida 789, Buenos Aires",
    status: "en_transito",
    date: "2024-01-10",
    estimatedDate: "2024-01-18",
    weight: "3.2 kg",
    type: "air",
    destination: "Buenos Aires, Argentina",
  },
]

const statusConfig: Record<string, { label: string; class: string }> = {
  pendiente: { label: "Pendiente", class: "bg-amber-500/20 text-amber-400 border-amber-500/30" },
  en_transito: { label: "En Tránsito", class: "bg-blue-500/20 text-blue-400 border-blue-500/30" },
  en_aduana: { label: "En Aduana", class: "bg-purple-500/20 text-purple-400 border-purple-500/30" },
  entregado: { label: "Entregado", class: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" },
}

const statusOptions = [
  { value: "pendiente", label: "Pendiente" },
  { value: "en_transito", label: "En Tránsito" },
  { value: "en_aduana", label: "En Aduana" },
  { value: "entregado", label: "Entregado" },
]

const typeOptions = [
  { value: "air", label: "Aéreo" },
  { value: "sea", label: "Marítimo" },
]

type Shipment = typeof initialShipments[0]

export default function EnviosPage() {
  const [shipments, setShipments] = useState(initialShipments)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  // Form state for create/edit
  const [formData, setFormData] = useState({
    id: "",
    client: "",
    phone: "",
    address: "",
    status: "pendiente",
    estimatedDate: "",
    weight: "",
    type: "air",
    destination: "",
  })

  // Filter and search shipments
  const filteredShipments = shipments.filter((shipment) => {
    const matchesSearch =
      shipment.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shipment.client.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === "all" || shipment.status === filterStatus
    return matchesSearch && matchesStatus
  })

  const totalPages = Math.ceil(filteredShipments.length / itemsPerPage)
  const paginatedShipments = filteredShipments.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const generateTrackingCode = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
    let code = "DCM-2024-"
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return code
  }

  const handleCreateShipment = () => {
    const newShipment: Shipment = {
      ...formData,
      id: generateTrackingCode(),
      date: new Date().toISOString().split("T")[0],
    }
    setShipments([newShipment, ...shipments])
    setShowCreateModal(false)
    resetForm()
  }

  const handleEditShipment = () => {
    if (!selectedShipment) return
    setShipments(
      shipments.map((s) =>
        s.id === selectedShipment.id
          ? { ...s, ...formData, id: selectedShipment.id, date: selectedShipment.date }
          : s
      )
    )
    setShowEditModal(false)
    setSelectedShipment(null)
    resetForm()
  }

  const handleDeleteShipment = () => {
    if (!selectedShipment) return
    setShipments(shipments.filter((s) => s.id !== selectedShipment.id))
    setShowDeleteModal(false)
    setSelectedShipment(null)
  }

  const openEditModal = (shipment: Shipment) => {
    setSelectedShipment(shipment)
    setFormData({
      id: shipment.id,
      client: shipment.client,
      phone: shipment.phone,
      address: shipment.address,
      status: shipment.status,
      estimatedDate: shipment.estimatedDate,
      weight: shipment.weight,
      type: shipment.type,
      destination: shipment.destination,
    })
    setShowEditModal(true)
  }

  const openDeleteModal = (shipment: Shipment) => {
    setSelectedShipment(shipment)
    setShowDeleteModal(true)
  }

  const resetForm = () => {
    setFormData({
      id: "",
      client: "",
      phone: "",
      address: "",
      status: "pendiente",
      estimatedDate: "",
      weight: "",
      type: "air",
      destination: "",
    })
  }

  const updateStatus = (shipmentId: string, newStatus: string) => {
    setShipments(
      shipments.map((s) => (s.id === shipmentId ? { ...s, status: newStatus } : s))
    )
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Envíos</h1>
          <p className="text-muted-foreground mt-1">Gestiona todos los envíos</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-xl font-medium text-sm hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Crear Envío
        </button>
      </div>

      {/* Filters and search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Buscar por código o cliente..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-card border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-all"
          />
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="pl-10 pr-8 py-2.5 bg-card border border-border rounded-xl text-sm appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="all">Todos los estados</option>
              {statusOptions.map((status) => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>
          </div>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-card border border-border rounded-xl text-sm text-muted-foreground hover:text-foreground hover:border-primary/30 transition-colors">
            <Download className="w-4 h-4" />
            Exportar
          </button>
        </div>
      </div>

      {/* Shipments table */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/30">
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
                  Fecha
                </th>
                <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-4">
                  Peso
                </th>
                <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-4">
                  Destino
                </th>
                <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-4">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {paginatedShipments.map((shipment, index) => (
                <motion.tr
                  key={shipment.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="hover:bg-muted/30 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {shipment.type === "air" ? (
                        <Plane className="w-4 h-4 text-blue-400" />
                      ) : (
                        <Ship className="w-4 h-4 text-cyan-400" />
                      )}
                      <Link
                        href={`/tracking/${shipment.id}`}
                        className="text-sm font-mono font-medium text-primary hover:underline"
                      >
                        {shipment.id}
                      </Link>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-sm font-medium text-foreground">{shipment.client}</p>
                      <p className="text-xs text-muted-foreground">{shipment.phone}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <select
                      value={shipment.status}
                      onChange={(e) => updateStatus(shipment.id, e.target.value)}
                      className={`text-xs font-medium px-2.5 py-1.5 rounded-lg border cursor-pointer appearance-none ${
                        statusConfig[shipment.status].class
                      }`}
                    >
                      {statusOptions.map((status) => (
                        <option key={status.value} value={status.value}>
                          {status.label}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-muted-foreground">{shipment.date}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-foreground">{shipment.weight}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-muted-foreground truncate max-w-[150px] block">
                      {shipment.destination}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1">
                      <Link
                        href={`/tracking/${shipment.id}`}
                        className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
                        title="Ver tracking"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => openEditModal(shipment)}
                        className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
                        title="Editar"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => openDeleteModal(shipment)}
                        className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                        title="Eliminar"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-border">
            <p className="text-sm text-muted-foreground">
              Mostrando {(currentPage - 1) * itemsPerPage + 1} a{" "}
              {Math.min(currentPage * itemsPerPage, filteredShipments.length)} de{" "}
              {filteredShipments.length} envíos
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-8 h-8 text-sm font-medium rounded-lg transition-colors ${
                    currentPage === page
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      <AnimatePresence>
        {(showCreateModal || showEditModal) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => {
              setShowCreateModal(false)
              setShowEditModal(false)
              resetForm()
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-card border border-border rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-border flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-primary/10">
                    <Package className="w-5 h-5 text-primary" />
                  </div>
                  <h2 className="text-lg font-semibold text-foreground">
                    {showCreateModal ? "Crear Nuevo Envío" : "Editar Envío"}
                  </h2>
                </div>
                <button
                  onClick={() => {
                    setShowCreateModal(false)
                    setShowEditModal(false)
                    resetForm()
                  }}
                  className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-4">
                {showEditModal && (
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Código Tracking
                    </label>
                    <input
                      type="text"
                      value={selectedShipment?.id || ""}
                      disabled
                      className="w-full px-4 py-2.5 bg-muted border border-border rounded-xl text-sm text-muted-foreground"
                    />
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Nombre del Cliente *
                    </label>
                    <input
                      type="text"
                      value={formData.client}
                      onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                      placeholder="Ej: María García"
                      className="w-full px-4 py-2.5 bg-input border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Teléfono *
                    </label>
                    <input
                      type="text"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+54 9 11 1234-5678"
                      className="w-full px-4 py-2.5 bg-input border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Peso *
                    </label>
                    <input
                      type="text"
                      value={formData.weight}
                      onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                      placeholder="Ej: 12.5 kg"
                      className="w-full px-4 py-2.5 bg-input border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-all"
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Dirección de Entrega *
                    </label>
                    <input
                      type="text"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      placeholder="Ej: Av. Corrientes 1234, Buenos Aires"
                      className="w-full px-4 py-2.5 bg-input border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-all"
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Ciudad de Destino *
                    </label>
                    <input
                      type="text"
                      value={formData.destination}
                      onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                      placeholder="Ej: Buenos Aires, Argentina"
                      className="w-full px-4 py-2.5 bg-input border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Estado
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      className="w-full px-4 py-2.5 bg-input border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-all"
                    >
                      {statusOptions.map((status) => (
                        <option key={status.value} value={status.value}>
                          {status.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Tipo de Envío
                    </label>
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                      className="w-full px-4 py-2.5 bg-input border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-all"
                    >
                      {typeOptions.map((type) => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Fecha Estimada de Entrega
                    </label>
                    <input
                      type="date"
                      value={formData.estimatedDate}
                      onChange={(e) => setFormData({ ...formData, estimatedDate: e.target.value })}
                      className="w-full px-4 py-2.5 bg-input border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-all"
                    />
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-border flex items-center justify-end gap-3">
                <button
                  onClick={() => {
                    setShowCreateModal(false)
                    setShowEditModal(false)
                    resetForm()
                  }}
                  className="px-4 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-xl transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={showCreateModal ? handleCreateShipment : handleEditShipment}
                  disabled={!formData.client || !formData.phone || !formData.address}
                  className="flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-xl font-medium text-sm hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Check className="w-4 h-4" />
                  {showCreateModal ? "Crear Envío" : "Guardar Cambios"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete confirmation modal */}
      <AnimatePresence>
        {showDeleteModal && selectedShipment && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowDeleteModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-card border border-border rounded-2xl w-full max-w-md p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 rounded-xl bg-destructive/10">
                  <Trash2 className="w-5 h-5 text-destructive" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-foreground">Eliminar Envío</h2>
                  <p className="text-sm text-muted-foreground">Esta acción no se puede deshacer</p>
                </div>
              </div>

              <p className="text-sm text-muted-foreground mb-6">
                ¿Estás seguro que deseas eliminar el envío{" "}
                <span className="font-mono text-foreground">{selectedShipment.id}</span> del cliente{" "}
                <span className="text-foreground">{selectedShipment.client}</span>?
              </p>

              <div className="flex items-center justify-end gap-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="px-4 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-xl transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleDeleteShipment}
                  className="flex items-center gap-2 px-4 py-2.5 bg-destructive text-destructive-foreground rounded-xl font-medium text-sm hover:bg-destructive/90 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  Eliminar
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
