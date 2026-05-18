"use client"

import { motion } from "framer-motion"
import { Phone, Mail, MapPin, MessageCircle, Clock, Globe, Shield, Package, ExternalLink } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

const WHATSAPP_NUMBER = "5491157676423"
const WHATSAPP_MESSAGE = encodeURIComponent("Hola! Me gustaría obtener más información sobre sus servicios de envío.")

export function Footer() {
  return (
    <footer id="contacto" className="relative pt-24 pb-8 border-t border-border">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-secondary/50 to-transparent pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Contact CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border border-primary/20 rounded-2xl p-8 md:p-12">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-4 text-balance">
                  ¿Listo para enviar tu carga?
                </h3>
                <p className="text-muted-foreground leading-relaxed mb-6">
                  Contactanos ahora y recibí una cotización personalizada en menos de 24 horas. 
                  Nuestro equipo está disponible para ayudarte.
                </p>
                <div className="flex flex-wrap gap-4">
                  <a
                    href={`https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MESSAGE}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-[#25D366] text-white rounded-lg font-medium hover:bg-[#20BD5A] transition-colors"
                  >
                    <MessageCircle className="w-5 h-5" />
                    Chateá por WhatsApp
                  </a>
                  <a
                    href="mailto:contacto@dechinaalmundo.com"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-secondary text-foreground rounded-lg font-medium hover:bg-secondary/80 transition-colors border border-border"
                  >
                    <Mail className="w-5 h-5" />
                    Enviar Email
                  </a>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-background/50 border border-border rounded-xl p-4">
                  <Clock className="w-8 h-8 text-primary mb-3" />
                  <h4 className="font-semibold text-foreground mb-1">Horario</h4>
                  <p className="text-muted-foreground text-sm">Lun - Vie: 9:00 - 18:00</p>
                </div>
                <div className="bg-background/50 border border-border rounded-xl p-4">
                  <Globe className="w-8 h-8 text-primary mb-3" />
                  <h4 className="font-semibold text-foreground mb-1">Cobertura</h4>
                  <p className="text-muted-foreground text-sm">China a Latinoamérica</p>
                </div>
                <div className="bg-background/50 border border-border rounded-xl p-4">
                  <Shield className="w-8 h-8 text-primary mb-3" />
                  <h4 className="font-semibold text-foreground mb-1">Seguro</h4>
                  <p className="text-muted-foreground text-sm">Carga 100% asegurada</p>
                </div>
                <div className="bg-background/50 border border-border rounded-xl p-4">
                  <Package className="w-8 h-8 text-primary mb-3" />
                  <h4 className="font-semibold text-foreground mb-1">Tracking</h4>
                  <p className="text-muted-foreground text-sm">Seguimiento en tiempo real</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Main Footer Content */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center mb-6">
              <Image
                src="/images/logo.png"
                alt="De China al Mundo"
                width={160}
                height={53}
                className="h-12 w-auto object-contain"
              />
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed mb-6">
              Tu socio confiable en logística internacional. Conectamos China con América Latina 
              con la mejor tecnología y servicio.
            </p>
            
            {/* Social Icons */}
            <div className="flex gap-3">
              {[
                { name: "facebook", url: "https://facebook.com/dechinaalmundo" },
                { name: "instagram", url: "https://instagram.com/dechinaalmundo" },
                { name: "twitter", url: "https://twitter.com/dechinaalmundo" },
                { name: "linkedin", url: "https://linkedin.com/company/dechinaalmundo" }
              ].map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-secondary rounded-lg flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                  aria-label={social.name}
                >
                  <SocialIcon name={social.name} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-foreground font-semibold mb-6">Servicios</h4>
            <ul className="space-y-3">
              {[
                { name: "Envío Aéreo", href: "/#servicios" },
                { name: "Envío Marítimo", href: "/#servicios" },
                { name: "Consolidación", href: "/#servicios" },
                { name: "Despacho Aduanero", href: "/#servicios" },
                { name: "Seguro de Carga", href: "/#servicios" }
              ].map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-muted-foreground hover:text-primary transition-colors text-sm">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-foreground font-semibold mb-6">Empresa</h4>
            <ul className="space-y-3">
              {[
                { name: "Sobre Nosotros", href: "/#sobre-nosotros" },
                { name: "Cómo Funciona", href: "/#como-funciona" },
                { name: "Rastrear Envío", href: "/tracking/DCM-2024-X8K9P2" },
                { name: "Preguntas Frecuentes", href: "/#faq" },
                { name: "Términos y Condiciones", href: "/terminos" }
              ].map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-muted-foreground hover:text-primary transition-colors text-sm">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-foreground font-semibold mb-6">Contacto</h4>
            <ul className="space-y-4">
              <li>
                <a 
                  href="https://maps.google.com/?q=Esmeralda+356,+Buenos+Aires,+Argentina"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-3 group"
                >
                  <MapPin className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <span className="text-muted-foreground text-sm group-hover:text-primary transition-colors">
                    Esmeralda 356<br />Buenos Aires, Argentina
                  </span>
                  <ExternalLink className="w-3 h-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity mt-1" />
                </a>
              </li>
              <li>
                <a 
                  href={`https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MESSAGE}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 group"
                >
                  <Phone className="w-5 h-5 text-primary shrink-0" />
                  <span className="text-muted-foreground text-sm group-hover:text-primary transition-colors">
                    +54 9 11 5767-6423
                  </span>
                  <ExternalLink className="w-3 h-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
              </li>
              <li>
                <a 
                  href="mailto:contacto@dechinaalmundo.com"
                  className="flex items-center gap-3 group"
                >
                  <Mail className="w-5 h-5 text-primary shrink-0" />
                  <span className="text-muted-foreground text-sm group-hover:text-primary transition-colors">
                    contacto@dechinaalmundo.com
                  </span>
                </a>
              </li>
              <li>
                <a 
                  href={`https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MESSAGE}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 group"
                >
                  <MessageCircle className="w-5 h-5 text-[#25D366] shrink-0" />
                  <span className="text-muted-foreground text-sm group-hover:text-[#25D366] transition-colors">
                    WhatsApp Directo
                  </span>
                  <ExternalLink className="w-3 h-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* WhatsApp Floating Button */}
        <motion.a
          href={`https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MESSAGE}`}
          target="_blank"
          rel="noopener noreferrer"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 1, type: "spring" }}
          className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-[#25D366] rounded-full flex items-center justify-center shadow-lg shadow-[#25D366]/25 hover:scale-110 transition-transform group"
          aria-label="Contactar por WhatsApp"
        >
          <WhatsAppIcon className="w-7 h-7 text-white" />
          <span className="absolute right-full mr-3 px-3 py-2 bg-card border border-border rounded-lg text-sm text-foreground whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-lg">
            ¡Chateá con nosotros!
          </span>
        </motion.a>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-border">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-muted-foreground text-sm text-center md:text-left">
              © {new Date().getFullYear()} De China al Mundo. Todos los derechos reservados.
            </p>
            <div className="flex items-center gap-6">
              <Link href="/terminos" className="text-muted-foreground hover:text-foreground text-sm transition-colors">
                Términos
              </Link>
              <Link href="/privacidad" className="text-muted-foreground hover:text-foreground text-sm transition-colors">
                Privacidad
              </Link>
              <Link href="/cookies" className="text-muted-foreground hover:text-foreground text-sm transition-colors">
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
  )
}

function SocialIcon({ name }: { name: string }) {
  switch (name) {
    case "facebook":
      return (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
      )
    case "instagram":
      return (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
        </svg>
      )
    case "twitter":
      return (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
      )
    case "linkedin":
      return (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
        </svg>
      )
    default:
      return null
  }
}
