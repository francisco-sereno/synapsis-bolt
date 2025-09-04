import React, { useState } from 'react';
import { FileText, Upload, Download, Lightbulb, Key, BookOpen, Tag } from 'lucide-react';
import { useAI } from '../hooks/useAI';

const DocumentSummarizer = () => {
  const { summarizeText, extractTextFromDocument, loading } = useAI();
  const [documentText, setDocumentText] = useState('');
  const [summaryResults, setSummaryResults] = useState<any>(null);
  const [maxLength, setMaxLength] = useState(200);

  const handleTextSummarization = async () => {
    if (!documentText.trim()) return;
    
    const result = await summarizeText(documentText, maxLength);
    setSummaryResults(result);
  };

  const handleFileUpload = async (file: File) => {
    const extractedData = await extractTextFromDocument(file);
    if (extractedData) {
      setDocumentText(extractedData.text);
      // Auto-summarize extracted text
      const result = await summarizeText(extractedData.text, maxLength);
      setSummaryResults(result);
    }
  };

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Resumidor de Documentos</h1>
        <p className="text-gray-600">Extrae resúmenes, ideas clave y palabras clave de textos académicos</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Documento a Resumir</h2>
            
            {/* File Upload */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subir Documento
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                <FileText className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600 mb-2">Arrastra un archivo PDF/DOCX aquí</p>
                <input
                  type="file"
                  accept=".pdf,.docx,.doc,.txt"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFileUpload(file);
                  }}
                  className="hidden"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className="text-sm text-blue-600 hover:text-blue-700 cursor-pointer"
                >
                  o haz clic para seleccionar
                </label>
              </div>
            </div>

            <div className="text-center text-gray-500 text-sm mb-4">o</div>

            {/* Text Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pegar Texto
              </label>
              <textarea
                value={documentText}
                onChange={(e) => setDocumentText(e.target.value)}
                rows={12}
                className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Pega aquí el texto del documento académico que quieres resumir..."
              />
            </div>

            {/* Configuration */}
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Longitud del Resumen (palabras)
              </label>
              <input
                type="number"
                value={maxLength}
                onChange={(e) => setMaxLength(parseInt(e.target.value))}
                min="50"
                max="500"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <button
              onClick={handleTextSummarization}
              disabled={!documentText.trim() || loading}
              className="w-full mt-4 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Resumiendo...</span>
                </>
              ) : (
                <>
                  <Lightbulb className="w-4 h-4" />
                  <span>Generar Resumen</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Results Section */}
        <div className="space-y-6">
          {summaryResults ? (
            <>
              {/* Summary */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <BookOpen className="w-5 h-5 mr-2 text-blue-600" />
                  Resumen
                </h2>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-gray-800 leading-relaxed">{summaryResults.summary}</p>
                </div>
                
                <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
                  <span>
                    Compresión: {summaryResults.wordCount.original} → {summaryResults.wordCount.summary} palabras
                  </span>
                  <span>
                    Ratio: {(summaryResults.compressionRatio * 100).toFixed(1)}%
                  </span>
                </div>
              </div>

              {/* Key Points */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Key className="w-5 h-5 mr-2 text-green-600" />
                  Ideas Clave
                </h2>
                <div className="space-y-3">
                  {summaryResults.keyPoints.map((point: string, index: number) => (
                    <div key={index} className="flex items-start space-x-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                      <div className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                        {index + 1}
                      </div>
                      <p className="text-sm text-green-800 flex-1">{point}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Export Options */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Exportar Resumen</h2>
                <div className="grid grid-cols-1 gap-3">
                  <button className="flex items-center justify-center space-x-2 p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                    <Download className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-medium">Descargar como PDF</span>
                  </button>
                  <button className="flex items-center justify-center space-x-2 p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                    <Download className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-medium">Descargar como DOCX</span>
                  </button>
                  <button className="flex items-center justify-center space-x-2 p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                    <Download className="w-4 h-4 text-purple-600" />
                    <span className="text-sm font-medium">Copiar al Portapapeles</span>
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
              <Lightbulb className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Sube o pega un documento</h2>
              <p className="text-gray-600">Los resultados del resumen aparecerán aquí</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DocumentSummarizer;