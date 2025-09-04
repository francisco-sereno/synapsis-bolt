import React, { useState } from 'react';
import { X, Target, Calendar, Building, FileText, Lightbulb, Users, BarChart3, MessageSquare, GitMerge } from 'lucide-react';
import { useProjects } from '../hooks/useProjects';
import { ResearchMethodology, MethodologyInfo } from '../types/research';

interface ProjectCreationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ProjectCreationModal: React.FC<ProjectCreationModalProps> = ({ isOpen, onClose }) => {
  const { createProject } = useProjects();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    methodology: '' as ResearchMethodology | '',
    design: '',
    status: 'planificacion' as 'planificacion' | 'activo' | 'completado' | 'pausado',
    institution: '',
    start_date: '',
    end_date: '',
    ethics_approval: ''
  });

  const methodologies: MethodologyInfo[] = [
    {
      id: 'quantitative',
      name: 'Metodología Cuantitativa',
      description: 'Se enfoca en la recolección de datos numéricos y su análisis estadístico para medir variables y establecer relaciones de causalidad.',
      category: 'fundamental',
      icon: '📊',
      designs: [
        {
          id: 'experimental_pure',
          name: 'Experimentos Puros',
          description: 'Manipulación de variables con asignación aleatoria a grupos de control y experimentales.',
          characteristics: ['Control total', 'Asignación aleatoria', 'Manipulación de variables', 'Relaciones causales']
        },
        {
          id: 'experimental_quasi',
          name: 'Cuasiexperimentos',
          description: 'Similares a experimentos puros pero sin asignación aleatoria, comunes en entornos naturales.',
          characteristics: ['Control parcial', 'Sin asignación aleatoria', 'Entornos naturales', 'Validez ecológica']
        },
        {
          id: 'experimental_pre',
          name: 'Preexperimentos',
          description: 'Grado mínimo de control, de carácter exploratorio.',
          characteristics: ['Control mínimo', 'Exploratorio', 'Diseño simple', 'Validez limitada']
        },
        {
          id: 'non_experimental_descriptive',
          name: 'Descriptivos',
          description: 'Especifican propiedades y características de un fenómeno.',
          characteristics: ['Observación natural', 'Descripción detallada', 'Sin manipulación', 'Caracterización']
        },
        {
          id: 'non_experimental_correlational',
          name: 'Correlacionales',
          description: 'Miden el grado de asociación entre variables sin establecer causalidad.',
          characteristics: ['Relaciones entre variables', 'Sin causalidad', 'Asociaciones', 'Predicción']
        },
        {
          id: 'non_experimental_transversal',
          name: 'Transversales',
          description: 'Recolectan datos en un único momento en el tiempo.',
          characteristics: ['Momento único', 'Fotografía temporal', 'Eficiencia', 'Prevalencia']
        },
        {
          id: 'non_experimental_longitudinal',
          name: 'Longitudinales',
          description: 'Recolectan datos a través del tiempo para analizar cambios y evoluciones.',
          characteristics: ['Seguimiento temporal', 'Cambios evolutivos', 'Causalidad temporal', 'Tendencias']
        }
      ]
    },
    {
      id: 'qualitative',
      name: 'Metodología Cualitativa',
      description: 'Explora y comprende en profundidad las experiencias, perspectivas y significados que los individuos atribuyen a un problema.',
      category: 'fundamental',
      icon: '🗣️',
      designs: [
        {
          id: 'narrative',
          name: 'Diseño Narrativo',
          description: 'Analiza las historias de vida y relatos de los individuos.',
          characteristics: ['Historias de vida', 'Relatos personales', 'Cronología', 'Experiencias individuales']
        },
        {
          id: 'phenomenological',
          name: 'Diseño Fenomenológico',
          description: 'Busca comprender la esencia de una experiencia vivida compartida por varias personas.',
          characteristics: ['Experiencias vividas', 'Esencias compartidas', 'Significados profundos', 'Conciencia']
        },
        {
          id: 'grounded_theory',
          name: 'Teoría Fundamentada',
          description: 'Desarrolla una teoría que emerge directamente de los datos recolectados.',
          characteristics: ['Teoría emergente', 'Codificación sistemática', 'Saturación teórica', 'Inductivo']
        },
        {
          id: 'ethnographic',
          name: 'Diseño Etnográfico',
          description: 'Describe e interpreta los patrones culturales, creencias y prácticas de un grupo.',
          characteristics: ['Inmersión cultural', 'Observación participante', 'Patrones culturales', 'Contexto natural']
        },
        {
          id: 'case_study',
          name: 'Estudio de Caso',
          description: 'Explora en profundidad un sistema delimitado a través de múltiples fuentes de información.',
          characteristics: ['Caso delimitado', 'Múltiples fuentes', 'Profundidad', 'Contexto específico']
        }
      ]
    },
    {
      id: 'mixed_methods',
      name: 'Metodología de Métodos Mixtos',
      description: 'Integra sistemáticamente métodos cuantitativos y cualitativos para obtener una comprensión más completa del fenómeno.',
      category: 'fundamental',
      icon: '🔄',
      designs: [
        {
          id: 'convergent_parallel',
          name: 'Convergente Paralelo',
          description: 'Datos cuantitativos y cualitativos se recolectan simultáneamente y se integran para interpretación.',
          characteristics: ['Recolección simultánea', 'Integración posterior', 'Igual prioridad', 'Triangulación']
        },
        {
          id: 'ditriac',
          name: 'DITRIAC',
          description: 'Diseño de Investigación Triangulado Concurrente enfocado en triangulación activa.',
          characteristics: ['Triangulación central', 'Convergencias', 'Divergencias', 'Complementariedades']
        },
        {
          id: 'exploratory_sequential',
          name: 'Exploratorio Secuencial (CUAL → CUAN)',
          description: 'Inicia con fase cualitativa que informa la construcción de una segunda fase cuantitativa.',
          characteristics: ['Cualitativo primero', 'Secuencial', 'Exploración inicial', 'Construcción de instrumentos']
        },
        {
          id: 'explanatory_sequential',
          name: 'Explicativo Secuencial (CUAN → CUAL)',
          description: 'Comienza cuantitativo, la fase cualitativa posterior profundiza y explica los resultados.',
          characteristics: ['Cuantitativo primero', 'Explicación posterior', 'Profundización', 'Interpretación']
        },
        {
          id: 'embedded',
          name: 'Anidado o Embebido',
          description: 'Un método predomina y el otro se inserta dentro para abordar una pregunta secundaria.',
          characteristics: ['Método dominante', 'Método secundario', 'Pregunta específica', 'Complementario']
        }
      ]
    },
    {
      id: 'netnography',
      name: 'Netnografía',
      description: 'Adaptación de la etnografía al estudio de culturas y comunidades en espacios digitales.',
      category: 'emergent',
      icon: '💻',
      designs: [
        {
          id: 'digital_ethnography',
          name: 'Etnografía Digital',
          description: 'Observación participante en comunidades virtuales.',
          characteristics: ['Comunidades virtuales', 'Observación digital', 'Interacción online', 'Culturas digitales']
        }
      ]
    },
    {
      id: 'participatory_action',
      name: 'Investigación-Acción Participativa (IAP)',
      description: 'Enfoque colaborativo donde la comunidad participa activamente como co-investigadora.',
      category: 'emergent',
      icon: '🤝',
      designs: [
        {
          id: 'collaborative_inquiry',
          name: 'Investigación Colaborativa',
          description: 'La comunidad participa en todo el proceso de investigación.',
          characteristics: ['Participación comunitaria', 'Co-investigación', 'Cambio social', 'Empoderamiento']
        }
      ]
    },
    {
      id: 'digital_humanities',
      name: 'Humanidades Digitales',
      description: 'Aplica herramientas computacionales y análisis de Big Data para investigar fenómenos sociales y culturales.',
      category: 'emergent',
      icon: '📊',
      designs: [
        {
          id: 'computational_analysis',
          name: 'Análisis Computacional',
          description: 'Análisis masivo de textos, redes y visualización de datos.',
          characteristics: ['Big Data', 'Análisis de textos', 'Visualización', 'Herramientas computacionales']
        }
      ]
    },
    {
      id: 'arts_based',
      name: 'Investigación Basada en las Artes (IBA)',
      description: 'Utiliza procesos creativos y formas artísticas como método para investigar y representar la experiencia humana.',
      category: 'emergent',
      icon: '🎨',
      designs: [
        {
          id: 'creative_inquiry',
          name: 'Investigación Creativa',
          description: 'Uso de teatro, fotografía, poesía como métodos de investigación.',
          characteristics: ['Procesos creativos', 'Conocimiento estético', 'Representación artística', 'Experiencia emocional']
        }
      ]
    },
    {
      id: 'neuroscientific',
      name: 'Métodos Neurocientíficos',
      description: 'Emplea herramientas de neurociencia para investigar procesos cognitivos y emocionales en comportamiento social.',
      category: 'emergent',
      icon: '🧠',
      designs: [
        {
          id: 'neuro_behavioral',
          name: 'Neurocomportamental',
          description: 'Eye-tracking, EEG para estudiar comportamiento social y educativo.',
          characteristics: ['Eye-tracking', 'EEG', 'Procesos cognitivos', 'Comportamiento social']
        }
      ]
    },
    {
      id: 'autoethnography',
      name: 'Autoetnografía',
      description: 'El investigador utiliza su propia experiencia como dato primario para analizar fenómenos culturales más amplios.',
      category: 'emergent',
      icon: '🧑‍🔬',
      designs: [
        {
          id: 'personal_narrative',
          name: 'Narrativa Personal',
          description: 'Experiencia personal como dato para análisis cultural.',
          characteristics: ['Experiencia personal', 'Reflexividad', 'Conexión personal-social', 'Autoexploración']
        }
      ]
    },
    {
      id: 'ai_research',
      name: 'Investigación con IA',
      description: 'Campo dual que utiliza IA como herramienta de análisis y estudia el impacto de la IA en la sociedad.',
      category: 'emergent',
      icon: '🤖',
      designs: [
        {
          id: 'ai_assisted',
          name: 'Asistida por IA',
          description: 'Utiliza IA como herramienta potente de análisis de datos.',
          characteristics: ['Análisis automatizado', 'Procesamiento masivo', 'Patrones complejos', 'Eficiencia']
        },
        {
          id: 'ai_impact',
          name: 'Impacto de IA',
          description: 'Estudia sesgos algorítmicos e interacción humano-máquina.',
          characteristics: ['Sesgos algorítmicos', 'Interacción humano-IA', 'Impacto social', 'Ética tecnológica']
        }
      ]
    },
    {
      id: 'q_methodology',
      name: 'Metodología Q',
      description: 'Método mixto sofisticado para estudiar subjetividad, combinando clasificación cualitativa con análisis factorial.',
      category: 'emergent',
      icon: '🧩',
      designs: [
        {
          id: 'q_sort',
          name: 'Q-Sort',
          description: 'Clasificación de declaraciones con análisis factorial para identificar perfiles de pensamiento.',
          characteristics: ['Clasificación Q', 'Análisis factorial', 'Subjetividad', 'Perfiles de pensamiento']
        }
      ]
    }
  ];

  const statusOptions = [
    { value: 'planificacion', label: 'Planificación', color: 'blue', description: 'Proyecto en fase de diseño y planificación' },
    { value: 'activo', label: 'Activo', color: 'green', description: 'Proyecto en ejecución activa' },
    { value: 'completado', label: 'Completado', color: 'gray', description: 'Proyecto finalizado exitosamente' },
    { value: 'pausado', label: 'Pausado', color: 'yellow', description: 'Proyecto temporalmente suspendido' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.methodology || !formData.design) {
      setError('Por favor completa todos los campos obligatorios');
      return;
    }

    setLoading(true);
    setError(null);

    const { error } = await createProject({
      name: formData.name.trim(),
      description: formData.description.trim() || undefined,
      methodology: formData.methodology,
      design: formData.design,
      status: formData.status,
      institution: formData.institution.trim() || undefined,
      start_date: formData.start_date || undefined,
      end_date: formData.end_date || undefined,
      ethics_approval: formData.ethics_approval.trim() || undefined,
    });

    if (error) {
      setError(error.message);
    } else {
      onClose();
      // Reset form
      setFormData({
        name: '',
        description: '',
        methodology: '',
        design: '',
        status: 'planificacion',
        institution: '',
        start_date: '',
        end_date: '',
        ethics_approval: ''
      });
      setCurrentStep(1);
    }

    setLoading(false);
  };

  const selectedMethodology = methodologies.find(m => m.id === formData.methodology);
  const availableDesigns = selectedMethodology?.designs || [];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900">Crear Nuevo Proyecto</h2>
              <p className="text-gray-600 mt-1">Configura tu proyecto de investigación paso a paso</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center space-x-4 mt-6">
            {[
              { step: 1, label: 'Información Básica' },
              { step: 2, label: 'Metodología' },
              { step: 3, label: 'Configuración' }
            ].map((item) => (
              <div key={item.step} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  currentStep >= item.step 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {item.step}
                </div>
                <span className={`ml-2 text-sm ${
                  currentStep >= item.step ? 'text-blue-600 font-medium' : 'text-gray-500'
                }`}>
                  {item.label}
                </span>
                {item.step < 3 && <div className="w-8 h-0.5 bg-gray-200 mx-4" />}
              </div>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {/* Step 1: Basic Information */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre del Proyecto *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ej: Efectividad de la Educación Virtual en Pandemia"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descripción del Proyecto
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Describe el propósito, alcance y objetivos principales de tu investigación..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Estado del Proyecto *
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {statusOptions.map((status) => (
                    <div
                      key={status.value}
                      onClick={() => setFormData({ ...formData, status: status.value as any })}
                      className={`cursor-pointer border-2 rounded-lg p-4 transition-all ${
                        formData.status === status.value
                          ? `border-${status.color}-500 bg-${status.color}-50`
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <h3 className={`font-medium ${
                        formData.status === status.value ? `text-${status.color}-900` : 'text-gray-900'
                      }`}>
                        {status.label}
                      </h3>
                      <p className={`text-sm mt-1 ${
                        formData.status === status.value ? `text-${status.color}-700` : 'text-gray-600'
                      }`}>
                        {status.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Institución
                  </label>
                  <input
                    type="text"
                    value={formData.institution}
                    onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Universidad Nacional"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Código de Aprobación Ética
                  </label>
                  <input
                    type="text"
                    value={formData.ethics_approval}
                    onChange={(e) => setFormData({ ...formData, ethics_approval: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="CEI-2024-001"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Methodology Selection */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Seleccionar Metodología de Investigación *</h3>
                
                {/* Fundamental Methodologies */}
                <div className="mb-6">
                  <h4 className="text-md font-medium text-gray-700 mb-3">Metodologías Fundamentales</h4>
                  <div className="grid grid-cols-1 gap-4">
                    {methodologies.filter(m => m.category === 'fundamental').map((methodology) => (
                      <div
                        key={methodology.id}
                        onClick={() => setFormData({ ...formData, methodology: methodology.id, design: '' })}
                        className={`cursor-pointer border-2 rounded-lg p-4 transition-all ${
                          formData.methodology === methodology.id
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-start space-x-3">
                          <span className="text-2xl">{methodology.icon}</span>
                          <div className="flex-1">
                            <h3 className={`font-semibold ${
                              formData.methodology === methodology.id ? 'text-blue-900' : 'text-gray-900'
                            }`}>
                              {methodology.name}
                            </h3>
                            <p className={`text-sm mt-1 ${
                              formData.methodology === methodology.id ? 'text-blue-700' : 'text-gray-600'
                            }`}>
                              {methodology.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Emergent Methodologies */}
                <div>
                  <h4 className="text-md font-medium text-gray-700 mb-3">Metodologías Emergentes y Contemporáneas</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {methodologies.filter(m => m.category === 'emergent').map((methodology) => (
                      <div
                        key={methodology.id}
                        onClick={() => setFormData({ ...formData, methodology: methodology.id, design: '' })}
                        className={`cursor-pointer border-2 rounded-lg p-4 transition-all ${
                          formData.methodology === methodology.id
                            ? 'border-purple-500 bg-purple-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-start space-x-3">
                          <span className="text-xl">{methodology.icon}</span>
                          <div className="flex-1">
                            <h3 className={`font-medium ${
                              formData.methodology === methodology.id ? 'text-purple-900' : 'text-gray-900'
                            }`}>
                              {methodology.name}
                            </h3>
                            <p className={`text-sm mt-1 ${
                              formData.methodology === methodology.id ? 'text-purple-700' : 'text-gray-600'
                            }`}>
                              {methodology.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Design Selection */}
              {selectedMethodology && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Seleccionar Diseño de Investigación *
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {availableDesigns.map((design) => (
                      <div
                        key={design.id}
                        onClick={() => setFormData({ ...formData, design: design.id })}
                        className={`cursor-pointer border-2 rounded-lg p-4 transition-all ${
                          formData.design === design.id
                            ? 'border-green-500 bg-green-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <h4 className={`font-medium mb-2 ${
                          formData.design === design.id ? 'text-green-900' : 'text-gray-900'
                        }`}>
                          {design.name}
                        </h4>
                        <p className={`text-sm mb-3 ${
                          formData.design === design.id ? 'text-green-700' : 'text-gray-600'
                        }`}>
                          {design.description}
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {design.characteristics.map((char, index) => (
                            <span
                              key={index}
                              className={`px-2 py-1 rounded text-xs ${
                                formData.design === design.id
                                  ? 'bg-green-100 text-green-700'
                                  : 'bg-gray-100 text-gray-600'
                              }`}
                            >
                              {char}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 3: Additional Configuration */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fecha de Inicio
                  </label>
                  <input
                    type="date"
                    value={formData.start_date}
                    onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fecha de Finalización Estimada
                  </label>
                  <input
                    type="date"
                    value={formData.end_date}
                    onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Project Summary */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h4 className="font-semibold text-gray-900 mb-4">Resumen del proyecto</h4>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Nombre:</span>
                    <span className="font-medium text-gray-900">{formData.name || 'Sin especificar'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Estado:</span>
                    <span className={`font-medium ${
                      formData.status === 'activo' ? 'text-green-600' :
                      formData.status === 'planificacion' ? 'text-blue-600' :
                      formData.status === 'completado' ? 'text-gray-600' :
                      'text-yellow-600'
                    }`}>
                      {statusOptions.find(s => s.value === formData.status)?.label}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Metodología:</span>
                    <span className="font-medium text-gray-900">
                      {selectedMethodology?.name || 'Sin seleccionar'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Diseño:</span>
                    <span className="font-medium text-gray-900">
                      {availableDesigns.find(d => d.id === formData.design)?.name || 'Sin seleccionar'}
                    </span>
                  </div>
                  {formData.institution && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Institución:</span>
                      <span className="font-medium text-gray-900">{formData.institution}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
            <div>
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={() => setCurrentStep(currentStep - 1)}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Anterior
                </button>
              )}
            </div>

            <div className="flex space-x-3">
              {currentStep < 3 ? (
                <button
                  type="button"
                  onClick={() => setCurrentStep(currentStep + 1)}
                  disabled={
                    (currentStep === 1 && !formData.name.trim()) ||
                    (currentStep === 2 && (!formData.methodology || !formData.design))
                  }
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                  Siguiente
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={loading || !formData.name.trim() || !formData.methodology || !formData.design}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Creando...</span>
                    </>
                  ) : (
                    <>
                      <Target className="w-4 h-4" />
                      <span>Crear Proyecto</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProjectCreationModal;