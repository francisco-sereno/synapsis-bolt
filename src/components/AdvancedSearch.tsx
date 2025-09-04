import React, { useState } from 'react';
import { Search, Filter, Calendar, User, Tag, FileText, BarChart3, Brain, Download } from 'lucide-react';

interface SearchResult {
  id: string;
  title: string;
  type: 'analysis' | 'document' | 'data' | 'insight';
  module: string;
  content: string;
  date: string;
  author: string;
  tags: string[];
  relevance: number;
}

const AdvancedSearch = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [filters, setFilters] = useState({
    dateRange: 'all',
    type: 'all',
    module: 'all',
    author: 'all'
  });

  const mockResults: SearchResult[] = [
    {
      id: '1',
      title: 'Análisis Descriptivo - Satisfacción Docente',
      type: 'analysis',
      module: 'Análisis Cuantitativo',
      content: 'Media de satisfacción: 4.2/5.0, Desviación estándar: 0.85. Los resultados muestran alta satisfacción general...',
      date: '2024-01-12',
      author: 'Dr. Rodriguez',
      tags: ['satisfacción', 'docentes', 'estadísticas'],
      relevance: 95
    },
    {
      id: '2',
      title: 'Temas Emergentes - Focus Groups',
      type: 'insight',
      module: 'Análisis Cualitativo',
      content: 'Identificación de 8 temas principales: Flexibilidad educativa, Desafíos tecnológicos, Interacción social...',
      date: '2024-01-11',
      author: 'Ana García',
      tags: ['temas', 'cualitativo', 'focus groups'],
      relevance: 88
    },
    {
      id: '3',
      title: 'Validación de Instrumento - Encuesta v2.0',
      type: 'document',
      module: 'Instrumentos',
      content: 'Instrumento validado con puntuación de 4.1/5.0. Sugerencias menores de mejora en claridad...',
      date: '2024-01-10',
      author: 'IA Assistant',
      tags: ['validación', 'instrumento', 'calidad'],
      relevance: 82
    }
  ];

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    
    // Simulate search
    setTimeout(() => {
      const filteredResults = mockResults.filter(result => 
        result.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        result.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        result.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
      setSearchResults(filteredResults);
      setIsSearching(false);
    }, 1000);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'analysis': return BarChart3;
      case 'document': return FileText;
      case 'data': return Database;
      case 'insight': return Brain;
      default: return FileText;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'analysis': return 'blue';
      case 'document': return 'green';
      case 'data': return 'orange';
      case 'insight': return 'purple';
      default: return 'gray';
    }
  };

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Búsqueda Avanzada</h1>
        <p className="text-gray-600">Encuentra rápidamente cualquier análisis, documento o insight en tu proyecto</p>
      </div>

      {/* Search Interface */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center space-x-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Buscar análisis, documentos, insights..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
            />
          </div>
          <button
            onClick={handleSearch}
            disabled={isSearching || !searchQuery.trim()}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
          >
            {isSearching ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            ) : (
              <Search className="w-4 h-4" />
            )}
            <span>Buscar</span>
          </button>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Fecha</label>
            <select 
              value={filters.dateRange}
              onChange={(e) => setFilters({...filters, dateRange: e.target.value})}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Todas las fechas</option>
              <option value="today">Hoy</option>
              <option value="week">Esta semana</option>
              <option value="month">Este mes</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tipo</label>
            <select 
              value={filters.type}
              onChange={(e) => setFilters({...filters, type: e.target.value})}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Todos los tipos</option>
              <option value="analysis">Análisis</option>
              <option value="document">Documentos</option>
              <option value="data">Datos</option>
              <option value="insight">Insights</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Módulo</label>
            <select 
              value={filters.module}
              onChange={(e) => setFilters({...filters, module: e.target.value})}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Todos los módulos</option>
              <option value="quantitative">Análisis Cuantitativo</option>
              <option value="qualitative">Análisis Cualitativo</option>
              <option value="instruments">Instrumentos</option>
              <option value="triangulation">Triangulación</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Autor</label>
            <select 
              value={filters.author}
              onChange={(e) => setFilters({...filters, author: e.target.value})}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Todos los autores</option>
              <option value="dr-rodriguez">Dr. Rodriguez</option>
              <option value="ana-garcia">Ana García</option>
              <option value="carlos-mendez">Carlos Mendez</option>
              <option value="ai-assistant">IA Assistant</option>
            </select>
          </div>
        </div>
      </div>

      {/* Search Results */}
      {searchResults.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">
                Resultados de Búsqueda ({searchResults.length})
              </h2>
              <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <Download className="w-4 h-4" />
                <span>Exportar Resultados</span>
              </button>
            </div>
          </div>
          
          <div className="p-6">
            <div className="space-y-4">
              {searchResults.map((result) => {
                const TypeIcon = getTypeIcon(result.type);
                const color = getTypeColor(result.type);
                
                return (
                  <div key={result.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start space-x-4">
                      <div className={`p-2 bg-${color}-100 rounded-lg`}>
                        <TypeIcon className={`w-5 h-5 text-${color}-600`} />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold text-gray-900">{result.title}</h3>
                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-gray-500">Relevancia: {result.relevance}%</span>
                            <div className="w-16 bg-gray-200 rounded-full h-1">
                              <div 
                                className="bg-blue-600 h-1 rounded-full"
                                style={{ width: `${result.relevance}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                          <span className={`px-2 py-1 bg-${color}-100 text-${color}-700 rounded-full text-xs font-medium`}>
                            {result.type}
                          </span>
                          <span>Módulo: {result.module}</span>
                          <span>Por: {result.author}</span>
                          <span>{result.date}</span>
                        </div>
                        
                        <p className="text-sm text-gray-700 mb-3">{result.content}</p>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex flex-wrap gap-1">
                            {result.tags.map((tag, index) => (
                              <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                                #{tag}
                              </span>
                            ))}
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                              Ver Completo
                            </button>
                            <button className="text-sm text-green-600 hover:text-green-700 font-medium">
                              Exportar
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Search Suggestions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">Búsquedas Sugeridas</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              'satisfacción docente correlación',
              'temas emergentes focus groups',
              'validación instrumentos IA',
              'análisis descriptivo resultados',
              'triangulación datos mixtos',
              'insights cualitativos estudiantes'
            ].map((suggestion, index) => (
              <button
                key={index}
                onClick={() => {
                  setSearchQuery(suggestion);
                  handleSearch();
                }}
                className="text-left p-3 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
              >
                <div className="flex items-center space-x-2">
                  <Search className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-700">{suggestion}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvancedSearch;