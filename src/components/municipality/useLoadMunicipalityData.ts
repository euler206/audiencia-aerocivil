
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { plazas, aspirantes } from '@/lib';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { PriorityMunicipality } from './types';

export const useLoadMunicipalityData = () => {
  const { cedula } = useParams<{ cedula: string }>();
  const { verifyIdentity } = useAuth();
  const navigate = useNavigate();
  const [municipalitiesWithPriority, setMunicipalitiesWithPriority] = useState<PriorityMunicipality[]>([]);
  const [aspirantePuesto, setAspirantePuesto] = useState(0);
  const [maxPrioridades, setMaxPrioridades] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  
  // Verificar que el usuario tenga acceso a esta página
  useEffect(() => {
    if (cedula && !verifyIdentity(cedula)) {
      toast.error("No tienes permiso para acceder a esta página");
      navigate('/dashboard');
    }
  }, [cedula, navigate, verifyIdentity]);

  // Cargar datos iniciales de forma optimizada
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      
      try {
        // Buscar aspirante por cédula (optimizado con find)
        const aspirante = aspirantes.find(a => a.cedula === cedula);
        
        if (!aspirante) {
          console.error(`No se encontró aspirante con cédula ${cedula}`);
          setIsLoading(false);
          return;
        }
        
        setAspirantePuesto(aspirante.puesto);
        setMaxPrioridades(aspirante.puesto);
        console.log(`Aspirante ${cedula} en puesto ${aspirante.puesto}, puede seleccionar ${aspirante.puesto} prioridades`);
        
        // Crearemos un mapa inicial para todos los municipios
        const initialMunicipalities = plazas.map(plaza => ({
          ...plaza,
          prioridad: 0
        }));
        
        // Cargar prioridades desde Supabase con manejo de errores mejorado
        const { data: prioridadesData, error } = await supabase
          .from('prioridades')
          .select('*')
          .eq('aspirante_id', cedula);
        
        if (!error && prioridadesData && prioridadesData.length > 0) {
          console.log("Prioridades cargadas desde Supabase:", prioridadesData);
          
          // Usar un mapa para actualizar prioridades de forma más eficiente
          const prioridadesMap = new Map(
            prioridadesData.map(p => [p.municipio, p.prioridad])
          );
          
          const updatedMunicipalities = initialMunicipalities.map(m => ({
            ...m,
            prioridad: prioridadesMap.get(m.municipio) || 0
          })) as PriorityMunicipality[];
          
          setMunicipalitiesWithPriority(updatedMunicipalities);
        } 
        else {
          console.log("No se encontraron prioridades en Supabase, buscando en localStorage");
          
          // Fallback a localStorage
          const prioridadesString = localStorage.getItem(`prioridades_${cedula}`);
          
          if (prioridadesString) {
            const prioridades = JSON.parse(prioridadesString);
            
            // Usar un mapa para la actualización
            const prioridadesMap = new Map(
              prioridades.map((p: { municipio: string, prioridad: number }) => [p.municipio, p.prioridad])
            );
            
            const updatedMunicipalities = initialMunicipalities.map(m => ({
              ...m,
              prioridad: Number(prioridadesMap.get(m.municipio)) || 0
            })) as PriorityMunicipality[];
            
            setMunicipalitiesWithPriority(updatedMunicipalities);
          } 
          else if (aspirante.plazaDeseada) {
            const updatedMunicipalities = initialMunicipalities.map(m => ({
              ...m,
              prioridad: m.municipio === aspirante.plazaDeseada ? 1 : 0
            })) as PriorityMunicipality[];
            
            setMunicipalitiesWithPriority(updatedMunicipalities);
          }
          else {
            setMunicipalitiesWithPriority(initialMunicipalities as PriorityMunicipality[]);
          }
        }
      } catch (error) {
        console.error("Error al cargar datos:", error);
        toast.error("Error al cargar datos de prioridades");
        
        // Establecer un estado básico en caso de error
        const initialMunicipalities = plazas.map(plaza => ({
          ...plaza,
          prioridad: 0
        })) as PriorityMunicipality[];
        
        setMunicipalitiesWithPriority(initialMunicipalities);
      } finally {
        setIsLoading(false);
      }
    };
    
    if (cedula) {
      loadData();
    }
  }, [cedula, verifyIdentity]);

  return {
    municipalitiesWithPriority,
    setMunicipalitiesWithPriority,
    aspirantePuesto,
    maxPrioridades,
    isLoading,
    cedula
  };
};
