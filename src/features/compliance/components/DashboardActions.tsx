'use client';

export function DashboardActions() {
    return (
        <div className="flex gap-3">
            <button
                onClick={() => alert('¡La descarga del informe global estará disponible en la siguiente fase!')}
                className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 text-sm font-medium transition-colors"
            >
                Descargar Informe Global
            </button>
            <button
                onClick={() => alert('¡El formulario de nuevo registro se implementará próximamente!')}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium transition-colors shadow-sm shadow-blue-200"
            >
                Nuevo Registro
            </button>
        </div>
    );
}
