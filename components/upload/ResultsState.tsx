
import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Download, FileBarChart, Users, AlertTriangle, Smartphone, Headphones, Watch, FileText, BookOpen, ClipboardList, Eye } from 'lucide-react';
import { ClayCard } from '../ClayCard';
import { ClayButton } from '../ClayButton';

export const ResultsState: React.FC = () => {
  const summaries = [
    { icon: Users, label: 'Students Counted', value: 35, color: '#6C5CE7' },
    { icon: AlertTriangle, label: 'Total Violations', value: 12, color: '#FFA502' },
    { icon: AlertTriangle, label: 'Critical Students', value: 3, color: '#FF6B6B' },
  ];

  const details = [
    { icon: Smartphone, label: 'Phones', value: 3 },
    { icon: Headphones, label: 'Earphone', value: 1 },
    { icon: Watch, label: 'Watches', value: 2 },
    { icon: FileText, label: 'Chits', value: 1 },
    { icon: BookOpen, label: 'Textbook', value: 0 },
    { icon: ClipboardList, label: 'Notebook', value: 2 },
  ];

  return (
    <div className="space-y-8 pb-12">
      <ClayCard className="bg-white border-2 border-[#00B894]/20">
        <div className="flex items-center gap-4 mb-8">
          <div className="p-4 bg-[#00B894]/10 rounded-3xl">
            <CheckCircle2 className="text-[#00B894]" size={40} />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-[#2D3436]">Analysis Complete!</h2>
            <p className="text-[#636E72]">Gemini Vision has processed 165,000 frames with 99.2% precision.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {summaries.map((s, i) => (
            <motion.div 
              key={i} 
              initial={{ scale: 0.9, opacity: 0 }} 
              animate={{ scale: 1, opacity: 1 }} 
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -5 }}
              className="clay-inset p-6 text-center group cursor-default"
            >
              <s.icon size={24} className="mx-auto mb-3 transition-transform group-hover:scale-110" style={{ color: s.color }} />
              <p className="text-4xl font-bold mono mb-1" style={{ color: s.color }}>{s.value}</p>
              <p className="text-xs font-bold text-[#636E72] uppercase tracking-widest">{s.label}</p>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 mb-10">
          {details.map((d, i) => (
            <div key={i} className={`p-4 rounded-2xl border border-[#E8E2DC] text-center ${d.value === 0 ? 'opacity-40 grayscale' : 'bg-white shadow-sm'}`}>
              <d.icon size={18} className="mx-auto mb-2 text-[#636E72]" />
              <p className="text-xl font-bold mono text-[#2D3436]">{d.value}</p>
              <p className="text-[10px] font-bold text-[#636E72] uppercase tracking-tighter">{d.label}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap gap-4">
          <ClayButton variant="primary" className="flex-1 min-w-[200px]">
            <FileBarChart size={18} /> View Full Report
          </ClayButton>
          <ClayButton variant="ghost" className="flex-1 min-w-[200px]">
            <Download size={18} /> Download PDF
          </ClayButton>
          <ClayButton variant="ghost" className="flex-1 min-w-[200px]">
            🎬 View Flagged Clips
          </ClayButton>
        </div>
      </ClayCard>

      <ClayCard className="bg-white overflow-hidden p-0">
        <div className="p-6 border-b border-[#E8E2DC] bg-[#F5F0EB]/30">
          <h3 className="font-bold text-lg">Students Exceeding Thresholds</h3>
          <p className="text-xs text-[#636E72]">Top 5 individuals requiring manual review based on AI behavior scoring.</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-[#F5F0EB]/50">
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-[#636E72]"># Rank</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-[#636E72]">Seat</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-[#636E72]">AI Score</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-[#636E72]">Top Violation</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8E2DC]">
              {[
                { rank: 1, seat: 'B3', score: 78, violation: 'Phone Usage' },
                { rank: 2, seat: 'D2', score: 65, violation: 'Smart Watch' },
                { rank: 3, seat: 'F4', score: 52, violation: 'Notebook' },
                { rank: 4, seat: 'A6', score: 48, violation: 'Behavioral' },
                { rank: 5, seat: 'C1', score: 34, violation: 'Phone Usage' },
              ].map((row) => (
                <tr key={row.rank} className="hover:bg-[#F5F0EB]/30 transition-colors">
                  <td className="px-6 py-4 text-sm mono font-bold text-[#636E72]">{row.rank}</td>
                  <td className="px-6 py-4 text-sm font-bold">{row.seat}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                       <span className={`w-2 h-2 rounded-full ${row.score > 70 ? 'bg-[#FF6B6B]' : row.score > 50 ? 'bg-[#FFA502]' : 'bg-[#FDCB6E]'}`} />
                       <span className="text-sm mono font-bold">{row.score}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#6C5CE7]/10 text-[#6C5CE7] uppercase tracking-tighter">
                      {row.violation}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 hover:bg-[#6C5CE7]/10 rounded-lg transition-colors text-[#6C5CE7]">
                      <Eye size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ClayCard>
    </div>
  );
};
