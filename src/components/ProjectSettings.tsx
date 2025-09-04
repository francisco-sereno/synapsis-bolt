import React, { useState } from 'react';
import { Settings, Trash2, Users, Lock, AlertTriangle, Save, Copy, Download } from 'lucide-react';

const ProjectSettings = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [projectData, setProjectData] = useState({
    name: 'Estudio de Efectividad Pedagógica',
    description: 'Investigación sobre la efectividad de modalidades híbridas en educación superior',
    institution: 'Universidad Nacional de Investigación',
    startDate: '2024-01-01',
    endDate: '2024-06-30',
    status: 'Activo',
    visibility: 'private',
    ethicsApproval: 'CEI-2024-001',
    principalInvestigator: 'Dr. Rodriguez'
  });

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const tabs = [
    { id: 'general', label: 'General', icon: Settings },
    { id: 'team', label: 'Equipo', icon: Users },
    { id: 'privacy', label: 'Privacidad', icon: Lock },
    { id: 'danger', label: 'Zona de Peligro', icon: AlertTriangle }
  ];

  const handleSave = () => {
    // Simulate save
    console.log('Guardando configuración del proyecto:', projectData);
  };

  const handleDeleteProject = () => {
    // Simulate project deletion
    console.log('Eliminando proyecto...');
    setShowDeleteModal(false);
  };

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Configuración del Proyecto</h1>
        <p className="text-gray-600">Gestiona la información y configuración de tu proyecto de investigación</p>
      </div>

      {/* Project Info Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center">
              <Settings className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">{projectData.name}</h2>
              <p className="text-gray-600 mt-1">{projectData.description}</p>
              <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                <span>ID: PROJ-2024-001</span>
                <span>Creado: 1 enero 2024</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  projectData.status === 'Activo' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                }`}>
                  {projectData.status}
                </span>
              </div>
            </div>
          </div>
          
          <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
            <Copy className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6" aria-label="Tabs">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-5 h-5 mr-2" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'general' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nombre del Proyecto
                    </label>
                    <input
                      type="text"
                      value={projectData.name}
                      onChange={(e) => setProjectData({...projectData, name: e.target.value})}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Institución
                    </label>
                    <input
                      type="text"
                      value={projectData.institution}
                      onChange={(e) => setProjectData({...projectData, institution: e.target.value})}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Investigador Principal
                    </label>
                    <input
                      type="text"
                      value={projectData.principalInvestigator}
                      onChange={(e) => setProjectData({...projectData, principalInvestigator: e.target.value})}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Código de Aprobación Ética
                    </label>
                    <input
                      type="text"
                      value={projectData.ethicsApproval}
                      onChange={(e) => setProjectData({...projectData, ethicsApproval: e.target.value})}
                      placeholder="Ej: CEI-2024-001"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Descripción
                    </label>
                    <textarea
                      value={projectData.description}
                      onChange={(e) => setProjectData({...projectData, description: e.target.value})}
                      rows={4}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Fecha de Inicio
                      </label>
                      <input
                        type="date"
                        value={projectData.startDate}
                        onChange={(e) => setProjectData({...projectData, startDate: e.target.value})}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Fecha de Finalización
                      </label>
                      <input
                        type="date"
                        value={projectData.endDate}
                        onChange={(e) => setProjectData({...projectData, endDate: e.target.value})}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Estado del Proyecto
                    </label>
                    <select
                      value={projectData.status}
                      onChange={(e) => setProjectData({...projectData, status: e.target.value})}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="Planificación">Planificación</option>
                      <option value="Activo">Activo</option>
                      <option value="Recolección">Recolección de Datos</option>
                      <option value="Análisis">Análisis</option>
                      <option value="Completado">Completado</option>
                      <option value="Pausado">Pausado</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
                >
                    <Save className="w-4 h-4" />
                  <span>Guardar Cambios</span>
                </button>
              </div>
            </div>
          )}

          {activeTab === 'privacy' && (
            <div className="space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-medium text-blue-900 mb-2">Configuración de Privacidad</h3>
                <p className="text-sm text-blue-700">
                  Controla quién puede acceder a tu proyecto y cómo se comparten los datos
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Visibilidad del Proyecto</h3>
                  
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <input 
                        type="radio" 
                        name="visibility" 
                        value="private" 
                        checked={projectData.visibility === 'private'}
                        onChange={(e) => setProjectData({...projectData, visibility: e.target.value})}
                        className="text-blue-600" 
                      />
                      <div>
                        <h4 className="font-medium text-gray-900">Privado</h4>
                        <p className="text-sm text-gray-600">Solo miembros invitados pueden acceder</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <input 
                        type="radio" 
                        name="visibility" 
                        value="institutional" 
                        checked={projectData.visibility === 'institutional'}
                        onChange={(e) => setProjectData({...projectData, visibility: e.target.value})}
                        className="text-blue-600" 
                      />
                      <div>
                        <h4 className="font-medium text-gray-900">Institucional</h4>
                        <p className="text-sm text-gray-600">Visible para miembros de la institución</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <input 
                        type="radio" 
                        name="visibility" 
                        value="public" 
                        checked={projectData.visibility === 'public'}
                        onChange={(e) => setProjectData({...projectData, visibility: e.target.value})}
                        className="text-blue-600" 
                      />
                      <div>
                        <h4 className="font-medium text-gray-900">Público</h4>
                        <p className="text-sm text-gray-600">Visible para cualquier usuario registrado</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Configuración de Datos</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900">Anonimización Automática</h4>
                        <p className="text-sm text-gray-600">Remueve automáticamente datos personales</p>
                      </div>
                      <input type="checkbox" className="rounded" defaultChecked />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900">Backup Automático</h4>
                        <p className="text-sm text-gray-600">Respaldo diario de todos los datos</p>
                      </div>
                      <input type="checkbox" className="rounded" defaultChecked />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900">Retención de Datos</h4>
                        <p className="text-sm text-gray-600">Tiempo de conservación después del proyecto</p>
                      </div>
                      <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm">
                        <option value="1">1 año</option>
                        <option value="3">3 años</option>
                        <option value="5" selected>5 años</option>
                        <option value="10">10 años</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'danger' && (
            <div className="space-y-6">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-red-900">Zona de Peligro</h3>
                    <p className="text-sm text-red-700 mt-1">
                      Las acciones en esta sección son irreversibles y pueden resultar en pérdida de datos
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-white border border-red-200 rounded-lg p-6">
                  <h3 className="font-semibold text-gray-900 mb-2 flex items-center">
                    <Trash2 className="w-5 h-5 text-red-600 mr-2" />
                    Eliminar Proyecto
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Esta acción eliminará permanentemente el proyecto, todos sus datos, análisis y configuraciones. 
                    Esta acción no se puede deshacer.
                  </p>
                  
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                    <h4 className="font-medium text-red-900 mb-2">Se eliminarán:</h4>
                    <ul className="text-sm text-red-700 space-y-1">
                      <li>• Todos los instrumentos y respuestas recolectadas</li>
                      <li>• Análisis ejecutados y sus resultados</li>
                      <li>• Archivos subidos y transcripciones</li>
                      <li>• Configuraciones de colaboradores</li>
                      <li>• Historial de actividades</li>
                    </ul>
                  </div>

                  <button
                    onClick={() => setShowDeleteModal(true)}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Eliminar Proyecto</span>
                  </button>
                </div>

                <div className="bg-white border border-orange-200 rounded-lg p-6">
                  <h3 className="font-semibold text-gray-900 mb-2">Exportar Datos Completos</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Descarga una copia completa de todos los datos del proyecto antes de realizar cambios críticos
                  </p>
                  <button className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors flex items-center space-x-2">
                    <Download className="w-4 h-4" />
                    <span>Exportar Todo</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-red-900 flex items-center">
                <AlertTriangle className="w-6 h-6 mr-2" />
                Confirmar Eliminación
              </h2>
            </div>
            
            <div className="p-6">
              <p className="text-gray-700 mb-4">
                ¿Estás seguro de que quieres eliminar el proyecto <strong>"{projectData.name}"</strong>?
              </p>
              
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                <p className="text-sm text-red-700">
                  Esta acción es <strong>irreversible</strong>. Todos los datos, análisis y configuraciones se perderán permanentemente.
                </p>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Para confirmar, escribe el nombre del proyecto:
                </label>
                <input
                  type="text"
                  placeholder={projectData.name}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleDeleteProject}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Eliminar Proyecto
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectSettings;