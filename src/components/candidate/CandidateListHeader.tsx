
import React from 'react';

interface CandidateListHeaderProps {
  title: string;
  subtitle?: string;
}

const CandidateListHeader: React.FC<CandidateListHeaderProps> = ({ title, subtitle }) => {
  return (
    <div className="mb-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-2">{title}</h2>
      {subtitle && <p className="text-gray-600">{subtitle}</p>}
    </div>
  );
};

export default CandidateListHeader;
