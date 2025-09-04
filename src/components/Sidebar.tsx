import React from 'react';
import { 
  LayoutDashboard, 
  Target, 
  Users, 
  ClipboardList, 
  Database, 
  FolderOpen, 
  BarChart3, 
  MessageSquare, 
  Bot, 
  FileText, 
  GitMerge, 
  UserCheck, 
  FileBarChart, 
  History, 
  UserCog, 
  Settings, 
  Cog,
  Lightbulb,
  Search,
  Bell,
  PieChart,
  Shield,
  LogOut,
} from 'lucide-react';

import { useProjects } from '../hooks/useProjects';
import { useAuth } from '../contexts/AuthContext';

type ActiveModule = 
  | 'dashboard' 
  | 'projects'
  | 'methodology' 
  | 'sample' 
  | 'instruments' 
  | 'data-collection' 
  | 'data' 
  | 'quantitative' 
  | 'qualitative' 
  | 'ai-assistant'
  | 'summarizer'
  | 'files' 
  | 'triangulation' 
  | 'peer-review' 
  | 'reports' 
  | 'analysis-history' 
  | 'collaboration' 
  | 'project-settings' 
  | 'system-settings'
  | 'search'
  | 'notifications'
  | 'visualization'
  | 'recommendations'
  | 'workflow'
  | 'admin';

interface SidebarProps {
  activeModule: ActiveModule;
  setActiveModule: (module: ActiveModule) => void;
}

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'projects', label: 'Mis proyectos', icon: Target },
  { id: 'methodology', label: 'Metodología', icon: Lightbulb },
  { id: 'sample', label: 'Definición de muestra', icon: Users },
  { id: 'instruments', label: 'Instrumentos', icon: ClipboardList },
  { id: 'data-collection', label: 'Recolección de datos', icon: Database },
  { id: 'data', label: 'Datos', icon: FolderOpen },
  { id: 'quantitative', label: 'Análisis cuantitativo', icon: BarChart3 },
  { id: 'qualitative', label: 'Análisis cualitativo', icon: MessageSquare },
  { id: 'ai-assistant', label: 'Asistente conversacional', icon: Bot },
  { id: 'summarizer', label: 'Resumidor de documentos', icon: FileText },
  { id: 'files', label: 'Archivos', icon: FileText },
  { id: 'triangulation', label: 'Triangulación y síntesis', icon: GitMerge },
  { id: 'peer-review', label: 'Revisión por pares', icon: UserCheck },
  { id: 'reports', label: 'Reportes', icon: FileBarChart },
  { id: 'analysis-history', label: 'Historial de análisis', icon: History },
  { id: 'collaboration', label: 'Colaboración', icon: UserCog },
  { id: 'project-settings', label: 'Configuración del proyecto', icon: Settings },
  { id: 'system-settings', label: 'Configuración del sistema', icon: Cog },
  { id: 'search', label: 'Búsqueda avanzada', icon: Search },
  { id: 'notifications', label: 'Notificaciones', icon: Bell },
  { id: 'visualization', label: 'Visualización avanzada', icon: PieChart },
  { id: 'recommendations', label: 'Recomendaciones IA', icon: Lightbulb },
  { id: 'workflow', label: 'Flujo de trabajo', icon: Route },
  { id: 'admin', label: 'Administración', icon: Shield },
] as const;

const Sidebar: React.FC<SidebarProps> = ({ activeModule, setActiveModule }) => {
  const { currentProject } = useProjects();
  const { profile, signOut } = useAuth();

  return (
    <div className="fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200 shadow-sm z-30 flex flex-col">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-lg flex items-center justify-center">
            <Lightbulb className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Synapsis</h1>
            <p className="text-sm text-gray-500">Plataforma de investigación</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="mb-4">
          <div className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2 px-3">
            Proyecto actual
          </div>
          {currentProject ? (
            <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
              <h3 className="font-medium text-blue-900 text-sm">{currentProject.name}</h3>
              <p className="text-xs text-blue-700 mt-1">Proyecto activo</p>
            </div>
          ) : (
            <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
              <h3 className="font-medium text-gray-700 text-sm">Sin proyecto activo</h3>
              <p className="text-xs text-gray-500 mt-1">Crea un proyecto para comenzar</p>
            </div>
          )}
        </div>

        <nav className="space-y-1">
          {menuItems.filter(item => {
            // Filter admin panel for non-admin users
            if (item.id === 'admin' && profile?.role !== 'admin') {
              return false;
            }
            return true;
          }).map((item) => {
            const Icon = item.icon;
            const isActive = activeModule === item.id;
            const isNotification = item.id === 'notifications';
            const unreadCount = isNotification ? 3 : 0; // Mock unread count
            
            return (
              <button
                key={item.id}
                onClick={() => setActiveModule(item.id)}
                className={`w-full flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 group ${
                  isActive 
                    ? 'bg-blue-100 text-blue-700 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <Icon className={`w-5 h-5 mr-3 transition-colors ${
                  isActive ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-600'
                }`} />
                <span className="truncate flex-1">{item.label}</span>
                {isNotification && unreadCount > 0 && (
                  <span className="ml-2 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      <div className="flex-shrink-0 p-4 border-t border-gray-200 bg-gray-50">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-medium">
              {profile?.full_name?.charAt(0) || 'U'}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {profile?.full_name || 'Usuario'}
            </p>
            <p className="text-xs text-gray-500 truncate">
              {profile?.role === 'admin' ? 'Administrador' : 
               profile?.role === 'researcher' ? 'Investigador' : 'Colaborador'}
            </p>
          </div>
          <button
            onClick={signOut}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            title="Cerrar sesión"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;