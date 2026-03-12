'use client';

import React, { useState, useEffect } from 'react';
import { mockInspectionsData, InspectionItem, FacilityData } from '@/features/inspections/data/mockData';
import { InspectionTable, InspectionRecord } from '@/features/inspections/components/InspectionTable';
import { ClipboardCheck, FileDown, FileSpreadsheet } from 'lucide-react';
import { exportToPDF, exportToExcel } from '@/features/inspections/utils/exportReport';
import { createClient } from '@/shared/lib/supabase/client';

export default function InspectionsPage() {
  const [selectedFacilityId, setSelectedFacilityId] = useState<string>(mockInspectionsData[0].id);
  const [isSaving, setIsSaving] = useState(false);
  
  // Lifted state
  const [records, setRecords] = useState<Record<string, InspectionRecord>>({});
  const [customComponents, setCustomComponents] = useState<InspectionItem[]>([]);

  // Clear state on facility change
  useEffect(() => {
    setRecords({});
    setCustomComponents([]);
  }, [selectedFacilityId]);

  const selectedData = mockInspectionsData.find(f => f.id === selectedFacilityId);

  const dataWithCustom: FacilityData | undefined = selectedData ? {
    ...selectedData,
    components: [...selectedData.components, ...customComponents]
  } : undefined;

  const handleUpdateRecord = (id: string, updates: Partial<InspectionRecord>) => {
    setRecords(prev => {
      const current = prev[id] || { status: 'pendiente', observation: '', locationActual: '' };
      return { ...prev, [id]: { ...current, ...updates } };
    });
  };

  const handleAddCustomComponent = () => {
    setCustomComponents(prev => [...prev, {
      id: `custom_${Date.now()}`,
      description: '',
      type: 'component',
      isPrincipal: false,
      declaredInIGA: false,
      location: ''
    }]);
  };

  const handleUpdateCustomComponent = (id: string, updates: Partial<InspectionItem>) => {
    setCustomComponents(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
  };
  
  const handleRemoveCustomComponent = (id: string) => {
    setCustomComponents(prev => prev.filter(c => c.id !== id));
  };

  const handleSave = async () => {
    if (!dataWithCustom) return;
    setIsSaving(true);
    
    try {
      const supabase = createClient();
      
      // 1. Crear Inspección
      const { data: inspection, error: inspectionError } = await supabase
        .from('inspections')
        .insert([{
          facility_id: selectedFacilityId,
          inspector_name: 'Inspector Principal', 
          status: 'completada'
        }])
        .select()
        .single();
        
      if (inspectionError) throw inspectionError;

      // 2. Subir Fotos y Guardar Resultados
      const resultsToInsert = [];
      
      for (const [itemId, record] of Object.entries(records)) {
        let photo_url: string | null = null;
        
        if (record.photos && record.photos.length > 0) {
          const uploadedUrls: string[] = [];
          for (let i = 0; i < record.photos.length; i++) {
            const photo = record.photos[i];
            const fileExt = photo.file.name.split('.').pop();
            const fileName = `${inspection.id}/${itemId}_${i}_${Date.now()}.${fileExt}`;
            const { error: uploadError } = await supabase.storage
              .from('inspection_evidence')
              .upload(fileName, photo.file);
              
            if (!uploadError) {
              const { data: { publicUrl } } = supabase.storage
                .from('inspection_evidence')
                .getPublicUrl(fileName);
              uploadedUrls.push(publicUrl);
            }
          }
          if (uploadedUrls.length > 0) {
            photo_url = uploadedUrls.join(',');
          }
        }
        
        // Find custom component description if it's a custom one to save somewhere? 
        // Actually we would save it in `observation` to avoid a complex schema change.
        // Or if we can find it:
        const customComp = customComponents.find(c => c.id === itemId);
        const itemDesc = customComp ? `[NUEVO COMPONENTE: ${customComp.description}] ${record.observation || ''}` : record.observation;

        resultsToInsert.push({
          inspection_id: inspection.id,
          item_id: itemId,
          status: record.status || 'pendiente',
          observation: itemDesc,
          location_actual: record.locationActual,
          photo_url
        });
      }
      
      if (resultsToInsert.length > 0) {
        const { error: resultsError } = await supabase
          .from('inspection_results')
          .insert(resultsToInsert);
          
        if (resultsError) throw resultsError;
      }
      
      alert('Inspección guardada correctamente en Supabase.');
      
    } catch (error: any) {
      console.error('Error guardando inspección completo:', error);
      console.error('Error name/message:', error?.name, error?.message);
      console.error('Error details:', error?.details, error?.hint);
      
      let msg = error?.message || 'Error desconocido';
      
      if (msg === 'Failed to fetch') {
        msg = 'No se pudo conectar con Supabase (Failed to fetch). \n\nEsto suele ocurrir si:\n1. Tienes un AdBlocker o antivirus bloqueando la conexión a Supabase.\n2. Estás en una red corporativa/VPN con firewall.\n3. Estás sin internet.\n\nPor favor, prueba pausando extensiones o cambiando de red.';
      }
      
      alert(`Hubo un error guardando la inspección:\n\n${msg}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleExportPDF = () => {
    if (!dataWithCustom) return;
    exportToPDF(dataWithCustom, records);
  };

  const handleExportExcel = () => {
    if (!dataWithCustom) return;
    exportToExcel(dataWithCustom, records);
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
              <ClipboardCheck className="w-8 h-8 text-blue-600" />
              Inspecciones In Situ
            </h1>
            <p className="text-slate-500 mt-1">
              Evaluación y Verificación de Componentes y Compromisos Ambientales
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Facility Selector */}
            <div className="bg-white px-4 py-2 flex items-center gap-3 rounded-lg border border-slate-200 shadow-sm">
              <span className="text-sm font-medium text-slate-700">Instalación:</span>
              <select 
                value={selectedFacilityId}
                onChange={(e) => setSelectedFacilityId(e.target.value)}
                className="text-sm font-bold border-0 bg-transparent py-1 pr-6 text-slate-900 focus:ring-0 cursor-pointer outline-none"
              >
                {mockInspectionsData.map(facility => (
                  <option key={facility.id} value={facility.id}>
                    {facility.name}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Export Buttons */}
            <button 
              onClick={handleExportPDF}
              className="p-2.5 bg-white border border-slate-200 text-rose-600 rounded-lg shadow-sm hover:bg-rose-50 transition-colors flex items-center gap-2"
              title="Descargar PDF"
            >
              <FileDown className="w-5 h-5" />
              <span className="text-sm font-medium hidden md:inline">PDF</span>
            </button>
            <button 
              onClick={handleExportExcel}
              className="p-2.5 bg-white border border-slate-200 text-emerald-600 rounded-lg shadow-sm hover:bg-emerald-50 transition-colors flex items-center gap-2"
              title="Descargar Excel"
            >
              <FileSpreadsheet className="w-5 h-5" />
              <span className="text-sm font-medium hidden md:inline">Excel</span>
            </button>
          </div>
        </div>

        {/* Selected Facility Table */}
        {dataWithCustom ? (
          <InspectionTable 
            data={dataWithCustom}
            records={records}
            onUpdateRecord={handleUpdateRecord}
            onAddCustomComponent={handleAddCustomComponent}
            onUpdateCustomComponent={handleUpdateCustomComponent}
            onRemoveCustomComponent={handleRemoveCustomComponent}
            onSave={handleSave} 
            isSaving={isSaving} 
          />
        ) : (
          <div className="p-8 text-center text-slate-500 bg-white rounded-xl border border-slate-200">
            Seleccione una instalación válida.
          </div>
        )}

      </div>
    </div>
  );
}
