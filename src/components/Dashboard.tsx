import React from 'react';
import { useState, useEffect } from 'react';
import { 
  Users, 
  ClipboardList, 
  Database, 
  TrendingUp, 
  Calendar, 
  CheckCircle, 
  AlertCircle,
  Clock,
  BarChart3,
  FileText,
  Zap,
  Target,
  Award,
  Activity,
  Lightbulb
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useProjects } from '../hooks/useProjects';
import { supabase } from '../lib/supabase';
import ProjectCreationModal from './ProjectCreationModal';

const Dashboard = () => {
  const { profile } = useAuth();
  const { currentProject } = useProjects();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [stats, setStats] = useState({
    instruments: 0,
    participants: 0,
    responses: 0,
    analyses: 0,
    aiTime: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (currentProject?.id) {
      loadProjectStats();
    }
  }, [currentProject?.id]);

  const loadProjectStats = async () => {
    if (!currentProject?.id) return;

    try {
      // Load instruments count
      const { count: instrumentsCount } = await supabase
        .from('instruments')
        .select('*', { count: 'exact', head: true })
        .eq('project_id', currentProject.id);

      // Load responses count
      const { count: responsesCount } = await supabase
        .from('responses')
        .select('*', { count: 'exact', head: true })
        .in('collection_id', 
          await supabase
            .from('data_collections')
            .select('id')
            .in('instrument_id',
              await supabase
                .from('instruments')
                .select('id')
                .eq('project_id', currentProject.id)
                .then(res => res.data?.map(i => i.id) || [])
            )
            .then(res => res.data?.map(c => c.id) || [])
        );

      // Load analyses count
      const { count: analysesCount } = await supabase
        .from('analyses')
        .select('*', { count: 'exact', head: true })
        .eq('project_id', currentProject.id);

      // Load unique participants count
      const { data: collectionsData } = await supabase
        .from('data_collections')
        .select('responses_count')
        .in('instrument_id',
          await supabase
            .from('instruments')
            .select('id')
            .eq('project_id', currentProject.id)
            .then(res => res.data?.map(i => i.id) || [])
        );

      const totalParticipants = collectionsData?.reduce((sum, collection) => 
        sum + (collection.responses_count || 0), 0) || 0;

      setStats({
        instruments: instrumentsCount || 0,
        participants: totalParticipants,
        responses: responsesCount || 0,
        analyses: analysesCount || 0,
        aiTime: 0 // Will be calculated from ai_requests table
      });
    } catch (error) {
      console.error('Error loading project stats:', error);
      // Keep default values on error
    } finally {
      setLoading(false);
    }
  };

  if (!currentProject) {
    return (
      <>
        <div className="space-y-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Bienvenido a Synapsis</h1>
          <p className="text-gray-600">Crea tu primer proyecto de investigación para comenzar</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center mx-auto mb-6">
            <Target className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">No hay proyectos activos</h2>
          <p className="text-gray-600 mb-6">
            Comienza creando tu primer proyecto de investigación para acceder a todas las herramientas de IA
          </p>
          <button 
            onClick={() => setShowCreateModal(true)}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Crear primer proyecto
          </button>
        </div>
        </div>
        <ProjectCreationModal 
          isOpen={showCreateModal} 
          onClose={() => setShowCreateModal(false)} 
        />
      </>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard del proyecto</h1>
        <p className="text-gray-600">{currentProject.name} - Vista general</p>
        <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
          <span>Investigador principal: {profile?.full_name}</span>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            currentProject.status === 'activo' ? 'bg-green-100 text-green-700' :
            currentProject.status === 'planificacion' ? 'bg-blue-100 text-blue-700' :
            currentProject.status === 'completado' ? 'bg-gray-100 text-gray-700' :
            'bg-yellow-100 text-yellow-700'
          }`}>
            {currentProject.status === 'activo' ? 'Activo' :
             currentProject.status === 'planificacion' ? 'Planificación' :
             currentProject.status === 'completado' ? 'Completado' :
             'Pausado'}
          </span>
        </div>
      </div>

      {/* Stats Grid - Will be populated with real data */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Instrumentos</p>
              <p className="text-3xl font-bold text-gray-900">{loading ? '...' : stats.instruments}</p>
              <p className="text-xs font-medium mt-1 text-blue-600">
                {stats.instruments === 0 ? 'Crear primero' : 'Activos'}
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <ClipboardList className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Participantes</p>
              <p className="text-3xl font-bold text-gray-900">{loading ? '...' : stats.participants}</p>
              <p className="text-xs font-medium mt-1 text-green-600">
                {stats.participants === 0 ? 'Pendiente' : 'Registrados'}
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <Users className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Respuestas</p>
              <p className="text-3xl font-bold text-gray-900">{loading ? '...' : stats.responses}</p>
              <p className="text-xs font-medium mt-1 text-purple-600">
                {stats.responses === 0 ? 'Sin datos' : 'Recolectadas'}
              </p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <Database className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Análisis</p>
              <p className="text-3xl font-bold text-gray-900">{loading ? '...' : stats.analyses}</p>
              <p className="text-xs font-medium mt-1 text-orange-600">
                {stats.analyses === 0 ? 'Pendiente' : 'Ejecutados'}
              </p>
            </div>
            <div className="p-3 bg-orange-100 rounded-lg">
              <BarChart3 className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Tiempo con IA</p>
              <p className="text-3xl font-bold text-gray-900">{loading ? '...' : `${stats.aiTime}h`}</p>
              <p className="text-xs font-medium mt-1 text-indigo-600">
                {stats.aiTime === 0 ? 'Comenzar' : 'Acumulado'}
              </p>
            </div>
            <div className="p-3 bg-indigo-100 rounded-lg">
              <Zap className="w-6 h-6 text-indigo-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Getting Started Guide */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl shadow-sm text-white">
        <div className="p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <Lightbulb className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">Comienza tu investigación</h2>
              <p className="text-white/80 text-sm">Sigue estos pasos para configurar tu proyecto</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white/10 backdrop-blur rounded-lg p-4">
              <h3 className="font-medium mb-2">1. 📋 Define tu metodología</h3>
              <p className="text-sm text-white/90">
                Utiliza el asistente metodológico para validar la coherencia de tu diseño de investigación
              </p>
            </div>
            
            <div className="bg-white/10 backdrop-blur rounded-lg p-4">
              <h3 className="font-medium mb-2">2. 📝 Crea instrumentos</h3>
              <p className="text-sm text-white/90">
                Diseña encuestas y cuestionarios con validación automática por IA
              </p>
            </div>
            
            <div className="bg-white/10 backdrop-blur rounded-lg p-4">
              <h3 className="font-medium mb-2">3. 📊 Recolecta y analiza</h3>
              <p className="text-sm text-white/90">
                Inicia la recolección de datos y ejecuta análisis estadísticos automáticos
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Project Status */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-gray-500" />
            Estado del proyecto
          </h2>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {[
              { 
                phase: 'Planificación', 
                progress: currentProject.status === 'planificacion' ? 50 : 
                         currentProject.status === 'activo' ? 100 : 100, 
                color: 'green' 
              },
              { 
                phase: 'Instrumentos', 
                progress: stats.instruments > 0 ? 100 : 0, 
                color: 'blue' 
              },
              { 
                phase: 'Recolección', 
                progress: stats.responses > 0 ? 100 : stats.instruments > 0 ? 50 : 0, 
                color: 'orange' 
              },
              { 
                phase: 'Análisis', 
                progress: stats.analyses > 0 ? 100 : stats.responses > 0 ? 50 : 0, 
                color: 'purple' 
              },
              { 
                phase: 'Reportes', 
                progress: stats.analyses > 0 ? 75 : 0, 
                color: 'gray' 
              }
            ].map((item, index) => (
              <div key={index}>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">{item.phase}</span>
                  <span className="text-sm text-gray-500">{item.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`bg-${item.color}-600 h-2 rounded-full transition-all duration-500`}
                    style={{ width: `${item.progress}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;