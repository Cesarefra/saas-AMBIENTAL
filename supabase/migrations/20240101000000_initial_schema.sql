-- Migration: Create Environmental Compliance Schema

-- 1. Unidades Fiscalizables (Sedes)
create table public.unidades_fiscalizables (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  nombre text not null, -- 'Planta Envasado', 'Gasocentro'
  iga_aprobado text, -- 'ITS 2018', 'DIA'
  codigo_osinergmin text,
  direccion text
);

-- 2. Matriz de Obligaciones (Configuración maestra)
create table public.obligaciones_tipo (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  unidad_id uuid references public.unidades_fiscalizables(id) on delete cascade,
  categoria text not null, -- 'Monitoreo', 'Residuos', 'Seguridad', 'Reporte'
  nombre_obligacion text not null, -- 'Calidad de Aire Trimestral'
  frecuencia_dias int, -- 90
  entidad_fiscalizadora text, -- 'OEFA', 'OSINERGMIN'
  normativa_ref text -- 'D.S. 003-2017-MINAM'
);

-- 3. Registro de Cumplimiento (Eventos operativos)
create table public.cumplimiento_eventos (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  obligacion_id uuid references public.obligaciones_tipo(id) on delete cascade,
  fecha_vencimiento date not null,
  fecha_ejecucion date,
  estado text default 'PENDIENTE', -- 'PENDIENTE', 'CUMPLIDO', 'VENCIDO'
  comentario text,
  evidencia_url text -- Link al PDF en Storage
);

-- RLS (Row Level Security) - Basic Setup
alter table public.unidades_fiscalizables enable row level security;
alter table public.obligaciones_tipo enable row level security;
alter table public.cumplimiento_eventos enable row level security;

create policy "Enable read access for all users" on public.unidades_fiscalizables for select using (true);
create policy "Enable read access for all users" on public.obligaciones_tipo for select using (true);
create policy "Enable read access for all users" on public.cumplimiento_eventos for select using (true);

-- Insert Initial Seed Data (Unidades)
insert into public.unidades_fiscalizables (nombre, iga_aprobado, codigo_osinergmin, direccion)
values 
('Planta de Envasado Huánuco', 'ITS 2018 (R.D. 90-2018)', '3197-070-240912', 'Km 4.2 Colpa Baja'),
('Gasocentro GLP Huánuco', 'DIA (Declaración Impacto Ambiental)', '133566-071-190818', 'Km 4.5 Colpa Baja');
