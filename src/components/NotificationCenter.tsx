import React, { useState } from 'react';
import { Bell, CheckCircle, AlertCircle, Info, Clock, X, BookMarked as MarkAsRead } from 'lucide-react';

interface Notification {
  id: string;
  type: 'success' | 'warning' | 'info' | 'error';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actionUrl?: string;
  actionLabel?: string;
}

const NotificationCenter = () => {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'success',
      title: 'Análisis Completado',
      message: 'El análisis descriptivo de "Satisfacción Docente v2.0" ha finalizado exitosamente',
      timestamp: '2024-01-12T14:30:00Z',
      read: false,
      actionUrl: '/analysis/descriptive/1',
      actionLabel: 'Ver Resultados'
    },
    {
      id: '2',
      type: 'info',
      title: 'Nueva Respuesta Recibida',
      message: 'Se han recibido 5 nuevas respuestas en la encuesta de satisfacción',
      timestamp: '2024-01-12T13:15:00Z',
      read: false
    },
    {
      id: '3',
      type: 'warning',
      title: 'Validación Pendiente',
      message: 'El instrumento "Entrevista Semiestructurada" requiere validación antes de su uso',
      timestamp: '2024-01-12T10:00:00Z',
      read: true,
      actionUrl: '/instruments/validate/2',
      actionLabel: 'Validar Ahora'
    },
    {
      id: '4',
      type: 'info',
      title: 'Colaborador Invitado',
      message: 'Dr. María López ha sido invitada como Visualizador del proyecto',
      timestamp: '2024-01-11T16:45:00Z',
      read: true
    }
  ]);

  const [filter, setFilter] = useState<'all' | 'unread' | 'success' | 'warning' | 'info' | 'error'>('all');

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, read: true }))
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const filteredNotifications = notifications.filter(notif => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !notif.read;
    return notif.type === filter;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success': return CheckCircle;
      case 'warning': return AlertCircle;
      case 'error': return AlertCircle;
      case 'info': return Info;
      default: return Info;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'success': return 'green';
      case 'warning': return 'yellow';
      case 'error': return 'red';
      case 'info': return 'blue';
      default: return 'gray';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Bell className="w-8 h-8 text-gray-700" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Notificaciones</h1>
            <p className="text-gray-600">
              {unreadCount > 0 ? `${unreadCount} notificaciones sin leer` : 'Todas las notificaciones están al día'}
            </p>
          </div>
        </div>
        
        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <CheckCircle className="w-4 h-4" />
            <span>Marcar Todo como Leído</span>
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6" aria-label="Tabs">
            {[
              { id: 'all', label: 'Todas', count: notifications.length },
              { id: 'unread', label: 'Sin Leer', count: unreadCount },
              { id: 'success', label: 'Éxito', count: notifications.filter(n => n.type === 'success').length },
              { id: 'warning', label: 'Advertencias', count: notifications.filter(n => n.type === 'warning').length },
              { id: 'info', label: 'Información', count: notifications.filter(n => n.type === 'info').length }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilter(tab.id as any)}
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
          {filteredNotifications.length > 0 ? (
            <div className="space-y-4">
              {filteredNotifications.map((notification) => {
                const Icon = getNotificationIcon(notification.type);
                const color = getNotificationColor(notification.type);
                
                return (
                  <div
                    key={notification.id}
                    className={`border rounded-lg p-4 transition-all ${
                      notification.read 
                        ? 'border-gray-200 bg-white' 
                        : 'border-blue-200 bg-blue-50'
                    }`}
                  >
                    <div className="flex items-start space-x-4">
                      <div className={`p-2 bg-${color}-100 rounded-lg`}>
                        <Icon className={`w-5 h-5 text-${color}-600`} />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className={`font-semibold ${notification.read ? 'text-gray-900' : 'text-gray-900'}`}>
                              {notification.title}
                            </h3>
                            <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                            <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                              <span>{new Date(notification.timestamp).toLocaleString()}</span>
                              {!notification.read && (
                                <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full font-medium">
                                  Nuevo
                                </span>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            {!notification.read && (
                              <button
                                onClick={() => markAsRead(notification.id)}
                                className="p-1 text-blue-600 hover:text-blue-700 transition-colors"
                                title="Marcar como leído"
                              >
                                <CheckCircle className="w-4 h-4" />
                              </button>
                            )}
                            <button
                              onClick={() => deleteNotification(notification.id)}
                              className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                              title="Eliminar notificación"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        
                        {notification.actionUrl && notification.actionLabel && (
                          <div className="mt-3">
                            <button className={`text-sm px-3 py-1 bg-${color}-600 text-white rounded hover:bg-${color}-700 transition-colors`}>
                              {notification.actionLabel}
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <Bell className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>No hay notificaciones que coincidan con los filtros seleccionados</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationCenter;