import React, { useState } from 'react';
import { BarChart3, TrendingUp, Calculator, PieChart, Activity, Zap } from 'lucide-react';

const QuantitativeAnalysis = () => {
  const [selectedDataset, setSelectedDataset] = useState('');
  const [selectedAnalysis, setSelectedAnalysis] = useState('');

  const datasets = [
    { id: 1, name: 'Satisfacción Docente v2.0', records: 89 },
    { id: 2, name: 'Autopercepción Académica', records: 156 },
    { id: 3, name: 'Evaluación Metodológica', records: 74 }
  ];

  const analysisTypes = [
    {
      id: 'descriptive',
      name: 'Análisis Descriptivo',
      description: 'Medidas de tendencia central y dispersión',
      icon: BarChart3,
      color: 'blue'
    },
    {
      id: 'correlation',
      name: 'Análisis de Correlación',
      description: 'Relaciones entre variables cuantitativas',
      icon: TrendingUp,
      color: 'green'
    },
    {
      id: 'ttest',
      name: 'Prueba T',
      description: 'Comparación de medias entre grupos',
      icon: Calculator,
      color: 'purple'
    },
    {
      id: 'cronbach',
      name: 'Alfa de Cronbach',
      description: 'Fiabilidad interna del instrumento',
      icon: Activity,
      color: 'orange'
    }
  ];

  const recentAnalyses = [
    {
      id: 1,
      type: 'Análisis Descriptivo',
      dataset: 'Satisfacción Docente v2.0',
      date: '2024-01-12',
      status: 'Completado',
      insights: 'Media de satisfacción: 4.2/5.0'
    },
    {
      id: 2,
      type: 'Correlación',
      dataset: 'Autopercepción Académica',
      date: '2024-01-11',
      status: 'Completado',
      insights: 'Correlación significativa r=0.68'
    }
  ];

  const handleRunAnalysis = () => {
    if (!selectedDataset || !selectedAnalysis) {
      alert('Por favor selecciona un dataset y tipo de análisis');
      return;
    }
    
    // Simulate analysis execution
    console.log(`Ejecutando ${selectedAnalysis} en ${selectedDataset}`);
  };

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Análisis Cuantitativo</h1>
        <p className="text-gray-600">Ejecuta análisis estadísticos con interpretación asistida por IA</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Análisis Ejecutados</p>
              <p className="text-3xl font-bold text-blue-600">15</p>
            </div>
            <BarChart3 className="w-8 h-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Variables Analizadas</p>
              <p className="text-3xl font-bold text-green-600">42</p>
            </div>
            <TrendingUp className="w-8 h-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Correlaciones Significativas</p>
              <p className="text-3xl font-bold text-purple-600">8</p>
            </div>
            <Activity className="w-8 h-8 text-purple-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Tiempo Promedio</p>
              <p className="text-3xl font-bold text-orange-600">2.3s</p>
            </div>
            <Zap className="w-8 h-8 text-orange-600" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Analysis Setup */}
        <div className="lg:col-span-2 space-y-6">
          {/* Dataset Selection */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Configuración del Análisis</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Seleccionar Dataset
                </label>
                <select 
                  value={selectedDataset}
                  onChange={(e) => setSelectedDataset(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Elige un conjunto de datos</option>
                  {datasets.map((dataset) => (
                    <option key={dataset.id} value={dataset.name}>
                      {dataset.name} ({dataset.records} registros)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo de Análisis
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {analysisTypes.map((analysis) => {
                    const Icon = analysis.icon;
                    return (
                      <div
                        key={analysis.id}
                        onClick={() => setSelectedAnalysis(analysis.id)}
                        className={`cursor-pointer border-2 rounded-lg p-4 transition-all ${
                          selectedAnalysis === analysis.id
                            ? `border-${analysis.color}-500 bg-${analysis.color}-50`
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-start space-x-3">
                          <Icon className={`w-5 h-5 text-${analysis.color}-600 mt-0.5`} />
                          <div>
                            <h3 className="font-medium text-gray-900">{analysis.name}</h3>
                            <p className="text-sm text-gray-600 mt-1">{analysis.description}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <button
                onClick={handleRunAnalysis}
                disabled={!selectedDataset || !selectedAnalysis}
                className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
              >
                <Zap className="w-4 h-4" />
                <span>Ejecutar Análisis con IA</span>
              </button>
            </div>
          </div>

          {/* Results Preview */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Vista Previa de Resultados</h2>
            
            {selectedAnalysis ? (
              <div className="space-y-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="font-medium text-blue-900 mb-2">
                    {analysisTypes.find(a => a.id === selectedAnalysis)?.name}
                  </h3>
                  <p className="text-sm text-blue-700">
                    {selectedDataset && `Dataset: ${selectedDataset}`}
                  </p>
                </div>
                
                {/* Mock results based on analysis type */}
                {selectedAnalysis === 'descriptive' && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-3">Estadísticas Descriptivas</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div><span className="text-gray-600">Media:</span> <span className="font-medium">4.23</span></div>
                      <div><span className="text-gray-600">Mediana:</span> <span className="font-medium">4.50</span></div>
                      <div><span className="text-gray-600">Desv. Estándar:</span> <span className="font-medium">0.85</span></div>
                      <div><span className="text-gray-600">Mínimo:</span> <span className="font-medium">1.00</span></div>
                    </div>
                  </div>
                )}
                
                {selectedAnalysis === 'correlation' && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-3">Matriz de Correlaciones</h4>
                    <p className="text-sm text-gray-600">
                      Se mostrarán las correlaciones significativas entre variables seleccionadas
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Calculator className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>Selecciona un dataset y tipo de análisis para ver la vista previa</p>
              </div>
            )}
          </div>
        </div>

        {/* Recent Analyses */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900">Análisis Recientes</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {recentAnalyses.map((analysis) => (
                  <div key={analysis.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-medium text-gray-900">{analysis.type}</h3>
                      <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                        {analysis.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{analysis.dataset}</p>
                    <p className="text-sm text-blue-600 font-medium">{analysis.insights}</p>
                    <p className="text-xs text-gray-500 mt-2">{analysis.date}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900">Acciones Rápidas</h2>
            </div>
            <div className="p-6">
              <div className="space-y-3">
                <button className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-3">
                  <BarChart3 className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium">Análisis Completo</span>
                </button>
                <button className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-3">
                  <PieChart className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-medium">Distribuciones</span>
                </button>
                <button className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-3">
                  <TrendingUp className="w-4 h-4 text-purple-600" />
                  <span className="text-sm font-medium">Tendencias</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuantitativeAnalysis;