
import React from 'react';
import { motion } from 'framer-motion';
import { ClayCard } from '../ClayCard';

export const SimpleCharts: React.FC = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Violation Type Distribution (Donut Chart) */}
      <ClayCard className="bg-white flex flex-col items-center">
        <h3 className="font-bold text-lg mb-8 self-start">Violation Type Distribution</h3>
        <div className="relative w-48 h-48 mb-8">
          <svg viewBox="0 0 100 100" className="transform -rotate-90 w-full h-full">
            {/* Background track only since data is zero */}
            <circle cx="50" cy="50" r="40" fill="transparent" stroke="#F5F0EB" strokeWidth="12" />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
             <span className="text-2xl font-bold text-[#2D3436]">0</span>
             <span className="text-[8px] font-bold text-[#636E72] uppercase tracking-widest">TOTAL</span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-x-8 gap-y-2 w-full max-w-sm px-4 opacity-40">
          <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-[#6C5CE7]" /><span className="text-xs font-semibold text-[#636E72]">Phones: 0%</span></div>
          <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-[#FFA502]" /><span className="text-xs font-semibold text-[#636E72]">Chits: 0%</span></div>
          <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-[#FDCB6E]" /><span className="text-xs font-semibold text-[#636E72]">Watches: 0%</span></div>
          <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-[#00B894]" /><span className="text-xs font-semibold text-[#636E72]">Earphones: 0%</span></div>
        </div>
      </ClayCard>

      {/* Violations Over Time (Line Chart) */}
      <ClayCard className="bg-white">
        <h3 className="font-bold text-lg mb-8">Violations Over Time</h3>
        <div className="h-64 relative">
          <svg viewBox="0 0 400 200" className="w-full h-full">
            {/* Grid lines */}
            <line x1="0" y1="180" x2="400" y2="180" stroke="#E8E2DC" strokeWidth="1" />
            <line x1="0" y1="140" x2="400" y2="140" stroke="#E8E2DC" strokeWidth="1" strokeDasharray="4 4" />
            <line x1="0" y1="100" x2="400" y2="100" stroke="#E8E2DC" strokeWidth="1" strokeDasharray="4 4" />
            <line x1="0" y1="60" x2="400" y2="60" stroke="#E8E2DC" strokeWidth="1" strokeDasharray="4 4" />
            
            {/* Flat line since data is zero */}
            <motion.path
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1, ease: "easeInOut" }}
              d="M 10,180 L 390,180"
              fill="transparent"
              stroke="#E8E2DC"
              strokeWidth="2"
            />
          </svg>
          <div className="flex justify-between mt-2 px-1 text-[10px] font-bold text-[#636E72] uppercase tracking-tighter">
            <span>--</span>
            <span>--</span>
            <span>--</span>
            <span>--</span>
            <span>--</span>
          </div>
        </div>
      </ClayCard>
    </div>
  );
};
