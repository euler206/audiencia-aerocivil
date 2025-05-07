
import React, { useCallback, useEffect } from 'react';
import { useMunicipalitySelection } from './municipality/useMunicipalitySelection';
import MunicipalityActions from './municipality/MunicipalityActions';
import PriorityLegend from './municipality/PriorityLegend';
import MunicipalityGrid from './municipality/MunicipalityGrid';
import { aspirantes, loadFromLocalStorage } from '@/lib';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { LoaderCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Progress } from '@/components/ui/progress';

const MunicipalitySelection: React.FC = () => {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const {
    municipalitiesWithPriority,
    aspirantePuesto,
    isLoading,
    isSaving,
    handleSetPriority,
    handleSaveSelection,
    handleReset,
    exportToPDF
  } = useMunicipalitySelection(isAdmin);

  // Cargar datos iniciales al montar el componente
  useEffect(() => {
    const initData = async () => {
      try {
        await loadFromLocalStorage();
      } catch (error) {
        console.error("Error loading initial data:", error);
        toast.error("Error al cargar datos iniciales");
      }
    };
    
    initData();
  }, []);

  // Memorizar la función de manipulación de prioridad para evitar recreaciones
  const handlePriorityChange = useCallback((municipio: string) => {
    handleSetPriority(municipio);
  }, [handleSetPriority]);

  // Manejar la acción de cancelar y volver al dashboard
  const handleCancel = useCallback(() => {
    navigate('/dashboard');
  }, [navigate]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-6 flex items-center justify-center h-64">
        <div className="text-center">
          <div className="mb-4 text-aeronautica">Cargando plazas...</div>
          <div className="animate-spin h-8 w-8 border-4 border-aeronautica border-t-transparent rounded-full mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 relative">
      {isSaving && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center max-w-md mx-auto">
            <LoaderCircle className="h-12 w-12 animate-spin text-aeronautica mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">Procesando selección</h3>
            <p className="text-gray-600 mb-4">
              Guardando sus prioridades y recalculando asignaciones. 
              Este proceso puede tardar unos momentos, por favor espere...
            </p>
            <Progress value={100} className="h-2" />
          </div>
        </div>
      )}
      
      <MunicipalityActions 
        onExportToPDF={exportToPDF} 
        onReset={handleReset} 
        onSave={handleSaveSelection}
        onCancel={handleCancel}
        isLoading={isSaving}
      />
      
      <PriorityLegend />
      
      <MunicipalityGrid 
        municipalities={municipalitiesWithPriority}
        aspirantePuesto={aspirantePuesto}
        aspirantes={aspirantes}
        onSetPriority={handlePriorityChange}
      />
    </div>
  );
};

export default React.memo(MunicipalitySelection);
