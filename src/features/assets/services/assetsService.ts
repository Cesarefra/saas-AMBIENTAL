'use server';

import { createClient } from '@/shared/lib/supabase/server';
import { CriticalAsset, MaintenanceLog } from '../types';

export const assetsService = {
    async getCriticalAssets(unidadId: string) {
        const supabase = await createClient();
        const { data, error } = await supabase
            .from('activos_criticos')
            .select('*')
            .eq('unidad_id', unidadId)
            .order('categoria');

        if (error) throw error;
        return data as CriticalAsset[];
    },

    async getMaintenances(unidadId: string) {
        const supabase = await createClient();
        // Join Maintenance -> Asset -> Filter by Unit
        // Note: Supabase nested filtering can be tricky. This is a simplified approach or we filter in JS.
        // Better: Fetch assets first, then maintenances for those assets.
        // Optimized: Query from maintenances joining asset, filtering asset by unit_id

        const { data, error } = await supabase
            .from('mantenimientos_logs')
            .select('*, activo:activos_criticos!inner(*)')
            .eq('activo.unidad_id', unidadId)
            .order('fecha_programada', { ascending: true });

        if (error) throw error;
        return data as MaintenanceLog[];
    }
};
