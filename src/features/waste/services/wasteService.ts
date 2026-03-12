'use server';

import { createClient } from '@/shared/lib/supabase/server';
import { WasteLog, WasteManifest } from '../types';

export async function getWasteLogs(unidadId: string) {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from('residuos_logs')
        .select('*')
        .eq('unidad_id', unidadId)
        .order('fecha_generacion', { ascending: false });

    if (error) throw error;
    return data as WasteLog[];
}

export async function createWasteLog(log: Omit<WasteLog, 'id' | 'created_at'>) {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from('residuos_logs')
        .insert(log)
        .select()
        .single();

    if (error) throw error;
    return data as WasteLog;
}

export async function getManifests(unidadId: string) {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from('residuos_manifiestos')
        .select('*')
        .eq('unidad_id', unidadId)
        .order('fecha_recojo', { ascending: false });

    if (error) throw error;
    return data as WasteManifest[];
}
