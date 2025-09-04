import React, { useState, useEffect, useCallback } from 'react';
import { Target, HelpCircle, CheckCircle, Lightbulb, FileText, Save, History, Eye, Download } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useProjects } from '../hooks/useProjects';
import { supabase } from '../lib/supabase';

interface MethodologyData {
  id?: string;
  project_id: string;
  research_problem: string;
  main_question: string;
  secondary_questions: string[];
  general_objective: string;
  specific_objectives: string[];
  theoretical_justification: string;
  practical_justification: string;
  ethical_considerations: string;
  paradigm: string;
  methodological_approach: string;
  design_characterization: string;
  design_justification: string;
  data_collection_techniques: string;
  dimensions_matrix: Record<string, unknown>;
  created_at?: string;
  updated_at?: string;
}

interface MethodologyAnalysis {
  id?: string;
  project_id: string;
  methodology_data_id: string;
  coherence_score: number;
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  alignment_scores: {
    problem_objectives: number;
    objectives_questions: number;
    questions_hypotheses: number;
  };
  created_by: string;
  created_at?: string;
}

const MethodologyModule = () => {
  const { user } = useAuth();
  const { currentProject } = useProjects();
  const [activeTab, setActiveTab] = useState('design');
  const [saving, setSaving] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [methodologyData, setMethodologyData] = useState<MethodologyData>({
    project_id: currentProject?.id || '',
    research_problem: '',
    main_question: '',
    secondary_questions: [''],
    general_objective: '',
    specific_objectives: [''],
    theoretical_justification: '',
    practical_justification: '',
    ethical_considerations: '',
    paradigm: '',
    methodological_approach: '',
    design_characterization: '',
    design_justification: '',
    data_collection_techniques: '',
    dimensions_matrix: {}
  });
  const [analysisHistory, setAnalysisHistory] = useState<MethodologyAnalysis[]>([]);
  const [currentAnalysis, setCurrentAnalysis] = useState<MethodologyAnalysis | null>(null);

  const loadMethodologyData = useCallback(async () => {
    if (!currentProject?.id) return;

    try {
      const { data, error: fetchError } = await supabase
        .from('methodology_data')
        .select('*')
        .eq('project_id', currentProject.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (data && !fetchError) {
        setMethodologyData(data);
      }
    } catch {
      console.log('No existing methodology data found');
    }
  }, [currentProject?.id]);

  const loadAnalysisHistory = useCallback(async () => {
    if (!currentProject?.id) return;

    try {
      const { data, error: fetchError } = await supabase
        .from('methodology_analyses')
        .select('*')
        .eq('project_id', currentProject.id)
        .order('created_at', { ascending: false });

      if (data && !fetchError) {
        setAnalysisHistory(data);
      }
    } catch {
      console.log('No analysis history found');
    }
  }, [currentProject?.id]);

  useEffect(() => {
    if (currentProject?.id) {
      loadMethodologyData();
      loadAnalysisHistory();
    }
  }, [currentProject?.id, loadMethodologyData, loadAnalysisHistory]);

  const saveMethodologyData = async () => {
    if (!currentProject?.id || !user?.id) return;

    setSaving(true);
    try {
      const dataToSave = {
        ...methodologyData,
        project_id: currentProject.id,
        updated_at: new Date().toISOString()
      };

      if (methodologyData.id) {
        // Update existing
        const { error } = await supabase
          .from('methodology_data')
          .update(dataToSave)
          .eq('id', methodologyData.id);

        if (error) throw error;
      } else {
        // Create new
        const { data, error } = await supabase
          .from('methodology_data')
          .insert({
            ...dataToSave,
            created_at: new Date().toISOString()
          })
          .select()
          .single();

        if (error) throw error;
        if (data) {
          setMethodologyData(data);
        }
      }
    } catch (error) {
      console.error('Error saving methodology data:', error);
    } finally {
      setSaving(false);
    }
  };

  const runMethodologyAnalysis = async () => {
    if (!currentProject?.id || !user?.id || !methodologyData.research_problem) return;

    setAnalyzing(true);
    try {
      // First save the current methodology data
      await saveMethodologyData();

      // Simulate AI analysis (replace with actual AI service call)
      const analysisResult = await simulateAIAnalysis();

      // Save analysis to database
      const { data, error } = await supabase
        .from('methodology_analyses')
        .insert({
          project_id: currentProject.id,
          methodology_data_id: methodologyData.id,
          coherence_score: analysisResult.coherenceScore,
          strengths: analysisResult.strengths,
          weaknesses: analysisResult.weaknesses,
          recommendations: analysisResult.recommendations,
          alignment_scores: analysisResult.alignment,
          created_by: user.id,
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;
      if (data) {
        setCurrentAnalysis(data);
        setAnalysisHistory(prev => [data, ...prev]);
      }
    } catch (error) {
      console.error('Error running analysis:', error);
    } finally {
      setAnalyzing(false);
    }
  };

  const simulateAIAnalysis = async (): Promise<{
    coherenceScore: number;
    strengths: string[];
    weaknesses: string[];
    recommendations: string[];
    alignment: {
      problem_objectives: number;
      objectives_questions: number;
      questions_hypotheses: number;
    };
  }> => {
    // Simulate AI processing time
    await new Promise(resolve => setTimeout(resolve, 3000));

    return {
      coherenceScore: 0.85,
      strengths: [
        'El problema de investigación está claramente delimitado y contextualizado',
        'Los objetivos específicos están alineados con el objetivo general',
        'Existe coherencia lógica entre los componentes metodológicos',
        'La justificación teórica es sólida y bien fundamentada'
      ],
      weaknesses: [
        'Las preguntas secundarias podrían ser más específicas y medibles',
        'Falta mayor detalle en la caracterización del diseño metodológico',
        'Los aspectos éticos requieren mayor desarrollo y especificidad'
      ],
      recommendations: [
        'Refinar las preguntas secundarias para mayor especificidad',
        'Ampliar la justificación del diseño metodológico seleccionado',
        'Incluir consideraciones éticas más detalladas sobre protección de datos',
        'Desarrollar la matriz de dimensiones e indicadores con mayor profundidad'
      ],
      alignment: {
        problem_objectives: 0.92,
        objectives_questions: 0.78,
        questions_hypotheses: 0.85
      }
    };
  };

  const addSecondaryQuestion = () => {
    setMethodologyData({
      ...methodologyData,
      secondary_questions: [...methodologyData.secondary_questions, '']
    });
  };

  const updateSecondaryQuestion = (index: number, value: string) => {
    const updated = [...methodologyData.secondary_questions];
    updated[index] = value;
    setMethodologyData({
      ...methodologyData,
      secondary_questions: updated
    });
  };

  const removeSecondaryQuestion = (index: number) => {
    const updated = methodologyData.secondary_questions.filter((_, i) => i !== index);
    setMethodologyData({
      ...methodologyData,
      secondary_questions: updated
    });
  };

  const addSpecificObjective = () => {
    setMethodologyData({
      ...methodologyData,
      specific_objectives: [...methodologyData.specific_objectives, '']
    });
  };

  const updateSpecificObjective = (index: number, value: string) => {
    const updated = [...methodologyData.specific_objectives];
    updated[index] = value;
    setMethodologyData({
      ...methodologyData,
      specific_objectives: updated
    });
  };

  const removeSpecificObjective = (index: number) => {
    const updated = methodologyData.specific_objectives.filter((_, i) => i !== index);
    setMethodologyData({
      ...methodologyData,
      specific_objectives: updated
    });
  };

  const tabs = [
    { id: 'design', label: 'Diseño de Investigación', icon: Target },
    { id: 'methodology', label: 'Diseño Metodológico', icon: FileText },
    { id: 'analysis', label: 'Análisis IA', icon: Lightbulb },
    { id: 'history', label: 'Historial', icon: History }
  ];

  const paradigms = [
    { value: 'positivist', label: 'Positivista', description: 'Enfoque objetivo, cuantificable y generalizable' },
    { value: 'interpretive', label: 'Interpretativo', description: 'Comprensión de significados y experiencias subjetivas' },
    { value: 'critical', label: 'Crítico', description: 'Transformación social y emancipación' },
    { value: 'pragmatic', label: 'Pragmático', description: 'Solución de problemas prácticos, métodos mixtos' }
  ];

  const methodologicalApproaches = [
    { value: 'quantitative', label: 'Cuantitativo', description: 'Medición numérica y análisis estadístico' },
    { value: 'qualitative', label: 'Cualitativo', description: 'Comprensión profunda de fenómenos complejos' },
    { value: 'mixed_methods', label: 'Métodos Mixtos', description: 'Integración sistemática de enfoques cuanti y cuali' }
  ];

  if (!currentProject) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
          <Target className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">No hay proyecto activo</h2>
          <p className="text-gray-600">Selecciona un proyecto para acceder al módulo de metodología</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Metodología de Investigación</h1>
        <p className="text-gray-600">Diseña y valida la metodología de tu proyecto con asistencia de IA</p>
        <div className="mt-2 text-sm text-gray-500">
          Proyecto: <span className="font-medium text-gray-700">{currentProject.name}</span>
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
          {activeTab === 'design' && (
            <div className="space-y-8">
              {/* Research Problem */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Problema de Investigación</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Contextualización y Delimitación del Problema *
                    </label>
                    <textarea
                      value={methodologyData.research_problem}
                      onChange={(e) => setMethodologyData({...methodologyData, research_problem: e.target.value})}
                      className="w-full h-32 p-4 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Describe el problema de investigación, su contexto, relevancia para el campo educativo y la contribución esperada..."
                    />
                  </div>
                </div>
              </div>

              {/* Research Questions */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Preguntas de Investigación</h3>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Pregunta Principal *
                    </label>
                    <textarea
                      value={methodologyData.main_question}
                      onChange={(e) => setMethodologyData({...methodologyData, main_question: e.target.value})}
                      className="w-full h-24 p-4 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Formula la pregunta principal que guiará toda la investigación..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Preguntas Secundarias
                    </label>
                    <div className="space-y-3">
                      {methodologyData.secondary_questions.map((question, index) => (
                        <div key={index} className="flex items-start space-x-2">
                          <textarea
                            value={question}
                            onChange={(e) => updateSecondaryQuestion(index, e.target.value)}
                            className="flex-1 p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder={`Pregunta secundaria ${index + 1}...`}
                            rows={2}
                          />
                          {methodologyData.secondary_questions.length > 1 && (
                            <button
                              onClick={() => removeSecondaryQuestion(index)}
                              className="p-2 text-red-600 hover:bg-red-100 rounded transition-colors"
                            >
                              ×
                            </button>
                          )}
                        </div>
                      ))}
                      <button
                        onClick={addSecondaryQuestion}
                        className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                      >
                        + Agregar Pregunta Secundaria
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Objectives */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Objetivos del Estudio</h3>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Objetivo General *
                    </label>
                    <textarea
                      value={methodologyData.general_objective}
                      onChange={(e) => setMethodologyData({...methodologyData, general_objective: e.target.value})}
                      className="w-full h-24 p-4 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Define el objetivo general que abarca todo el estudio..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Objetivos Específicos
                    </label>
                    <div className="space-y-3">
                      {methodologyData.specific_objectives.map((objective, index) => (
                        <div key={index} className="flex items-start space-x-2">
                          <textarea
                            value={objective}
                            onChange={(e) => updateSpecificObjective(index, e.target.value)}
                            className="flex-1 p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder={`Objetivo específico ${index + 1}...`}
                            rows={2}
                          />
                          {methodologyData.specific_objectives.length > 1 && (
                            <button
                              onClick={() => removeSpecificObjective(index)}
                              className="p-2 text-red-600 hover:bg-red-100 rounded transition-colors"
                            >
                              ×
                            </button>
                          )}
                        </div>
                      ))}
                      <button
                        onClick={addSpecificObjective}
                        className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                      >
                        + Agregar Objetivo Específico
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Justification */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Justificación del Estudio</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Justificación Teórica
                    </label>
                    <textarea
                      value={methodologyData.theoretical_justification}
                      onChange={(e) => setMethodologyData({...methodologyData, theoretical_justification: e.target.value})}
                      className="w-full h-32 p-4 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Explica la contribución teórica y el vacío de conocimiento que aborda..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Justificación Práctica
                    </label>
                    <textarea
                      value={methodologyData.practical_justification}
                      onChange={(e) => setMethodologyData({...methodologyData, practical_justification: e.target.value})}
                      className="w-full h-32 p-4 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Describe la aplicabilidad práctica y beneficios esperados..."
                    />
                  </div>
                </div>
              </div>

              {/* Ethical Considerations */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Aspectos Éticos</h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Consideraciones Éticas del Proceso de Investigación
                  </label>
                  <textarea
                    value={methodologyData.ethical_considerations}
                    onChange={(e) => setMethodologyData({...methodologyData, ethical_considerations: e.target.value})}
                    className="w-full h-32 p-4 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Describe los aspectos éticos: consentimiento informado, confidencialidad, protección de datos, beneficios/riesgos..."
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={saveMethodologyData}
                  disabled={saving}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:bg-gray-100 transition-colors flex items-center space-x-2"
                >
                  {saving ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  <span>Guardar</span>
                </button>
                <button
                  onClick={runMethodologyAnalysis}
                  disabled={analyzing || !methodologyData.research_problem}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
                >
                  {analyzing ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : (
                    <Lightbulb className="w-4 h-4" />
                  )}
                  <span>Analizar con IA</span>
                </button>
              </div>
            </div>
          )}

          {activeTab === 'methodology' && (
            <div className="space-y-8">
              {/* Paradigm and Approach */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Posicionamiento Paradigmático</h3>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Paradigma Epistemológico *
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {paradigms.map((paradigm) => (
                        <div
                          key={paradigm.value}
                          onClick={() => setMethodologyData({...methodologyData, paradigm: paradigm.value})}
                          className={`cursor-pointer border-2 rounded-lg p-4 transition-all ${
                            methodologyData.paradigm === paradigm.value
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <h4 className="font-medium text-gray-900">{paradigm.label}</h4>
                          <p className="text-sm text-gray-600 mt-1">{paradigm.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Enfoque Metodológico *
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {methodologicalApproaches.map((approach) => (
                        <div
                          key={approach.value}
                          onClick={() => setMethodologyData({...methodologyData, methodological_approach: approach.value})}
                          className={`cursor-pointer border-2 rounded-lg p-4 transition-all ${
                            methodologyData.methodological_approach === approach.value
                              ? 'border-green-500 bg-green-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <h4 className="font-medium text-gray-900">{approach.label}</h4>
                          <p className="text-sm text-gray-600 mt-1">{approach.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Design Characterization */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Diseño de Investigación</h3>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Caracterización del Diseño *
                    </label>
                    <textarea
                      value={methodologyData.design_characterization}
                      onChange={(e) => setMethodologyData({...methodologyData, design_characterization: e.target.value})}
                      className="w-full h-32 p-4 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Caracteriza el diseño de investigación: tipo, temporalidad, alcance, etc..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Justificación del Diseño *
                    </label>
                    <textarea
                      value={methodologyData.design_justification}
                      onChange={(e) => setMethodologyData({...methodologyData, design_justification: e.target.value})}
                      className="w-full h-32 p-4 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Justifica por qué este diseño es el más apropiado para responder tus preguntas de investigación..."
                    />
                  </div>
                </div>
              </div>

              {/* Data Collection */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Técnicas e Instrumentos</h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Técnicas e Instrumentos de Recolección de Información *
                  </label>
                  <textarea
                    value={methodologyData.data_collection_techniques}
                    onChange={(e) => setMethodologyData({...methodologyData, data_collection_techniques: e.target.value})}
                    className="w-full h-32 p-4 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Describe las técnicas de recolección: encuestas, entrevistas, observación, etc. Incluye instrumentos específicos y su justificación..."
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={saveMethodologyData}
                  disabled={saving}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:bg-gray-100 transition-colors flex items-center space-x-2"
                >
                  {saving ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  <span>Guardar Metodología</span>
                </button>
              </div>
            </div>
          )}

          {activeTab === 'analysis' && (
            <div className="space-y-6">
              {currentAnalysis ? (
                <div className="space-y-6">
                  {/* Overall Score */}
                  <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-gray-900">Puntuación de coherencia metodológica</h3>
                      <div className="flex items-center space-x-2">
                        <span className="text-3xl font-bold text-blue-600">
                          {(currentAnalysis.coherence_score * 100).toFixed(0)}%
                        </span>
                      </div>
                    </div>
                    
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className="bg-gradient-to-r from-blue-400 to-blue-600 h-3 rounded-full transition-all duration-1000" 
                        style={{ width: `${currentAnalysis.coherence_score * 100}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Alignment Scores */}
                  <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <h3 className="font-semibold text-gray-900 mb-4">Análisis de alineación</h3>
                    <div className="space-y-4">
                      {[
                        { key: 'problem_objectives', label: 'Problema ↔ Objetivos', score: currentAnalysis.alignment_scores.problem_objectives },
                        { key: 'objectives_questions', label: 'Objetivos ↔ Preguntas', score: currentAnalysis.alignment_scores.objectives_questions },
                        { key: 'questions_hypotheses', label: 'Preguntas ↔ Diseño', score: currentAnalysis.alignment_scores.questions_hypotheses }
                      ].map((alignment) => (
                        <div key={alignment.key}>
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-medium text-gray-700">{alignment.label}</span>
                            <span className="text-sm font-bold text-gray-900">{(alignment.score * 100).toFixed(0)}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-green-600 h-2 rounded-full transition-all duration-500"
                              style={{ width: `${alignment.score * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Strengths and Weaknesses */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                      <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                        <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                        Fortalezas identificadas
                      </h3>
                      <div className="space-y-2">
                        {currentAnalysis.strengths.map((strength, index) => (
                          <div key={index} className="flex items-start space-x-2">
                            <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                            <span className="text-sm text-gray-700">{strength}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                      <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                        <HelpCircle className="w-5 h-5 text-orange-600 mr-2" />
                        Áreas de mejora
                      </h3>
                      <div className="space-y-2">
                        {currentAnalysis.weaknesses.map((weakness, index) => (
                          <div key={index} className="flex items-start space-x-2">
                            <HelpCircle className="w-4 h-4 text-orange-600 mt-0.5" />
                            <span className="text-sm text-gray-700">{weakness}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Recommendations */}
                  <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <h3 className="font-semibold text-gray-900 mb-4">Recomendaciones de IA</h3>
                    <div className="space-y-3">
                      {currentAnalysis.recommendations.map((rec, index) => (
                        <div key={index} className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                          <div className="flex items-start space-x-3">
                            <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                              {index + 1}
                            </div>
                            <p className="text-sm text-blue-800 flex-1">{rec}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-end space-x-3">
                    <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2">
                      <Download className="w-4 h-4" />
                      <span>Exportar Análisis</span>
                    </button>
                    <button
                      onClick={runMethodologyAnalysis}
                      disabled={analyzing}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-300 transition-colors flex items-center space-x-2"
                    >
                      <Lightbulb className="w-4 h-4" />
                      <span>Nuevo análisis</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <Lightbulb className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>Completa el diseño de investigación y ejecuta el análisis de IA</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'history' && (
            <div className="space-y-4">
              {analysisHistory.length > 0 ? (
                analysisHistory.map((analysis) => (
                  <div key={analysis.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="font-semibold text-gray-900">Análisis metodológico</h3>
                          <span className="text-2xl font-bold text-blue-600">
                            {(analysis.coherence_score * 100).toFixed(0)}%
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-4 text-sm text-gray-600 mb-3">
                          <div>
                            <span>Fortalezas:</span>
                            <span className="font-medium text-green-600 ml-1">{analysis.strengths.length}</span>
                          </div>
                          <div>
                            <span>Mejoras:</span>
                            <span className="font-medium text-orange-600 ml-1">{analysis.weaknesses.length}</span>
                          </div>
                          <div>
                            <span>Recomendaciones:</span>
                            <span className="font-medium text-blue-600 ml-1">{analysis.recommendations.length}</span>
                          </div>
                        </div>
                        
                        <p className="text-xs text-gray-500">
                          {new Date(analysis.created_at!).toLocaleString()}
                        </p>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <button 
                          onClick={() => setCurrentAnalysis(analysis)}
                          className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-colors">
                          <Download className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <History className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>No hay análisis previos</p>
                  <p className="text-sm mt-2">Los análisis de metodología aparecerán aquí</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MethodologyModule;