import React, { useState } from 'react';
import { useProjects } from '../hooks/useProjects';
import { useAuth } from '../contexts/AuthContext';
import { Target, Plus, Calendar, MoreVertical, Trash2, Eye } from 'lucide-react';
import ProjectCreationModal from './ProjectCreationModal';

const ProjectList = () => {
  const { projects, currentProject, setCurrentProject, deleteProject } = useProjects();
  useAuth();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState<string | null>(null);

  const handleDeleteProject = async (projectId: string) => {
    const { error } = await deleteProject(projectId);
    if (!error) {
      setShowDeleteModal(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'activo': return 'green';
      case 'planificacion': return 'blue';
      case 'completado': return 'gray';
      case 'pausado': return 'yellow';
      default: return 'gray';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'activo': return 'Activo';
      case 'planificacion': return 'Planificación';
      case 'completado': return 'Completado';
      case 'pausado': return 'Pausado';
      default: return status;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Mis proyectos</h1>
          <p className="text-gray-600">Gestiona todos tus proyectos de investigación</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Nuevo proyecto</span>
        </button>
      </div>

      {projects.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
          <Target className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">No tienes proyectos</h2>
          <p className="text-gray-600 mb-6">Crea tu primer proyecto para comenzar a usar Synapsis</p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Crear primer proyecto
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div
              key={project.id}
              className={`bg-white border-2 rounded-xl p-6 hover:shadow-lg transition-all cursor-pointer ${
                currentProject?.id === project.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
              }`}
              onClick={() => setCurrentProject(project)}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                    {project.name}
                  </h3>
                  <p className="text-sm text-gray-600 line-clamp-3 mb-3">
                    {project.description || 'Sin descripción'}
                  </p>
                </div>
                
                <div className="relative">
                  <button className="p-1 text-gray-400 hover:text-gray-600 transition-colors">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">Estado:</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium bg-${getStatusColor(project.status)}-100 text-${getStatusColor(project.status)}-700`}>
                    {getStatusLabel(project.status)}
                  </span>
                </div>

                {project.methodology && (
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">Metodología:</span>
                    <span className="text-xs font-medium text-gray-900 capitalize">
                      {project.methodology.replace('_', ' ')}
                    </span>
                  </div>
                )}

                {project.design && (
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">Diseño:</span>
                    <span className="text-xs font-medium text-gray-900 capitalize">
                      {project.design.replace('_', ' ')}
                    </span>
                  </div>
                )}

                {project.institution && (
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">Institución:</span>
                    <span className="text-xs font-medium text-gray-900">{project.institution}</span>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">Creado:</span>
                  <span className="text-xs font-medium text-gray-900">
                    {new Date(project.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span className="text-xs text-gray-500">
                    {project.start_date ? new Date(project.start_date).toLocaleDateString() : 'Sin fecha'}
                  </span>
                </div>
                
                <div className="flex items-center space-x-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentProject(project);
                    }}
                    className="p-1 text-blue-600 hover:bg-blue-100 rounded transition-colors"
                    title="Seleccionar proyecto"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowDeleteModal(project.id);
                    }}
                    className="p-1 text-red-600 hover:bg-red-100 rounded transition-colors"
                    title="Eliminar proyecto"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Project Modal */}
      <ProjectCreationModal 
        isOpen={showCreateModal} 
        onClose={() => setShowCreateModal(false)} 
      />

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-red-900">Confirmar Eliminación</h2>
            </div>
            
            <div className="p-6">
              <p className="text-gray-700 mb-4">
                ¿Estás seguro de que quieres eliminar este proyecto? Esta acción no se puede deshacer.
              </p>
              
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-sm text-red-700">
                  Se eliminarán todos los datos, análisis y configuraciones asociadas al proyecto.
                </p>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteModal(null)}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={() => handleDeleteProject(showDeleteModal)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Eliminar Proyecto
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectList;