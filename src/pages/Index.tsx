
import React from 'react';
import LoginForm from '@/components/LoginForm';

const Index: React.FC = () => {
  return (
    <div className="min-h-screen bg-blue-50 flex flex-col">
      <div className="flex-1 flex items-center justify-center">
        <LoginForm />
      </div>
      
      <footer className="py-4 bg-aeronautica text-white text-center text-sm">
        <p>AUDIENCIA PÚBLICA - AERONAUTICA CIVIL - OPEC 209961</p>
      </footer>
    </div>
  );
};

export default Index;
