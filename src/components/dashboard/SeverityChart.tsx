import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  PieChart,
  Pie,
  Legend,
} from 'recharts';

interface SeverityChartProps {
  critical?: number;
  high?: number;
  medium?: number;
  low?: number;
}

export const SeverityChart: React.FC<SeverityChartProps> = ({
  critical = 2,
  high = 5,
  medium = 7,
  low = 3,
}) => {
  const severityData = [
    { name: 'Critical', count: critical, color: '#f43f5e', cvss: '9.0 - 10.0' },
    { name: 'High', count: high, color: '#fb923c', cvss: '7.0 - 8.9' },
    { name: 'Medium', count: medium, color: '#facc15', cvss: '4.0 - 6.9' },
    { name: 'Low', count: low, color: '#60a5fa', cvss: '0.1 - 3.9' },
  ];

  const categoryData = [
    { name: 'BOLA / IDOR', value: 4, color: '#ef4444' },
    { name: 'Data Exposure', value: 3, color: '#f97316' },
    { name: 'Auth Misconfig', value: 4, color: '#a855f7' },
    { name: 'Rate Limiting', value: 3, color: '#22c55e' },
    { name: 'BFLA Access', value: 2, color: '#06b6d4' },
    { name: 'Sec Misconfig', value: 1, color: '#3b82f6' },
  ];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-slate-950 border border-slate-700 p-2.5 rounded shadow-xl text-xs font-mono">
          <div className="font-semibold text-white">{data.name}</div>
          <div className="text-slate-300 mt-1">
            Count: <span className="text-cyan-400 font-bold">{data.count ?? data.value}</span>
          </div>
          {data.cvss && (
            <div className="text-slate-400 text-[11px]">CVSS Range: {data.cvss}</div>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Chart 1: Severity Breakdown */}
      <div className="lg:col-span-6 bg-slate-900/90 border border-slate-800 rounded p-5">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
          <div>
            <h3 className="text-xs font-semibold text-slate-200 uppercase tracking-wider">
              Vulnerability Severity Distribution
            </h3>
            <p className="text-[11px] text-slate-400">CVSS v3.1 Impact Tiering</p>
          </div>
          <div className="text-xs text-slate-400 font-mono">17 Active Findings</div>
        </div>

        <div className="h-60 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={severityData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <XAxis
                dataKey="name"
                stroke="#64748b"
                fontSize={12}
                tickLine={false}
                axisLine={{ stroke: '#334155' }}
              />
              <YAxis
                stroke="#64748b"
                fontSize={12}
                tickLine={false}
                axisLine={{ stroke: '#334155' }}
                allowDecimals={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                {severityData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-4 gap-2 pt-3 border-t border-slate-800/80 text-center font-mono text-xs">
          {severityData.map((item) => (
            <div key={item.name} className="p-1.5 rounded bg-slate-950/40">
              <div className="text-[11px] text-slate-400">{item.name}</div>
              <div className="font-bold tabular-nums" style={{ color: item.color }}>
                {item.count}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chart 2: Category Breakdown */}
      <div className="lg:col-span-6 bg-slate-900/90 border border-slate-800 rounded p-5">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
          <div>
            <h3 className="text-xs font-semibold text-slate-200 uppercase tracking-wider">
              OWASP API Top 10 Taxonomy
            </h3>
            <p className="text-[11px] text-slate-400">Classification by attack vector category</p>
          </div>
          <div className="text-xs text-cyan-400 font-mono">API Security 2023</div>
        </div>

        <div className="h-60 w-full flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={4}
                dataKey="value"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-cat-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-3 gap-2 pt-3 border-t border-slate-800/80 text-center text-xs">
          {categoryData.slice(0, 3).map((item) => (
            <div key={item.name} className="flex items-center justify-center gap-1.5 font-mono text-[11px]">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
              <span className="text-slate-300 truncate">{item.name}:</span>
              <span className="font-bold text-white tabular-nums">{item.value}</span>
            </div>
          ))}
          {categoryData.slice(3, 6).map((item) => (
            <div key={item.name} className="flex items-center justify-center gap-1.5 font-mono text-[11px]">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
              <span className="text-slate-300 truncate">{item.name}:</span>
              <span className="font-bold text-white tabular-nums">{item.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
