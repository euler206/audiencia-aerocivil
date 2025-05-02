
import React, { useState, useEffect } from 'react';
import { Aspirante } from '@/lib';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { useToast } from "@/hooks/use-toast";
import CandidateSearch from './CandidateSearch';
import CandidateActions from './CandidateActions';
import ClearSelectionsDialog from './ClearSelectionsDialog';

interface CandidateListManagerProps {
  aspirantes: Aspirante[];
  isAdmin: boolean;
  onSelectionsClear: () => Promise<void>;
  onSearchChange: (filteredAspirantes: Aspirante[]) => void;
}

const CandidateListManager: React.FC<CandidateListManagerProps> = ({
  aspirantes,
  isAdmin,
  onSelectionsClear,
  onSearchChange
}) => {
  const { toast } = useToast();
  const [search, setSearch] = useState('');
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);

  useEffect(() => {
    handleSearchChange({ target: { value: search } } as React.ChangeEvent<HTMLInputElement>);
  }, [aspirantes]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchTerm = e.target.value.toLowerCase();
    setSearch(searchTerm);
    
    if (searchTerm.trim() === '') {
      // Cuando se limpia la búsqueda, mostrar los aspirantes ordenados por puesto
      onSearchChange([...aspirantes].sort((a, b) => a.puesto - b.puesto));
    } else {
      // Filtrar por término de búsqueda y luego ordenar por puesto
      const filtered = aspirantes.filter(
        (aspirante) =>
          aspirante.nombre.toLowerCase().includes(searchTerm) ||
          aspirante.cedula.includes(searchTerm) ||
          (aspirante.plazaDeseada && aspirante.plazaDeseada.toLowerCase().includes(searchTerm))
      ).sort((a, b) => a.puesto - b.puesto);
      
      onSearchChange(filtered);
    }
  };

  // Función para exportar a PDF
  const exportToPDF = () => {
    try {
      console.log("Iniciando generación de PDF...");
      const doc = new jsPDF();
      
      // Título del documento
      doc.setFontSize(18);
      doc.text('Lista de Aspirantes', 14, 22);
      
      // Información del documento
      doc.setFontSize(11);
      doc.text('SIMULACRO AUDIENCIA PUBLICA - AERONAUTICA CIVIL - OPEC 209961', 14, 30);
      doc.text(`Fecha: ${new Date().toLocaleDateString()}`, 14, 36);
      
      // Preparar los datos para la tabla
      const tableColumn = ['Puesto', 'Puntaje', isAdmin ? 'Cédula' : '', 'Nombre', 'Plaza Deseada'];
      const tableRows = aspirantes.map(aspirante => {
        const data = [
          aspirante.puesto,
          aspirante.puntaje,
          isAdmin ? aspirante.cedula : '',
          aspirante.nombre,
          aspirante.plazaDeseada || 'No seleccionada'
        ];
        
        // Si no es admin, filtrar la columna de cédula
        return isAdmin ? data : data.filter((_, index) => index !== 2);
      });
      
      // Configurar y generar la tabla
      autoTable(doc, {
        head: [isAdmin ? tableColumn : tableColumn.filter(col => col !== '')],
        body: tableRows,
        startY: 40,
        theme: 'striped',
        styles: { fontSize: 10, cellPadding: 3 },
        headStyles: { fillColor: [0, 48, 87], textColor: [255, 255, 255] }
      });
      
      console.log("PDF generado correctamente, procediendo a abrir en nueva ventana...");
      
      // Abrir PDF en una nueva ventana en lugar de descargarlo
      const pdfBlob = doc.output('blob');
      const pdfUrl = URL.createObjectURL(pdfBlob);
      window.open(pdfUrl, '_blank');
      
      toast({
        title: "Exportación exitosa",
        description: "El PDF se ha abierto en una nueva ventana",
      });
      
    } catch (error) {
      console.error("Error al generar el PDF:", error);
      toast({
        title: "Error",
        description: "No se pudo generar el PDF: " + (error instanceof Error ? error.message : "Error desconocido"),
        variant: "destructive"
      });
    }
  };

  // Manejador para borrar selecciones
  const handleClearAllSelections = () => {
    setIsConfirmDialogOpen(true);
  };

  const confirmClearAllSelections = async () => {
    try {
      await onSelectionsClear();
    } catch (error) {
      console.error("Error al borrar selecciones:", error);
    } finally {
      setIsConfirmDialogOpen(false);
    }
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <CandidateSearch value={search} onChange={handleSearchChange} />
        <CandidateActions 
          isAdmin={isAdmin} 
          onExportPDF={exportToPDF} 
          onClearSelections={handleClearAllSelections} 
        />
      </div>

      <ClearSelectionsDialog
        isOpen={isConfirmDialogOpen}
        onOpenChange={setIsConfirmDialogOpen}
        onConfirm={confirmClearAllSelections}
      />
    </>
  );
};

export default CandidateListManager;
