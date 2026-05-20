import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
  runTransaction,
  getDoc,
  Timestamp,
} from "firebase/firestore"
import { db } from "./firebase"

// ─── Types ────────────────────────────────────────────────────────────────────

export type ShipmentStatus =
  | "pendiente"
  | "en_transito"
  | "en_aduana"
  | "entregado"

export type ServiceType = "air" | "sea"

export interface Shipment {
  id: string // Firestore document ID
  trackingCode: string
  customerName: string
  phone: string
  address: string
  destination: string
  status: ShipmentStatus
  estimatedDelivery: string
  weight: string
  serviceType: ServiceType
  createdAt: Timestamp | null
  updatedAt: Timestamp | null
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
 * Uses a Firestore transaction on meta/counter to guarantee uniqueness.
 */
export async function generateTrackingCode(): Promise<string> {
  const counterRef = doc(db, "meta", "counter")

  const newIndex = await runTransaction(db, async (transaction) => {
    const counterSnap = await transaction.get(counterRef)

    let current = 0
    if (counterSnap.exists()) {
      current = counterSnap.data().lastIndex ?? 0
    }

    const next = current + 1

    transaction.set(counterRef, { lastIndex: next }, { merge: true })

    return next
  })

  // Format: DCM-AR + zero-padded 4-digit number
  const paddedIndex = String(newIndex).padStart(4, "0")
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
  const q = query(
    collection(db, "shipments"),
    orderBy("createdAt", "desc")
  )

  const unsubscribe = onSnapshot(
    q,
    (snapshot) => {
      const shipments: Shipment[] = snapshot.docs.map((docSnap) => {
        const data = docSnap.data()
        return {
          id: docSnap.id,
          trackingCode: data.trackingCode ?? "",
          customerName: data.customerName ?? "",
          phone: data.phone ?? "",
          address: data.address ?? "",
          destination: data.destination ?? "",
          status: (data.status as ShipmentStatus) ?? "pendiente",
          estimatedDelivery: data.estimatedDelivery ?? "",
          weight: data.weight ?? "",
          serviceType: (data.serviceType as ServiceType) ?? "air",
          createdAt: data.createdAt ?? null,
          updatedAt: data.updatedAt ?? null,
        }
      })
      onData(shipments)
    },
    (error) => {
      onError(error)
    }
  )

  return unsubscribe
}

// ─── CRUD Operations ──────────────────────────────────────────────────────────

/**
 * Creates a new shipment in Firestore with an auto-generated tracking code.
 */
export async function createShipment(data: CreateShipmentData): Promise<string> {
  const trackingCode = await generateTrackingCode()

  const docRef = await addDoc(collection(db, "shipments"), {
    ...data,
    trackingCode,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })

  return trackingCode
}

/**
 * Updates only the status (and updatedAt) of a shipment.
 */
export async function updateShipmentStatus(
  id: string,
  status: ShipmentStatus
): Promise<void> {
  const shipmentRef = doc(db, "shipments", id)
  await updateDoc(shipmentRef, {
    status,
    updatedAt: serverTimestamp(),
  })
}

/**
 * Updates all editable fields of a shipment.
 */
export async function updateShipment(
  id: string,
  data: Partial<CreateShipmentData>
): Promise<void> {
  const shipmentRef = doc(db, "shipments", id)
  await updateDoc(shipmentRef, {
    ...data,
    updatedAt: serverTimestamp(),
  })
}

/**
 * Deletes a shipment permanently from Firestore.
 */
export async function deleteShipment(id: string): Promise<void> {
  await deleteDoc(doc(db, "shipments", id))
}

/**
 * Looks up a shipment by its trackingCode (case-insensitive).
 * Returns null if not found.
 */
export async function getShipmentByTrackingCode(
  trackingCode: string
): Promise<Shipment | null> {
  const { query: firestoreQuery, where, getDocs } = await import("firebase/firestore")

  const q = firestoreQuery(
    collection(db, "shipments"),
    where("trackingCode", "==", trackingCode.toUpperCase().trim())
  )

  const snapshot = await getDocs(q)

  if (snapshot.empty) return null

  const docSnap = snapshot.docs[0]
  const data = docSnap.data()

  return {
    id: docSnap.id,
    trackingCode: data.trackingCode ?? "",
    customerName: data.customerName ?? "",
    phone: data.phone ?? "",
    address: data.address ?? "",
    destination: data.destination ?? "",
    status: (data.status as ShipmentStatus) ?? "pendiente",
    estimatedDelivery: data.estimatedDelivery ?? "",
    weight: data.weight ?? "",
    serviceType: (data.serviceType as ServiceType) ?? "air",
    createdAt: data.createdAt ?? null,
    updatedAt: data.updatedAt ?? null,
  }
}
