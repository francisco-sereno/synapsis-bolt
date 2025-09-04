import React, { useState } from 'react';
import { AuthProvider } from './contexts/AuthContext';
import AuthWrapper from './components/Auth/AuthWrapper';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import MethodologyModule from './components/MethodologyModule';
import SampleDefinition from './components/SampleDefinition';
import InstrumentsModule from './components/InstrumentsModule';
import DataCollection from './components/DataCollection';
import DataRepository from './components/DataRepository';
import QuantitativeAnalysis from './components/QuantitativeAnalysis';
import QualitativeAnalysis from './components/QualitativeAnalysis';
import AIAssistant from './components/AIAssistant';
import FilesModule from './components/FilesModule';
import TriangulationModule from './components/TriangulationModule';
import PeerReview from './components/PeerReview';
import ReportsModule from './components/ReportsModule';
import AnalysisHistory from './components/AnalysisHistory';
import CollaborationModule from './components/CollaborationModule';
import ProjectSettings from './components/ProjectSettings';
import SystemSettings from './components/SystemSettings';
import FloatingAIButton from './components/FloatingAIButton';
import AdvancedSearch from './components/AdvancedSearch';
import NotificationCenter from './components/NotificationCenter';
import EnhancedDataVisualization from './components/EnhancedDataVisualization';
import SmartRecommendations from './components/SmartRecommendations';
import WorkflowGuide from './components/WorkflowGuide';
import ProjectList from './components/ProjectList';
import InstrumentPrevalidation from './components/InstrumentPrevalidation';
import AdminPanel from './components/AdminPanel';
import DocumentSummarizer from './components/DocumentSummarizer';
import ConversationalAssistant from './components/ConversationalAssistant';

type ActiveModule = 
  | 'dashboard' 
  | 'projects'
  | 'methodology' 
  | 'sample' 
  | 'instruments' 
  | 'data-collection' 
  | 'data' 
  | 'quantitative' 
  | 'qualitative' 
  | 'ai-assistant' 
  | 'summarizer'
  | 'files' 
  | 'triangulation' 
  | 'peer-review' 
  | 'reports' 
  | 'analysis-history' 
  | 'collaboration' 
  | 'project-settings' 
  | 'system-settings'
  | 'search'
  | 'notifications'
  | 'visualization'
  | 'recommendations'
  | 'workflow'
  | 'admin';

function App() {
  const [activeModule, setActiveModule] = useState<ActiveModule>('dashboard');
  const [showAIAssistant, setShowAIAssistant] = useState(false);

  const renderActiveModule = () => {
    switch (activeModule) {
      case 'dashboard':
        return <Dashboard />;
      case 'projects':
        return <ProjectList />;
      case 'methodology':
        return <MethodologyModule />;
      case 'sample':
        return <SampleDefinition />;
      case 'instruments':
        return <InstrumentsModule />;
      case 'data-collection':
        return <DataCollection />;
      case 'data':
        return <DataRepository />;
      case 'quantitative':
        return <QuantitativeAnalysis />;
      case 'qualitative':
        return <QualitativeAnalysis />;
      case 'ai-assistant':
        return <ConversationalAssistant />;
      case 'summarizer':
        return <DocumentSummarizer />;
      case 'files':
        return <FilesModule />;
      case 'triangulation':
        return <TriangulationModule />;
      case 'peer-review':
        return <PeerReview />;
      case 'reports':
        return <ReportsModule />;
      case 'analysis-history':
        return <AnalysisHistory />;
      case 'collaboration':
        return <CollaborationModule />;
      case 'project-settings':
        return <ProjectSettings />;
      case 'system-settings':
        return <SystemSettings />;
      case 'search':
        return <AdvancedSearch />;
      case 'notifications':
        return <NotificationCenter />;
      case 'visualization':
        return <EnhancedDataVisualization />;
      case 'recommendations':
        return <SmartRecommendations />;
      case 'workflow':
        return <WorkflowGuide />;
      case 'admin':
        return <AdminPanel />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <AuthProvider>
      <AuthWrapper>
        <div className="min-h-screen bg-slate-50 flex">
          <Sidebar activeModule={activeModule} setActiveModule={setActiveModule} />
          <main className="flex-1 ml-64 p-6">
            {renderActiveModule()}
          </main>
          <FloatingAIButton onClick={() => setShowAIAssistant(true)} />
          {showAIAssistant && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl h-[80vh] flex flex-col">
                <div className="flex items-center justify-between p-4 border-b">
                  <h2 className="text-xl font-semibold text-gray-900">AI Assistant</h2>
                  <button
                    onClick={() => setShowAIAssistant(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <div className="flex-1">
                  <AIAssistant />
                </div>
              </div>
            </div>
          )}
        </div>
      </AuthWrapper>
    </AuthProvider>
  );
}

export default App;