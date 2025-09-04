import React, { useState } from 'react';
import { Database, Search, Filter, Download, Eye, Trash2, Shield, RefreshCw } from 'lucide-react';

const DataRepository = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const datasets = [
    {
      id: 1,
      name: 'Satisfacción Docente v2.0 - Respuestas',
      instrument: 'Encuesta de Satisfacción Docente v2.0',
      records: 89,
      variables: 24,
      lastUpdated: '2 horas',
      status: 'Activo',
      quality: 'Alta'
    },
    {
      id: 2,
      name: 'Autopercepción Académica - Dataset Completo',
      instrument: 'Cuestionario de Autopercepción Académica',
      records: 156,
      variables: 18,
      lastUpdated: '3 días',
      status: 'Completado',
      quality: 'Excelente'
    },
    {
      id: 3,
      name: 'Focus Groups - Transcripciones',
      instrument: 'Entrevista Semiestructurada',
      records: 3,
      variables: 12,
      lastUpdated: '1 día',
      status: 'Procesando',
      quality: 'Media'
    }
  ];

  const tabs = [
    { id: 'overview', label: 'Vista General', icon: Database },
    { id: 'quality', label: 'Calidad de Datos', icon: Shield },
    { id: 'cleaning', label: 'Limpieza IA', icon: RefreshCw }
  ];

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Repositorio de Datos</h1>
        <p className="text-gray-600">Gestiona, limpia y analiza todos tus conjuntos de datos</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Total Registros</p>
              <p className="text-3xl font-bold text-blue-600">248</p>
            </div>
            <Database className="w-8 h-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Conjuntos Activos</p>
              <p className="text-3xl font-bold text-green-600">3</p>
            </div>
            <Eye className="w-8 h-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Calidad Promedio</p>
              <p className="text-3xl font-bold text-purple-600">87%</p>
            </div>
            <Shield className="w-8 h-8 text-purple-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Última Actualización</p>
              <p className="text-xl font-bold text-orange-600">2h</p>
            </div>
            <RefreshCw className="w-8 h-8 text-orange-600" />
          </div>
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
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Controls */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Buscar datasets..."
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option value="">Todos los estados</option>
                    <option value="active">Activo</option>
                    <option value="completed">Completado</option>
                    <option value="processing">Procesando</option>
                  </select>
                  <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                    <Filter className="w-4 h-4" />
                    <span>Filtros</span>
                  </button>
                </div>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
                  <Download className="w-4 h-4" />
                  <span>Exportar Todo</span>
                </button>
              </div>

              {/* Datasets List */}
              <div className="space-y-4">
                {datasets.map((dataset) => (
                  <div key={dataset.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">{dataset.name}</h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            dataset.status === 'Activo' ? 'bg-green-100 text-green-700' :
                            dataset.status === 'Completado' ? 'bg-blue-100 text-blue-700' :
                            'bg-yellow-100 text-yellow-700'
                          }`}>
                            {dataset.status}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            dataset.quality === 'Excelente' ? 'bg-green-100 text-green-700' :
                            dataset.quality === 'Alta' ? 'bg-blue-100 text-blue-700' :
                            'bg-orange-100 text-orange-700'
                          }`}>
                            Calidad: {dataset.quality}
                          </span>
                        </div>
                        
                        <p className="text-sm text-gray-600 mb-3">Origen: {dataset.instrument}</p>
                        
                        <div className="grid grid-cols-3 gap-6 text-sm">
                          <div>
                            <span className="text-gray-500">Registros:</span>
                            <span className="font-medium text-gray-900 ml-2">{dataset.records}</span>
                          </div>
                          <div>
                            <span className="text-gray-500">Variables:</span>
                            <span className="font-medium text-gray-900 ml-2">{dataset.variables}</span>
                          </div>
                          <div>
                            <span className="text-gray-500">Última actualización:</span>
                            <span className="font-medium text-gray-900 ml-2">{dataset.lastUpdated}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <button className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors" title="Ver datos">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-colors" title="Descargar">
                          <Download className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-orange-600 hover:bg-orange-100 rounded-lg transition-colors" title="Limpiar datos">
                          <RefreshCw className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors" title="Eliminar">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'quality' && (
            <div className="space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-blue-900">Análisis de Calidad de Datos</h3>
                    <p className="text-sm text-blue-700 mt-1">
                      Evaluación automática de la integridad, consistencia y completitud de tus datos
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {datasets.map((dataset) => (
                  <div key={dataset.id} className="bg-white border border-gray-200 rounded-lg p-6">
                    <h3 className="font-semibold text-gray-900 mb-4">{dataset.name}</h3>
                    
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium text-gray-700">Completitud</span>
                          <span className="text-sm font-medium text-green-600">95%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-green-600 h-2 rounded-full" style={{ width: '95%' }}></div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium text-gray-700">Consistencia</span>
                          <span className="text-sm font-medium text-blue-600">88%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-blue-600 h-2 rounded-full" style={{ width: '88%' }}></div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium text-gray-700">Validez</span>
                          <span className="text-sm font-medium text-purple-600">92%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-purple-600 h-2 rounded-full" style={{ width: '92%' }}></div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Issues Detectados</h4>
                      <ul className="text-xs text-gray-600 space-y-1">
                        <li>• 3 valores atípicos en pregunta #12</li>
                        <li>• 5 respuestas incompletas</li>
                        <li>• 1 inconsistencia de formato en fecha</li>
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'cleaning' && (
            <div className="space-y-6">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <RefreshCw className="w-5 h-5 text-green-600 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-green-900">Limpieza Asistida por IA</h3>
                    <p className="text-sm text-green-700 mt-1">
                      Detecta automáticamente problemas en los datos y sugiere correcciones
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Seleccionar Dataset para Limpieza</h3>
                
                <div className="space-y-4">
                  {datasets.map((dataset) => (
                    <div key={dataset.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{dataset.name}</h4>
                        <p className="text-sm text-gray-600">{dataset.records} registros • Calidad: {dataset.quality}</p>
                      </div>
                      <button 
                        onClick={() => console.log('Iniciando limpieza de:', dataset.name)}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
                      >
                        <RefreshCw className="w-4 h-4" />
                        <span>Iniciar Limpieza</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Tipos de Limpieza Automática</h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <input type="checkbox" id="outliers" className="rounded" defaultChecked />
                      <label htmlFor="outliers" className="text-sm text-gray-700">Detectar valores atípicos</label>
                    </div>
                    <div className="flex items-center space-x-3">
                      <input type="checkbox" id="missing" className="rounded" defaultChecked />
                      <label htmlFor="missing" className="text-sm text-gray-700">Imputar datos faltantes</label>
                    </div>
                    <div className="flex items-center space-x-3">
                      <input type="checkbox" id="format" className="rounded" defaultChecked />
                      <label htmlFor="format" className="text-sm text-gray-700">Normalizar formatos</label>
                    </div>
                    <div className="flex items-center space-x-3">
                      <input type="checkbox" id="duplicates" className="rounded" />
                      <label htmlFor="duplicates" className="text-sm text-gray-700">Eliminar duplicados</label>
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Configuración Avanzada</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Método de imputación
                      </label>
                      <select className="w-full p-2 border border-gray-300 rounded-lg">
                        <option value="mean">Media</option>
                        <option value="median">Mediana</option>
                        <option value="mode">Moda</option>
                        <option value="forward">Forward Fill</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Umbral para outliers (Z-score)
                      </label>
                      <input 
                        type="number" 
                        step="0.1" 
                        defaultValue="3.0" 
                        className="w-full p-2 border border-gray-300 rounded-lg"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DataRepository;