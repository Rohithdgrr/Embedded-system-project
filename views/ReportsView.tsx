
import React, { useState } from 'react';
/* Added missing Clock import */
import { Search, Calendar, Clock, ChevronRight, FileText, Download, Eye, Smartphone, Headphones, Watch, ClipboardList } from 'lucide-react';
import { ClayCard } from '../components/ClayCard';
import { ClayButton } from '../components/ClayButton';
import { StatsSummary } from '../components/reports/StatsSummary';
import { SimpleCharts } from '../components/reports/SimpleCharts';
import { SessionDetailModal } from '../components/reports/SessionDetailModal';
import { motion, AnimatePresence } from 'framer-motion';

// Defined interface for exam sessions to resolve type inference issues
interface ExamSession {
  id: string;
  name: string;
  date: string;
  duration: string;
  alerts: number;
  students: number;
  detections: {
    phone: number;
    earphone: number;
    watch: number;
    chit: number;
    [key: string]: number;
  };
}

export const ReportsView: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSession, setSelectedSession] = useState<ExamSession | null>(null);

  // Initialized with explicit type instead of any[] to fix 'unknown' node errors
  const sessions: ExamSession[] = [];

  const filteredSessions = sessions.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-12 pb-20">
      {/* Header & Page Title */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <h2 className="text-4xl font-bold text-[#2D3436]">Reports & History</h2>
          <p className="text-[#636E72] text-lg">Detailed analytical overview of all proctored sessions</p>
        </div>
        <div className="flex gap-4">
          <ClayButton variant="ghost" className="px-4 py-2 text-sm">
            <Calendar size={18} /> Last 30 Days
          </ClayButton>
          <ClayButton variant="ghost" className="px-4 py-2 text-sm">
            <Download size={18} /> Export All Data
          </ClayButton>
        </div>
      </div>

      {/* Summary Stats Grid */}
      <StatsSummary />

      {/* Charts Section */}
      <SimpleCharts />

      {/* Session History Section */}
      <section className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h3 className="text-2xl font-bold text-[#2D3436] flex items-center gap-2">
            <ClipboardList className="text-[#6C5CE7]" /> Past Exam Sessions
          </h3>
          <div className="flex gap-4 w-full md:w-auto">
            <div className="relative flex-1 md:w-80">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#636E72]">
                <Search size={18} />
              </div>
              <input 
                type="text" 
                placeholder="Search exam name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full clay-inset pl-12 pr-4 py-3 bg-white focus:outline-none transition-all text-sm font-medium"
              />
            </div>
            <ClayButton variant="ghost" className="p-3"><ChevronRight className="rotate-90" /></ClayButton>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredSessions.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="col-span-full py-20 text-center"
              >
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 clay-inset">
                  <FileText size={32} className="text-[#636E72]" />
                </div>
                <p className="text-[#636E72] font-medium">No session records found.</p>
              </motion.div>
            ) : (
              filteredSessions.map((session, i) => (
                <motion.div
                  key={session.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <ClayCard className="bg-white hover:border-[#6C5CE7]/30 transition-colors p-0 overflow-hidden group">
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h4 className="font-bold text-lg text-[#2D3436] group-hover:text-[#6C5CE7] transition-colors">{session.name}</h4>
                          <div className="flex items-center gap-3 text-[10px] font-bold text-[#636E72] uppercase tracking-wider mt-1">
                            <span className="flex items-center gap-1"><Calendar size={12} /> {session.date}</span>
                            <span className="flex items-center gap-1"><Clock size={12} /> {session.duration}</span>
                          </div>
                        </div>
                        <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-tighter ${
                          session.alerts > 5 ? 'bg-[#FF6B6B]/10 text-[#FF6B6B]' : 
                          session.alerts > 0 ? 'bg-[#FFA502]/10 text-[#FFA502]' : 
                          'bg-[#00B894]/10 text-[#00B894]'
                        }`}>
                          {session.alerts} Alerts
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-4 mb-6">
                        <div className="clay-inset p-3 text-center">
                          <p className="text-[8px] font-bold text-[#636E72] uppercase mb-1">Students</p>
                          <p className="text-lg font-bold mono text-[#2D3436]">{session.students}</p>
                        </div>
                        <div className="clay-inset p-3 text-center">
                          <p className="text-[8px] font-bold text-[#636E72] uppercase mb-1">Violations</p>
                          <p className="text-lg font-bold mono text-[#FF6B6B]">
                            {/* Fixed: Used typed reduce to ensure the result is a number and not unknown */}
                            {Object.values(session.detections).reduce((acc: number, val: number) => acc + val, 0)}
                          </p>
                        </div>
                        <div className="clay-inset p-3 text-center">
                          <p className="text-[8px] font-bold text-[#636E72] uppercase mb-1">Status</p>
                          <p className="text-[10px] font-bold text-[#2D3436] pt-2">{session.alerts === 0 ? 'CLEAR' : 'FLAGGED'}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 text-[10px] font-bold text-[#636E72] uppercase border-t border-[#E8E2DC] pt-4">
                        <div className="flex items-center gap-1"><Smartphone size={12} /> {session.detections.phone}</div>
                        <div className="flex items-center gap-1"><Headphones size={12} /> {session.detections.earphone}</div>
                        <div className="flex items-center gap-1"><Watch size={12} /> {session.detections.watch}</div>
                        <div className="flex items-center gap-1"><FileText size={12} /> {session.detections.chit}</div>
                      </div>
                    </div>

                    <div className="flex border-t border-[#E8E2DC]">
                      <button 
                        onClick={() => setSelectedSession(session)}
                        className="flex-1 py-4 flex items-center justify-center gap-2 text-xs font-bold text-[#6C5CE7] hover:bg-[#6C5CE7]/5 transition-colors"
                      >
                        <Eye size={14} /> View Details
                      </button>
                      <div className="w-[1px] bg-[#E8E2DC]" />
                      <button className="flex-1 py-4 flex items-center justify-center gap-2 text-xs font-bold text-[#636E72] hover:bg-[#F5F0EB] transition-colors">
                        <Download size={14} /> PDF
                      </button>
                    </div>
                  </ClayCard>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>

        {filteredSessions.length > 0 && (
          <div className="flex justify-center mt-12">
            <ClayButton variant="ghost" className="px-12">Load More Sessions</ClayButton>
          </div>
        )}
      </section>

      {/* Session Detail Modal */}
      {selectedSession && (
        <SessionDetailModal 
          session={selectedSession} 
          onClose={() => setSelectedSession(null)} 
        />
      )}
    </div>
  );
};
