'use server';

import { createClient } from '@/shared/lib/supabase/server';
import { ComplianceEvent, ComplianceDashboardData, FiscalizableUnit } from '../types';

export async function getFiscalizableUnits() {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from('unidades_fiscalizables')
        .select('*')
        .order('nombre');

    if (error) throw error;
    return data as FiscalizableUnit[];
}

export async function getDashboardData(unidadId: string): Promise<ComplianceDashboardData> {
    const supabase = await createClient();

    const { data: unit, error: unitError } = await supabase
        .from('unidades_fiscalizables')
        .select('*')
        .eq('id', unidadId)
        .single();

    if (unitError) throw unitError;

    const { data: events, error: eventsError } = await supabase
        .from('cumplimiento_eventos')
        .select('*, obligacion:obligaciones_tipo(*)')
        .eq('obligaciones_tipo.unidad_id', unidadId)
        .order('fecha_vencimiento', { ascending: true });

    if (eventsError) throw eventsError;

    const allEvents = events as any[];
    const stats = {
        total: allEvents.length,
        completed: allEvents.filter(e => e.estado === 'CUMPLIDO').length,
        pending: allEvents.filter(e => e.estado === 'PENDIENTE').length,
        overdue: allEvents.filter(e => e.estado === 'VENCIDO').length
    };

    return {
        unit: unit as FiscalizableUnit,
        stats,
        upcomingEvents: allEvents as ComplianceEvent[]
    };
}
