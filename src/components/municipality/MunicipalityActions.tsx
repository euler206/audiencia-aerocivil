
import React from 'react';
import { Button } from '@/components/ui/button';
import { FileText } from 'lucide-react';

interface MunicipalityActionsProps {
  onExportToPDF: () => void;
  onReset: () => void;
  onSave: () => void;
  isLoading?: boolean;
}

const MunicipalityActions: React.FC<MunicipalityActionsProps> = ({
  onExportToPDF,
  onReset,
  onSave,
  isLoading
}) => {
  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Selección de Plaza</h2>
          <p className="text-gray-600">
            Seleccione las plazas en orden de prioridad. Haga clic en cada municipio para asignar una prioridad.
          </p>
        </div>
        
        <Button 
          onClick={onExportToPDF}
          className="bg-aeronautica hover:bg-aeronautica-light"
        >
          <FileText className="mr-2 h-4 w-4" />
          Exportar a PDF
        </Button>
      </div>
      
      <div className="flex justify-end space-x-4">
        <Button variant="outline" onClick={onReset}>
          Reiniciar selección
        </Button>
        <Button 
          className="bg-aeronautica hover:bg-aeronautica-light" 
          onClick={onSave}
          disabled={isLoading}
        >
          {isLoading ? 'Guardando...' : 'Guardar selección'}
        </Button>
      </div>
    </>
  );
};

export default MunicipalityActions;
