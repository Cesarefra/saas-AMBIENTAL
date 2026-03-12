import { Suspense } from 'react';
import { getWasteLogs } from '@/features/waste/services/wasteService';
import { WasteDashboard } from '@/features/waste/components/WasteDashboard';
import { notFound } from 'next/navigation';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function WastePage({ params }: PageProps) {
    const { id } = await params;

    try {
        const logs = await getWasteLogs(id);

        return (
            <div className="max-w-5xl mx-auto p-6 space-y-8">
                <header className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800">Gestión de Residuos Sólidos</h1>
                        <p className="text-slate-500">Unidad Fiscalizable ID: {id}</p>
                    </div>
                    <Link href="/dashboard" className="text-sm text-blue-600 font-medium hover:underline">
                        &larr; Volver al Dashboard
                    </Link>
                </header>

                <section>
                    <h2 className="text-lg font-semibold text-slate-700 mb-4">Balance de Masas (Generación Diaria)</h2>
                    <WasteDashboard unitId={id} initialLogs={logs} />
                </section>
            </div>
        );
    } catch (error) {
        console.error(error);
        return <div>Error al cargar módulo de residuos.</div>;
    }
}
