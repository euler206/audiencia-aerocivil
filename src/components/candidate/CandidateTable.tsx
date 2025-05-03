
import React from 'react';
import { Aspirante } from '@/lib';
import { plazas } from '@/lib/plazas';
import CandidateTableRow from './CandidateTableRow';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell
} from "@/components/ui/table";

interface CandidateTableProps {
  aspirantes: Aspirante[];
  isAdmin: boolean;
  onSelectVacancy: (cedula: string) => void;
  onPositionChange?: (cedula: string, nuevoPuesto: number) => Promise<void>;
}

const CandidateTable: React.FC<CandidateTableProps> = ({
  aspirantes,
  isAdmin,
  onSelectVacancy,
  onPositionChange
}) => {
  // Crear un mapa para contar cuántos aspirantes han seleccionado cada plaza
  const plazasSeleccionadasCount: Record<string, number> = {};
  aspirantes.forEach(aspirante => {
    if (aspirante.plazaDeseada) {
      plazasSeleccionadasCount[aspirante.plazaDeseada] = 
        (plazasSeleccionadasCount[aspirante.plazaDeseada] || 0) + 1;
    }
  });

  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow">
      <Table>
        <TableHeader className="bg-aeronautica">
          <TableRow>
            <TableHead className="text-white font-semibold">Puesto</TableHead>
            <TableHead className="text-white font-semibold">Puntaje</TableHead>
            {isAdmin && <TableHead className="text-white font-semibold">Cédula</TableHead>}
            <TableHead className="text-white font-semibold">Nombre</TableHead>
            <TableHead className="text-white font-semibold">Plaza Deseada</TableHead>
            <TableHead className="text-white font-semibold">Acción</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {aspirantes.map((aspirante) => {
            const plazaSeleccionada = plazas.find(p => p.municipio === aspirante.plazaDeseada);
            const aspirantesConMismaPlaza = plazasSeleccionadasCount[aspirante.plazaDeseada] || 0;

            return (
              <CandidateTableRow
                key={aspirante.cedula}
                aspirante={aspirante}
                isAdmin={isAdmin}
                plazaSeleccionada={plazaSeleccionada}
                aspirantesConMismaPlaza={aspirantesConMismaPlaza}
                onSelectVacancy={onSelectVacancy}
                onPositionChange={onPositionChange}
              />
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default CandidateTable;
