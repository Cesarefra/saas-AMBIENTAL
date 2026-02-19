# PRP-001: Sistema de Gestión Ambiental OEFA (SaaS)

> **Estado**: Draft
> **Dueño**: Antigravity (SaaS Factory)
> **Ref**: `oefa_audit_report.md`

## 1. Contexto y Problema
ZETA GAS ANDINO S.A. opera dos unidades de negocio en Huánuco (Planta Envasado y Gasocentro GLP) con **obligaciones ambientales distintas** ante OEFA y Osinergmin.
El incumplimiento de monitoreos (Aire, Ruido, Efluentes) o reportes de residuos puede derivar en multas graves. Actualmente no existe un sistema centralizado que alerte sobre vencimientos o consolide evidencias (informes, manifiestos) separando la responsabilidad de cada unidad.

## 2. Solución Propuesta (El "Evaluador Ambiental")
Implementar un SaaS Multi-Sede que actúe como un **Auditor Virtual 24/7**.
El sistema estructurará la data según la lógica de fiscalización: **Por Unidad Fiscalizable (UF)**.

### Principios de Diseño
1.  **Muralla China de Datos:** La data de la Planta (ITS) no contamina la del Gasocentro (DIA).
2.  **Semáforo de Cumplimiento:** Dashboard visual (Rojo/Amarillo/Verde) para Gerencia.
3.  **Evidencia Primero:** No se marca una tarea como "Hecha" sin subir el PDF de sustento.

## 3. Arquitectura de Datos (Supabase)

### A. Unidades Fiscalizables (Core)
```sql
create table unidades_fiscalizables (
  id uuid primary key default gen_random_uuid(),
  nombre text not null, -- 'Planta Envasado', 'Gasocentro'
  iga_aprobado text, -- 'ITS 2018', 'DIA'
  codigo_osinergmin text
);
```

### B. Matriz de Obligaciones (Configuración)
```sql
create table obligaciones_tipo (
  id uuid primary key default gen_random_uuid(),
  unidad_id uuid references unidades_fiscalizables(id),
  categoria text, -- 'Monitoreo', 'Residuos', 'Seguridad'
  nombre_obligacion text, -- 'Calidad de Aire Trimestral'
  frecuencia_dias int, -- 90
  entidad_fiscalizadora text -- 'OEFA', 'OSINERGMIN'
);
```

### C. Registro de Cumplimiento (Operación)
```sql
create table cumplimiento_eventos (
  id uuid primary key default gen_random_uuid(),
  obligacion_id uuid references obligaciones_tipo(id),
  fecha_vencimiento date,
  fecha_ejecucion date,
  estado text, -- 'PENDIENTE', 'CUMPLIDO', 'VENCIDO'
  evidencia_url text -- Link al PDF en Storage
);
```

## 4. Módulos del Sistema

### Módulo 1: Dashboard de Cumplimiento (Landing)
- **Vista Global:** Semáforo por Unidad.
- **Alertas:** "Faltan 15 días para el Monitoreo de Aire (Gasocentro)".
- **KPI:** % de Cumplimiento Anual.

### Módulo 2: Gestión de Residuos (Balance de Masas)
- **Input:** Registro diario de generación (kg) por tipo (Peligroso/No Peligroso).
- **Output:** Carga de Manifiestos de EO-RS.
- **Validación:** Alerta si `Generado > Dispuesto` al cierre de mes.

### Módulo 3: Activos Críticos (Seguridad)
- **Inventario:** Tanques, Bombas, Extintores.
- **Mantenimiento:** Calendario de preventivos (Bomba Contra Incendio).
- **Docs:** Certificados de calibración y pruebas de hermeticidad.

## 5. Plan de Implementación (Fases)

### Fase 1: Cimientos (Week 1)
- [ ] Setup Next.js + Supabase (Golden Path).
- [ ] Schema Database: Unidades y Obligaciones.
- [ ] Seed Data: Carga de obligaciones de DIA e ITS (Huánuco).

### Fase 2: Módulo de Monitoreo (Week 1-2)
- [ ] CRUD de Eventos de Cumplimiento.
- [ ] Upload de PDFs (Storage).
- [ ] Dashboard Semáforo (Visualización).

### Fase 3: Residuos y Seguridad (Week 2)
- [ ] Tablas de Residuos.
- [ ] Registro de Mantenimiento de Activos.

## 6. Stack Tecnológico (Factory Standard)
- **Frontend:** Next.js 16 (App Router), Tailwind CSS, Shadcn UI.
- **Backend:** Supabase (Auth, DB, Storage).
- **Estado:** Zustand.
- **Validación:** Zod.

## 7. Aprobación
Requerida para proceder a Fase 1.
