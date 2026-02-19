'use client';

import { CriticalAsset, AssetCategory } from '../types';

export function AssetInventory({ assets }: { assets: CriticalAsset[] }) {
    // Group by category
    const grouped = assets.reduce((acc, asset) => {
        const cat = asset.categoria;
        if (!acc[cat]) acc[cat] = [];
        acc[cat].push(asset);
        return acc;
    }, {} as Record<AssetCategory, CriticalAsset[]>);

    const categories: Record<AssetCategory, string> = {
        'SISTEMA_CONTRA_INCENDIO': 'Sistema Contra Incendio 🔥',
        'ALMACENAMIENTO': 'Tanques y Almacenamiento ⛽',
        'DISPENSADOR': 'Dispensadores y Despacho ⛽',
        'TABLERO_ELECTRICO': 'Sistemas Eléctricos ⚡',
        'SEGURIDAD': 'Detectores y Seguridad 🚨'
    };

    return (
        <div className="space-y-8">
            {Object.entries(grouped).map(([cat, sectionAssets]) => (
                <div key={cat} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="bg-slate-50 px-6 py-4 border-b border-slate-100">
                        <h3 className="text-lg font-bold text-slate-800">
                            {categories[cat as AssetCategory] || cat}
                        </h3>
                    </div>
                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {sectionAssets.map((asset) => (
                            <div key={asset.id} className="border border-slate-200 rounded-lg p-4 hover:shadow-md transition-shadow relative group">
                                <div className="absolute top-4 right-4 text-green-500">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <h4 className="font-semibold text-slate-800 pr-6">{asset.nombre}</h4>
                                <div className="mt-3 text-sm text-slate-500 space-y-1">
                                    <p>Marca: <span className="text-slate-700 font-medium">{asset.marca_modelo || '-'}</span></p>
                                    <p>Serie: <span className="text-slate-700 font-medium">{asset.serie || '-'}</span></p>
                                    <p>Ubicación: <span className="text-slate-700 font-medium">{asset.ubicacion_referencia || '-'}</span></p>
                                </div>
                                <div className="mt-4 pt-4 border-t border-slate-100 flex justify-between items-center">
                                    <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded">Activo Crítico</span>
                                    <button className="text-xs text-blue-600 font-medium hover:underline">Ver Historial</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}
