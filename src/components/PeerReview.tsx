import React, { useState } from 'react';
import { UserCheck, FileText, Send, Clock, CheckCircle, AlertCircle, Star, MessageSquare } from 'lucide-react';

const PeerReview = () => {
  const [activeTab, setActiveTab] = useState('submit');
  const [documentText, setDocumentText] = useState('');
  const [reviewResults, setReviewResults] = useState(null);
  const [isReviewing, setIsReviewing] = useState(false);

  const tabs = [
    { id: 'submit', label: 'Enviar para Revisión', icon: Send },
    { id: 'ai-review', label: 'Revisión IA', icon: UserCheck },
    { id: 'history', label: 'Historial', icon: Clock }
  ];

  const reviewHistory = [
    {
      id: 1,
      title: 'Metodología de Investigación - Borrador v2',
      type: 'IA + Expertos',
      submittedDate: '2024-01-10',
      status: 'Completado',
      score: 4.2,
      reviewers: 3,
      comments: 12
    },
    {
      id: 2,
      title: 'Análisis de Resultados Preliminares',
      type: 'Solo IA',
      submittedDate: '2024-01-08',
      status: 'Completado',
      score: 3.8,
      reviewers: 1,
      comments: 8
    },
    {
      id: 3,
      title: 'Introducción y Antecedentes',
      type: 'Expertos',
      submittedDate: '2024-01-05',
      status: 'En revisión',
      reviewers: 2,
      comments: 0
    }
  ];

  const handleAIReview = async () => {
    if (!documentText.trim()) return;
    
    setIsReviewing(true);
    
    // Simulate AI review
    setTimeout(() => {
      setReviewResults({
        overallScore: 4.1,
        sections: [
          {
            name: 'Estructura y Organización',
            score: 4.5,
            feedback: 'Excelente organización lógica. Los apartados fluyen de manera coherente y la estructura facilita la comprensión.',
            suggestions: ['Considerar agregar subtítulos más descriptivos en la sección de metodología']
          },
          {
            name: 'Claridad y Redacción',
            score: 3.8,
            feedback: 'La redacción es generalmente clara, aunque algunos párrafos podrían beneficiarse de mayor concisión.',
            suggestions: ['Simplificar oraciones complejas en párrafos 3 y 7', 'Revisar uso de voz pasiva']
          },
          {
            name: 'Rigor Metodológico',
            score: 4.2,
            feedback: 'Metodología bien fundamentada con referencias apropiadas. Los procedimientos están claramente descritos.',
            suggestions: ['Incluir más detalles sobre criterios de exclusión', 'Justificar mejor el tamaño de muestra']
          },
          {
            name: 'Referencias y Citación',
            score: 3.9,
            feedback: 'Buena selección de referencias actuales y relevantes. Formato de citación consistente.',
            suggestions: ['Incluir más literatura reciente (últimos 2 años)', 'Verificar algunas citas incompletas']
          }
        ],
        strengths: [
          'Marco teórico sólido y bien fundamentado',
          'Metodología apropiada para los objetivos planteados',
          'Escritura académica profesional',
          'Buena integración de literatura previa'
        ],
        improvements: [
          'Expandir la justificación del diseño metodológico',
          'Incluir consideraciones sobre limitaciones del estudio',
          'Mejorar la transición entre secciones',
          'Agregar más ejemplos concretos en la discusión'
        ],
        recommendations: [
          'Revisar y fortalecer la sección de limitaciones',
          'Considerar incluir un diagrama de flujo metodológico',
          'Expandir las implicaciones prácticas de los hallazgos',
          'Revisar la coherencia entre objetivos y conclusiones'
        ]
      });
      setIsReviewing(false);
    }, 3000);
  };

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Revisión por Pares</h1>
        <p className="text-gray-600">Obtén retroalimentación experta sobre tus documentos de investigación</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Documentos Revisados</p>
              <p className="text-3xl font-bold text-blue-600">12</p>
            </div>
            <FileText className="w-8 h-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Puntuación Promedio</p>
              <p className="text-3xl font-bold text-green-600">4.1</p>
              <p className="text-xs text-gray-500">de 5.0</p>
            </div>
            <Star className="w-8 h-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Comentarios Recibidos</p>
              <p className="text-3xl font-bold text-purple-600">47</p>
            </div>
            <MessageSquare className="w-8 h-8 text-purple-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Tiempo Promedio</p>
              <p className="text-3xl font-bold text-orange-600">2.5</p>
              <p className="text-xs text-gray-500">días</p>
            </div>
            <Clock className="w-8 h-8 text-orange-600" />
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
          {activeTab === 'submit' && (
            <div className="space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-medium text-blue-900 mb-2">Envío para Revisión</h3>
                <p className="text-sm text-blue-700">
                  Sube tu documento y selecciona el tipo de revisión que necesitas
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-6">
                  <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <h3 className="font-semibold text-gray-900 mb-4">Información del Documento</h3>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Título del documento
                        </label>
                        <input
                          type="text"
                          placeholder="Ej: Metodología de Investigación - Borrador v3"
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Tipo de documento
                        </label>
                        <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                          <option value="">Seleccionar tipo</option>
                          <option value="methodology">Metodología</option>
                          <option value="results">Resultados</option>
                          <option value="discussion">Discusión</option>
                          <option value="full-paper">Artículo completo</option>
                          <option value="proposal">Propuesta de investigación</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Aspectos específicos a revisar
                        </label>
                        <div className="space-y-2">
                          {[
                            'Rigor metodológico',
                            'Claridad de redacción',
                            'Estructura y organización',
                            'Referencias y citación',
                            'Coherencia argumentativa'
                          ].map((aspect, index) => (
                            <div key={index} className="flex items-center space-x-3">
                              <input type="checkbox" id={`aspect-${index}`} className="rounded" defaultChecked />
                              <label htmlFor={`aspect-${index}`} className="text-sm text-gray-700">{aspect}</label>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <h3 className="font-semibold text-gray-900 mb-4">Tipo de Revisión</h3>
                    
                    <div className="space-y-3">
                      <div className="border border-gray-200 rounded-lg p-4 cursor-pointer hover:bg-blue-50 hover:border-blue-300 transition-all">
                        <div className="flex items-center space-x-3">
                          <input type="radio" name="reviewType" value="ai" className="text-blue-600" />
                          <div>
                            <h4 className="font-medium text-gray-900">Revisión IA (Inmediata)</h4>
                            <p className="text-sm text-gray-600">Análisis automático con retroalimentación instantánea</p>
                          </div>
                        </div>
                      </div>

                      <div className="border border-gray-200 rounded-lg p-4 cursor-pointer hover:bg-green-50 hover:border-green-300 transition-all">
                        <div className="flex items-center space-x-3">
                          <input type="radio" name="reviewType" value="expert" className="text-green-600" />
                          <div>
                            <h4 className="font-medium text-gray-900">Revisión por Expertos (2-5 días)</h4>
                            <p className="text-sm text-gray-600">Revisión humana por especialistas en tu área</p>
                          </div>
                        </div>
                      </div>

                      <div className="border border-gray-200 rounded-lg p-4 cursor-pointer hover:bg-purple-50 hover:border-purple-300 transition-all">
                        <div className="flex items-center space-x-3">
                          <input type="radio" name="reviewType" value="hybrid" className="text-purple-600" />
                          <div>
                            <h4 className="font-medium text-gray-900">Revisión Híbrida (3-7 días)</h4>
                            <p className="text-sm text-gray-600">Combinación de IA y revisión humana especializada</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <h3 className="font-semibold text-gray-900 mb-4">Documento a Revisar</h3>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Subir archivo o pegar texto
                        </label>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors mb-4">
                          <FileText className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                          <p className="text-sm text-gray-600 mb-2">Arrastra un archivo PDF/DOCX aquí</p>
                          <button className="text-sm text-blue-600 hover:text-blue-700">
                            o haz clic para seleccionar
                          </button>
                        </div>
                        
                        <div className="text-center text-gray-500 text-sm mb-4">o</div>
                        
                        <textarea
                          value={documentText}
                          onChange={(e) => setDocumentText(e.target.value)}
                          rows={8}
                          placeholder="Pega aquí el texto de tu documento para revisión inmediata..."
                          className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>

                      <button
                        onClick={handleAIReview}
                        disabled={!documentText.trim() || isReviewing}
                        className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
                      >
                        {isReviewing ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            <span>Revisando documento...</span>
                          </>
                        ) : (
                          <>
                            <UserCheck className="w-4 h-4" />
                            <span>Iniciar Revisión IA</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'ai-review' && (
            <div className="space-y-6">
              {reviewResults ? (
                <div className="space-y-6">
                  {/* Overall Score */}
                  <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-gray-900">Puntuación General</h3>
                      <div className="flex items-center space-x-2">
                        <Star className="w-5 h-5 text-yellow-500" />
                        <span className="text-2xl font-bold text-gray-900">{reviewResults.overallScore}</span>
                        <span className="text-gray-500">/5.0</span>
                      </div>
                    </div>
                    
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className="bg-gradient-to-r from-yellow-400 to-green-500 h-3 rounded-full" 
                        style={{ width: `${(reviewResults.overallScore / 5) * 100}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Section Reviews */}
                  <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <h3 className="font-semibold text-gray-900 mb-4">Evaluación por Secciones</h3>
                    <div className="space-y-4">
                      {reviewResults.sections.map((section, index) => (
                        <div key={index} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="font-medium text-gray-900">{section.name}</h4>
                            <div className="flex items-center space-x-2">
                              <Star className="w-4 h-4 text-yellow-500" />
                              <span className="font-bold text-gray-900">{section.score}</span>
                            </div>
                          </div>
                          
                          <p className="text-sm text-gray-700 mb-3">{section.feedback}</p>
                          
                          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                            <h5 className="text-sm font-medium text-blue-900 mb-2">Sugerencias de Mejora:</h5>
                            <ul className="text-sm text-blue-800 space-y-1">
                              {section.suggestions.map((suggestion, idx) => (
                                <li key={idx}>• {suggestion}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Strengths and Improvements */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                      <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                        <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                        Fortalezas Identificadas
                      </h3>
                      <div className="space-y-2">
                        {reviewResults.strengths.map((strength, index) => (
                          <div key={index} className="flex items-start space-x-2">
                            <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                            <span className="text-sm text-gray-700">{strength}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                      <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                        <AlertCircle className="w-5 h-5 text-orange-600 mr-2" />
                        Áreas de Mejora
                      </h3>
                      <div className="space-y-2">
                        {reviewResults.improvements.map((improvement, index) => (
                          <div key={index} className="flex items-start space-x-2">
                            <AlertCircle className="w-4 h-4 text-orange-600 mt-0.5" />
                            <span className="text-sm text-gray-700">{improvement}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Recommendations */}
                  <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <h3 className="font-semibold text-gray-900 mb-4">Recomendaciones Específicas</h3>
                    <div className="space-y-3">
                      {reviewResults.recommendations.map((rec, index) => (
                        <div key={index} className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                          <div className="flex items-start space-x-3">
                            <div className="w-6 h-6 bg-amber-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                              {index + 1}
                            </div>
                            <p className="text-sm text-amber-800 flex-1">{rec}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <UserCheck className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>Sube un documento para obtener revisión por IA</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'history' && (
            <div className="space-y-4">
              {reviewHistory.map((review) => (
                <div key={review.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-2">{review.title}</h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <span>Tipo: {review.type}</span>
                        <span>Enviado: {review.submittedDate}</span>
                        {review.score && (
                          <div className="flex items-center space-x-1">
                            <Star className="w-4 h-4 text-yellow-500" />
                            <span className="font-medium">{review.score}/5.0</span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      review.status === 'Completado' ? 'bg-green-100 text-green-700' :
                      review.status === 'En revisión' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {review.status}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Revisores:</span>
                      <span className="font-medium text-gray-900 ml-2">{review.reviewers}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Comentarios:</span>
                      <span className="font-medium text-gray-900 ml-2">{review.comments}</span>
                    </div>
                  </div>
                  
                  {review.status === 'Completado' && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                        Ver Revisión Completa →
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PeerReview;