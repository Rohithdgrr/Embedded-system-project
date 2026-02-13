
import React, { useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Header } from './components/Header';
import { Navigation, TabType } from './components/Navigation';
import { LiveMonitorView } from './views/LiveMonitorView';
import { UploadView } from './views/UploadView';
import { ReportsView } from './views/ReportsView';
import { ProctorAlert } from './types';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('live');
  const [alerts, setAlerts] = useState<ProctorAlert[]>([]);
  const [integrityScore, setIntegrityScore] = useState(0);

  const handleNewAlert = useCallback((alert: ProctorAlert) => {
    setAlerts(prev => [alert, ...prev].slice(0, 50));
  }, []);

  const updateIntegrityScore = useCallback((score: number) => {
    setIntegrityScore(score);
  }, []);

  const renderView = () => {
    switch (activeTab) {
      case 'live':
        return (
          <LiveMonitorView 
            alerts={alerts}
            integrityScore={integrityScore}
            handleNewAlert={handleNewAlert}
            updateIntegrityScore={updateIntegrityScore}
          />
        );
      case 'upload':
        return <UploadView />;
      case 'reports':
        return <ReportsView />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen pb-32 lg:pb-12 bg-[#F5F0EB]">
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="px-4 sm:px-6 lg:px-8 max-w-[1440px] mx-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          >
            {renderView()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Mobile Navigation */}
      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
};

export default App;
