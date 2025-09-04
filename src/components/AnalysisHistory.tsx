import React, { useState } from 'react';
import { useAnalyses } from '../hooks/useAnalyses';
import { useProjects } from '../hooks/useProjects';
import { History, Search, Filter, Eye, Download, BarChart3, MessageSquare, GitMerge, Calendar, Clock, Star } from 'lucide-react';

const AnalysisHistory = () => {
  const { currentProject } = useProjects();
  const { analyses, loading } = useAnalyses(currentProject?.id);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  const filteredHistory = analyses.filter(analysis => {
    const matchesSearch = analysis.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (analysis.dataset_id || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || analysis.type.toLowerCase() === filterType.toLowerCase();
    return matchesSearch && matchesFilter;
  });

  const getTypeIcon = (type) => {
    switch (type.toLowerCase()) {
      case 'cuantitativo':
        return BarChart3;
      case 'cualitativo':
        return MessageSquare;
      case 'triangulación':
        return GitMerge;
      case 'validación':
        return Star;
      default:
        return BarChart3;
    }
  };

  const getTypeColor = (type) => {
    switch (type.toLowerCase()) {
      case 'cuantitativo':
        return 'blue';
      case 'cualitativo':
        return 'purple';
      case 'triangulación':
        return 'green';
      case 'validación':
        return 'orange';
      default:
        return 'gray';
    }
  };

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Historial de Análisis</h1>
        <p className="text-gray-600">Revisa todos los análisis ejecutados y sus resultados</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Total Análisis</p>
              <p className="text-3xl font-bold text-blue-600">{loading ? '...' : analyses.length}</p>
            </div>
            <History className="w-8 h-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Puntuación Promedio</p>
              <p className="text-3xl font-bold text-green-600">
                {loading ? '...' : analyses.length > 0 ? 
                  (analyses.reduce((sum, a) => sum + (a.rating || 0), 0) / analyses.filter(a => a.rating).length).toFixed(1) : 
                  '0.0'
                }
              </p>
              <p className="text-xs text-gray-500">de 5.0</p>
            </div>
            <Star className="w-8 h-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Exportados</p>
              <p className="text-3xl font-bold text-purple-600">
                {loading ? '...' : analyses.filter(a => a.exported).length}
              </p>
            </div>
            <Download className="w-8 h-8 text-purple-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Esta Semana</p>
              <p className="text-3xl font-bold text-orange-600">
                {loading ? '...' : analyses.filter(a => {
                  const weekAgo = new Date();
                  weekAgo.setDate(weekAgo.getDate() - 7);
                  return new Date(a.created_at) > weekAgo;
                }).length}
              </p>
            </div>
            <Calendar className="w-8 h-8 text-orange-600" />
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar análisis..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <select 
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Todos los tipos</option>
              <option value="cuantitativo">Cuantitativo</option>
              <option value="cualitativo">Cualitativo</option>
              <option value="triangulación">Triangulación</option>
              <option value="validación">Validación</option>
            </select>

            <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <Filter className="w-4 h-4" />
              <span>Más Filtros</span>
            </button>
          </div>

          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
            <Download className="w-4 h-4" />
            <span>Exportar Historial</span>
          </button>
        </div>
      </div>

      {/* Analysis History List */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-gray-100 animate-pulse rounded-lg h-32"></div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredHistory.map((analysis) => {
            const TypeIcon = getTypeIcon(analysis.type);
            const color = getTypeColor(analysis.type);
            
            return (
              <div key={analysis.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className={`p-2 bg-${color}-100 rounded-lg`}>
                        <TypeIcon className={`w-5 h-5 text-${color}-600`} />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{analysis.name}</h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <span className={`px-2 py-1 bg-${color}-100 text-${color}-700 rounded-full text-xs font-medium`}>
                            {analysis.type}
                          </span>
                          <span>Dataset: {analysis.dataset_id || 'N/A'}</span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Información del Análisis</h4>
                        <div className="space-y-1 text-sm text-gray-600">
                          <div className="flex justify-between">
                            <span>Estado:</span>
                            <span className={`font-medium ${
                              analysis.status === 'completed' ? 'text-green-600' : 
                              analysis.status === 'running' ? 'text-yellow-600' :
                              'text-red-600'
                            }`}>
                              {analysis.status === 'completed' ? 'Completado' :
                               analysis.status === 'running' ? 'Ejecutando' :
                               'Fallido'}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>Fecha:</span>
                            <span className="font-medium text-gray-900">
                              {new Date(analysis.created_at).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Resultados</h4>
                        <div className="bg-gray-50 rounded-lg p-3">
                          <p className="text-sm text-gray-700">
                            {analysis.interpretation || 'Análisis completado exitosamente'}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                      <div className="flex items-center space-x-4">
                        {analysis.rating && (
                          <div className="flex items-center space-x-1">
                            <Star className="w-4 h-4 text-yellow-500" />
                            <span className="text-sm font-medium text-gray-900">{analysis.rating}</span>
                            <span className="text-sm text-gray-500">/5.0</span>
                          </div>
                        )}
                        <div className="flex items-center space-x-1">
                          <Clock className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-500">
                            {new Date(analysis.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        {analysis.exported && (
                          <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                            Exportado
                          </span>
                        )}
                      </div>

                      <div className="flex items-center space-x-2">
                        <button className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors" title="Ver detalles">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-colors" title="Descargar">
                          <Download className="w-4 h-4" />
                        </button>
                        <button className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
                          Replicar Análisis
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {filteredHistory.length === 0 && (
        <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
          <History className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron análisis</h3>
          <p className="text-gray-600">Ajusta los filtros de búsqueda o ejecuta nuevos análisis</p>
        </div>
      )}

      {/* Analysis Insights */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">Insights del Historial</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-medium text-blue-900 mb-2">Análisis más frecuente</h3>
              <p className="text-sm text-blue-700">Análisis descriptivo</p>
              <p className="text-xs text-blue-600 mt-1">40% de todos los análisis</p>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="font-medium text-green-900 mb-2">Mejor puntuación</h3>
              <p className="text-sm text-green-700">Triangulación metodológica</p>
              <p className="text-xs text-green-600 mt-1">4.8/5.0 estrellas</p>
            </div>

            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <h3 className="font-medium text-purple-900 mb-2">Colaborador más activo</h3>
              <p className="text-sm text-purple-700">Dr. Rodriguez</p>
              <p className="text-xs text-purple-600 mt-1">3 análisis ejecutados</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalysisHistory;