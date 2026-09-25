import React, { useState } from 'react';
import { FolderKanban, Plus, LockKeyhole, ShieldCheck, X, ArrowRight, Database, AlertTriangle, ScanLine } from 'lucide-react';
import { SecurityProject } from '../types';
import { PageId } from '../components/layout/Sidebar';

interface ProjectsPageProps {
  projects: SecurityProject[];
  onCreateProject: (name: string, description: string) => void;
  onOpenProject: (project: SecurityProject) => void;
  onNavigate: (page: PageId) => void;
}

export const ProjectsPage: React.FC<ProjectsPageProps> = ({ projects, onCreateProject, onOpenProject }) => {
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const create = () => {
    if (!name.trim()) return;
    onCreateProject(name.trim(), description.trim() || 'Authorized API security testing project.');
    setName('');
    setDescription('');
    setShowModal(false);
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">Security Projects</h2>
          <p className="text-xs text-slate-400 mt-1">Select a project to inspect its discovered endpoints, scan history, and active findings.</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center justify-center gap-2 px-3.5 py-2 rounded-lg bg-cyan-400 hover:bg-cyan-300 text-slate-950 text-xs font-bold shadow-md shadow-cyan-400/20 transition-colors interactive-btn"
          data-cursor-label="NEW PROJECT"
        >
          <Plus className="w-4 h-4" /> New Project
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {projects.map((project) => (
          <div key={project.id} className="group rounded-xl border border-slate-800 bg-slate-900/90 p-5 hover:border-cyan-800/70 transition-colors shadow-lg shadow-black/10">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3 min-w-0">
                <div className="w-9 h-9 rounded-lg bg-cyan-950/60 border border-cyan-800/70 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-4.5 h-4.5 text-cyan-400" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-bold text-white text-sm truncate">{project.name}</h3>
                  <span className="inline-flex mt-1 px-1.5 py-0.5 rounded bg-cyan-950/70 border border-cyan-900 text-[9px] font-mono text-cyan-300 uppercase tracking-wider">
                    {project.environment}
                  </span>
                </div>
              </div>
              <LockKeyhole className="w-3.5 h-3.5 text-slate-600 shrink-0" />
            </div>

            <p className="text-xs text-slate-400 mt-4 min-h-9 line-clamp-2">{project.description}</p>

            <div className="grid grid-cols-2 gap-2 mt-4">
              <Metric icon={<Database className="w-3.5 h-3.5" />} label="ENDPOINTS" value={project.endpoints ? `${project.endpoints} discovered` : 'Not uploaded'} />
              <Metric icon={<ShieldCheck className="w-3.5 h-3.5" />} label="SECURITY SCORE" value={project.securityScore == null ? 'Not Scanned' : `${project.securityScore}/100 (${project.grade})`} />
              <Metric icon={<AlertTriangle className="w-3.5 h-3.5" />} label="VULNERABILITIES" value={project.vulnerabilities ? `${project.vulnerabilities} detected` : '0'} />
              <Metric icon={<ScanLine className="w-3.5 h-3.5" />} label="SCANS" value={`${project.scans} executed`} />
            </div>

            <div className="flex items-center justify-between mt-5 pt-3 border-t border-slate-800">
              <span className="text-[10px] text-slate-500 font-mono">
                {project.lastScan ? `Last scan: ${project.lastScan}` : 'Never scanned'}
              </span>
              <button
                onClick={() => onOpenProject(project)}
                className="text-xs font-bold text-emerald-400 hover:text-emerald-300 inline-flex items-center gap-1 interactive-btn"
                data-cursor-label="OPEN PROJECT"
              >
                Open Project <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}

        <button
          onClick={() => setShowModal(true)}
          className="min-h-[300px] rounded-xl border border-dashed border-slate-800 bg-slate-950/30 hover:bg-slate-900/50 hover:border-cyan-900/70 transition-colors flex flex-col items-center justify-center gap-2 text-slate-500 interactive-btn"
          data-cursor-label="ADD PROJECT"
        >
          <div className="w-10 h-10 rounded-full border border-slate-700 flex items-center justify-center"><Plus className="w-5 h-5" /></div>
          <span className="text-xs font-semibold">Create another security project</span>
        </button>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-[80] bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4" onMouseDown={() => setShowModal(false)}>
          <div className="w-full max-w-md rounded-xl border border-slate-700 bg-slate-950 shadow-2xl shadow-black/50" onMouseDown={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between p-5 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-cyan-950/70 border border-cyan-800 flex items-center justify-center"><FolderKanban className="w-4 h-4 text-cyan-400" /></div>
                <div>
                  <h3 className="text-sm font-bold text-white">Create Security Project</h3>
                  <p className="text-[10px] text-slate-500 mt-0.5">Add an authorized API scope for defensive testing</p>
                </div>
              </div>
              <button onClick={() => setShowModal(false)} className="text-slate-500 hover:text-white interactive-btn" aria-label="Close"><X className="w-4 h-4" /></button>
            </div>

            <div className="p-5 space-y-4">
              <label className="block">
                <span className="text-[11px] font-semibold text-slate-300">Project Name<span className="text-rose-400">*</span></span>
                <input autoFocus value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. My E-Commerce API" className="mt-1.5 w-full px-3 py-2.5 rounded-lg bg-slate-900 border border-slate-800 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500" />
              </label>
              <label className="block">
                <span className="text-[11px] font-semibold text-slate-300">Description</span>
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={4} placeholder="Security testing for my authorized staging API..." className="mt-1.5 w-full px-3 py-2.5 rounded-lg bg-slate-900 border border-slate-800 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 resize-none" />
              </label>
            </div>

            <div className="flex items-center justify-end gap-2 px-5 py-4 border-t border-slate-800">
              <button onClick={() => setShowModal(false)} className="px-3.5 py-2 rounded-lg text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-900 interactive-btn">Cancel</button>
              <button disabled={!name.trim()} onClick={create} className="px-3.5 py-2 rounded-lg bg-cyan-400 disabled:bg-slate-800 disabled:text-slate-600 hover:bg-cyan-300 text-slate-950 text-xs font-bold transition-colors interactive-btn" data-cursor-label="CREATE">
                Create Project
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const Metric = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) => (
  <div className="rounded-lg border border-slate-800 bg-slate-950/50 p-2.5">
    <div className="flex items-center gap-1.5 text-[9px] text-slate-500 font-mono mb-1">{icon}{label}</div>
    <div className="text-[11px] font-semibold text-slate-200 truncate">{value}</div>
  </div>
);
