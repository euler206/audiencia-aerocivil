
import { useLoadMunicipalityData } from './useLoadMunicipalityData';
import { usePriorityActions } from './usePriorityActions';
import { usePDFExport } from './usePDFExport';
import { useSaveSelection } from './useSaveSelection';
import { useAuth } from '@/contexts/AuthContext';

export const useMunicipalitySelection = (isAdmin: boolean = false) => {
  const {
    municipalitiesWithPriority,
    setMunicipalitiesWithPriority,
    aspirantePuesto,
    maxPrioridades,
    isLoading,
    cedula
  } = useLoadMunicipalityData();
  
  const { handleSetPriority, handleReset } = usePriorityActions(
    municipalitiesWithPriority,
    setMunicipalitiesWithPriority,
    maxPrioridades
  );
  
  const { exportToPDF } = usePDFExport(municipalitiesWithPriority, cedula);
  
  const { isSaving, handleSaveSelection } = useSaveSelection(
    municipalitiesWithPriority,
    aspirantePuesto,
    cedula,
    isAdmin
  );

  return {
    municipalitiesWithPriority,
    aspirantePuesto,
    maxPrioridades,
    isLoading,
    isSaving,
    handleSetPriority,
    handleSaveSelection,
    handleReset,
    exportToPDF
  };
};
