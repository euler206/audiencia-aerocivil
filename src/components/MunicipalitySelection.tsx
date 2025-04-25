import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { plazas, aspirantes, updatePlazaDeseada, getAvailablePlazaByPriority } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';

interface PriorityMunicipality {
  departamento: string;
  municipio: string;
  vacantes: number;
  prioridad: number;
}

const MunicipalitySelection: React.FC = () => {
  const { cedula } = useParams<{ cedula: string }>();
  const navigate = useNavigate();
  const [municipalitiesWithPriority, setMunicipalitiesWithPriority] = useState<PriorityMunicipality[]>([]);
  const [nextAvailablePriority, setNextAvailablePriority] = useState(1);
  const [aspirantePuesto, setAspirantePuesto] = useState(0);

  useEffect(() => {
    // Find aspirante puesto
    const aspirante = aspirantes.find(a => a.cedula === cedula);
    if (aspirante) {
      setAspirantePuesto(aspirante.puesto);
    }
    
    // Initialize municipalities with priority
    const municipalitiesWithPriority = plazas.map(plaza => ({
      ...plaza,
      prioridad: 0
    }));
    
    setMunicipalitiesWithPriority(municipalitiesWithPriority);
  }, [cedula]);

  const handleSetPriority = (municipio: string) => {
    setMunicipalitiesWithPriority(prev => {
      return prev.map(item => {
        if (item.municipio === municipio) {
          // If already has a priority, reset it
          if (item.prioridad > 0) {
            return { ...item, prioridad: 0 };
          }
          // Otherwise, set the next available priority
          return { ...item, prioridad: nextAvailablePriority };
        }
        return item;
      });
    });
    
    // Increment the next available priority
    setNextAvailablePriority(prev => {
      const updatedMunicipalities = municipalitiesWithPriority.map(item => {
        if (item.municipio === municipio) {
          return item.prioridad > 0 ? { ...item, prioridad: 0 } : { ...item, prioridad: prev };
        }
        return item;
      });
      
      // Count existing priorities to determine the next one
      const priorities = updatedMunicipalities
        .map(item => item.prioridad)
        .filter(p => p > 0);
      
      return priorities.length + 1;
    });
  };

  const handleSaveSelection = () => {
    // Get priorities
    const priorities = municipalitiesWithPriority
      .filter(item => item.prioridad > 0)
      .map(item => ({ municipio: item.municipio, prioridad: item.prioridad }));
    
    if (priorities.length === 0) {
      toast.error('Debe seleccionar al menos una plaza');
      return;
    }
    
    // Get available plaza based on priority
    const selectedPlaza = getAvailablePlazaByPriority(priorities, aspirantePuesto);
    
    if (!selectedPlaza) {
      toast.error('No hay plazas disponibles según sus prioridades');
      return;
    }
    
    // Update aspirante's plaza deseada
    if (cedula) {
      const success = updatePlazaDeseada(cedula, selectedPlaza);
      
      if (success) {
        toast.success(`Plaza asignada: ${selectedPlaza}`);
        navigate('/dashboard');
      } else {
        toast.error('Error al asignar la plaza');
      }
    }
  };

  const handleReset = () => {
    setMunicipalitiesWithPriority(prev => 
      prev.map(item => ({ ...item, prioridad: 0 }))
    );
    setNextAvailablePriority(1);
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Selección de Plaza</h2>
        <p className="text-gray-600">
          Seleccione las plazas en orden de prioridad. Haga clic en cada municipio para asignar una prioridad.
        </p>
      </div>
      
      <div className="mb-6 flex flex-wrap items-center gap-2">
        <div className="mr-2 text-gray-700">Leyenda de prioridades:</div>
        <span className="priority-badge priority-1">Prioridad 1</span>
        <span className="priority-badge priority-2">Prioridad 2</span>
        <span className="priority-badge priority-3">Prioridad 3</span>
        <span className="priority-badge priority-default">Sin prioridad</span>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
        {municipalitiesWithPriority.map((plaza) => (
          <Card 
            key={plaza.municipio} 
            className={`cursor-pointer hover:shadow-md transition-shadow ${plaza.prioridad > 0 ? 'border-blue-300' : ''}`}
            onClick={() => handleSetPriority(plaza.municipio)}
          >
            <CardContent className="p-4">
              <div className="font-medium">{plaza.municipio}</div>
              <div className="text-sm text-gray-600">{plaza.departamento}</div>
              <div className="text-sm">Vacantes: <span className="font-semibold">{plaza.vacantes}</span></div>
              {plaza.prioridad > 0 && (
                <div className={`mt-2 priority-badge ${plaza.prioridad === 1 ? 'priority-1' : plaza.prioridad === 2 ? 'priority-2' : 'priority-3'}`}>
                  Prioridad {plaza.prioridad}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="flex justify-end space-x-4">
        <Button variant="outline" onClick={handleReset}>
          Reiniciar selección
        </Button>
        <Button 
          className="bg-aeronautica hover:bg-aeronautica-light" 
          onClick={handleSaveSelection}
        >
          Guardar selección
        </Button>
      </div>
    </div>
  );
};

export default MunicipalitySelection;
