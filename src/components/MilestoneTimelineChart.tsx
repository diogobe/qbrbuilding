import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
} from 'recharts';
import { SuccessMilestone } from '../types';
import { PresentationTheme } from './ThemeConfig';
import { CheckCircle2, Clock, AlertTriangle, Calendar, Layers } from 'lucide-react';

export type TimelineMode = 'both' | 'projected' | 'actual';

interface MilestoneTimelineChartProps {
  milestones: SuccessMilestone[];
  theme: PresentationTheme;
  height?: number;
  compact?: boolean;
}

interface TimelinePoint {
  name: string;
  shortName: string;
  date: string;
  projected: number;
  actual: number;
  milestone?: SuccessMilestone;
  isBaseline?: boolean;
}

export const MilestoneTimelineChart: React.FC<MilestoneTimelineChartProps> = ({
  milestones,
  theme,
  height = 160,
  compact = false,
}) => {
  const [mode, setMode] = useState<TimelineMode>('both');

  // Sort milestones chronologically by dueDate
  const sortedMilestones = useMemo(() => {
    return [...milestones].sort((a, b) => {
      const timeA = new Date(a.dueDate).getTime();
      const timeB = new Date(b.dueDate).getTime();
      if (isNaN(timeA) && isNaN(timeB)) return 0;
      if (isNaN(timeA)) return 1;
      if (isNaN(timeB)) return -1;
      return timeA - timeB;
    });
  }, [milestones]);

  // Compute chart points with cumulative progress
  const chartData: TimelinePoint[] = useMemo(() => {
    if (sortedMilestones.length === 0) return [];

    const total = sortedMilestones.length;
    let accumulatedWeight = 0;

    // Start with a baseline milestone point (Day 0)
    const points: TimelinePoint[] = [
      {
        name: 'Kickoff Baseline',
        shortName: 'Kickoff',
        date: 'Day 0',
        projected: 0,
        actual: 0,
        isBaseline: true,
      },
    ];

    sortedMilestones.forEach((m, idx) => {
      // Weight mapping for actual deliverable progress
      let statusWeight = 0;
      if (m.status === 'Completed') {
        statusWeight = 1.0;
      } else if (m.status === 'In Progress') {
        statusWeight = 0.5;
      } else if (m.status === 'At Risk') {
        statusWeight = 0.15;
      } else {
        // Planned
        statusWeight = 0.0;
      }

      accumulatedWeight += statusWeight;

      const projected = Math.min(100, Math.round(((idx + 1) / total) * 100));
      const actual = Math.min(100, Math.round((accumulatedWeight / total) * 100));

      const dateObj = new Date(m.dueDate);
      const formattedDate = !isNaN(dateObj.getTime())
        ? dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
        : m.dueDate;

      points.push({
        name: m.title,
        shortName: m.title.length > 14 ? `${m.title.slice(0, 12)}…` : m.title,
        date: formattedDate,
        projected,
        actual,
        milestone: m,
      });
    });

    return points;
  }, [sortedMilestones]);

  // Theme-specific color parameters for Recharts
  const chartColors = useMemo(() => {
    if (theme.id === 'modern-ops') {
      return {
        actualStroke: '#10B981', // Neon emerald
        actualFill: '#10B981',
        projectedStroke: '#38BDF8', // Cyan/Sky blue
        projectedFill: '#38BDF8',
        grid: '#1E293B',
        axisText: '#94A3B8',
        tooltipBg: '#090D16',
        tooltipBorder: '#1E293B',
        tooltipText: '#F8FAFC',
      };
    }
    if (theme.id === 'premium-insight') {
      return {
        actualStroke: '#C5A880', // Brass / Muted gold
        actualFill: '#C5A880',
        projectedStroke: '#8C7A70', // Warm taupe
        projectedFill: '#8C7A70',
        grid: '#E5DEC9',
        axisText: '#8C7A70',
        tooltipBg: '#FAF8F5',
        tooltipBorder: '#D9CFC1',
        tooltipText: '#2C221E',
      };
    }
    // Default: Executive Classic
    return {
      actualStroke: '#1E293B', // Slate 900
      actualFill: '#1E293B',
      projectedStroke: '#94A3B8', // Slate 400
      projectedFill: '#94A3B8',
      grid: '#E2E8F0',
      axisText: '#64748B',
      tooltipBg: '#FFFFFF',
      tooltipBorder: '#CBD5E1',
      tooltipText: '#0F172A',
    };
  }, [theme.id]);

  // If there are no milestones for this account
  if (milestones.length === 0) {
    return (
      <div className={`p-4 ${theme.cardBg} border border-dashed ${theme.cardBorder} rounded-xl text-center flex flex-col items-center justify-center space-y-1.5`}>
        <Layers className={`h-5 w-5 ${theme.textMuted}`} />
        <h5 className={`text-xs font-bold ${theme.textTitle}`}>No Milestones Available</h5>
        <p className={`text-[10px] ${theme.textMuted}`}>Add roadmap milestones in the intake flow to generate timeline curves.</p>
      </div>
    );
  }

  const currentProjected = chartData[chartData.length - 1]?.projected ?? 0;
  const currentActual = chartData[chartData.length - 1]?.actual ?? 0;
  const variance = currentActual - currentProjected;

  return (
    <div className={`${theme.cardBg} border ${theme.cardBorder} rounded-xl p-3 md:p-3.5 space-y-2.5 transition-all shadow-xs`}>
      {/* Top Header & Interactive Segmented Controls */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Calendar className={`h-3.5 w-3.5 ${theme.accentText || 'text-slate-700'}`} />
          <span className={`text-[9px] md:text-[10px] font-bold ${theme.textTitle} uppercase tracking-wider`}>
            Milestone Timeline Velocity
          </span>
          <span className={`text-[8px] font-mono px-1.5 py-0.5 rounded ${
            variance >= 0 ? theme.tagSuccess : theme.tagWarning
          }`}>
            {variance >= 0 ? `+${variance}% on pace` : `${variance}% variance`}
          </span>
        </div>

        {/* Segmented Mode Toggle (Comparison, Projected, Actual) */}
        <div className="flex items-center bg-slate-200/50 dark:bg-slate-900/60 p-0.5 rounded-lg text-[9px] font-bold print:hidden">
          <button
            type="button"
            onClick={() => setMode('both')}
            className={`px-2 py-0.5 rounded transition cursor-pointer ${
              mode === 'both'
                ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
            }`}
          >
            Comparison
          </button>
          <button
            type="button"
            onClick={() => setMode('projected')}
            className={`px-2 py-0.5 rounded transition cursor-pointer ${
              mode === 'projected'
                ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
            }`}
          >
            Projected
          </button>
          <button
            type="button"
            onClick={() => setMode('actual')}
            className={`px-2 py-0.5 rounded transition cursor-pointer ${
              mode === 'actual'
                ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
            }`}
          >
            Actual
          </button>
        </div>
      </div>

      {/* Recharts Area Timeline */}
      <div style={{ width: '100%', height }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 8, right: 12, left: -22, bottom: 0 }}>
            <defs>
              <linearGradient id={`grad-actual-${theme.id}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={chartColors.actualFill} stopOpacity={0.4} />
                <stop offset="95%" stopColor={chartColors.actualFill} stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id={`grad-proj-${theme.id}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={chartColors.projectedFill} stopOpacity={0.25} />
                <stop offset="95%" stopColor={chartColors.projectedFill} stopOpacity={0.0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} vertical={false} />

            <XAxis
              dataKey="date"
              stroke={chartColors.grid}
              tick={{ fill: chartColors.axisText, fontSize: 8, fontWeight: 600 }}
              tickLine={false}
              axisLine={{ stroke: chartColors.grid }}
            />

            <YAxis
              domain={[0, 100]}
              ticks={[0, 50, 100]}
              stroke={chartColors.grid}
              tick={{ fill: chartColors.axisText, fontSize: 8, fontWeight: 600 }}
              tickFormatter={(v) => `${v}%`}
              tickLine={false}
              axisLine={false}
            />

            <Tooltip
              content={({ active, payload }) => {
                if (!active || !payload || !payload.length) return null;
                const point = payload[0]?.payload as TimelinePoint;
                if (!point) return null;

                return (
                  <div
                    className="p-2.5 rounded-lg border shadow-lg text-[10px] space-y-1 z-30 max-w-[200px]"
                    style={{
                      backgroundColor: chartColors.tooltipBg,
                      borderColor: chartColors.tooltipBorder,
                      color: chartColors.tooltipText,
                    }}
                  >
                    <div className="font-bold truncate text-[11px] leading-tight">
                      {point.isBaseline ? 'Initiative Kickoff' : point.name}
                    </div>
                    <div className="text-[9px] opacity-75">
                      Target Due: {point.date}
                    </div>

                    <div className="pt-1 border-t border-slate-500/20 grid grid-cols-2 gap-1 text-[9px] font-mono">
                      <div>
                        <span className="opacity-70 block text-[8px]">Projected:</span>
                        <span className="font-bold">{point.projected}%</span>
                      </div>
                      <div>
                        <span className="opacity-70 block text-[8px]">Actual:</span>
                        <span className="font-bold">{point.actual}%</span>
                      </div>
                    </div>

                    {point.milestone && (
                      <div className="pt-1 text-[8px] flex items-center justify-between border-t border-slate-500/20">
                        <span className="truncate max-w-[100px]">Owner: {point.milestone.owner}</span>
                        <span className="font-bold uppercase tracking-wider">{point.milestone.status}</span>
                      </div>
                    )}
                  </div>
                );
              }}
            />

            <ReferenceLine y={100} stroke={chartColors.grid} strokeDasharray="2 2" />

            {/* Projected Progress Curve */}
            {(mode === 'both' || mode === 'projected') && (
              <Area
                type="monotone"
                dataKey="projected"
                name="Projected Progress"
                stroke={chartColors.projectedStroke}
                strokeWidth={1.75}
                strokeDasharray="4 4"
                fill={`url(#grad-proj-${theme.id})`}
                dot={{ r: 2.5, fill: chartColors.projectedStroke, strokeWidth: 0 }}
                activeDot={{ r: 4, fill: chartColors.projectedStroke }}
              />
            )}

            {/* Actual Progress Curve */}
            {(mode === 'both' || mode === 'actual') && (
              <Area
                type="monotone"
                dataKey="actual"
                name="Actual Progress"
                stroke={chartColors.actualStroke}
                strokeWidth={2.25}
                fill={`url(#grad-actual-${theme.id})`}
                dot={{ r: 3, fill: chartColors.actualStroke, strokeWidth: 0 }}
                activeDot={{ r: 5, fill: chartColors.actualStroke }}
              />
            )}
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Legend & Summary Indicators */}
      <div className="flex items-center justify-between pt-1 border-t border-slate-500/10 text-[8px] md:text-[9px]">
        <div className="flex items-center gap-3">
          {(mode === 'both' || mode === 'actual') && (
            <div className="flex items-center gap-1 font-semibold">
              <span className="h-1.5 w-3 rounded-full" style={{ backgroundColor: chartColors.actualStroke }}></span>
              <span className={theme.textTitle}>Actual Delivered: {currentActual}%</span>
            </div>
          )}

          {(mode === 'both' || mode === 'projected') && (
            <div className="flex items-center gap-1 font-semibold">
              <span className="h-0.5 w-3 border-t-2 border-dashed" style={{ borderColor: chartColors.projectedStroke }}></span>
              <span className={theme.textMuted}>Projected Target: {currentProjected}%</span>
            </div>
          )}
        </div>

        <div className={`${theme.textMuted} font-mono font-medium hidden sm:inline`}>
          {milestones.filter(m => m.status === 'Completed').length} of {milestones.length} Milestones Finalized
        </div>
      </div>
    </div>
  );
};
