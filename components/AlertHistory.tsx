
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Clock, Eye } from 'lucide-react';
import { ProctorAlert, AlertLevel } from '../types';
import { ClayCard } from './ClayCard';
import { ALERT_LEVEL_COLORS } from '../constants';

interface AlertHistoryProps {
  alerts: ProctorAlert[];
}

export const AlertHistory: React.FC<AlertHistoryProps> = ({ alerts }) => {
  return (
    <div className="h-full flex flex-col">
      <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
        <AlertTriangle className="text-[#FFA502]" /> Recent Alerts
      </h2>
      
      <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
        <AnimatePresence initial={false}>
          {alerts.length === 0 ? (
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
            alerts.map((alert) => (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                layout
              >
                <div 
                  className={`clay-card p-3 border-l-4 relative overflow-hidden transition-all hover:scale-[1.02]`}
                  style={{ borderColor: ALERT_LEVEL_COLORS[alert.level] }}
                >
                  {alert.level === AlertLevel.CRITICAL && (
                    <div className="absolute inset-0 bg-red-500/5 animate-pulse pointer-events-none" />
                  )}
                  
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 shadow-sm`} style={{ backgroundColor: `${ALERT_LEVEL_COLORS[alert.level]}20` }}>
                        <AlertTriangle size={14} style={{ color: ALERT_LEVEL_COLORS[alert.level] }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-tight text-[#636E72] mb-0.5">
                          <span className="mono">{alert.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
                          <span className="text-[#E8E2DC]">|</span>
                          <span className="text-[#6C5CE7]">Seat {alert.seat}</span>
                          <span className="text-[#E8E2DC]">|</span>
                          <span style={{ color: ALERT_LEVEL_COLORS[alert.level] }}>{alert.type}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-[#2D3436]">Score: {alert.score}</span>
                          <span className="text-[10px] text-[#636E72] mono">Conf: {(alert.confidence * 100).toFixed(0)}%</span>
                        </div>
                      </div>
                    </div>
                    
                    <button className="w-8 h-8 rounded-lg bg-[#F5F0EB] hover:bg-[#E8E2DC] transition-colors flex items-center justify-center text-[#636E72] shrink-0 clay-button">
                      <Eye size={14} />
                    </button>
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
