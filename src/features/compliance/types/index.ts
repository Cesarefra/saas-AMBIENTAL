export type FiscalizableUnit = {
  id: string;
  nombre: string; // 'Planta de Envasado Huánuco' | 'Gasocentro GLP Huánuco'
  iga_aprobado: string;
  codigo_osinergmin?: string;
  direccion?: string;
  created_at?: string;
};

export type ObligationCategory = 'Monitoreo' | 'Residuos' | 'Seguridad' | 'Reporte';

export type EnvironmentalObligation = {
  id: string;
  unidad_id: string;
  categoria: ObligationCategory;
  nombre_obligacion: string;
  frecuencia_dias: number;
  entidad_fiscalizadora: 'OEFA' | 'OSINERGMIN';
  normativa_ref?: string;
  created_at?: string;
};

export type ComplianceStatus = 'PENDIENTE' | 'CUMPLIDO' | 'VENCIDO' | 'PROXIMO';

export type ComplianceEvent = {
  id: string;
  obligacion_id: string;
  fecha_vencimiento: string; // ISO Date
  fecha_ejecucion?: string;
  estado: ComplianceStatus;
  comentario?: string;
  evidencia_url?: string;
  created_at?: string;
  
  // Joins
  obligacion?: EnvironmentalObligation;
};

export type ComplianceDashboardData = {
  unit: FiscalizableUnit;
  stats: {
    total: number;
    completed: number;
    pending: number;
    overdue: number;
  };
  upcomingEvents: ComplianceEvent[];
};
