
import React from 'react';
import { motion } from 'framer-motion';
import { Monitor, BarChart3 } from 'lucide-react';

export type TabType = 'live' | 'reports';

interface NavigationProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
}

const navItems = [
  { id: 'live' as TabType, label: 'Live Monitor', icon: Monitor },
  { id: 'reports' as TabType, label: 'Reports & History', icon: BarChart3 },
];

export const Navigation: React.FC<NavigationProps> = ({ activeTab, setActiveTab }) => {
  return (
    <>
      {/* Desktop Top Navigation */}
      <nav className="hidden lg:flex items-center gap-2 bg-white/50 p-1.5 rounded-[24px] clay-inset">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`relative px-6 py-2.5 rounded-[18px] text-sm font-bold flex items-center gap-2 transition-all duration-300 ${
                isActive ? 'text-[#6C5CE7]' : 'text-[#636E72] hover:text-[#2D3436]'
              }`}
            >
              <item.icon size={18} />
              {item.label}
              {isActive && (
                <motion.div
                  layoutId="activeTabDesktop"
                  className="absolute inset-0 bg-white clay-button -z-10"
                  transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                />
              )}
            </button>
          );
        })}
      </nav>

      {/* Mobile Bottom Navigation */}
      <nav className="lg:hidden fixed bottom-6 left-6 right-6 z-50">
        <div className="bg-white/90 backdrop-blur-md p-2 rounded-[28px] clay-card flex items-center justify-around shadow-2xl">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`relative flex flex-col items-center justify-center w-20 py-2 rounded-2xl transition-colors ${
                  isActive ? 'text-[#6C5CE7]' : 'text-[#636E72]'
                }`}
              >
                <item.icon size={24} className={isActive ? 'scale-110' : ''} />
                <span className="text-[10px] font-bold mt-1 uppercase tracking-tighter">{item.label.split(' ')[0]}</span>
                {isActive && (
                  <motion.div
                    layoutId="activeTabMobile"
                    className="absolute -top-1 w-1 h-1 bg-[#6C5CE7] rounded-full"
                  />
                )}
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
};
