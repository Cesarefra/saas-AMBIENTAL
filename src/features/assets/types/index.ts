export type AssetCategory = 'SISTEMA_CONTRA_INCENDIO' | 'ALMACENAMIENTO' | 'DISPENSADOR' | 'TABLERO_ELECTRICO' | 'SEGURIDAD';

export type CriticalAsset = {
  id: string;
  unidad_id: string;
  nombre: string;
  categoria: AssetCategory;
  marca_modelo?: string;
  serie?: string;
  fecha_fabricacion?: string;
  ubicacion_referencia?: string;
  created_at?: string;
};

export type MaintenanceLog = {
  id: string;
  activo_id: string;
  tipo_mantenimiento: 'PREVENTIVO' | 'CORRECTIVO' | 'CALIBRACION' | 'PRUEBA_HERMETICIDAD';
  fecha_programada: string;
  fecha_ejecucion?: string;
  estado: 'PROGRAMADO' | 'EJECUTADO' | 'VENCIDO';
  tecnico_responsable?: string;
  observaciones?: string;
  evidencia_url?: string;
  
  // Join
  activo?: CriticalAsset;
};
