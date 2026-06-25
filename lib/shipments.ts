import { supabase } from "./supabase"
import type { Attachment } from "./storage"

// ─── Types ────────────────────────────────────────────────────────────────────

export type ShipmentStatus =
  | "pendiente"
  | "en_transito"
  | "en_aduana"
  | "entregado"

export type ServiceType = "air" | "sea"

export interface Shipment {
  id: string // UUID from Supabase
  trackingCode: string
  customerName: string
  phone: string
  address: string
  destination: string
  status: ShipmentStatus
  estimatedDelivery: string
  weight: string
  serviceType: ServiceType
  attachments: Attachment[]
  createdAt: string | null
  updatedAt: string | null
}

export interface CreateShipmentData {
  customerName: string
  phone: string
  address: string
  destination: string
  status: ShipmentStatus
  estimatedDelivery: string
  weight: string
  serviceType: ServiceType
}

// ─── Tracking Code Generator ──────────────────────────────────────────────────

/**
 * Generates a unique tracking code like DCM-AR2401, DCM-AR2402, etc.
 */
export async function generateTrackingCode(): Promise<string> {
  // Fetch current counter
  const { data: metaData, error: fetchError } = await supabase
    .from("meta")
    .select("lastIndex")
    .eq("id", "counter")
    .single()

  if (fetchError) throw fetchError

  const current = metaData?.lastIndex ?? 0
  const next = current + 1

  // Update counter
  const { error: updateError } = await supabase
    .from("meta")
    .update({ lastIndex: next })
    .eq("id", "counter")

  if (updateError) throw updateError

  // Format: DCM-AR + zero-padded 4-digit number
  const paddedIndex = String(next).padStart(4, "0")
  return `DCM-AR${paddedIndex}`
}

// ─── Real-time subscription ───────────────────────────────────────────────────

/**
 * Subscribes to the shipments collection in real-time.
 * Returns an unsubscribe function to be called on component unmount.
 */
export function subscribeShipments(
  onData: (shipments: Shipment[]) => void,
  onError: (error: Error) => void
): () => void {
  // Función para cargar los datos iniciales y cuando haya un cambio
  const fetchShipments = async () => {
    const { data, error } = await supabase
      .from("shipments")
      .select("*")
      .order("createdAt", { ascending: false })

    if (error) {
      onError(new Error(error.message))
      return
    }

    if (data) {
      onData(data as Shipment[])
    }
  }

  // Carga inicial
  fetchShipments()

  // Suscripción a cambios
  const channel = supabase
    .channel("public:shipments")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "shipments" },
      () => {
        fetchShipments()
      }
    )
    .subscribe()

  return () => {
    supabase.removeChannel(channel)
  }
}

// ─── CRUD Operations ──────────────────────────────────────────────────────────

export async function createShipment(
  data: CreateShipmentData
): Promise<{ trackingCode: string; docId: string }> {
  const trackingCode = await generateTrackingCode()

  const { data: newShipment, error } = await supabase
    .from("shipments")
    .insert([{
      ...data,
      trackingCode,
      attachments: []
    }])
    .select("id")
    .single()

  if (error) throw new Error(error.message)

  return { trackingCode, docId: newShipment.id }
}

export async function updateShipmentStatus(
  id: string,
  status: ShipmentStatus
): Promise<void> {
  const { error } = await supabase
    .from("shipments")
    .update({ status, updatedAt: new Date().toISOString() })
    .eq("id", id)

  if (error) throw new Error(error.message)
}

export async function updateShipment(
  id: string,
  data: Partial<CreateShipmentData>
): Promise<void> {
  const { error } = await supabase
    .from("shipments")
    .update({ ...data, updatedAt: new Date().toISOString() })
    .eq("id", id)

  if (error) throw new Error(error.message)
}

export async function deleteShipment(id: string): Promise<void> {
  const { error } = await supabase
    .from("shipments")
    .delete()
    .eq("id", id)

  if (error) throw new Error(error.message)
}

export async function addShipmentAttachments(
  id: string,
  attachments: Attachment[]
): Promise<void> {
  // En Supabase no hay arrayUnion directo desde el cliente,
  // así que primero obtenemos el array actual y lo concatenamos
  const { data, error: fetchError } = await supabase
    .from("shipments")
    .select("attachments")
    .eq("id", id)
    .single()

  if (fetchError) throw new Error(fetchError.message)

  const currentAttachments = (data?.attachments as Attachment[]) || []
  const updatedAttachments = [...currentAttachments, ...attachments]

  const { error: updateError } = await supabase
    .from("shipments")
    .update({ attachments: updatedAttachments, updatedAt: new Date().toISOString() })
    .eq("id", id)

  if (updateError) throw new Error(updateError.message)
}

export async function removeShipmentAttachment(
  id: string,
  attachment: Attachment
): Promise<void> {
  const { data, error: fetchError } = await supabase
    .from("shipments")
    .select("attachments")
    .eq("id", id)
    .single()

  if (fetchError) throw new Error(fetchError.message)

  const currentAttachments = (data?.attachments as Attachment[]) || []
  const updatedAttachments = currentAttachments.filter(a => a.path !== attachment.path)

  const { error: updateError } = await supabase
    .from("shipments")
    .update({ attachments: updatedAttachments, updatedAt: new Date().toISOString() })
    .eq("id", id)

  if (updateError) throw new Error(updateError.message)
}

export async function getShipmentByTrackingCode(
  trackingCode: string
): Promise<Shipment | null> {
  const { data, error } = await supabase
    .from("shipments")
    .select("*")
    .eq("trackingCode", trackingCode.toUpperCase().trim())
    .single()

  if (error) {
    if (error.code === 'PGRST116') return null // No rows found
    throw new Error(error.message)
  }

  return data as Shipment
}
