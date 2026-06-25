-- Migración inicial para el sistema de logística

CREATE TABLE public.meta (
  id TEXT PRIMARY KEY,
  lastIndex INTEGER NOT NULL DEFAULT 0
);

INSERT INTO public.meta (id, lastIndex) VALUES ('counter', 0) ON CONFLICT DO NOTHING;

CREATE TYPE shipment_status AS ENUM ('pendiente', 'en_transito', 'en_aduana', 'entregado');
CREATE TYPE service_type AS ENUM ('air', 'sea');

CREATE TABLE public.shipments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trackingCode TEXT UNIQUE NOT NULL,
  customerName TEXT NOT NULL,
  phone TEXT NOT NULL,
  address TEXT NOT NULL,
  destination TEXT NOT NULL,
  status shipment_status NOT NULL DEFAULT 'pendiente',
  estimatedDelivery TEXT NOT NULL,
  weight TEXT NOT NULL,
  serviceType service_type NOT NULL DEFAULT 'air',
  attachments JSONB DEFAULT '[]'::jsonb,
  createdAt TIMESTAMPTZ NOT NULL DEFAULT now(),
  updatedAt TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Políticas RLS simples (para que todo usuario autenticado pueda ver/crear/editar)
ALTER TABLE public.shipments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated full access on shipments" 
ON public.shipments FOR ALL TO authenticated 
USING (true) WITH CHECK (true);

-- Almacenamiento
INSERT INTO storage.buckets (id, name, public) VALUES ('shipments', 'shipments', true)
ON CONFLICT DO NOTHING;

CREATE POLICY "Allow authenticated full access on storage" 
ON storage.objects FOR ALL TO authenticated 
USING (bucket_id = 'shipments') WITH CHECK (bucket_id = 'shipments');
