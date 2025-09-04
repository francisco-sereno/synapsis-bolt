import React, { useState } from 'react';

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
  settings: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

interface ProjectFormData {
  name: string;
  description: string;
  methodology: string;
  design: string;
  status: 'planificacion' | 'activo' | 'completado' | 'pausado';
  institution: string;
  start_date: string;
  end_date: string;
  ethics_approval: string;
}

interface ProjectFormProps {
  project?: Project | null;
  onSubmit: (data: ProjectFormData) => void;
  onCancel: () => void;
}

const ProjectForm: React.FC<ProjectFormProps> = ({ project, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState<ProjectFormData>({
    name: project?.name || '',
    description: project?.description || '',
    methodology: project?.methodology || '',
    design: project?.design || '',
    status: project?.status || 'planificacion',
    institution: project?.institution || '',
    start_date: project?.start_date || '',
    end_date: project?.end_date || '',
    ethics_approval: project?.ethics_approval || ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Project Name</label>
           <input
             type="text"
             value={formData.name}
             onChange={(e) => setFormData({ ...formData, name: e.target.value })}
             className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter project name"
             required
           />
         </div>
 
         <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
           <textarea
             value={formData.description || ''}
             onChange={(e) => setFormData({ ...formData, description: e.target.value })}
             rows={3}
             className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Describe your project"
           />
         </div>
 
        <div className="grid grid-cols-2 gap-4">
           <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
            <input
              type="date"
              value={formData.start_date}
              onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
           <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
            <input
              type="date"
              value={formData.end_date || ''}
              onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
 
         <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <select
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value as ProjectFormData['status'] })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
           <option value="planificacion">Planificación</option>
           <option value="activo">Activo</option>
           <option value="completado">Completado</option>
           <option value="pausado">Pausado</option>
            <option value="completed">Completed</option>
            <option value="archived">Archived</option>
          </select>
        </div>
 
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            {project ? 'Update' : 'Create'} Project
          </button>
        </div>
      </form>
   );
 };
 
 export default ProjectForm;