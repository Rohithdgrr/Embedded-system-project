
import React, { useState, useCallback, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Header } from './components/Header';
import { Navigation, TabType } from './components/Navigation';
import { Login } from './components/Login';
import { LiveMonitorView } from './views/LiveMonitorView';
import { ReportsView } from './views/ReportsView';
import { InvigilatorView } from './views/InvigilatorView';
import { ProctorAlert, DetectionStats } from './types';

type UserRole = 'admin' | 'invigilator';

interface AuthUser {
  username: string;
  role: UserRole;
}

const App: React.FC = () => {
  // Auth state
  const [user, setUser] = useState<AuthUser | null>(() => {
    const saved = localStorage.getItem('examshield_user');
    return saved ? JSON.parse(saved) : null;
  });
  
  const [activeTab, setActiveTab] = useState<TabType>('live');
  const [alerts, setAlerts] = useState<ProctorAlert[]>([]);
  const [integrityScore, setIntegrityScore] = useState(0);
  const [stats, setStats] = useState<DetectionStats>({
    phone: 0,
    chit: 0,
    textbook: 0,
    notebook: 0,
    device: 0,
    headTurn: 0,
    leaning: 0,
    multiplePeople: 0,
    detectedCount: 0,
    expectedCount: 0
  });

  const updateStats = useCallback((newStats: Omit<DetectionStats, 'expectedCount'>) => {
    setStats(prev => ({ ...prev, ...newStats }));
  }, []);

  // Persist auth state
  useEffect(() => {
    if (user) {
      localStorage.setItem('examshield_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('examshield_user');
    }
  }, [user]);

  const handleLogin = useCallback((authUser: AuthUser) => {
    setUser(authUser);
  }, []);

  const handleLogout = useCallback(() => {
    setUser(null);
    setAlerts([]);
    setIntegrityScore(0);
    setStats({
      phone: 0,
      chit: 0,
      textbook: 0,
      notebook: 0,
      device: 0,
      headTurn: 0,
      leaning: 0,
      multiplePeople: 0,
      detectedCount: 0,
      expectedCount: 0
    });
  }, []);

  const handleNewAlert = useCallback((alert: ProctorAlert) => {
    setAlerts(prev => [alert, ...prev].slice(0, 50));
  }, []);

  const updateIntegrityScore = useCallback((score: number) => {
    setIntegrityScore(score);
  }, []);

  // If not logged in, show login page
  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  // Invigilator view - only notifications
  if (user.role === 'invigilator') {
    return (
      <div className="min-h-screen bg-[#F5F0EB]">
        {/* Invigilator Header */}
        <header className="bg-white border-b border-[#E8E2DC] sticky top-0 z-50">
          <div className="px-4 sm:px-6 lg:px-8 max-w-[1440px] mx-auto">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#FF6B6B] flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                </div>
                <div>
                  <h1 className="font-bold text-[#2D3436]">Invigilator Portal</h1>
                  <p className="text-xs text-[#636E72]">{user.username}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 text-[#636E72] hover:text-[#2D3436] hover:bg-[#F5F0EB] rounded-xl transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </header>

        <main className="px-4 sm:px-6 lg:px-8 max-w-[1440px] mx-auto py-6">
          <InvigilatorView 
            alerts={alerts}
            handleNewAlert={handleNewAlert}
            integrityScore={integrityScore}
            stats={stats}
          />
        </main>
      </div>
    );
  }

  // Admin view - full access
  const renderView = () => {
    switch (activeTab) {
      case 'live':
        return (
          <LiveMonitorView 
            alerts={alerts}
            integrityScore={integrityScore}
            handleNewAlert={handleNewAlert}
            updateIntegrityScore={updateIntegrityScore}
            updateStats={updateStats}
          />
        );
      case 'reports':
        return <ReportsView alerts={alerts} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen pb-32 lg:pb-12 bg-[#F5F0EB]">
      <Header 
        activeTab={activeTab} 
        setActiveTab={setActiveTab}
        user={user}
        onLogout={handleLogout}
      />

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
