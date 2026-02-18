
import React, { useState, useMemo } from 'react';
import { Search, Calendar, Clock, ChevronRight, FileText, Download, Eye, Smartphone, ClipboardList, BookOpen, Laptop } from 'lucide-react';
import { ClayCard } from '../components/ClayCard';
import { ClayButton } from '../components/ClayButton';
import { StatsSummary } from '../components/reports/StatsSummary';
import { SimpleCharts } from '../components/reports/SimpleCharts';
import { SessionDetailModal } from '../components/reports/SessionDetailModal';
import { motion, AnimatePresence } from 'framer-motion';
import { ProctorAlert, DetectionType } from '../types';

interface ExamSession {
  id: string;
  name: string;
  date: string;
  duration: string;
  alerts: number;
  students: number;
  detections: {
    phone: number;
    chit: number;
    textbook: number;
    notebook: number;
    device: number;
    headTurn: number;
    leaning: number;
    multiplePeople: number;
    noPerson: number;
    [key: string]: number;
  };
  alertData: ProctorAlert[];
  totalScore: number;
  avgConfidence: number;
  highSeverityCount: number;
}

interface ReportsViewProps {
  alerts: ProctorAlert[];
}

const TYPE_TO_KEY: Record<DetectionType, string> = {
  PHONE: 'phone',
  CHIT: 'chit',
  TEXTBOOK: 'textbook',
  NOTEBOOK: 'notebook',
  DEVICE: 'device',
  HEAD_TURN: 'headTurn',
  LEANING: 'leaning',
  MULTIPLE_PEOPLE: 'multiplePeople',
  NO_PERSON: 'noPerson'
};

export const ReportsView: React.FC<ReportsViewProps> = ({ alerts }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSession, setSelectedSession] = useState<ExamSession | null>(null);

  // Generate session data from live alerts — real-time accurate values
  const sessions: ExamSession[] = useMemo(() => {
    if (alerts.length === 0) return [];

    const today = new Date().toLocaleDateString();

    // Count detections by type accurately
    const detections: Record<string, number> = {
      phone: 0,
      chit: 0,
      textbook: 0,
      notebook: 0,
      device: 0,
      headTurn: 0,
      leaning: 0,
      multiplePeople: 0,
      noPerson: 0
    };

    let totalScore = 0;
    let totalConfidence = 0;
    let highSeverityCount = 0;

    alerts.forEach(alert => {
      const key = TYPE_TO_KEY[alert.type];
      if (key) {
        detections[key]++;
      }
      totalScore += alert.score || 0;
      totalConfidence += alert.confidence || 0;
      if (alert.level === 'HIGH' || alert.level === 'CRITICAL') {
        highSeverityCount++;
      }
    });

    // Unique seats (students)
    const uniqueSeats = new Set(alerts.map(a => a.seat));

    // Duration
    const sortedAlerts = [...alerts].sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
    const startTime = sortedAlerts[0]?.timestamp || new Date();
    const endTime = sortedAlerts[sortedAlerts.length - 1]?.timestamp || new Date();
    const durationMs = endTime.getTime() - startTime.getTime();
    const durationMins = Math.floor(durationMs / 60000);
    const durationSecs = Math.floor((durationMs % 60000) / 1000);
    const durationStr = durationMins > 0 ? `${durationMins}m ${durationSecs}s` : `${durationSecs}s`;

    return [{
      id: 'live-session',
      name: `Live Session - ${today}`,
      date: today,
      duration: durationStr,
      alerts: alerts.length,
      students: uniqueSeats.size,
      detections,
      alertData: alerts,
      totalScore,
      avgConfidence: alerts.length > 0 ? totalConfidence / alerts.length : 0,
      highSeverityCount
    }];
  }, [alerts]);

  const filteredSessions = sessions.filter(s =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Compute object-only violations (no behavioral)
  const objectViolations = useMemo(() => {
    return alerts.filter(a => ['PHONE', 'CHIT', 'TEXTBOOK', 'NOTEBOOK', 'DEVICE'].includes(a.type));
  }, [alerts]);

  const behaviorViolations = useMemo(() => {
    return alerts.filter(a => ['HEAD_TURN', 'LEANING', 'MULTIPLE_PEOPLE'].includes(a.type));
  }, [alerts]);

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
      <StatsSummary alerts={alerts} />

      {/* Charts Section */}
      <SimpleCharts alerts={alerts} />

      {/* Quick Stats Row */}
      {alerts.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <ClayCard className="bg-white p-4 text-center">
            <p className="text-[10px] font-bold text-[#636E72] uppercase tracking-wider mb-1">Total Points</p>
            <p className="text-2xl font-bold mono text-[#FF6B6B]">
              {alerts.reduce((sum, a) => sum + (a.score || 0), 0)}
            </p>
          </ClayCard>
          <ClayCard className="bg-white p-4 text-center">
            <p className="text-[10px] font-bold text-[#636E72] uppercase tracking-wider mb-1">Object Violations</p>
            <p className="text-2xl font-bold mono text-[#6C5CE7]">{objectViolations.length}</p>
          </ClayCard>
          <ClayCard className="bg-white p-4 text-center">
            <p className="text-[10px] font-bold text-[#636E72] uppercase tracking-wider mb-1">Behavior Flags</p>
            <p className="text-2xl font-bold mono text-[#FFA502]">{behaviorViolations.length}</p>
          </ClayCard>
          <ClayCard className="bg-white p-4 text-center">
            <p className="text-[10px] font-bold text-[#636E72] uppercase tracking-wider mb-1">Avg Confidence</p>
            <p className="text-2xl font-bold mono text-[#00B894]">
              {alerts.length > 0 ? (alerts.reduce((s, a) => s + a.confidence, 0) / alerts.length * 100).toFixed(0) : 0}%
            </p>
          </ClayCard>
        </div>
      )}

      {/* Session History Section */}
      <section className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h3 className="text-2xl font-bold text-[#2D3436] flex items-center gap-2">
            <ClipboardList className="text-[#6C5CE7]" /> Exam Sessions
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
                <p className="text-sm text-[#636E72] mt-1">Start monitoring to see live data here.</p>
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
                        <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-tighter ${session.alerts > 5 ? 'bg-[#FF6B6B]/10 text-[#FF6B6B]' :
                            session.alerts > 0 ? 'bg-[#FFA502]/10 text-[#FFA502]' :
                              'bg-[#00B894]/10 text-[#00B894]'
                          }`}>
                          {session.alerts} Alerts
                        </div>
                      </div>

                      <div className="grid grid-cols-4 gap-3 mb-6">
                        <div className="clay-inset p-3 text-center">
                          <p className="text-[8px] font-bold text-[#636E72] uppercase mb-1">Students</p>
                          <p className="text-lg font-bold mono text-[#2D3436]">{session.students}</p>
                        </div>
                        <div className="clay-inset p-3 text-center">
                          <p className="text-[8px] font-bold text-[#636E72] uppercase mb-1">Violations</p>
                          <p className="text-lg font-bold mono text-[#FF6B6B]">
                            {session.alerts}
                          </p>
                        </div>
                        <div className="clay-inset p-3 text-center">
                          <p className="text-[8px] font-bold text-[#636E72] uppercase mb-1">Score</p>
                          <p className="text-lg font-bold mono text-[#6C5CE7]">{session.totalScore}</p>
                        </div>
                        <div className="clay-inset p-3 text-center">
                          <p className="text-[8px] font-bold text-[#636E72] uppercase mb-1">Status</p>
                          <p className="text-[10px] font-bold text-[#2D3436] pt-2">{session.alerts === 0 ? 'CLEAR' : session.highSeverityCount > 0 ? 'FLAGGED' : 'CAUTION'}</p>
                        </div>
                      </div>

                      {/* Detection breakdown — no earphones/watches */}
                      <div className="flex items-center gap-4 text-[10px] font-bold text-[#636E72] uppercase border-t border-[#E8E2DC] pt-4">
                        <div className="flex items-center gap-1"><Smartphone size={12} /> {session.detections.phone} Phones</div>
                        <div className="flex items-center gap-1"><FileText size={12} /> {session.detections.chit} Chits</div>
                        <div className="flex items-center gap-1"><BookOpen size={12} /> {session.detections.textbook + session.detections.notebook} Books</div>
                        <div className="flex items-center gap-1"><Laptop size={12} /> {session.detections.device} Devices</div>
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
