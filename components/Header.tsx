
import React from 'react';
import { ShieldCheck, User, Settings, Bell } from 'lucide-react';
import { ClayButton } from './ClayButton';
import { Navigation, TabType } from './Navigation';

interface HeaderProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab }) => {
  return (
    <header className="flex items-center justify-between px-4 lg:px-8 py-6 mb-4 lg:mb-8 sticky top-0 z-40 bg-[#F5F0EB]/80 backdrop-blur-md">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-[#6C5CE7] rounded-2xl clay-button flex items-center justify-center shrink-0">
          <ShieldCheck className="text-white" size={28} />
        </div>
        <div className="hidden sm:block">
          <h1 className="text-2xl font-bold text-[#2D3436] tracking-tight">ExamShield</h1>
          <p className="text-[10px] font-semibold text-[#636E72] uppercase tracking-[0.2em]">Intelligent Security</p>
        </div>
      </div>

      <div className="hidden lg:block flex-1 max-w-2xl px-8">
        <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>

      <div className="flex items-center gap-2 lg:gap-4">
        <div className="hidden md:flex items-center gap-2 mr-2">
          <div className="text-right">
            <p className="text-sm font-bold text-[#2D3436]">Dr. Sarah Wilson</p>
            <p className="text-[10px] font-semibold text-[#00B894] uppercase tracking-wider">Administrator</p>
          </div>
          <div className="w-10 h-10 bg-white rounded-full clay-button overflow-hidden border-2 border-[#E8E2DC]">
            <img src="https://picsum.photos/seed/sarah/100" alt="Avatar" className="w-full h-full object-cover" />
          </div>
        </div>
        
        <div className="flex gap-1.5 lg:gap-2">
          <ClayButton variant="ghost" className="p-2.5 rounded-xl">
            <Bell size={20} className="text-[#636E72]" />
          </ClayButton>
          <div className="hidden lg:block">
            <ClayButton variant="ghost" className="p-2.5 rounded-xl">
              <Settings size={20} className="text-[#636E72]" />
            </ClayButton>
          </div>
        </div>
      </div>
    </header>
  );
};
