
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

import CandidateListHeader from './candidate/CandidateListHeader';
import CandidateListManager from './candidate/CandidateListManager';
import CandidateTable from './candidate/CandidateTable';

const CandidateList: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isAdmin, clearAllSelections } = useAuth();
  const [displayedAspirantes, setDisplayedAspirantes] = useState<Aspirante[]>([]);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Cargar datos iniciales
  useEffect(() => {
    const loadData = async () => {
      try {
        console.log("Cargando datos desde localStorage/Supabase...");
        await loadFromLocalStorage();
        
        // Ordenar aspirantes por puesto después de cargarlos
        const sortedAspirantes = [...aspirantes].sort((a, b) => a.puesto - b.puesto);
        console.log(`Datos cargados: ${sortedAspirantes.length} aspirantes`);
        setDisplayedAspirantes(sortedAspirantes);
      } catch (error) {
        console.error("Error al cargar datos:", error);
        toast({
          title: "Error",
          description: "No se pudieron cargar los datos correctamente",
          variant: "destructive"
        });
      }
    };
    
    loadData();
  }, [refreshTrigger, toast]);

  // Manejar la selección de vacante
  const handleSelectVacancy = (cedula: string) => {
    const aspirante = aspirantes.find(a => a.cedula === cedula);
    if (!aspirante) return;
    
    navigate(`/select-vacancy/${cedula}`);
  };

  // Manejar la limpieza de todas las selecciones
  const handleClearAllSelections = async () => {
    console.log("Iniciando proceso de borrado de selecciones...");
    try {
      const success = await clearAllSelections();
      console.log("Resultado del borrado:", success);
      
      if (success) {
        // Recargar datos y actualizar la interfaz
        setRefreshTrigger(prev => prev + 1);
        
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
    } catch (error) {
      console.error("Error al borrar selecciones:", error);
      toast({
        title: "Error",
        description: "Ocurrió un error al procesar la solicitud",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <CandidateListHeader 
        title="Lista de Aspirantes" 
        subtitle="Listado de aspirantes de la convocatoria OPEC 209961 de la AERONAUTICA CIVIL" 
      />
      
      <CandidateListManager
        aspirantes={aspirantes}
        isAdmin={isAdmin}
        onSelectionsClear={handleClearAllSelections}
        onSearchChange={setDisplayedAspirantes}
      />
      
      <CandidateTable 
        aspirantes={displayedAspirantes} 
        isAdmin={isAdmin} 
        onSelectVacancy={handleSelectVacancy} 
      />
    </div>
  );
};

export default CandidateList;
