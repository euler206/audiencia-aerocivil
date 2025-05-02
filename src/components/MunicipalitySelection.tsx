
import React from 'react';
import { useMunicipalitySelection } from './municipality/useMunicipalitySelection';
import MunicipalityActions from './municipality/MunicipalityActions';
import PriorityLegend from './municipality/PriorityLegend';
import MunicipalityGrid from './municipality/MunicipalityGrid';
import { aspirantes } from '@/lib';

const MunicipalitySelection: React.FC = () => {
  const {
    municipalitiesWithPriority,
    aspirantePuesto,
    isLoading,
    isSaving,
    handleSetPriority,
    handleSaveSelection,
    handleReset,
    exportToPDF
  } = useMunicipalitySelection();

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
    <div className="container mx-auto px-4 py-6">
      <MunicipalityActions 
        onExportToPDF={exportToPDF} 
        onReset={handleReset} 
        onSave={handleSaveSelection}
        isLoading={isSaving}
      />
      
      <PriorityLegend />
      
      <MunicipalityGrid 
        municipalities={municipalitiesWithPriority}
        aspirantePuesto={aspirantePuesto}
        aspirantes={aspirantes}
        onSetPriority={handleSetPriority}
      />
    </div>
  );
};

export default MunicipalitySelection;
