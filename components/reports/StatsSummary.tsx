
import React from 'react';
import { motion } from 'framer-motion';
import { ClipboardList, AlertTriangle, Smartphone, FileText, BookOpen, Laptop } from 'lucide-react';
import { ClayCard } from '../ClayCard';
import { ProctorAlert } from '../../types';

interface StatsSummaryProps {
  alerts?: ProctorAlert[];
}

interface StatItemProps {
  icon: React.ElementType;
  label: string;
  value: number;
  color: string;
  delay: number;
}

const StatItem: React.FC<StatItemProps> = ({ icon: Icon, label, value, color, delay }) => (
  <ClayCard delay={delay} className="group cursor-default bg-white">
    <div className="flex flex-col items-center text-center">
      <div className="p-3 rounded-2xl mb-3 transition-transform group-hover:scale-110" style={{ backgroundColor: `${color}15` }}>
        <Icon size={24} style={{ color }} />
      </div>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        key={value}
        className="text-3xl font-bold mono mb-1 text-[#2D3436]"
      >
        {value}
      </motion.p>
      <p className="text-[10px] font-bold text-[#636E72] uppercase tracking-widest">{label}</p>
    </div>
  </ClayCard>
);

export const StatsSummary: React.FC<StatsSummaryProps> = ({ alerts = [] }) => {
  const phoneCount = alerts.filter(a => a.type === 'PHONE').length;
  const chitCount = alerts.filter(a => a.type === 'CHIT').length;
  const textbookCount = alerts.filter(a => a.type === 'TEXTBOOK').length;
  const notebookCount = alerts.filter(a => a.type === 'NOTEBOOK').length;
  const deviceCount = alerts.filter(a => a.type === 'DEVICE').length;
  const totalScore = alerts.reduce((sum, a) => sum + (a.score || 0), 0);

  const stats = [
    { icon: ClipboardList, label: 'Total Sessions', value: alerts.length > 0 ? 1 : 0, color: '#6C5CE7' },
    { icon: AlertTriangle, label: 'Total Violations', value: alerts.length, color: '#FF6B6B' },
    { icon: Smartphone, label: 'Phones', value: phoneCount, color: '#6C5CE7' },
    { icon: FileText, label: 'Chits', value: chitCount, color: '#FFA502' },
    { icon: BookOpen, label: 'Books', value: textbookCount + notebookCount, color: '#00B894' },
    { icon: Laptop, label: 'Devices', value: deviceCount, color: '#636E72' },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {stats.map((stat, i) => (
        <StatItem key={stat.label} {...stat} delay={i * 0.05} />
      ))}
    </div>
  );
};
