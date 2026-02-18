import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Clock, AlertTriangle, ChevronDown, ChevronUp, Maximize2, X, User, Target, Hash } from 'lucide-react';
import { ProctorAlert, DetectionType, AlertLevel } from '../../types';
import { ClayCard } from '../ClayCard';
import { ALERT_LEVEL_COLORS } from '../../constants';

interface EvidenceSectionProps {
  alerts: ProctorAlert[];
}

interface EvidenceItem {
  id: string;
  type: DetectionType;
  alert: ProctorAlert;
  count: number;
}

const TYPE_LABELS: Record<DetectionType, string> = {
  PHONE: 'Phone Detected',
  CHIT: 'Chit/Slip',
  TEXTBOOK: 'Textbook',
  NOTEBOOK: 'Notebook',
  DEVICE: 'Electronic Device',
  HEAD_TURN: 'Head Turn',
  LEANING: 'Leaning',
  MULTIPLE_PEOPLE: 'Multiple People',
  NO_PERSON: 'No Person'
};

const TYPE_ICONS: Record<DetectionType, string> = {
  PHONE: '📱',
  CHIT: '📝',
  TEXTBOOK: '📚',
  NOTEBOOK: '📖',
  DEVICE: '🔌',
  HEAD_TURN: '↩️',
  LEANING: '↗️',
  MULTIPLE_PEOPLE: '👥',
  NO_PERSON: '🚫'
};

// Get only unique violations with screenshots (one per type+seat)
const getEvidenceItems = (alerts: ProctorAlert[]): EvidenceItem[] => {
  const seen = new Set<string>();
  const items: EvidenceItem[] = [];

  // Sort by timestamp descending to get latest first
  const sortedAlerts = [...alerts].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

  sortedAlerts.forEach(alert => {
    if (!alert.screenshot) return;

    const key = `${alert.type}-${alert.seat}`;
    if (seen.has(key)) return;

    seen.add(key);

    // Count total occurrences of this violation type+seat
    const count = alerts.filter(a => a.type === alert.type && a.seat === alert.seat).length;

    items.push({
      id: key,
      type: alert.type,
      alert,
      count
    });
  });

  return items;
};

export const EvidenceSection: React.FC<EvidenceSectionProps> = ({ alerts }) => {
  const [expandedId, setExpandedId] = React.useState<string | null>(null);
  const [fullscreenAlert, setFullscreenAlert] = React.useState<ProctorAlert | null>(null);

  const evidenceItems = React.useMemo(() => getEvidenceItems(alerts), [alerts]);

  if (evidenceItems.length === 0) {
    return (
      <ClayCard className="bg-white mt-6">
        <h3 className="font-bold text-[#2D3436] mb-4 flex items-center gap-2">
          <Camera className="text-[#6C5CE7]" size={20} />
          Evidence Gallery
        </h3>
        <div className="text-center py-8 text-[#636E72]">
          <div className="w-16 h-16 bg-[#F5F0EB] rounded-full flex items-center justify-center mx-auto mb-4">
            <Camera size={24} className="text-[#636E72]" />
          </div>
          <p className="text-sm">No violation screenshots captured yet.</p>
          <p className="text-xs mt-1 text-[#636E72]/70">Screenshots auto-capture once per violation type.</p>
        </div>
      </ClayCard>
    );
  }

  return (
    <ClayCard className="bg-white mt-6">
      <h3 className="font-bold text-[#2D3436] mb-4 flex items-center gap-2">
        <Camera className="text-[#6C5CE7]" size={20} />
        Evidence Gallery
        <span className="ml-2 px-2 py-0.5 bg-[#6C5CE7] text-white text-xs rounded-full">
          {evidenceItems.length}
        </span>
      </h3>

      <div className="space-y-3">
        {evidenceItems.map((item) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="border border-[#E8E2DC] rounded-xl overflow-hidden"
          >
            {/* Header */}
            <button
              onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}
              className="w-full flex items-center justify-between p-3 bg-[#F5F0EB]/50 hover:bg-[#F5F0EB] transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center text-xl shadow-sm">
                  {TYPE_ICONS[item.type]}
                </div>
                <div className="text-left">
                  <p className="font-bold text-sm text-[#2D3436]">
                    {TYPE_LABELS[item.type]}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-[#636E72]">
                    <span className="flex items-center gap-1">
                      <Clock size={12} />
                      {item.alert.timestamp.toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit'
                      })}
                    </span>
                    {item.count > 1 && (
                      <>
                        <span className="text-[#E8E2DC]">|</span>
                        <span>{item.count} detections</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className="text-xs font-bold px-2 py-1 rounded-full"
                  style={{
                    backgroundColor: `${ALERT_LEVEL_COLORS[item.alert.level]}20`,
                    color: ALERT_LEVEL_COLORS[item.alert.level]
                  }}
                >
                  {item.alert.level}
                </span>
                {expandedId === item.id ? (
                  <ChevronUp size={20} className="text-[#636E72]" />
                ) : (
                  <ChevronDown size={20} className="text-[#636E72]" />
                )}
              </div>
            </button>

            {/* Expanded - Single Screenshot with metadata */}
            <AnimatePresence>
              {expandedId === item.id && item.alert.screenshot && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="p-3 bg-white border-t border-[#E8E2DC]">
                    {/* Screenshot with fullscreen button */}
                    <div className="relative aspect-video bg-[#2D3436] rounded-lg overflow-hidden group">
                      <img
                        src={`data:image/jpeg;base64,${item.alert.screenshot}`}
                        alt={`${TYPE_LABELS[item.type]} at ${item.alert.timestamp.toLocaleTimeString()}`}
                        className="w-full h-full object-contain"
                      />
                      <button
                        onClick={() => setFullscreenAlert(item.alert)}
                        className="absolute top-3 right-3 w-10 h-10 bg-white/90 hover:bg-white rounded-lg flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                        title="View Fullscreen"
                      >
                        <Maximize2 size={20} className="text-[#2D3436]" />
                      </button>
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                        <p className="text-white text-xs font-medium">
                          Violation captured at {item.alert.timestamp.toLocaleTimeString()}
                        </p>
                      </div>
                    </div>

                    {/* Metadata */}
                    <div className="mt-3 grid grid-cols-3 gap-2">
                      <div className="bg-[#F5F0EB] rounded-lg p-2 text-center">
                        <User size={14} className="text-[#6C5CE7] mx-auto mb-1" />
                        <p className="text-[10px] text-[#636E72]">Seat</p>
                        <p className="text-xs font-bold text-[#2D3436]">{item.alert.seat}</p>
                      </div>
                      <div className="bg-[#F5F0EB] rounded-lg p-2 text-center">
                        <Target size={14} className="text-[#00B894] mx-auto mb-1" />
                        <p className="text-[10px] text-[#636E72]">Confidence</p>
                        <p className="text-xs font-bold text-[#2D3436]">{(item.alert.confidence * 100).toFixed(0)}%</p>
                      </div>
                      <div className="bg-[#F5F0EB] rounded-lg p-2 text-center">
                        <Hash size={14} className="text-[#FFA502] mx-auto mb-1" />
                        <p className="text-[10px] text-[#636E72]">Score</p>
                        <p className="text-xs font-bold text-[#2D3436]">{item.alert.score}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>

      {/* Fullscreen Modal */}
      <AnimatePresence>
        {fullscreenAlert && fullscreenAlert.screenshot && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
            onClick={() => setFullscreenAlert(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-5xl w-full"
              onClick={e => e.stopPropagation()}
            >
              {/* Close button */}
              <button
                onClick={() => setFullscreenAlert(null)}
                className="absolute -top-12 right-0 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center text-white transition-colors"
              >
                <X size={24} />
              </button>

              {/* Image */}
              <div className="bg-[#2D3436] rounded-xl overflow-hidden">
                <img
                  src={`data:image/jpeg;base64,${fullscreenAlert.screenshot}`}
                  alt="Evidence screenshot"
                  className="w-full max-h-[70vh] object-contain"
                />
              </div>

              {/* Metadata overlay */}
              <div className="mt-4 bg-white rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-6">
                    <div>
                      <p className="text-xs text-[#636E72] mb-0.5">Violation Type</p>
                      <p className="text-sm font-bold text-[#2D3436] flex items-center gap-2">
                        <span className="text-lg">{TYPE_ICONS[fullscreenAlert.type]}</span>
                        {TYPE_LABELS[fullscreenAlert.type]}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-[#636E72] mb-0.5">Seat</p>
                      <p className="text-sm font-bold text-[#6C5CE7]">{fullscreenAlert.seat}</p>
                    </div>
                    <div>
                      <p className="text-xs text-[#636E72] mb-0.5">Time</p>
                      <p className="text-sm font-bold text-[#2D3436]">
                        {fullscreenAlert.timestamp.toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                          second: '2-digit'
                        })}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-[#636E72] mb-0.5">Confidence</p>
                      <p className="text-sm font-bold text-[#00B894]">{(fullscreenAlert.confidence * 100).toFixed(0)}%</p>
                    </div>
                  </div>
                  <span
                    className="px-3 py-1 rounded-lg text-xs font-bold"
                    style={{
                      backgroundColor: `${ALERT_LEVEL_COLORS[fullscreenAlert.level]}20`,
                      color: ALERT_LEVEL_COLORS[fullscreenAlert.level]
                    }}
                  >
                    {fullscreenAlert.level}
                  </span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </ClayCard>
  );
};
