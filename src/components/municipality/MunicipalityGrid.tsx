
import React from 'react';
import MunicipalityCard from './MunicipalityCard';

interface PriorityMunicipality {
  departamento: string;
  municipio: string;
  vacantes: number;
  prioridad: number;
}

interface MunicipalityGridProps {
  municipalities: PriorityMunicipality[];
  aspirantePuesto: number;
  aspirantes: any[];
  onSetPriority: (municipio: string) => void;
}

const MunicipalityGrid: React.FC<MunicipalityGridProps> = ({
  municipalities,
  aspirantePuesto,
  aspirantes,
  onSetPriority
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
      {municipalities.map((plaza) => {
        // Calcular cuántos aspirantes con mejor puesto han seleccionado esta plaza
        const aspirantesConMejorPuesto = aspirantes.filter(
          a => a.plazaDeseada === plaza.municipio && a.puesto < aspirantePuesto
        ).length;
        const disponible = aspirantesConMejorPuesto < plaza.vacantes;
        
        return (
          <MunicipalityCard 
            key={plaza.municipio}
            municipio={plaza.municipio}
            departamento={plaza.departamento}
            vacantes={plaza.vacantes}
            ocupadas={aspirantesConMejorPuesto}
            prioridad={plaza.prioridad}
            disponible={disponible}
            onClick={() => onSetPriority(plaza.municipio)}
          />
        );
      })}
    </div>
  );
};

export default MunicipalityGrid;
