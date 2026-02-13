
import React, { useState } from 'react';
import { Search, Calendar, Clock, ChevronRight, FileText, Download, Eye, Smartphone, Headphones, Watch, ClipboardList } from 'lucide-react';
import { ClayCard } from '../../components/ClayCard';
import { ClayButton } from '../../components/ClayButton';
import { StatsSummary } from '../../components/reports/StatsSummary';
import { SimpleCharts } from '../../components/reports/SimpleCharts';
import { SessionDetailModal } from '../../components/reports/SessionDetailModal';
import { motion, AnimatePresence } from 'framer-motion';
import { ExamSession } from '../../database/types';

export const ReportsView: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSession, setSelectedSession] = useState<ExamSession | null>(null);

  const sessions: ExamSession[] = [];

  const filteredSessions = sessions.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-12 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <h2 className="text-4xl font-bold text-[#2D3436]">Reports & History</h2>
          <p className="text-[#636E72] text-lg">Detailed analytical overview of all proctored sessions</p>
        </div>
        <div className="flex gap-4">
          <ClayButton variant="ghost" className="px-4 py-2 text-sm">
            <Calendar size={18} /> Last 30 Days
          </ClayButton>
        </div>
      </div>

      <StatsSummary />
      <SimpleCharts />

      <section className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h3 className="text-2xl font-bold text-[#2D3436] flex items-center gap-2">
            <ClipboardList className="text-[#6C5CE7]" /> Past Exam Sessions
          </h3>
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
              null // Map sessions here if any
            )}
          </AnimatePresence>
        </div>
      </section>

      {selectedSession && (
        <SessionDetailModal 
          session={selectedSession} 
          onClose={() => setSelectedSession(null)} 
        />
      )}
    </div>
  );
};
