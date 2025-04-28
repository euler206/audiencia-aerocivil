
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Aspirante, 
  aspirantes, 
  loadFromLocalStorage, 
  plazas 
} from '@/lib';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, FileText, Trash2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { useAuth } from '@/contexts/AuthContext';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

const CandidateList: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isAdmin, clearAllSelections } = useAuth();
  const [search, setSearch] = useState('');
  const [displayedAspirantes, setDisplayedAspirantes] = useState<Aspirante[]>([...aspirantes]);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);

  useEffect(() => {
    loadFromLocalStorage();
    setDisplayedAspirantes([...aspirantes]);
  }, []);

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

    if (plazasLlenas.length > 0) {
      toast({
        title: "Algunas plazas están llenas",
        description: "Las siguientes plazas ya no tienen cupos disponibles: " + 
                    plazasLlenas.map(plaza => plaza.municipio).join(", "),
        variant: "destructive"
      });
    }

    navigate(`/select-vacancy/${cedula}`);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchTerm = e.target.value.toLowerCase();
    setSearch(searchTerm);
    
    if (searchTerm.trim() === '') {
      setDisplayedAspirantes([...aspirantes]);
    } else {
      const filtered = aspirantes.filter(
        (aspirante) =>
          aspirante.nombre.toLowerCase().includes(searchTerm) ||
          aspirante.cedula.includes(searchTerm) ||
          (aspirante.plazaDeseada && aspirante.plazaDeseada.toLowerCase().includes(searchTerm))
      );
      
      setDisplayedAspirantes(filtered);
    }
  };

  // Función para exportar a PDF
  const exportToPDF = () => {
    const doc = new jsPDF();
    
    // Título del documento
    doc.setFontSize(18);
    doc.text('Lista de Aspirantes', 14, 22);
    
    // Información del documento
    doc.setFontSize(11);
    doc.text('AERONAUTICA CIVIL - OPEC 209961', 14, 30);
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
    doc.autoTable({
      head: [isAdmin ? tableColumn : tableColumn.filter(col => col !== '')],
      body: tableRows,
      startY: 40,
      theme: 'striped',
      styles: { fontSize: 10, cellPadding: 3 },
      headStyles: { fillColor: [0, 48, 87], textColor: [255, 255, 255] }
    });
    
    // Guardar el PDF
    doc.save('listado-aspirantes.pdf');
    
    toast({
      title: "Exportación exitosa",
      description: "El listado de aspirantes se ha exportado a PDF correctamente",
      variant: "default"
    });
  };

  // Nueva función para manejar la limpieza de todas las selecciones
  const handleClearAllSelections = () => {
    setIsConfirmDialogOpen(true);
  };

  const confirmClearAllSelections = () => {
    const success = clearAllSelections();
    
    if (success) {
      loadFromLocalStorage(); // Recargar datos
      setDisplayedAspirantes([...aspirantes]); // Actualizar la lista
      
      toast({
        title: "Operación exitosa",
        description: "Se han eliminado todas las selecciones de plazas",
        variant: "default"
      });
    } else {
      toast({
        title: "Error",
        description: "No tienes permiso para realizar esta acción",
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
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <Input
            type="text"
            placeholder="Buscar por nombre, cédula o plaza..."
            value={search}
            onChange={handleSearchChange}
            className="pl-10"
          />
        </div>
        
        <div className="flex gap-2">
          {isAdmin && (
            <Button 
              onClick={handleClearAllSelections}
              variant="destructive"
              className="flex items-center"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Borrar Todas las Selecciones
            </Button>
          )}
          
          <Button 
            onClick={exportToPDF}
            className="bg-aeronautica hover:bg-aeronautica-light"
          >
            <FileText className="mr-2 h-4 w-4" />
            Exportar a PDF
          </Button>
        </div>
      </div>
      
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full table-auto">
          <thead>
            <tr>
              <th className="table-header">Puesto</th>
              <th className="table-header">Puntaje</th>
              {isAdmin && <th className="table-header">Cédula</th>}
              <th className="table-header">Nombre</th>
              <th className="table-header">Plaza Deseada</th>
              <th className="table-header">Acción</th>
            </tr>
          </thead>
          <tbody>
            {displayedAspirantes.map((aspirante) => {
              const plazaSeleccionada = plazas.find(p => p.municipio === aspirante.plazaDeseada);
              const aspirantesConMismaPlaza = aspirantes.filter(
                a => a.plazaDeseada === aspirante.plazaDeseada && a.cedula !== aspirante.cedula
              ).length;
              const plazaLlena = plazaSeleccionada && aspirantesConMismaPlaza >= plazaSeleccionada.vacantes;

              return (
                <tr key={aspirante.cedula} className="table-row">
                  <td className="table-cell">{aspirante.puesto}</td>
                  <td className="table-cell">{aspirante.puntaje}</td>
                  {isAdmin && <td className="table-cell">{aspirante.cedula}</td>}
                  <td className="table-cell">{aspirante.nombre}</td>
                  <td className="table-cell">
                    {aspirante.plazaDeseada ? (
                      <span className={plazaLlena ? "text-red-600" : "text-green-600"}>
                        {aspirante.plazaDeseada}
                      </span>
                    ) : (
                      <span className="text-gray-400">No seleccionada</span>
                    )}
                  </td>
                  <td className="table-cell">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleSelectVacancy(aspirante.cedula)}
                      className="bg-aeronautica text-white hover:bg-aeronautica-light"
                    >
                      Seleccionar Plaza
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <AlertDialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Está seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción eliminará todas las selecciones de plazas de todos los aspirantes. Esta acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmClearAllSelections} className="bg-destructive text-destructive-foreground">
              Confirmar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default CandidateList;
