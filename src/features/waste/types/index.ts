export type WasteType = 'PELIGROSO' | 'NO_PELIGROSO' | 'RAEE';

export type WasteLog = {
    id: string;
    unidad_id: string;
    fecha_generacion: string;
    tipo: WasteType;
    subtipo?: string;
    peso_kg: number;
    descripcion?: string;
    manifiesto_id?: string;
    created_at?: string;
};

export type WasteManifest = {
    id: string;
    unidad_id: string;
    numero_manifiesto: string;
    eo_rs_empresa: string;
    fecha_recojo: string;
    peso_total_kg: number;
    archivo_url?: string;
    estado: 'BORRADOR' | 'VALIDADO';
    created_at?: string;
};
