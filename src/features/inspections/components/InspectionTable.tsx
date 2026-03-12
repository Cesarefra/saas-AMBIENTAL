'use client';

import React, { useRef } from 'react';
import { FacilityData, InspectionItem } from '../data/mockData';
import { 
  Building2, 
  Camera,
  FileText,
  Trash2,
  Plus
} from 'lucide-react';

export type StatusType = 'cumple' | 'no-cumple' | 'na' | 'pendiente';

export interface InspectionRecord {
  status: StatusType;
  observation: string;
  locationActual?: string;
  photoFile?: File;
  photoPreview?: string;
  photoUrl?: string; // para cuando ya se subió
}

interface InspectionTableProps {
  data: FacilityData;
  records: Record<string, InspectionRecord>;
  onUpdateRecord: (id: string, updates: Partial<InspectionRecord>) => void;
  onAddCustomComponent: () => void;
  onUpdateCustomComponent: (id: string, updates: Partial<InspectionItem>) => void;
  onRemoveCustomComponent: (id: string) => void;
  onSave?: () => void;
  isSaving?: boolean;
}

export function InspectionTable({ 
  data, 
  records, 
  onUpdateRecord, 
  onAddCustomComponent,
  onUpdateCustomComponent,
  onRemoveCustomComponent,
  onSave, 
  isSaving = false 
}: InspectionTableProps) {
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const handlePhotoCapture = (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      onUpdateRecord(id, { photoFile: file, photoPreview: previewUrl });
    }
  };

  const triggerFileInput = (id: string) => {
    fileInputRefs.current[id]?.click();
  };

  const removePhoto = (id: string) => {
    onUpdateRecord(id, { photoFile: undefined, photoPreview: undefined, photoUrl: undefined });
  };

  const PhotoCaptureUI = ({ id }: { id: string }) => {
    const record = records[id];
    return (
      <div className="mt-2 text-center">
        <input
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          ref={(el) => { fileInputRefs.current[id] = el; }}
          onChange={(e) => handlePhotoCapture(id, e)}
        />
        {record?.photoPreview ? (
          <div className="relative inline-block w-20 h-20 rounded-md overflow-hidden border border-slate-200 group">
            <img src={record.photoPreview} alt="Evidencia" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <button 
                onClick={() => removePhoto(id)}
                className="p-1.5 bg-white rounded-full text-rose-600 hover:bg-rose-50 transition-colors"
                title="Eliminar Foto"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          </div>
        ) : (
          <button 
            onClick={() => triggerFileInput(id)}
            className="w-full flex items-center justify-center gap-1.5 p-1.5 text-xs text-blue-600 bg-blue-50 border border-blue-200 border-dashed rounded-md hover:bg-blue-100 transition-colors"
          >
            <Camera className="w-3 h-3" />
            <span>Evidencia</span>
          </button>
        )}
      </div>
    );
  };

  const isCustomComponent = (id: string) => id.startsWith('custom_');

  return (
    <div className="w-full max-w-[1400px] mx-auto space-y-8 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-blue-600">
            <Building2 className="w-6 h-6" />
            <h2 className="text-xl md:text-2xl font-bold text-slate-800">{data.name}</h2>
          </div>
          <p className="text-sm font-medium text-slate-500 flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Fuente: {data.source}
          </p>
        </div>
        
        {onSave && (
          <button 
            onClick={onSave}
            disabled={isSaving}
            className="px-6 py-2.5 bg-blue-600 text-white font-semibold rounded-lg shadow-sm hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 justify-center"
          >
            {isSaving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/20 border-t-white" />
                Guardando...
              </>
            ) : (
              'Guardar Cambios'
            )}
          </button>
        )}
      </div>

      {/* Tabla 1: Componentes Operativos */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-x-auto">
        <div className="bg-slate-50 border-b border-slate-200 p-4">
          <h2 className="text-lg font-bold text-slate-800">1. Cuadro de Verificación de Componentes Operativos</h2>
          <p className="text-xs text-slate-500 mt-1">Verificación de componentes principales y auxiliares, contrastando con el IGA.</p>
        </div>
        <table className="w-full text-sm text-left whitespace-nowrap md:whitespace-normal">
          <thead className="text-xs text-slate-600 uppercase bg-slate-100/50 border-b border-slate-200">
            <tr>
              <th className="px-4 py-3 font-semibold w-64">Componente</th>
              <th className="px-4 py-3 font-semibold w-32">Tipo (Principal/Auxiliar)</th>
              <th className="px-4 py-3 font-semibold w-32">Declarado en IGA (Sí/No)</th>
              <th className="px-4 py-3 font-semibold w-48">Ubicación según IGA</th>
              <th className="px-4 py-3 font-semibold w-48">Ubicación Actual</th>
              <th className="px-4 py-3 font-semibold">Observaciones / Evidencia</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {data.components.map((c) => {
              const record = records[c.id] || { observation: '', locationActual: '' };
              const custom = isCustomComponent(c.id);

              return (
                <tr key={c.id} className="hover:bg-slate-50/50">
                  <td className="px-4 py-3">
                    {custom ? (
                      <div className="space-y-2">
                        <textarea 
                          placeholder="Nuevo componente encontrado..."
                          value={c.description}
                          onChange={(e) => onUpdateCustomComponent(c.id, { description: e.target.value })}
                          className="w-full px-2 py-1.5 text-xs border border-blue-300 rounded focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none resize-y min-h-[40px] bg-blue-50"
                        />
                        <button 
                          onClick={() => onRemoveCustomComponent(c.id)}
                          className="text-[10px] text-rose-600 hover:text-rose-700 font-semibold flex items-center gap-1"
                        >
                          <Trash2 className="w-3 h-3" /> Quitar fila
                        </button>
                      </div>
                    ) : (
                      <p className="font-medium text-slate-800 whitespace-normal text-xs">{c.description}</p>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {custom ? (
                      <select
                        value={c.isPrincipal ? "principal" : "auxiliar"}
                        onChange={(e) => onUpdateCustomComponent(c.id, { isPrincipal: e.target.value === "principal" })}
                        className="w-full px-2 py-1.5 text-xs border border-slate-300 rounded outline-none"
                      >
                        <option value="principal">Principal</option>
                        <option value="auxiliar">Auxiliar</option>
                      </select>
                    ) : (
                      <span className={`px-2 py-1 rounded-md text-[11px] font-semibold ${c.isPrincipal ? 'bg-blue-50 text-blue-700 border border-blue-100' : 'bg-slate-100 text-slate-600 border border-slate-200'}`}>
                        {c.isPrincipal ? 'Principal' : 'Auxiliar'}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 flex justify-center rounded-md text-[11px] font-semibold ${c.declaredInIGA ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>
                      {c.declaredInIGA ? 'Sí' : 'No'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-600">
                    {c.location || '-'}
                  </td>
                  <td className="px-4 py-3">
                    <input 
                      type="text"
                      placeholder="Indicar ubicación..."
                      value={record.locationActual || ''}
                      onChange={(e) => onUpdateRecord(c.id, { locationActual: e.target.value })}
                      className="w-full px-2 py-1.5 text-xs border border-slate-300 rounded focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                    />
                  </td>
                  <td className="px-4 py-3 min-w-[200px]">
                    <textarea 
                      placeholder="Novedades, desplazamientos, incrementos..."
                      value={record.observation}
                      onChange={(e) => onUpdateRecord(c.id, { observation: e.target.value })}
                      className="w-full px-2 py-1.5 text-xs border border-slate-300 rounded focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none resize-y min-h-[40px]"
                    />
                    <PhotoCaptureUI id={c.id} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        
        {/* Botón para añadir componentes no declarados */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex justify-center md:justify-start">
          <button
            onClick={onAddCustomComponent}
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-blue-600 bg-blue-50 border border-blue-200 rounded-lg shadow-sm hover:bg-blue-100 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Vincular componente no declarado en el IGA
          </button>
        </div>
      </div>

      {/* Tabla 2: Compromisos Ambientales */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-x-auto">
        <div className="bg-slate-50 border-b border-slate-200 p-4">
          <h2 className="text-lg font-bold text-slate-800">2. Cuadro Adicional de Compromisos Ambientales</h2>
          <p className="text-xs text-slate-500 mt-1">Verificación de compromisos ambientales que figuran en su instrumento.</p>
        </div>
        <table className="w-full text-sm text-left whitespace-nowrap md:whitespace-normal">
          <thead className="text-xs text-slate-600 uppercase bg-slate-100/50 border-b border-slate-200">
            <tr>
              <th className="px-4 py-3 font-semibold w-48">Compromiso Ambiental</th>
              <th className="px-4 py-3 font-semibold w-64">Descripción</th>
              <th className="px-4 py-3 font-semibold w-32">Periodicidad</th>
              <th className="px-4 py-3 font-semibold w-32">Responsable</th>
              <th className="px-4 py-3 font-semibold w-36">Estado</th>
              <th className="px-4 py-3 font-semibold">Observaciones / Evidencia</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {data.commitments.map((c) => {
              const record = records[c.id] || { status: 'pendiente', observation: '' };
              return (
                <tr key={c.id} className="hover:bg-slate-50/50">
                  <td className="px-4 py-3 font-medium text-slate-800 text-xs">
                    {c.description.split(':')[0] || 'Compromiso'}
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-600 whitespace-pre-wrap">
                    {c.description.split(':').slice(1).join(':').trim() || c.description}
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-600">
                    {c.periodicity || '-'}
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-600">
                    {c.responsible || '-'}
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={record.status}
                      onChange={(e) => onUpdateRecord(c.id, { status: e.target.value as StatusType })}
                      className={`w-full px-2 py-1.5 text-xs font-semibold rounded border outline-none 
                        ${record.status === 'cumple' ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 
                          record.status === 'no-cumple' ? 'bg-rose-50 border-rose-200 text-rose-700' : 
                          record.status === 'na' ? 'bg-slate-100 border-slate-300 text-slate-600' : 
                          'bg-white border-slate-300 text-slate-500'}`}
                    >
                      <option value="pendiente" disabled>Seleccionar...</option>
                      <option value="cumple">✓ Cumple</option>
                      <option value="no-cumple">✗ No cumple</option>
                      <option value="na">- N/A</option>
                    </select>
                  </td>
                  <td className="px-4 py-3 min-w-[200px]">
                    <textarea 
                      placeholder="Observaciones..."
                      value={record.observation}
                      onChange={(e) => onUpdateRecord(c.id, { observation: e.target.value })}
                      className="w-full px-2 py-1.5 text-xs border border-slate-300 rounded focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none resize-y min-h-[40px]"
                    />
                    <PhotoCaptureUI id={c.id} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

    </div>
  );
}
