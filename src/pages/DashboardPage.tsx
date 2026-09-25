import React, { useState } from 'react';
import {
  ShieldAlert,
  Scan,
  AlertOctagon,
  Layers,
  ArrowUpRight,
  Filter,
  CheckCircle2,
  Download,
  Terminal,
} from 'lucide-react';
import { StatsCards } from '../components/dashboard/StatsCards';
import { SeverityChart } from '../components/dashboard/SeverityChart';
import { FindingsTable } from '../components/dashboard/FindingsTable';
import { VulnerabilityDetailModal } from '../components/vulnerabilities/VulnerabilityDetailModal';
import { VulnerabilityFinding, SeverityLevel } from '../types';
import { PageId } from '../components/layout/Sidebar';

interface DashboardPageProps {
  findings: VulnerabilityFinding[];
  onSelectFinding: (finding: VulnerabilityFinding) => void;
  selectedFinding: VulnerabilityFinding | null;
  onCloseFindingModal: () => void;
  onToggleStatus: (id: string, newStatus: 'Open' | 'Resolved') => void;
  onNavigate: (page: PageId) => void;
  onAskAiAboutFinding: (finding: VulnerabilityFinding) => void;
  searchQuery?: string;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  findings,
  onSelectFinding,
  selectedFinding,
  onCloseFindingModal,
  onToggleStatus,
  onNavigate,
  onAskAiAboutFinding,
  searchQuery = '',
}) => {
  const [severityFilter, setSeverityFilter] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);

  const handleLaunchScanWith3D = () => {
    onNavigate('scanner');
  };

  const handleViewReportsWith3D = () => {
    onNavigate('reports');
  };

  const handleInspectFinding = (finding: VulnerabilityFinding) => {
    onSelectFinding(finding);
  };

  // Statistics
  const totalEndpoints = 128;
  const totalVulnerabilities = findings.length;
  const critical = findings.filter((f) => f.severity === 'Critical').length;
  const high = findings.filter((f) => f.severity === 'High').length;
  const medium = findings.filter((f) => f.severity === 'Medium').length;
  const low = findings.filter((f) => f.severity === 'Low').length;

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner Context */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded bg-slate-900 border border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-mono text-cyan-400 font-semibold uppercase tracking-wider">
              CONTINUOUS SECURITY RADAR
            </span>
          </div>
          <p className="text-xs text-slate-300 mt-1">
            Zero-trust contract ingestion and dual-token authorization monitoring for active services.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleLaunchScanWith3D}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-xs transition-colors shadow-sm interactive-btn"
            data-cursor-label="SCAN"
          >
            <Scan className="w-3.5 h-3.5" />
            <span>Launch New Scan</span>
          </button>
          <button
            onClick={handleViewReportsWith3D}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs transition-colors interactive-btn"
            data-cursor-label="REPORTS"
          >
            <span>Audit Reports</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Top Statistics Cards */}
      <StatsCards
        totalEndpoints={totalEndpoints}
        totalVulnerabilities={totalVulnerabilities}
        critical={critical}
        high={high}
        medium={medium}
        low={low}
        onFilterSeverity={(s) => setSeverityFilter(s)}
        activeSeverityFilter={severityFilter}
      />

      {/* Visual Charts: Recharts Severity & Category */}
      <SeverityChart critical={critical} high={high} medium={medium} low={low} />

      {/* Recent Findings Table */}
      <FindingsTable
        findings={findings}
        onSelectFinding={handleInspectFinding}
        selectedFindingId={selectedFinding?.id}
        searchFilter={searchQuery}
        severityFilter={severityFilter}
        statusFilter={statusFilter}
        onClearFilters={() => {
          setSeverityFilter(null);
          setStatusFilter(null);
        }}
      />

      {/* Vulnerability Details Modal */}
      {selectedFinding && (
        <VulnerabilityDetailModal
          finding={selectedFinding}
          onClose={onCloseFindingModal}
          onToggleStatus={onToggleStatus}
          onAskAiAboutFinding={onAskAiAboutFinding}
        />
      )}
    </div>
  );
};
