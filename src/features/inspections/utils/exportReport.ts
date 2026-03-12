import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { FacilityData } from '../data/mockData';
import { InspectionRecord } from '../components/InspectionTable';

export const exportToPDF = (facility: FacilityData, records: Record<string, InspectionRecord>) => {
  const doc = new jsPDF();

  // Título
  doc.setFontSize(18);
  doc.text(`Reporte de Inspección In Situ: ${facility.name}`, 14, 22);
  
  doc.setFontSize(11);
  doc.setTextColor(100);
  doc.text(`Fuente: ${facility.source}`, 14, 30);
  doc.text(`Fecha: ${new Date().toLocaleDateString()}`, 14, 36);

  // Tabla Componentes
  doc.setFontSize(14);
  doc.setTextColor(0);
  doc.text('I. Verificación de Componentes Operativos', 14, 48);

  const getStatusText = (status: string) => {
    switch (status) {
      case 'cumple': return 'Cumple';
      case 'no-cumple': return 'No Cumple';
      case 'na': return 'N/A';
      default: return 'Pendiente';
    }
  };

  const componentRows = facility.components.map((c, idx) => {
    const record = records[c.id];
    return [
      idx + 1,
      c.description,
      c.isPrincipal ? 'Principal' : 'Auxiliar',
      c.declaredInIGA ? 'Sí' : 'No',
      c.location || '-',
      record?.locationActual || '-',
      record?.observation || '-'
    ];
  });

  autoTable(doc, {
    startY: 52,
    head: [['N°', 'Componente', 'Tipo', 'Desc. IGA', 'Ubic. IGA', 'Ubic. Actual', 'Obser.']],
    body: componentRows,
    styles: { fontSize: 8 },
    headStyles: { fillColor: [37, 99, 235] },
  });

  // Tabla Compromisos
  const finalY = (doc as any).lastAutoTable.finalY || 52;
  
  doc.setFontSize(14);
  doc.setTextColor(0);
  doc.text('II. Cumplimiento de Compromisos Ambientales', 14, finalY + 12);

  const commitmentRows = facility.commitments.map((c, idx) => {
    const record = records[c.id];
    const rawDesc = c.description;
    const parts = rawDesc.split(':');
    const compName = parts[0] || 'Compromiso';
    const compDesc = parts.slice(1).join(':').trim() || rawDesc;

    return [
      idx + 1,
      compName,
      compDesc,
      c.periodicity || '-',
      c.responsible || '-',
      getStatusText(record?.status),
      record?.observation || '-'
    ];
  });

  autoTable(doc, {
    startY: finalY + 16,
    head: [['N°', 'Compromiso', 'Descripción', 'Periodicidad', 'Responsable', 'Estado', 'Obser.']],
    body: commitmentRows,
    styles: { fontSize: 8 },
    headStyles: { fillColor: [37, 99, 235] },
  });

  doc.save(`inspeccion_${facility.id}_${new Date().getTime()}.pdf`);
};

export const exportToExcel = (facility: FacilityData, records: Record<string, InspectionRecord>) => {
  const getStatusText = (status: string) => {
    switch (status) {
      case 'cumple': return 'Cumple';
      case 'no-cumple': return 'No Cumple';
      case 'na': return 'N/A';
      default: return 'Pendiente';
    }
  };

  const componentData = facility.components.map(c => {
    const record = records[c.id];
    return {
      'Componente': c.description,
      'Tipo (Principal/Auxiliar)': c.isPrincipal ? 'Principal' : 'Auxiliar',
      'Declarado en IGA (Sí/No)': c.declaredInIGA ? 'Sí' : 'No',
      'Ubicación según IGA': c.location || '-',
      'Ubicación Actual': record?.locationActual || '-',
      'Observaciones': record?.observation || '-'
    };
  });

  const commitmentData = facility.commitments.map(c => {
    const record = records[c.id];
    const rawDesc = c.description;
    const parts = rawDesc.split(':');
    const compName = parts[0] || 'Compromiso';
    const compDesc = parts.slice(1).join(':').trim() || rawDesc;

    return {
      'Compromiso Ambiental': compName,
      'Descripción': compDesc,
      'Periodicidad': c.periodicity || '-',
      'Responsable': c.responsible || '-',
      'Estado (Cumple/No cumple)': getStatusText(record?.status),
      'Observaciones': record?.observation || '-'
    };
  });

  const wb = XLSX.utils.book_new();

  // Componentes Sheet
  const ws1 = XLSX.utils.json_to_sheet(componentData);
  const ws1Cols = [{wch: 50}, {wch: 25}, {wch: 25}, {wch: 25}, {wch: 25}, {wch: 40}];
  ws1['!cols'] = ws1Cols;
  XLSX.utils.book_append_sheet(wb, ws1, "Componentes");

  // Compromisos Sheet
  const ws2 = XLSX.utils.json_to_sheet(commitmentData);
  const ws2Cols = [{wch: 30}, {wch: 60}, {wch: 15}, {wch: 20}, {wch: 25}, {wch: 40}];
  ws2['!cols'] = ws2Cols;
  XLSX.utils.book_append_sheet(wb, ws2, "Compromisos");
  
  XLSX.writeFile(wb, `inspeccion_${facility.id}_${new Date().getTime()}.xlsx`);
};
