import React, { useState } from 'react';
import { Lightbulb, TrendingUp, AlertTriangle, CheckCircle, Clock, ArrowRight, X } from 'lucide-react';

interface Recommendation {
  id: string;
  type: 'optimization' | 'warning' | 'opportunity' | 'insight';
  priority: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  action: string;
  impact: string;
  effort: 'low' | 'medium' | 'high';
  module: string;
  dismissed?: boolean;
}

const SmartRecommendations = () => {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([
    {
      id: '1',
      type: 'opportunity',
      priority: 'high',
      title: 'Momento Óptimo para Triangulación',
      description: 'Tienes suficientes datos cuantitativos y cualitativos para ejecutar una triangulación metodológica robusta.',
      action: 'Ejecutar triangulación de datos mixtos',
      impact: 'Insights más profundos y validez incrementada',
      effort: 'medium',
      module: 'Triangulación'
    },
    {
      id: '2',
      type: 'optimization',
      priority: 'medium',
      title: 'Mejorar Tasa de Respuesta',
      description: 'La tasa de completado del 78% puede mejorarse con recordatorios personalizados.',
      action: 'Configurar recordatorios automáticos',
      impact: 'Incremento estimado del 15-20% en respuestas',
      effort: 'low',
      module: 'Recolección de Datos'
    },
    {
      id: '3',
      type: 'warning',
      priority: 'high',
      title: 'Validación de Instrumento Pendiente',
      description: 'El instrumento "Entrevista Semiestructurada" no ha sido validado por expertos.',
      action: 'Solicitar validación por pares',
      impact: 'Mayor rigor metodológico y credibilidad',
      effort: 'medium',
      module: 'Instrumentos'
    },
    {
      id: '4',
      type: 'insight',
      priority: 'medium',
      title: 'Patrón Interesante Detectado',
      description: 'Los datos muestran una correlación inesperada entre edad y adopción tecnológica.',
      action: 'Explorar análisis de subgrupos',
      impact: 'Hallazgo potencialmente significativo',
      effort: 'low',
      module: 'Análisis Cuantitativo'
    },
    {
      id: '5',
      type: 'optimization',
      priority: 'low',
      title: 'Optimizar Estructura de Datos',
      description: 'Algunos campos tienen alta tasa de valores faltantes que podrían imputarse.',
      action: 'Ejecutar limpieza automática de datos',
      impact: 'Análisis más precisos y completos',
      effort: 'low',
      module: 'Datos'
    }
  ]);

  const [filter, setFilter] = useState<'all' | 'high' | 'medium' | 'low'>('all');

  const dismissRecommendation = (id: string) => {
    setRecommendations(prev => 
      prev.map(rec => 
        rec.id === id ? { ...rec, dismissed: true } : rec
      )
    );
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'optimization': return TrendingUp;
      case 'warning': return AlertTriangle;
      case 'opportunity': return Lightbulb;
      case 'insight': return CheckCircle;
      default: return Lightbulb;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'optimization': return 'blue';
      case 'warning': return 'red';
      case 'opportunity': return 'green';
      case 'insight': return 'purple';
      default: return 'gray';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'red';
      case 'medium': return 'yellow';
      case 'low': return 'gray';
      default: return 'gray';
    }
  };

  const getEffortColor = (effort: string) => {
    switch (effort) {
      case 'low': return 'green';
      case 'medium': return 'yellow';
      case 'high': return 'red';
      default: return 'gray';
    }
  };

  const filteredRecommendations = recommendations.filter(rec => {
    if (rec.dismissed) return false;
    if (filter === 'all') return true;
    return rec.priority === filter;
  });

  const stats = {
    total: recommendations.filter(r => !r.dismissed).length,
    high: recommendations.filter(r => !r.dismissed && r.priority === 'high').length,
    medium: recommendations.filter(r => !r.dismissed && r.priority === 'medium').length,
    low: recommendations.filter(r => !r.dismissed && r.priority === 'low').length
  };

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Recomendaciones Inteligentes</h1>
        <p className="text-gray-600">Sugerencias personalizadas de IA para optimizar tu investigación</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Total Activas</p>
              <p className="text-3xl font-bold text-blue-600">{stats.total}</p>
            </div>
            <Lightbulb className="w-8 h-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Alta Prioridad</p>
              <p className="text-3xl font-bold text-red-600">{stats.high}</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Oportunidades</p>
              <p className="text-3xl font-bold text-green-600">
                {recommendations.filter(r => !r.dismissed && r.type === 'opportunity').length}
              </p>
            </div>
            <TrendingUp className="w-8 h-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Tiempo Estimado</p>
              <p className="text-3xl font-bold text-purple-600">2.5h</p>
            </div>
            <Clock className="w-8 h-8 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6" aria-label="Tabs">
            {[
              { id: 'all', label: 'Todas', count: stats.total },
              { id: 'high', label: 'Alta Prioridad', count: stats.high },
              { id: 'medium', label: 'Media Prioridad', count: stats.medium },
              { id: 'low', label: 'Baja Prioridad', count: stats.low }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilter(tab.id as 'all' | 'high' | 'medium' | 'low')}
                className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm ${
                  filter === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
                {tab.count > 0 && (
                  <span className="ml-2 px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          <div className="space-y-4">
            {filteredRecommendations.map((recommendation) => {
              const TypeIcon = getTypeIcon(recommendation.type);
              const typeColor = getTypeColor(recommendation.type);
              const priorityColor = getPriorityColor(recommendation.priority);
              const effortColor = getEffortColor(recommendation.effort);
              
              return (
                <div key={recommendation.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      <div className={`p-3 bg-${typeColor}-100 rounded-lg`}>
                        <TypeIcon className={`w-6 h-6 text-${typeColor}-600`} />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">{recommendation.title}</h3>
                          <span className={`px-2 py-1 bg-${priorityColor}-100 text-${priorityColor}-700 text-xs rounded-full font-medium`}>
                            {recommendation.priority === 'high' ? 'Alta' : 
                             recommendation.priority === 'medium' ? 'Media' : 'Baja'} Prioridad
                          </span>
                        </div>
                        
                        <p className="text-gray-600 mb-3">{recommendation.description}</p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                          <div className="bg-gray-50 rounded-lg p-3">
                            <h4 className="text-sm font-medium text-gray-700 mb-1">Impacto Esperado</h4>
                            <p className="text-sm text-gray-600">{recommendation.impact}</p>
                          </div>
                          
                          <div className="bg-gray-50 rounded-lg p-3">
                            <h4 className="text-sm font-medium text-gray-700 mb-1">Esfuerzo Requerido</h4>
                            <div className="flex items-center space-x-2">
                              <span className={`px-2 py-1 bg-${effortColor}-100 text-${effortColor}-700 text-xs rounded-full font-medium`}>
                                {recommendation.effort === 'low' ? 'Bajo' : 
                                 recommendation.effort === 'medium' ? 'Medio' : 'Alto'}
                              </span>
                            </div>
                          </div>
                          
                          <div className="bg-gray-50 rounded-lg p-3">
                            <h4 className="text-sm font-medium text-gray-700 mb-1">Módulo</h4>
                            <p className="text-sm text-gray-600">{recommendation.module}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                            <span>{recommendation.action}</span>
                            <ArrowRight className="w-4 h-4" />
                          </button>
                          
                          <div className="flex items-center space-x-2">
                            <button className="text-sm text-gray-500 hover:text-gray-700">
                              Más detalles
                            </button>
                            <button 
                              onClick={() => dismissRecommendation(recommendation.id)}
                              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredRecommendations.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <CheckCircle className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>No hay recomendaciones activas para este filtro</p>
              <p className="text-sm mt-2">¡Excelente trabajo manteniendo tu proyecto optimizado!</p>
            </div>
          )}
        </div>
      </div>

      {/* AI Learning Panel */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl shadow-sm text-white">
        <div className="p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <Lightbulb className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">IA Aprendiendo de tu Proyecto</h2>
              <p className="text-white/80 text-sm">Mejorando recomendaciones basadas en tus patrones de trabajo</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white/10 backdrop-blur rounded-lg p-4">
              <h3 className="font-medium mb-2">📈 Patrones Identificados</h3>
              <p className="text-sm text-white/90">
                Prefieres análisis descriptivos antes que inferenciales
              </p>
            </div>
            
            <div className="bg-white/10 backdrop-blur rounded-lg p-4">
              <h3 className="font-medium mb-2">⏰ Horarios Óptimos</h3>
              <p className="text-sm text-white/90">
                Mayor productividad entre 10:00-12:00 y 14:00-16:00
              </p>
            </div>
            
            <div className="bg-white/10 backdrop-blur rounded-lg p-4">
              <h3 className="font-medium mb-2">🎯 Próxima Predicción</h3>
              <p className="text-sm text-white/90">
                Probabilidad 85% de ejecutar triangulación esta semana
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SmartRecommendations;