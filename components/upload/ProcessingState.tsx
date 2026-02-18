
import React from 'react';
import { motion } from 'framer-motion';
import { Loader2, CheckCircle2, Circle, Smartphone, FileText, BookOpen, ClipboardList, Laptop, Activity } from 'lucide-react';
import { ClayCard } from '../ClayCard';

interface ProcessingStateProps {
  progress: number;
  fileName: string;
}

export const ProcessingState: React.FC<ProcessingStateProps> = ({ progress, fileName }) => {
  const phases = [
    { id: 1, label: 'Phase 1: Head Count', threshold: 30 },
    { id: 2, label: 'Phase 2: Behavior', threshold: 70 },
    { id: 3, label: 'Phase 3: Objects', threshold: 100 },
  ];

  const detections = [
    { icon: Smartphone, label: 'Phones', value: Math.floor(progress / 15), color: '#6C5CE7' },
    { icon: FileText, label: 'Chits', value: Math.floor(progress / 35), color: '#FF6B6B' },
    { icon: BookOpen, label: 'Textbook', value: 0, color: '#FFA502' },
    { icon: ClipboardList, label: 'Notebook', value: Math.floor(progress / 20), color: '#6C5CE7' },
    { icon: Laptop, label: 'Device', value: Math.floor(progress / 40), color: '#636E72' },
  ];

  return (
    <div className="space-y-8">
      <ClayCard className="bg-white">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-[#6C5CE7]/10 rounded-2xl">
              <Activity className="text-[#6C5CE7] animate-pulse" />
            </div>
            <div>
              <h3 className="font-bold text-lg">Analysis in Progress</h3>
              <p className="text-xs text-[#636E72] font-medium">{fileName}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs font-bold text-[#636E72] uppercase tracking-widest">ETA</p>
            <p className="text-sm font-bold mono">18 minutes</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-end">
            <span className="text-2xl font-bold mono text-[#6C5CE7]">{progress}% <span className="text-sm font-medium text-[#636E72]">Complete</span></span>
            <div className="flex gap-2">
              {phases.map(p => {
                const isDone = progress > p.threshold;
                const isActive = progress <= p.threshold && (phases[phases.indexOf(p) - 1]?.threshold || 0) <= progress;
                return (
                  <div key={p.id} className={`w-3 h-3 rounded-full ${isDone ? 'bg-[#00B894]' : isActive ? 'bg-[#6C5CE7] animate-pulse' : 'bg-[#E8E2DC]'}`} title={p.label} />
                );
              })}
            </div>
          </div>
          <div className="w-full bg-[#F5F0EB] h-6 rounded-full overflow-hidden clay-inset p-1">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              className="h-full bg-gradient-to-r from-[#6C5CE7] to-[#a29bfe] rounded-full"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
            {phases.map((p) => {
              const isDone = progress > p.threshold;
              const isActive = progress <= p.threshold && (phases[phases.indexOf(p) - 1]?.threshold || 0) <= progress;
              return (
                <div key={p.id} className="flex items-center gap-2">
                  {isDone ? <CheckCircle2 size={16} className="text-[#00B894]" /> :
                    isActive ? <Loader2 size={16} className="text-[#6C5CE7] animate-spin" /> :
                      <Circle size={16} className="text-[#E8E2DC]" />}
                  <span className={`text-xs font-bold uppercase tracking-tight ${isDone ? 'text-[#00B894]' : isActive ? 'text-[#6C5CE7]' : 'text-[#636E72]'}`}>
                    {p.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </ClayCard>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <ClayCard className="bg-white p-0 overflow-hidden flex flex-col">
          <div className="p-4 border-b border-[#E8E2DC] flex justify-between items-center bg-[#F5F0EB]/20">
            <h4 className="text-xs font-bold text-[#636E72] uppercase tracking-[0.15em]">Current Frame</h4>
            <span className="text-[10px] font-bold mono text-[#636E72]">1:09:20 / Frame: 124,800</span>
          </div>
          <div className="flex-1 aspect-video relative group">
            <div className="absolute inset-0 skeleton-shimmer bg-[#F5F0EB]" />
            <img
              src={`https://picsum.photos/seed/proctoring${Math.floor(progress / 5)}/1280/720`}
              className="w-full h-full object-cover relative z-10 transition-opacity duration-1000"
              alt="Processing frame"
            />
            <div className="absolute inset-0 z-20 pointer-events-none p-4">
              <div className="w-16 h-16 border-2 border-[#00B894] rounded-lg absolute top-[20%] left-[30%] shadow-[0_0_10px_rgba(0,184,148,0.5)]">
                <span className="absolute -top-5 left-0 bg-[#00B894] text-white text-[8px] px-1 font-bold">ST_9482</span>
              </div>
              <div className="w-10 h-10 border-2 border-[#FF6B6B] rounded-lg absolute bottom-[20%] right-[40%] shadow-[0_0_10px_rgba(255,107,107,0.5)]">
                <span className="absolute -top-5 left-0 bg-[#FF6B6B] text-white text-[8px] px-1 font-bold">PHONE</span>
              </div>
            </div>
          </div>
        </ClayCard>

        <ClayCard className="bg-white">
          <h4 className="text-xs font-bold text-[#636E72] uppercase tracking-[0.15em] mb-6">Running Stats</h4>
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="clay-inset p-4 text-center">
                <p className="text-[10px] font-bold text-[#636E72] uppercase tracking-widest mb-1">Students</p>
                <p className="text-3xl font-bold mono text-[#2D3436]">35</p>
              </div>
              <div className="clay-inset p-4 text-center">
                <p className="text-[10px] font-bold text-[#636E72] uppercase tracking-widest mb-1">Violations</p>
                <p className="text-3xl font-bold mono text-[#FF6B6B]">{detections.reduce((sum, d) => sum + d.value, 0)}</p>
              </div>
            </div>
            <div className="space-y-3">
              {detections.map((d, i) => (
                <div key={i} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <d.icon size={14} style={{ color: d.color }} />
                    <span className="font-semibold text-[#636E72]">{d.label}</span>
                  </div>
                  <span className="font-bold mono">{d.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-[#E8E2DC]">
            <h5 className="text-[10px] font-bold text-[#636E72] uppercase tracking-widest mb-4">Timeline Markers</h5>
            <div className="space-y-2 max-h-32 overflow-y-auto pr-2 custom-scrollbar">
              <div className="flex items-center justify-between text-[10px] mono p-2 bg-[#FF6B6B]/5 rounded-lg border border-[#FF6B6B]/10">
                <span className="text-[#FF6B6B]">🔴 14:23 Phone detected at B3</span>
                <span className="font-bold">0:24:12</span>
              </div>
              <div className="flex items-center justify-between text-[10px] mono p-2 bg-[#FFA502]/5 rounded-lg border border-[#FFA502]/10">
                <span className="text-[#FFA502]">🟠 14:35 Chit detected at D2</span>
                <span className="font-bold">0:36:45</span>
              </div>
              <div className="flex items-center justify-between text-[10px] mono p-2 bg-[#FDCB6E]/5 rounded-lg border border-[#FDCB6E]/10">
                <span className="text-[#FDCB6E]">🟡 14:42 Head turn at A6</span>
                <span className="font-bold">0:43:10</span>
              </div>
            </div>
          </div>
        </ClayCard>
      </div>
    </div>
  );
};
