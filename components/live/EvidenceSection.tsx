import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Clock, AlertTriangle, ChevronDown, ChevronUp, Maximize2, X, Bell, Send, Settings, Check } from 'lucide-react';
import { ProctorAlert, DetectionType, AlertLevel } from '../../types';
import { ClayCard } from '../ClayCard';
import { ClayButton } from '../ClayButton';
import { ALERT_LEVEL_COLORS } from '../../constants';
import { NotificationPanel } from '../NotificationPanel';
import { sendViolationAlert } from '../../services/notificationService';

interface EvidenceSectionProps {
  alerts: ProctorAlert[];
}

interface EvidenceItem {
  type: DetectionType;
  alerts: ProctorAlert[];
  latestTimestamp: Date;
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

const groupAlertsByType = (alerts: ProctorAlert[]): EvidenceItem[] => {
  const grouped = new Map<DetectionType, ProctorAlert[]>();

  alerts.forEach(alert => {
    if (!grouped.has(alert.type)) {
      grouped.set(alert.type, []);
    }
    grouped.get(alert.type)!.push(alert);
  });

  return Array.from(grouped.entries())
    .map(([type, typeAlerts]) => ({
      type,
      alerts: typeAlerts.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()),
      latestTimestamp: typeAlerts[0].timestamp,
      count: typeAlerts.length
    }))
    .sort((a, b) => b.latestTimestamp.getTime() - a.latestTimestamp.getTime());
};

export const EvidenceSection: React.FC<EvidenceSectionProps> = ({ alerts }) => {
  const [expandedType, setExpandedType] = React.useState<DetectionType | null>(null);
  const [fullscreenAlert, setFullscreenAlert] = React.useState<ProctorAlert | null>(null);
  const [notificationAlert, setNotificationAlert] = React.useState<ProctorAlert | null>(null);

  // Auto-notification state
  const [autoNotifyEmail, setAutoNotifyEmail] = React.useState<string>('');
  const [autoNotifyEnabled, setAutoNotifyEnabled] = React.useState<boolean>(false);
  const [pendingNotifications, setPendingNotifications] = React.useState<ProctorAlert[]>([]);
  const [sentNotifications, setSentNotifications] = React.useState<Set<string>>(new Set());
  const [sending, setSending] = React.useState<Set<string>>(new Set());

  const evidenceItems = React.useMemo(() => groupAlertsByType(alerts), [alerts]);

  // Handle sending notification with auto-filled data
  const handleSendNotification = async (alert: ProctorAlert) => {
    if (!autoNotifyEmail) return;

    setSending(prev => new Set([...prev, alert.id]));

    const subject = `VIOLATION ALERT: ${TYPE_LABELS[alert.type]} detected at Seat ${alert.seat}`;
    const message = `A violation has been detected during the exam.

Violation Details:
• Type: ${TYPE_LABELS[alert.type]}
• Seat: ${alert.seat}
• Time: ${alert.timestamp.toLocaleString()}
• Confidence: ${(alert.confidence * 100).toFixed(0)}%
• Severity: ${alert.level}

Please take appropriate action immediately.

---
Sent by ProctorAI Automated Monitoring System`;

    try {
      const result = await sendViolationAlert(
        [autoNotifyEmail],
        TYPE_LABELS[alert.type],
        alert.seat,
        alert.confidence
      );

      if (result.success) {
        setSentNotifications(prev => new Set([...prev, alert.id]));
        setTimeout(() => {
          setPendingNotifications(prev => prev.filter(p => p.id !== alert.id));
        }, 3000);
      } else {
        window.alert('Failed to send notification: ' + result.error);
      }
    } catch (error) {
      window.alert('Error sending notification');
    } finally {
      setSending(prev => {
        const next = new Set(prev);
        next.delete(alert.id);
        return next;
      });
    }
  };

  // Auto-add new alerts to pending notifications (grouped by seat+type)
  React.useEffect(() => {
    if (autoNotifyEnabled && autoNotifyEmail) {
      // Group alerts by seat+type to avoid duplicates
      const alertsBySeatType = new Map<string, ProctorAlert[]>();

      alerts.forEach(alert => {
        const key = `${alert.seat}-${alert.type}`;
        if (!alertsBySeatType.has(key)) {
          alertsBySeatType.set(key, []);
        }
        alertsBySeatType.get(key)!.push(alert);
      });

      // Get latest alert for each seat+type combination
      const groupedAlerts: ProctorAlert[] = [];
      alertsBySeatType.forEach((alertsForSeatType, key) => {
        // Sort by timestamp descending and take the latest
        const latest = alertsForSeatType.sort((a, b) =>
          b.timestamp.getTime() - a.timestamp.getTime()
        )[0];

        // Only add if not already sent or pending
        const alreadySent = sentNotifications.has(latest.id);
        const alreadyPending = pendingNotifications.find(p => p.seat === latest.seat && p.type === latest.type);

        if (!alreadySent && !alreadyPending) {
          groupedAlerts.push(latest);
        }
      });

      if (groupedAlerts.length > 0) {
        setPendingNotifications(prev => [...groupedAlerts, ...prev].slice(0, 10));
      }
    }
  }, [alerts, autoNotifyEnabled, autoNotifyEmail, sentNotifications, pendingNotifications]);

  // Get alerts with screenshots
  const alertsWithScreenshots = alerts.filter(a => a.screenshot);

  if (alertsWithScreenshots.length === 0 && evidenceItems.length === 0) {
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
          <p className="text-sm">No violations recorded yet.</p>
          <p className="text-xs mt-1 text-[#636E72]/70">Screenshots will appear here when violations are detected.</p>
        </div>
      </ClayCard>
    );
  }

  return (
    <ClayCard className="bg-white mt-6">
      <h3 className="font-bold text-[#2D3436] mb-4 flex items-center gap-2">
        <Camera className="text-[#6C5CE7]" size={20} />
        Evidence Gallery
        {evidenceItems.length > 0 && (
          <span className="ml-2 px-2 py-0.5 bg-[#6C5CE7] text-white text-xs rounded-full">
            {evidenceItems.length} type{evidenceItems.length > 1 ? 's' : ''}
          </span>
        )}
      </h3>

      <div className="space-y-3">
        <AnimatePresence>
          {evidenceItems.map((item) => (
            <motion.div
              key={item.type}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="border border-[#E8E2DC] rounded-xl overflow-hidden"
            >
              {/* Header - Clickable */}
              <button
                onClick={() => setExpandedType(expandedType === item.type ? null : item.type)}
                className="w-full flex items-center justify-between p-3 bg-[#F5F0EB]/50 hover:bg-[#F5F0EB] transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: `${ALERT_LEVEL_COLORS[item.alerts[0].level]}20` }}
                  >
                    <AlertTriangle
                      size={18}
                      style={{ color: ALERT_LEVEL_COLORS[item.alerts[0].level] }}
                    />
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-sm text-[#2D3436]">
                      {TYPE_LABELS[item.type]}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-[#636E72]">
                      <span className="flex items-center gap-1">
                        <Clock size={12} />
                        {item.latestTimestamp.toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                          second: '2-digit'
                        })}
                      </span>
                      <span className="text-[#E8E2DC]">|</span>
                      <span>{item.count} incident{item.count > 1 ? 's' : ''}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className="text-xs font-bold px-2 py-1 rounded-full"
                    style={{
                      backgroundColor: `${ALERT_LEVEL_COLORS[item.alerts[0].level]}20`,
                      color: ALERT_LEVEL_COLORS[item.alerts[0].level]
                    }}
                  >
                    {item.alerts[0].level}
                  </span>
                  {expandedType === item.type ? (
                    <ChevronUp size={20} className="text-[#636E72]" />
                  ) : (
                    <ChevronDown size={20} className="text-[#636E72]" />
                  )}
                </div>
              </button>

              {/* Expanded Content */}
              <AnimatePresence>
                {expandedType === item.type && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="p-3 bg-white border-t border-[#E8E2DC]">
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                        {item.alerts
                          .filter(alert => alert.screenshot)
                          .slice(0, 8)
                          .map((alert, idx) => (
                            <div
                              key={alert.id}
                              className="relative aspect-video bg-[#2D3436] rounded-lg overflow-hidden group cursor-pointer"
                              onClick={() => setFullscreenAlert(alert)}
                            >
                              {alert.screenshot ? (
                                <img
                                  src={`data:image/jpeg;base64,${alert.screenshot}`}
                                  alt={`Violation at ${alert.timestamp.toLocaleTimeString()}`}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-white/50">
                                  <Camera size={20} />
                                </div>
                              )}
                              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                                <div className="absolute bottom-2 left-2 right-2">
                                  <p className="text-[10px] text-white font-medium">
                                    {alert.timestamp.toLocaleTimeString([], {
                                      hour: '2-digit',
                                      minute: '2-digit',
                                      second: '2-digit'
                                    })}
                                  </p>
                                  <p className="text-[9px] text-white/80">
                                    Seat {alert.seat} • {(alert.confidence * 100).toFixed(0)}%
                                  </p>
                                </div>
                              </div>
                              <div className="absolute top-2 right-2 flex gap-1">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setFullscreenAlert(alert);
                                  }}
                                  className="w-6 h-6 bg-white/90 hover:bg-white rounded flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                  <Maximize2 size={12} className="text-[#2D3436]" />
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setNotificationAlert(alert);
                                  }}
                                  className="w-6 h-6 bg-[#6C5CE7]/90 hover:bg-[#6C5CE7] rounded flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                  <Bell size={12} className="text-white" />
                                </button>
                                <span
                                  className="text-[8px] font-bold px-1.5 py-0.5 rounded"
                                  style={{
                                    backgroundColor: ALERT_LEVEL_COLORS[alert.level],
                                    color: 'white'
                                  }}
                                >
                                  {idx + 1}
                                </span>
                              </div>
                            </div>
                          ))}
                        {item.alerts.filter(a => a.screenshot).length === 0 && (
                          <div className="col-span-full py-4 text-center text-[#636E72] text-sm">
                            No screenshots captured for this violation type.
                          </div>
                        )}
                      </div>
                      {item.alerts.filter(a => a.screenshot).length > 8 && (
                        <p className="text-xs text-[#636E72] mt-2 text-center">
                          +{item.alerts.filter(a => a.screenshot).length - 8} more screenshots
                        </p>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Auto-Notification Section */}
      <div className="mt-6 pt-6 border-t-2 border-[#E8E2DC]">
        <div className="flex items-center gap-2 mb-4">
          <Settings className="text-[#6C5CE7]" size={20} />
          <h3 className="font-bold text-[#2D3436]">Auto-Notification</h3>
          <span className="text-xs text-[#636E72] ml-2">(Sent automatically when violations detected)</span>
        </div>

        {/* Email Settings */}
        <div className="flex items-center gap-3 mb-4 p-3 bg-[#F5F0EB] rounded-xl">
          <input
            type="text"
            inputMode="email"
            placeholder="Enter invigilator email..."
            value={autoNotifyEmail}
            onChange={(e) => setAutoNotifyEmail(e.target.value)}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck="false"
            data-lpignore="true"
            data-form-type="other"
            onFocus={(e) => e.target.setAttribute('readonly', 'true')}
            onBlur={(e) => e.target.removeAttribute('readonly')}
            onClick={(e) => (e.target as HTMLInputElement).removeAttribute('readonly')}
            className="flex-1 px-3 py-2 rounded-lg border border-[#E8E2DC] text-sm focus:outline-none focus:border-[#6C5CE7] min-w-[200px]"
          />
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={autoNotifyEnabled}
              onChange={(e) => setAutoNotifyEnabled(e.target.checked)}
              className="w-4 h-4 accent-[#6C5CE7]"
            />
            <span className="text-sm text-[#2D3436]">Auto-send</span>
          </label>
        </div>

        {/* Pending Notifications */}
        {pendingNotifications.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-[#636E72] mb-2">
              Pending Notifications ({pendingNotifications.length})
            </h4>
            <AnimatePresence>
              {pendingNotifications.map((alert) => (
                <motion.div
                  key={alert.id}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: 100 }}
                  className="flex items-center gap-3 p-3 bg-white border border-[#E8E2DC] rounded-xl"
                >
                  <div className="w-10 h-10 rounded-lg bg-[#FF6B6B]/10 flex items-center justify-center shrink-0">
                    <AlertTriangle size={16} className="text-[#FF6B6B]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[#2D3436] truncate">
                      {TYPE_LABELS[alert.type]} - Seat {alert.seat}
                    </p>
                    <p className="text-xs text-[#636E72]">
                      {alert.timestamp.toLocaleTimeString()} • {(alert.confidence * 100).toFixed(0)}% confidence
                    </p>
                  </div>
                  <button
                    onClick={() => handleSendNotification(alert)}
                    disabled={sending.has(alert.id) || sentNotifications.has(alert.id)}
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${sentNotifications.has(alert.id)
                        ? 'bg-green-100 text-green-700 cursor-default'
                        : sending.has(alert.id)
                          ? 'bg-gray-100 text-gray-500 cursor-wait'
                          : 'bg-[#6C5CE7] text-white hover:bg-[#5b4dd1]'
                      }`}
                  >
                    {sentNotifications.has(alert.id) ? (
                      <>
                        <Check size={14} />
                        Sent
                      </>
                    ) : sending.has(alert.id) ? (
                      <>
                        <Clock size={14} className="animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send size={14} />
                        Send
                      </>
                    )}
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {autoNotifyEnabled && autoNotifyEmail && pendingNotifications.length === 0 && (
          <div className="text-center py-4 text-[#636E72] text-sm">
            <Check size={24} className="mx-auto mb-2 text-green-500" />
            All violations have been notified. New violations will appear here automatically.
          </div>
        )}
      </div>

      {/* Fullscreen Modal */}
      <AnimatePresence>
        {fullscreenAlert && fullscreenAlert.screenshot && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black flex items-center justify-center"
            style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}
            onClick={() => setFullscreenAlert(null)}
          >
            {/* Close Button - Top Right, More Prominent */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setFullscreenAlert(null);
              }}
              className="fixed top-4 right-4 z-[9999] w-14 h-14 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center text-white shadow-lg transition-all hover:scale-110 border-2 border-white"
            >
              <X size={32} strokeWidth={3} />
            </button>

            {/* Notify Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setNotificationAlert(fullscreenAlert);
              }}
              className="fixed top-4 right-20 z-[9999] w-14 h-14 bg-[#6C5CE7] hover:bg-[#5b4dd1] rounded-full flex items-center justify-center text-white shadow-lg transition-all hover:scale-110"
            >
              <Bell size={28} />
            </button>

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-6xl px-4"
              onClick={e => e.stopPropagation()}
            >
              {/* Image */}
              <div className="bg-[#2D3436] rounded-xl overflow-hidden shadow-2xl">
                <img
                  src={`data:image/jpeg;base64,${fullscreenAlert.screenshot}`}
                  alt="Evidence screenshot"
                  className="w-full max-h-[80vh] object-contain mx-auto"
                />
              </div>

              {/* Metadata overlay */}
              <div className="mt-4 bg-white rounded-xl p-4 shadow-lg">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div className="flex items-center gap-6 flex-wrap">
                    <div>
                      <p className="text-xs text-[#636E72] mb-0.5">Violation Type</p>
                      <p className="text-sm font-bold text-[#2D3436]">
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

      {/* Notification Panel */}
      <NotificationPanel
        isOpen={!!notificationAlert}
        onClose={() => setNotificationAlert(null)}
        violationType={notificationAlert ? TYPE_LABELS[notificationAlert.type] : undefined}
        seat={notificationAlert?.seat}
        confidence={notificationAlert?.confidence}
      />
    </ClayCard>
  );
};
