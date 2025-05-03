
import React, { useMemo } from 'react';
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
  // Crear un mapa para calcular rápidamente los aspirantes por plaza
  const aspirantesPorPlaza = useMemo(() => {
    const plazaMap = new Map<string, number>();
    
    // Solo procesar los aspirantes relevantes (con mejor puesto)
    aspirantes
      .filter(a => a.plazaDeseada && a.puesto < aspirantePuesto)
      .forEach(a => {
        const count = plazaMap.get(a.plazaDeseada) || 0;
        plazaMap.set(a.plazaDeseada, count + 1);
      });
      
    return plazaMap;
  }, [aspirantes, aspirantePuesto]);
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
      {municipalities.map((plaza) => {
        // Usar el mapa para obtener aspirantes con mejor puesto
        const aspirantesConMejorPuesto = aspirantesPorPlaza.get(plaza.municipio) || 0;
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

export default React.memo(MunicipalityGrid);
