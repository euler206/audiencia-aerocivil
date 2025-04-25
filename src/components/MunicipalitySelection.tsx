
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
  const [aspirantePuesto, setAspirantePuesto] = useState(0);
  const [maxPrioridades, setMaxPrioridades] = useState(1);

  useEffect(() => {
    const aspirante = aspirantes.find(a => a.cedula === cedula);
    if (aspirante) {
      setAspirantePuesto(aspirante.puesto);
      // El número de prioridades que puede seleccionar es igual a su puesto
      setMaxPrioridades(aspirante.puesto);
      
      // Inicializar municipios con prioridad
      const municipalitiesWithPriority = plazas.map(plaza => ({
        ...plaza,
        prioridad: 0
      }));

      // Si el aspirante ya tenía una plaza seleccionada, establecer como prioridad 1
      if (aspirante.plazaDeseada) {
        const index = municipalitiesWithPriority.findIndex(m => m.municipio === aspirante.plazaDeseada);
        if (index >= 0) {
          municipalitiesWithPriority[index].prioridad = 1;
        }
      }
      
      setMunicipalitiesWithPriority(municipalitiesWithPriority);
    }
  }, [cedula]);

  const handleSetPriority = (municipio: string) => {
    setMunicipalitiesWithPriority(prev => {
      const existingPriorities = prev.filter(item => item.prioridad > 0).length;
      return prev.map(item => {
        if (item.municipio === municipio) {
          // Si ya tiene una prioridad, resetearla
          if (item.prioridad > 0) {
            return { ...item, prioridad: 0 };
          }
          // Si no tiene prioridad y no hemos alcanzado el límite, asignar la siguiente
          if (existingPriorities < maxPrioridades) {
            return { ...item, prioridad: existingPriorities + 1 };
          }
          // Si alcanzamos el límite, mostrar mensaje
          toast.error(`Solo puede seleccionar ${maxPrioridades} prioridades según su puesto`);
          return item;
        }
        return item;
      });
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
    // Eliminamos la referencia a setNextAvailablePriority que causaba el error
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Selección de Plaza</h2>
        <p className="text-gray-600">
          Seleccione hasta {maxPrioridades} plazas en orden de prioridad. Haga clic en cada municipio para asignar una prioridad.
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
