
import React from 'react';
import { Button } from '@/components/ui/button';
import { FileText, Trash2 } from 'lucide-react';

interface CandidateActionsProps {
  isAdmin: boolean;
  onExportPDF: () => void;
  onClearSelections: () => void;
}

const CandidateActions: React.FC<CandidateActionsProps> = ({ 
  isAdmin, 
  onExportPDF, 
  onClearSelections 
}) => {
  return (
    <div className="flex gap-2">
      {isAdmin && (
        <Button 
          onClick={onClearSelections}
          variant="destructive"
          className="flex items-center"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Borrar Todas las Selecciones
        </Button>
      )}
      
      <Button 
        onClick={onExportPDF}
        className="bg-aeronautica hover:bg-aeronautica-light"
      >
        <FileText className="mr-2 h-4 w-4" />
        Exportar a PDF
      </Button>
    </div>
  );
};

export default CandidateActions;
