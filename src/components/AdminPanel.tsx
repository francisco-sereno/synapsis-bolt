import React, { useState } from 'react';
import { 
  Shield, 
  Users, 
  FileText, 
  FolderOpen, 
  Settings, 
  Bot,
  Key,
  Palette,
  Database,
  Plus,
  Edit,
  Trash2,
  Eye,
  Crown
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTemplates } from '../hooks/useTemplates';

const AdminPanel = () => {
  const { profile, isAdmin } = useAuth();
  const { templates: dbTemplates, loading: templatesLoading } = useTemplates();
  const [activeTab, setActiveTab] = useState('users');

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
          <Shield className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Acceso Denegado</h1>
          <p className="text-gray-600">No tienes permisos para acceder al panel de administración</p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'users', label: 'Gestión de Usuarios', icon: Users },
    { id: 'templates', label: 'Plantillas', icon: FileText },
    { id: 'files', label: 'Explorador de Archivos', icon: FolderOpen },
    { id: 'ai-config', label: 'Configuración IA', icon: Bot },
    { id: 'system', label: 'Sistema', icon: Settings }
  ];

  const mockUsers = [
    {
      id: '1',
      name: 'Dr. Rodriguez',
      email: 'rodriguez@universidad.edu',
      role: 'researcher',
      status: 'active',
      lastLogin: '2024-01-12',
      projects: 3
    },
    {
      id: '2',
      name: 'Ana García',
      email: 'ana.garcia@universidad.edu',
      role: 'collaborator',
      status: 'active',
      lastLogin: '2024-01-11',
      projects: 2
    }
  ];

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-2">
          <Crown className="w-8 h-8 text-yellow-600" />
          <h1 className="text-3xl font-bold text-gray-900">Panel de Administración</h1>
        </div>
        <p className="text-gray-600">Gestión global de la plataforma Synapsis</p>
      </div>

      {/* Admin Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Usuarios Totales</p>
              <p className="text-3xl font-bold text-blue-600">247</p>
            </div>
            <Users className="w-8 h-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Proyectos Activos</p>
              <p className="text-3xl font-bold text-green-600">89</p>
            </div>
            <Database className="w-8 h-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Plantillas</p>
              <p className="text-3xl font-bold text-purple-600">12</p>
            </div>
            <FileText className="w-8 h-8 text-purple-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Uso de IA (mes)</p>
              <p className="text-3xl font-bold text-orange-600">1.2k</p>
            </div>
            <Bot className="w-8 h-8 text-orange-600" />
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
          {activeTab === 'users' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-900">Gestión de Usuarios</h2>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
                  <Plus className="w-4 h-4" />
                  <span>Crear Usuario</span>
                </button>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Usuario</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rol</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Proyectos</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Último Acceso</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {mockUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div>
                            <div className="font-medium text-gray-900">{user.name}</div>
                            <div className="text-sm text-gray-500">{user.email}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            user.role === 'admin' ? 'bg-red-100 text-red-700' :
                            user.role === 'researcher' ? 'bg-blue-100 text-blue-700' :
                            'bg-green-100 text-green-700'
                          }`}>
                            {user.role === 'admin' ? 'Administrador' :
                             user.role === 'researcher' ? 'Investigador' :
                             'Colaborador'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            user.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                          }`}>
                            {user.status === 'active' ? 'Activo' : 'Inactivo'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">{user.projects}</td>
                        <td className="px-6 py-4 text-sm text-gray-500">{user.lastLogin}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-2">
                            <button className="p-1 text-blue-600 hover:bg-blue-100 rounded transition-colors">
                              <Eye className="w-4 h-4" />
                            </button>
                            <button className="p-1 text-gray-600 hover:bg-gray-100 rounded transition-colors">
                              <Edit className="w-4 h-4" />
                            </button>
                            <button className="p-1 text-red-600 hover:bg-red-100 rounded transition-colors">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'templates' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-900">Gestión de Plantillas</h2>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
                  <Plus className="w-4 h-4" />
                  <span>Nueva Plantilla</span>
                </button>
              </div>

              {templatesLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="bg-gray-100 animate-pulse rounded-lg h-48"></div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {dbTemplates.map((template) => (
                    <div key={template.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 mb-2">{template.name}</h3>
                          <p className="text-sm text-gray-600 mb-3">{template.description || 'Sin descripción'}</p>
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <span>{Array.isArray(template.questions) ? template.questions.length : 0} preguntas</span>
                            <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                              {template.category}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        <span className="text-sm text-gray-500">Usado {template.usage_count} veces</span>
                        <div className="flex items-center space-x-2">
                          <button className="p-2 text-blue-600 hover:bg-blue-100 rounded transition-colors">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="p-2 text-gray-600 hover:bg-gray-100 rounded transition-colors">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button className="p-2 text-red-600 hover:bg-red-100 rounded transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              {!templatesLoading && dbTemplates.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>No hay plantillas disponibles</p>
                  <p className="text-sm mt-2">Las plantillas aparecerán aquí cuando se creen</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'ai-config' && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-gray-900">Configuración de IA</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Modelos de IA</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900">OpenAI GPT-4</h4>
                        <p className="text-sm text-gray-600">Para análisis de texto y generación</p>
                      </div>
                      <input type="checkbox" className="rounded" defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900">Google Gemini</h4>
                        <p className="text-sm text-gray-600">Para análisis multimodal</p>
                      </div>
                      <input type="checkbox" className="rounded" defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900">Claude Sonnet</h4>
                        <p className="text-sm text-gray-600">Para análisis académico</p>
                      </div>
                      <input type="checkbox" className="rounded" />
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Claves API</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        OpenAI API Key
                      </label>
                      <input
                        type="password"
                        placeholder="sk-..."
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Google AI API Key
                      </label>
                      <input
                        type="password"
                        placeholder="AIza..."
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'system' && (
            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-gray-900">Configuración del Sistema</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Configuración General</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nombre de la Plataforma
                      </label>
                      <input
                        type="text"
                        defaultValue="Synapsis"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        URL Base
                      </label>
                      <input
                        type="url"
                        defaultValue="https://synapsis.research"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900">Registro Público</h4>
                        <p className="text-sm text-gray-600">Permitir registro sin invitación</p>
                      </div>
                      <input type="checkbox" className="rounded" defaultChecked />
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Límites y cuotas</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Proyectos por Usuario
                      </label>
                      <input
                        type="number"
                        defaultValue="10"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tamaño Máximo de Archivo (MB)
                      </label>
                      <input
                        type="number"
                        defaultValue="100"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Solicitudes IA por Día
                      </label>
                      <input
                        type="number"
                        defaultValue="100"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;