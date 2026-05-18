"use client"

import { motion } from "framer-motion"
import { Globe, MapPin, Zap, Shield } from "lucide-react"

const features = [
  {
    icon: Globe,
    title: "Envío Internacional",
    description: "Conectamos China con toda América Latina. Rutas optimizadas por aire, mar y tierra para tus importaciones.",
  },
  {
    icon: MapPin,
    title: "Rastreo en Tiempo Real",
    description: "Seguimiento GPS 24/7. Conocé la ubicación exacta de tu paquete en cada momento del trayecto.",
  },
  {
    icon: Zap,
    title: "Logística Rápida",
    description: "Tiempos de entrega optimizados. Express aéreo en 7-10 días, marítimo económico en 30-45 días.",
  },
  {
    icon: Shield,
    title: "Seguridad Total",
    description: "Seguro de carga incluido. Protección completa contra daños, pérdidas y retrasos en el envío.",
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
    },
  },
}

export function FeaturesSection() {
  return (
    <section id="servicios" className="py-24 relative">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-sm font-medium text-primary uppercase tracking-wider">Nuestros Servicios</span>
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mt-4 mb-6 text-balance">
            Logística integral para tus importaciones
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg text-pretty">
            Ofrecemos soluciones completas de transporte internacional con la tecnología 
            más avanzada del mercado.
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="group relative p-8 bg-card border border-border rounded-2xl hover:border-primary/50 transition-all duration-300 hover:bg-card/80"
            >
              {/* Icon */}
              <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                <feature.icon className="w-7 h-7 text-primary" />
              </div>

              {/* Content */}
              <h3 className="text-xl font-semibold text-foreground mb-3">
                {feature.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>

              {/* Hover Effect */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
