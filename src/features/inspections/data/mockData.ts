export type InspectionItemType = 'component' | 'commitment';

export interface InspectionItem {
  id: string;
  description: string;
  type: InspectionItemType;
  // Common fields
  observations?: string;
  // Component specific
  isPrincipal?: boolean;
  declaredInIGA?: boolean;
  location?: string;
  // Commitment specific
  periodicity?: string;
  responsible?: string;
}

export interface FacilityData {
  id: string;
  name: string;
  source: string;
  components: InspectionItem[];
  commitments: InspectionItem[];
}

export const mockInspectionsData: FacilityData[] = [
  {
    id: 'gasocentro',
    name: 'GASOCENTRO HUÁNUCO',
    source: 'DIA GAS HUANUCO 1 - Fiscalización OEFA',
    components: [
      { id: 'c1', type: 'component', description: 'Tanques GLP (3,200 gls): ¿Presenta placa de fabricante legible, prueba hidrostática/espesores vigente, y válvulas de seguridad operativas sin rastro de fugas?', isPrincipal: true, declaredInIGA: true, location: 'Zona de Almacenamiento', observations: 'Verificar certificado de pruebas DGH Osinergmin.' },
      { id: 'c2', type: 'component', description: 'Dispensadores GLP: ¿Cuentan con mangueras normadas vigentes, válvulas break-away (corte rápido) operativas y sistema eléctrico antiexplosivo hermético?', isPrincipal: true, declaredInIGA: true, location: 'Isla de Despacho', observations: 'Exigencia técnica de seguridad OEFA/OSINERGMIN.' },
      { id: 'c3', type: 'component', description: 'Bomba de trasiego: ¿Se encuentra anclada, con guardas de protección en fajas y sin filtraciones de producto en ell sello mecánico?', isPrincipal: false, declaredInIGA: true, location: 'Zona de Almacenamiento', observations: 'Verificar operatividad antiexplosiva.' },
      { id: 'c4', type: 'component', description: 'Sistema eléctrico y Puesta a Tierra: ¿Certificado de operatividad de pozos a tierra con \u003c 5 ohmios y tableros centralizados sin empalmes expuestos?', isPrincipal: false, declaredInIGA: true, location: 'Toda el área', observations: 'Obligatorio anualmente.' },
      { id: 'c5', type: 'component', description: 'Minimarket/Oficina: ¿Las vías de escape están libres de obstáculos y cuentan con señalética luminosa de emergencia operativa?', isPrincipal: false, declaredInIGA: true, location: 'Edificación principal', observations: 'Prevención de riesgos.' },
      { id: 'c6', type: 'component', description: 'SS.HH. y Sistemas de Drenaje: ¿Trampas de grasa limpias y pozo séptico/biodigestor sin rebalses ni malos olores evidentes?', isPrincipal: false, declaredInIGA: true, location: 'Edificación principal', observations: 'Prohibido verter efluentes no domésticos.' },
      { id: 'c7', type: 'component', description: 'Seguridad Contraincendios: ¿Extintores PQS 12Kg con tarjeta de inspección al día y ubicados a menos de 15m de cada punto de riesgo?', isPrincipal: false, declaredInIGA: true, location: 'Toda el área e Isla', observations: 'Norma NTP 350.043.' },
      { id: 'c8', type: 'component', description: 'Perímetro: ¿Muros cortafuego íntegros (sin fisuras), pintados y área de operaciones libre de maleza/material combustible?', isPrincipal: false, declaredInIGA: true, location: 'Perímetro del terreno', observations: 'Distancias de seguridad obligatorias.' },
    ],
    commitments: [
      { id: 'm1', type: 'commitment', description: 'Aire y Emisiones: ¿Existen registros visuales/fotográficos de humedecimiento de zonas de tierra para evitar polución? ¿Vehículos apagados durante el abastecimiento?', periodicity: 'Frecuente', responsible: 'Supervisión de Turno' },
      { id: 'm2', type: 'commitment', description: 'Gestión EE.SS. No Peligrosos: ¿Tachos rotulados por colores (Norma Técnica Peruana) y evidencia de contrato con recojo municipal o EO-RS?', periodicity: 'Permanente', responsible: 'Titular / Municipalidad', observations: 'Colores según NTP 900.058:2019.' },
      { id: 'm3', type: 'commitment', description: 'Residuos Peligrosos (RR.PP.): ¿Almacén techado, geomembrana antiderrame, ingreso restringido y libro de registro de RR.PP. foliado al día?', periodicity: 'Permanente', responsible: 'Titular de IGA' },
      { id: 'm4', type: 'commitment', description: 'Manifiestos de Manejo RR.PP.: ¿Presenta manifiestos y certificados de disposición final emitidos por EO-RS autorizada en MINAM ingresados al SIGERS?', periodicity: 'Anual (Declaración)', responsible: 'Titular / EO-RS', observations: 'Punto crítico OEFA.' },
      { id: 'm5', type: 'commitment', description: 'Suelos y Derrames: ¿Cuenta con Kit Anti-Derrames completo (paños absorbentes, salchichas, arena, bolsas rojas, pala antichispa) accesible y señalizado?', periodicity: 'Permanente', responsible: 'Personal en Planta' },
      { id: 'm6', type: 'commitment', description: 'Capacitación S&SO: ¿Registros firmados de capacitación en Plan de Contingencia, manejo de extintores y primeros auxilios al personal actual?', periodicity: 'Trimestral/Anual', responsible: 'HSE / Proveedor' },
      { id: 'm7', type: 'commitment', description: 'Monitoreo Ambiental IGA: ¿Informes de monitoreo de Calidad de Aire, Ruido correspondientes al último periodo remitidos a la OEFA?', periodicity: 'Según IGA (Semestral)', responsible: 'Titular / Laboratorio Inacal', observations: 'Sujeto a sanción si no se reportan.' },
      { id: 'm8', type: 'commitment', description: 'Actualización Legal: ¿La instalación ha sufrido modificaciones estructurales no reportadas en el IGA o no declaradas en el último ITS/DIA?', periodicity: 'Ocasional', responsible: 'Gerencia Legal / HSE', observations: 'OEFA cruza datos con Osinergmin.' },
    ]
  },
  {
    id: 'planta',
    name: 'PLANTA ENVASADORA HUÁNUCO',
    source: 'ITS FINAL 2018 - Fiscalización OEFA',
    components: [
      { id: 'c9', type: 'component', description: 'Tanques Almacenamiento (10k y 13.9k gls): ¿Ambos tanques operan según planos ITS, pintura íntegra, rotulación rombo NFPA, rociadores listos?', isPrincipal: true, declaredInIGA: true, location: 'Zona de tanques', observations: 'Concordancia con ITS 2018.' },
      { id: 'c10', type: 'component', description: 'Plataforma de Envasado: ¿Carruseles centrados, básculas con certificado Inacal vigente, pisos libres de herramientas u obstáculos mecánicos?', isPrincipal: true, declaredInIGA: true, location: 'Plataforma central', observations: 'Zona crítica de operación.' },
      { id: 'c11', type: 'component', description: 'Área de Mantenimiento de Cilindros: ¿Cabina de pintura con cortina de agua/filtros activos y zona de granallado en recinto hermético?', isPrincipal: false, declaredInIGA: true, location: 'Mantenimiento', observations: 'Principal punto de emisión de PM y COVs.' },
      { id: 'c12', type: 'component', description: 'Zona Recuperación (Tanque Pulmón): ¿Conectividad hermética a línea de recuperación y manómetros verificados?', isPrincipal: false, declaredInIGA: true, location: 'Recuperación', observations: 'Validado en modificación ITS.' },
      { id: 'c13', type: 'component', description: 'Cuartos de Máquinas/Tableros: ¿Ubicación reubicada según ITS 2018, bandeja de contención bajo generador diésel y EPP auditivo obligatorio?', isPrincipal: false, declaredInIGA: true, location: 'Cuarto de equipos', observations: 'Fuente de ruido y potencial derrame HC.' },
      { id: 'c14', type: 'component', description: 'Accesos y Vías: ¿Nueva puerta frontal ITS implementada con señalización vial de prevención para la salida de tractos y camiones?', isPrincipal: false, declaredInIGA: true, location: 'Frontis', observations: 'Gestión de tránsito.' },
    ],
    commitments: [
      { id: 'm9', type: 'commitment', description: 'Control Emisiones COVs y PM: ¿Certifica el mantenimiento preventivo mensual a los extractores de la cabina de pintura y mangueras de envasado?', periodicity: 'Mensual/Permanente', responsible: 'Mantenimiento / Titular' },
      { id: 'm10', type: 'commitment', description: 'Ruido Perimetral y Ocupacional: ¿Existen barreras acústicas y el personal expuesto cuenta con tapones u orejeras de alta atenuación (\u003e25 NRR)?', periodicity: 'Permanente', responsible: 'Supervisor Planta' },
      { id: 'm11', type: 'commitment', description: 'RR.PP. Industriales: ¿Almacén de peligrosos incluye borras de pintura, polvo de granalla y aceites usados? ¿Cantidades concuerdan con manifiestos?', periodicity: 'Permanente', responsible: 'Logística / HSE' },
      { id: 'm12', type: 'commitment', description: 'Registro de Declaración (SIGERS): ¿Declaración jurada anual de manejo de RR.SS. enviada al MINAM/OEFA a través del portal correspondiente?', periodicity: 'Anual (Febrero/Marzo)', responsible: 'HSE / Consultora', observations: 'Obligación transversal.' },
      { id: 'm13', type: 'commitment', description: 'Gestión del Agua: ¿Consumo registrado en bitácora? ¿SS.HH. conectados a pozo séptico exclusivo sin conexión a canal fluvial/industrial?', periodicity: 'Permanente', responsible: 'Mantenimiento' },
      { id: 'm14', type: 'commitment', description: 'Simulacros y Contingencia: ¿Registro fotográfico y actas de simulacro anual de fuga e incendio con participación conjunta de bomberos?', periodicity: 'Anual', responsible: 'Jefe de Planta / HSE' },
      { id: 'm15', type: 'commitment', description: 'Monitoreos ITS 2018: ¿Validar ejecución y envío de informes de Monitoreo Ambiental Trimestral (CA-1, CA-2 y R-1 a R-4) dentro de plazos legales?', periodicity: 'Trimestral', responsible: 'Titular / Lab. Calidad' },
    ]
  }
];
