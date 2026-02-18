
import React from 'react';
import { Users, Smartphone, FileText, BookOpen, Laptop, ClipboardList, CheckCircle2, Brain, Eye, RotateCcw } from 'lucide-react';
import { ClayCard } from '../ClayCard';
import { DetectionStats as IStats } from '../../types';

interface DetectionStatsProps {
  stats: IStats;
}

export const DetectionStats: React.FC<DetectionStatsProps> = ({ stats }) => {
  const missing = Math.max(0, stats.expectedCount - stats.detectedCount);

  const detections = [
    { icon: Smartphone, label: 'Phone', value: stats.phone, color: '#6C5CE7' },
    { icon: FileText, label: 'Chit', value: stats.chit, color: '#FF6B6B' },
    { icon: BookOpen, label: 'Textbook', value: stats.textbook, color: '#FFA502' },
    { icon: ClipboardList, label: 'Notebook', value: stats.notebook, color: '#6C5CE7' },
    { icon: Laptop, label: 'Device', value: stats.device, color: '#636E72' },
  ];

  return (
    <ClayCard className="bg-white space-y-6">
      <div>
        <h4 className="text-xs font-bold text-[#636E72] uppercase tracking-[0.15em] mb-4">Head Count</h4>
        <div className="grid grid-cols-3 gap-3">
          <div className="clay-inset p-3 text-center">
            <p className="text-[10px] font-bold text-[#636E72] mb-1">DETECTED</p>
            <p className="text-xl font-bold mono text-[#00B894]">{stats.detectedCount}</p>
          </div>
          <div className="clay-inset p-3 text-center">
            <p className="text-[10px] font-bold text-[#636E72] mb-1">EXPECTED</p>
            <p className="text-xl font-bold mono text-[#2D3436]">{stats.expectedCount}</p>
          </div>
          <div className="clay-inset p-3 text-center">
            <p className="text-[10px] font-bold text-[#636E72] mb-1">MISSING</p>
            <p className="text-xl font-bold mono text-[#FF6B6B]">{missing}</p>
          </div>
        </div>
      </div>

      <div>
        <h4 className="text-xs font-bold text-[#636E72] uppercase tracking-[0.15em] mb-4">Detections Now</h4>
        <div className="space-y-2">
          {detections.map((d, i) => (
            <div key={i} className="flex items-center justify-between p-2.5 rounded-xl transition-colors hover:bg-[#F5F0EB]/50">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg clay-button flex items-center justify-center bg-white" style={{ color: d.color }}>
                  <d.icon size={16} />
                </div>
                <span className="text-sm font-semibold text-[#2D3436]">{d.label}</span>
              </div>
              <span className={`mono font-bold px-3 py-1 rounded-full text-xs ${d.value > 0 ? 'bg-[#FF6B6B]/10 text-[#FF6B6B]' : 'bg-[#F5F0EB] text-[#636E72]'}`}>
                {d.value}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h4 className="text-xs font-bold text-[#636E72] uppercase tracking-[0.15em] mb-4">AI Models Active</h4>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 rounded-full bg-[#26DE81] flex items-center justify-center text-white shadow-[0_0_8px_rgba(38,222,129,0.4)]">
              <CheckCircle2 size={12} />
            </div>
            <div className="flex items-center gap-2">
              <Eye size={14} className="text-[#6C5CE7]" />
              <span className="text-sm font-bold text-[#2D3436]">YOLOv8 Object Detection</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 rounded-full bg-[#26DE81] flex items-center justify-center text-white shadow-[0_0_8px_rgba(38,222,129,0.4)]">
              <CheckCircle2 size={12} />
            </div>
            <div className="flex items-center gap-2">
              <Brain size={14} className="text-[#6C5CE7]" />
              <span className="text-sm font-bold text-[#2D3436]">MediaPipe Face Mesh</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 rounded-full bg-[#26DE81] flex items-center justify-center text-white shadow-[0_0_8px_rgba(38,222,129,0.4)]">
              <CheckCircle2 size={12} />
            </div>
            <div className="flex items-center gap-2">
              <RotateCcw size={14} className="text-[#6C5CE7]" />
              <span className="text-sm font-bold text-[#2D3436]">Head Pose Estimation</span>
            </div>
          </div>
        </div>
      </div>
    </ClayCard>
  );
};
