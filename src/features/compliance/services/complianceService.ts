'use server';

import { createClient } from '@/shared/lib/supabase/server';
import { ComplianceEvent, ComplianceDashboardData, FiscalizableUnit } from '../types';

export const complianceService = {
    async getFiscalizableUnits() {
        const supabase = await createClient();
        const { data, error } = await supabase
            .from('unidades_fiscalizables')
            .select('*')
            .order('nombre');

        if (error) throw error;
        return data as FiscalizableUnit[];
    },

    async getDashboardData(unidadId: string): Promise<ComplianceDashboardData> {
        const supabase = await createClient(); // Use await properly with the server client creator

        // 1. Get Unit Details
        const { data: unit, error: unitError } = await supabase
            .from('unidades_fiscalizables')
            .select('*')
            .eq('id', unidadId)
            .single();

        if (unitError) throw unitError;

        // 2. Get Pending/Upcoming Events
        // Assuming we have a view or complex query, but for now fetching raw events
        const { data: events, error: eventsError } = await supabase
            .from('cumplimiento_eventos')
            .select('*, obligacion:obligaciones_tipo(*)')
            .eq('obligaciones_tipo.unidad_id', unidadId)
            .order('fecha_vencimiento', { ascending: true });

        if (eventsError) throw eventsError;

        // Client-side filtering/stats (to be refined with better SQL views later)
        // Note: Supabase join filtering syntax is specific, this is a simplified fetch
        // Real implementation needs inner join filtering or 2-step fetch

        // Manual Stats Calculation (MVP)
        const allEvents = events as any[]; // Type assertion for joined data
        const stats = {
            total: allEvents.length,
            completed: allEvents.filter(e => e.estado === 'CUMPLIDO').length,
            pending: allEvents.filter(e => e.estado === 'PENDIENTE').length,
            overdue: allEvents.filter(e => e.estado === 'VENCIDO').length // Logic to compute overdue dynamically needed
        };

        return {
            unit: unit as FiscalizableUnit,
            stats,
            upcomingEvents: allEvents as ComplianceEvent[]
        };
    }
};
