import React, { useState } from 'react';
import {
  FileText,
  Download,
  Printer,
  ExternalLink,
  ShieldAlert,
  Calendar,
  CheckCircle2,
  Clock,
  Layers,
} from 'lucide-react';
import { ScanReport } from '../types';
import { ReportViewerModal } from '../components/reports/ReportViewerModal';
import { PageId } from '../components/layout/Sidebar';

interface ReportsPageProps {
  reports: ScanReport[];
  onNavigate: (page: PageId) => void;
}

export const ReportsPage: React.FC<ReportsPageProps> = ({ reports, onNavigate }) => {
  const [selectedReport, setSelectedReport] = useState<ScanReport | null>(null);

  const handleExportJson = (report: ScanReport) => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(report, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `${report.scanId}-report.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleExportPdf = (report: ScanReport) => {
    setSelectedReport(report);
    setTimeout(() => {
      window.print();
    }, 300);
  };

  const getRiskLevelBadge = (level: ScanReport['riskLevel']) => {
    switch (level) {
      case 'Critical':
        return <span className="font-mono text-rose-400 font-bold">Critical Risk</span>;
      case 'High':
        return <span className="font-mono text-orange-400 font-bold">High Risk</span>;
      case 'Medium':
        return <span className="font-mono text-amber-400 font-bold">Medium Risk</span>;
      default:
        return <span className="font-mono text-emerald-400 font-bold">Low Risk</span>;
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded bg-slate-900 border border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-cyan-400" />
            <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
              Executive Vulnerability Audit Reports
            </h2>
          </div>
          <p className="text-xs text-slate-300 mt-1">
            Formal compliance certificates, OWASP API Top 10 attestations, and remediation agendas.
          </p>
        </div>

        <button
          onClick={() => onNavigate('scanner')}
          className="px-3.5 py-2 rounded bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-colors"
        >
          Generate New Report
        </button>
      </div>

      {/* Reports Table */}
      <div className="bg-slate-900/90 border border-slate-800 rounded shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/70 text-[11px] font-mono uppercase tracking-wider text-slate-400">
                <th className="py-3 px-4 font-medium">Scan ID</th>
                <th className="py-3 px-4 font-medium">API Name</th>
                <th className="py-3 px-4 font-medium">Scan Date</th>
                <th className="py-3 px-4 font-medium">Endpoints Scanned</th>
                <th className="py-3 px-4 font-medium">Vulnerabilities Found</th>
                <th className="py-3 px-4 font-medium">Risk Level</th>
                <th className="py-3 px-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-xs">
              {reports.map((rep) => (
                <tr key={rep.id} className="hover:bg-slate-800/50 transition-colors">
                  <td className="py-3.5 px-4 font-mono text-cyan-400 font-bold">
                    {rep.scanId}
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-slate-200">
                    {rep.apiName}
                  </td>
                  <td className="py-3.5 px-4 text-slate-400 font-mono text-[11px]">
                    {rep.scanDate}
                  </td>
                  <td className="py-3.5 px-4 font-mono tabular-nums text-slate-300">
                    {rep.endpointsScanned} endpoints
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-mono font-bold text-rose-400 tabular-nums">
                      {rep.vulnerabilitiesFound} findings
                    </span>
                    <span className="text-[11px] text-slate-500 ml-1">
                      ({rep.criticalCount} crit, {rep.highCount} high)
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    {getRiskLevelBadge(rep.riskLevel)}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="inline-flex items-center gap-1.5">
                      <button
                        onClick={() => setSelectedReport(rep)}
                        className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors"
                      >
                        View Report
                      </button>
                      <button
                        onClick={() => handleExportJson(rep)}
                        className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
                        title="Export JSON"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleExportPdf(rep)}
                        className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
                        title="Export PDF / Print"
                      >
                        <Printer className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedReport && (
        <ReportViewerModal
          report={selectedReport}
          onClose={() => setSelectedReport(null)}
        />
      )}
    </div>
  );
};
