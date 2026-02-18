import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { ClayCard } from '../ClayCard';
import { ProctorAlert, DetectionType } from '../../types';

interface SimpleChartsProps {
  alerts?: ProctorAlert[];
}

const TYPE_COLORS: Record<string, string> = {
  PHONE: '#6C5CE7',
  CHIT: '#FFA502',
  TEXTBOOK: '#FF6B6B',
  NOTEBOOK: '#74B9FF',
  DEVICE: '#A29BFE',
  HEAD_TURN: '#FD79A8',
  LEANING: '#FDCB6E',
  MULTIPLE_PEOPLE: '#E17055',
  NO_PERSON: '#636E72'
};

const TYPE_LABELS: Record<string, string> = {
  PHONE: 'Phones',
  CHIT: 'Chits',
  TEXTBOOK: 'Textbooks',
  NOTEBOOK: 'Notebooks',
  DEVICE: 'Devices',
  HEAD_TURN: 'Head Turns',
  LEANING: 'Leaning',
  MULTIPLE_PEOPLE: 'Multiple People',
  NO_PERSON: 'No Person'
};

export const SimpleCharts: React.FC<SimpleChartsProps> = ({ alerts = [] }) => {
  // Calculate distribution data
  const distribution = useMemo(() => {
    const counts: Record<string, number> = {};
    alerts.forEach(alert => {
      counts[alert.type] = (counts[alert.type] || 0) + 1;
    });
    return counts;
  }, [alerts]);

  const totalAlerts = alerts.length;
  const hasData = totalAlerts > 0;

  // Get top 4 violation types for display
  const topTypes = Object.entries(distribution)
    .sort(([, a], [, b]) => (b as number) - (a as number))
    .slice(0, 4);

  // Calculate donut chart segments
  const calculateDonutSegments = () => {
    if (!hasData) return [];

    const circumference = 2 * Math.PI * 40; // radius = 40
    let currentOffset = 0;

    return topTypes.map(([type, count]) => {
      const percentage = (count as number) / totalAlerts;
      const dashLength = percentage * circumference;
      const segment = {
        type,
        color: TYPE_COLORS[type] || '#636E72',
        dashLength,
        offset: -currentOffset,
        percentage: Math.round(percentage * 100)
      };
      currentOffset += dashLength;
      return segment;
    });
  };

  const donutSegments = calculateDonutSegments();

  // Generate time series data (group by minute)
  const timeSeriesData = useMemo(() => {
    if (alerts.length === 0) return [];

    const sorted = [...alerts].sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
    const startTime = sorted[0].timestamp.getTime();
    const endTime = sorted[sorted.length - 1].timestamp.getTime();
    const duration = endTime - startTime;

    // Create 5 time buckets
    const buckets = 5;
    const bucketSize = duration / buckets || 60000; // default 1 min if no duration

    const counts = new Array(buckets).fill(0);
    sorted.forEach(alert => {
      const bucketIndex = Math.min(
        Math.floor((alert.timestamp.getTime() - startTime) / bucketSize),
        buckets - 1
      );
      counts[bucketIndex]++;
    });

    return counts;
  }, [alerts]);

  // Generate line chart path
  const generateLinePath = () => {
    if (timeSeriesData.length === 0) return '';

    const maxValue = Math.max(...timeSeriesData, 1);
    const width = 380;
    const height = 160;
    const padding = 20;

    const points = timeSeriesData.map((value, index) => {
      const x = padding + (index / (timeSeriesData.length - 1 || 1)) * (width - 2 * padding);
      const y = height - padding - (value / maxValue) * (height - 2 * padding);
      return `${x},${y}`;
    });

    return `M ${points.join(' L ')}`;
  };

  const linePath = generateLinePath();

  // Time labels
  const getTimeLabels = () => {
    if (alerts.length === 0) return ['--', '--', '--', '--', '--'];

    const sorted = [...alerts].sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
    const start = sorted[0].timestamp;
    const end = sorted[sorted.length - 1].timestamp;
    const duration = end.getTime() - start.getTime();

    return [0, 0.25, 0.5, 0.75, 1].map(fraction => {
      const time = new Date(start.getTime() + duration * fraction);
      return time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    });
  };

  const timeLabels = getTimeLabels();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Violation Type Distribution (Donut Chart) */}
      <ClayCard className="bg-white flex flex-col items-center">
        <h3 className="font-bold text-lg mb-8 self-start">Violation Type Distribution</h3>
        <div className="relative w-48 h-48 mb-8">
          <svg viewBox="0 0 100 100" className="transform -rotate-90 w-full h-full">
            {/* Background track */}
            <circle cx="50" cy="50" r="40" fill="transparent" stroke="#F5F0EB" strokeWidth="12" />

            {/* Data segments */}
            {hasData && donutSegments.map((segment, index) => (
              <motion.circle
                key={segment.type}
                cx="50"
                cy="50"
                r="40"
                fill="transparent"
                stroke={segment.color}
                strokeWidth="12"
                strokeDasharray={`${segment.dashLength} ${2 * Math.PI * 40 - segment.dashLength}`}
                strokeDashoffset={segment.offset}
                initial={{ strokeDasharray: `0 ${2 * Math.PI * 40}` }}
                animate={{ strokeDasharray: `${segment.dashLength} ${2 * Math.PI * 40 - segment.dashLength}` }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
              />
            ))}
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <motion.span
              key={totalAlerts}
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-2xl font-bold text-[#2D3436]"
            >
              {totalAlerts}
            </motion.span>
            <span className="text-[8px] font-bold text-[#636E72] uppercase tracking-widest">TOTAL</span>
          </div>
        </div>
        <div className={`grid grid-cols-2 gap-x-8 gap-y-2 w-full max-w-sm px-4 ${!hasData ? 'opacity-40' : ''}`}>
          {(hasData ? topTypes : Object.entries(TYPE_COLORS).slice(0, 4)).map(([type], index) => (
            <div key={type} className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: TYPE_COLORS[type] }} />
              <span className="text-xs font-semibold text-[#636E72]">
                {TYPE_LABELS[type]}: {hasData ? `${donutSegments[index]?.percentage || 0}%` : '0%'}
              </span>
            </div>
          ))}
        </div>
      </ClayCard>

      {/* Violations Over Time (Line Chart) */}
      <ClayCard className="bg-white">
        <h3 className="font-bold text-lg mb-8">Violations Over Time</h3>
        <div className="h-64 relative">
          <svg viewBox="0 0 400 200" className="w-full h-full">
            {/* Grid lines */}
            <line x1="0" y1="180" x2="400" y2="180" stroke="#E8E2DC" strokeWidth="1" />
            <line x1="0" y1="140" x2="400" y2="140" stroke="#E8E2DC" strokeWidth="1" strokeDasharray="4 4" />
            <line x1="0" y1="100" x2="400" y2="100" stroke="#E8E2DC" strokeWidth="1" strokeDasharray="4 4" />
            <line x1="0" y1="60" x2="400" y2="60" stroke="#E8E2DC" strokeWidth="1" strokeDasharray="4 4" />

            {/* Data line */}
            {hasData ? (
              <motion.path
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1, ease: "easeInOut" }}
                d={linePath}
                fill="transparent"
                stroke="#6C5CE7"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            ) : (
              <motion.path
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1, ease: "easeInOut" }}
                d="M 10,180 L 390,180"
                fill="transparent"
                stroke="#E8E2DC"
                strokeWidth="2"
              />
            )}

            {/* Data points */}
            {hasData && timeSeriesData.map((value, index) => {
              const maxValue = Math.max(...timeSeriesData, 1);
              const x = 20 + (index / (timeSeriesData.length - 1 || 1)) * 360;
              const y = 180 - 20 - (value / maxValue) * 140;
              return (
                <motion.circle
                  key={index}
                  cx={x}
                  cy={y}
                  r="5"
                  fill="#6C5CE7"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                />
              );
            })}
          </svg>
          <div className="flex justify-between mt-2 px-1 text-[10px] font-bold text-[#636E72] uppercase tracking-tighter">
            {timeLabels.map((label, index) => (
              <span key={index}>{label}</span>
            ))}
          </div>
        </div>
      </ClayCard>
    </div>
  );
};
