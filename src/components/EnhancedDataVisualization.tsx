import React, { useState } from 'react';
import { BarChart3, PieChart, TrendingUp, Activity, Download, Settings, RefreshCw, Maximize2, Lightbulb } from 'lucide-react';

type BarDataPoint = { category: string; value: number; percentage: number };
type HeatmapDataPoint = { x: string; y: string; value: number; significance: string };
type LineDataPoint = { week: string; responses: number; completion: number };
type ChartDataPoint = BarDataPoint | HeatmapDataPoint | LineDataPoint;

interface ChartData {
  id: string;
  title: string;
  type: 'bar' | 'line' | 'pie' | 'scatter' | 'heatmap';
  data: ChartDataPoint[];
  insights: string[];
}

const EnhancedDataVisualization = () => {
  const [activeChart, setActiveChart] = useState('satisfaction-overview');

  const charts: ChartData[] = [
    {
      id: 'satisfaction-overview',
      title: 'Distribución de Satisfacción Docente',
      type: 'bar',
      data: [
        { category: 'Muy Insatisfecho', value: 5, percentage: 5.6 },
        { category: 'Insatisfecho', value: 8, percentage: 9.0 },
        { category: 'Neutral', value: 15, percentage: 16.9 },
        { category: 'Satisfecho', value: 35, percentage: 39.3 },
        { category: 'Muy Satisfecho', value: 26, percentage: 29.2 }
      ],
      insights: [
        'El 68.5% de los docentes reporta satisfacción alta o muy alta',
        'Solo el 14.6% muestra insatisfacción con la modalidad actual',
        'La distribución sugiere una adopción exitosa del modelo híbrido'
      ]
    },
    {
      id: 'correlation-matrix',
      title: 'Matriz de Correlaciones - Variables Académicas',
      type: 'heatmap',
      data: [
        { x: 'Satisfacción', y: 'Autoeficacia', value: 0.68, significance: 'p<0.001' },
        { x: 'Satisfacción', y: 'Engagement', value: 0.72, significance: 'p<0.001' },
        { x: 'Autoeficacia', y: 'Rendimiento', value: 0.54, significance: 'p<0.01' },
        { x: 'Engagement', y: 'Rendimiento', value: 0.61, significance: 'p<0.001' }
      ],
      insights: [
        'Correlación fuerte entre satisfacción y engagement (r=0.72)',
        'La autoeficacia predice significativamente el rendimiento',
        'Todas las correlaciones son estadísticamente significativas'
      ]
    },
    {
      id: 'temporal-trends',
      title: 'Tendencias Temporales - Respuestas por Semana',
      type: 'line',
      data: [
        { week: 'Sem 1', responses: 12, completion: 85 },
        { week: 'Sem 2', responses: 23, completion: 78 },
        { week: 'Sem 3', responses: 31, completion: 82 },
        { week: 'Sem 4', responses: 23, completion: 76 }
      ],
      insights: [
        'Pico de participación en la tercera semana',
        'Tasa de completado estable alrededor del 80%',
        'Tendencia decreciente requiere estrategias de reactivación'
      ]
    }
  ];

  const currentChart = charts.find(chart => chart.id === activeChart);

  const renderChart = (chart: ChartData) => {
    switch (chart.type) {
      case 'bar':
        return (
          <div className="space-y-4">
            <div className="h-64 bg-gray-50 rounded-lg p-4 flex items-end justify-around">
              {(chart.data as BarDataPoint[]).map((item, index) => (
                <div key={index} className="flex flex-col items-center space-y-2">
                  <div className="text-xs text-gray-600 font-medium">{item.value}</div>
                  <div 
                    className="w-12 bg-blue-600 rounded-t transition-all duration-1000 hover:bg-blue-700"
                    style={{ height: `${(item.percentage / 40) * 100}%`, minHeight: '20px' }}
                  ></div>
                  <div className="text-xs text-gray-500 text-center max-w-16 leading-tight">
                    {item.category}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      
      case 'heatmap':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-4 gap-2 p-4 bg-gray-50 rounded-lg">
              {(chart.data as HeatmapDataPoint[]).map((cell, index) => (
                <div
                  key={index}
                  className={`p-3 rounded text-center text-white font-medium ${
                    cell.value > 0.6 ? 'bg-red-500' :
                    cell.value > 0.4 ? 'bg-orange-500' :
                    cell.value > 0.2 ? 'bg-yellow-500' :
                    'bg-green-500'
                  }`}
                  title={`${cell.x} vs ${cell.y}: r=${cell.value} (${cell.significance})`}
                >
                  <div className="text-xs">{cell.x.slice(0, 3)}</div>
                  <div className="text-sm font-bold">{cell.value}</div>
                  <div className="text-xs">{cell.y.slice(0, 3)}</div>
                </div>
              ))}
            </div>
          </div>
        );
      
      case 'line':
        return (
          <div className="space-y-4">
            <div className="h-64 bg-gray-50 rounded-lg p-4 relative">
              <svg className="w-full h-full">
                <polyline
                  points={(chart.data as LineDataPoint[]).map((point, index) =>
                    `${(index / (chart.data.length - 1)) * 100},${100 - (point.responses / 35) * 100}`
                  ).join(' ')}
                  fill="none"
                  stroke="#3B82F6"
                  strokeWidth="3"
                  className="drop-shadow-sm"
                />
                {(chart.data as LineDataPoint[]).map((point, index) => (
                  <circle
                    key={index}
                    cx={`${(index / (chart.data.length - 1)) * 100}%`}
                    cy={`${100 - (point.responses / 35) * 100}%`}
                    r="4"
                    fill="#3B82F6"
                    className="hover:r-6 transition-all cursor-pointer"
                  />
                ))}
              </svg>
            </div>
          </div>
        );
      
      default:
        return (
          <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
            <p className="text-gray-500">Visualización no disponible</p>
          </div>
        );
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Visualización de Datos</h1>
          <p className="text-gray-600">Gráficos interactivos con insights automáticos de IA</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <Settings className="w-4 h-4" />
          </button>
          <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <RefreshCw className="w-4 h-4" />
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
            <Download className="w-4 h-4" />
            <span>Exportar</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Chart Selection */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Gráficos Disponibles</h2>
          <div className="space-y-2">
            {charts.map((chart) => (
              <button
                key={chart.id}
                onClick={() => setActiveChart(chart.id)}
                className={`w-full text-left p-3 rounded-lg transition-colors ${
                  activeChart === chart.id
                    ? 'bg-blue-100 text-blue-700 border border-blue-200'
                    : 'hover:bg-gray-50 border border-transparent'
                }`}
              >
                <div className="flex items-center space-x-2">
                  {chart.type === 'bar' && <BarChart3 className="w-4 h-4" />}
                  {chart.type === 'pie' && <PieChart className="w-4 h-4" />}
                  {chart.type === 'line' && <TrendingUp className="w-4 h-4" />}
                  {chart.type === 'heatmap' && <Activity className="w-4 h-4" />}
                  <span className="text-sm font-medium">{chart.title}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Main Chart Area */}
        <div className="lg:col-span-3 bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">{currentChart?.title}</h2>
              <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                <Maximize2 className="w-4 h-4" />
              </button>
            </div>
          </div>
          
          <div className="p-6">
            {currentChart && renderChart(currentChart)}
            
            {/* AI Insights */}
            {currentChart && (
              <div className="mt-6 bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-lg p-4">
                <h3 className="font-semibold text-purple-900 mb-3 flex items-center">
                  <Lightbulb className="w-4 h-4 mr-2" />
                  Insights de IA
                </h3>
                <div className="space-y-2">
                  {currentChart.insights.map((insight, index) => (
                    <div key={index} className="flex items-start space-x-2">
                      <div className="w-1.5 h-1.5 bg-purple-600 rounded-full mt-2"></div>
                      <p className="text-sm text-purple-800">{insight}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedDataVisualization;