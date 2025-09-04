import React, { useState } from 'react';
import { Users, Calculator, Info, Lightbulb } from 'lucide-react';

const SampleDefinition = () => {
  const [sampleType, setSampleType] = useState('');
  const [populationSize, setPopulationSize] = useState('');
  const [confidenceLevel, setConfidenceLevel] = useState('95');
  const [marginError, setMarginError] = useState('5');
  const [sampleSize, setSampleSize] = useState(null);
  const [interpretation, setInterpretation] = useState('');

  const calculateSampleSize = () => {
    const N = parseInt(populationSize);
    const Z = confidenceLevel === '90' ? 1.645 : confidenceLevel === '95' ? 1.96 : 2.576;
    const E = parseInt(marginError) / 100;
    const p = 0.5; // Maximum variance
    
    const numerator = (Z * Z * p * (1 - p));
    const denominator = E * E;
    
    let n;
    if (N && N > 0) {
      // Finite population
      n = (N * numerator) / ((N - 1) * denominator + numerator);
    } else {
      // Infinite population
      n = numerator / denominator;
    }
    
    const calculatedSize = Math.ceil(n);
    setSampleSize(calculatedSize);
    generateInterpretation(calculatedSize, confidenceLevel, marginError, N);
  };

  const generateInterpretation = (size, confidence, error, population) => {
    const interpretation = `
**Interpretación del Tamaño de Muestra**

Con una muestra de **${size} participantes**, tu estudio tendrá:

📊 **Nivel de Confianza**: ${confidence}%
- Esto significa que si repitieras el estudio 100 veces, en ${confidence} de esas veces los resultados estarían dentro del margen de error especificado.

📏 **Margen de Error**: ±${error}%
- Los resultados de tu muestra diferirán de los valores poblacionales reales por no más de ${error} puntos porcentuales.

👥 **Representatividad**:
${population ? 
  `- Tu muestra representa el ${((size/population)*100).toFixed(1)}% de la población total (${population} individuos).` :
  '- Esta muestra es adecuada para poblaciones grandes (>10,000 individuos).'
}

💡 **Recomendaciones**:
- Considera aumentar la muestra en un 20-30% para compensar posibles pérdidas
- Para estudios longitudinales, planifica un tamaño inicial mayor
- Si tu presupuesto es limitado, puedes ajustar el margen de error o nivel de confianza
    `;
    setInterpretation(interpretation);
  };

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Definición de Muestra</h1>
        <p className="text-gray-600">Calcula el tamaño de muestra estadísticamente apropiado para tu investigación</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sample Calculator */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
              <Calculator className="w-5 h-5 mr-2 text-blue-600" />
              Calculadora de Tamaño de Muestra
            </h2>
          </div>
          
          <div className="p-6 space-y-6">
            {/* Sample Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de Muestreo
              </label>
              <select
                value={sampleType}
                onChange={(e) => setSampleType(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Selecciona el tipo de muestreo</option>
                <option value="probabilistic">Probabilístico</option>
                <option value="non-probabilistic">No Probabilístico</option>
                <option value="stratified">Estratificado</option>
                <option value="cluster">Por Conglomerados</option>
              </select>
            </div>

            {/* Population Size */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tamaño de la Población (opcional)
              </label>
              <input
                type="number"
                value={populationSize}
                onChange={(e) => setPopulationSize(e.target.value)}
                placeholder="Deja vacío para población infinita"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">
                Si tu población es menor a 10,000, ingresa el número exacto
              </p>
            </div>

            {/* Confidence Level */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nivel de Confianza
              </label>
              <select
                value={confidenceLevel}
                onChange={(e) => setConfidenceLevel(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="90">90% (Z = 1.645)</option>
                <option value="95">95% (Z = 1.96)</option>
                <option value="99">99% (Z = 2.576)</option>
              </select>
            </div>

            {/* Margin of Error */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Margen de Error (%)
              </label>
              <input
                type="number"
                min="1"
                max="10"
                value={marginError}
                onChange={(e) => setMarginError(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">
                Valores típicos: 3% (alta precisión), 5% (estándar), 10% (exploratoria)
              </p>
            </div>

            <button
              onClick={calculateSampleSize}
              disabled={!sampleType}
              className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
            >
              <Calculator className="w-4 h-4" />
              <span>Calcular Tamaño de Muestra</span>
            </button>
          </div>
        </div>

        {/* Results */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
              <Info className="w-5 h-5 mr-2 text-green-600" />
              Resultados e Interpretación
            </h2>
          </div>
          
          <div className="p-6">
            {sampleSize !== null ? (
              <div className="space-y-6">
                {/* Sample Size Result */}
                <div className="text-center bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <Users className="w-12 h-12 text-blue-600 mx-auto mb-3" />
                  <h3 className="text-2xl font-bold text-blue-900 mb-2">{sampleSize} participantes</h3>
                  <p className="text-blue-700">Tamaño de muestra recomendado</p>
                </div>

                {/* Interpretation */}
                {interpretation && (
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                    <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                      <Lightbulb className="w-5 h-5 text-amber-600 mr-2" />
                      Interpretación de IA
                    </h4>
                    <div className="prose prose-sm max-w-none text-gray-700">
                      <div dangerouslySetInnerHTML={{ 
                        __html: interpretation.replace(/\n/g, '<br>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') 
                      }} />
                    </div>
                  </div>
                )}

                {/* Additional Recommendations */}
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <h4 className="font-medium text-amber-900 mb-2">💡 Consideraciones Adicionales</h4>
                  <ul className="text-sm text-amber-800 space-y-1">
                    <li>• Aumenta la muestra en 20-30% para compensar no respuesta</li>
                    <li>• Para análisis multivariados, considera al menos 10 casos por variable</li>
                    <li>• En estudios longitudinales, planifica para atrición del 15-25%</li>
                  </ul>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <Calculator className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>Complete los parámetros para calcular el tamaño de muestra</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Sample Strategy */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">Estrategia de Muestreo</h2>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                type: 'Aleatorio Simple',
                description: 'Cada individuo tiene la misma probabilidad de ser seleccionado',
                icon: '🎲',
                difficulty: 'Fácil'
              },
              {
                type: 'Estratificado',
                description: 'División en subgrupos homogéneos antes del muestreo',
                icon: '📊',
                difficulty: 'Intermedio'
              },
              {
                type: 'Por Conglomerados',
                description: 'Selección de grupos completos de la población',
                icon: '🏢',
                difficulty: 'Intermedio'
              },
              {
                type: 'Sistemático',
                description: 'Selección de cada k-ésimo elemento de la lista',
                icon: '📝',
                difficulty: 'Fácil'
              }
            ].map((strategy, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors cursor-pointer">
                <div className="text-2xl mb-2">{strategy.icon}</div>
                <h3 className="font-medium text-gray-900 mb-2">{strategy.type}</h3>
                <p className="text-sm text-gray-600 mb-3">{strategy.description}</p>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  strategy.difficulty === 'Fácil' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                }`}>
                  {strategy.difficulty}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SampleDefinition;