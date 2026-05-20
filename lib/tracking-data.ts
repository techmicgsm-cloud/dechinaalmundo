// Simulated tracking database
export interface TrackingEvent {
  id: number
  status: string
  location: string
  date: string
  description: string
  completed: boolean
  current?: boolean
}

export interface TrackingInfo {
  trackingNumber: string
  status: "pending" | "in_transit" | "customs" | "out_for_delivery" | "delivered"
  statusLabel: string
  origin: string
  destination: string
  estimatedDelivery: string
  weight: string
  dimensions: string
  shippingType: string
  insurance: string
  progress: number
  events: TrackingEvent[]
}

// Simulated tracking data - in a real app this would come from a database
const trackingDatabase: Record<string, TrackingInfo> = {
  "DCM-DEMO01": {
    trackingNumber: "DCM-DEMO01",
    status: "in_transit",
    statusLabel: "En tránsito",
    origin: "Shenzhen, China",
    destination: "Buenos Aires, Argentina",
    estimatedDelivery: "20 Enero 2024",
    weight: "2.5 kg",
    dimensions: "30 x 20 x 15 cm",
    shippingType: "Express Aéreo",
    insurance: "Incluido ($500 USD)",
    progress: 75,
    events: [
      {
        id: 1,
        status: "Paquete recibido en almacén",
        location: "Shenzhen, China",
        date: "12 Ene 2024 - 09:30",
        description: "Tu paquete ha sido recibido en nuestro almacén central y está siendo preparado para envío.",
        completed: true,
      },
      {
        id: 2,
        status: "Despachado del almacén",
        location: "Shenzhen, China",
        date: "12 Ene 2024 - 14:15",
        description: "El paquete ha salido del almacén hacia el aeropuerto internacional.",
        completed: true,
      },
      {
        id: 3,
        status: "En tránsito aéreo",
        location: "Hong Kong → Miami",
        date: "14 Ene 2024 - 15:45",
        description: "Tu paquete está volando hacia Miami, EE.UU. con escala en Hong Kong.",
        completed: true,
      },
      {
        id: 4,
        status: "Llegada a Miami",
        location: "Miami, USA",
        date: "15 Ene 2024 - 22:30",
        description: "El paquete ha llegado al hub de distribución en Miami.",
        completed: true,
      },
      {
        id: 5,
        status: "En proceso de aduana",
        location: "Miami, USA",
        date: "16 Ene 2024 - 08:00",
        description: "Tu paquete está siendo procesado en aduana estadounidense.",
        completed: true,
      },
      {
        id: 6,
        status: "Liberado de aduana",
        location: "Miami, USA",
        date: "16 Ene 2024 - 16:45",
        description: "El paquete ha sido liberado de aduana y continúa su trayecto.",
        completed: true,
      },
      {
        id: 7,
        status: "En camino a destino",
        location: "Buenos Aires, Argentina",
        date: "18 Ene 2024 - 14:20",
        description: "Tu paquete está en camino hacia Buenos Aires. Llegará en aproximadamente 2 días.",
        completed: false,
        current: true,
      },
      {
        id: 8,
        status: "Entrega programada",
        location: "Buenos Aires, Argentina",
        date: "Estimado: 20 Ene 2024",
        description: "Entrega estimada en tu dirección.",
        completed: false,
      },
    ],
  },
  "DCM-AR2401": {
    trackingNumber: "DCM-AR2401",
    status: "delivered",
    statusLabel: "Entregado",
    origin: "Guangzhou, China",
    destination: "Ciudad de México, México",
    estimatedDelivery: "15 Enero 2024",
    weight: "5.2 kg",
    dimensions: "45 x 35 x 25 cm",
    shippingType: "Marítimo Express",
    insurance: "Premium ($1,500 USD)",
    progress: 100,
    events: [
      {
        id: 1,
        status: "Paquete recibido en almacén",
        location: "Guangzhou, China",
        date: "02 Ene 2024 - 10:00",
        description: "Tu paquete ha sido recibido en nuestro almacén.",
        completed: true,
      },
      {
        id: 2,
        status: "En tránsito marítimo",
        location: "Guangzhou → Los Angeles",
        date: "05 Ene 2024 - 08:00",
        description: "El paquete está en camino por vía marítima.",
        completed: true,
      },
      {
        id: 3,
        status: "Llegada a puerto",
        location: "Los Angeles, USA",
        date: "12 Ene 2024 - 14:30",
        description: "El paquete ha llegado al puerto de Los Angeles.",
        completed: true,
      },
      {
        id: 4,
        status: "En camino terrestre",
        location: "Los Angeles → Ciudad de México",
        date: "13 Ene 2024 - 09:00",
        description: "Transporte terrestre hacia México.",
        completed: true,
      },
      {
        id: 5,
        status: "Entregado",
        location: "Ciudad de México, México",
        date: "15 Ene 2024 - 11:45",
        description: "Tu paquete ha sido entregado exitosamente.",
        completed: true,
      },
    ],
  },
  "CN-TRACK01": {
    trackingNumber: "CN-TRACK01",
    status: "customs",
    statusLabel: "En aduana",
    origin: "Shanghai, China",
    destination: "Bogotá, Colombia",
    estimatedDelivery: "25 Enero 2024",
    weight: "1.8 kg",
    dimensions: "20 x 15 x 10 cm",
    shippingType: "Aéreo Estándar",
    insurance: "Básico ($200 USD)",
    progress: 50,
    events: [
      {
        id: 1,
        status: "Paquete recibido",
        location: "Shanghai, China",
        date: "15 Ene 2024 - 11:30",
        description: "Tu paquete ha sido recibido en nuestro almacén.",
        completed: true,
      },
      {
        id: 2,
        status: "En vuelo",
        location: "Shanghai → Miami",
        date: "17 Ene 2024 - 06:00",
        description: "El paquete está en tránsito aéreo.",
        completed: true,
      },
      {
        id: 3,
        status: "En proceso de aduana",
        location: "Miami, USA",
        date: "18 Ene 2024 - 10:15",
        description: "Tu paquete está siendo revisado en aduana. Este proceso puede tomar 1-3 días hábiles.",
        completed: false,
        current: true,
      },
      {
        id: 4,
        status: "Pendiente de envío",
        location: "Bogotá, Colombia",
        date: "Estimado: 23 Ene 2024",
        description: "Próximo paso: envío hacia Colombia.",
        completed: false,
      },
      {
        id: 5,
        status: "Entrega programada",
        location: "Bogotá, Colombia",
        date: "Estimado: 25 Ene 2024",
        description: "Entrega estimada.",
        completed: false,
      },
    ],
  },
}

export function getTrackingInfo(code: string): TrackingInfo | null {
  // Normalize the tracking code (uppercase, trim)
  const normalizedCode = code.toUpperCase().trim()
  return trackingDatabase[normalizedCode] || null
}

export function getStatusColor(status: TrackingInfo["status"]): string {
  switch (status) {
    case "delivered":
      return "bg-green-500/10 text-green-500 border-green-500/20"
    case "in_transit":
      return "bg-primary/10 text-primary border-primary/20"
    case "customs":
      return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
    case "out_for_delivery":
      return "bg-blue-500/10 text-blue-500 border-blue-500/20"
    case "pending":
    default:
      return "bg-muted text-muted-foreground border-border"
  }
}

export function getStatusIcon(status: TrackingInfo["status"]): string {
  switch (status) {
    case "delivered":
      return "CheckCircle2"
    case "in_transit":
      return "Truck"
    case "customs":
      return "FileSearch"
    case "out_for_delivery":
      return "Package"
    case "pending":
    default:
      return "Clock"
  }
}
