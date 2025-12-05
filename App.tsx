
import React, { useState, useEffect } from 'react';
import { Navigation } from './components/Navigation';
import { ScanView } from './components/ScanView';
import { Dashboard } from './components/Dashboard';
import { AnalysisResult } from './components/AnalysisResult';
import { Marketplace } from './components/Marketplace';
import { MapView } from './components/MapView';
import { PlantAnalysis, AppView, ScanHistoryItem } from './types';
import { Sprout } from 'lucide-react';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>(AppView.HOME);
  const [analysisResult, setAnalysisResult] = useState<PlantAnalysis | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  
  // Initialize history from localStorage or default mock data
  const [history, setHistory] = useState<ScanHistoryItem[]>(() => {
    const saved = localStorage.getItem('plant_history');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse history", e);
      }
    }
    return [
      {
        id: '1',
        date: 'Today, 10:23 AM',
        imageUrl: 'https://images.unsplash.com/photo-1592841200221-a6898f307baa?auto=format&fit=crop&q=80&w=200',
        plantName: 'Tomato Plant',
        healthStatus: 'Diseased'
      },
      {
        id: '2',
        date: 'Yesterday, 4:15 PM',
        imageUrl: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&q=80&w=200',
        plantName: 'Corn Maize',
        healthStatus: 'Healthy'
      },
      {
        id: '3',
        date: 'Oct 24, 9:00 AM',
        imageUrl: 'https://images.unsplash.com/photo-1518977676605-69f23370dd0d?auto=format&fit=crop&q=80&w=200',
        plantName: 'Potato Leaf',
        healthStatus: 'Healthy'
      },
    ];
  });

  // Persist history changes to localStorage
  useEffect(() => {
    localStorage.setItem('plant_history', JSON.stringify(history));
  }, [history]);

  const handleScanComplete = (result: PlantAnalysis, image: string) => {
    setAnalysisResult(result);
    setCapturedImage(image);

    const newHistoryItem: ScanHistoryItem = {
      id: Date.now().toString(),
      date: new Date().toLocaleString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        hour: 'numeric', 
        minute: 'numeric',
        hour12: true 
      }),
      imageUrl: image,
      plantName: result.plantName,
      healthStatus: result.healthStatus as 'Healthy' | 'Diseased' | 'Unknown'
    };

    setHistory(prev => [newHistoryItem, ...prev]);
  };

  const handleDeleteHistoryItem = (id: string) => {
    setHistory(prev => prev.filter(item => item.id !== id));
  };

  const handleClearHistory = () => {
    if (window.confirm("Are you sure you want to clear your scan history?")) {
      setHistory([]);
    }
  };

  const clearAnalysis = () => {
    setAnalysisResult(null);
    setCapturedImage(null);
    setCurrentView(AppView.SCAN);
  };

  // Render content based on current view state
  const renderContent = () => {
    // If we have an analysis result, show it regardless of view (acts as a modal detail view)
    if (analysisResult && capturedImage) {
      return (
        <AnalysisResult 
          result={analysisResult} 
          image={capturedImage} 
          onBack={clearAnalysis} 
        />
      );
    }

    switch (currentView) {
      case AppView.HOME:
        return (
          <div className="flex flex-col items-center justify-center h-full p-8 text-center space-y-6 animate-fade-in">
             <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mb-4 shadow-sm">
              <Sprout size={48} className="text-emerald-600" />
            </div>
            <h1 className="text-3xl font-bold text-stone-800">
              Welcome to <br />
              <span className="text-emerald-600">Plant Detector</span>
            </h1>
            <p className="text-stone-500 max-w-xs leading-relaxed">
              Your AI-powered agricultural assistant. Scan plants to detect diseases and get instant treatment plans.
            </p>
            <button 
              onClick={() => setCurrentView(AppView.SCAN)}
              className="bg-emerald-600 text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-lg shadow-emerald-200 hover:bg-emerald-700 transition-colors w-full max-w-xs"
            >
              Start Scanning
            </button>
          </div>
        );
      case AppView.SCAN:
        return <ScanView onScanComplete={handleScanComplete} />;
      case AppView.DASHBOARD:
        return (
          <Dashboard 
            history={history} 
            onDeleteItem={handleDeleteHistoryItem}
            onClearHistory={handleClearHistory}
          />
        );
      case AppView.MARKET:
        return <Marketplace />;
      case AppView.MAP:
        return <MapView />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 font-sans text-stone-900 overflow-hidden relative">
      <div className="max-w-md mx-auto h-screen bg-white shadow-2xl overflow-hidden relative flex flex-col">
        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto no-scrollbar relative">
           {renderContent()}
        </div>

        {/* Navigation - Hide if showing analysis result */}
        {!analysisResult && (
          <Navigation currentView={currentView} onNavigate={setCurrentView} />
        )}
      </div>
    </div>
  );
};

export default App;
