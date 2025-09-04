import React, { useState } from 'react';
import { 
  FileText, 
  Brain, 
  Search, 
  Tag, 
  TrendingUp, 
  MessageSquare, 
  Upload,
  Download,
  Play,
  Pause,
  RotateCcw,
  CheckCircle,
  AlertCircle,
  Lightbulb,
  Network,
  Filter
} from 'lucide-react';

interface QualitativeData {
  id: string;
  source: string;
  type: 'interview' | 'focus_group' | 'observation' | 'document';
  content: string;
  timestamp: string;
  tags: string[];
  themes: string[];
  sentiment?: 'positive' | 'negative' | 'neutral';
}

interface Theme {
  id: string;
  name: string;
  description: string;
  frequency: number;
  sources: string[];
  subthemes: string[];
  quotes: string[];
}

interface AnalysisResult {
  themes: Theme[];
  patterns: string[];
  insights: string[];
  recommendations: string[];
}

export default function QualitativeAnalysis() {
  const [activeTab, setActiveTab] = useState<'data' | 'coding' | 'themes' | 'analysis' | 'visualization'>('data');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [selectedData, setSelectedData] = useState<string[]>([]);
  const [codingMode, setCodingMode] = useState<'manual' | 'ai-assisted' | 'automatic'>('ai-assisted');

  const mockData: QualitativeData[] = [
    {
      id: '1',
      source: 'Entrevista_Docente_01.mp3',
      type: 'interview',
      content: 'La implementación de tecnología en el aula ha transformado completamente mi metodología de enseñanza...',
      timestamp: '2024-01-15T10:30:00Z',
      tags: ['tecnología', 'metodología', 'transformación'],
      themes: ['Adopción tecnológica', 'Cambio pedagógico'],
      sentiment: 'positive'
    },
    {
      id: '2',
      source: 'Focus_Group_Estudiantes.mp3',
      type: 'focus_group',
      content: 'Los estudiantes expresaron preocupaciones sobre la curva de aprendizaje de las nuevas herramientas...',
      timestamp: '2024-01-16T14:00:00Z',
      tags: ['estudiantes', 'preocupaciones', 'aprendizaje'],
      themes: ['Resistencia al cambio', 'Curva de aprendizaje'],
      sentiment: 'negative'
    }
  ];

  const mockThemes: Theme[] = [
    {
      id: '1',
      name: 'Adopción Tecnológica',
      description: 'Proceso de integración de nuevas tecnologías en el entorno educativo',
      frequency: 15,
      sources: ['Entrevista_Docente_01', 'Entrevista_Docente_03', 'Focus_Group_Estudiantes'],
      subthemes: ['Resistencia inicial', 'Beneficios percibidos', 'Capacitación necesaria'],
      quotes: [
        'La tecnología ha cambiado mi forma de enseñar completamente',
        'Al principio fue difícil, pero ahora no puedo imaginar mis clases sin estas herramientas'
      ]
    },
    {
      id: '2',
      name: 'Cambio Pedagógico',
      description: 'Transformaciones en las metodologías y enfoques de enseñanza',
      frequency: 12,
      sources: ['Entrevista_Docente_01', 'Entrevista_Docente_02'],
      subthemes: ['Metodologías activas', 'Evaluación formativa', 'Personalización'],
      quotes: [
        'Ahora puedo personalizar el aprendizaje para cada estudiante',
        'La evaluación continua es mucho más efectiva'
      ]
    }
  ];

  const runAnalysis = async () => {
    setIsAnalyzing(true);
    setAnalysisProgress(0);
    
    // Simular progreso de análisis
    const intervals = [20, 40, 60, 80, 100];
    for (const progress of intervals) {
      await new Promise(resolve => setTimeout(resolve, 800));
      setAnalysisProgress(progress);
    }
    
    setIsAnalyzing(false);
  };

  const renderDataTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">Datos Cualitativos</h3>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Upload className="w-4 h-4" />
            Subir Archivo
          </button>
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <Download className="w-4 h-4" />
            Exportar
          </button>
        </div>
      </div>

      <div className="grid gap-4">
        {mockData.map((item) => (
          <div key={item.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${
                  item.type === 'interview' ? 'bg-blue-500' :
                  item.type === 'focus_group' ? 'bg-green-500' :
                  item.type === 'observation' ? 'bg-yellow-500' : 'bg-purple-500'
                }`} />
                <h4 className="font-medium text-gray-900">{item.source}</h4>
                <span className="text-xs px-2 py-1 bg-gray-100 rounded-full text-gray-600 capitalize">
                  {item.type.replace('_', ' ')}
                </span>
              </div>
              <div className={`px-2 py-1 rounded-full text-xs ${
                item.sentiment === 'positive' ? 'bg-green-100 text-green-700' :
                item.sentiment === 'negative' ? 'bg-red-100 text-red-700' :
                'bg-gray-100 text-gray-700'
              }`}>
                {item.sentiment}
              </div>
            </div>
            
            <p className="text-gray-700 text-sm mb-3 line-clamp-2">{item.content}</p>
            
            <div className="flex flex-wrap gap-1 mb-3">
              {item.tags.map((tag, index) => (
                <span key={index} className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
                  #{tag}
                </span>
              ))}
            </div>
            
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>{new Date(item.timestamp).toLocaleDateString()}</span>
              <div className="flex gap-2">
                <button className="text-blue-600 hover:text-blue-700">Editar</button>
                <button className="text-green-600 hover:text-green-700">Codificar</button>
                <button className="text-purple-600 hover:text-purple-700">Analizar</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderCodingTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">Codificación de Datos</h3>
        <div className="flex gap-2">
          <select 
            value={codingMode} 
            onChange={(e) => setCodingMode(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="manual">Codificación Manual</option>
            <option value="ai-assisted">Asistida por IA</option>
            <option value="automatic">Automática</option>
          </select>
          <button 
            onClick={runAnalysis}
            disabled={isAnalyzing}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-colors"
          >
            {isAnalyzing ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            {isAnalyzing ? 'Analizando...' : 'Iniciar Codificación'}
          </button>
        </div>
      </div>

      {isAnalyzing && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center gap-3 mb-2">
            <Brain className="w-5 h-5 text-blue-600 animate-pulse" />
            <span className="font-medium text-blue-900">Análisis en Progreso</span>
          </div>
          <div className="w-full bg-blue-200 rounded-full h-2 mb-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${analysisProgress}%` }}
            />
          </div>
          <p className="text-sm text-blue-700">
            {analysisProgress < 30 ? 'Procesando transcripciones...' :
             analysisProgress < 60 ? 'Identificando patrones temáticos...' :
             analysisProgress < 90 ? 'Generando códigos emergentes...' :
             'Finalizando análisis...'}
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Tag className="w-5 h-5 text-purple-600" />
            Códigos Emergentes
          </h4>
          <div className="space-y-3">
            {['Resistencia al cambio', 'Beneficios percibidos', 'Capacitación docente', 'Engagement estudiantil'].map((code, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">{code}</span>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500">12 refs</span>
                  <button className="text-purple-600 hover:text-purple-700">
                    <Tag className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-green-600" />
            Citas Relevantes
          </h4>
          <div className="space-y-3">
            <div className="p-3 bg-green-50 border-l-4 border-green-400 rounded-r-lg">
              <p className="text-sm text-gray-700 italic mb-2">
                "La tecnología ha revolucionado mi forma de enseñar, pero requiere mucha capacitación"
              </p>
              <span className="text-xs text-green-600">Entrevista_Docente_01 - Línea 45</span>
            </div>
            <div className="p-3 bg-blue-50 border-l-4 border-blue-400 rounded-r-lg">
              <p className="text-sm text-gray-700 italic mb-2">
                "Los estudiantes se adaptan más rápido que nosotros los profesores"
              </p>
              <span className="text-xs text-blue-600">Focus_Group_Estudiantes - Línea 23</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderThemesTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">Análisis Temático</h3>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
            <Network className="w-4 h-4" />
            Mapa Temático
          </button>
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <Filter className="w-4 h-4" />
            Filtrar
          </button>
        </div>
      </div>

      <div className="grid gap-6">
        {mockThemes.map((theme) => (
          <div key={theme.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">{theme.name}</h4>
                <p className="text-gray-600 text-sm">{theme.description}</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-blue-600">{theme.frequency}</div>
                <div className="text-xs text-gray-500">referencias</div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <h5 className="font-medium text-gray-700 mb-2">Fuentes</h5>
                <div className="flex flex-wrap gap-1">
                  {theme.sources.map((source, index) => (
                    <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                      {source}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <h5 className="font-medium text-gray-700 mb-2">Subtemas</h5>
                <div className="flex flex-wrap gap-1">
                  {theme.subthemes.map((subtheme, index) => (
                    <span key={index} className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
                      {subtheme}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <h5 className="font-medium text-gray-700 mb-2">Citas Representativas</h5>
              <div className="space-y-2">
                {theme.quotes.map((quote, index) => (
                  <blockquote key={index} className="pl-4 border-l-2 border-gray-300 text-sm text-gray-600 italic">
                    "{quote}"
                  </blockquote>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderAnalysisTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <TrendingUp className="w-8 h-8 text-blue-600" />
            <div>
              <h3 className="font-semibold text-blue-900">Patrones Identificados</h3>
              <p className="text-sm text-blue-700">8 patrones principales</p>
            </div>
          </div>
          <ul className="space-y-2 text-sm text-blue-800">
            <li>• Resistencia inicial seguida de adopción</li>
            <li>• Necesidad de capacitación continua</li>
            <li>• Diferencias generacionales</li>
          </ul>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <Lightbulb className="w-8 h-8 text-green-600" />
            <div>
              <h3 className="font-semibold text-green-900">Insights Clave</h3>
              <p className="text-sm text-green-700">5 hallazgos importantes</p>
            </div>
          </div>
          <ul className="space-y-2 text-sm text-green-800">
            <li>• La edad no determina la adopción</li>
            <li>• El apoyo institucional es crucial</li>
            <li>• Los beneficios superan las dificultades</li>
          </ul>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <CheckCircle className="w-8 h-8 text-purple-600" />
            <div>
              <h3 className="font-semibold text-purple-900">Recomendaciones</h3>
              <p className="text-sm text-purple-700">6 acciones sugeridas</p>
            </div>
          </div>
          <ul className="space-y-2 text-sm text-purple-800">
            <li>• Implementar programa de mentoría</li>
            <li>• Crear comunidades de práctica</li>
            <li>• Desarrollar recursos de apoyo</li>
          </ul>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Brain className="w-5 h-5 text-indigo-600" />
          Análisis Asistido por IA
        </h4>
        
        <div className="prose max-w-none text-sm text-gray-700">
          <p className="mb-4">
            <strong>Resumen Ejecutivo:</strong> El análisis revela un patrón consistente de transformación pedagógica 
            impulsada por la tecnología, caracterizado por una resistencia inicial que evoluciona hacia una adopción 
            entusiasta cuando se proporciona el apoyo adecuado.
          </p>
          
          <p className="mb-4">
            <strong>Hallazgos Principales:</strong> Los datos sugieren que la implementación exitosa de tecnología 
            educativa depende más del apoyo institucional y la capacitación continua que de factores demográficos 
            como la edad o experiencia previa.
          </p>
          
          <p>
            <strong>Implicaciones Teóricas:</strong> Los resultados apoyan la Teoría de Aceptación de Tecnología (TAM) 
            pero sugieren la necesidad de considerar factores contextuales específicos del entorno educativo.
          </p>
        </div>
      </div>
    </div>
  );

  const renderVisualizationTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">Visualizaciones</h3>
        <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
          <Download className="w-4 h-4" />
          Exportar Gráficos
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h4 className="font-semibold text-gray-900 mb-4">Frecuencia de Temas</h4>
          <div className="space-y-3">
            {mockThemes.map((theme) => (
              <div key={theme.id} className="flex items-center gap-3">
                <span className="text-sm font-medium text-gray-700 w-32 truncate">{theme.name}</span>
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${(theme.frequency / 15) * 100}%` }}
                  />
                </div>
                <span className="text-sm text-gray-500 w-8 text-right">{theme.frequency}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h4 className="font-semibold text-gray-900 mb-4">Distribución por Fuente</h4>
          <div className="space-y-3">
            {['Entrevistas', 'Focus Groups', 'Observaciones', 'Documentos'].map((source, index) => {
              const values = [8, 4, 2, 3];
              return (
                <div key={source} className="flex items-center gap-3">
                  <span className="text-sm font-medium text-gray-700 w-24">{source}</span>
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-600 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${(values[index] / 8) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm text-gray-500 w-8 text-right">{values[index]}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h4 className="font-semibold text-gray-900 mb-4">Red de Relaciones Temáticas</h4>
        <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
          <div className="text-center">
            <Network className="w-12 h-12 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-500">Visualización de red temática</p>
            <p className="text-xs text-gray-400">Mostrará conexiones entre temas identificados</p>
          </div>
        </div>
      </div>
    </div>
  );

  const tabs = [
    { id: 'data', label: 'Datos', icon: FileText },
    { id: 'coding', label: 'Codificación', icon: Tag },
    { id: 'themes', label: 'Temas', icon: TrendingUp },
    { id: 'analysis', label: 'Análisis', icon: Brain },
    { id: 'visualization', label: 'Visualización', icon: Network }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Brain className="w-8 h-8 text-purple-600" />
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Análisis Cualitativo</h1>
          <p className="text-gray-600">Análisis temático asistido por inteligencia artificial</p>
        </div>
      </div>

      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-purple-500 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      <div className="min-h-[600px]">
        {activeTab === 'data' && renderDataTab()}
        {activeTab === 'coding' && renderCodingTab()}
        {activeTab === 'themes' && renderThemesTab()}
        {activeTab === 'analysis' && renderAnalysisTab()}
        {activeTab === 'visualization' && renderVisualizationTab()}
      </div>
    </div>
  );
}