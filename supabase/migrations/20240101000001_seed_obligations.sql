-- Migration: Seed Environmental Obligations (Planta vs Gasocentro)

do $$
declare
  planta_id uuid;
  gasocentro_id uuid;
begin
  -- Get IDs
  select id into planta_id from public.unidades_fiscalizables where nombre = 'Planta de Envasado Huánuco';
  select id into gasocentro_id from public.unidades_fiscalizables where nombre = 'Gasocentro GLP Huánuco';

  -- A. OBLIGACIONES PLANTA DE ENVASADO (ITS 2018)
  -- 1. Efluentes
  insert into public.obligaciones_tipo (unidad_id, categoria, nombre_obligacion, frecuencia_dias, entidad_fiscalizadora, normativa_ref)
  values (planta_id, 'Monitoreo', 'Monitoreo de Efluentes Liquidos (pH, Aceites)', 180, 'OEFA', 'ITS 2018 / D.S. 037-2008-PCM');

  -- 2. Residuos Peligrosos (Pinturas)
  insert into public.obligaciones_tipo (unidad_id, categoria, nombre_obligacion, frecuencia_dias, entidad_fiscalizadora, normativa_ref)
  values (planta_id, 'Residuos', 'Manifiesto de Residuos Peligrosos (Pinturas/Solventes)', 30, 'OEFA', 'Ley GIRS D.L. 1278');

  -- 3. Seguridad
  insert into public.obligaciones_tipo (unidad_id, categoria, nombre_obligacion, frecuencia_dias, entidad_fiscalizadora, normativa_ref)
  values (planta_id, 'Seguridad', 'Mantenimiento Bomba Contra Incendio Principal', 30, 'OSINERGMIN', 'Plan de Mantenimiento ITS');

  -- B. OBLIGACIONES GASOCENTRO (DIA)
  -- 1. Calidad de Aire (Trimestral)
  insert into public.obligaciones_tipo (unidad_id, categoria, nombre_obligacion, frecuencia_dias, entidad_fiscalizadora, normativa_ref)
  values (gasocentro_id, 'Monitoreo', 'Monitoreo Calidad de Aire (PM10, PM2.5, SO2)', 90, 'OEFA', 'DIA / D.S. 074-2001-PCM');

  -- 2. Ruido Ambiental (Trimestral)
  insert into public.obligaciones_tipo (unidad_id, categoria, nombre_obligacion, frecuencia_dias, entidad_fiscalizadora, normativa_ref)
  values (gasocentro_id, 'Monitoreo', 'Monitoreo de Ruido Ambiental (Diurno/Nocturno)', 90, 'OEFA', 'DIA / D.S. 085-2003-PCM');

  -- 3. Dispensadores
  insert into public.obligaciones_tipo (unidad_id, categoria, nombre_obligacion, frecuencia_dias, entidad_fiscalizadora, normativa_ref)
  values (gasocentro_id, 'Seguridad', 'Certificado de Calibración de Dispensadores', 180, 'OSINERGMIN', 'Control Metrológico');

  -- 4. Fugas
  insert into public.obligaciones_tipo (unidad_id, categoria, nombre_obligacion, frecuencia_dias, entidad_fiscalizadora, normativa_ref)
  values (gasocentro_id, 'Seguridad', 'Prueba de Hermeticidad de Tanques', 365, 'OSINERGMIN', 'D.S. 019-97-EM');

end $$;
