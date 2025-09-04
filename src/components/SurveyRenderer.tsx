import React, { useState } from 'react';
import { CheckCircle, Clock, ArrowRight, ArrowLeft } from 'lucide-react';

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

interface SurveyRendererProps {
  instrumentId: string;
  title: string;
  description?: string;
  questions: Question[];
  onSubmit: (responses: Record<string, any>) => void;
}

const SurveyRenderer: React.FC<SurveyRendererProps> = ({
  instrumentId,
  title,
  description,
  questions,
  onSubmit
}) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [responses, setResponses] = useState<Record<string, any>>({});
  const [startTime] = useState(new Date());
  const [errors, setErrors] = useState<Record<string, string>>({});

  const questionsPerPage = 5;
  const totalPages = Math.ceil(questions.length / questionsPerPage);
  const currentQuestions = questions.slice(
    currentPage * questionsPerPage,
    (currentPage + 1) * questionsPerPage
  );

  const updateResponse = (questionId: string, value: any) => {
    setResponses(prev => ({
      ...prev,
      [questionId]: value
    }));
    
    // Clear error if question is answered
    if (errors[questionId]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[questionId];
        return newErrors;
      });
    }
  };

  const validateCurrentPage = () => {
    const newErrors: Record<string, string> = {};
    
    currentQuestions.forEach(question => {
      if (question.required && !responses[question.id]) {
        newErrors[question.id] = 'Esta pregunta es obligatoria';
      }
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateCurrentPage()) {
      if (currentPage < totalPages - 1) {
        setCurrentPage(currentPage + 1);
      } else {
        handleSubmit();
      }
    }
  };

  const handleSubmit = () => {
    const endTime = new Date();
    const completionTime = Math.round((endTime.getTime() - startTime.getTime()) / 1000);
    
    onSubmit({
      responses,
      metadata: {
        startTime,
        endTime,
        completionTime,
        completionRate: (Object.keys(responses).length / questions.length) * 100
      }
    });
  };

  const renderQuestion = (question: Question) => {
    const hasError = errors[question.id];
    
    return (
      <div key={question.id} className={`bg-white border rounded-lg p-6 ${hasError ? 'border-red-300' : 'border-gray-200'}`}>
        <div className="mb-4">
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {question.title}
            {question.required && <span className="text-red-500 ml-1">*</span>}
          </h3>
          {question.description && (
            <p className="text-sm text-gray-600">{question.description}</p>
          )}
          {hasError && (
            <p className="text-sm text-red-600 mt-1">{errors[question.id]}</p>
          )}
        </div>

        <div className="space-y-3">
          {question.type === 'text_short' && (
            <input
              type="text"
              value={responses[question.id] || ''}
              onChange={(e) => updateResponse(question.id, e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Tu respuesta..."
            />
          )}

          {question.type === 'text_long' && (
            <textarea
              value={responses[question.id] || ''}
              onChange={(e) => updateResponse(question.id, e.target.value)}
              rows={4}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Tu respuesta..."
            />
          )}

          {question.type === 'multiple_choice' && (
            <div className="space-y-2">
              {question.options?.map((option, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <input
                    type="radio"
                    id={`${question.id}_${index}`}
                    name={question.id}
                    value={option}
                    checked={responses[question.id] === option}
                    onChange={(e) => updateResponse(question.id, e.target.value)}
                    className="text-blue-600"
                  />
                  <label htmlFor={`${question.id}_${index}`} className="text-sm text-gray-700 cursor-pointer">
                    {option}
                  </label>
                </div>
              ))}
            </div>
          )}

          {question.type === 'multiple_select' && (
            <div className="space-y-2">
              {question.options?.map((option, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id={`${question.id}_${index}`}
                    value={option}
                    checked={(responses[question.id] || []).includes(option)}
                    onChange={(e) => {
                      const currentValues = responses[question.id] || [];
                      const newValues = e.target.checked
                        ? [...currentValues, option]
                        : currentValues.filter((v: string) => v !== option);
                      updateResponse(question.id, newValues);
                    }}
                    className="rounded text-blue-600"
                  />
                  <label htmlFor={`${question.id}_${index}`} className="text-sm text-gray-700 cursor-pointer">
                    {option}
                  </label>
                </div>
              ))}
            </div>
          )}

          {question.type === 'likert' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm text-gray-600">
                <span>{question.scale?.minLabel}</span>
                <span>{question.scale?.maxLabel}</span>
              </div>
              <div className="flex justify-center space-x-4">
                {Array.from({ length: (question.scale?.max || 5) - (question.scale?.min || 1) + 1 }, (_, i) => {
                  const value = (question.scale?.min || 1) + i;
                  return (
                    <div key={i} className="text-center">
                      <input
                        type="radio"
                        id={`${question.id}_${value}`}
                        name={question.id}
                        value={value}
                        checked={responses[question.id] === value}
                        onChange={(e) => updateResponse(question.id, parseInt(e.target.value))}
                        className="text-blue-600 mb-2"
                      />
                      <label htmlFor={`${question.id}_${value}`} className="block text-sm text-gray-700 cursor-pointer">
                        {value}
                      </label>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {question.type === 'yes_no' && (
            <div className="flex space-x-6">
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id={`${question.id}_yes`}
                  name={question.id}
                  value="yes"
                  checked={responses[question.id] === 'yes'}
                  onChange={(e) => updateResponse(question.id, e.target.value)}
                  className="text-blue-600"
                />
                <label htmlFor={`${question.id}_yes`} className="text-sm text-gray-700 cursor-pointer">
                  Sí
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id={`${question.id}_no`}
                  name={question.id}
                  value="no"
                  checked={responses[question.id] === 'no'}
                  onChange={(e) => updateResponse(question.id, e.target.value)}
                  className="text-blue-600"
                />
                <label htmlFor={`${question.id}_no`} className="text-sm text-gray-700 cursor-pointer">
                  No
                </label>
              </div>
            </div>
          )}

          {question.type === 'dropdown' && (
            <select
              value={responses[question.id] || ''}
              onChange={(e) => updateResponse(question.id, e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Selecciona una opción...</option>
              {question.options?.map((option, index) => (
                <option key={index} value={option}>{option}</option>
              ))}
            </select>
          )}

          {question.type === 'slider' && (
            <div className="space-y-3">
              <input
                type="range"
                min={question.scale?.min || 1}
                max={question.scale?.max || 5}
                value={responses[question.id] || question.scale?.min || 1}
                onChange={(e) => updateResponse(question.id, parseInt(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-gray-600">
                <span>{question.scale?.minLabel}</span>
                <span className="font-medium">Valor: {responses[question.id] || question.scale?.min || 1}</span>
                <span>{question.scale?.maxLabel}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  const progress = ((currentPage + 1) / totalPages) * 100;
  const answeredQuestions = Object.keys(responses).length;
  const totalQuestions = questions.length;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{title}</h1>
          {description && (
            <p className="text-gray-600 mb-4">{description}</p>
          )}
          
          {/* Progress */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Progreso</span>
              <span className="text-gray-900 font-medium">
                {answeredQuestions} de {totalQuestions} preguntas
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(answeredQuestions / totalQuestions) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Questions */}
        <div className="space-y-6 mb-6">
          {currentQuestions.map(question => renderQuestion(question))}
        </div>

        {/* Navigation */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Página {currentPage + 1} de {totalPages}
              </span>
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <Clock className="w-4 h-4" />
                <span>Tiempo estimado: {Math.ceil(questions.length * 0.5)} min</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              {currentPage > 0 && (
                <button
                  onClick={() => setCurrentPage(currentPage - 1)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Anterior</span>
                </button>
              )}
              
              <button
                onClick={handleNext}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
              >
                <span>{currentPage === totalPages - 1 ? 'Enviar' : 'Siguiente'}</span>
                {currentPage === totalPages - 1 ? (
                  <CheckCircle className="w-4 h-4" />
                ) : (
                  <ArrowRight className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SurveyRenderer;