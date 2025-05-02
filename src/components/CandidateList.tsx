
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Aspirante, 
  aspirantes, 
  loadFromLocalStorage,
  plazas 
} from '@/lib';
import { useToast } from "@/hooks/use-toast";
import { useAuth } from '@/contexts/AuthContext';
import jsPDF from 'jspdf';
import { jsPDF as jsPDFType } from 'jspdf';
import autoTable from 'jspdf-autotable';

import CandidateSearch from './candidate/CandidateSearch';
import CandidateActions from './candidate/CandidateActions';
import CandidateTable from './candidate/CandidateTable';
import ClearSelectionsDialog from './candidate/ClearSelectionsDialog';

const CandidateList: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isAdmin, clearAllSelections } = useAuth();
  const [search, setSearch] = useState('');
  const [displayedAspirantes, setDisplayedAspirantes] = useState<Aspirante[]>([...aspirantes]);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0); // Usado para forzar actualizaciones

  useEffect(() => {
    const loadData = async () => {
      await loadFromLocalStorage();
      // Ordenar aspirantes por puesto después de cargarlos
      const sortedAspirantes = [...aspirantes].sort((a, b) => a.puesto - b.puesto);
      setDisplayedAspirantes(sortedAspirantes);
    };
    
    loadData();
  }, [refreshTrigger]); // Se ejecuta al cargar y cuando cambia refreshTrigger

  const handleSelectVacancy = (cedula: string) => {
    const aspirante = aspirantes.find(a => a.cedula === cedula);
    if (!aspirante) return;

    // Contar cuántos aspirantes han seleccionado cada plaza
    const plazasSeleccionadas = aspirantes.reduce((acc, curr) => {
      if (curr.plazaDeseada && curr.cedula !== cedula) { // Excluimos al aspirante actual
        acc[curr.plazaDeseada] = (acc[curr.plazaDeseada] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);

    // Verificar si alguna plaza ha alcanzado su límite
    const plazasLlenas = plazas.filter(plaza => {
      const seleccionadas = plazasSeleccionadas[plaza.municipio] || 0;
      return seleccionadas >= plaza.vacantes;
    });

    navigate(`/select-vacancy/${cedula}`);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchTerm = e.target.value.toLowerCase();
    setSearch(searchTerm);
    
    if (searchTerm.trim() === '') {
      // Cuando se limpia la búsqueda, mostrar los aspirantes ordenados por puesto
      setDisplayedAspirantes([...aspirantes].sort((a, b) => a.puesto - b.puesto));
    } else {
      // Filtrar por término de búsqueda y luego ordenar por puesto
      const filtered = aspirantes.filter(
        (aspirante) =>
          aspirante.nombre.toLowerCase().includes(searchTerm) ||
          aspirante.cedula.includes(searchTerm) ||
          (aspirante.plazaDeseada && aspirante.plazaDeseada.toLowerCase().includes(searchTerm))
      ).sort((a, b) => a.puesto - b.puesto);
      
      setDisplayedAspirantes(filtered);
    }
  };

  // Función para exportar a PDF modificada para abrir en nueva ventana
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
      const tableRows = displayedAspirantes.map(aspirante => {
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

  // Función para manejar la limpieza de todas las selecciones
  const handleClearAllSelections = () => {
    setIsConfirmDialogOpen(true);
  };

  const confirmClearAllSelections = async () => {
    console.log("Iniciando proceso de borrado de selecciones...");
    const success = await clearAllSelections();
    console.log("Resultado del borrado:", success);
    
    if (success) {
      // Recargar datos y actualizar la interfaz
      setRefreshTrigger(prev => prev + 1); // Forzar recarga de datos
      
      toast({
        title: "Operación exitosa",
        description: "Se han eliminado todas las selecciones de plazas",
        variant: "default"
      });
    } else {
      toast({
        title: "Error",
        description: "No se pudieron eliminar las selecciones o no tienes permiso para esta acción",
        variant: "destructive"
      });
    }
    
    setIsConfirmDialogOpen(false);
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Lista de Aspirantes</h2>
        <p className="text-gray-600">
          Listado de aspirantes de la convocatoria OPEC 209961 de la AERONAUTICA CIVIL
        </p>
      </div>
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <CandidateSearch value={search} onChange={handleSearchChange} />
        <CandidateActions 
          isAdmin={isAdmin} 
          onExportPDF={exportToPDF} 
          onClearSelections={handleClearAllSelections} 
        />
      </div>
      
      <CandidateTable 
        aspirantes={displayedAspirantes} 
        isAdmin={isAdmin} 
        onSelectVacancy={handleSelectVacancy} 
      />

      <ClearSelectionsDialog
        isOpen={isConfirmDialogOpen}
        onOpenChange={setIsConfirmDialogOpen}
        onConfirm={confirmClearAllSelections}
      />
    </div>
  );
};

export default CandidateList;
