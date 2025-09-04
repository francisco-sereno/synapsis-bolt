import React, { useState } from 'react';
import { 
  Shield, 
  Brain, 
  Users, 
  CheckCircle, 
  AlertTriangle, 
  Lightbulb,
  Target,
  MessageSquare,
  BarChart3,
  Eye,
  Settings
} from 'lucide-react';
import { usePrevalidation } from '../hooks/usePrevalidation';

// Types for validation results
interface CognitiveInterviewResult {
  responses: {
    questionNumber: number;
    interpretation: string;
    retrievalProcess: string;
    judgmentAndResponse: string;
    difficulties: string;
  }[];
  overallExperience: {
    length: string;
    flow: string;
    interest: string;
    recommendations: string[];
  };
}

interface TechnicalReviewResult {
  detailedReview: {
    itemNumber: number;
    problemDetected: string;
    improvementSuggestion: string;
  }[];
  overallScore: number;
  generalStrengths: string[];
  finalRecommendations: string[];
}

interface DepthAnalysisResult {
  depthPotential: {
    score: number;
    analysis: string;
    suggestions: string[];
  };
  opennessNeutrality: {
    score: number;
    closedQuestions: {
      original: string;
      reformulated: string;
    }[];
  };
  flowTransitions: {
    score: number;
    feedback: string;
    improvements: string[];
  };
  probeQuality: {
    score: number;
    suggestedProbes: string[];
  };
}

interface ReflexivityReviewResult {
  identifiedAssumptions: string[];
  loadedQuestions: {
    original: string;
    bias: string;
    neutral: string;
  }[];
  framingIssues: {
    issue: string;
    limitation: string;
    suggestion: string;
  }[];
}

interface ExpertPanelResult {
  panelSynthesis: {
    cviScore: number;
    agreements: string[];
    disagreements: string[];
    priorityChanges: string[];
  };
  judge1_thematic: {
    generalComments: string;
    sufficiency: string;
  };
  judge2_methodological: {
    generalComments: string;
    technicalQuality: string;
  };
  judge3_contextual: {
    generalComments: string;
    contextualAdequacy: string;
  };
}

type ValidationResult =
  | CognitiveInterviewResult
  | TechnicalReviewResult
  | DepthAnalysisResult
  | ReflexivityReviewResult
  | ExpertPanelResult
  | null;


const InstrumentPrevalidation = () => {
  const {
    loading,
    error,
    runCognitiveInterview,
    runTechnicalReview,
    runDepthAnalysis,
    runReflexivityReview,
    runFieldPilotSimulation,
    runExpertPanelSimulation
  } = usePrevalidation();

  const [activeTab, setActiveTab] = useState('quantitative');
  const [instrumentText, setInstrumentText] = useState('');
  const [validationParams, setValidationParams] = useState({
    targetPopulation: '',
    objective: '',
    phenomenon: '',
    studyContext: ''
  });
  const [results, setResults] = useState<ValidationResult>(null);
  const [activeValidation, setActiveValidation] = useState<string | null>(null);

  const quantitativeValidations = [
    {
      id: 'cognitive',
      name: 'Entrevista Cognitiva (Think Aloud)',
      description: 'Simula cómo un participante real interpretaría y respondería cada pregunta',
      icon: Brain,
      color: 'blue',
      requiredParams: ['targetPopulation', 'objective']
    },
    {
      id: 'technical',
      name: 'Revisión Técnica y Psicométrica',
      description: 'Análisis metodológico exhaustivo de sesgos, claridad y construcción de ítems',
      icon: Settings,
      color: 'green',
      requiredParams: ['targetPopulation', 'objective']
    },
    {
      id: 'expert-panel',
      name: 'Panel de Juicio de Expertos',
      description: 'Simulación de validación por tres perfiles de expertos especializados',
      icon: Users,
      color: 'purple',
      requiredParams: ['targetPopulation', 'objective']
    }
  ];

  const qualitativeValidations = [
    {
      id: 'depth',
      name: 'Análisis de Profundidad y Apertura',
      description: 'Evalúa el potencial de las preguntas para generar narrativas ricas',
      icon: MessageSquare,
      color: 'indigo',
      requiredParams: ['phenomenon', 'targetPopulation']
    },
    {
      id: 'reflexivity',
      name: 'Revisión de Reflexividad y Sesgo',
      description: 'Identifica supuestos del investigador y preguntas cargadas',
      icon: Eye,
      color: 'orange',
      requiredParams: ['objective']
    },
    {
      id: 'field-pilot',
      name: 'Simulación de Piloto en Campo',
      description: 'Anticipa dificultades prácticas durante la recolección',
      icon: Target,
      color: 'red',
      requiredParams: ['studyContext']
    }
  ];

  const tabs = [
    { id: 'quantitative', label: 'Instrumentos Cuantitativos', icon: BarChart3 },
    { id: 'qualitative', label: 'Instrumentos Cualitativos', icon: MessageSquare }
  ];

  const handleValidation = async (validationType: string) => {
    if (!instrumentText.trim()) {
      alert('Por favor ingresa el texto del instrumento');
      return;
    }

    setActiveValidation(validationType);
    setResults(null);

    try {
      let result;
      
      switch (validationType) {
        case 'cognitive':
          result = await runCognitiveInterview({
            instrument: instrumentText,
            targetPopulation: validationParams.targetPopulation,
            objective: validationParams.objective
          });
          break;
        case 'technical':
          result = await runTechnicalReview({
            instrument: instrumentText,
            objective: validationParams.objective,
            targetPopulation: validationParams.targetPopulation
          });
          break;
        case 'depth':
          result = await runDepthAnalysis({
            interviewGuide: instrumentText,
            phenomenon: validationParams.phenomenon,
            targetPopulation: validationParams.targetPopulation
          });
          break;
        case 'reflexivity':
          result = await runReflexivityReview({
            interviewGuide: instrumentText,
            researchObjective: validationParams.objective
          });
          break;
        case 'field-pilot':
          result = await runFieldPilotSimulation({
            interviewGuide: instrumentText,
            studyContext: validationParams.studyContext
          });
          break;
        case 'expert-panel':
          result = await runExpertPanelSimulation({
            instrument: instrumentText,
            objective: validationParams.objective,
            targetPopulation: validationParams.targetPopulation
          });
          break;
      }

      setResults(result);
    } catch (err) {
      console.error('Error en validación:', err);
    } finally {
      setActiveValidation(null);
    }
  };

  const renderQuantitativeResults = () => {
    if (!results) return null;

    if ('responses' in results) {
      // Cognitive Interview Results
      return (
        <div className="space-y-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 mb-2">Resultados de Entrevista Cognitiva</h3>
            <p className="text-sm text-blue-700">Análisis del protocolo "Think Aloud" simulado</p>
          </div>

          {(results as CognitiveInterviewResult).responses.map((response, index) => (
            <div key={index} className="bg-white border border-gray-200 rounded-lg p-6">
              <h4 className="font-semibold text-gray-900 mb-4">Pregunta #{response.questionNumber}</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div>
                    <h5 className="font-medium text-gray-700 mb-1">Interpretación</h5>
                    <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded">{response.interpretation}</p>
                  </div>
                  <div>
                    <h5 className="font-medium text-gray-700 mb-1">Proceso de Recuperación</h5>
                    <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded">{response.retrievalProcess}</p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <h5 className="font-medium text-gray-700 mb-1">Juicio y Respuesta</h5>
                    <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded">{response.judgmentAndResponse}</p>
                  </div>
                  <div>
                    <h5 className="font-medium text-gray-700 mb-1">Dificultades Identificadas</h5>
                    <p className="text-sm text-red-600 bg-red-50 p-3 rounded border border-red-200">{response.difficulties}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}

          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <h4 className="font-semibold text-green-900 mb-3">Experiencia General</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="font-medium text-green-800">Longitud:</span>
                <p className="text-green-700 mt-1">{(results as CognitiveInterviewResult).overallExperience.length}</p>
              </div>
              <div>
                <span className="font-medium text-green-800">Flujo:</span>
                <p className="text-green-700 mt-1">{(results as CognitiveInterviewResult).overallExperience.flow}</p>
              </div>
              <div>
                <span className="font-medium text-green-800">Interés:</span>
                <p className="text-green-700 mt-1">{(results as CognitiveInterviewResult).overallExperience.interest}</p>
              </div>
            </div>
            
            <div className="mt-4">
              <h5 className="font-medium text-green-800 mb-2">Recomendaciones:</h5>
              <ul className="space-y-1">
                {(results as CognitiveInterviewResult).overallExperience.recommendations.map((rec, index) => (
                  <li key={index} className="text-sm text-green-700 flex items-start">
                    <span className="w-1.5 h-1.5 bg-green-600 rounded-full mt-2 mr-2"></span>
                    {rec}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      );
    }

    if ('detailedReview' in results) {
      // Technical Review Results
      return (
        <div className="space-y-6">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h3 className="font-semibold text-green-900 mb-2">Revisión Técnica Metodológica</h3>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-green-700">Puntuación General:</span>
              <span className="font-bold text-green-800">{(results as TechnicalReviewResult).overallScore}/10</span>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h4 className="font-semibold text-gray-900 mb-4">Fortalezas del Instrumento</h4>
            <div className="space-y-2">
              {(results as TechnicalReviewResult).generalStrengths.map((strength, index) => (
                <div key={index} className="flex items-start space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                  <span className="text-sm text-gray-700">{strength}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="p-4 bg-gray-50 border-b border-gray-200">
              <h4 className="font-semibold text-gray-900">Revisión Detallada por Ítem</h4>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ítem #</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Problema Detectado</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sugerencia de Mejora</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {(results as TechnicalReviewResult).detailedReview.map((item, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">{item.itemNumber}</td>
                      <td className="px-4 py-3 text-sm text-red-600">{item.problemDetected}</td>
                      <td className="px-4 py-3 text-sm text-green-600">{item.improvementSuggestion}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
            <h4 className="font-semibold text-amber-900 mb-3">Recomendaciones Finales</h4>
            <div className="space-y-2">
              {(results as TechnicalReviewResult).finalRecommendations.map((rec, index) => (
                <div key={index} className="flex items-start space-x-2">
                  <Lightbulb className="w-4 h-4 text-amber-600 mt-0.5" />
                  <span className="text-sm text-amber-800">{rec}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }

    if ('panelSynthesis' in results) {
      return renderExpertPanelResults();
    }

    return null;
  };

  const renderQualitativeResults = () => {
    if (!results) return null;

    if ('depthPotential' in results) {
      // Depth Analysis Results
      return (
        <div className="space-y-6">
          <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
            <h3 className="font-semibold text-indigo-900 mb-2">Análisis de Profundidad y Apertura</h3>
            <p className="text-sm text-indigo-700">Evaluación del potencial para generar narrativas ricas</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                <Target className="w-5 h-5 text-blue-600 mr-2" />
                Potencial de Profundidad
              </h4>
              <div className="mb-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Puntuación</span>
                  <span className="font-bold text-blue-600">{(results as DepthAnalysisResult).depthPotential.score}/10</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${((results as DepthAnalysisResult).depthPotential.score / 10) * 100}%` }}
                  />
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-3">{(results as DepthAnalysisResult).depthPotential.analysis}</p>
              <div className="space-y-1">
                {(results as DepthAnalysisResult).depthPotential.suggestions.map((suggestion, index) => (
                  <div key={index} className="flex items-start space-x-2">
                    <Lightbulb className="w-3 h-3 text-blue-600 mt-1" />
                    <span className="text-xs text-blue-700">{suggestion}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                <MessageSquare className="w-5 h-5 text-green-600 mr-2" />
                Apertura y Neutralidad
              </h4>
              <div className="mb-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Puntuación</span>
                  <span className="font-bold text-green-600">{(results as DepthAnalysisResult).opennessNeutrality.score}/10</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-600 h-2 rounded-full"
                    style={{ width: `${((results as DepthAnalysisResult).opennessNeutrality.score / 10) * 100}%` }}
                  />
                </div>
              </div>
              
              <h5 className="font-medium text-gray-700 mb-2">Preguntas a Reformular:</h5>
              <div className="space-y-2">
                {(results as DepthAnalysisResult).opennessNeutrality.closedQuestions.map((question, index) => (
                  <div key={index} className="bg-gray-50 p-3 rounded">
                    <p className="text-xs text-red-600 mb-1">Original: {question.original}</p>
                    <p className="text-xs text-green-600">Sugerida: {question.reformulated}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h4 className="font-semibold text-gray-900 mb-4">Flujo y Transiciones</h4>
              <div className="mb-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Puntuación</span>
                  <span className="font-bold text-purple-600">{(results as DepthAnalysisResult).flowTransitions.score}/10</span>
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-3">{(results as DepthAnalysisResult).flowTransitions.feedback}</p>
              <div className="space-y-1">
                {(results as DepthAnalysisResult).flowTransitions.improvements.map((improvement, index) => (
                  <div key={index} className="flex items-start space-x-2">
                    <AlertTriangle className="w-3 h-3 text-orange-600 mt-1" />
                    <span className="text-xs text-orange-700">{improvement}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h4 className="font-semibold text-gray-900 mb-4">Calidad de Sondas</h4>
              <div className="mb-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Puntuación</span>
                  <span className="font-bold text-indigo-600">{(results as DepthAnalysisResult).probeQuality.score}/10</span>
                </div>
              </div>
              
              <div className="space-y-3">
                <div>
                  <h5 className="font-medium text-gray-700 mb-2">Sondas Sugeridas:</h5>
                  <div className="space-y-1">
                    {(results as DepthAnalysisResult).probeQuality.suggestedProbes.map((probe, index) => (
                      <div key={index} className="text-xs text-indigo-700 bg-indigo-50 p-2 rounded">
                        "{probe}"
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    if ('identifiedAssumptions' in results) {
      // Reflexivity Review Results
      return (
        <div className="space-y-6">
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <h3 className="font-semibold text-orange-900 mb-2">Revisión de Reflexividad y Sesgo</h3>
            <p className="text-sm text-orange-700">Identificación de supuestos y sesgos del investigador</p>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h4 className="font-semibold text-gray-900 mb-4">Supuestos Identificados</h4>
            <div className="space-y-2">
              {(results as ReflexivityReviewResult).identifiedAssumptions.map((assumption, index) => (
                <div key={index} className="flex items-start space-x-2">
                  <AlertTriangle className="w-4 h-4 text-orange-600 mt-0.5" />
                  <span className="text-sm text-orange-800">{assumption}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h4 className="font-semibold text-gray-900 mb-4">Preguntas Cargadas Detectadas</h4>
            <div className="space-y-4">
              {(results as ReflexivityReviewResult).loadedQuestions.map((question, index) => (
                <div key={index} className="border border-red-200 rounded-lg p-4 bg-red-50">
                  <div className="mb-2">
                    <span className="text-xs font-medium text-red-800">Original:</span>
                    <p className="text-sm text-red-700">{question.original}</p>
                  </div>
                  <div className="mb-2">
                    <span className="text-xs font-medium text-red-800">Sesgo Detectado:</span>
                    <p className="text-sm text-red-600">{question.bias}</p>
                  </div>
                  <div>
                    <span className="text-xs font-medium text-green-800">Versión Neutral:</span>
                    <p className="text-sm text-green-700">{question.neutral}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h4 className="font-semibold text-gray-900 mb-4">Problemas de Encuadre</h4>
            <div className="space-y-4">
              {(results as ReflexivityReviewResult).framingIssues.map((issue, index) => (
                <div key={index} className="border border-yellow-200 rounded-lg p-4 bg-yellow-50">
                  <h5 className="font-medium text-yellow-900 mb-1">{issue.issue}</h5>
                  <p className="text-sm text-yellow-800 mb-2">Limitación: {issue.limitation}</p>
                  <p className="text-sm text-yellow-700">Sugerencia: {issue.suggestion}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }

    return null;
  };

  const renderExpertPanelResults = () => {
    if (!results || !('panelSynthesis' in results)) return null;

    return (
      <div className="space-y-6">
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <h3 className="font-semibold text-purple-900 mb-2">Panel de Juicio de Expertos</h3>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-purple-700">Índice de Validez de Contenido (CVI):</span>
            <span className="font-bold text-purple-800">{results.panelSynthesis.cviScore}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Judge 1 - Thematic */}
          <div className="bg-white border border-blue-200 rounded-lg p-6">
            <h4 className="font-semibold text-blue-900 mb-3">Juez 1: Experto Temático</h4>
            <div className="space-y-3 text-sm">
              <div>
                <h5 className="font-medium text-blue-800">Comentarios Generales:</h5>
                <p className="text-blue-700">{results.judge1_thematic.generalComments}</p>
              </div>
              <div>
                <h5 className="font-medium text-blue-800">Suficiencia:</h5>
                <p className="text-blue-700">{results.judge1_thematic.sufficiency}</p>
              </div>
            </div>
          </div>

          {/* Judge 2 - Methodological */}
          <div className="bg-white border border-green-200 rounded-lg p-6">
            <h4 className="font-semibold text-green-900 mb-3">Juez 2: Experto Metodológico</h4>
            <div className="space-y-3 text-sm">
              <div>
                <h5 className="font-medium text-green-800">Comentarios Generales:</h5>
                <p className="text-green-700">{results.judge2_methodological.generalComments}</p>
              </div>
              <div>
                <h5 className="font-medium text-green-800">Calidad Técnica:</h5>
                <p className="text-green-700">{results.judge2_methodological.technicalQuality}</p>
              </div>
            </div>
          </div>

          {/* Judge 3 - Contextual */}
          <div className="bg-white border border-orange-200 rounded-lg p-6">
            <h4 className="font-semibold text-orange-900 mb-3">Juez 3: Experto Contextual</h4>
            <div className="space-y-3 text-sm">
              <div>
                <h5 className="font-medium text-orange-800">Comentarios Generales:</h5>
                <p className="text-orange-700">{results.judge3_contextual.generalComments}</p>
              </div>
              <div>
                <h5 className="font-medium text-orange-800">Adecuación Contextual:</h5>
                <p className="text-orange-700">{results.judge3_contextual.contextualAdequacy}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h4 className="font-semibold text-gray-900 mb-4">Síntesis del Panel</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h5 className="font-medium text-green-800 mb-2">Acuerdos Principales</h5>
              <div className="space-y-1">
                {results.panelSynthesis.agreements.map((agreement, index) => (
                  <div key={index} className="flex items-start space-x-2">
                    <CheckCircle className="w-3 h-3 text-green-600 mt-1" />
                    <span className="text-sm text-green-700">{agreement}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h5 className="font-medium text-red-800 mb-2">Desacuerdos y Divergencias</h5>
              <div className="space-y-1">
                {results.panelSynthesis.disagreements.map((disagreement, index) => (
                  <div key={index} className="flex items-start space-x-2">
                    <AlertTriangle className="w-3 h-3 text-red-600 mt-1" />
                    <span className="text-sm text-red-700">{disagreement}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-6 bg-amber-50 border border-amber-200 rounded-lg p-4">
            <h5 className="font-medium text-amber-900 mb-2">Cambios Prioritarios</h5>
            <div className="space-y-1">
              {results.panelSynthesis.priorityChanges.map((change, index) => (
                <div key={index} className="flex items-start space-x-2">
                  <span className="w-5 h-5 bg-amber-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                    {index + 1}
                  </span>
                  <span className="text-sm text-amber-800">{change}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Prevalidación de Instrumentos</h1>
        <p className="text-gray-600">Control de calidad riguroso antes de la aplicación en campo</p>
      </div>

      {/* Importance Banner */}
      <div className="bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-start space-x-3">
          <Shield className="w-6 h-6 text-red-600 mt-1" />
          <div>
            <h2 className="font-semibold text-red-900 mb-2">Principio: Garbage In, Garbage Out</h2>
            <p className="text-sm text-red-800 mb-3">
              La prevalidación es fundamental para asegurar que estamos midiendo o explorando lo que realmente queremos medir. 
              Un instrumento defectuoso, por muy sofisticado que sea el análisis posterior, producirá datos de mala calidad.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <h3 className="font-medium text-red-800 mb-1">Incluye:</h3>
                <ul className="text-red-700 space-y-1">
                  <li>• Juicio de expertos multidisciplinario</li>
                  <li>• Prueba piloto simulada</li>
                  <li>• Análisis de sesgos y supuestos</li>
                </ul>
              </div>
              <div>
                <h3 className="font-medium text-red-800 mb-1">Beneficios:</h3>
                <ul className="text-red-700 space-y-1">
                  <li>• Detecta problemas antes del campo</li>
                  <li>• Mejora la calidad de los datos</li>
                  <li>• Aumenta la validez del estudio</li>
                </ul>
              </div>
            </div>
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
          {/* Configuration Panel */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="lg:col-span-2 space-y-6">
              {/* Instrument Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Instrumento a Validar *
                </label>
                <textarea
                  value={instrumentText}
                  onChange={(e) => setInstrumentText(e.target.value)}
                  rows={12}
                  className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                  placeholder={activeTab === 'quantitative' 
                    ? "Pega aquí tu cuestionario o escala completa...\n\nEjemplo:\n1. ¿Cuál es su nivel de satisfacción con...?\n   a) Muy insatisfecho\n   b) Insatisfecho\n   c) Neutral\n   d) Satisfecho\n   e) Muy satisfecho"
                    : "Pega aquí tu guía de entrevista completa...\n\nEjemplo:\nBloque 1: Experiencias iniciales\n1. ¿Podría contarme sobre su primera experiencia con...?\n   Sondas: ¿Cómo se sintió? ¿Qué recuerda específicamente?"
                  }
                />
              </div>

              {/* Parameters */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Población Objetivo *
                  </label>
                  <input
                    type="text"
                    value={validationParams.targetPopulation}
                    onChange={(e) => setValidationParams({...validationParams, targetPopulation: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Ej: Docentes de primaria con experiencia tecnológica básica"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Objetivo del Instrumento *
                  </label>
                  <input
                    type="text"
                    value={validationParams.objective}
                    onChange={(e) => setValidationParams({...validationParams, objective: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Ej: Evaluar percepción sobre utilidad de plataformas educativas"
                  />
                </div>

                {activeTab === 'qualitative' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Fenómeno de Interés
                      </label>
                      <input
                        type="text"
                        value={validationParams.phenomenon}
                        onChange={(e) => setValidationParams({...validationParams, phenomenon: e.target.value})}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Ej: Adaptación docente a tecnología educativa"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Contexto del Estudio
                      </label>
                      <input
                        type="text"
                        value={validationParams.studyContext}
                        onChange={(e) => setValidationParams({...validationParams, studyContext: e.target.value})}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Ej: Entrevistas virtuales de 45 min con docentes ocupados"
                      />
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Validation Options */}
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900">Tipos de Prevalidación</h3>
              
              {(activeTab === 'quantitative' ? quantitativeValidations : qualitativeValidations).map((validation) => {
                const Icon = validation.icon;
                const isActive = activeValidation === validation.id;
                
                return (
                  <div
                    key={validation.id}
                    className={`border-2 rounded-lg p-4 transition-all ${
                      isActive ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-start space-x-3 mb-3">
                      <Icon className={`w-5 h-5 text-${validation.color}-600 mt-0.5`} />
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{validation.name}</h4>
                        <p className="text-sm text-gray-600 mt-1">{validation.description}</p>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => handleValidation(validation.id)}
                      disabled={loading || !instrumentText.trim() || 
                        validation.requiredParams.some(param => !validationParams[param as keyof typeof validationParams])}
                      className={`w-full px-4 py-2 bg-${validation.color}-600 text-white rounded-lg hover:bg-${validation.color}-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2`}
                    >
                      {isActive ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          <span>Validando...</span>
                        </>
                      ) : (
                        <>
                          <Icon className="w-4 h-4" />
                          <span>Ejecutar Validación</span>
                        </>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Results Section */}
          {results && (
            <div className="bg-white border border-gray-200 rounded-lg">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Resultados de Prevalidación</h2>
              </div>
              <div className="p-6">
                {activeTab === 'quantitative' && renderQuantitativeResults()}
                {activeTab === 'qualitative' && renderQualitativeResults()}
              </div>
            </div>
          )}

          {/* Error Display */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
                <div>
                  <h3 className="font-medium text-red-900">Error en Prevalidación</h3>
                  <p className="text-sm text-red-700 mt-1">{error}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InstrumentPrevalidation;