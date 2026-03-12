'use server';

import { createClient } from '@/shared/lib/supabase/server';
import { CriticalAsset, MaintenanceLog } from '../types';

export async function getCriticalAssets(unidadId: string) {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from('activos_criticos')
        .select('*')
        .eq('unidad_id', unidadId)
        .order('categoria');

    if (error) throw error;
    return data as CriticalAsset[];
}

export async function getMaintenances(unidadId: string) {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from('mantenimientos_logs')
        .select('*, activo:activos_criticos!inner(*)')
        .eq('activo.unidad_id', unidadId)
        .order('fecha_programada', { ascending: true });

    if (error) throw error;
    return data as MaintenanceLog[];
}
