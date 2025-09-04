import React, { useState } from 'react';
import { Bot, Send, Upload, FileText, BarChart3, MessageSquare, Lightbulb, Download } from 'lucide-react';
import { useAI } from '../hooks/useAI';

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  attachments?: Array<{
    name: string;
    type: 'csv' | 'pdf' | 'docx';
    size: string;
  }>;
}

const ConversationalAssistant = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'ai',
      content: '¡Hola! Soy tu asistente conversacional de investigación. Puedo ayudarte con:\n\n• Análisis de archivos CSV\n• Interpretación de resultados estadísticos\n• Diseño metodológico\n• Revisión de literatura\n• Preguntas sobre investigación\n\n¿En qué puedo asistirte hoy?',
      timestamp: new Date()
    }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isTyping, setIsTyping] = useState(false);

  const handleSendMessage = async () => {
    if (!newMessage.trim() && uploadedFiles.length === 0) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: newMessage,
      timestamp: new Date(),
      attachments: uploadedFiles.map(file => ({
        name: file.name,
        type: file.name.endsWith('.csv') ? 'csv' : file.name.endsWith('.pdf') ? 'pdf' : 'docx',
        size: `${(file.size / 1024).toFixed(1)} KB`
      }))
    };

    setMessages(prev => [...prev, userMessage]);
    setNewMessage('');
    setUploadedFiles([]);
    setIsTyping(true);

    // Simulate AI processing
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: generateAIResponse(newMessage, uploadedFiles),
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 2000);
  };

  const generateAIResponse = (message: string, files: File[]) => {
    if (files.length > 0) {
      const csvFiles = files.filter(f => f.name.endsWith('.csv'));
      if (csvFiles.length > 0) {
        return `He analizado tu archivo CSV "${csvFiles[0].name}". Basándome en los datos:\n\n📊 **Análisis Descriptivo:**\n• Total de registros: 156\n• Variables numéricas: 8\n• Variables categóricas: 4\n• Valores faltantes: 3.2%\n\n🔍 **Hallazgos Principales:**\n• Media de satisfacción: 4.2/5.0\n• Correlación significativa entre variables X e Y (r=0.68, p<0.001)\n• Distribución normal en la mayoría de variables\n\n💡 **Recomendaciones:**\n• Considerar imputación para valores faltantes\n• Explorar análisis de subgrupos\n• Validar outliers identificados\n\n¿Te gustaría que profundice en algún aspecto específico?`;
      }
    }

    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('csv') || lowerMessage.includes('datos')) {
      return 'Para analizar datos CSV, puedes:\n\n1. **Subir el archivo** usando el botón de adjuntar\n2. **Describir tu pregunta** específica sobre los datos\n3. **Especificar el tipo de análisis** que necesitas\n\nPuedo ayudarte con:\n• Estadísticas descriptivas\n• Análisis de correlaciones\n• Detección de outliers\n• Visualizaciones recomendadas\n• Interpretación de resultados\n\n¿Qué archivo quieres analizar?';
    }
    
    if (lowerMessage.includes('metodolog') || lowerMessage.includes('diseño')) {
      return 'Te puedo ayudar con el diseño metodológico:\n\n🎯 **Coherencia Metodológica:**\n• Alineación problema-objetivos-hipótesis\n• Selección de diseño apropiado\n• Identificación de variables\n\n📊 **Selección de Métodos:**\n• Cuantitativo vs. Cualitativo vs. Mixto\n• Estrategias de muestreo\n• Técnicas de recolección\n\n🔍 **Validación:**\n• Validez interna y externa\n• Confiabilidad de instrumentos\n• Control de sesgos\n\n¿Podrías contarme más sobre tu proyecto de investigación?';
    }
    
    if (lowerMessage.includes('estadístic') || lowerMessage.includes('análisis')) {
      return 'Puedo asistirte con análisis estadísticos:\n\n📈 **Análisis Descriptivos:**\n• Medidas de tendencia central\n• Medidas de dispersión\n• Distribuciones de frecuencia\n\n🔗 **Análisis Inferenciales:**\n• Pruebas de hipótesis\n• Correlaciones y regresiones\n• ANOVA y comparaciones múltiples\n\n📊 **Interpretación:**\n• Significancia estadística vs. práctica\n• Tamaños del efecto\n• Intervalos de confianza\n\n¿Qué tipo de análisis específico necesitas realizar?';
    }
    
    return 'Entiendo tu consulta. Como asistente especializado en investigación, puedo ayudarte con:\n\n• **Análisis de datos**: Sube archivos CSV para análisis automático\n• **Metodología**: Diseño de estudios y validación\n• **Estadística**: Interpretación de resultados\n• **Literatura**: Resumen de artículos académicos\n• **Instrumentos**: Creación y validación\n\n¿Podrías ser más específico sobre lo que necesitas? Si tienes datos para analizar, no dudes en subirlos.';
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setUploadedFiles(prev => [...prev, ...files]);
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Asistente Conversacional</h1>
        <p className="text-gray-600">Chat inteligente para consultas de investigación y análisis de archivos</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 h-[600px] flex flex-col">
        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-3xl p-4 rounded-lg ${
                  message.type === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-900'
                }`}
              >
                {message.type === 'ai' && (
                  <div className="flex items-center mb-2">
                    <Bot className="w-4 h-4 mr-2 text-blue-600" />
                    <span className="text-sm font-medium text-blue-600">Asistente IA</span>
                  </div>
                )}
                
                <div className="whitespace-pre-line text-sm leading-relaxed">
                  {message.content}
                </div>
                
                {message.attachments && message.attachments.length > 0 && (
                  <div className="mt-3 space-y-2">
                    {message.attachments.map((attachment, index) => (
                      <div key={index} className="flex items-center space-x-2 bg-white/10 rounded p-2">
                        <FileText className="w-4 h-4" />
                        <span className="text-sm">{attachment.name}</span>
                        <span className="text-xs opacity-75">({attachment.size})</span>
                      </div>
                    ))}
                  </div>
                )}
                
                <p className={`text-xs mt-3 ${
                  message.type === 'user' ? 'text-blue-200' : 'text-gray-500'
                }`}>
                  {message.timestamp.toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start">
              <div className="max-w-3xl p-4 rounded-lg bg-gray-100 text-gray-900">
                <div className="flex items-center mb-2">
                  <Bot className="w-4 h-4 mr-2 text-blue-600" />
                  <span className="text-sm font-medium text-blue-600">Asistente IA</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <span className="text-sm text-gray-500 ml-2">Analizando...</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* File Upload Area */}
        {uploadedFiles.length > 0 && (
          <div className="border-t border-gray-200 p-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Archivos Adjuntos:</h4>
            <div className="space-y-2">
              {uploadedFiles.map((file, index) => (
                <div key={index} className="flex items-center justify-between bg-gray-50 rounded p-2">
                  <div className="flex items-center space-x-2">
                    <FileText className="w-4 h-4 text-gray-600" />
                    <span className="text-sm text-gray-700">{file.name}</span>
                    <span className="text-xs text-gray-500">({(file.size / 1024).toFixed(1)} KB)</span>
                  </div>
                  <button
                    onClick={() => removeFile(index)}
                    className="text-red-600 hover:text-red-700 text-sm"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Message Input */}
        <div className="border-t border-gray-200 p-4">
          <div className="flex space-x-2 items-end">
            <input
              type="file"
              accept=".csv,.pdf,.docx,.txt"
              onChange={handleFileUpload}
              className="hidden"
              id="file-input"
              multiple
            />
            <label
              htmlFor="file-input"
              className="p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
            >
              <Upload className="w-4 h-4 text-gray-600" />
            </label>
            
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Haz una pregunta sobre investigación o sube un archivo CSV para analizar..."
              className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            
            <button
              onClick={handleSendMessage}
              disabled={!newMessage.trim() && uploadedFiles.length === 0}
              className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Acciones Rápidas</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              label: 'Analizar CSV',
              icon: BarChart3,
              description: 'Sube un archivo CSV para análisis automático',
              action: () => document.getElementById('file-input')?.click()
            },
            {
              label: 'Ayuda Metodológica',
              icon: Lightbulb,
              description: 'Consultas sobre diseño de investigación',
              action: () => setNewMessage('Necesito ayuda con el diseño metodológico de mi investigación')
            },
            {
              label: 'Interpretación Estadística',
              icon: BarChart3,
              description: 'Explica resultados estadísticos',
              action: () => setNewMessage('¿Puedes ayudarme a interpretar estos resultados estadísticos?')
            },
            {
              label: 'Revisión de Literatura',
              icon: FileText,
              description: 'Analiza documentos académicos',
              action: () => setNewMessage('Ayúdame a revisar y resumir este artículo académico')
            }
          ].map((action, index) => {
            const Icon = action.icon;
            return (
              <button
                key={index}
                onClick={action.action}
                className="text-left p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
              >
                <Icon className="w-6 h-6 text-blue-600 mb-2" />
                <h3 className="font-medium text-gray-900 mb-1">{action.label}</h3>
                <p className="text-sm text-gray-600">{action.description}</p>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ConversationalAssistant;