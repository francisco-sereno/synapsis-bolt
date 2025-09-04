import React from 'react';

const SystemSettings = () => {
  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Configuración del Sistema</h1>
        <p className="text-gray-600">Ajusta las configuraciones generales de la aplicación.</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Funcionalidad en desarrollo</h2>
        <p className="text-gray-600">
          El módulo para la configuración del sistema estará disponible próximamente.
        </p>
      </div>
    </div>
  );
};

export default SystemSettings;