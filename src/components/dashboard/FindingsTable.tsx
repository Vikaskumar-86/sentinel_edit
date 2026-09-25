import React from 'react';
import {
  AlertOctagon,
  AlertTriangle,
  Info,
  ChevronRight,
  ExternalLink,
  ShieldAlert,
  CheckCircle2,
  Clock,
  Filter,
} from 'lucide-react';
import { VulnerabilityFinding, SeverityLevel, VulnerabilityStatus } from '../../types';

interface FindingsTableProps {
  findings: VulnerabilityFinding[];
  onSelectFinding: (finding: VulnerabilityFinding) => void;
  selectedFindingId?: string;
  searchFilter?: string;
  severityFilter?: string | null;
  statusFilter?: string | null;
  onClearFilters?: () => void;
}

export const FindingsTable: React.FC<FindingsTableProps> = ({
  findings,
  onSelectFinding,
  selectedFindingId,
  searchFilter = '',
  severityFilter = null,
  statusFilter = null,
  onClearFilters,
}) => {
  const filteredFindings = findings.filter((f) => {
    const matchesSearch =
      searchFilter === '' ||
      f.title.toLowerCase().includes(searchFilter.toLowerCase()) ||
      f.endpoint.toLowerCase().includes(searchFilter.toLowerCase()) ||
      f.category.toLowerCase().includes(searchFilter.toLowerCase()) ||
      f.id.toLowerCase().includes(searchFilter.toLowerCase());

    const matchesSeverity = !severityFilter || f.severity === severityFilter;
    const matchesStatus = !statusFilter || f.status === statusFilter;

    return matchesSearch && matchesSeverity && matchesStatus;
  });

  const getSeverityBadge = (severity: SeverityLevel) => {
    switch (severity) {
      case 'Critical':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-mono font-semibold text-rose-400">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
            Critical
          </span>
        );
      case 'High':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-mono font-semibold text-orange-400">
            <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
            High
          </span>
        );
      case 'Medium':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-mono font-semibold text-amber-400">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            Medium
          </span>
        );
      case 'Low':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-mono font-semibold text-blue-400">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
            Low
          </span>
        );
      default:
        return <span className="text-xs font-mono text-slate-400">Info</span>;
    }
  };

  const getMethodBadge = (method: string) => {
    const colors: Record<string, string> = {
      GET: 'text-cyan-400 bg-cyan-950/60 border-cyan-800/60',
      POST: 'text-emerald-400 bg-emerald-950/60 border-emerald-800/60',
      PUT: 'text-amber-400 bg-amber-950/60 border-amber-800/60',
      DELETE: 'text-rose-400 bg-rose-950/60 border-rose-800/60',
      PATCH: 'text-purple-400 bg-purple-950/60 border-purple-800/60',
    };
    return (
      <span
        className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold border ${
          colors[method] || 'text-slate-400 border-slate-700'
        }`}
      >
        {method}
      </span>
    );
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded shadow-xl overflow-hidden">
      {/* Header bar */}
      <div className="p-4 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-cyan-400" />
            <h3 className="text-xs font-semibold text-slate-200 uppercase tracking-wider">
              Recent Findings & Detection Queue
            </h3>
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Real-time API vulnerability detections prioritized by CVSS exploitability
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-400 font-mono">
            Showing {filteredFindings.length} of {findings.length} findings
          </span>
          {(severityFilter || statusFilter || searchFilter) && (
            <button
              onClick={onClearFilters}
              className="text-cyan-400 hover:underline text-[11px] font-mono ml-2"
            >
              Reset filters
            </button>
          )}
        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-950/70 text-[11px] font-mono uppercase tracking-wider text-slate-400">
              <th className="py-3 px-4 font-medium">Vulnerability</th>
              <th className="py-3 px-4 font-medium">Endpoint</th>
              <th className="py-3 px-4 font-medium">Severity</th>
              <th className="py-3 px-4 font-medium">Status</th>
              <th className="py-3 px-4 font-medium">Detected</th>
              <th className="py-3 px-4 font-medium text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/80 text-xs">
            {filteredFindings.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-12 text-center text-slate-500 font-mono">
                  No vulnerabilities match the current filter criteria.
                </td>
              </tr>
            ) : (
              filteredFindings.map((finding) => {
                const isSelected = selectedFindingId === finding.id;

                return (
                  <tr
                    key={finding.id}
                    onClick={() => onSelectFinding(finding)}
                    className={`hover:bg-slate-800/60 transition-colors cursor-pointer ${
                      isSelected ? 'bg-cyan-950/20' : ''
                    }`}
                  >
                    {/* Vulnerability */}
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-100 flex items-center gap-1.5">
                        <span>{finding.title}</span>
                      </div>
                      <div className="text-[11px] text-slate-400 flex items-center gap-1.5 mt-0.5">
                        <span>{finding.owaspRank.split(' - ')[0]}</span>
                        <span>·</span>
                        <span>{finding.apiName}</span>
                      </div>
                    </td>

                    {/* Endpoint */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2 font-mono">
                        {getMethodBadge(finding.httpMethod)}
                        <span className="text-slate-300 font-medium truncate max-w-[200px] sm:max-w-xs">
                          {finding.endpoint}
                        </span>
                      </div>
                    </td>

                    {/* Severity */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        {getSeverityBadge(finding.severity)}
                        <span className="text-[11px] text-slate-500 font-mono tabular-nums">
                          ({finding.cvssScore})
                        </span>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4">
                      <span
                        className={`text-[11px] font-mono ${
                          finding.status === 'Resolved'
                            ? 'text-emerald-400'
                            : finding.status === 'In Review'
                            ? 'text-amber-400'
                            : 'text-slate-300'
                        }`}
                      >
                        {finding.status}
                      </span>
                    </td>

                    {/* Detected */}
                    <td className="py-3.5 px-4 text-slate-400 font-mono text-[11px]">
                      {finding.detectedAt}
                    </td>

                    {/* Action */}
                    <td className="py-3.5 px-4 text-right">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectFinding(finding);
                        }}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-cyan-500 hover:text-slate-950 text-slate-300 text-xs font-medium transition-colors"
                      >
                        <span>Investigate</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
