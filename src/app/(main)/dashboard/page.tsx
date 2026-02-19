import { Suspense } from 'react';
import { complianceService } from '@/features/compliance/services/complianceService';
import { ComplianceDashboard } from '@/features/compliance/components/ComplianceDashboard';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  // Fetch units server-side
  const units = await complianceService.getFiscalizableUnits();

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">Z</span>
            </div>
            <h1 className="text-xl font-bold text-slate-800">
              Sistema de Gestión Ambiental
            </h1>
          </div>
          <div className="text-sm text-slate-500">
            ZETA GAS ANDINO S.A.
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Fiscalización Ambiental (OEFA)</h2>
            <p className="text-slate-600 mt-1">Estado de cumplimiento por Unidad Fiscalizable.</p>
          </div>
          <div className="flex gap-3">
            <button className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 text-sm font-medium transition-colors">
              Descargar Informe Global
            </button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium transition-colors shadow-sm shadow-blue-200">
              Nuevo Registro
            </button>
          </div>
        </div>

        {/* Units Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {units.map((unit) => (
            <div key={unit.id} className="relative">
              {/* Unit Label Tag */}
              <div className="absolute -top-3 left-6 z-20">
                <span className="bg-slate-800 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-lg">
                  {unit.codigo_osinergmin ? `COD: ${unit.codigo_osinergmin}` : 'Unidad Fiscalizable'}
                </span>
              </div>

              <Suspense fallback={<DashboardSkeleton />}>
                <ComplianceDashboard unitId={unit.id} />
              </Suspense>
            </div>
          ))}
        </div>

        {units.length === 0 && (
          <div className="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-slate-200">
            <p className="text-slate-400">No se encontraron unidades fiscalizables configuradas.</p>
          </div>
        )}
      </main>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="bg-white rounded-2xl p-8 shadow-xl border border-slate-100 h-96 animate-pulse">
      <div className="h-8 bg-slate-100 rounded w-1/3 mb-4"></div>
      <div className="h-4 bg-slate-100 rounded w-1/4 mb-12"></div>
      <div className="grid grid-cols-4 gap-4">
        <div className="h-24 bg-slate-100 rounded-xl"></div>
        <div className="h-24 bg-slate-100 rounded-xl"></div>
        <div className="h-24 bg-slate-100 rounded-xl"></div>
        <div className="h-24 bg-slate-100 rounded-xl"></div>
      </div>
    </div>
  );
}
