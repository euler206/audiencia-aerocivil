
import { useCallback } from 'react';
import { toast } from 'sonner';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { aspirantes } from '@/lib';
import { PriorityMunicipality } from './types';

export const usePDFExport = (
  municipalitiesWithPriority: PriorityMunicipality[],
  cedula: string | undefined
) => {
  // Optimizar la generación de PDF para evitar bloqueos
  const exportToPDF = useCallback(() => {
    try {
      console.log("Iniciando generación de PDF de selección de plazas...");
      
      if (!cedula) {
        toast.error("No se encuentra información del aspirante");
        return;
      }
      
      const aspirante = aspirantes.find(a => a.cedula === cedula);
      if (!aspirante) {
        toast.error("No se encuentra información del aspirante");
        return;
      }
      
      // Usamos Promise.resolve().then para evitar bloqueo de la UI
      Promise.resolve().then(() => {
        const doc = new jsPDF();
        
        doc.setFontSize(18);
        doc.text('Selección de Plazas', 14, 22);
        
        doc.setFontSize(11);
        doc.text(`Aspirante: ${aspirante.nombre}`, 14, 30);
        doc.text(`Cédula: ${aspirante.cedula}`, 14, 36);
        doc.text(`Puesto: ${aspirante.puesto}`, 14, 42);
        doc.text(`Fecha de selección: ${new Date().toLocaleDateString()}`, 14, 48);
        
        const prioridadesSeleccionadas = municipalitiesWithPriority
          .filter(item => item.prioridad > 0)
          .sort((a, b) => a.prioridad - b.prioridad);
        
        const tableColumn = ['Prioridad', 'Municipio', 'Departamento', 'Vacantes'];
        const tableRows = prioridadesSeleccionadas.map(item => [
          item.prioridad,
          item.municipio,
          item.departamento,
          item.vacantes
        ]);
        
        autoTable(doc, {
          head: [tableColumn],
          body: tableRows,
          startY: 55,
          theme: 'striped',
          styles: { fontSize: 10, cellPadding: 3 },
          headStyles: { fillColor: [0, 48, 87], textColor: [255, 255, 255] }
        });
        
        if (aspirante.plazaDeseada) {
          const lastY = (doc as any).lastAutoTable.finalY || 60;
          doc.text(`Plaza actualmente asignada: ${aspirante.plazaDeseada}`, 14, lastY + 10);
        }
        
        // Abrir PDF en una nueva ventana en lugar de descargarlo
        const pdfBlob = doc.output('blob');
        const pdfUrl = URL.createObjectURL(pdfBlob);
        window.open(pdfUrl, '_blank');
        
        toast.success("El PDF se ha abierto en una nueva ventana");
      });
      
    } catch (error) {
      console.error("Error al generar el PDF:", error);
      const errorMessage = error instanceof Error ? error.message : "Error desconocido";
      toast.error(`Error al generar el PDF: ${errorMessage}`);
    }
  }, [cedula, municipalitiesWithPriority]);

  return {
    exportToPDF
  };
};
