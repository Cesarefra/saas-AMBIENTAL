'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { FiscalizableUnit, ComplianceDashboardData } from '../types';
import { complianceService } from '../services/complianceService';

export function ComplianceDashboard({ unitId }: { unitId: string }) {
    const [data, setData] = useState<ComplianceDashboardData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function load() {
            try {
                const dashboardData = await complianceService.getDashboardData(unitId);
                setData(dashboardData);
            } catch (error) {
                console.error("Failed to load dashboard", error);
            } finally {
                setLoading(false);
            }
        }
        load();
    }, [unitId]);

    if (loading) return <div className="p-8 text-center text-slate-500">Cargando Semaforo Ambiental...</div>;
    if (!data) return <div className="p-8 text-center text-red-500">Error al cargar datos de {unitId}</div>;

    // Traffic Light Logic
    const getTrafficLight = (overdue: number, pending: number) => {
        if (overdue > 0) return 'bg-red-500 shadow-red-500/50';
        if (pending > 0) return 'bg-yellow-500 shadow-yellow-500/50';
        return 'bg-green-500 shadow-green-500/50';
    };

    const statusColor = getTrafficLight(data.stats.overdue, data.stats.pending);

    return (
        <div className="max-w-5xl mx-auto p-6 space-y-8">
            {/* Header Card */}
            <div className="bg-white rounded-2xl p-8 shadow-xl border border-slate-100 flex items-center justify-between relative overflow-hidden">
                <div className="relative z-10">
                    <h1 className="text-3xl font-bold text-slate-800 mb-2">{data.unit.nombre}</h1>
                    <p className="text-slate-500 font-medium">IGA Aprobado: {data.unit.iga_aprobado}</p>
                </div>

                {/* The Traffic Light (Semáforo) */}
                <div className="flex flex-col items-center gap-2">
                    <div className={`w-24 h-24 rounded-full ${statusColor} shadow-lg transition-all duration-500 animate-pulse`} />
                    <span className="text-sm font-bold text-slate-600 uppercase tracking-wider">Estado Actual</span>
                </div>

                {/* Background Decoration */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-slate-50 rounded-full -translate-y-1/2 translate-x-1/2 z-0" />
            </div>

            {/* Module Navigation */}
            <div className="grid grid-cols-2 gap-4">
                <Link href={`/units/${unitId}/waste`} className="bg-white p-4 rounded-xl border border-slate-200 hover:border-blue-500 hover:shadow-md transition-all group">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-blue-50 text-blue-600 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-colors">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-800">Gestión de Residuos</h3>
                            <p className="text-xs text-slate-500">Balance de Masas y Manifiestos</p>
                        </div>
                    </div>
                </Link>
                <Link href={`/units/${unitId}/assets`} className="bg-white p-4 rounded-xl border border-slate-200 hover:border-blue-500 hover:shadow-md transition-all group">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-indigo-50 text-indigo-600 rounded-lg group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-800">Activos y Mantenimiento</h3>
                            <p className="text-xs text-slate-500">Bombas, Tanques y Extintores</p>
                        </div>
                    </div>
                </Link>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <StatCard label="Total Obligaciones" value={data.stats.total} color="text-slate-700" />
                <StatCard label="Cumplidas" value={data.stats.completed} color="text-green-600" />
                <StatCard label="Pendientes" value={data.stats.pending} color="text-yellow-600" />
                <StatCard label="Vencidas (Crítico)" value={data.stats.overdue} color="text-red-600" />
            </div>

            {/* Upcoming Events List */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-6 border-b border-slate-100">
                    <h2 className="text-xl font-bold text-slate-800">Próximos Vencimientos</h2>
                </div>
                <div className="divide-y divide-slate-100">
                    {data.upcomingEvents.map((event) => (
                        <div key={event.id} className="p-6 hover:bg-slate-50 transition-colors flex items-center justify-between group">
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <span className={`px-2 py-0.5 rounded text-xs font-bold ${event.estado === 'VENCIDO' ? 'bg-red-100 text-red-700' :
                                        event.estado === 'PENDIENTE' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'
                                        }`}>
                                        {event.estado}
                                    </span>
                                    <span className="text-xs text-slate-400 font-medium">{event.obligacion?.entidad_fiscalizadora}</span>
                                </div>
                                <h3 className="font-semibold text-slate-700 group-hover:text-blue-600 transition-colors">
                                    {event.obligacion?.nombre_obligacion}
                                </h3>
                            </div>
                            <div className="text-right">
                                <p className="text-sm font-bold text-slate-600">{new Date(event.fecha_vencimiento).toLocaleDateString()}</p>
                                <span className="text-xs text-slate-400">Vencimiento</span>
                            </div>
                        </div>
                    ))}
                    {data.upcomingEvents.length === 0 && (
                        <div className="p-8 text-center text-slate-400">No hay obligaciones pendientes próximas.</div>
                    )}
                </div>
            </div>
        </div>
    );
}

function StatCard({ label, value, color }: { label: string, value: number, color: string }) {
    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
            <p className="text-sm text-slate-400 font-medium mb-1">{label}</p>
            <p className={`text-3xl font-black ${color}`}>{value}</p>
        </div>
    );
}
