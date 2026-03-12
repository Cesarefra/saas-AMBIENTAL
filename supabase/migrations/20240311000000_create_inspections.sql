-- Crear tabla para las cabeceras de inspección
create table public.inspections (
  id uuid default gen_random_uuid() primary key,
  facility_id text not null,
  inspector_name text,
  date timestamp with time zone default now(),
  status text not null, -- 'en-progreso', 'completada'
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Crear tabla para los resultados detallados por cada ítem
create table public.inspection_results (
  id uuid default gen_random_uuid() primary key,
  inspection_id uuid references public.inspections(id) on delete cascade not null,
  item_id text not null,
  status text not null, -- 'cumple', 'no-cumple', 'na', 'pendiente'
  observation text,
  location_actual text,
  photo_url text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Habilitar RLS
alter table public.inspections enable row level security;
alter table public.inspection_results enable row level security;

-- Políticas de seguridad (Para entorno local permitimos acceso completo para desarrollo)
create policy "Permitir select en inspections a todos" on public.inspections for select using (true);
create policy "Permitir insert en inspections a todos" on public.inspections for insert with check (true);
create policy "Permitir update en inspections a todos" on public.inspections for update using (true);

create policy "Permitir select en inspection_results a todos" on public.inspection_results for select using (true);
create policy "Permitir insert en inspection_results a todos" on public.inspection_results for insert with check (true);
create policy "Permitir update en inspection_results a todos" on public.inspection_results for update using (true);

-- Crear Storage Bucket para fotos de evidencia
insert into storage.buckets (id, name, public) 
values ('inspection_evidence', 'inspection_evidence', true)
on conflict (id) do nothing;

create policy "Permitir lectura publica de evidencia"
on storage.objects for select
using ( bucket_id = 'inspection_evidence' );

create policy "Permitir escritura de evidencia a todos"
on storage.objects for insert
with check ( bucket_id = 'inspection_evidence' );
