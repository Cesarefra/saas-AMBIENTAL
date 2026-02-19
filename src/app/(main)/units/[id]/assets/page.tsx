import { Suspense } from 'react';
import { assetsService } from '@/features/assets/services/assetsService';
import { AssetInventory } from '@/features/assets/components/AssetInventory';

export const dynamic = 'force-dynamic';

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function AssetsPage({ params }: PageProps) {
    const { id } = await params;

    try {
        const assets = await assetsService.getCriticalAssets(id);

        return (
            <div className="max-w-5xl mx-auto p-6 space-y-8">
                <header className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800">Activos Críticos y Mantenimiento</h1>
                        <p className="text-slate-500">Unidad Fiscalizable ID: {id}</p>
                    </div>
                    <button className="text-sm text-blue-600 font-medium hover:underline">
                        &larr; Volver al Dashboard
                    </button>
                </header>

                <section>
                    <AssetInventory assets={assets} />
                </section>
            </div>
        );
    } catch (error) {
        console.error(error);
        return <div>Error al cargar activos.</div>;
    }
}
