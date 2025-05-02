
import React from 'react';

const PriorityLegend: React.FC = () => {
  return (
    <div className="mb-6 flex flex-wrap items-center gap-2">
      <div className="mr-2 text-gray-700">Leyenda de prioridades:</div>
      <span className="priority-badge priority-1">Prioridad 1</span>
      <span className="priority-badge priority-2">Prioridad 2</span>
      <span className="priority-badge priority-3">Prioridad 3</span>
      <span className="priority-badge priority-default">Sin prioridad</span>
    </div>
  );
};

export default PriorityLegend;
