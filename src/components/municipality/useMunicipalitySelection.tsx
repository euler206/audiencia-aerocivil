
import { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  plazas, 
  aspirantes, 
  getAvailablePlazaByPriority 
} from '@/lib';
import { updatePlazaDeseada } from '@/lib/vacancies';
import { toast } from 'sonner';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface PriorityMunicipality {
  departamento: string;
  municipio: string;
  vacantes: number;
  prioridad: number;
}

export const useMunicipalitySelection = () => {
  const { cedula } = useParams<{ cedula: string }>();
  const { verifyIdentity } = useAuth();
  const navigate = useNavigate();
  const [municipalitiesWithPriority, setMunicipalitiesWithPriority] = useState<PriorityMunicipality[]>([]);
  const [aspirantePuesto, setAspirantePuesto] = useState(0);
  const [maxPrioridades, setMaxPrioridades] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
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
            }));
            
            setMunicipalitiesWithPriority(updatedMunicipalities);
          } 
          else if (aspirante.plazaDeseada) {
            const updatedMunicipalities = initialMunicipalities.map(m => ({
              ...m,
              prioridad: m.municipio === aspirante.plazaDeseada ? 1 : 0
            }));
            
            setMunicipalitiesWithPriority(updatedMunicipalities);
          }
          else {
            setMunicipalitiesWithPriority(initialMunicipalities);
          }
        }
      } catch (error) {
        console.error("Error al cargar datos:", error);
        toast.error("Error al cargar datos de prioridades");
        
        // Establecer un estado básico en caso de error
        const initialMunicipalities = plazas.map(plaza => ({
          ...plaza,
          prioridad: 0
        }));
        
        setMunicipalitiesWithPriority(initialMunicipalities);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, [cedula, verifyIdentity]);

  // Memoizar la función para evitar recreaciones en cada renderizado
  const handleSetPriority = useCallback((municipio: string) => {
    setMunicipalitiesWithPriority(prev => {
      // Copiar el estado previo para modificarlo
      const newState = [...prev];
      const itemIndex = newState.findIndex(item => item.municipio === municipio);
      
      if (itemIndex === -1) return prev;
      
      const item = newState[itemIndex];
      
      // Si ya tiene prioridad, quitársela
      if (item.prioridad > 0) {
        // Al quitar una prioridad, debemos reajustar todas las prioridades
        const oldPriority = item.prioridad;
        item.prioridad = 0;
        
        // Reajustar todas las prioridades mayores que la que quitamos
        newState.forEach(m => {
          if (m.prioridad > oldPriority) {
            m.prioridad -= 1;
          }
        });
        return newState;
      }
      
      // Si no tiene prioridad, verificar si podemos asignar una nueva
      const existingPriorities = newState.filter(item => item.prioridad > 0).length;
      
      if (existingPriorities < maxPrioridades) {
        // Asignarle la siguiente prioridad disponible
        item.prioridad = existingPriorities + 1;
        return newState;
      }
      
      // Si ya alcanzamos el máximo de prioridades, mostrar mensaje
      toast.error(`Solo puede seleccionar ${maxPrioridades} prioridades según su puesto`);
      return prev;
    });
  }, [maxPrioridades]);

  // Optimizar el guardado de selección para evitar congelamientos
  const handleSaveSelection = useCallback(async () => {
    if (!cedula) {
      toast.error("No se ha identificado al aspirante");
      return;
    }
    
    setIsSaving(true);
    
    try {
      const priorities = municipalitiesWithPriority
        .filter(item => item.prioridad > 0)
        .map(item => ({ municipio: item.municipio, prioridad: item.prioridad }));
      
      if (priorities.length === 0) {
        toast.error('Debe seleccionar al menos una plaza');
        return;
      }
      
      console.log(`Guardando selección de ${priorities.length} prioridades para aspirante ${cedula}`);
      
      // 1. Guardar en localStorage como fallback (operación rápida)
      localStorage.setItem(`prioridades_${cedula}`, JSON.stringify(priorities));
      
      // 2. Preparar objeto para guardar en Supabase
      const prioridadesSupabase = priorities.map(p => ({
        aspirante_id: cedula,
        municipio: p.municipio,
        prioridad: p.prioridad
      }));
      
      // 3. Eliminar prioridades existentes
      const { error: deleteError } = await supabase
        .from('prioridades')
        .delete()
        .eq('aspirante_id', cedula);
      
      if (deleteError) {
        console.error("Error al eliminar prioridades existentes:", deleteError);
        toast.error("Error al eliminar prioridades existentes");
        return;
      }
      
      // 4. Insertar nuevas prioridades
      const { error: insertError } = await supabase
        .from('prioridades')
        .insert(prioridadesSupabase);
      
      if (insertError) {
        console.error("Error al guardar prioridades en Supabase:", insertError);
        toast.error("Error al guardar prioridades en la base de datos");
        return;
      }
      
      // 5. Calcular plaza disponible (usando función optimizada)
      const selectedPlaza = getAvailablePlazaByPriority(priorities, aspirantePuesto);
      
      if (!selectedPlaza) {
        toast.error('No hay plazas disponibles según sus prioridades');
        return;
      }
      
      // 6. Actualizar plaza deseada (operación optimizada)
      const success = await updatePlazaDeseada(cedula, selectedPlaza);
      
      if (success) {
        toast.success(`Plaza asignada: ${selectedPlaza}`);
        navigate('/dashboard');
      } else {
        toast.error('Error al asignar la plaza');
      }
      
    } catch (error) {
      console.error("Error en el proceso de guardado:", error);
      toast.error("Error al guardar la selección");
    } finally {
      setIsSaving(false);
    }
  }, [municipalitiesWithPriority, aspirantePuesto, cedula, navigate]);

  // Función para restablecer todas las prioridades
  const handleReset = useCallback(() => {
    setMunicipalitiesWithPriority(prev => 
      prev.map(item => ({ ...item, prioridad: 0 }))
    );
    
    toast.info("Se han reiniciado todas las prioridades");
  }, []);

  // Optimizar la generación de PDF para evitar bloqueos
  const exportToPDF = useCallback(() => {
    try {
      console.log("Iniciando generación de PDF de selección de plazas...");
      
      if (!cedula) {
        toast.error("No se encuentra información del aspirante");
        return;
      }
      
      const aspirante = aspirantes.find(a => a.cedula === cedula);
      if (!aspirante) {
        toast.error("No se encuentra información del aspirante");
        return;
      }
      
      // Usamos Promise.resolve().then para evitar bloqueo de la UI
      Promise.resolve().then(() => {
        const doc = new jsPDF();
        
        doc.setFontSize(18);
        doc.text('Selección de Plazas', 14, 22);
        
        doc.setFontSize(11);
        doc.text(`Aspirante: ${aspirante.nombre}`, 14, 30);
        doc.text(`Cédula: ${aspirante.cedula}`, 14, 36);
        doc.text(`Puesto: ${aspirante.puesto}`, 14, 42);
        doc.text(`Fecha de selección: ${new Date().toLocaleDateString()}`, 14, 48);
        
        const prioridadesSeleccionadas = municipalitiesWithPriority
          .filter(item => item.prioridad > 0)
          .sort((a, b) => a.prioridad - b.prioridad);
        
        const tableColumn = ['Prioridad', 'Municipio', 'Departamento', 'Vacantes'];
        const tableRows = prioridadesSeleccionadas.map(item => [
          item.prioridad,
          item.municipio,
          item.departamento,
          item.vacantes
        ]);
        
        autoTable(doc, {
          head: [tableColumn],
          body: tableRows,
          startY: 55,
          theme: 'striped',
          styles: { fontSize: 10, cellPadding: 3 },
          headStyles: { fillColor: [0, 48, 87], textColor: [255, 255, 255] }
        });
        
        if (aspirante.plazaDeseada) {
          const lastY = (doc as any).lastAutoTable.finalY || 60;
          doc.text(`Plaza actualmente asignada: ${aspirante.plazaDeseada}`, 14, lastY + 10);
        }
        
        // Abrir PDF en una nueva ventana en lugar de descargarlo
        const pdfBlob = doc.output('blob');
        const pdfUrl = URL.createObjectURL(pdfBlob);
        window.open(pdfUrl, '_blank');
        
        toast.success("El PDF se ha abierto en una nueva ventana");
      });
      
    } catch (error) {
      console.error("Error al generar el PDF:", error);
      const errorMessage = error instanceof Error ? error.message : "Error desconocido";
      toast.error(`Error al generar el PDF: ${errorMessage}`);
    }
  }, [cedula, municipalitiesWithPriority]);

  return {
    municipalitiesWithPriority,
    aspirantePuesto,
    maxPrioridades,
    isLoading,
    isSaving,
    handleSetPriority,
    handleSaveSelection,
    handleReset,
    exportToPDF
  };
};
