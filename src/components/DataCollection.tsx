import React, { useState } from 'react';
import { Database, Play, Pause, Download, Upload, Mic, FileAudio, Users, BarChart3 } from 'lucide-react';

const DataCollection = () => {
  const [activeTab, setActiveTab] = useState('active');

  const activeCollections = [
    {
      id: 1,
      name: 'Encuesta de Satisfacción Docente v2.0',
      type: 'Cuantitativo',
      status: 'Activo',
      responses: 89,
      target: 200,
      completionRate: 78,
      avgTime: '4.2 min',
      lastResponse: '15 min',
      url: 'https://synapsis.edu/survey/sat-docente-v2'
    },
    {
      id: 2,
      name: 'Focus Group - Experiencia Virtual',
      type: 'Cualitativo',
      status: 'Programado',
      sessions: 3,
      target: 6,
      participants: 18,
      nextSession: '2024-01-15',
      location: 'Zoom Room 1'
    }
  ];

  const completedCollections = [
    {
      id: 3,
      name: 'Autopercepción Académica',
      type: 'Cuantitativo',
      responses: 156,
      completionRate: 94,
      dateCompleted: '2024-01-10'
    }
  ];

  const tabs = [
    { id: 'active', label: 'Recolección Activa', icon: Play },
    { id: 'transcription', label: 'Transcripción Audio', icon: Mic },
    { id: 'import', label: 'Importar Datos', icon: Upload },
    { id: 'completed', label: 'Completados', icon: Database }
  ];

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Recolección de Datos</h1>
        <p className="text-gray-600">Gestiona la recopilación y transcripción de datos de investigación</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Respuestas Activas</p>
              <p className="text-3xl font-bold text-blue-600">89</p>
              <p className="text-xs text-green-600 mt-1">+15 hoy</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Tasa Completado</p>
              <p className="text-3xl font-bold text-green-600">78%</p>
              <p className="text-xs text-green-600 mt-1">+5% esta semana</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <BarChart3 className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div>
            <p className="text-sm font-medium text-gray-600 mb-1">Sesiones Cualitativas</p>
            <p className="text-3xl font-bold text-purple-600">3</p>
            <p className="text-xs text-purple-600 mt-1">de 6 programadas</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div>
            <p className="text-sm font-medium text-gray-600 mb-1">Audio Transcrito</p>
            <p className="text-3xl font-bold text-orange-600">2.5h</p>
            <p className="text-xs text-orange-600 mt-1">95% precisión</p>
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
          {activeTab === 'active' && (
            <div className="space-y-6">
              {/* Active Collections */}
              <div className="space-y-4">
                {activeCollections.map((collection) => (
                  <div key={collection.id} className="bg-white border border-gray-200 rounded-lg p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">{collection.name}</h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            collection.type === 'Cuantitativo' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
                          }`}>
                            {collection.type}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            collection.status === 'Activo' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                          }`}>
                            {collection.status}
                          </span>
                        </div>

                        {collection.type === 'Cuantitativo' ? (
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                              <span className="text-gray-500">Progreso:</span>
                              <div className="mt-1 w-full bg-gray-200 rounded-full h-2">
                                <div 
                                  className="bg-blue-600 h-2 rounded-full" 
                                  style={{ width: `${(collection.responses / collection.target) * 100}%` }}
                                ></div>
                              </div>
                              <span className="text-xs text-gray-600">{collection.responses}/{collection.target}</span>
                            </div>
                            <div>
                              <span className="text-gray-500">Completado:</span>
                              <span className="font-medium text-green-600 ml-2">{collection.completionRate}%</span>
                            </div>
                            <div>
                              <span className="text-gray-500">Tiempo promedio:</span>
                              <span className="font-medium text-gray-900 ml-2">{collection.avgTime}</span>
                            </div>
                            <div>
                              <span className="text-gray-500">Última respuesta:</span>
                              <span className="font-medium text-gray-900 ml-2">{collection.lastResponse}</span>
                            </div>
                          </div>
                        ) : (
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                            <div>
                              <span className="text-gray-500">Sesiones:</span>
                              <span className="font-medium text-gray-900 ml-2">{collection.sessions}/{collection.target}</span>
                            </div>
                            <div>
                              <span className="text-gray-500">Participantes:</span>
                              <span className="font-medium text-gray-900 ml-2">{collection.participants}</span>
                            </div>
                            <div>
                              <span className="text-gray-500">Próxima sesión:</span>
                              <span className="font-medium text-gray-900 ml-2">{collection.nextSession}</span>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center space-x-2">
                        <button className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-colors">
                          <Play className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-yellow-600 hover:bg-yellow-100 rounded-lg transition-colors">
                          <Pause className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors">
                          <Download className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {collection.url && (
                      <div className="bg-gray-50 rounded-lg p-3 mt-4">
                        <label className="text-xs font-medium text-gray-700">URL de la encuesta:</label>
                        <div className="flex items-center space-x-2 mt-1">
                          <input 
                            type="text" 
                            value={collection.url} 
                            readOnly 
                            className="flex-1 text-sm bg-white border border-gray-200 rounded px-3 py-1"
                          />
                          <button className="text-sm px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
                            Copiar
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'transcription' && (
            <div className="space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <FileAudio className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-blue-900">Transcripción Automática con IA</h3>
                    <p className="text-sm text-blue-700 mt-1">
                      Sube archivos de audio de entrevistas y recibe transcripciones precisas automáticamente
                    </p>
                  </div>
                </div>
              </div>

              {/* Upload Area */}
              <label className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors cursor-pointer block">
                <FileAudio className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Subir archivo de audio</h3>
                <p className="text-gray-600 mb-4">Arrastra y suelta archivos MP3, WAV, M4A o haz clic para seleccionar</p>
                <input
                  type="file"
                  accept=".mp3,.wav,.m4a,.mp4"
                  multiple
                  className="hidden"
                  onChange={(e) => {
                    const files = Array.from(e.target.files || []);
                    console.log('Archivos seleccionados:', files);
                  }}
                />
                <div className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors inline-block">
                  Seleccionar Archivos
                </div>
                <p className="text-xs text-gray-500 mt-2">Tamaño máximo: 100MB por archivo</p>
              </label>

              {/* Recent Transcriptions */}
              <div className="bg-white border border-gray-200 rounded-lg">
                <div className="p-4 border-b border-gray-200">
                  <h3 className="font-semibold text-gray-900">Transcripciones Recientes</h3>
                </div>
                <div className="divide-y divide-gray-200">
                  {[
                    {
                      filename: 'focus_group_session_1.mp3',
                      duration: '45:32',
                      status: 'Completado',
                      accuracy: '95%',
                      date: '2024-01-12'
                    },
                    {
                      filename: 'entrevista_participante_03.wav',
                      duration: '28:15',
                      status: 'Procesando...',
                      progress: 75,
                      date: '2024-01-12'
                    }
                  ].map((transcription, index) => (
                    <div key={index} className="p-4 flex items-center justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{transcription.filename}</h4>
                        <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                          <span>Duración: {transcription.duration}</span>
                          <span>Fecha: {transcription.date}</span>
                          {transcription.accuracy && <span>Precisión: {transcription.accuracy}</span>}
                        </div>
                        {transcription.progress && (
                          <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full" 
                              style={{ width: `${transcription.progress}%` }}
                            ></div>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          transcription.status === 'Completado' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {transcription.status}
                        </span>
                        {transcription.status === 'Completado' && (
                          <button className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors">
                            <Download className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'import' && (
            <div className="space-y-6">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <Upload className="w-5 h-5 text-green-600 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-green-900">Importación de Datos</h3>
                    <p className="text-sm text-green-700 mt-1">
                      Importa datos recolectados externamente y mapéalos a tus instrumentos existentes
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Importar desde CSV/Excel</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Seleccionar archivo de datos
                      </label>
                      <input
                        type="file"
                        accept=".csv,.xlsx,.xls"
                        className="w-full p-2 border border-gray-300 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Instrumento de destino
                      </label>
                      <select className="w-full p-3 border border-gray-300 rounded-lg">
                        <option value="">Seleccionar instrumento</option>
                        <option value="1">Encuesta de Satisfacción Docente v2.0</option>
                        <option value="2">Autopercepción Académica</option>
                      </select>
                    </div>
                    <button className="w-full px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                      Iniciar Importación
                    </button>
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Mapeo de Columnas</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Una vez subido el archivo, podrás mapear cada columna a las preguntas correspondientes
                  </p>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="text-sm text-gray-600 space-y-2">
                      <div className="flex justify-between">
                        <span>Columna A →</span>
                        <span className="font-medium">Pregunta 1</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Columna B →</span>
                        <span className="font-medium">Pregunta 2</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Columna C →</span>
                        <span className="text-gray-400">Sin mapear</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'completed' && (
            <div className="space-y-4">
              {completedCollections.map((collection) => (
                <div key={collection.id} className="bg-white border border-gray-200 rounded-lg p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{collection.name}</h3>
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                          Completado
                        </span>
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">Respuestas:</span>
                          <span className="font-medium text-gray-900 ml-2">{collection.responses}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Tasa completado:</span>
                          <span className="font-medium text-green-600 ml-2">{collection.completionRate}%</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Fecha completado:</span>
                          <span className="font-medium text-gray-900 ml-2">{collection.dateCompleted}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                        Analizar Datos
                      </button>
                      <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DataCollection;