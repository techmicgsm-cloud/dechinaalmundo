"use client"

import { useState, useEffect, useCallback } from "react"
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
  Loader2,
  WifiOff,
  UploadCloud,
  ImageIcon,
  FileText,
} from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"
import {
  subscribeShipments,
  createShipment,
  updateShipmentStatus,
  updateShipment,
  deleteShipment,
  addShipmentAttachments,
  removeShipmentAttachment,
  type Shipment,
  type ShipmentStatus,
  type CreateShipmentData,
} from "@/lib/shipments"
import { uploadShipmentFiles, deleteStorageFile, validateFile, type Attachment } from "@/lib/storage"

// ─── Config ───────────────────────────────────────────────────────────────────

const statusConfig: Record<ShipmentStatus, { label: string; class: string }> = {
  pendiente:   { label: "Pendiente",   class: "bg-amber-500/20 text-amber-400 border-amber-500/30" },
  en_transito: { label: "En Tránsito", class: "bg-blue-500/20 text-blue-400 border-blue-500/30" },
  en_aduana:   { label: "En Aduana",   class: "bg-purple-500/20 text-purple-400 border-purple-500/30" },
  entregado:   { label: "Entregado",   class: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" },
}

const statusOptions: { value: ShipmentStatus; label: string }[] = [
  { value: "pendiente",   label: "Pendiente" },
  { value: "en_transito", label: "En Tránsito" },
  { value: "en_aduana",   label: "En Aduana" },
  { value: "entregado",   label: "Entregado" },
]

const typeOptions = [
  { value: "air", label: "Aéreo" },
  { value: "sea", label: "Marítimo" },
]

// ─── Empty form state ─────────────────────────────────────────────────────────

const emptyForm: CreateShipmentData = {
  customerName:      "",
  phone:             "",
  address:           "",
  destination:       "",
  status:            "pendiente",
  estimatedDelivery: "",
  weight:            "",
  serviceType:       "air",
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function EnviosPage() {
  const [shipments,       setShipments]       = useState<Shipment[]>([])
  const [loading,         setLoading]         = useState(true)
  const [firestoreError,  setFirestoreError]  = useState<string | null>(null)
  const [searchTerm,      setSearchTerm]      = useState("")
  const [filterStatus,    setFilterStatus]    = useState("all")
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal,   setShowEditModal]   = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedShipment,setSelectedShipment]= useState<Shipment | null>(null)
  const [currentPage,     setCurrentPage]     = useState(1)
  const [formData,        setFormData]        = useState<CreateShipmentData>(emptyForm)
  const [filesToUpload,   setFilesToUpload]   = useState<File[]>([])
  const [uploadProgress,  setUploadProgress]  = useState<Record<string, number>>({})
  const [submitting,      setSubmitting]      = useState(false)
  const [updatingStatus,  setUpdatingStatus]  = useState<string | null>(null) // shipment id being updated
  const itemsPerPage = 8

  // ── Firestore real-time subscription ──────────────────────────────────────

  useEffect(() => {
    setLoading(true)

    const unsubscribe = subscribeShipments(
      (data) => {
        setShipments(data)
        setLoading(false)
        setFirestoreError(null)
      },
      (error) => {
        console.error("Firestore error:", error)
        setFirestoreError("No se pudo conectar con la base de datos. Verifica tu conexión.")
        setLoading(false)
      }
    )

    return () => unsubscribe()
  }, [])

  // ── Filtering & pagination ─────────────────────────────────────────────────

  const filteredShipments = shipments.filter((s) => {
    const matchesSearch =
      s.trackingCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.destination.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === "all" || s.status === filterStatus
    return matchesSearch && matchesStatus
  })

  const totalPages = Math.ceil(filteredShipments.length / itemsPerPage)
  const paginatedShipments = filteredShipments.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  // Reset to page 1 when filters change
  useEffect(() => { setCurrentPage(1) }, [searchTerm, filterStatus])

  // ── CRUD Handlers ──────────────────────────────────────────────────────────

  const handleCreateShipment = async () => {
    if (!formData.customerName || !formData.phone || !formData.destination) return
    setSubmitting(true)
    try {
      const { trackingCode, docId } = await createShipment(formData)

      // Upload files if any
      if (filesToUpload.length > 0) {
        const uploadedAttachments = await uploadShipmentFiles(docId, filesToUpload, (index, pct) => {
          setUploadProgress(prev => ({ ...prev, [filesToUpload[index].name]: pct }))
        })
        if (uploadedAttachments.length > 0) {
          await addShipmentAttachments(docId, uploadedAttachments)
        }
      }

      toast.success(`Envío creado exitosamente`, {
        description: `Código de seguimiento: ${trackingCode}`,
      })
      closeModals()
    } catch (err) {
      console.error(err)
      toast.error("Error al crear el envío", {
        description: "Verifica tu conexión e inténtalo de nuevo.",
      })
    } finally {
      setSubmitting(false)
    }
  }

  const handleEditShipment = async () => {
    if (!selectedShipment) return
    setSubmitting(true)
    try {
      await updateShipment(selectedShipment.id, formData)

      // Upload new files if any
      if (filesToUpload.length > 0) {
        const uploadedAttachments = await uploadShipmentFiles(selectedShipment.id, filesToUpload, (index, pct) => {
          setUploadProgress(prev => ({ ...prev, [filesToUpload[index].name]: pct }))
        })
        if (uploadedAttachments.length > 0) {
          await addShipmentAttachments(selectedShipment.id, uploadedAttachments)
        }
      }

      toast.success("Envío actualizado correctamente")
      closeModals()
    } catch (err) {
      console.error(err)
      toast.error("Error al actualizar el envío")
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeleteExistingFile = async (attachment: Attachment) => {
    if (!selectedShipment) return
    try {
      await deleteStorageFile(attachment.path)
      await removeShipmentAttachment(selectedShipment.id, attachment)
      // Actualizar vista local
      setSelectedShipment({
        ...selectedShipment,
        attachments: selectedShipment.attachments.filter(a => a.path !== attachment.path)
      })
      setShipments(shipments.map(s => s.id === selectedShipment.id ? {
        ...s,
        attachments: s.attachments.filter(a => a.path !== attachment.path)
      } : s))
      toast.success("Archivo eliminado")
    } catch (err) {
      console.error(err)
      toast.error("Error al eliminar el archivo")
    }
  }

  const handleDeleteShipment = async () => {
    if (!selectedShipment) return
    setSubmitting(true)
    try {
      await deleteShipment(selectedShipment.id)
      toast.success("Envío eliminado")
      setShowDeleteModal(false)
      setSelectedShipment(null)
    } catch (err) {
      console.error(err)
      toast.error("Error al eliminar el envío")
    } finally {
      setSubmitting(false)
    }
  }

  const handleStatusChange = async (shipment: Shipment, newStatus: ShipmentStatus) => {
    setUpdatingStatus(shipment.id)
    try {
      await updateShipmentStatus(shipment.id, newStatus)
      toast.success(`Estado actualizado a "${statusConfig[newStatus].label}"`)
    } catch (err) {
      console.error(err)
      toast.error("Error al actualizar el estado")
    } finally {
      setUpdatingStatus(null)
    }
  }

  const openEditModal = (shipment: Shipment) => {
    setSelectedShipment(shipment)
    setFormData({
      customerName:      shipment.customerName,
      phone:             shipment.phone,
      address:           shipment.address,
      destination:       shipment.destination,
      status:            shipment.status,
      estimatedDelivery: shipment.estimatedDelivery,
      weight:            shipment.weight,
      serviceType:       shipment.serviceType,
    })
    setShowEditModal(true)
  }

  const openDeleteModal = (shipment: Shipment) => {
    setSelectedShipment(shipment)
    setShowDeleteModal(true)
  }

  const closeModals = () => {
    setShowCreateModal(false)
    setShowEditModal(false)
    setShowDeleteModal(false)
    setSelectedShipment(null)
    setFormData(emptyForm)
    setFilesToUpload([])
    setUploadProgress({})
  }

  // ── Loading state ──────────────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-primary/20 rounded-full" />
          <div className="absolute inset-0 w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <Package className="absolute inset-0 m-auto w-6 h-6 text-primary" />
        </div>
        <p className="text-muted-foreground text-sm">Conectando con Firestore...</p>
      </div>
    )
  }

  // ── Firestore error state ──────────────────────────────────────────────────

  if (firestoreError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4 text-center">
        <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center">
          <WifiOff className="w-7 h-7 text-destructive" />
        </div>
        <div>
          <p className="font-semibold text-foreground mb-1">Sin conexión con la base de datos</p>
          <p className="text-sm text-muted-foreground max-w-sm">{firestoreError}</p>
        </div>
        <button
          onClick={() => window.location.reload()}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-xl text-sm font-medium hover:bg-primary/90 transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Reintentar
        </button>
      </div>
    )
  }

  // ── Main render ────────────────────────────────────────────────────────────

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Envíos</h1>
          <p className="text-muted-foreground mt-1">
            {shipments.length} envío{shipments.length !== 1 ? "s" : ""} en total · actualización en tiempo real
          </p>
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
            placeholder="Buscar por código, cliente o destino..."
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
              {statusOptions.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
          </div>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-card border border-border rounded-xl text-sm text-muted-foreground hover:text-foreground hover:border-primary/30 transition-colors">
            <Download className="w-4 h-4" />
            Exportar
          </button>
        </div>
      </div>

      {/* Empty state */}
      {filteredShipments.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center py-20 text-center"
        >
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
            <Package className="w-7 h-7 text-muted-foreground" />
          </div>
          <p className="font-medium text-foreground mb-1">
            {searchTerm || filterStatus !== "all" ? "Sin resultados" : "No hay envíos aún"}
          </p>
          <p className="text-sm text-muted-foreground">
            {searchTerm || filterStatus !== "all"
              ? "Prueba con otros filtros de búsqueda."
              : "Crea el primer envío con el botón de arriba."}
          </p>
        </motion.div>
      )}

      {/* Shipments table */}
      {filteredShipments.length > 0 && (
        <div className="bg-card border border-border rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-4">Tracking</th>
                  <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-4">Cliente</th>
                  <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-4">Estado</th>
                  <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-4">Entrega est.</th>
                  <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-4">Peso</th>
                  <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-4">Destino</th>
                  <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-4">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {paginatedShipments.map((shipment, index) => (
                  <motion.tr
                    key={shipment.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.04 }}
                    className="hover:bg-muted/30 transition-colors"
                  >
                    {/* Tracking */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {shipment.serviceType === "air" ? (
                          <Plane className="w-4 h-4 text-blue-400 shrink-0" />
                        ) : (
                          <Ship className="w-4 h-4 text-cyan-400 shrink-0" />
                        )}
                        <Link
                          href={`/tracking/${shipment.trackingCode}`}
                          className="text-sm font-mono font-medium text-primary hover:underline"
                          target="_blank"
                        >
                          {shipment.trackingCode}
                        </Link>
                      </div>
                    </td>

                    {/* Cliente */}
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm font-medium text-foreground">{shipment.customerName}</p>
                        <p className="text-xs text-muted-foreground">{shipment.phone}</p>
                      </div>
                    </td>

                    {/* Estado */}
                    <td className="px-6 py-4">
                      <div className="relative">
                        {updatingStatus === shipment.id ? (
                          <div className="flex items-center gap-2 px-2.5 py-1.5">
                            <Loader2 className="w-3.5 h-3.5 animate-spin text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">Guardando...</span>
                          </div>
                        ) : (
                          <select
                            value={shipment.status}
                            onChange={(e) => handleStatusChange(shipment, e.target.value as ShipmentStatus)}
                            className={`text-xs font-medium px-2.5 py-1.5 rounded-lg border cursor-pointer appearance-none transition-colors ${statusConfig[shipment.status].class}`}
                          >
                            {statusOptions.map((s) => (
                              <option key={s.value} value={s.value}>{s.label}</option>
                            ))}
                          </select>
                        )}
                      </div>
                    </td>

                    {/* Entrega estimada */}
                    <td className="px-6 py-4">
                      <span className="text-sm text-muted-foreground">
                        {shipment.estimatedDelivery || "—"}
                      </span>
                    </td>

                    {/* Peso */}
                    <td className="px-6 py-4">
                      <span className="text-sm text-foreground">{shipment.weight || "—"}</span>
                    </td>

                    {/* Destino */}
                    <td className="px-6 py-4">
                      <span className="text-sm text-muted-foreground truncate max-w-[150px] block">
                        {shipment.destination}
                      </span>
                    </td>

                    {/* Acciones */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1">
                        <Link
                          href={`/tracking/${shipment.trackingCode}`}
                          className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
                          title="Ver tracking público"
                          target="_blank"
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
      )}

      {/* ── Create / Edit Modal ─────────────────────────────────────────────── */}
      <AnimatePresence>
        {(showCreateModal || showEditModal) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={closeModals}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-card border border-border rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal header */}
              <div className="p-6 border-b border-border flex items-center justify-between sticky top-0 bg-card z-10">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-primary/10">
                    <Package className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-foreground">
                      {showCreateModal ? "Crear Nuevo Envío" : "Editar Envío"}
                    </h2>
                    {showCreateModal && (
                      <p className="text-xs text-muted-foreground mt-0.5">
                        El código de seguimiento se generará automáticamente
                      </p>
                    )}
                    {showEditModal && selectedShipment && (
                      <p className="text-xs text-primary font-mono mt-0.5">
                        {selectedShipment.trackingCode}
                      </p>
                    )}
                  </div>
                </div>
                <button
                  onClick={closeModals}
                  className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal body */}
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Nombre del Cliente <span className="text-destructive">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.customerName}
                      onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                      placeholder="Ej: María García"
                      className="w-full px-4 py-2.5 bg-input border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Teléfono <span className="text-destructive">*</span>
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
                      Peso
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
                      Dirección de Entrega
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
                      Ciudad de Destino <span className="text-destructive">*</span>
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
                    <label className="block text-sm font-medium text-foreground mb-2">Estado</label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value as ShipmentStatus })}
                      className="w-full px-4 py-2.5 bg-input border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-all"
                    >
                      {statusOptions.map((s) => (
                        <option key={s.value} value={s.value}>{s.label}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Tipo de Envío</label>
                    <select
                      value={formData.serviceType}
                      onChange={(e) => setFormData({ ...formData, serviceType: e.target.value as "air" | "sea" })}
                      className="w-full px-4 py-2.5 bg-input border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-all"
                    >
                      {typeOptions.map((t) => (
                        <option key={t.value} value={t.value}>{t.label}</option>
                      ))}
                    </select>
                  </div>

                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Fecha Estimada de Entrega
                    </label>
                    <input
                      type="date"
                      value={formData.estimatedDelivery}
                      onChange={(e) => setFormData({ ...formData, estimatedDelivery: e.target.value })}
                      className="w-full px-4 py-2.5 bg-input border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-all"
                    />
                  </div>

                  {/* ── File Upload Section ────────────────────────────────────────── */}
                  <div className="col-span-2 pt-4 border-t border-border">
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Documentos e Imágenes
                    </label>
                    <div className="relative border-2 border-dashed border-border rounded-xl p-6 text-center hover:bg-muted/30 transition-colors">
                      <input
                        type="file"
                        multiple
                        accept="image/jpeg,image/png,image/webp,image/gif,application/pdf"
                        onChange={(e) => {
                          if (e.target.files) {
                            const newFiles = Array.from(e.target.files)
                            const validFiles: File[] = []
                            newFiles.forEach(f => {
                              const error = validateFile(f)
                              if (error) toast.error(error)
                              else validFiles.push(f)
                            })
                            setFilesToUpload(prev => [...prev, ...validFiles])
                          }
                          // clear input so same file can be selected again
                          e.target.value = ""
                        }}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      <UploadCloud className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
                      <p className="text-sm font-medium text-foreground">
                        Arrastra archivos o haz clic para subir
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        JPG, PNG, WEBP, GIF o PDF. Max 15MB.
                      </p>
                    </div>

                    {/* Pending files */}
                    {filesToUpload.length > 0 && (
                      <div className="mt-4 space-y-2">
                        {filesToUpload.map((file, idx) => (
                          <div key={idx} className="flex items-center justify-between p-3 bg-secondary rounded-xl border border-border">
                            <div className="flex items-center gap-3 overflow-hidden">
                              {file.type.startsWith("image/") ? (
                                <ImageIcon className="w-5 h-5 text-primary shrink-0" />
                              ) : (
                                <FileText className="w-5 h-5 text-primary shrink-0" />
                              )}
                              <div className="truncate">
                                <p className="text-sm font-medium text-foreground truncate">{file.name}</p>
                                <p className="text-xs text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3 shrink-0">
                              {uploadProgress[file.name] !== undefined && (
                                <span className="text-xs font-mono text-primary">{uploadProgress[file.name]}%</span>
                              )}
                              <button
                                onClick={() => setFilesToUpload(prev => prev.filter((_, i) => i !== idx))}
                                disabled={submitting}
                                className="p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Existing files (only in Edit mode) */}
                    {showEditModal && selectedShipment?.attachments && selectedShipment.attachments.length > 0 && (
                      <div className="mt-6">
                        <p className="text-sm font-medium text-foreground mb-3">Archivos subidos previamente</p>
                        <div className="space-y-2">
                          {selectedShipment.attachments.map((attachment, idx) => (
                            <div key={idx} className="flex items-center justify-between p-3 bg-card rounded-xl border border-border">
                              <div className="flex items-center gap-3 overflow-hidden">
                                {attachment.type.startsWith("image/") ? (
                                  <ImageIcon className="w-5 h-5 text-muted-foreground shrink-0" />
                                ) : (
                                  <FileText className="w-5 h-5 text-muted-foreground shrink-0" />
                                )}
                                <div className="truncate">
                                  <a href={attachment.url} target="_blank" rel="noreferrer" className="text-sm font-medium text-primary hover:underline truncate">
                                    {attachment.name}
                                  </a>
                                  <p className="text-xs text-muted-foreground">{(attachment.size / 1024 / 1024).toFixed(2)} MB</p>
                                </div>
                              </div>
                              <button
                                onClick={() => handleDeleteExistingFile(attachment)}
                                disabled={submitting}
                                className="p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                                title="Eliminar archivo permanentemente"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Modal footer */}
              <div className="p-6 border-t border-border flex items-center justify-end gap-3">
                <button
                  onClick={closeModals}
                  disabled={submitting}
                  className="px-4 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-xl transition-colors disabled:opacity-50"
                >
                  Cancelar
                </button>
                <button
                  onClick={showCreateModal ? handleCreateShipment : handleEditShipment}
                  disabled={!formData.customerName || !formData.phone || !formData.destination || submitting}
                  className="flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-xl font-medium text-sm hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed min-w-[140px] justify-center"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      {showCreateModal ? "Creando..." : "Guardando..."}
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      {showCreateModal ? "Crear Envío" : "Guardar Cambios"}
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Delete Confirmation Modal ───────────────────────────────────────── */}
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
                <span className="font-mono text-foreground">{selectedShipment.trackingCode}</span> del cliente{" "}
                <span className="text-foreground">{selectedShipment.customerName}</span>?
              </p>

              <div className="flex items-center justify-end gap-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  disabled={submitting}
                  className="px-4 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-xl transition-colors disabled:opacity-50"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleDeleteShipment}
                  disabled={submitting}
                  className="flex items-center gap-2 px-4 py-2.5 bg-destructive text-destructive-foreground rounded-xl font-medium text-sm hover:bg-destructive/90 transition-colors disabled:opacity-50 min-w-[120px] justify-center"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Eliminando...
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-4 h-4" />
                      Eliminar
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
