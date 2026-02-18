
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Clock, Users, AlertTriangle, Download, FileText, Smartphone, BookOpen, Laptop, Eye } from 'lucide-react';
import { ClayButton } from '../ClayButton';

interface SessionDetailModalProps {
  session: any;
  onClose: () => void;
}

export const SessionDetailModal: React.FC<SessionDetailModalProps> = ({ session, onClose }) => {
  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-[#2D3436]/40 backdrop-blur-sm"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-4xl max-h-[90vh] bg-[#F5F0EB] rounded-[32px] clay-card overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className="p-8 border-b border-[#E8E2DC] flex items-center justify-between bg-white/50">
            <div>
              <h2 className="text-2xl font-bold text-[#2D3436] mb-1">{session.name}</h2>
              <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-[#636E72] uppercase tracking-wider">
                <span className="flex items-center gap-1.5"><Calendar size={14} /> {session.date}</span>
                <span className="flex items-center gap-1.5"><Clock size={14} /> {session.duration}</span>
                <span className="flex items-center gap-1.5 text-[#FF6B6B]"><AlertTriangle size={14} /> {session.alerts} Alerts</span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-white clay-button flex items-center justify-center text-[#636E72] hover:text-[#FF6B6B] transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
            {/* Timeline */}
            <section>
              <h3 className="text-xs font-bold text-[#636E72] uppercase tracking-[0.2em] mb-4">Detection Timeline</h3>
              <div className="clay-inset p-8 relative">
                <div className="h-1 bg-[#E8E2DC] rounded-full relative">
                  <div className="absolute top-1/2 -translate-y-1/2 left-[15%] w-3 h-3 bg-[#FF6B6B] rounded-full shadow-[0_0_8px_rgba(255,107,107,0.5)] cursor-pointer" />
                  <div className="absolute top-1/2 -translate-y-1/2 left-[42%] w-3 h-3 bg-[#FFA502] rounded-full shadow-[0_0_8px_rgba(255,165,2,0.5)] cursor-pointer" />
                  <div className="absolute top-1/2 -translate-y-1/2 left-[48%] w-3 h-3 bg-[#FF6B6B] rounded-full shadow-[0_0_8px_rgba(255,107,107,0.5)] cursor-pointer" />
                  <div className="absolute top-1/2 -translate-y-1/2 left-[75%] w-3 h-3 bg-[#FDCB6E] rounded-full shadow-[0_0_8px_rgba(253,203,110,0.5)] cursor-pointer" />
                </div>
                <div className="flex justify-between mt-4 text-[10px] font-bold text-[#636E72] mono">
                  <span>9:00 AM</span>
                  <span>9:45 AM</span>
                  <span>10:30 AM</span>
                  <span>11:15 AM</span>
                </div>
              </div>
            </section>

            {/* Evidence Gallery */}
            <section>
              <h3 className="text-xs font-bold text-[#636E72] uppercase tracking-[0.2em] mb-4">Evidence Gallery</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { type: 'Phone', seat: 'B3', time: '14:23', img: 'https://picsum.photos/seed/ev1/200' },
                  { type: 'Chit', seat: 'D5', time: '14:35', img: 'https://picsum.photos/seed/ev2/200' },
                  { type: 'Textbook', seat: 'A2', time: '15:02', img: 'https://picsum.photos/seed/ev3/200' },
                  { type: 'Phone', seat: 'C1', time: '15:18', img: 'https://picsum.photos/seed/ev4/200' },
                ].map((ev, i) => (
                  <motion.div
                    key={i}
                    whileHover={{ scale: 1.05 }}
                    className="clay-card p-2 bg-white cursor-pointer group"
                  >
                    <div className="aspect-square rounded-xl overflow-hidden mb-2 relative">
                      <img src={ev.img} className="w-full h-full object-cover" alt="Evidence" />
                      <div className="absolute inset-0 bg-[#6C5CE7]/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Eye className="text-white" size={24} />
                      </div>
                    </div>
                    <div className="px-1">
                      <p className="text-[10px] font-bold text-[#6C5CE7]">{ev.type}</p>
                      <div className="flex justify-between text-[8px] font-bold text-[#636E72] uppercase">
                        <span>Seat {ev.seat}</span>
                        <span>{ev.time}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </section>

            {/* Flagged Students Table */}
            <section>
              <h3 className="text-xs font-bold text-[#636E72] uppercase tracking-[0.2em] mb-4">Flagged Students</h3>
              <div className="clay-card bg-white p-0 overflow-hidden">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-[#F5F0EB]/50 border-b border-[#E8E2DC]">
                      <th className="px-6 py-3 text-[10px] font-bold text-[#636E72] uppercase tracking-wider">Rank</th>
                      <th className="px-6 py-3 text-[10px] font-bold text-[#636E72] uppercase tracking-wider">Seat</th>
                      <th className="px-6 py-3 text-[10px] font-bold text-[#636E72] uppercase tracking-wider">Score</th>
                      <th className="px-6 py-3 text-[10px] font-bold text-[#636E72] uppercase tracking-wider">Items Detected</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E8E2DC]">
                    {[
                      { rank: 1, seat: 'B3', score: 78, items: [<Smartphone size={14} className="text-[#6C5CE7]" />, <Smartphone size={14} className="text-[#6C5CE7]" />] },
                      { rank: 2, seat: 'D5', score: 52, items: [<FileText size={14} className="text-[#FFA502]" />] },
                      { rank: 3, seat: 'A2', score: 45, items: [<BookOpen size={14} className="text-[#FFA502]" />] },
                    ].map((row) => (
                      <tr key={row.rank} className="hover:bg-[#F5F0EB]/20 transition-colors">
                        <td className="px-6 py-3 text-sm mono font-bold text-[#636E72]">{row.rank}</td>
                        <td className="px-6 py-3 text-sm font-bold">{row.seat}</td>
                        <td className="px-6 py-3 text-sm font-bold text-[#FF6B6B] mono">{row.score}</td>
                        <td className="px-6 py-3 flex gap-1">{row.items.map((item, idx) => <span key={idx}>{item}</span>)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </div>

          {/* Footer Actions */}
          <div className="p-8 bg-white border-t border-[#E8E2DC] flex gap-4">
            <ClayButton variant="primary" className="flex-1">
              <Download size={18} /> Download Full Report PDF
            </ClayButton>
            <ClayButton variant="ghost" className="flex-1">
              <Download size={18} /> Download Evidence ZIP
            </ClayButton>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
