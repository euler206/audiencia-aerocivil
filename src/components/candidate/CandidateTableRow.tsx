
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Aspirante } from '@/lib';
import { Plaza } from '@/lib/types';
import { TableRow, TableCell } from "@/components/ui/table";
import PositionChangeDialog from './PositionChangeDialog';
import { useAuth } from '@/contexts/AuthContext';

interface CandidateTableRowProps {
  aspirante: Aspirante;
  isAdmin: boolean;
  plazaSeleccionada?: Plaza;
  aspirantesConMismaPlaza: number;
  onSelectVacancy: (cedula: string) => void;
  onPositionChange?: (cedula: string, nuevoPuesto: number) => Promise<void>;
}

const CandidateTableRow: React.FC<CandidateTableRowProps> = ({
  aspirante,
  isAdmin,
  plazaSeleccionada,
  aspirantesConMismaPlaza,
  onSelectVacancy,
  onPositionChange
}) => {
  const [isPositionDialogOpen, setIsPositionDialogOpen] = useState(false);
  const plazaLlena = plazaSeleccionada && aspirantesConMismaPlaza >= plazaSeleccionada.vacantes;
  const { currentUser, cedula } = useAuth();
  
  // Verificar si el botón de selección de plaza debe estar habilitado
  const isSelectButtonEnabled = isAdmin || (cedula === aspirante.cedula);

  return (
    <TableRow>
      <TableCell>{aspirante.puesto}</TableCell>
      <TableCell>{aspirante.puntaje}</TableCell>
      {isAdmin && <TableCell>{aspirante.cedula}</TableCell>}
      <TableCell>{aspirante.nombre}</TableCell>
      <TableCell>
        {aspirante.plazaDeseada ? (
          <span className={plazaLlena ? "text-red-600" : "text-green-600"}>
            {aspirante.plazaDeseada}
          </span>
        ) : (
          <span className="text-gray-400">No seleccionada</span>
        )}
      </TableCell>
      <TableCell className="space-x-2">
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => onSelectVacancy(aspirante.cedula)}
          className={isSelectButtonEnabled 
            ? "bg-aeronautica text-white hover:bg-aeronautica-light" 
            : "bg-gray-300 text-gray-600 hover:bg-gray-300 cursor-not-allowed"}
          disabled={!isSelectButtonEnabled}
        >
          Seleccionar Plaza
        </Button>
        
        {isAdmin && onPositionChange && (
          <>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setIsPositionDialogOpen(true)}
              className="border-amber-600 text-amber-600 hover:bg-amber-50"
            >
              Cambiar Puesto
            </Button>
            
            <PositionChangeDialog 
              aspirante={aspirante}
              isOpen={isPositionDialogOpen}
              onOpenChange={setIsPositionDialogOpen}
              onPositionChange={onPositionChange}
            />
          </>
        )}
      </TableCell>
    </TableRow>
  );
};

export default CandidateTableRow;
