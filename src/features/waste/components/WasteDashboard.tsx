'use client';

import { useState } from 'react';
import { WasteLog, WasteType } from '../types';
import { wasteService } from '../services/wasteService';

export function WasteDashboard({ unitId, initialLogs }: { unitId: string, initialLogs: WasteLog[] }) {
    const [logs, setLogs] = useState<WasteLog[]>(initialLogs);
    const [loading, setLoading] = useState(false);

    // Form State
    const [type, setType] = useState<WasteType>('NO_PELIGROSO');
    const [weight, setWeight] = useState('');
    const [desc, setDesc] = useState('');

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        try {
            const newLog = await wasteService.createWasteLog({
                unidad_id: unitId,
                fecha_generacion: new Date().toISOString(),
                tipo: type,
                peso_kg: Number(weight),
                descripcion: desc
            });
            setLogs([newLog, ...logs]);
            setWeight('');
            setDesc('');
        } catch (error) {
            console.error(error);
            alert('Error al registrar residuo');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="space-y-8">
            {/* Registration Form */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <h3 className="text-lg font-bold text-slate-800 mb-4">Registrar Generación Diaria</h3>
                <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4 items-end">
                    <div className="flex-1">
                        <label className="block text-sm font-medium text-slate-700 mb-1">Tipo de Residuo</label>
                        <select
                            value={type} onChange={e => setType(e.target.value as WasteType)}
                            className="w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        >
                            <option value="NO_PELIGROSO">No Peligroso (General)</option>
                            <option value="PELIGROSO">Peligroso (Aceites/Químicos)</option>
                            <option value="RAEE">RAEE (Electrónicos)</option>
                        </select>
                    </div>
                    <div className="w-32">
                        <label className="block text-sm font-medium text-slate-700 mb-1">Peso (kg)</label>
                        <input
                            type="number" step="0.01" required
                            value={weight} onChange={e => setWeight(e.target.value)}
                            className="w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                    </div>
                    <div className="flex-[2]">
                        <label className="block text-sm font-medium text-slate-700 mb-1">Descripción</label>
                        <input
                            type="text" placeholder="Ej: Trapos con grasa"
                            value={desc} onChange={e => setDesc(e.target.value)}
                            className="w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                    </div>
                    <button
                        type="submit" disabled={loading}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                    >
                        {loading ? 'Guardando...' : 'Registrar'}
                    </button>
                </form>
            </div>

            {/* Logs Table */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <table className="min-w-full divide-y divide-slate-200">
                    <thead className="bg-slate-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Fecha</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Tipo</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Descripción</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Peso (kg)</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-slate-200">
                        {logs.map((log) => (
                            <tr key={log.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                                    {new Date(log.fecha_generacion).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${log.type === 'PELIGROSO' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                                        }`}>
                                        {log.type}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-sm text-slate-500">{log.descripcion || '-'}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 text-right font-medium">
                                    {log.peso_kg}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
