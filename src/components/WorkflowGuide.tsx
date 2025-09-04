import React, { useState } from 'react';
import { 
  ChevronRight, 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  Target,
  Users,
  ClipboardList,
  Database,
  BarChart3,
  FileText,
  Lightbulb
} from 'lucide-react';

interface WorkflowStep {
  id: string;
  phase: string;
  title: string;
  description: string;
  features: string[];
  aiFunction: string;
  status: 'completed' | 'current' | 'pending';
  estimatedTime: string;
  icon: React.ComponentType<any>;
}

const WorkflowGuide = () => {
  const [activePhase, setActivePhase] = useState('design');

  const workflowSteps: WorkflowStep[] = [
    {
      id: 'methodology',
      phase: 'design',
      title: 'Asistente Metodológico',
      description: 'Recibe feedback de IA sobre la coherencia entre problema, preguntas y objetivos',
      features: [
        'Evaluación de coherencia metodológica',
        'Análisis de alineación entre componentes',
        'Recomendaciones de mejora específicas',
        'Puntuación de calidad metodológica'
      ],
      aiFunction: 'methodologicalAssistant',
      status: 'completed',
      estimatedTime: '15-20 min',
      icon: Target
    },
    {
      id: 'sample',
      phase: 'design',
      title: 'Calculadora de Muestra',
      description: 'Calcula el tamaño de muestra estadísticamente representativo',
      features: [
        'Cálculo automático de tamaño de muestra',
        'Interpretación de resultados',
        'Recomendaciones de ajuste',
        'Consideraciones de pérdida de participantes'
      ],
      aiFunction: 'sampleSizeCalculator',
      status: 'completed',
      estimatedTime: '5-10 min',
      icon: Users
    },
    {
      id: 'instruments',
      phase: 'instruments',
      title: 'Diseño de Instrumentos',
      description: 'Crea y valida instrumentos de investigación con asistencia de IA',
      features: [
        'Generación desde documentos existentes',
        'Validación automática de calidad',
        'Análisis de sesgo y claridad',
        'Cálculo de índices de validez'
      ],
      aiFunction: 'validateInstrument',
      status: 'current',
      estimatedTime: '30-45 min',
      icon: ClipboardList
    },
    {
      id: 'collection',
      phase: 'collection',
      title: 'Recolección de Datos',
      description: 'Gestiona la recopilación y transcripción automática de datos',
      features: [
        'Transcripción automática de audio',
        'Extracción de texto de documentos',
        'Monitoreo en tiempo real',
        'Control de calidad de datos'
      ],
      aiFunction: 'transcribeAudio',
      status: 'pending',
      estimatedTime: '2-4 semanas',
      icon: Database
    },
    {
      id: 'analysis',
      phase: 'analysis',
      title: 'Análisis de Datos',
      description: 'Ejecuta análisis estadísticos con interpretación automática',
      features: [
        'Análisis descriptivo e inferencial',
        'Correlaciones y pruebas de hipótesis',
        'Análisis de fiabilidad',
        'Interpretación automática de resultados'
      ],
      aiFunction: 'descriptiveAnalysis',
      status: 'pending',
      estimatedTime: '1-2 semanas',
      icon: BarChart3
    },
    {
      id: 'triangulation',
      phase: 'interpretation',
      title: 'Triangulación y Síntesis',
      description: 'Integra múltiples fuentes de datos para hallazgos robustos',
      features: [
        'Triangulación metodológica automática',
        'Identificación de convergencias',
        'Análisis de divergencias',
        'Generación de meta-inferencias'
      ],
      aiFunction: 'triangulateFindings',
      status: 'pending',
      estimatedTime: '3-5 días',
      icon: Lightbulb
    },
    {
      id: 'reporting',
      phase: 'reporting',
      title: 'Generación de Reportes',
      description: 'Crea reportes profesionales automáticamente',
      features: [
        'Múltiples plantillas disponibles',
        'Generación automática de secciones',
        'Revisión por pares simulada',
        'Exportación en múltiples formatos'
      ],
      aiFunction: 'generateReport',
      status: 'pending',
      estimatedTime: '2-3 días',
      icon: FileText
    }
  ];

  const phases = [
    { id: 'design', label: 'Diseño y Planificación', color: 'blue' },
    { id: 'instruments', label: 'Diseño de Instrumentos', color: 'green' },
    { id: 'collection', label: 'Recolección de Datos', color: 'purple' },
    { id: 'analysis', label: 'Análisis de Datos', color: 'orange' },
    { id: 'interpretation', label: 'Interpretación', color: 'indigo' },
    { id: 'reporting', label: 'Reportes', color: 'red' }
  ];

  const filteredSteps = workflowSteps.filter(step => step.phase === activePhase);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'current':
        return <Clock className="w-5 h-5 text-blue-600" />;
      case 'pending':
        return <AlertCircle className="w-5 h-5 text-gray-400" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'border-green-200 bg-green-50';
      case 'current':
        return 'border-blue-200 bg-blue-50';
      case 'pending':
        return 'border-gray-200 bg-gray-50';
      default:
        return 'border-gray-200 bg-gray-50';
    }
  };

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Flujo de Trabajo de Investigación</h1>
        <p className="text-gray-600">Guía interactiva del proceso de investigación asistido por IA</p>
      </div>

      {/* Phase Navigation */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Fases de Investigación</h2>
        <div className="flex flex-wrap gap-2">
          {phases.map((phase) => (
            <button
              key={phase.id}
              onClick={() => setActivePhase(phase.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activePhase === phase.id
                  ? `bg-${phase.color}-100 text-${phase.color}-700 border border-${phase.color}-200`
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {phase.label}
            </button>
          ))}
        </div>
      </div>

      {/* Workflow Steps */}
      <div className="space-y-4">
        {filteredSteps.map((step, index) => {
          const Icon = step.icon;
          return (
            <div
              key={step.id}
              className={`border rounded-lg p-6 transition-all hover:shadow-md ${getStatusColor(step.status)}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4 flex-1">
                  <div className="flex items-center space-x-3">
                    <div className={`p-3 rounded-lg ${
                      step.status === 'completed' ? 'bg-green-100' :
                      step.status === 'current' ? 'bg-blue-100' :
                      'bg-gray-100'
                    }`}>
                      <Icon className={`w-6 h-6 ${
                        step.status === 'completed' ? 'text-green-600' :
                        step.status === 'current' ? 'text-blue-600' :
                        'text-gray-400'
                      }`} />
                    </div>
                    {getStatusIcon(step.status)}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{step.title}</h3>
                      <span className="text-sm text-gray-500">({step.estimatedTime})</span>
                    </div>
                    
                    <p className="text-gray-600 mb-4">{step.description}</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <h4 className="font-medium text-gray-700 mb-2">Características Principales</h4>
                        <ul className="space-y-1">
                          {step.features.map((feature, idx) => (
                            <li key={idx} className="flex items-center space-x-2 text-sm text-gray-600">
                              <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="font-medium text-gray-700 mb-2">Función de IA</h4>
                        <div className="bg-white rounded-lg p-3 border border-gray-200">
                          <code className="text-sm text-purple-600 font-mono">
                            {step.aiFunction}()
                          </code>
                          <p className="text-xs text-gray-500 mt-1">
                            Función especializada de inteligencia artificial
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          step.status === 'completed' ? 'bg-green-100 text-green-700' :
                          step.status === 'current' ? 'bg-blue-100 text-blue-700' :
                          'bg-gray-100 text-gray-600'
                        }`}>
                          {step.status === 'completed' ? 'Completado' :
                           step.status === 'current' ? 'En Progreso' :
                           'Pendiente'}
                        </span>
                      </div>
                      
                      <button className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        step.status === 'current' 
                          ? 'bg-blue-600 text-white hover:bg-blue-700'
                          : step.status === 'completed'
                          ? 'bg-green-600 text-white hover:bg-green-700'
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}>
                        <span>
                          {step.status === 'current' ? 'Continuar' :
                           step.status === 'completed' ? 'Revisar' :
                           'Próximamente'}
                        </span>
                        {step.status !== 'pending' && <ChevronRight className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* AI Functions Reference */}
      <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl border border-purple-200 p-6">
        <h2 className="text-lg font-semibold text-purple-900 mb-4 flex items-center">
          <Lightbulb className="w-5 h-5 mr-2" />
          Funciones de IA Disponibles
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { name: 'methodologicalAssistant', description: 'Evalúa coherencia metodológica' },
            { name: 'validateInstrument', description: 'Valida calidad de instrumentos' },
            { name: 'transcribeAudio', description: 'Transcribe audio automáticamente' },
            { name: 'descriptiveAnalysis', description: 'Análisis estadístico descriptivo' },
            { name: 'triangulateFindings', description: 'Integra múltiples fuentes' },
            { name: 'generateReport', description: 'Genera reportes profesionales' }
          ].map((func, index) => (
            <div key={index} className="bg-white rounded-lg p-4 border border-purple-200">
              <code className="text-sm font-mono text-purple-600 font-semibold">
                {func.name}()
              </code>
              <p className="text-xs text-gray-600 mt-1">{func.description}</p>
            </div>
          ))}
        </div>
        
        <div className="mt-4 p-4 bg-white rounded-lg border border-purple-200">
          <p className="text-sm text-purple-800">
            <strong>💡 Tip:</strong> Cada función de IA está optimizada para una fase específica del proceso de investigación, 
            garantizando resultados precisos y contextualmente relevantes.
          </p>
        </div>
      </div>
    </div>
  );
};

export default WorkflowGuide;