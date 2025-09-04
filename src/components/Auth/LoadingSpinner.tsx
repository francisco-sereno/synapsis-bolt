import React from 'react';
import { Lightbulb } from 'lucide-react';

const LoadingSpinner = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center mx-auto mb-4 animate-pulse">
          <Lightbulb className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Synapsis</h2>
        <div className="flex items-center justify-center space-x-2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
          <p className="text-gray-600">Inicializando plataforma...</p>
        </div>
        <p className="text-sm text-gray-500 mt-2">
          Si esto tarda mucho, verifica la configuración de Supabase
        </p>
      </div>
    </div>
  );
};

export default LoadingSpinner;