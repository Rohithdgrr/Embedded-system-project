import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bell, AlertTriangle, Check, Clock, Send, Camera, FileText,
  Smartphone, BookOpen, Laptop, RotateCcw, Users, Image,
  ChevronDown, ChevronUp, Mail, Shield, Maximize2, X,
  ZapOff, Zap, Eye, Filter, Activity, Wifi, ShieldCheck, BarChart3
} from 'lucide-react';
import { ProctorAlert, DetectionType, DetectionStats } from '../types';
import { sendComprehensiveViolationReport, sendBrowserNotification } from '../services/notificationService';

// ── Constants ──────────────────────────────────────────────────────────────

const TYPE_COLORS: Record<string, string> = {
  PHONE: '#FF6B6B',
  CHIT: '#00B894',
  TEXTBOOK: '#A29BFE',
  NOTEBOOK: '#FD79A8',
  DEVICE: '#E17055',
  HEAD_TURN: '#00CEC9',
  LEANING: '#0984E3',
  MULTIPLE_PEOPLE: '#FF6B6B',
  NO_PERSON: '#636E72',
};

const TYPE_LABELS: Record<string, string> = {
  PHONE: 'Mobile Phone',
  CHIT: 'Chit / Note',
  TEXTBOOK: 'Textbook',
  NOTEBOOK: 'Notebook',
  DEVICE: 'Electronic Device',
  HEAD_TURN: 'Head Turn',
  LEANING: 'Looking Down',
  MULTIPLE_PEOPLE: 'Multiple People',
  NO_PERSON: 'No Person',
};

const TYPE_EMOJI: Record<string, string> = {
  PHONE: '📱',
  CHIT: '📝',
  TEXTBOOK: '📖',
  NOTEBOOK: '📓',
  DEVICE: '💻',
  HEAD_TURN: '🔄',
  LEANING: '⬇️',
  MULTIPLE_PEOPLE: '👥',
  NO_PERSON: '⚠️',
};

const TYPE_ICONS: Record<string, React.ElementType> = {
  PHONE: Smartphone,
  CHIT: FileText,
  TEXTBOOK: BookOpen,
  NOTEBOOK: FileText,
  DEVICE: Laptop,
  HEAD_TURN: RotateCcw,
  LEANING: ChevronDown,
  MULTIPLE_PEOPLE: Users,
  NO_PERSON: AlertTriangle,
};

const LEVEL_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  CRITICAL: { bg: '#EA2027', text: '#FFFFFF', border: '#EA2027' },
  HIGH: { bg: '#FF6B6B', text: '#FFFFFF', border: '#FF6B6B' },
  MEDIUM: { bg: '#FFA502', text: '#FFFFFF', border: '#FFA502' },
  LOW: { bg: '#6C5CE7', text: '#FFFFFF', border: '#6C5CE7' },
  STABLE: { bg: '#00B894', text: '#FFFFFF', border: '#00B894' },
};

const EMAIL_THRESHOLD = 50;

// ── Interface ──────────────────────────────────────────────────────────────

interface InvigilatorViewProps {
  alerts: ProctorAlert[];
  handleNewAlert: (alert: ProctorAlert) => void;
  integrityScore?: number;
  stats?: DetectionStats;
}

// ── Component ──────────────────────────────────────────────────────────────

export const InvigilatorView: React.FC<InvigilatorViewProps> = ({
  alerts,
  handleNewAlert,
  integrityScore = 100,
  stats
}) => {
  // State
  const [autoNotifyEmail, setAutoNotifyEmail] = useState<string>('');
  const [autoNotifyEnabled, setAutoNotifyEnabled] = useState<boolean>(true);
  const [emailStatus, setEmailStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [emailError, setEmailError] = useState<string>('');
  const [expandedAlerts, setExpandedAlerts] = useState<Set<string>>(new Set());
  const [fullscreenAlert, setFullscreenAlert] = useState<ProctorAlert | null>(null);
  const [filterType, setFilterType] = useState<string>('ALL');
  const [showOnlyEvidence, setShowOnlyEvidence] = useState(false);

  // Track threshold email
  const emailSentRef = useRef<boolean>(false);
  const prevAlertCountRef = useRef<number>(0);

  // ── Computed data ─────────────────────────────────────────────────────

  const totalPoints = React.useMemo(
    () => alerts.reduce((sum, a) => sum + (a.score || 0), 0),
    [alerts]
  );

  const alertStats = React.useMemo(() => {
    const stats: Record<string, number> = {};
    alerts.forEach(a => { stats[a.type] = (stats[a.type] || 0) + 1; });
    return stats;
  }, [alerts]);

  const groupedBySeats = React.useMemo(() => {
    const groups = new Map<string, { alerts: ProctorAlert[]; totalPoints: number }>();
    alerts.forEach(alert => {
      const key = alert.seat || 'unknown';
      if (!groups.has(key)) groups.set(key, { alerts: [], totalPoints: 0 });
      const g = groups.get(key)!;
      g.alerts.push(alert);
      g.totalPoints += alert.score || 0;
    });
    return groups;
  }, [alerts]);

  // Filter alerts
  const filteredAlerts = React.useMemo(() => {
    let list = alerts;
    if (filterType !== 'ALL') list = list.filter(a => a.type === filterType);
    if (showOnlyEvidence) list = list.filter(a => a.screenshot);
    return list;
  }, [alerts, filterType, showOnlyEvidence]);

  // ── Browser notification on new alert ─────────────────────────────────

  useEffect(() => {
    if (alerts.length > prevAlertCountRef.current && alerts.length > 0) {
      const newest = alerts[0];
      sendBrowserNotification(
        `${TYPE_EMOJI[newest.type] || '⚠️'} ${TYPE_LABELS[newest.type] || newest.type}`,
        `Seat ${newest.seat} — ${(newest.confidence * 100).toFixed(0)}% confidence`
      );
    }
    prevAlertCountRef.current = alerts.length;
  }, [alerts]);

  // ── Threshold email (single comprehensive report) ─────────────────────

  useEffect(() => {
    if (!autoNotifyEmail || !autoNotifyEnabled) return;
    if (emailSentRef.current) return;
    if (totalPoints < EMAIL_THRESHOLD) return;

    emailSentRef.current = true;
    setEmailStatus('sending');

    sendComprehensiveViolationReport([autoNotifyEmail], alerts, totalPoints)
      .then(result => {
        if (result.success) {
          setEmailStatus('sent');
        } else {
          setEmailStatus('error');
          setEmailError(result.error || 'Failed to send report');
        }
      })
      .catch(() => {
        setEmailStatus('error');
        setEmailError('Network error sending report');
      });
  }, [totalPoints, autoNotifyEmail, autoNotifyEnabled, alerts]);

  // Reset when email changes
  useEffect(() => {
    emailSentRef.current = false;
    setEmailStatus('idle');
    setEmailError('');
  }, [autoNotifyEmail]);

  // ── Manual send report ────────────────────────────────────────────────

  const handleManualSendReport = useCallback(async () => {
    if (!autoNotifyEmail) {
      setEmailError('Enter an email address first');
      return;
    }
    if (alerts.length === 0) {
      setEmailError('No violations to report');
      return;
    }

    setEmailStatus('sending');
    setEmailError('');

    try {
      const result = await sendComprehensiveViolationReport([autoNotifyEmail], alerts, totalPoints);
      if (result.success) {
        setEmailStatus('sent');
      } else {
        setEmailStatus('error');
        setEmailError(result.error || 'Failed to send');
      }
    } catch {
      setEmailStatus('error');
      setEmailError('Network error');
    }
  }, [autoNotifyEmail, alerts, totalPoints]);

  // ── UI helpers ────────────────────────────────────────────────────────

  const toggleExpanded = (id: string) => {
    setExpandedAlerts(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const thresholdPercent = Math.min(100, (totalPoints / EMAIL_THRESHOLD) * 100);

  // ── Render ────────────────────────────────────────────────────────────

  return (
    <div className="space-y-5">

      {/* ─── Header ─────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#2D3436] flex items-center gap-2">
            <Shield className="text-[#6C5CE7]" size={22} />
            Violation Alerts
          </h2>
          <p className="text-xs sm:text-sm text-[#636E72] mt-1">
            {alerts.length > 0
              ? `${alerts.length} violation${alerts.length > 1 ? 's' : ''} • ${totalPoints} severity points • ${groupedBySeats.size} seat${groupedBySeats.size > 1 ? 's' : ''}`
              : 'Monitoring active — no violations detected yet'
            }
          </p>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <div className={`px-2.5 sm:px-3 py-1.5 rounded-full text-[10px] sm:text-xs font-bold flex items-center gap-1.5 transition-colors ${totalPoints >= EMAIL_THRESHOLD
              ? 'bg-[#FF6B6B]/10 text-[#FF6B6B]'
              : totalPoints >= EMAIL_THRESHOLD * 0.6
                ? 'bg-[#FFA502]/10 text-[#FFA502]'
                : 'bg-[#00B894]/10 text-[#00B894]'
            }`}>
            {totalPoints >= EMAIL_THRESHOLD ? <Zap size={11} /> : <ZapOff size={11} />}
            {totalPoints}/{EMAIL_THRESHOLD} pts
          </div>
          <div className="flex items-center gap-1.5 text-[10px] sm:text-xs text-[#636E72] font-medium">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            Live
          </div>
        </div>
      </div>

      {/* ─── Violation Summary Chips ────────────────────────────────── */}
      {alerts.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {Object.entries(alertStats)
            .sort(([, a]: [string, number], [, b]: [string, number]) => b - a)
            .map(([type, count]) => {
              const Icon = TYPE_ICONS[type] || AlertTriangle;
              const color = TYPE_COLORS[type] || '#636E72';
              return (
                <motion.div
                  key={type}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="flex items-center gap-2 px-3 py-2 bg-white rounded-xl border border-[#E8E2DC] shadow-sm cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => setFilterType(filterType === type ? 'ALL' : type)}
                  style={{ borderColor: filterType === type ? color : undefined }}
                >
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: `${color}15` }}
                  >
                    <Icon size={14} style={{ color }} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#2D3436]">{count}</p>
                    <p className="text-[10px] text-[#636E72]">{TYPE_LABELS[type] || type}</p>
                  </div>
                </motion.div>
              );
            })
          }
        </div>
      )}

      {/* ─── Live Status Dashboard ─────────────────────────────────── */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#E8E2DC]">
        <div className="flex items-center gap-2 mb-4">
          <Activity className="text-[#6C5CE7]" size={18} />
          <h3 className="font-bold text-sm text-[#2D3436]">Live Monitoring Status</h3>
          <span className="flex items-center gap-1.5 text-[10px] text-[#00B894] font-medium ml-auto">
            <span className="w-2 h-2 rounded-full bg-[#00B894] animate-pulse" />
            Receiving live updates from Admin
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
          {/* Integrity Score */}
          <div className="p-3 bg-[#F5F0EB] rounded-xl">
            <div className="flex items-center gap-2 mb-2">
              <ShieldCheck size={14} className="text-[#6C5CE7]" />
              <span className="text-[10px] font-medium text-[#636E72]">Integrity Score</span>
            </div>
            <p className={`text-xl font-bold ${integrityScore > 80 ? 'text-[#00B894]' : integrityScore > 50 ? 'text-[#FFA502]' : 'text-[#FF6B6B]'}`}>
              {integrityScore}%
            </p>
          </div>

          {/* Total Detections */}
          <div className="p-3 bg-[#F5F0EB] rounded-xl">
            <div className="flex items-center gap-2 mb-2">
              <Wifi size={14} className="text-[#6C5CE7]" />
              <span className="text-[10px] font-medium text-[#636E72]">Detections</span>
            </div>
            <p className="text-xl font-bold text-[#2D3436]">
              {stats?.detectedCount || 0}
            </p>
          </div>

          {/* Phone Detections */}
          <div className="p-3 bg-[#F5F0EB] rounded-xl">
            <div className="flex items-center gap-2 mb-2">
              <Smartphone size={14} className="text-[#FF6B6B]" />
              <span className="text-[10px] font-medium text-[#636E72]">Phones</span>
            </div>
            <p className="text-xl font-bold text-[#FF6B6B]">
              {stats?.phone || 0}
            </p>
          </div>

          {/* Device Detections */}
          <div className="p-3 bg-[#F5F0EB] rounded-xl">
            <div className="flex items-center gap-2 mb-2">
              <Laptop size={14} className="text-[#E17055]" />
              <span className="text-[10px] font-medium text-[#636E72]">Devices</span>
            </div>
            <p className="text-xl font-bold text-[#E17055]">
              {stats?.device || 0}
            </p>
          </div>
        </div>

        {/* Behavioral Stats Row - Always Visible */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3 mt-3">
          <div className="p-2 sm:p-2.5 bg-[#00CEC9]/10 rounded-xl flex items-center justify-between">
            <span className="text-[9px] sm:text-[10px] text-[#636E72]">🔄 Head Turns</span>
            <span className="text-sm font-bold text-[#00CEC9]">{stats?.headTurn || 0}</span>
          </div>
          <div className="p-2 sm:p-2.5 bg-[#0984E3]/10 rounded-xl flex items-center justify-between">
            <span className="text-[9px] sm:text-[10px] text-[#636E72]">⬇️ Leaning</span>
            <span className="text-sm font-bold text-[#0984E3]">{stats?.leaning || 0}</span>
          </div>
          <div className="col-span-2 sm:col-span-1 p-2 sm:p-2.5 bg-[#FF6B6B]/10 rounded-xl flex items-center justify-between">
            <span className="text-[9px] sm:text-[10px] text-[#636E72]">👥 Multiple People</span>
            <span className="text-sm font-bold text-[#FF6B6B]">{stats?.multiplePeople || 0}</span>
          </div>
        </div>

        {/* Additional Object Stats Row */}
        {(stats && (stats.chit > 0 || stats.textbook > 0 || stats.notebook > 0)) && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3 mt-2 sm:mt-3">
            {stats.chit > 0 && (
              <div className="p-2.5 bg-[#00B894]/10 rounded-xl flex items-center justify-between">
                <span className="text-[10px] text-[#636E72]">Chits</span>
                <span className="text-sm font-bold text-[#00B894]">{stats.chit}</span>
              </div>
            )}
            {stats.textbook > 0 && (
              <div className="p-2.5 bg-[#A29BFE]/10 rounded-xl flex items-center justify-between">
                <span className="text-[10px] text-[#636E72]">Textbooks</span>
                <span className="text-sm font-bold text-[#A29BFE]">{stats.textbook}</span>
              </div>
            )}
            {stats.notebook > 0 && (
              <div className="p-2.5 bg-[#FD79A8]/10 rounded-xl flex items-center justify-between">
                <span className="text-[10px] text-[#636E72]">Notebooks</span>
                <span className="text-sm font-bold text-[#FD79A8]">{stats.notebook}</span>
              </div>
            )}
          </div>
        )}

        {/* Status Message - Shows behavioral alerts info */}
        <div className="mt-3 p-3 bg-[#6C5CE7]/5 rounded-xl">
          <p className="text-[11px] text-[#636E72] flex items-center gap-2">
            <BarChart3 size={12} className="text-[#6C5CE7]" />
            <span>
              {alerts.length === 0 
                ? 'Monitoring active. No violations detected yet.'
                : `Live feed active. ${alerts.length} violation${alerts.length > 1 ? 's' : ''} detected (${stats?.headTurn || 0} head turns, ${stats?.leaning || 0} leaning, ${stats?.multiplePeople || 0} multiple people).`
              }
            </span>
          </p>
        </div>
      </div>

      {/* ─── Email Settings Card ────────────────────────────────────── */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#E8E2DC]">
        <div className="flex items-center gap-2 mb-3">
          <Mail className="text-[#6C5CE7]" size={18} />
          <h3 className="font-bold text-sm text-[#2D3436]">Email Report Settings</h3>
          <span className="text-[10px] text-[#636E72] ml-1 bg-[#F5F0EB] px-2 py-0.5 rounded-full">
            Single comprehensive report with all violations
          </span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
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
            className="flex-1 px-3 py-2.5 rounded-xl border border-[#E8E2DC] text-sm focus:outline-none focus:border-[#6C5CE7] focus:ring-1 focus:ring-[#6C5CE7]/20 transition-all"
          />
          <div className="flex items-center gap-2 sm:gap-3">
            <label className="flex items-center gap-2 cursor-pointer shrink-0">
              <input
                type="checkbox"
                checked={autoNotifyEnabled}
                onChange={(e) => setAutoNotifyEnabled(e.target.checked)}
                className="w-4 h-4 accent-[#6C5CE7] rounded"
              />
              <span className="text-xs font-medium text-[#2D3436]">Auto-send</span>
            </label>
            <button
              onClick={handleManualSendReport}
              disabled={emailStatus === 'sending' || !autoNotifyEmail || alerts.length === 0}
              className="flex items-center gap-1.5 px-3 sm:px-4 py-2.5 bg-[#6C5CE7] text-white text-xs font-bold rounded-xl hover:bg-[#5b4dd1] disabled:opacity-40 disabled:cursor-not-allowed transition-all shrink-0"
            >
              {emailStatus === 'sending' ? (
                <><Clock size={12} className="animate-spin" /> Sending...</>
              ) : emailStatus === 'sent' ? (
                <><Check size={12} /> Sent</>
              ) : (
                <><Send size={12} /> Send</>
              )}
            </button>
          </div>
        </div>

        {/* Threshold bar */}
        <div className="mt-3">
          <div className="flex justify-between text-[10px] text-[#636E72] mb-1 font-medium">
            <span>Auto-send at {EMAIL_THRESHOLD} points</span>
            <span className="font-bold">{totalPoints} / {EMAIL_THRESHOLD}</span>
          </div>
          <div className="w-full h-1.5 bg-[#F5F0EB] rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${thresholdPercent}%` }}
              transition={{ duration: 0.5 }}
              style={{
                background: totalPoints >= EMAIL_THRESHOLD
                  ? '#FF6B6B'
                  : totalPoints >= EMAIL_THRESHOLD * 0.6
                    ? '#FFA502'
                    : '#6C5CE7'
              }}
            />
          </div>
          {emailStatus === 'sent' && (
            <p className="text-[10px] text-[#00B894] mt-1 flex items-center gap-1 font-medium">
              <Check size={10} /> Comprehensive report sent to {autoNotifyEmail}
            </p>
          )}
          {emailStatus === 'error' && emailError && (
            <p className="text-[10px] text-[#FF6B6B] mt-1 flex items-center gap-1 font-medium">
              <AlertTriangle size={10} /> {emailError}
            </p>
          )}
        </div>
      </div>

      {/* ─── Filter Bar ─────────────────────────────────────────────── */}
      {alerts.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs">
          <div className="flex items-center gap-1.5 text-[#636E72]">
            <Filter size={12} />
            <span className="font-medium">Filter:</span>
          </div>
          <button
            onClick={() => setFilterType('ALL')}
            className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${filterType === 'ALL' ? 'bg-[#6C5CE7] text-white' : 'bg-[#F5F0EB] text-[#636E72] hover:bg-[#E8E2DC]'}`}
          >
            All ({alerts.length})
          </button>
          <button
            onClick={() => setShowOnlyEvidence(!showOnlyEvidence)}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-medium transition-colors ${showOnlyEvidence ? 'bg-[#6C5CE7] text-white' : 'bg-[#F5F0EB] text-[#636E72] hover:bg-[#E8E2DC]'}`}
          >
            <Camera size={10} /> With Evidence
          </button>
          {filterType !== 'ALL' && (
            <button
              onClick={() => setFilterType('ALL')}
              className="text-[#6C5CE7] font-medium hover:underline"
            >
              ✕ Clear filter
            </button>
          )}
        </div>
      )}

      {/* ─── Live Violation Feed with Evidence ──────────────────────── */}
      <div className="bg-white rounded-2xl shadow-sm border border-[#E8E2DC] overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b border-[#E8E2DC]">
          <div className="flex items-center gap-2">
            <Bell className="text-[#6C5CE7]" size={18} />
            <h3 className="font-bold text-sm text-[#2D3436]">Live Violation Feed</h3>
          </div>
          <span className="text-xs text-[#636E72] font-medium">{filteredAlerts.length} showing</span>
        </div>

        {filteredAlerts.length === 0 ? (
          <div className="text-center py-16 text-[#636E72]">
            <div className="w-16 h-16 rounded-2xl bg-[#F5F0EB] flex items-center justify-center mx-auto mb-4">
              <Bell size={28} className="text-[#636E72]/50" />
            </div>
            <p className="font-medium">
              {alerts.length === 0 ? 'No violations detected yet' : 'No violations match current filter'}
            </p>
            <p className="text-xs mt-1 text-[#636E72]/70">
              {alerts.length === 0
                ? 'Violations with evidence screenshots will appear here automatically'
                : 'Try adjusting your filter settings'
              }
            </p>
          </div>
        ) : (
          <div className="divide-y divide-[#E8E2DC] max-h-[700px] overflow-y-auto">
            <AnimatePresence initial={false}>
              {filteredAlerts.map((alert) => {
                const Icon = TYPE_ICONS[alert.type] || AlertTriangle;
                const color = TYPE_COLORS[alert.type] || '#636E72';
                const levelColors = LEVEL_COLORS[alert.level as string] || LEVEL_COLORS.LOW;
                const isExpanded = expandedAlerts.has(alert.id);
                const hasScreenshot = !!alert.screenshot;

                return (
                  <motion.div
                    key={alert.id}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: 50 }}
                    transition={{ duration: 0.25 }}
                  >
                    {/* Alert Row */}
                    <div
                      className="flex flex-col sm:flex-row sm:items-start gap-3 p-4 cursor-pointer hover:bg-[#FAFAF8] transition-colors"
                      onClick={() => toggleExpanded(alert.id)}
                    >
                      <div className="flex items-start gap-3 flex-1">
                        {/* Type Icon */}
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5"
                          style={{ backgroundColor: `${color}15` }}
                        >
                          <Icon size={18} style={{ color }} />
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-sm font-bold text-[#2D3436]">
                              {TYPE_EMOJI[alert.type]} {TYPE_LABELS[alert.type] || alert.type}
                            </span>
                            <span
                              className="px-2 py-0.5 rounded text-[10px] font-bold"
                              style={{
                                backgroundColor: levelColors.bg,
                                color: levelColors.text
                              }}
                            >
                              {alert.level}
                            </span>
                            {hasScreenshot && (
                              <span className="flex items-center gap-0.5 text-[10px] text-[#6C5CE7] font-medium">
                                <Camera size={10} /> Evidence
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-[#636E72] mt-1">
                            Seat <strong>{alert.seat}</strong> • {alert.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })} • {(alert.confidence * 100).toFixed(0)}% conf • <span className="text-[#FF6B6B] font-bold">+{alert.score} pts</span>
                          </p>
                          {/* Inline description preview */}
                          {!isExpanded && alert.description && (
                            <p className="text-[11px] text-[#636E72]/80 mt-1 truncate">{alert.description}</p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-2">
                        {/* Screenshot thumbnail (if available) */}
                        {hasScreenshot && !isExpanded && (
                          <div className="w-20 h-14 rounded-lg overflow-hidden border border-[#E8E2DC] shrink-0 bg-black">
                            <img
                              src={`data:image/jpeg;base64,${alert.screenshot}`}
                              alt="Evidence"
                              className="w-full h-full object-cover opacity-90"
                            />
                          </div>
                        )}

                        {/* Expand chevron */}
                        <div className="shrink-0">
                          {isExpanded
                            ? <ChevronUp size={16} className="text-[#636E72]" />
                            : <ChevronDown size={16} className="text-[#636E72]" />
                          }
                        </div>
                      </div>
                    </div>

                    {/* ── Expanded Evidence + Context ─────────────────── */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <div className="px-4 pb-4 space-y-3">
                            {/* Evidence Screenshot */}
                            {hasScreenshot ? (
                              <div className="relative group">
                                <div className="rounded-xl overflow-hidden border border-[#E8E2DC] bg-black">
                                  <img
                                    src={`data:image/jpeg;base64,${alert.screenshot}`}
                                    alt={`Evidence: ${TYPE_LABELS[alert.type]} at Seat ${alert.seat}`}
                                    className="w-full max-h-64 object-contain"
                                  />
                                </div>
                                {/* Fullscreen button */}
                                <button
                                  onClick={(e) => { e.stopPropagation(); setFullscreenAlert(alert); }}
                                  className="absolute top-2 right-2 w-8 h-8 bg-white/90 hover:bg-white rounded-lg flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                  <Maximize2 size={14} className="text-[#2D3436]" />
                                </button>
                                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3 rounded-b-xl">
                                  <p className="text-white text-[10px] font-medium flex items-center gap-1">
                                    <Camera size={10} /> Captured at {alert.timestamp.toLocaleTimeString()}
                                  </p>
                                </div>
                              </div>
                            ) : (
                              <div className="flex items-center gap-2 text-xs text-[#636E72] bg-[#F5F0EB] p-3 rounded-xl">
                                <Image size={14} />
                                <span>Screenshot not available for this detection</span>
                              </div>
                            )}

                            {/* Metadata Grid */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                              {[
                                { label: 'Violation', value: TYPE_LABELS[alert.type] || alert.type, icon: '📋' },
                                { label: 'Seat', value: alert.seat, icon: '💺' },
                                { label: 'Confidence', value: `${(alert.confidence * 100).toFixed(1)}%`, icon: '🎯' },
                                { label: 'Severity', value: `+${alert.score} pts`, icon: '⚡' }
                              ].map(item => (
                                <div key={item.label} className="bg-[#F5F0EB] rounded-lg p-2.5">
                                  <p className="text-[10px] text-[#636E72] font-medium">{item.icon} {item.label}</p>
                                  <p className="text-xs font-bold text-[#2D3436] mt-0.5">{item.value}</p>
                                </div>
                              ))}
                            </div>

                            {/* Context Description */}
                            {alert.description && (
                              <div className="bg-[#F5F0EB] rounded-xl p-3">
                                <p className="text-[10px] font-bold text-[#636E72] uppercase tracking-wider mb-1">Context</p>
                                <p className="text-xs text-[#2D3436] leading-relaxed">{alert.description}</p>
                                <p className="text-[10px] text-[#636E72] mt-2">
                                  Detected at {alert.timestamp.toLocaleString()}
                                </p>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* ─── Violations by Seat ──────────────────────────────────────── */}
      {groupedBySeats.size > 0 && (
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#E8E2DC]">
          <div className="flex items-center gap-2 mb-4">
            <Users className="text-[#6C5CE7]" size={18} />
            <h3 className="font-bold text-sm text-[#2D3436]">Seats Summary</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {Array.from(groupedBySeats.entries())
              .sort(([, a], [, b]) => b.totalPoints - a.totalPoints)
              .map(([seat, data]) => {
                const types = [...new Set(data.alerts.map(a => a.type))] as string[];
                const evidenceCount = data.alerts.filter(a => a.screenshot).length;

                return (
                  <div key={seat} className="p-4 bg-[#F5F0EB] rounded-xl hover:shadow-sm transition-shadow">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-[#2D3436]">Seat {seat}</span>
                      <span className={`px-2.5 py-0.5 rounded-lg text-xs font-bold ${data.totalPoints >= 50
                          ? 'bg-[#FF6B6B]/10 text-[#FF6B6B]'
                          : data.totalPoints >= 25
                            ? 'bg-[#FFA502]/10 text-[#FFA502]'
                            : 'bg-[#00B894]/10 text-[#00B894]'
                        }`}>
                        {data.totalPoints} pts
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1 mb-2">
                      {types.map((type: string) => (
                        <span
                          key={type}
                          className="text-[10px] px-2 py-0.5 bg-white rounded-full font-medium"
                          style={{ color: TYPE_COLORS[type] || '#636E72' }}
                        >
                          {TYPE_EMOJI[type]} {TYPE_LABELS[type] || type}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-[#636E72]">
                      <span>{data.alerts.length} violation{data.alerts.length > 1 ? 's' : ''}</span>
                      {evidenceCount > 0 && (
                        <span className="flex items-center gap-0.5">
                          <Camera size={9} /> {evidenceCount} screenshot{evidenceCount > 1 ? 's' : ''}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })
            }
          </div>
        </div>
      )}

      {/* ─── Fullscreen Evidence Modal ───────────────────────────────── */}
      <AnimatePresence>
        {fullscreenAlert && fullscreenAlert.screenshot && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4"
            onClick={() => setFullscreenAlert(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-5xl w-full"
              onClick={e => e.stopPropagation()}
            >
              {/* Close */}
              <button
                onClick={() => setFullscreenAlert(null)}
                className="absolute -top-12 right-0 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center text-white transition-colors"
              >
                <X size={24} />
              </button>

              {/* Image */}
              <div className="bg-black rounded-xl overflow-hidden">
                <img
                  src={`data:image/jpeg;base64,${fullscreenAlert.screenshot}`}
                  alt="Full evidence"
                  className="w-full max-h-[75vh] object-contain"
                />
              </div>

              {/* Info bar */}
              <div className="mt-3 bg-white rounded-xl p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
                <div className="grid grid-cols-2 sm:flex sm:items-center gap-3 sm:gap-6">
                  <div>
                    <p className="text-[10px] text-[#636E72]">Violation</p>
                    <p className="text-xs sm:text-sm font-bold text-[#2D3436]">
                      {TYPE_EMOJI[fullscreenAlert.type]} {TYPE_LABELS[fullscreenAlert.type]}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] text-[#636E72]">Seat</p>
                    <p className="text-xs sm:text-sm font-bold text-[#6C5CE7]">{fullscreenAlert.seat}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-[#636E72]">Time</p>
                    <p className="text-xs sm:text-sm font-bold text-[#2D3436]">
                      {fullscreenAlert.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] text-[#636E72]">Confidence</p>
                    <p className="text-xs sm:text-sm font-bold text-[#00B894]">{(fullscreenAlert.confidence * 100).toFixed(0)}%</p>
                  </div>
                </div>
                <span
                  className="px-3 py-1.5 rounded-lg text-xs font-bold self-start sm:self-auto"
                  style={{
                    backgroundColor: `${LEVEL_COLORS[fullscreenAlert.level as string]?.bg || '#636E72'}20`,
                    color: LEVEL_COLORS[fullscreenAlert.level as string]?.bg || '#636E72'
                  }}
                >
                  {fullscreenAlert.level}
                </span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
