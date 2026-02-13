
import React from 'react';
import { ClayCard } from '../ClayCard';
import { ProctorAlert, AlertLevel } from '../../types';
import { ALERT_LEVEL_COLORS } from '../../constants';

interface ScoreTableProps {
  alerts: ProctorAlert[];
}

export const ScoreTable: React.FC<ScoreTableProps> = ({ alerts }) => {
  // Aggregate scores by seat
  const aggregated = alerts.reduce((acc, alert) => {
    if (!acc[alert.seat] || acc[alert.seat].score < alert.score) {
      acc[alert.seat] = { seat: alert.seat, score: alert.score, level: alert.level };
    }
    return acc;
  }, {} as Record<string, { seat: string, score: number, level: AlertLevel }>);

  const ranked = Object.values(aggregated).sort((a, b) => b.score - a.score).slice(0, 5);

  return (
    <ClayCard className="bg-white">
      <h3 className="font-bold text-[#2D3436] mb-4">Top Flagged Students</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="text-[10px] font-bold text-[#636E72] uppercase tracking-wider border-b border-[#E8E2DC]">
              <th className="pb-3 pr-2">Rank</th>
              <th className="pb-3 pr-2">Seat</th>
              <th className="pb-3 pr-2">Score</th>
              <th className="pb-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E8E2DC]">
            {ranked.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-8 text-center text-[#636E72] text-sm italic">No data yet</td>
              </tr>
            ) : (
              ranked.map((r, i) => (
                <tr key={r.seat} className="hover:bg-[#F5F0EB]/30 transition-colors">
                  <td className="py-3 text-sm mono font-bold text-[#636E72]">{i + 1}</td>
                  <td className="py-3 text-sm font-bold text-[#2D3436]">{r.seat}</td>
                  <td className="py-3 text-sm mono font-bold text-[#6C5CE7]">{r.score}</td>
                  <td className="py-3">
                    <span 
                      className="text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-tighter"
                      style={{ 
                        backgroundColor: `${ALERT_LEVEL_COLORS[r.level]}20`, 
                        color: ALERT_LEVEL_COLORS[r.level] 
                      }}
                    >
                      {r.level}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </ClayCard>
  );
};
