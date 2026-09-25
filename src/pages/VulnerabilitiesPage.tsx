import React, { useState } from 'react';
import {
  AlertTriangle,
  Filter,
  Search,
  Download,
  CheckCircle2,
  ChevronRight,
  ShieldAlert,
} from 'lucide-react';
import { VulnerabilityFinding, SeverityLevel, VulnerabilityStatus } from '../types';
import { VulnerabilityDetailModal } from '../components/vulnerabilities/VulnerabilityDetailModal';
import { PageId } from '../components/layout/Sidebar';

interface VulnerabilitiesPageProps {
  findings: VulnerabilityFinding[];
  onToggleStatus: (id: string, newStatus: 'Open' | 'Resolved') => void;
  onNavigate: (page: PageId) => void;
  onAskAiAboutFinding: (finding: VulnerabilityFinding) => void;
  searchQuery?: string;
}

export const VulnerabilitiesPage: React.FC<VulnerabilitiesPageProps> = ({
  findings,
  onToggleStatus,
  onNavigate,
  onAskAiAboutFinding,
  searchQuery: initialSearch = '',
}) => {
  const [selectedFinding, setSelectedFinding] = useState<VulnerabilityFinding | null>(null);
  const [search, setSearch] = useState(initialSearch);
  const [selectedSeverity, setSelectedSeverity] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const handleSelectFinding = (finding: VulnerabilityFinding) => {
    setSelectedFinding(finding);
  };

  const filtered = findings.filter((f) => {
    const matchesSearch =
      search === '' ||
      f.title.toLowerCase().includes(search.toLowerCase()) ||
      f.endpoint.toLowerCase().includes(search.toLowerCase()) ||
      f.cwe.toLowerCase().includes(search.toLowerCase());

    const matchesSeverity = selectedSeverity === 'all' || f.severity === selectedSeverity;
    const matchesStatus = selectedStatus === 'all' || f.status === selectedStatus;
    const matchesCategory = selectedCategory === 'all' || f.category === selectedCategory;

    return matchesSearch && matchesSeverity && matchesStatus && matchesCategory;
  });

  const handleExportSarif = () => {
    const sarifReport = {
      version: '2.1.0',
      $schema: 'https://raw.githubusercontent.com/oasis-tcs/sarif-spec/master/Schemata/sarif-schema-2.1.0.json',
      runs: [
        {
          tool: {
            driver: {
              name: 'SentinelAPI',
              version: '1.0.0',
              informationUri: 'https://sentinelapi.security',
            },
          },
          results: filtered.map((f) => ({
            ruleId: f.owaspRank,
            message: { text: f.title },
            locations: [{ physicalLocation: { artifactLocation: { uri: f.endpoint } } }],
          })),
        },
      ],
    };

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(sarifReport, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', 'sentinelapi-findings.sarif');
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Controls Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded bg-slate-900 border border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-cyan-400" />
            <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
              Vulnerability Findings Matrix
            </h2>
          </div>
          <p className="text-xs text-slate-300 mt-1">
            {filtered.length} active findings flagged across API contracts with reproducible proof-of-concept vectors.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportSarif}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export SARIF</span>
          </button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="p-4 rounded bg-slate-900/60 border border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          {/* Search */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search findings or endpoints..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 w-48 sm:w-60"
            />
          </div>

          {/* Severity filter */}
          <select
            value={selectedSeverity}
            onChange={(e) => setSelectedSeverity(e.target.value)}
            className="px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded text-slate-300 focus:outline-none focus:border-cyan-500 font-mono"
          >
            <option value="all">All Severities</option>
            <option value="Critical">Critical</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>

          {/* Status filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded text-slate-300 focus:outline-none focus:border-cyan-500 font-mono"
          >
            <option value="all">All Statuses</option>
            <option value="Open">Open</option>
            <option value="In Review">In Review</option>
            <option value="Resolved">Resolved</option>
          </select>
        </div>

        <span className="text-slate-400 font-mono text-[11px]">
          Showing {filtered.length} of {findings.length} findings
        </span>
      </div>

      {/* Findings Cards List */}
      <div className="space-y-3">
        {filtered.map((finding) => (
          <div
            key={finding.id}
            onClick={() => handleSelectFinding(finding)}
            className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-cyan-500/50 transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 interactive-card"
            data-cursor-label="INSPECT"
          >
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono text-xs text-slate-400">{finding.id}</span>
                <span>·</span>
                <span
                  className={`font-mono text-xs font-bold ${
                    finding.severity === 'Critical'
                      ? 'text-rose-400'
                      : finding.severity === 'High'
                      ? 'text-orange-400'
                      : finding.severity === 'Medium'
                      ? 'text-amber-400'
                      : 'text-blue-400'
                  }`}
                >
                  {finding.severity.toUpperCase()} ({finding.cvssScore})
                </span>
                <span>·</span>
                <span className="text-xs text-cyan-400 font-mono">{finding.owaspRank.split(' - ')[0]}</span>
                <span>·</span>
                <span className="text-xs text-slate-500 font-mono">{finding.apiName}</span>
              </div>

              <h3 className="text-sm font-bold text-white hover:text-cyan-300 transition-colors">
                {finding.title}
              </h3>

              <div className="flex items-center gap-2 text-xs font-mono text-slate-300 pt-1">
                <span className="px-1.5 py-0.5 rounded bg-slate-950 border border-slate-800 text-[10px] text-cyan-400 font-bold">
                  {finding.httpMethod}
                </span>
                <span>{finding.endpoint}</span>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <span
                className={`text-xs font-mono px-2 py-0.5 rounded border ${
                  finding.status === 'Resolved'
                    ? 'text-emerald-400 border-emerald-800/80 bg-emerald-950/40'
                    : 'text-amber-400 border-amber-800/80 bg-amber-950/40'
                }`}
              >
                {finding.status}
              </span>

              <button
                type="button"
                className="flex items-center gap-1 px-3 py-1.5 rounded bg-slate-800 hover:bg-cyan-500 hover:text-slate-950 text-slate-200 text-xs font-medium transition-colors"
              >
                <span>Inspect</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {selectedFinding && (
        <VulnerabilityDetailModal
          finding={selectedFinding}
          onClose={() => setSelectedFinding(null)}
          onToggleStatus={onToggleStatus}
          onAskAiAboutFinding={onAskAiAboutFinding}
        />
      )}
    </div>
  );
};
