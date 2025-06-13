import React, { useState, useEffect } from 'react';
import { Navigation } from './components/Navigation';
import { Dashboard } from './components/Dashboard';
import { Inventory } from './components/Inventory';
import { Channels } from './components/Channels';
import { Pricing } from './components/Pricing';
import { Calendar } from './components/Calendar';
import { Settings } from './components/Settings';

function App() {
  const [activeScreen, setActiveScreen] = useState('dashboard');
  const [language, setLanguage] = useState('en');
  const [isNavOpen, setIsNavOpen] = useState(false);

  // Load saved language from localStorage
  useEffect(() => {
    const savedLanguage = localStorage.getItem('hotelManagerLanguage');
    if (savedLanguage) {
      setLanguage(savedLanguage);
    }
  }, []);

  // Save language to localStorage when changed
  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage);
    localStorage.setItem('hotelManagerLanguage', newLanguage);
  };

  const renderActiveScreen = () => {
    switch (activeScreen) {
      case 'dashboard':
        return <Dashboard language={language} />;
      case 'inventory':
        return <Inventory language={language} />;
      case 'channels':
        return <Channels language={language} />;
      case 'pricing':
        return <Pricing language={language} />;
      case 'calendar':
        return <Calendar language={language} />;
      case 'settings':
        return <Settings language={language} onLanguageChange={handleLanguageChange} />;
      default:
        return <Dashboard language={language} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Navigation
        activeScreen={activeScreen}
        onScreenChange={setActiveScreen}
        language={language}
        isOpen={isNavOpen}
        onToggle={() => setIsNavOpen(!isNavOpen)}
      />
      
      <main className="flex-1 lg:ml-64 mobile-padding py-4 sm:py-6 lg:py-8">
        <div className="max-w-7xl mx-auto">
          {renderActiveScreen()}
        </div>
      </main>
    </div>
  );
}

export default App;