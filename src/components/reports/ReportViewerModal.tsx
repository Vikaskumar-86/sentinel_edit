import React from 'react';
import {
  X,
  Download,
  Printer,
  ShieldCheck,
  AlertTriangle,
  FileCheck,
  CheckCircle2,
  Calendar,
  Layers,
  Activity,
} from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { ScanReport } from '../../types';

interface ReportViewerModalProps {
  report: ScanReport | null;
  onClose: () => void;
}

export const ReportViewerModal: React.FC<ReportViewerModalProps> = ({ report, onClose }) => {
  if (!report) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleExportJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(report, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `${report.scanId}-audit-report.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto transition-all duration-300 animate-fadeIn select-none print:bg-white print:p-0"
      style={{
        backdropFilter: 'blur(28px) saturate(180%)',
        WebkitBackdropFilter: 'blur(28px) saturate(180%)',
        backgroundColor: 'rgba(2, 6, 23, 0.85)',
      }}
    >
      <div
        className="relative w-full max-w-4xl max-h-[92vh] flex flex-col bg-gradient-to-b from-slate-900 via-slate-900/98 to-slate-950 border border-cyan-500/50 rounded-2xl shadow-[0_30px_90px_-15px_rgba(6,182,212,0.4),0_0_40px_rgba(6,182,212,0.15)] overflow-hidden my-auto transition-all duration-300 transform-gpu print:border-none print:shadow-none print:max-h-full print:bg-white print:text-black"
        style={{
          transform: 'perspective(1400px) translateZ(30px) scale(1)',
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Top Header */}
        <div className="p-6 border-b border-slate-800 bg-slate-950/80 flex items-start justify-between gap-4 print:hidden">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded bg-cyan-950 border border-cyan-800 flex items-center justify-center text-cyan-400">
              <FileCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
                <span>{report.scanId}</span>
                <span>·</span>
                <span>{report.scanDate}</span>
              </div>
              <h2 className="text-base font-bold text-white tracking-tight">
                Executive Security Audit Report
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1 px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / PDF</span>
            </button>
            <button
              onClick={handleExportJson}
              className="flex items-center gap-1 px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export JSON</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors ml-2"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Document Body */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6 print:p-8 print:overflow-visible">
          {/* Document Title Header */}
          <div className="border-b border-slate-800 pb-6 print:border-neutral-300">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-mono text-xs font-bold text-cyan-400 tracking-wider uppercase">
                  SentinelAPI Threat Audit
                </span>
                <h1 className="text-xl font-bold text-white print:text-black mt-1">
                  {report.apiName}
                </h1>
              </div>

              <div className="text-right font-mono flex flex-col items-end">
                <div className="text-xs text-slate-400 print:text-neutral-600">Overall Risk Score</div>
                <div
                  className={`text-2xl font-black ${
                    report.riskScore > 75
                      ? 'text-rose-500'
                      : report.riskScore > 40
                      ? 'text-amber-500'
                      : 'text-emerald-500'
                  }`}
                >
                  {report.riskScore}/100
                </div>
                <div className="relative w-28 h-28 mt-3 print:hidden" aria-label={`Overall risk score ${report.riskScore} out of 100`}>
                  <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
                    <circle cx="60" cy="60" r="48" fill="none" stroke="#2563eb" strokeWidth="14" />
                    <circle
                      cx="60"
                      cy="60"
                      r="48"
                      fill="none"
                      stroke="#ef4444"
                      strokeWidth="14"
                      strokeLinecap="round"
                      strokeDasharray={`${Math.max(0, Math.min(100, report.riskScore)) * 3.0159} 301.59`}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-lg font-black text-white">{report.riskScore}<span className="text-[10px] text-slate-400">/100</span></span>
                  </div>
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-300 print:text-neutral-700 mt-3 leading-relaxed">
              {report.summary}
            </p>
          </div>

          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded bg-slate-950/60 border border-slate-800 print:border-neutral-300 print:bg-neutral-50">
              <div className="text-[11px] text-slate-400 print:text-neutral-500 font-mono uppercase">
                Endpoints Audited
              </div>
              <div className="text-xl font-bold font-mono text-white print:text-black tabular-nums mt-1">
                {report.endpointsScanned}
              </div>
            </div>

            <div className="p-3 rounded bg-slate-950/60 border border-slate-800 print:border-neutral-300 print:bg-neutral-50">
              <div className="text-[11px] text-slate-400 print:text-neutral-500 font-mono uppercase">
                Scan Duration
              </div>
              <div className="text-xl font-bold font-mono text-cyan-400 print:text-neutral-800 tabular-nums mt-1">
                {report.durationSeconds}s
              </div>
            </div>

            <div className="p-3 rounded bg-slate-950/60 border border-slate-800 print:border-neutral-300 print:bg-neutral-50">
              <div className="text-[11px] text-slate-400 print:text-neutral-500 font-mono uppercase">
                Critical Findings
              </div>
              <div className="text-xl font-bold font-mono text-rose-500 tabular-nums mt-1">
                {report.criticalCount}
              </div>
            </div>

            <div className="p-3 rounded bg-slate-950/60 border border-slate-800 print:border-neutral-300 print:bg-neutral-50">
              <div className="text-[11px] text-slate-400 print:text-neutral-500 font-mono uppercase">
                High / Medium Flaws
              </div>
              <div className="text-xl font-bold font-mono text-amber-400 tabular-nums mt-1">
                {report.highCount + report.mediumCount}
              </div>
            </div>
          </div>

          {/* Visual Security Summary */}
          <div className="grid grid-cols-1 gap-4">
            <div className="p-4 rounded border border-slate-800 bg-slate-950/40 print:border-neutral-300">
              <h3 className="text-xs font-semibold text-slate-200 print:text-black uppercase tracking-wider mb-3">Findings by Severity</h3>
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={[
                    {name:'Critical',count:report.criticalCount},
                    {name:'High',count:report.highCount},
                    {name:'Medium',count:report.mediumCount},
                    {name:'Low',count:report.lowCount},
                  ]} margin={{top:5,right:10,left:-20,bottom:0}}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b"/>
                    <XAxis dataKey="name" tick={{fontSize:10,fill:'#94a3b8'}}/>
                    <YAxis allowDecimals={false} tick={{fontSize:10,fill:'#94a3b8'}}/>
                    <Tooltip/>
                    <Bar dataKey="count" fill="#22d3ee" radius={[4,4,0,0]}/>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {report.vulnerabilityBreakdown && report.vulnerabilityBreakdown.length > 0 && (
            <div className="p-4 rounded border border-slate-800 bg-slate-950/40 print:border-neutral-300">
              <h3 className="text-xs font-semibold text-slate-200 print:text-black uppercase tracking-wider mb-3">Vulnerability Breakdown</h3>
              <div className="space-y-2">
                {report.vulnerabilityBreakdown.map((item) => <div key={item.name} className="flex items-center gap-3"><div className="w-28 text-[10px] font-mono text-slate-400">{item.name}</div><div className="flex-1 h-2 rounded-full bg-slate-800 overflow-hidden"><div className="h-full bg-cyan-400 rounded-full" style={{width:`${report.vulnerabilitiesFound ? Math.max(4, (item.count/report.vulnerabilitiesFound)*100) : 0}%`}}/></div><div className="w-5 text-right text-xs font-mono text-slate-200">{item.count}</div></div>)}
              </div>
            </div>
          )}

          {/* Regulatory Compliance Posture */}
          <div>
            <h3 className="text-xs font-semibold text-slate-200 print:text-black uppercase tracking-wider mb-3">
              Standard & Framework Compliance
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3 rounded bg-slate-950/40 border border-slate-800 print:border-neutral-300">
                <div className="text-xs font-semibold text-slate-300 print:text-black">
                  OWASP API Security Top 10
                </div>
                <div className="text-[11px] text-slate-400 print:text-neutral-600 mt-1">
                  Status:
                  <span
                    className={`ml-1.5 font-mono font-bold ${
                      report.complianceStatus.owaspApiTop10 === 'Fail'
                        ? 'text-rose-400'
                        : 'text-emerald-400'
                    }`}
                  >
                    {report.complianceStatus.owaspApiTop10}
                  </span>
                </div>
              </div>

              <div className="p-3 rounded bg-slate-950/40 border border-slate-800 print:border-neutral-300">
                <div className="text-xs font-semibold text-slate-300 print:text-black">
                  PCI DSS v4.0 (API Auth)
                </div>
                <div className="text-[11px] text-slate-400 print:text-neutral-600 mt-1">
                  Status:
                  <span
                    className={`ml-1.5 font-mono font-bold ${
                      report.complianceStatus.pciDssApi === 'Fail'
                        ? 'text-rose-400'
                        : report.complianceStatus.pciDssApi === 'Warning'
                        ? 'text-amber-400'
                        : 'text-emerald-400'
                    }`}
                  >
                    {report.complianceStatus.pciDssApi}
                  </span>
                </div>
              </div>

              <div className="p-3 rounded bg-slate-950/40 border border-slate-800 print:border-neutral-300">
                <div className="text-xs font-semibold text-slate-300 print:text-black">
                  GDPR Article 32 (Data Minimization)
                </div>
                <div className="text-[11px] text-slate-400 print:text-neutral-600 mt-1">
                  Status:
                  <span
                    className={`ml-1.5 font-mono font-bold ${
                      report.complianceStatus.gdprDataExposure === 'Fail'
                        ? 'text-rose-400'
                        : 'text-emerald-400'
                    }`}
                  >
                    {report.complianceStatus.gdprDataExposure}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Remediation Priority Actions */}
          <div className="p-4 rounded border border-slate-800 bg-slate-950/40 print:border-neutral-300">
            <h3 className="text-xs font-semibold text-slate-200 print:text-black uppercase tracking-wider mb-2">
              Immediate Security Action Items
            </h3>
            <ul className="space-y-2 text-xs text-slate-300 print:text-neutral-700">
              <li className="flex items-start gap-2">
                <span className="text-rose-400 font-mono font-bold">1.</span>
                <span>
                  Enforce tenant-isolated object ID ownership verification on{' '}
                  <code className="font-mono text-cyan-300 print:text-black">/api/orders/{'{id}'}</code> to eliminate cross-tenant data leakage.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-400 font-mono font-bold">2.</span>
                <span>
                  Apply strict response serialization schemas on{' '}
                  <code className="font-mono text-cyan-300 print:text-black">/api/users/{'{id}'}</code> to sanitize credential hashes and internal flags.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-400 font-mono font-bold">3.</span>
                <span>
                  Deploy gateway-level Redis sliding-window rate limiters on authentication endpoints to defend against automated brute-force attacks.
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
