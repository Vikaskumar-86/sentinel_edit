import React from 'react';
import {
  ShieldAlert,
  AlertOctagon,
  AlertTriangle,
  Info,
  Layers,
  CheckCircle,
} from 'lucide-react';

interface StatsCardsProps {
  totalEndpoints?: number;
  totalVulnerabilities?: number;
  critical?: number;
  high?: number;
  medium?: number;
  low?: number;
  onFilterSeverity?: (severity: string | null) => void;
  activeSeverityFilter?: string | null;
}

export const StatsCards: React.FC<StatsCardsProps> = ({
  totalEndpoints = 128,
  totalVulnerabilities = 17,
  critical = 2,
  high = 5,
  medium = 7,
  low = 3,
  onFilterSeverity,
  activeSeverityFilter,
}) => {
  const stats = [
    {
      label: 'Total Endpoints',
      value: totalEndpoints,
      subtext: 'Across 5 monitored services',
      icon: <Layers className="w-4 h-4 text-cyan-400" />,
      color: 'text-white',
      borderColor: 'border-slate-800',
      clickable: false,
    },
    {
      label: 'Total Vulnerabilities',
      value: totalVulnerabilities,
      subtext: 'Zero-Trust anomalies active',
      icon: <ShieldAlert className="w-4 h-4 text-rose-400" />,
      color: 'text-rose-400',
      borderColor: 'border-slate-800',
      clickable: true,
      filterKey: 'all',
    },
    {
      label: 'Critical',
      value: critical,
      subtext: 'BOLA / Auth bypasses',
      icon: <AlertOctagon className="w-4 h-4 text-rose-500" />,
      color: 'text-rose-500',
      borderColor: activeSeverityFilter === 'Critical' ? 'border-rose-500' : 'border-slate-800',
      clickable: true,
      filterKey: 'Critical',
    },
    {
      label: 'High',
      value: high,
      subtext: 'Data exposure & privilege flaws',
      icon: <AlertTriangle className="w-4 h-4 text-orange-400" />,
      color: 'text-orange-400',
      borderColor: activeSeverityFilter === 'High' ? 'border-orange-500' : 'border-slate-800',
      clickable: true,
      filterKey: 'High',
    },
    {
      label: 'Medium',
      value: medium,
      subtext: 'Rate limiting & DoS vectors',
      icon: <AlertTriangle className="w-4 h-4 text-amber-400" />,
      color: 'text-amber-400',
      borderColor: activeSeverityFilter === 'Medium' ? 'border-amber-500' : 'border-slate-800',
      clickable: true,
      filterKey: 'Medium',
    },
    {
      label: 'Low',
      value: low,
      subtext: 'CORS & debug error leaks',
      icon: <Info className="w-4 h-4 text-blue-400" />,
      color: 'text-blue-400',
      borderColor: activeSeverityFilter === 'Low' ? 'border-blue-500' : 'border-slate-800',
      clickable: true,
      filterKey: 'Low',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
      {stats.map((stat, i) => (
        <div
          key={i}
          onClick={() => {
            if (stat.clickable && onFilterSeverity) {
              if (stat.filterKey === 'all') {
                onFilterSeverity(null);
              } else {
                onFilterSeverity(activeSeverityFilter === stat.filterKey ? null : (stat.filterKey || null));
              }
            }
          }}
          className={`p-4 rounded bg-slate-900/90 border transition-all ${stat.borderColor} ${
            stat.clickable ? 'cursor-pointer hover:border-slate-700 hover:bg-slate-900' : ''
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400 truncate">{stat.label}</span>
            {stat.icon}
          </div>

          <div className={`text-2xl font-bold font-mono tabular-nums ${stat.color}`}>
            {stat.value}
          </div>

          <div className="text-[11px] text-slate-400 mt-1 truncate">
            {stat.subtext}
          </div>
        </div>
      ))}
    </div>
  );
};
