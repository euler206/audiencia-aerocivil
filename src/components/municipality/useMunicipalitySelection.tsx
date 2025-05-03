
import { useLoadMunicipalityData } from './useLoadMunicipalityData';
import { usePriorityActions } from './usePriorityActions';
import { usePDFExport } from './usePDFExport';
import { useSaveSelection } from './useSaveSelection';

export const useMunicipalitySelection = () => {
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
    cedula
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
