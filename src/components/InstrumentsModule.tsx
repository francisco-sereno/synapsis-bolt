import React, { useState } from 'react';
import InstrumentPrevalidation from './InstrumentPrevalidation';
import InstrumentBuilder from './InstrumentBuilder';
import { useInstruments } from '../hooks/useInstruments';
import { useProjects } from '../hooks/useProjects';
import { useTemplates } from '../hooks/useTemplates';
import { useAI } from '../hooks/useAI';
import { ClipboardList, Plus, Eye, Edit, BarChart3, Settings, FileText, Wand2, CheckCircle, Shield, X } from 'lucide-react';

const InstrumentsModule = () => {
  const { currentProject } = useProjects();
  const { instruments, loading, createInstrument } = useInstruments(currentProject?.id);
  const { templates: dbTemplates, loading: templatesLoading, useTemplate: applyTemplate } = useTemplates();
  const { generateInstrumentFromDocument, generateInstrumentFromCode, loading: aiLoading } = useAI();
  const [activeTab, setActiveTab] = useState('list');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createMethod, setCreateMethod] = useState<'scratch' | 'document' | 'code' | 'ai'>('scratch');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [codeInput, setCodeInput] = useState('');
  const [aiPrompt, setAiPrompt] = useState('');
  const [newInstrumentData, setNewInstrumentData] = useState({
    name: '',
    description: '',
    type: 'survey' as 'survey' | 'interview' | 'observation' | 'scale' | 'test'
  });

  const tabs = [
    { id: 'list', label: 'Mis Instrumentos', icon: ClipboardList },
    { id: 'builder', label: 'Constructor Visual', icon: Plus },
    { id: 'templates', label: 'Plantillas', icon: FileText },
    { id: 'validation', label: 'Validación IA', icon: Wand2 },
    { id: 'prevalidation', label: 'Prevalidación Experta', icon: Shield }
  ];

  const handleUseTemplate = async (template: { id: string; name: string; }) => {
    const { error } = await applyTemplate(template.id);
    if (!error) {
      // Here you would typically create a new instrument based on the template
      console.log('Using template:', template.name);
    }
  };

  const handleCreateInstrument = async () => {
    if (!currentProject?.id) {
      alert('No hay proyecto activo');
      return;
    }

    if (!newInstrumentData.name.trim()) {
      alert('Por favor ingresa un nombre para el instrumento');
      return;
    }

    try {
      let questions = [];
      
      if (createMethod === 'document' && uploadedFile) {
        const result = await generateInstrumentFromDocument(uploadedFile);
        if (result) {
          questions = result.questions;
          if (!newInstrumentData.name.trim()) {
            setNewInstrumentData(prev => ({ ...prev, name: result.metadata.title }));
          }
          if (!newInstrumentData.description.trim()) {
            setNewInstrumentData(prev => ({ ...prev, description: result.metadata.description }));
          }
        }
      } else if (createMethod === 'code' && codeInput.trim()) {
        const result = await generateInstrumentFromCode(codeInput);
        if (result) {
          questions = result.questions;
          if (!newInstrumentData.name.trim()) {
            setNewInstrumentData(prev => ({ ...prev, name: result.metadata.title }));
          }
          if (!newInstrumentData.description.trim()) {
            setNewInstrumentData(prev => ({ ...prev, description: result.metadata.description }));
          }
        }
      }

      const { error } = await createInstrument({
        name: newInstrumentData.name,
        description: newInstrumentData.description,
        type: newInstrumentData.type,
        questions,
        metadata: {
          createdMethod: createMethod,
          estimatedTime: questions.length * 0.5
        }
      });

      if (error) {
        alert('Error al crear instrumento: ' + error.message);
      } else {
        setShowCreateModal(false);
        setNewInstrumentData({ name: '', description: '', type: 'survey' });
        setUploadedFile(null);
        setCodeInput('');
        setAiPrompt('');
        setActiveTab('list');
      }
    } catch (error) {
      console.error('Error creating instrument:', error);
      alert('Error al crear instrumento');
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile(file);
    }
  };

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Instrumentos de Investigación</h1>
        <p className="text-gray-600">Crea, valida y gestiona tus herramientas de recolección de datos</p>
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
          {activeTab === 'prevalidation' && <InstrumentPrevalidation />}
          {activeTab === 'builder' && <InstrumentBuilder />}
          {activeTab === 'list' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-4">
                  <input
                    type="text"
                    placeholder="Buscar instrumentos..."
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option value="">Todos los tipos</option>
                    <option value="quantitative">Cuantitativo</option>
                    <option value="qualitative">Cualitativo</option>
                  </select>
                </div>
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Nuevo instrumento</span>
                </button>
              </div>

              {loading ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="bg-gray-100 animate-pulse rounded-lg h-48"></div>
                  ))}
                </div>
              ) : instruments.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                  {instruments.map((instrument) => (
                    <div key={instrument.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 mb-2 leading-tight">{instrument.name}</h3>
                          <div className="flex items-center space-x-2 mb-2">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              instrument.type === 'survey' ? 'bg-blue-100 text-blue-700' : 
                              instrument.type === 'interview' ? 'bg-purple-100 text-purple-700' :
                              instrument.type === 'scale' ? 'bg-green-100 text-green-700' :
                              'bg-gray-100 text-gray-700'
                            }`}>
                              {instrument.type === 'survey' ? 'Encuesta' :
                               instrument.type === 'interview' ? 'Entrevista' :
                               instrument.type === 'scale' ? 'Escala' :
                               instrument.type === 'observation' ? 'Observación' :
                               'Test'}
                            </span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              instrument.status === 'active' ? 'bg-green-100 text-green-700' :
                              instrument.status === 'draft' ? 'bg-yellow-100 text-yellow-700' :
                              instrument.status === 'validated' ? 'bg-blue-100 text-blue-700' :
                              'bg-gray-100 text-gray-700'
                            }`}>
                              {instrument.status === 'active' ? 'Activo' :
                               instrument.status === 'draft' ? 'Borrador' :
                               instrument.status === 'validated' ? 'Validado' :
                               instrument.status === 'completed' ? 'Completado' :
                               'Archivado'}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                        <div>
                          <span className="text-gray-500">Preguntas:</span>
                          <span className="font-medium text-gray-900 ml-2">
                            {Array.isArray(instrument.questions) ? instrument.questions.length : 0}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-500">Tipo:</span>
                          <span className="font-medium text-gray-900 ml-2 capitalize">{instrument.type}</span>
                        </div>
                      </div>
                      
                      <p className="text-xs text-gray-500 mb-4">
                        Modificado {new Date(instrument.updated_at).toLocaleDateString()}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded">
                          {instrument.description || 'Sin descripción'}
                        </span>
                        <div className="flex items-center space-x-1">
                          <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors">
                            <BarChart3 className="w-4 h-4" />
                          </button>
                          <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors">
                            <Settings className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <ClipboardList className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>No hay instrumentos creados</p>
                  <p className="text-sm mt-2">Crea tu primer instrumento para comenzar</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'create' && (
            <div className="space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-medium text-blue-900 mb-2">Opciones de Creación</h3>
                <p className="text-sm text-blue-700">Elige cómo quieres crear tu nuevo instrumento</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div 
                  onClick={() => {
                    setCreateMethod('scratch');
                    setShowCreateModal(true);
                  }}
                  className="bg-white border border-gray-200 rounded-lg p-6 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                    <Plus className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Crear desde Cero</h3>
                  <p className="text-sm text-gray-600 mb-4">Construye tu instrumento paso a paso con nuestro editor visual</p>
                  <button className="text-sm text-blue-600 font-medium hover:text-blue-700">Comenzar →</button>
                </div>

                <div 
                  onClick={() => {
                    setCreateMethod('document');
                    setShowCreateModal(true);
                  }}
                  className="bg-white border border-gray-200 rounded-lg p-6 hover:border-green-300 hover:shadow-md transition-all cursor-pointer">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                    <FileText className="w-6 h-6 text-green-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Desde Documento</h3>
                  <p className="text-sm text-gray-600 mb-4">Sube un PDF o DOCX y convierte automáticamente a instrumento</p>
                  <button className="text-sm text-green-600 font-medium hover:text-green-700">Subir Archivo →</button>
                </div>

                <div 
                  onClick={() => {
                    setCreateMethod('code');
                    setShowCreateModal(true);
                  }}
                  className="bg-white border border-gray-200 rounded-lg p-6 hover:border-orange-300 hover:shadow-md transition-all cursor-pointer">
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                    <FileText className="w-6 h-6 text-orange-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Desde Código</h3>
                  <p className="text-sm text-gray-600 mb-4">Convierte código HTML/JSX existente en instrumento</p>
                  <button className="text-sm text-orange-600 font-medium hover:text-orange-700">Pegar Código →</button>
                </div>

                <div 
                  onClick={() => {
                    setCreateMethod('ai');
                    setShowCreateModal(true);
                  }}
                  className="bg-white border border-gray-200 rounded-lg p-6 hover:border-purple-300 hover:shadow-md transition-all cursor-pointer">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                    <Wand2 className="w-6 h-6 text-purple-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Asistido por IA</h3>
                  <p className="text-sm text-gray-600 mb-4">Describe tu investigación y la IA creará el instrumento</p>
                  <button className="text-sm text-purple-600 font-medium hover:text-purple-700">Comenzar con IA →</button>
                </div>
              </div>

            </div>
          )}

          {activeTab === 'templates' && (
            <div className="space-y-6">
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <h3 className="font-medium text-amber-900 mb-2">Plantillas Especializadas</h3>
                <p className="text-sm text-amber-700">Instrumentos validados y listos para usar en tu investigación</p>
              </div>

              {templatesLoading ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="bg-gray-100 animate-pulse rounded-lg h-48"></div>
                  ))}
                </div>
              ) : dbTemplates.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                      <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                        Vista Previa
                      </button>
                      <button
                        onClick={() => handleUseTemplate(template)}
                        className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Usar Plantilla
                      </button>
                    </div>
                  </div>
                ))}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>No hay plantillas disponibles</p>
                  <p className="text-sm mt-2">Las plantillas aparecerán aquí cuando se creen</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'validation' && (
            <div className="space-y-6">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-green-900">Validación Inteligente de Instrumentos</h3>
                    <p className="text-sm text-green-700 mt-1">
                      Obtén análisis detallados sobre la calidad, claridad y potencial sesgo de tus preguntas
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Seleccionar Instrumento para Validar</h3>
                <div className="space-y-3">
                  {instruments.filter(i => i.status !== 'completed').map((instrument) => (
                    <div key={instrument.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{instrument.name}</h4>
                        <p className="text-sm text-gray-600">
                          {Array.isArray(instrument.questions) ? instrument.questions.length : 0} preguntas • {instrument.type}
                        </p>
                      </div>
                      <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2">
                        <Wand2 className="w-4 h-4" />
                        <span>Validar con IA</span>
                      </button>
                    </div>
                  ))}
                  {instruments.filter(i => i.status !== 'completed').length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <Wand2 className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                      <p>No hay instrumentos disponibles para validar</p>
                      <p className="text-sm mt-2">Crea un instrumento primero</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <h3 className="font-semibold text-blue-900 mb-2">Validación Básica</h3>
                  <p className="text-sm text-blue-700 mb-4">Evaluación rápida de criterios fundamentales</p>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Claridad y comprensión</li>
                    <li>• Estructura y organización</li>
                    <li>• Relevancia temática</li>
                  </ul>
                </div>

                <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
                  <h3 className="font-semibold text-purple-900 mb-2">Validación Avanzada</h3>
                  <p className="text-sm text-purple-700 mb-4">Análisis profundo con métricas especializadas</p>
                  <ul className="text-sm text-purple-700 space-y-1">
                    <li>• Detección de sesgos</li>
                    <li>• Validez de contenido</li>
                    <li>• Recomendaciones de mejora</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Create Instrument Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Crear Nuevo Instrumento</h2>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre del Instrumento *
                  </label>
                  <input
                    type="text"
                    value={newInstrumentData.name}
                    onChange={(e) => setNewInstrumentData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Ej: Encuesta de Satisfacción Estudiantil"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tipo de Instrumento *
                  </label>
                  <select 
                    value={newInstrumentData.type}
                    onChange={(e) => setNewInstrumentData(prev => ({ ...prev, type: e.target.value as 'survey' | 'interview' | 'observation' | 'scale' | 'test' }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="survey">Encuesta Cuantitativa</option>
                    <option value="interview">Entrevista Cualitativa</option>
                    <option value="observation">Guía de Observación</option>
                    <option value="scale">Escala Psicométrica</option>
                    <option value="test">Test o Prueba</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Descripción
                  </label>
                  <textarea
                    value={newInstrumentData.description}
                    onChange={(e) => setNewInstrumentData(prev => ({ ...prev, description: e.target.value }))}
                    rows={3}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Describe el propósito y alcance de este instrumento..."
                  />
                </div>
              </div>

              {/* Creation Method Specific Content */}
              {createMethod === 'document' && (
                <div className="space-y-4">
                  <h3 className="font-medium text-gray-900">Subir Documento</h3>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                    <FileText className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600 mb-2">Arrastra un archivo PDF/DOCX aquí</p>
                    <input
                      type="file"
                      accept=".pdf,.docx,.doc"
                      onChange={handleFileUpload}
                      className="hidden"
                      id="document-upload"
                    />
                    <label
                      htmlFor="document-upload"
                      className="text-sm text-blue-600 hover:text-blue-700 cursor-pointer"
                    >
                      o haz clic para seleccionar
                    </label>
                  </div>
                  {uploadedFile && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                      <p className="text-sm text-green-700">
                        Archivo seleccionado: {uploadedFile.name} ({(uploadedFile.size / 1024).toFixed(1)} KB)
                      </p>
                    </div>
                  )}
                </div>
              )}

              {createMethod === 'code' && (
                <div className="space-y-4">
                  <h3 className="font-medium text-gray-900">Código HTML/JSX</h3>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Pegar código de formulario
                    </label>
                    <textarea
                      value={codeInput}
                      onChange={(e) => setCodeInput(e.target.value)}
                      rows={10}
                      className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                      placeholder="<form>
  <label>Pregunta 1:</label>
  <input type='text' name='q1' />
  
  <label>Pregunta 2:</label>
  <select name='q2'>
    <option>Opción A</option>
    <option>Opción B</option>
  </select>
</form>"
                    />
                  </div>
                </div>
              )}

              {createMethod === 'ai' && (
                <div className="space-y-4">
                  <h3 className="font-medium text-gray-900">Descripción para IA</h3>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Describe tu investigación
                    </label>
                    <textarea
                      value={aiPrompt}
                      onChange={(e) => setAiPrompt(e.target.value)}
                      rows={6}
                      className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Describe tu investigación: objetivo, población objetivo, variables a medir, tipo de preguntas que necesitas..."
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleCreateInstrument}
                disabled={aiLoading || !newInstrumentData.name.trim() || 
                  (createMethod === 'document' && !uploadedFile) ||
                  (createMethod === 'code' && !codeInput.trim()) ||
                  (createMethod === 'ai' && !aiPrompt.trim())
                }
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
              >
                {aiLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Creando...</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    <span>Crear Instrumento</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InstrumentsModule;