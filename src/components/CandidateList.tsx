import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Aspirante, aspirantes, loadFromLocalStorage, plazas } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

const CandidateList: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [search, setSearch] = useState('');
  const [displayedAspirantes, setDisplayedAspirantes] = useState<Aspirante[]>([...aspirantes]);

  useEffect(() => {
    loadFromLocalStorage();
    setDisplayedAspirantes([...aspirantes]);
  }, []);

  const handleSelectVacancy = (cedula: string) => {
    const aspirante = aspirantes.find(a => a.cedula === cedula);
    if (!aspirante) return;

    // Contar cuántos aspirantes han seleccionado cada plaza
    const plazasSeleccionadas = aspirantes.reduce((acc, curr) => {
      if (curr.plazaDeseada && curr.cedula !== cedula) { // Excluimos al aspirante actual
        acc[curr.plazaDeseada] = (acc[curr.plazaDeseada] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);

    // Verificar si alguna plaza ha alcanzado su límite
    const plazasLlenas = plazas.filter(plaza => {
      const seleccionadas = plazasSeleccionadas[plaza.municipio] || 0;
      return seleccionadas >= plaza.vacantes;
    });

    if (plazasLlenas.length > 0) {
      toast({
        title: "Algunas plazas están llenas",
        description: "Las siguientes plazas ya no tienen cupos disponibles: " + 
                    plazasLlenas.map(plaza => plaza.municipio).join(", "),
        variant: "destructive"
      });
    }

    navigate(`/select-vacancy/${cedula}`);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchTerm = e.target.value.toLowerCase();
    setSearch(searchTerm);
    
    if (searchTerm.trim() === '') {
      setDisplayedAspirantes([...aspirantes]);
    } else {
      const filtered = aspirantes.filter(
        (aspirante) =>
          aspirante.nombre.toLowerCase().includes(searchTerm) ||
          aspirante.cedula.includes(searchTerm) ||
          (aspirante.plazaDeseada && aspirante.plazaDeseada.toLowerCase().includes(searchTerm))
      );
      
      setDisplayedAspirantes(filtered);
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Lista de Aspirantes</h2>
        <p className="text-gray-600">
          Listado de aspirantes de la convocatoria OPEC 209961 de la AERONAUTICA CIVIL
        </p>
      </div>
      
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
        <Input
          type="text"
          placeholder="Buscar por nombre, cédula o plaza deseada..."
          value={search}
          onChange={handleSearchChange}
          className="pl-10"
        />
      </div>
      
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full table-auto">
          <thead>
            <tr>
              <th className="table-header">Puesto</th>
              <th className="table-header">Puntaje</th>
              <th className="table-header">Cédula</th>
              <th className="table-header">Nombre</th>
              <th className="table-header">Plaza Deseada</th>
              <th className="table-header">Acción</th>
            </tr>
          </thead>
          <tbody>
            {displayedAspirantes.map((aspirante) => {
              const plazaSeleccionada = plazas.find(p => p.municipio === aspirante.plazaDeseada);
              const aspirantesConMismaPlaza = aspirantes.filter(
                a => a.plazaDeseada === aspirante.plazaDeseada && a.cedula !== aspirante.cedula
              ).length;
              const plazaLlena = plazaSeleccionada && aspirantesConMismaPlaza >= plazaSeleccionada.vacantes;

              return (
                <tr key={aspirante.cedula} className="table-row">
                  <td className="table-cell">{aspirante.puesto}</td>
                  <td className="table-cell">{aspirante.puntaje}</td>
                  <td className="table-cell">{aspirante.cedula}</td>
                  <td className="table-cell">{aspirante.nombre}</td>
                  <td className="table-cell">
                    {aspirante.plazaDeseada ? (
                      <span className={plazaLlena ? "text-red-600" : "text-green-600"}>
                        {aspirante.plazaDeseada}
                      </span>
                    ) : (
                      <span className="text-gray-400">No seleccionada</span>
                    )}
                  </td>
                  <td className="table-cell">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleSelectVacancy(aspirante.cedula)}
                      className="bg-aeronautica text-white hover:bg-aeronautica-light"
                    >
                      Seleccionar Plaza
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CandidateList;
