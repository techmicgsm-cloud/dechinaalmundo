"use client"

import { motion } from "framer-motion"
import { Package, Plane, Ship, Truck, CheckCircle2, Clock, MapPin } from "lucide-react"
import { useState, useEffect } from "react"

const trackingSteps = [
  {
    id: 1,
    status: "Paquete recibido",
    location: "Shenzhen, China",
    date: "12 Ene 2024 - 09:30",
    icon: Package,
    completed: true,
  },
  {
    id: 2,
    status: "En tránsito aéreo",
    location: "Hong Kong → Miami",
    date: "14 Ene 2024 - 15:45",
    icon: Plane,
    completed: true,
  },
  {
    id: 3,
    status: "En aduana",
    location: "Miami, USA",
    date: "16 Ene 2024 - 08:00",
    icon: Ship,
    completed: true,
  },
  {
    id: 4,
    status: "En camino",
    location: "Buenos Aires, Argentina",
    date: "18 Ene 2024 - 14:20",
    icon: Truck,
    completed: false,
    current: true,
  },
  {
    id: 5,
    status: "Entregado",
    location: "Destino final",
    date: "Estimado: 20 Ene 2024",
    icon: MapPin,
    completed: false,
  },
]

export function TrackingPreview() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const timer = setTimeout(() => {
      setProgress(75)
    }, 500)
    return () => clearTimeout(timer)
  }, [])

  return (
    <section id="rastreo" className="py-24 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }} />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-sm font-medium text-primary uppercase tracking-wider">Seguimiento</span>
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mt-4 mb-6 text-balance">
            Vista previa de rastreo
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg text-pretty">
            Así se ve el seguimiento de tu envío. Información detallada en cada etapa del proceso.
          </p>
        </motion.div>

        {/* Tracking Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-4xl mx-auto"
        >
          <div className="bg-card border border-border rounded-3xl overflow-hidden">
            {/* Package Info Header */}
            <div className="p-6 md:p-8 border-b border-border bg-secondary/30">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Número de seguimiento</p>
                  <p className="text-xl md:text-2xl font-mono font-bold text-foreground">DCM-DEMO01</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm font-medium">En tránsito</span>
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mt-6">
                <div className="flex justify-between text-xs text-muted-foreground mb-2">
                  <span>Origen</span>
                  <span>Destino</span>
                </div>
                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className="h-full bg-primary rounded-full relative"
                  >
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-primary rounded-full border-2 border-background animate-pulse" />
                  </motion.div>
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div className="p-6 md:p-8">
              <div className="space-y-0">
                {trackingSteps.map((step, index) => (
                  <motion.div
                    key={step.id}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className="relative flex gap-4"
                  >
                    {/* Timeline Line */}
                    {index < trackingSteps.length - 1 && (
                      <div className="absolute left-6 top-12 bottom-0 w-0.5 bg-border">
                        {step.completed && (
                          <motion.div
                            initial={{ height: 0 }}
                            whileInView={{ height: "100%" }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 + 0.3 }}
                            className="w-full bg-primary"
                          />
                        )}
                      </div>
                    )}

                    {/* Icon */}
                    <div className={`relative z-10 w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                      step.completed 
                        ? "bg-primary text-primary-foreground" 
                        : step.current 
                          ? "bg-primary/20 text-primary border-2 border-primary" 
                          : "bg-secondary text-muted-foreground"
                    }`}>
                      {step.completed ? (
                        <CheckCircle2 className="w-6 h-6" />
                      ) : (
                        <step.icon className="w-6 h-6" />
                      )}
                    </div>

                    {/* Content */}
                    <div className={`flex-1 pb-8 ${step.current ? "opacity-100" : step.completed ? "opacity-100" : "opacity-50"}`}>
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                        <h4 className={`font-semibold ${step.current ? "text-primary" : "text-foreground"}`}>
                          {step.status}
                        </h4>
                        <span className="text-xs text-muted-foreground">{step.date}</span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {step.location}
                      </p>
                      {step.current && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="mt-3 p-3 bg-primary/10 rounded-lg border border-primary/20"
                        >
                          <p className="text-sm text-primary">
                            Tu paquete está en camino. Llegará aproximadamente en 2 días.
                          </p>
                        </motion.div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Package Details Footer */}
            <div className="p-6 md:p-8 border-t border-border bg-secondary/20">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: "Peso", value: "2.5 kg" },
                  { label: "Dimensiones", value: "30x20x15 cm" },
                  { label: "Tipo", value: "Express Aéreo" },
                  { label: "Seguro", value: "Incluido" },
                ].map((item, index) => (
                  <div key={index} className="text-center md:text-left">
                    <p className="text-xs text-muted-foreground">{item.label}</p>
                    <p className="text-sm font-semibold text-foreground">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
