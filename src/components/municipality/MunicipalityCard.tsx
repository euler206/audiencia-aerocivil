
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface MunicipalityCardProps {
  municipio: string;
  departamento: string;
  vacantes: number;
  ocupadas: number;
  prioridad: number;
  disponible: boolean;
  onClick: () => void;
}

const MunicipalityCard: React.FC<MunicipalityCardProps> = ({
  municipio,
  departamento,
  vacantes,
  ocupadas,
  prioridad,
  disponible,
  onClick
}) => {
  return (
    <Card 
      className={`cursor-pointer hover:shadow-md transition-shadow 
        ${prioridad > 0 ? 'border-blue-300' : ''}
        ${!disponible ? 'opacity-50' : ''}
      `}
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="font-medium">{municipio}</div>
        <div className="text-sm text-gray-600">{departamento}</div>
        <div className="text-sm">
          Vacantes: <span className="font-semibold">{vacantes}</span>
        </div>
        <div className="text-sm">
          Ocupadas: <span className="font-semibold">{ocupadas}</span>
        </div>
        {prioridad > 0 && (
          <div className={`mt-2 priority-badge ${
            prioridad === 1 ? 'priority-1' : 
            prioridad === 2 ? 'priority-2' : 'priority-3'
          }`}>
            Prioridad {prioridad}
          </div>
        )}
        {!disponible && (
          <div className="mt-2 text-xs text-red-600 font-medium">
            No disponible para su puesto
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MunicipalityCard;
