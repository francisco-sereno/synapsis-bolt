import React, { useState } from 'react';
import { GitMerge, Layers, Lightbulb, BarChart3, MessageSquare, FileText, Zap, CheckCircle } from 'lucide-react';

const TriangulationModule = () => {
  const [activeTab, setActiveTab] = useState('setup');
  const [selectedSources, setSelectedSources] = useState([]);
  const [triangulationResults, setTriangulationResults] = useState(null);
  const [isTriangulating, setIsTriangulating] = useState(false);

  const dataSources = [
    {
      id: 1,
      name: 'Encuesta de Satisfacción Docente',
      type: 'Cuantitativo',
      records: 89,
      variables: 24,
      quality: 'Alta',
      lastAnalyzed: '2 horas'
    },
    {
      id: 2,
      name: 'Focus Groups - Experiencia Virtual',
      type: 'Cualitativo',
      records: 3,
      themes: 8,
      quality: 'Excelente',
      lastAnalyzed: '1 día'
    },
    {
      id: 3,
      name: 'Observaciones de Clase',
      type: 'Cualitativo',
      records: 8,
      themes: 12,
      quality: 'Media',
      lastAnalyzed: '2 días'
    },
    {
      id: 4,
      name: 'Autopercepción Académica',
      type: 'Cuantitativo',
      records: 156,
      variables: 18,
      quality: 'Excelente',
      lastAnalyzed: '3 días'
    }
  ];

  const triangulationTypes = [
    {
      id: 'methodological',
      name: 'Triangulación Metodológica',
      description: 'Combina datos cuantitativos y cualitativos',
      icon: Layers,
      color: 'blue'
    },
    {
      id: 'data',
      name: 'Triangulación de Datos',
      description: 'Compara múltiples fuentes de información',
      icon: BarChart3,
      color: 'green'
    },
    {
      id: 'theoretical',
      name: 'Triangulación Teórica',
      description: 'Analiza desde múltiples marcos teóricos',
      icon: FileText,
      color: 'purple'
    }
  ];

  const tabs = [
    { id: 'setup', label: 'Configuración', icon: GitMerge },
    { id: 'results', label: 'Resultados', icon: Lightbulb },
    { id: 'synthesis', label: 'Síntesis', icon: Layers }
  ];

  const handleTriangulation = async () => {
    if (selectedSources.length < 2) {
      alert('Selecciona al menos 2 fuentes de datos para triangular');
      return;
    }

    setIsTriangulating(true);
    
    // Simulate AI triangulation
    setTimeout(() => {
      setTriangulationResults({
        convergences: [
          {
            theme: 'Flexibilidad Educativa',
            sources: ['Encuesta Docente', 'Focus Groups'],
            strength: 'Alta',
            evidence: 'Tanto datos cuantitativos (85% satisfacción) como cualitativos confirman valoración positiva de la flexibilidad'
          },
          {
            theme: 'Desafíos Tecnológicos',
            sources: ['Focus Groups', 'Observaciones'],
            strength: 'Media',
            evidence: 'Ambas fuentes identifican problemas de conectividad, aunque con diferentes niveles de impacto'
          }
        ],
        divergences: [
          {
            theme: 'Interacción Social',
            sources: ['Encuesta Docente', 'Focus Groups'],
            explanation: 'Los docentes reportan menor preocupación (3.2/5) mientras que estudiantes expresan mayor impacto negativo'
          }
        ],
        metaInferences: [
          'La modalidad virtual es efectiva para el aprendizaje pero requiere mejoras en infraestructura tecnológica',
          'Existe una brecha generacional en la percepción de la interacción social virtual',
          'La flexibilidad horaria es el factor más valorado por todos los grupos'
        ],
        recommendations: [
          'Implementar programas de capacitación tecnológica específicos',
          'Desarrollar estrategias diferenciadas por grupo etario',
          'Mantener opciones de flexibilidad en futuras modalidades'
        ]
      });
      setIsTriangulating(false);
    }, 3000);
  };

  const toggleSource = (sourceId) => {
    setSelectedSources(prev => 
      prev.includes(sourceId) 
        ? prev.filter(id => id !== sourceId)
        : [...prev, sourceId]
    );
  };

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Triangulación y Síntesis</h1>
        <p className="text-gray-600">Combina múltiples fuentes de datos para obtener insights más profundos</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Fuentes Disponibles</p>
              <p className="text-3xl font-bold text-blue-600">{dataSources.length}</p>
            </div>
            <Layers className="w-8 h-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Convergencias</p>
              <p className="text-3xl font-bold text-green-600">8</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Meta-inferencias</p>
              <p className="text-3xl font-bold text-purple-600">5</p>
            </div>
            <Lightbulb className="w-8 h-8 text-purple-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Síntesis Generadas</p>
              <p className="text-3xl font-bold text-orange-600">3</p>
            </div>
            <GitMerge className="w-8 h-8 text-orange-600" />
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
          {activeTab === 'setup' && (
            <div className="space-y-6">
              {/* Triangulation Type Selection */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-medium text-blue-900 mb-2">Tipos de Triangulación</h3>
                <p className="text-sm text-blue-700">Selecciona el enfoque de triangulación más apropiado para tu investigación</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {triangulationTypes.map((type) => {
                  const Icon = type.icon;
                  return (
                    <div key={type.id} className={`border-2 rounded-lg p-4 cursor-pointer transition-all hover:shadow-md border-${type.color}-200 hover:border-${type.color}-400`}>
                      <div className="flex items-start space-x-3">
                        <Icon className={`w-6 h-6 text-${type.color}-600 mt-1`} />
                        <div>
                          <h3 className="font-medium text-gray-900 mb-1">{type.name}</h3>
                          <p className="text-sm text-gray-600">{type.description}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Data Sources Selection */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Seleccionar Fuentes de Datos</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Elige al menos 2 fuentes de datos para realizar la triangulación
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {dataSources.map((source) => (
                    <div
                      key={source.id}
                      onClick={() => toggleSource(source.id)}
                      className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                        selectedSources.includes(source.id)
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <h4 className="font-medium text-gray-900">{source.name}</h4>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          source.type === 'Cuantitativo' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
                        }`}>
                          {source.type}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                        <div>
                          <span>Registros:</span>
                          <span className="font-medium ml-1">{source.records}</span>
                        </div>
                        <div>
                          <span>{source.type === 'Cuantitativo' ? 'Variables:' : 'Temas:'}</span>
                          <span className="font-medium ml-1">{source.variables || source.themes}</span>
                        </div>
                        <div className="col-span-2">
                          <span>Calidad:</span>
                          <span className={`font-medium ml-1 ${
                            source.quality === 'Excelente' ? 'text-green-600' :
                            source.quality === 'Alta' ? 'text-blue-600' :
                            'text-orange-600'
                          }`}>
                            {source.quality}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6">
                  <button
                    onClick={handleTriangulation}
                    disabled={selectedSources.length < 2 || isTriangulating}
                    className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
                  >
                    {isTriangulating ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>Triangulando datos...</span>
                      </>
                    ) : (
                      <>
                        <Zap className="w-4 h-4" />
                        <span>Ejecutar Triangulación con IA</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'results' && (
            <div className="space-y-6">
              {triangulationResults ? (
                <div className="space-y-6">
                  {/* Convergences */}
                  <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                      Convergencias Identificadas
                    </h3>
                    <div className="space-y-4">
                      {triangulationResults.convergences.map((conv, index) => (
                        <div key={index} className="bg-green-50 border border-green-200 rounded-lg p-4">
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="font-medium text-green-900">{conv.theme}</h4>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              conv.strength === 'Alta' ? 'bg-green-100 text-green-700' :
                              conv.strength === 'Media' ? 'bg-yellow-100 text-yellow-700' :
                              'bg-gray-100 text-gray-700'
                            }`}>
                              Fuerza: {conv.strength}
                            </span>
                          </div>
                          <p className="text-sm text-green-800 mb-2">
                            Fuentes: {conv.sources.join(', ')}
                          </p>
                          <p className="text-sm text-green-700">{conv.evidence}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Divergences */}
                  <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                      <GitMerge className="w-5 h-5 text-orange-600 mr-2" />
                      Divergencias y Contradicciones
                    </h3>
                    <div className="space-y-4">
                      {triangulationResults.divergences.map((div, index) => (
                        <div key={index} className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                          <h4 className="font-medium text-orange-900 mb-2">{div.theme}</h4>
                          <p className="text-sm text-orange-800 mb-2">
                            Fuentes: {div.sources.join(', ')}
                          </p>
                          <p className="text-sm text-orange-700">{div.explanation}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Meta-inferences */}
                  <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                      <Lightbulb className="w-5 h-5 text-purple-600 mr-2" />
                      Meta-inferencias
                    </h3>
                    <div className="space-y-3">
                      {triangulationResults.metaInferences.map((inference, index) => (
                        <div key={index} className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                          <p className="text-sm text-purple-800">{inference}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <GitMerge className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>Ejecuta una triangulación para ver los resultados</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'synthesis' && (
            <div className="space-y-6">
              {triangulationResults ? (
                <div className="space-y-6">
                  {/* Synthesis Report */}
                  <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <h3 className="font-semibold text-gray-900 mb-4">Síntesis Integrativa</h3>
                    <div className="bg-gray-50 rounded-lg p-6">
                      <h4 className="font-medium text-gray-900 mb-3">Hallazgos Principales</h4>
                      <div className="prose prose-sm max-w-none text-gray-700">
                        <p className="mb-4">
                          El análisis triangulado revela un panorama complejo sobre la efectividad de la modalidad virtual en educación. 
                          Los datos convergen en identificar la <strong>flexibilidad educativa</strong> como el principal beneficio, 
                          con alta satisfacción tanto en mediciones cuantitativas como en percepciones cualitativas.
                        </p>
                        <p className="mb-4">
                          Sin embargo, emergen <strong>desafíos tecnológicos</strong> consistentes que requieren atención inmediata. 
                          La infraestructura de conectividad se presenta como un factor limitante crítico que afecta 
                          la experiencia educativa de manera diferencial según el contexto socioeconómico.
                        </p>
                        <p>
                          Una divergencia notable se observa en la percepción de la <strong>interacción social</strong>, 
                          donde existe una brecha generacional significativa que sugiere la necesidad de estrategias 
                          diferenciadas por grupo etario.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Recommendations */}
                  <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <h3 className="font-semibold text-gray-900 mb-4">Recomendaciones Estratégicas</h3>
                    <div className="space-y-3">
                      {triangulationResults.recommendations.map((rec, index) => (
                        <div key={index} className="flex items-start space-x-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                          <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                            {index + 1}
                          </div>
                          <p className="text-sm text-blue-800 flex-1">{rec}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Export Options */}
                  <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <h3 className="font-semibold text-gray-900 mb-4">Exportar Síntesis</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <button className="flex items-center justify-center space-x-2 p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                        <FileText className="w-5 h-5 text-red-600" />
                        <span className="text-sm font-medium">PDF Ejecutivo</span>
                      </button>
                      <button className="flex items-center justify-center space-x-2 p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                        <FileText className="w-5 h-5 text-blue-600" />
                        <span className="text-sm font-medium">Reporte Completo</span>
                      </button>
                      <button className="flex items-center justify-center space-x-2 p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                        <BarChart3 className="w-5 h-5 text-green-600" />
                        <span className="text-sm font-medium">Dashboard Interactivo</span>
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <Layers className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>Ejecuta una triangulación para generar la síntesis</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TriangulationModule;