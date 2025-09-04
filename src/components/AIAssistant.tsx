import React, { useState } from 'react';
import { Bot, Send, Lightbulb, BarChart3, FileText, Users, Mic, MicOff, Volume2, Copy, ThumbsUp, ThumbsDown, CheckCircle, Calculator, PenTool } from 'lucide-react';

const AIAssistant = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'ai',
      content: '¡Hola! Soy tu asistente de investigación con IA. Puedo ayudarte con análisis estadístico, revisión de literatura, interpretación de datos y mucho más. ¿En qué puedo asistirte hoy?',
      timestamp: new Date()
    }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const quickActions = [
    {
      label: 'Análisis de Datos',
      icon: BarChart3,
      description: 'Interpreta resultados estadísticos',
      prompt: 'Ayúdame a interpretar mis resultados de análisis correlacional'
    },
    {
      label: 'Revisión de Literatura',
      icon: FileText,
      description: 'Resume y analiza documentos',
      prompt: 'Resume este artículo académico sobre metodologías mixtas'
    },
    {
      label: 'Diseño Metodológico',
      icon: Lightbulb,
      description: 'Mejora tu metodología',
      prompt: 'Revisa la coherencia entre mis objetivos e hipótesis de investigación'
    },
    {
      label: 'Triangulación',
      icon: Users,
      description: 'Combina diferentes fuentes',
      prompt: 'Ayúdame a triangular datos cuantitativos y cualitativos'
    }
  ];

  const advancedActions = [
    {
      label: 'Revisión de Literatura',
      icon: FileText,
      description: 'Analiza y resume artículos académicos',
      prompt: 'Analiza este artículo y extrae los hallazgos principales para mi marco teórico'
    },
    {
      label: 'Validación de Instrumentos',
      icon: CheckCircle,
      description: 'Evalúa la calidad de tus cuestionarios',
      prompt: 'Revisa mi instrumento de investigación y sugiere mejoras en claridad y validez'
    },
    {
      label: 'Interpretación Estadística',
      icon: Calculator,
      description: 'Explica resultados estadísticos complejos',
      prompt: 'Explica estos resultados estadísticos en términos simples para mi reporte'
    },
    {
      label: 'Escritura Académica',
      icon: PenTool,
      description: 'Mejora la redacción de tu investigación',
      prompt: 'Ayúdame a mejorar la redacción académica de esta sección de mi artículo'
    }
  ];

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const userMessage = {
      id: messages.length + 1,
      type: 'user',
      content: newMessage,
      timestamp: new Date()
    };

    setMessages([...messages, userMessage]);
    setNewMessage('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = {
        id: messages.length + 2,
        type: 'ai',
        content: generateAIResponse(newMessage),
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1000);
  };

  const generateAIResponse = (userInput: string) => {
    const lowerInput = userInput.toLowerCase();
    
    if (lowerInput.includes('análisis') || lowerInput.includes('estadístic')) {
      return 'Para ayudarte con el análisis estadístico, necesitaría conocer más detalles sobre tus datos. ¿Podrías compartir información sobre: 1) El tipo de variables que tienes, 2) El tamaño de tu muestra, 3) Qué tipo de análisis específico necesitas realizar? Con esta información podré darte recomendaciones más precisas sobre las pruebas estadísticas apropiadas y cómo interpretar los resultados.';
    } else if (lowerInput.includes('metodolog') || lowerInput.includes('diseño')) {
      return 'El diseño metodológico es fundamental para la validez de tu investigación. Te puedo ayudar a: 1) Evaluar la coherencia entre problema, objetivos e hipótesis, 2) Seleccionar el tipo de investigación más apropiado, 3) Determinar la estrategia de muestreo, 4) Identificar variables y su operacionalización. ¿En cuál de estos aspectos necesitas más apoyo?';
    } else if (lowerInput.includes('instrument') || lowerInput.includes('encuesta')) {
      return 'Para el diseño de instrumentos de investigación, puedo asistirte en: 1) Validación de contenido de preguntas, 2) Detección de posibles sesgos, 3) Optimización de la estructura del cuestionario, 4) Sugerencias para mejorar la claridad. ¿Te gustaría que revise un instrumento específico o necesitas ayuda creando uno nuevo?';
    } else if (lowerInput.includes('transcrib') || lowerInput.includes('audio')) {
      return 'Puedo ayudarte con la transcripción y análisis de audio: 1) Transcripción automática de entrevistas y focus groups, 2) Identificación de temas emergentes en transcripciones, 3) Análisis de sentimientos en conversaciones, 4) Extracción de citas relevantes. ¿Tienes archivos de audio que necesites procesar?';
    } else if (lowerInput.includes('triangul') || lowerInput.includes('síntesis')) {
      return 'La triangulación es clave para la validez en investigación mixta. Puedo asistirte en: 1) Identificar convergencias entre datos cuantitativos y cualitativos, 2) Explicar divergencias encontradas, 3) Generar meta-inferencias integradoras, 4) Crear síntesis narrativas coherentes. ¿Qué fuentes de datos tienes disponibles para triangular?';
    } else {
      return 'Gracias por tu consulta. Como asistente especializado en investigación, puedo ayudarte con análisis de datos, diseño metodológico, validación de instrumentos, revisión de literatura y triangulación de hallazgos. ¿Podrías ser más específico sobre el tipo de asistencia que necesitas para tu proyecto de investigación?';
    }
  };

  const handleQuickAction = (prompt: string) => {
    setNewMessage(prompt);
  };

  const handleVoiceInput = () => {
    setIsListening(!isListening);
    // Simulate voice recognition
    if (!isListening) {
      setTimeout(() => {
        setNewMessage('¿Puedes ayudarme a interpretar estos resultados de correlación?');
        setIsListening(false);
      }, 3000);
    }
  };

  const handleCopyMessage = (content) => {
    navigator.clipboard.writeText(content);
  };

  const handleMessageFeedback = (messageId, feedback) => {
    console.log(`Feedback para mensaje ${messageId}: ${feedback}`);
  };

  return (
    <div className="h-full flex flex-col">
      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
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
                <span className="text-sm text-gray-500 ml-2">Escribiendo...</span>
              </div>
            </div>
          </div>
        )}
        
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
              <p className="text-sm leading-relaxed">{message.content}</p>
              
              {/* Message Actions */}
              <div className="flex items-center justify-between mt-3">
                <p className={`text-xs ${
                  message.type === 'user' ? 'text-blue-200' : 'text-gray-500'
                }`}>
                  {message.timestamp.toLocaleTimeString()}
                </p>
                
                {message.type === 'ai' && (
                  <div className="flex items-center space-x-2">
                    <button onClick={() => handleCopyMessage(message.content)} className="p-1 text-gray-400 hover:text-gray-600 transition-colors">
                      <Copy className="w-3 h-3" />
                    </button>
                    <button onClick={() => handleMessageFeedback(message.id, 'positive')} className="p-1 text-gray-400 hover:text-green-600 transition-colors">
                      <ThumbsUp className="w-3 h-3" />
                    </button>
                    <button onClick={() => handleMessageFeedback(message.id, 'negative')} className="p-1 text-gray-400 hover:text-red-600 transition-colors">
                      <ThumbsDown className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="border-t border-gray-200 p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium text-gray-700">Acciones Rápidas</h3>
          <button className="text-xs text-blue-600 hover:text-blue-700">Ver todas</button>
        </div>
        <div className="grid grid-cols-2 gap-2 mb-4">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <button
                key={index}
                onClick={() => handleQuickAction(action.prompt)}
                className="flex items-center space-x-2 p-3 text-left bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Icon className="w-4 h-4 text-gray-600" />
                <div>
                  <p className="text-sm font-medium text-gray-900">{action.label}</p>
                  <p className="text-xs text-gray-500">{action.description}</p>
                </div>
              </button>
            );
          })}
        </div>
        
        <div className="border-t border-gray-100 pt-4">
          <h4 className="text-xs font-medium text-gray-600 mb-2 uppercase tracking-wider">Herramientas Avanzadas</h4>
          <div className="grid grid-cols-1 gap-2">
            {advancedActions.slice(0, 2).map((action, index) => {
              const Icon = action.icon;
              return (
                <button
                  key={index}
                  onClick={() => handleQuickAction(action.prompt)}
                  className="flex items-center space-x-2 p-2 text-left bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Icon className="w-3 h-3 text-gray-600" />
                  <div>
                    <p className="text-xs font-medium text-gray-900">{action.label}</p>
                    <p className="text-xs text-gray-500">{action.description}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Message Input */}
      <div className="border-t border-gray-200 p-4">
        <div className="flex space-x-2 items-end">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Escribe tu consulta de investigación..."
            className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            onClick={handleVoiceInput}
            className={`p-3 rounded-lg transition-colors ${
              isListening 
                ? 'bg-red-600 text-white hover:bg-red-700' 
                : 'border border-gray-300 text-gray-600 hover:bg-gray-50'
            }`}
          >
            {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </button>
          <button
            onClick={handleSendMessage}
            disabled={!newMessage.trim()}
            className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
        
        {isListening && (
          <div className="mt-2 flex items-center space-x-2 text-sm text-red-600">
            <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></div>
            <span>Escuchando... Habla ahora</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIAssistant;