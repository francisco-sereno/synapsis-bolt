import React, { useState } from 'react';
import { 
  Plus, 
  Trash2, 
  GripVertical, 
  Type, 
  List, 
  CheckSquare, 
  Star, 
  ToggleLeft,
  ChevronDown,
  SlidersHorizontal,
  Grid3X3,
  Save,
  Eye,
  Settings
} from 'lucide-react';

interface Question {
  id: string;
  type: 'text_short' | 'text_long' | 'multiple_choice' | 'multiple_select' | 'likert' | 'matrix' | 'ranking' | 'dropdown' | 'yes_no' | 'slider';
  title: string;
  description?: string;
  required: boolean;
  options?: string[];
  scale?: {
    min: number;
    max: number;
    minLabel?: string;
    maxLabel?: string;
  };
  matrix?: {
    rows: string[];
    columns: string[];
  };
}

const InstrumentBuilder = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [instrumentTitle, setInstrumentTitle] = useState('');
  const [instrumentDescription, setInstrumentDescription] = useState('');
  const [activeQuestion, setActiveQuestion] = useState<string | null>(null);

  const questionTypes = [
    { id: 'text_short', label: 'Texto Corto', icon: Type, description: 'Respuesta de una línea' },
    { id: 'text_long', label: 'Párrafo', icon: Type, description: 'Respuesta de múltiples líneas' },
    { id: 'multiple_choice', label: 'Opción Múltiple', icon: List, description: 'Selección única' },
    { id: 'multiple_select', label: 'Selección Múltiple', icon: CheckSquare, description: 'Múltiples opciones' },
    { id: 'likert', label: 'Escala Likert', icon: Star, description: 'Escala de acuerdo/desacuerdo' },
    { id: 'matrix', label: 'Matriz', icon: Grid3X3, description: 'Múltiples preguntas con mismas opciones' },
    { id: 'ranking', label: 'Ranking', icon: List, description: 'Ordenar opciones por preferencia' },
    { id: 'dropdown', label: 'Menú Desplegable', icon: ChevronDown, description: 'Lista desplegable' },
    { id: 'yes_no', label: 'Sí/No', icon: ToggleLeft, description: 'Pregunta dicotómica' },
    { id: 'slider', label: 'Escala Deslizante', icon: SlidersHorizontal, description: 'Escala numérica deslizante' }
  ];

  const addQuestion = (type: Question['type']) => {
    const newQuestion: Question = {
      id: `q_${Date.now()}`,
      type,
      title: '',
      required: false,
      options: type === 'multiple_choice' || type === 'multiple_select' || type === 'dropdown' || type === 'ranking' 
        ? ['Opción 1', 'Opción 2'] : undefined,
      scale: type === 'likert' || type === 'slider' 
        ? { min: 1, max: 5, minLabel: 'Muy en desacuerdo', maxLabel: 'Muy de acuerdo' } : undefined,
      matrix: type === 'matrix' 
        ? { rows: ['Fila 1', 'Fila 2'], columns: ['Columna 1', 'Columna 2'] } : undefined
    };
    
    setQuestions([...questions, newQuestion]);
    setActiveQuestion(newQuestion.id);
  };

  const updateQuestion = (id: string, updates: Partial<Question>) => {
    setQuestions(questions.map(q => q.id === id ? { ...q, ...updates } : q));
  };

  const deleteQuestion = (id: string) => {
    setQuestions(questions.filter(q => q.id !== id));
    if (activeQuestion === id) {
      setActiveQuestion(null);
    }
  };

  const moveQuestion = (id: string, direction: 'up' | 'down') => {
    const index = questions.findIndex(q => q.id === id);
    if (index === -1) return;
    
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= questions.length) return;
    
    const newQuestions = [...questions];
    [newQuestions[index], newQuestions[newIndex]] = [newQuestions[newIndex], newQuestions[index]];
    setQuestions(newQuestions);
  };

  const renderQuestionEditor = (question: Question) => {
    return (
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Título de la Pregunta *
          </label>
          <input
            type="text"
            value={question.title}
            onChange={(e) => updateQuestion(question.id, { title: e.target.value })}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Escribe tu pregunta aquí..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Descripción (opcional)
          </label>
          <textarea
            value={question.description || ''}
            onChange={(e) => updateQuestion(question.id, { description: e.target.value })}
            rows={2}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Descripción adicional o instrucciones..."
          />
        </div>

        <div className="flex items-center space-x-3">
          <input
            type="checkbox"
            id={`required-${question.id}`}
            checked={question.required}
            onChange={(e) => updateQuestion(question.id, { required: e.target.checked })}
            className="rounded"
          />
          <label htmlFor={`required-${question.id}`} className="text-sm text-gray-700">
            Pregunta obligatoria
          </label>
        </div>

        {/* Options for multiple choice, select, dropdown, ranking */}
        {(question.type === 'multiple_choice' || question.type === 'multiple_select' || 
          question.type === 'dropdown' || question.type === 'ranking') && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Opciones de Respuesta
            </label>
            <div className="space-y-2">
              {question.options?.map((option, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={option}
                    onChange={(e) => {
                      const newOptions = [...(question.options || [])];
                      newOptions[index] = e.target.value;
                      updateQuestion(question.id, { options: newOptions });
                    }}
                    className="flex-1 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button
                    onClick={() => {
                      const newOptions = question.options?.filter((_, i) => i !== index);
                      updateQuestion(question.id, { options: newOptions });
                    }}
                    className="p-2 text-red-600 hover:bg-red-100 rounded transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              <button
                onClick={() => {
                  const newOptions = [...(question.options || []), `Opción ${(question.options?.length || 0) + 1}`];
                  updateQuestion(question.id, { options: newOptions });
                }}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                + Agregar Opción
              </button>
            </div>
          </div>
        )}

        {/* Scale configuration for Likert and slider */}
        {(question.type === 'likert' || question.type === 'slider') && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Valor Mínimo
              </label>
              <input
                type="number"
                value={question.scale?.min || 1}
                onChange={(e) => updateQuestion(question.id, { 
                  scale: { ...question.scale!, min: parseInt(e.target.value) }
                })}
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Valor Máximo
              </label>
              <input
                type="number"
                value={question.scale?.max || 5}
                onChange={(e) => updateQuestion(question.id, { 
                  scale: { ...question.scale!, max: parseInt(e.target.value) }
                })}
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Etiqueta Mínima
              </label>
              <input
                type="text"
                value={question.scale?.minLabel || ''}
                onChange={(e) => updateQuestion(question.id, { 
                  scale: { ...question.scale!, minLabel: e.target.value }
                })}
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ej: Muy en desacuerdo"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Etiqueta Máxima
              </label>
              <input
                type="text"
                value={question.scale?.maxLabel || ''}
                onChange={(e) => updateQuestion(question.id, { 
                  scale: { ...question.scale!, maxLabel: e.target.value }
                })}
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ej: Muy de acuerdo"
              />
            </div>
          </div>
        )}

        {/* Matrix configuration */}
        {question.type === 'matrix' && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filas (Preguntas)
              </label>
              <div className="space-y-2">
                {question.matrix?.rows.map((row, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={row}
                      onChange={(e) => {
                        const newRows = [...(question.matrix?.rows || [])];
                        newRows[index] = e.target.value;
                        updateQuestion(question.id, { 
                          matrix: { ...question.matrix!, rows: newRows }
                        });
                      }}
                      className="flex-1 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <button
                      onClick={() => {
                        const newRows = question.matrix?.rows.filter((_, i) => i !== index);
                        updateQuestion(question.id, { 
                          matrix: { ...question.matrix!, rows: newRows || [] }
                        });
                      }}
                      className="p-2 text-red-600 hover:bg-red-100 rounded transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => {
                    const newRows = [...(question.matrix?.rows || []), `Fila ${(question.matrix?.rows.length || 0) + 1}`];
                    updateQuestion(question.id, { 
                      matrix: { ...question.matrix!, rows: newRows }
                    });
                  }}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  + Agregar Fila
                </button>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Columnas (Opciones)
              </label>
              <div className="space-y-2">
                {question.matrix?.columns.map((column, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={column}
                      onChange={(e) => {
                        const newColumns = [...(question.matrix?.columns || [])];
                        newColumns[index] = e.target.value;
                        updateQuestion(question.id, { 
                          matrix: { ...question.matrix!, columns: newColumns }
                        });
                      }}
                      className="flex-1 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <button
                      onClick={() => {
                        const newColumns = question.matrix?.columns.filter((_, i) => i !== index);
                        updateQuestion(question.id, { 
                          matrix: { ...question.matrix!, columns: newColumns || [] }
                        });
                      }}
                      className="p-2 text-red-600 hover:bg-red-100 rounded transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => {
                    const newColumns = [...(question.matrix?.columns || []), `Columna ${(question.matrix?.columns.length || 0) + 1}`];
                    updateQuestion(question.id, { 
                      matrix: { ...question.matrix!, columns: newColumns }
                    });
                  }}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  + Agregar Columna
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderQuestionPreview = (question: Question) => {
    const getTypeIcon = (type: string) => {
      const typeConfig = questionTypes.find(t => t.id === type);
      return typeConfig ? typeConfig.icon : Type;
    };

    const Icon = getTypeIcon(question.type);

    return (
      <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Icon className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <h4 className="font-medium text-gray-900">
                {question.title || 'Pregunta sin título'}
              </h4>
              {question.description && (
                <p className="text-sm text-gray-600">{question.description}</p>
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {question.required && (
              <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded">
                Obligatoria
              </span>
            )}
            <button
              onClick={() => setActiveQuestion(question.id)}
              className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <Settings className="w-4 h-4" />
            </button>
            <button
              onClick={() => deleteQuestion(question.id)}
              className="p-1 text-gray-400 hover:text-red-600 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Question preview based on type */}
        <div className="bg-gray-50 rounded-lg p-3">
          {question.type === 'text_short' && (
            <input type="text" placeholder="Respuesta corta..." className="w-full p-2 border border-gray-300 rounded" disabled />
          )}
          
          {question.type === 'text_long' && (
            <textarea placeholder="Respuesta larga..." rows={3} className="w-full p-2 border border-gray-300 rounded" disabled />
          )}
          
          {(question.type === 'multiple_choice' || question.type === 'multiple_select') && (
            <div className="space-y-2">
              {question.options?.map((option, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <input 
                    type={question.type === 'multiple_choice' ? 'radio' : 'checkbox'} 
                    disabled 
                    className="rounded"
                  />
                  <span className="text-sm text-gray-700">{option}</span>
                </div>
              ))}
            </div>
          )}
          
          {question.type === 'likert' && (
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500">{question.scale?.minLabel}</span>
              <div className="flex space-x-2">
                {Array.from({ length: (question.scale?.max || 5) - (question.scale?.min || 1) + 1 }, (_, i) => (
                  <div key={i} className="w-8 h-8 border border-gray-300 rounded-full flex items-center justify-center text-xs">
                    {(question.scale?.min || 1) + i}
                  </div>
                ))}
              </div>
              <span className="text-xs text-gray-500">{question.scale?.maxLabel}</span>
            </div>
          )}
          
          {question.type === 'yes_no' && (
            <div className="flex space-x-4">
              <div className="flex items-center space-x-2">
                <input type="radio" disabled className="rounded" />
                <span className="text-sm text-gray-700">Sí</span>
              </div>
              <div className="flex items-center space-x-2">
                <input type="radio" disabled className="rounded" />
                <span className="text-sm text-gray-700">No</span>
              </div>
            </div>
          )}
          
          {question.type === 'dropdown' && (
            <select disabled className="w-full p-2 border border-gray-300 rounded">
              <option>Selecciona una opción...</option>
              {question.options?.map((option, index) => (
                <option key={index}>{option}</option>
              ))}
            </select>
          )}
          
          {question.type === 'slider' && (
            <div>
              <input 
                type="range" 
                min={question.scale?.min || 1} 
                max={question.scale?.max || 5} 
                disabled 
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>{question.scale?.minLabel}</span>
                <span>{question.scale?.maxLabel}</span>
              </div>
            </div>
          )}
          
          {question.type === 'matrix' && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr>
                    <th className="text-left p-2"></th>
                    {question.matrix?.columns.map((column, index) => (
                      <th key={index} className="text-center p-2 text-gray-600">{column}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {question.matrix?.rows.map((row, rowIndex) => (
                    <tr key={rowIndex}>
                      <td className="p-2 text-gray-700">{row}</td>
                      {question.matrix?.columns.map((_, colIndex) => (
                        <td key={colIndex} className="text-center p-2">
                          <input type="radio" disabled className="rounded" />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          
          {question.type === 'ranking' && (
            <div className="space-y-2">
              {question.options?.map((option, index) => (
                <div key={index} className="flex items-center space-x-3 p-2 bg-white border border-gray-300 rounded">
                  <GripVertical className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-700">{option}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Constructor de Instrumentos</h1>
        <p className="text-gray-600">Crea instrumentos de investigación con editor visual drag-and-drop</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Question Types Panel */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Tipos de Pregunta</h2>
          <div className="space-y-2">
            {questionTypes.map((type) => {
              const Icon = type.icon;
              return (
                <button
                  key={type.id}
                  onClick={() => addQuestion(type.id as Question['type'])}
                  className="w-full text-left p-3 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <Icon className="w-5 h-5 text-gray-600" />
                    <div>
                      <h3 className="font-medium text-gray-900">{type.label}</h3>
                      <p className="text-xs text-gray-500">{type.description}</p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Main Builder Area */}
        <div className="lg:col-span-2 space-y-6">
          {/* Instrument Header */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Información del Instrumento</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Título del Instrumento *
                </label>
                <input
                  type="text"
                  value={instrumentTitle}
                  onChange={(e) => setInstrumentTitle(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ej: Encuesta de Satisfacción Estudiantil"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descripción
                </label>
                <textarea
                  value={instrumentDescription}
                  onChange={(e) => setInstrumentDescription(e.target.value)}
                  rows={3}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Describe el propósito y alcance de este instrumento..."
                />
              </div>
            </div>
          </div>

          {/* Questions List */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">
                  Preguntas ({questions.length})
                </h2>
                <div className="flex items-center space-x-2">
                  <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                    <Eye className="w-4 h-4" />
                  </button>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
                    <Save className="w-4 h-4" />
                    <span>Guardar</span>
                  </button>
                </div>
              </div>
            </div>
            
            <div className="p-6">
              {questions.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <Plus className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>No hay preguntas aún</p>
                  <p className="text-sm mt-2">Selecciona un tipo de pregunta para comenzar</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {questions.map((question, index) => (
                    <div key={question.id}>
                      {renderQuestionPreview(question)}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Question Editor Panel */}
          {activeQuestion && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">Editor de Pregunta</h2>
                  <button
                    onClick={() => setActiveQuestion(null)}
                    className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    ×
                  </button>
                </div>
              </div>
              <div className="p-6">
                {questions.find(q => q.id === activeQuestion) && 
                  renderQuestionEditor(questions.find(q => q.id === activeQuestion)!)
                }
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InstrumentBuilder;