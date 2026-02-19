-- Migration: Phase 3 - Waste Management & Critical Assets

-- 1. GESTIÓN DE RESIDUOS (Balance de Masas)
create table public.residuos_manifiestos (
    id uuid primary key default gen_random_uuid(),
    created_at timestamptz default now(),
    unidad_id uuid references public.unidades_fiscalizables(id) on delete cascade,
    numero_manifiesto text not null, -- Código del documento físico
    eo_rs_empresa text not null, -- Empresa Operadora de Residuos Sólidos
    fecha_recojo date not null,
    peso_total_kg numeric(10,2) not null,
    archivo_url text, -- PDF escaneado del manifiesto
    estado text default 'VALIDADO' -- 'BORRADOR', 'VALIDADO'
);

create table public.residuos_logs (
    id uuid primary key default gen_random_uuid(),
    created_at timestamptz default now(),
    unidad_id uuid references public.unidades_fiscalizables(id) on delete cascade,
    fecha_generacion date not null default CURRENT_DATE,
    tipo text not null, -- 'PELIGROSO', 'NO_PELIGROSO', 'RAEE'
    subtipo text, -- 'Trapos con hidrocarburos', 'Filtros de aceite', 'Papel/Cartón'
    peso_kg numeric(10,2) not null,
    descripcion text,
    manifiesto_id uuid references public.residuos_manifiestos(id) -- Link opcional si ya se dispuso
);

-- 2. ACTIVOS CRÍTICOS Y MANTENIMIENTO
create table public.activos_criticos (
    id uuid primary key default gen_random_uuid(),
    created_at timestamptz default now(),
    unidad_id uuid references public.unidades_fiscalizables(id) on delete cascade,
    nombre text not null, -- 'Bomba Contra Incendio Principal', 'Tanque GLP 3200gl'
    categoria text not null, -- 'SISTEMA_CONTRA_INCENDIO', 'ALMACENAMIENTO', 'DISPENSADOR', 'TABLERO_ELECTRICO'
    marca_modelo text,
    serie text,
    fecha_fabricacion date,
    ubicacion_referencia text -- 'Caseta de Bombas', 'Isla de Despacho'
);

create table public.mantenimientos_logs (
    id uuid primary key default gen_random_uuid(),
    created_at timestamptz default now(),
    activo_id uuid references public.activos_criticos(id) on delete cascade,
    tipo_mantenimiento text not null, -- 'PREVENTIVO', 'CORRECTIVO', 'CALIBRACION', 'PRUEBA_HERMETICIDAD'
    fecha_programada date not null,
    fecha_ejecucion date,
    proveedor_servicio text,
    tecnico_responsable text,
    estado text default 'PROGRAMADO', -- 'PROGRAMADO', 'EJECUTADO', 'VENCIDO'
    observaciones text,
    evidencia_url text -- Informe técnico PDF
);

-- RLS
alter table public.residuos_manifiestos enable row level security;
alter table public.residuos_logs enable row level security;
alter table public.activos_criticos enable row level security;
alter table public.mantenimientos_logs enable row level security;

create policy "Enable read access for all users" on public.residuos_manifiestos for select using (true);
create policy "Enable read access for all users" on public.residuos_logs for select using (true);
create policy "Enable read access for all users" on public.activos_criticos for select using (true);
create policy "Enable read access for all users" on public.mantenimientos_logs for select using (true);

-- SEED ACTIVOS (Basado en ITS/DIA)
do $$
declare
  planta_id uuid;
  gasocentro_id uuid;
begin
  select id into planta_id from public.unidades_fiscalizables where nombre = 'Planta de Envasado Huánuco';
  select id into gasocentro_id from public.unidades_fiscalizables where nombre = 'Gasocentro GLP Huánuco';

  -- Activos Planta
  insert into public.activos_criticos (unidad_id, nombre, categoria, ubicacion_referencia) values 
  (planta_id, 'Cisterna de Agua CI (341 m3)', 'SISTEMA_CONTRA_INCENDIO', 'Patio de Maniobras'),
  (planta_id, 'Bomba Contra Incendio Principal (Diesel)', 'SISTEMA_CONTRA_INCENDIO', 'Caseta de Bombas'),
  (planta_id, 'Bomba Jockey', 'SISTEMA_CONTRA_INCENDIO', 'Caseta de Bombas'),
  (planta_id, 'Tanque Estacionario GLP (Planta)', 'ALMACENAMIENTO', 'Zona de Tanques');

  -- Activos Gasocentro
  insert into public.activos_criticos (unidad_id, nombre, categoria, ubicacion_referencia) values 
  (gasocentro_id, 'Tanque GLP (3200 gl)', 'ALMACENAMIENTO', 'Soterrado'),
  (gasocentro_id, 'Dispensador GLP (2 mangueras)', 'DISPENSADOR', 'Isla de Despacho'),
  (gasocentro_id, 'Detector de Fugas (Isla)', 'SEGURIDAD', 'Isla de Despacho');
end $$;
