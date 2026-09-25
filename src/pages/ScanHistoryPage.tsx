import React from 'react';
import { History, FolderKanban, CheckCircle2, Clock3, AlertTriangle, ArrowRight, FileText } from 'lucide-react';
import { ScanHistoryEntry, SecurityProject, ScanReport } from '../types';
import { PageId } from '../components/layout/Sidebar';

interface Props {
  projects: SecurityProject[];
  history: ScanHistoryEntry[];
  reports: ScanReport[];
  onNavigate: (page: PageId) => void;
  onViewReport: (report: ScanReport) => void;
}

export const ScanHistoryPage: React.FC<Props> = ({ projects, history, reports, onNavigate, onViewReport }) => {
  const reportFor = (entry: ScanHistoryEntry) => reports.find(r => r.scanId === entry.scanId);
  return (
    <div className="space-y-6 pb-12">
      <div className="flex items-center justify-between gap-4 p-5 rounded-xl bg-slate-900 border border-slate-800">
        <div>
          <div className="flex items-center gap-2"><History className="w-4 h-4 text-cyan-400"/><h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono">Scan History</h2></div>
          <p className="text-xs text-slate-400 mt-1">Every created project and its completed scan activity in one place.</p>
        </div>
        <button onClick={() => onNavigate('scanner')} className="px-3.5 py-2 rounded bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-xs">New Scan</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <Stat icon={<FolderKanban className="w-4 h-4"/>} label="PROJECTS" value={projects.length}/>
        <Stat icon={<CheckCircle2 className="w-4 h-4"/>} label="COMPLETED SCANS" value={history.filter(h => h.status === 'Completed').length}/>
        <Stat icon={<AlertTriangle className="w-4 h-4"/>} label="TOTAL FINDINGS" value={history.reduce((n,h)=>n+h.vulnerabilitiesFound,0)}/>
      </div>

      <div className="rounded-xl border border-slate-800 bg-slate-900/90 overflow-hidden">
        <div className="p-4 border-b border-slate-800 flex items-center gap-2"><FolderKanban className="w-4 h-4 text-cyan-400"/><h3 className="text-xs font-bold text-white uppercase tracking-wider">Project History</h3></div>
        <div className="divide-y divide-slate-800/80">
          {projects.map(project => {
            const scans = history.filter(h => h.projectId === project.id);
            const latest = scans[0];
            return <div key={project.id} className="p-4 flex flex-col lg:flex-row lg:items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0"><div className="w-9 h-9 rounded-lg bg-cyan-950/60 border border-cyan-800/60 flex items-center justify-center"><FolderKanban className="w-4 h-4 text-cyan-400"/></div><div className="min-w-0"><div className="text-sm font-semibold text-white truncate">{project.name}</div><div className="text-[10px] text-slate-500 font-mono">{project.environment} · {scans.length} scan{scans.length===1?'':'s'}</div></div></div>
              <div className="flex items-center gap-5 text-xs"><span className="text-slate-400">Last scan: <b className="text-slate-200">{latest?.scanDate || project.lastScan || 'Never scanned'}</b></span><span className="text-slate-400">Risk: <b className="text-cyan-300">{latest ? `${latest.riskScore}/100` : project.securityScore == null ? '—' : `${project.securityScore}/100`}</b></span></div>
            </div>;
          })}
        </div>
      </div>

      <div className="rounded-xl border border-slate-800 bg-slate-900/90 overflow-hidden">
        <div className="p-4 border-b border-slate-800 flex items-center gap-2"><Clock3 className="w-4 h-4 text-cyan-400"/><h3 className="text-xs font-bold text-white uppercase tracking-wider">Scan Runs</h3></div>
        {history.length === 0 ? <div className="p-8 text-center text-xs text-slate-500">No scan runs yet. Start a scan to create history.</div> : <div className="divide-y divide-slate-800/80">{history.map(entry => { const report=reportFor(entry); return <div key={entry.id} className="p-4 flex flex-col lg:flex-row lg:items-center justify-between gap-3"><div><div className="text-sm font-semibold text-white">{entry.projectName}</div><div className="text-[10px] font-mono text-cyan-400 mt-1">{entry.scanId} · {entry.scanDate}</div></div><div className="flex items-center gap-4 text-xs"><span className="text-slate-400">{entry.endpointsScanned} endpoints</span><span className="text-rose-300">{entry.vulnerabilitiesFound} findings</span><span className="font-mono font-bold text-slate-200">Risk {entry.riskScore}/100</span>{report && <button onClick={()=>onViewReport(report)} className="inline-flex items-center gap-1 text-cyan-300 hover:text-cyan-200 font-semibold">View Report <ArrowRight className="w-3 h-3"/></button>}</div></div>})}</div>}
      </div>
    </div>
  );
};

const Stat = ({icon,label,value}:{icon:React.ReactNode;label:string;value:number}) => <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4"><div className="flex items-center gap-2 text-[10px] font-mono text-slate-500">{icon}{label}</div><div className="text-2xl font-bold text-white mt-2">{value}</div></div>;
