
import React from 'react';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

interface CandidateSearchProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const CandidateSearch: React.FC<CandidateSearchProps> = ({ value, onChange }) => {
  return (
    <div className="relative w-full sm:w-64">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
      <Input
        type="text"
        placeholder="Buscar por nombre, cédula o plaza..."
        value={value}
        onChange={onChange}
        className="pl-10"
      />
    </div>
  );
};

export default CandidateSearch;
