
import React from 'react';
import { Button } from '@/components/ui/button';
import { Aspirante } from '@/lib';
import { Plaza } from '@/lib/types';
import { TableRow, TableCell } from "@/components/ui/table";

interface CandidateTableRowProps {
  aspirante: Aspirante;
  isAdmin: boolean;
  plazaSeleccionada?: Plaza;
  aspirantesConMismaPlaza: number;
  onSelectVacancy: (cedula: string) => void;
}

const CandidateTableRow: React.FC<CandidateTableRowProps> = ({
  aspirante,
  isAdmin,
  plazaSeleccionada,
  aspirantesConMismaPlaza,
  onSelectVacancy
}) => {
  const plazaLlena = plazaSeleccionada && aspirantesConMismaPlaza >= plazaSeleccionada.vacantes;

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
      <TableCell>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => onSelectVacancy(aspirante.cedula)}
          className="bg-aeronautica text-white hover:bg-aeronautica-light"
        >
          Seleccionar Plaza
        </Button>
      </TableCell>
    </TableRow>
  );
};

export default CandidateTableRow;
