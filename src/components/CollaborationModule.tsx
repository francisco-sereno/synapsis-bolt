import React, { useState } from 'react';
import { UserCog, Plus, Mail, Shield, Users, Settings, Crown, Edit, Trash2, Clock, CheckCircle, BarChart3, Upload } from 'lucide-react';
import { useCollaborators } from '../hooks/useCollaborators';
import { useProjects } from '../hooks/useProjects';

const CollaborationModule = () => {
  const { currentProject } = useProjects();
  const { collaborators, loading, inviteCollaborator, removeCollaborator } = useCollaborators(currentProject?.id);
  
  const [activeTab, setActiveTab] = useState('team');
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteLoading, setInviteLoading] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('collaborator');

  // Transform collaborators data for display
  const teamMembers = collaborators.map(collab => ({
    id: collab.id,
    name: collab.profiles?.full_name || 'Usuario',
    email: collab.profiles?.email || 'Sin email',
    role: collab.role,
    status: collab.status === 'accepted' ? 'Activo' : 'Invitado',
    joinDate: new Date(collab.joined_at || collab.invited_at).toLocaleDateString(),
    lastActivity: 'Reciente',
    contributions: 0,
    avatar: (collab.profiles?.full_name || 'U').split(' ').map(n => n[0]).join('').toUpperCase()
  }));

  const activityLog = [
    {
      id: 1,
      user: 'Dr. Rodriguez',
      action: 'Ejecutó análisis descriptivo',
      target: 'Satisfacción Docente v2.0',
      timestamp: '2024-01-12 14:30',
      type: 'analysis'
    },
    {
      id: 2,
      user: 'Ana García',
      action: 'Creó nuevo instrumento',
      target: 'Encuesta de Experiencia Virtual',
      timestamp: '2024-01-12 10:15',
      type: 'create'
    },
    {
      id: 3,
      user: 'Carlos Mendez',
      action: 'Subió transcripción',
      target: 'Focus Group Sesión 3',
      timestamp: '2024-01-11 16:45',
      type: 'upload'
    },
    {
      id: 4,
      user: 'Dr. Rodriguez',
      action: 'Invitó colaborador',
      target: 'Dr. María López',
      timestamp: '2024-01-10 09:20',
      type: 'invite'
    }
  ];

  const permissions = [
    { module: 'Dashboard', admin: true, editor: true, collaborator: true, viewer: true },
    { module: 'Metodología', admin: true, editor: true, collaborator: true, viewer: false },
    { module: 'Instrumentos', admin: true, editor: true, collaborator: false, viewer: false },
    { module: 'Recolección', admin: true, editor: true, collaborator: true, viewer: false },
    { module: 'Análisis', admin: true, editor: true, collaborator: false, viewer: false },
    { module: 'Reportes', admin: true, editor: true, collaborator: false, viewer: false },
    { module: 'Configuración', admin: true, editor: false, collaborator: false, viewer: false }
  ];

  const tabs = [
    { id: 'team', label: 'Equipo', icon: Users },
    { id: 'permissions', label: 'Permisos', icon: Shield },
    { id: 'activity', label: 'Actividad', icon: Clock }
  ];

  const getRoleInfo = (role) => {
    switch (role) {
      case 'admin':
        return { label: 'Administrador', color: 'red', icon: Crown };
      case 'editor':
        return { label: 'Editor', color: 'blue', icon: Edit };
      case 'collaborator':
        return { label: 'Colaborador', color: 'green', icon: Users };
      case 'viewer':
        return { label: 'Visualizador', color: 'gray', icon: Shield };
      default:
        return { label: 'Usuario', color: 'gray', icon: Users };
    }
  };

  const handleInvite = async () => {
    if (!inviteEmail.trim()) return;
    
    setInviteLoading(true);
    try {
      const { error } = await inviteCollaborator(inviteEmail, inviteRole as any);
      if (error) {
        alert('Error al invitar colaborador: ' + error.message);
      } else {
        setInviteEmail('');
        setShowInviteModal(false);
      }
    } catch (error) {
      console.error('Error inviting collaborator:', error);
      alert('Error al invitar colaborador');
    } finally {
      setInviteLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Colaboración</h1>
        <p className="text-gray-600">Gestiona tu equipo de investigación y controla el acceso al proyecto</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Miembros del Equipo</p>
              <p className="text-3xl font-bold text-blue-600">{loading ? '...' : collaborators.length}</p>
            </div>
            <Users className="w-8 h-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Miembros Activos</p>
              <p className="text-3xl font-bold text-green-600">
                {loading ? '...' : collaborators.filter(c => c.status === 'accepted').length}
              </p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Contribuciones</p>
              <p className="text-3xl font-bold text-purple-600">
                {loading ? '...' : '0'}
              </p>
            </div>
            <UserCog className="w-8 h-8 text-purple-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Invitaciones Pendientes</p>
              <p className="text-3xl font-bold text-orange-600">
                {loading ? '...' : collaborators.filter(c => c.status === 'pending').length}
              </p>
            </div>
            <Mail className="w-8 h-8 text-orange-600" />
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
          {activeTab === 'team' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-900">Miembros del Equipo</h2>
                <button
                  onClick={() => setShowInviteModal(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Invitar Miembro</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {teamMembers.map((member) => {
                  const roleInfo = getRoleInfo(member.role);
                  const RoleIcon = roleInfo.icon;
                  
                  return (
                    <div key={member.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center">
                            <span className="text-white font-medium">{member.avatar}</span>
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">{member.name}</h3>
                            <p className="text-sm text-gray-600">{member.email}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-1">
                          <RoleIcon className={`w-4 h-4 text-${roleInfo.color}-600`} />
                          <span className={`px-2 py-1 bg-${roleInfo.color}-100 text-${roleInfo.color}-700 text-xs rounded-full font-medium`}>
                            {roleInfo.label}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-500">Estado:</span>
                          <span className={`font-medium ${
                            member.status === 'Activo' ? 'text-green-600' : 'text-yellow-600'
                          }`}>
                            {member.status}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Se unió:</span>
                          <span className="font-medium text-gray-900">{member.joinDate}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Última actividad:</span>
                          <span className="font-medium text-gray-900">{member.lastActivity}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Contribuciones:</span>
                          <span className="font-medium text-blue-600">{member.contributions}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
                        <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                          Ver Perfil
                        </button>
                        <div className="flex items-center space-x-1">
                          <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors">
                            <Settings className="w-4 h-4" />
                          </button>
                          {member.role !== 'admin' && (
                            <button 
                              onClick={() => removeCollaborator(member.id)}
                              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-100 rounded transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'permissions' && (
            <div className="space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-medium text-blue-900 mb-2">Matriz de Permisos</h3>
                <p className="text-sm text-blue-700">
                  Controla qué módulos puede acceder cada rol en el proyecto
                </p>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Módulo
                        </th>
                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Administrador
                        </th>
                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Editor
                        </th>
                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Colaborador
                        </th>
                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Visualizador
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {permissions.map((permission, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {permission.module}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-center">
                            {permission.admin ? (
                              <CheckCircle className="w-5 h-5 text-green-600 mx-auto" />
                            ) : (
                              <div className="w-5 h-5 bg-gray-200 rounded-full mx-auto"></div>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-center">
                            {permission.editor ? (
                              <CheckCircle className="w-5 h-5 text-green-600 mx-auto" />
                            ) : (
                              <div className="w-5 h-5 bg-gray-200 rounded-full mx-auto"></div>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-center">
                            {permission.collaborator ? (
                              <CheckCircle className="w-5 h-5 text-green-600 mx-auto" />
                            ) : (
                              <div className="w-5 h-5 bg-gray-200 rounded-full mx-auto"></div>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-center">
                            {permission.viewer ? (
                              <CheckCircle className="w-5 h-5 text-green-600 mx-auto" />
                            ) : (
                              <div className="w-5 h-5 bg-gray-200 rounded-full mx-auto"></div>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { role: 'admin', description: 'Acceso completo a todos los módulos y configuraciones' },
                  { role: 'editor', description: 'Puede crear y modificar instrumentos y análisis' },
                  { role: 'collaborator', description: 'Acceso limitado para contribuir con datos' },
                  { role: 'viewer', description: 'Solo puede visualizar resultados y reportes' }
                ].map((roleDesc) => {
                  const roleInfo = getRoleInfo(roleDesc.role);
                  const RoleIcon = roleInfo.icon;
                  
                  return (
                    <div key={roleDesc.role} className={`bg-${roleInfo.color}-50 border border-${roleInfo.color}-200 rounded-lg p-4`}>
                      <div className="flex items-center space-x-2 mb-2">
                        <RoleIcon className={`w-5 h-5 text-${roleInfo.color}-600`} />
                        <h3 className={`font-medium text-${roleInfo.color}-900`}>{roleInfo.label}</h3>
                      </div>
                      <p className={`text-sm text-${roleInfo.color}-700`}>{roleDesc.description}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'activity' && (
            <div className="space-y-6">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h3 className="font-medium text-green-900 mb-2">Log de Actividades</h3>
                <p className="text-sm text-green-700">
                  Registro completo de todas las acciones realizadas en el proyecto
                </p>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg">
                <div className="p-4 border-b border-gray-200">
                  <div className="flex items-center space-x-4">
                    <input
                      type="text"
                      placeholder="Buscar actividades..."
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                      <option value="">Todos los tipos</option>
                      <option value="analysis">Análisis</option>
                      <option value="create">Creación</option>
                      <option value="upload">Subida</option>
                      <option value="invite">Invitación</option>
                    </select>
                  </div>
                </div>

                <div className="divide-y divide-gray-200">
                  {activityLog.map((activity) => (
                    <div key={activity.id} className="p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-start space-x-4">
                        <div className={`p-2 rounded-lg ${
                          activity.type === 'analysis' ? 'bg-blue-100' :
                          activity.type === 'create' ? 'bg-green-100' :
                          activity.type === 'upload' ? 'bg-purple-100' :
                          'bg-orange-100'
                        }`}>
                          {activity.type === 'analysis' && <BarChart3 className="w-4 h-4 text-blue-600" />}
                          {activity.type === 'create' && <Plus className="w-4 h-4 text-green-600" />}
                          {activity.type === 'upload' && <Upload className="w-4 h-4 text-purple-600" />}
                          {activity.type === 'invite' && <Mail className="w-4 h-4 text-orange-600" />}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900">
                            <span className="text-blue-600">{activity.user}</span> {activity.action}
                          </p>
                          <p className="text-sm text-gray-600">{activity.target}</p>
                          <p className="text-xs text-gray-500 mt-1">{activity.timestamp}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Invitar colaborador</h2>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Correo electrónico
                </label>
                <input
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="colaborador@universidad.edu"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rol en el proyecto
                </label>
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="viewer">Visualizador</option>
                  <option value="collaborator">Colaborador</option>
                  <option value="editor">Editor</option>
                  <option value="admin">Administrador</option>
                </select>
              </div>

              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-sm text-gray-700">
                  <strong>{getRoleInfo(inviteRole).label}:</strong> {
                    inviteRole === 'admin' ? 'Acceso completo a todos los módulos y configuraciones' :
                    inviteRole === 'editor' ? 'Puede crear y modificar instrumentos y análisis' :
                    inviteRole === 'collaborator' ? 'Acceso limitado para contribuir con datos' :
                    'Solo puede visualizar resultados y reportes'
                  }
                </p>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
              <button
                onClick={() => setShowInviteModal(false)}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleInvite}
                disabled={!inviteEmail.trim() || inviteLoading}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
              >
                {inviteLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Enviando...</span>
                  </>
                ) : (
                  <span>Enviar Invitación</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CollaborationModule;