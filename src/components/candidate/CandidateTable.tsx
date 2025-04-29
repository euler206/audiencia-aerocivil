
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
}

const CandidateTable: React.FC<CandidateTableProps> = ({
  aspirantes,
  isAdmin,
  onSelectVacancy
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
        <TableHeader>
          <TableRow>
            <TableHead>Puesto</TableHead>
            <TableHead>Puntaje</TableHead>
            {isAdmin && <TableHead>Cédula</TableHead>}
            <TableHead>Nombre</TableHead>
            <TableHead>Plaza Deseada</TableHead>
            <TableHead>Acción</TableHead>
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
              />
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default CandidateTable;
