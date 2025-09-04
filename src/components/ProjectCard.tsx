import React, { useState } from 'react';
import { Calendar, Users, Clock, MoreVertical, Edit, Trash2, Archive } from 'lucide-react';

interface Project {
  id: string;
  name: string;
  description: string | null;
  methodology: string;
  design: string;
  institution: string | null;
  principal_investigator: string;
  start_date: string | null;
  end_date: string | null;
  status: 'planificacion' | 'activo' | 'completado' | 'pausado';
  ethics_approval: string | null;
  visibility: 'private' | 'institutional' | 'public';
  settings: any;
  created_at: string;
  updated_at: string;
  project_collaborators?: any[];
}

interface ProjectCardProps {
  project: Project;
  onEdit: (project: Project) => void;
  onDelete: (id: string) => void;
  onArchive: (id: string) => void;
}

export default function ProjectCard({ project, onEdit, onDelete, onArchive }: ProjectCardProps) {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{project.name}</h3>
          <p className="text-gray-600 text-sm line-clamp-2">{project.description}</p>
        </div>
        <div className="relative ml-4">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-1 hover:bg-gray-100 rounded-full"
          >
            <MoreVertical className="w-4 h-4" />
          </button>
          {showMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border">
              <button
                onClick={() => {
                  onEdit(project);
                  setShowMenu(false);
                }}
                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </button>
              <button
                onClick={() => {
                  onArchive(project.id);
                  setShowMenu(false);
                }}
                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
              >
                <Archive className="w-4 h-4 mr-2" />
                Archive
              </button>
              <button
                onClick={() => {
                  onDelete(project.id);
                  setShowMenu(false);
                }}
                className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center text-sm text-gray-500 mb-2">
          <Calendar className="w-4 h-4 mr-1" />
          <span>
            Updated {new Date(project.updated_at).toLocaleDateString()}
          </span>
        </div>

        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center">
            <Users className="w-4 h-4 mr-1" />
            <span>{project.project_collaborators?.length || 0} collaborators</span>
          </div>
          <div className="flex items-center">
            <Clock className="w-4 h-4 mr-1" />
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              project.status === 'activo' ? 'bg-green-100 text-green-800' :
              project.status === 'completado' ? 'bg-blue-100 text-blue-800' :
              project.status === 'pausado' ? 'bg-yellow-100 text-yellow-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              {project.status === 'activo' && 'Activo'}
              {project.status === 'completado' && 'Completado'}
              {project.status === 'pausado' && 'Pausado'}
              {project.status === 'planificacion' && 'Planificación'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}