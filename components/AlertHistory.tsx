
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Clock, Eye, Bell } from 'lucide-react';
import { ProctorAlert, AlertLevel } from '../types';
import { ClayCard } from './ClayCard';
import { ALERT_LEVEL_COLORS } from '../constants';

interface AlertHistoryProps {
  alerts: ProctorAlert[];
  onNotifyInvigilator?: (alert: ProctorAlert) => void;
}

interface PersonAlert {
  seat: string;
  latestAlert: ProctorAlert;
  alertCount: number;
  history: ProctorAlert[];
}

const groupAlertsByPerson = (alerts: ProctorAlert[]): PersonAlert[] => {
  const grouped = new Map<string, PersonAlert>();
  
  // Sort by timestamp descending (newest first)
  const sortedAlerts = [...alerts].sort((a, b) => 
    b.timestamp.getTime() - a.timestamp.getTime()
  );
  
  sortedAlerts.forEach(alert => {
    if (grouped.has(alert.seat)) {
      const existing = grouped.get(alert.seat)!;
      existing.alertCount++;
      existing.history.push(alert);
    } else {
      grouped.set(alert.seat, {
        seat: alert.seat,
        latestAlert: alert,
        alertCount: 1,
        history: [alert]
      });
    }
  });
  
  return Array.from(grouped.values()).sort((a, b) => 
    b.latestAlert.timestamp.getTime() - a.latestAlert.timestamp.getTime()
  );
};

export const AlertHistory: React.FC<AlertHistoryProps> = ({ alerts, onNotifyInvigilator }) => {
  const personAlerts = React.useMemo(() => groupAlertsByPerson(alerts), [alerts]);
  return (
    <div className="h-full flex flex-col">
      <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
        <AlertTriangle className="text-[#FFA502]" /> Active Alerts
        {personAlerts.length > 0 && (
          <span className="ml-2 px-2 py-0.5 bg-[#6C5CE7] text-white text-xs rounded-full">
            {personAlerts.length} person{personAlerts.length > 1 ? 's' : ''}
          </span>
        )}
      </h2>
      
      <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
        <AnimatePresence initial={false}>
          {personAlerts.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12 text-[#636E72]"
            >
              <div className="w-16 h-16 bg-[#F5F0EB] rounded-full flex items-center justify-center mx-auto mb-4 clay-inset">
                <Clock size={32} />
              </div>
              <p className="text-sm">No incidents recorded yet.</p>
            </motion.div>
          ) : (
            personAlerts.map((personAlert) => (
              <motion.div
                key={personAlert.seat}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                layout
              >
                <div 
                  className={`clay-card p-3 border-l-4 relative overflow-hidden transition-all hover:scale-[1.02]`}
                  style={{ borderColor: ALERT_LEVEL_COLORS[personAlert.latestAlert.level] }}
                >
                  {personAlert.latestAlert.level === AlertLevel.CRITICAL && (
                    <div className="absolute inset-0 bg-red-500/5 animate-pulse pointer-events-none" />
                  )}
                  
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm`} style={{ backgroundColor: `${ALERT_LEVEL_COLORS[personAlert.latestAlert.level]}20` }}>
                        <AlertTriangle size={18} style={{ color: ALERT_LEVEL_COLORS[personAlert.latestAlert.level] }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-bold text-[#2D3436]">Seat {personAlert.seat}</span>
                          {personAlert.alertCount > 1 && (
                            <span className="px-1.5 py-0.5 bg-[#F5F0EB] text-[#636E72] text-[10px] rounded-md">
                              {personAlert.alertCount} alerts
                            </span>
                          )}
                          <span 
                            className="px-1.5 py-0.5 text-[10px] rounded-md font-medium"
                            style={{ 
                              backgroundColor: `${ALERT_LEVEL_COLORS[personAlert.latestAlert.level]}20`,
                              color: ALERT_LEVEL_COLORS[personAlert.latestAlert.level]
                            }}
                          >
                            {personAlert.latestAlert.level}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-[#636E72]">
                          <span className="mono">{personAlert.latestAlert.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
                          <span className="text-[#E8E2DC]">|</span>
                          <span style={{ color: ALERT_LEVEL_COLORS[personAlert.latestAlert.level] }} className="font-medium">
                            {personAlert.latestAlert.type}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 mt-1.5">
                          <span className="text-xs font-bold text-[#2D3436]">Score: {personAlert.latestAlert.score}</span>
                          <span className="text-[10px] text-[#636E72] mono">Conf: {(personAlert.latestAlert.confidence * 100).toFixed(0)}%</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-1">
                      <button 
                        className="w-8 h-8 rounded-lg bg-[#6C5CE7]/10 hover:bg-[#6C5CE7]/20 transition-colors flex items-center justify-center text-[#6C5CE7] shrink-0"
                        onClick={() => onNotifyInvigilator?.(personAlert.latestAlert)}
                        title="Notify invigilator"
                      >
                        <Bell size={14} />
                      </button>
                      <button className="w-8 h-8 rounded-lg bg-[#F5F0EB] hover:bg-[#E8E2DC] transition-colors flex items-center justify-center text-[#636E72] shrink-0 clay-button">
                        <Eye size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
