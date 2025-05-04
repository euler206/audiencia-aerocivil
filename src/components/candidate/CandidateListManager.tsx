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
  onSelectionsClear: () => Promise<boolean>;
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
      onSearchChange([...aspirantes].sort((a, b) => a.puesto - b.puesto));
    } else {
      const filtered = aspirantes.filter(
        (aspirante) =>
          aspirante.nombre.toLowerCase().includes(searchTerm) ||
          aspirante.cedula.includes(searchTerm) ||
          (aspirante.plazaDeseada && aspirante.plazaDeseada.toLowerCase().includes(searchTerm))
      ).sort((a, b) => a.puesto - b.puesto);
      
      onSearchChange(filtered);
    }
  };

  const exportToPDF = () => {
    try {
      console.log("Iniciando generación de PDF...");
      const doc = new jsPDF();
      
      doc.setFontSize(18);
      doc.text('Lista de Aspirantes', 14, 22);
      
      doc.setFontSize(11);
      doc.text('SIMULACRO AUDIENCIA PUBLICA - AERONAUTICA CIVIL - OPEC 209961', 14, 30);
      doc.text(`Fecha: ${new Date().toLocaleDateString()}`, 14, 36);
      
      const tableColumn = ['Puesto', 'Puntaje', isAdmin ? 'Cédula' : '', 'Nombre', 'Plaza Deseada'];
      const tableRows = aspirantes.map(aspirante => {
        const data = [
          aspirante.puesto,
          aspirante.puntaje,
          isAdmin ? aspirante.cedula : '',
          aspirante.nombre,
          aspirante.plazaDeseada || 'No seleccionada'
        ];
        
        if (!isAdmin) {
          data.splice(2, 1);
        }
        
        return data;
      });
      
      autoTable(doc, {
        head: [isAdmin ? tableColumn : tableColumn.filter(col => col !== '')],
        body: tableRows,
        startY: 40,
        theme: 'striped',
        styles: { fontSize: 10, cellPadding: 3 },
        headStyles: { fillColor: [0, 48, 87], textColor: [255, 255, 255] }
      });
      
      console.log("PDF generado correctamente, procediendo a abrir en nueva ventana...");
      
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

  const handleClearAllSelections = () => {
    setIsConfirmDialogOpen(true);
  };

  const confirmClearAllSelections = async (): Promise<boolean> => {
    try {
      const result = await onSelectionsClear();
      setIsConfirmDialogOpen(false);
      return result;
    } catch (error) {
      console.error("Error al borrar selecciones:", error);
      setIsConfirmDialogOpen(false);
      return false;
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
