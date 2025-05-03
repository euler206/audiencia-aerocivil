
import React, { useMemo } from 'react';
import MunicipalityCard from './MunicipalityCard';
import { PriorityMunicipality } from './types';

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
    console.log("Recalculando mapa de aspirantes por plaza");
    const plazaMap = new Map<string, number>();
    
    // Filtrar primero, para evitar iteraciones innecesarias
    const aspirantesRelevantes = aspirantes.filter(a => 
      a.plazaDeseada && a.puesto < aspirantePuesto
    );
    
    // Luego poblar el mapa con los aspirantes filtrados
    aspirantesRelevantes.forEach(a => {
      const count = plazaMap.get(a.plazaDeseada) || 0;
      plazaMap.set(a.plazaDeseada, count + 1);
    });
      
    return plazaMap;
  }, [aspirantes, aspirantePuesto]);
  
  // Memorizar la lista de municipios procesados para evitar recálculos
  const processedMunicipalities = useMemo(() => {
    console.log("Procesando municipalidades");
    return municipalities.map((plaza) => {
      const aspirantesConMejorPuesto = aspirantesPorPlaza.get(plaza.municipio) || 0;
      const disponible = aspirantesConMejorPuesto < plaza.vacantes;
      
      return {
        ...plaza,
        ocupadas: aspirantesConMejorPuesto,
        disponible
      };
    });
  }, [municipalities, aspirantesPorPlaza]);
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
      {processedMunicipalities.map((plaza) => (
        <MemoizedMunicipalityCard 
          key={plaza.municipio}
          municipio={plaza.municipio}
          departamento={plaza.departamento}
          vacantes={plaza.vacantes}
          ocupadas={plaza.ocupadas}
          prioridad={plaza.prioridad}
          disponible={plaza.disponible}
          onClick={() => onSetPriority(plaza.municipio)}
        />
      ))}
    </div>
  );
};

// Componente memorizado para evitar renderizados innecesarios
const MemoizedMunicipalityCard = React.memo(MunicipalityCard, 
  (prevProps, nextProps) => {
    // Solo renderizar si cambian propiedades relevantes
    return prevProps.prioridad === nextProps.prioridad && 
           prevProps.disponible === nextProps.disponible &&
           prevProps.ocupadas === nextProps.ocupadas;
  }
);

export default React.memo(MunicipalityGrid);
