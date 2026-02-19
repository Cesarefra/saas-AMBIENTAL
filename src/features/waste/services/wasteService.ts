'use server';

import { createClient } from '@/shared/lib/supabase/server';
import { WasteLog, WasteManifest } from '../types';

export const wasteService = {
    async getWasteLogs(unidadId: string) {
        const supabase = await createClient();
        const { data, error } = await supabase
            .from('residuos_logs')
            .select('*')
            .eq('unidad_id', unidadId)
            .order('fecha_generacion', { ascending: false });

        if (error) throw error;
        return data as WasteLog[];
    },

    async createWasteLog(log: Omit<WasteLog, 'id' | 'created_at'>) {
        const supabase = await createClient();
        const { data, error } = await supabase
            .from('residuos_logs')
            .insert(log)
            .select()
            .single();

        if (error) throw error;
        return data as WasteLog;
    },

    async getManifests(unidadId: string) {
        const supabase = await createClient();
        const { data, error } = await supabase
            .from('residuos_manifiestos')
            .select('*')
            .eq('unidad_id', unidadId)
            .order('fecha_recojo', { ascending: false });

        if (error) throw error;
        return data as WasteManifest[];
    }
};
