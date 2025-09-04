import React, { useState } from 'react';
import { FileText, Upload, Download, Trash2, Eye, Search, Filter, Folder, File, Image, FileAudio, Video } from 'lucide-react';

const FilesModule = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const files = [
    {
      id: 1,
      name: 'Marco_Teorico_v3.pdf',
      type: 'pdf',
      size: '2.4 MB',
      uploadedBy: 'Dr. Rodriguez',
      uploadDate: '2024-01-12',
      category: 'Documentación',
      tags: ['marco teórico', 'literatura'],
      shared: true
    },
    {
      id: 2,
      name: 'focus_group_session_1.mp3',
      type: 'audio',
      size: '45.2 MB',
      uploadedBy: 'Ana García',
      uploadDate: '2024-01-11',
      category: 'Audio',
      tags: ['focus group', 'transcripción'],
      shared: false
    },
    {
      id: 3,
      name: 'Consentimiento_Informado.docx',
      type: 'document',
      size: '156 KB',
      uploadedBy: 'Dr. Rodriguez',
      uploadDate: '2024-01-10',
      category: 'Ética',
      tags: ['consentimiento', 'ética'],
      shared: true
    },
    {
      id: 4,
      name: 'Resultados_Preliminares.xlsx',
      type: 'spreadsheet',
      size: '890 KB',
      uploadedBy: 'Carlos Mendez',
      uploadDate: '2024-01-09',
      category: 'Datos',
      tags: ['resultados', 'análisis'],
      shared: false
    },
    {
      id: 5,
      name: 'Diagrama_Metodologico.png',
      type: 'image',
      size: '1.2 MB',
      uploadedBy: 'Ana García',
      uploadDate: '2024-01-08',
      category: 'Diagramas',
      tags: ['metodología', 'diagrama'],
      shared: true
    }
  ];

  const getFileIcon = (type) => {
    switch (type) {
      case 'pdf':
      case 'document':
        return FileText;
      case 'audio':
        return FileAudio;
      case 'image':
        return Image;
      case 'video':
        return Video;
      case 'spreadsheet':
        return File;
      default:
        return File;
    }
  };

  const getFileColor = (type) => {
    switch (type) {
      case 'pdf':
        return 'red';
      case 'document':
        return 'blue';
      case 'audio':
        return 'purple';
      case 'image':
        return 'green';
      case 'video':
        return 'orange';
      case 'spreadsheet':
        return 'emerald';
      default:
        return 'gray';
    }
  };

  const categories = ['Todos', 'Documentación', 'Audio', 'Ética', 'Datos', 'Diagramas'];

  const filteredFiles = files.filter(file => {
    const matchesSearch = file.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         file.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = activeTab === 'all' || file.category.toLowerCase() === activeTab.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Gestión de Archivos</h1>
        <p className="text-gray-600">Organiza y gestiona todos los recursos de tu proyecto de investigación</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Total Archivos</p>
              <p className="text-3xl font-bold text-blue-600">{files.length}</p>
            </div>
            <FileText className="w-8 h-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Espacio Usado</p>
              <p className="text-3xl font-bold text-green-600">49.8</p>
              <p className="text-xs text-gray-500">MB</p>
            </div>
            <Folder className="w-8 h-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Archivos Compartidos</p>
              <p className="text-3xl font-bold text-purple-600">3</p>
            </div>
            <Upload className="w-8 h-8 text-purple-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Última Subida</p>
              <p className="text-xl font-bold text-orange-600">2h</p>
            </div>
            <File className="w-8 h-8 text-orange-600" />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {/* Header Controls */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Buscar archivos..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <Filter className="w-4 h-4" />
                <span>Filtros</span>
              </button>
            </div>
            
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
              <Upload className="w-4 h-4" />
              <span>Subir Archivo</span>
            </button>
          </div>

          {/* Category Tabs */}
          <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveTab(category.toLowerCase())}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === category.toLowerCase()
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Files Grid */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredFiles.map((file) => {
              const FileIcon = getFileIcon(file.type);
              const color = getFileColor(file.type);
              
              return (
                <div key={file.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div className={`p-2 bg-${color}-100 rounded-lg`}>
                      <FileIcon className={`w-6 h-6 text-${color}-600`} />
                    </div>
                    <div className="flex items-center space-x-1">
                      {file.shared && (
                        <div className="w-2 h-2 bg-green-500 rounded-full" title="Compartido"></div>
                      )}
                      <button className="p-1 text-gray-400 hover:text-gray-600 transition-colors">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-1 text-gray-400 hover:text-gray-600 transition-colors">
                        <Download className="w-4 h-4" />
                      </button>
                      <button className="p-1 text-gray-400 hover:text-red-600 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  
                  <h3 className="font-medium text-gray-900 mb-2 truncate" title={file.name}>
                    {file.name}
                  </h3>
                  
                  <div className="space-y-1 text-sm text-gray-600">
                    <div className="flex justify-between">
                      <span>Tamaño:</span>
                      <span className="font-medium">{file.size}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Subido por:</span>
                      <span className="font-medium">{file.uploadedBy}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Fecha:</span>
                      <span className="font-medium">{file.uploadDate}</span>
                    </div>
                  </div>
                  
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <div className="flex flex-wrap gap-1">
                      {file.tags.map((tag, index) => (
                        <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredFiles.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>No se encontraron archivos que coincidan con los criterios de búsqueda</p>
            </div>
          )}
        </div>
      </div>

      {/* Upload Area */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6">
          <label className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors cursor-pointer block">
            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Subir nuevos archivos</h3>
            <p className="text-gray-600 mb-4">Arrastra y suelta archivos aquí o haz clic para seleccionar</p>
            <input
              type="file"
              multiple
              accept=".pdf,.docx,.xlsx,.mp3,.wav,.mp4,.png,.jpg,.jpeg"
              className="hidden"
              onChange={(e) => {
                const files = Array.from(e.target.files || []);
                console.log('Archivos subidos:', files);
              }}
            />
            <div className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors inline-block">
              Seleccionar Archivos
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Formatos soportados: PDF, DOCX, XLSX, MP3, WAV, MP4, PNG, JPG
            </p>
          </label>
        </div>
      </div>
    </div>
  );
};

export default FilesModule;