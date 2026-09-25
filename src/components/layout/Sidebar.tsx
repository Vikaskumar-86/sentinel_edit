import React from 'react';
import {
  ShieldAlert,
  LayoutDashboard,
  Scan,
  Database,
  AlertTriangle,
  FileText,
  History,
  Bot,
  GitBranch,
  Settings,
  ExternalLink,
  ChevronRight,
  Home,
  CheckCircle2,
  KeyRound,
  User,
  FolderKanban,
} from 'lucide-react';
import { useAuth, USER_ROLES_CATALOG } from '../../context/AuthContext';
import { SecurityProject } from '../../types';

export type PageId =
  | 'landing'
  | 'projects'
  | 'dashboard'
  | 'scanner'
  | 'inventory'
  | 'vulnerabilities'
  | 'reports'
  | 'scan-history'
  | 'assistant'
  | 'cicd'
  | 'settings';

interface SidebarProps {
  currentPage: PageId;
  onSelectPage: (page: PageId) => void;
  openCount: number;
  criticalCount: number;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
  activeProject?: SecurityProject | null;
}


export const Sidebar: React.FC<SidebarProps> = ({
  currentPage,
  onSelectPage,
  openCount,
  criticalCount,
  isOpenMobile = false,
  onCloseMobile,
  activeProject,
}) => {
  const { user, openAuthModal } = useAuth();

  const handleNavClick = (id: PageId) => {
    if (currentPage === id) return;
    onCloseMobile?.();
    onSelectPage(id);
  };

  const navItems: { id: PageId; label: string; icon: React.ReactNode; badge?: string; badgeColor?: string }[] = [
    {
      id: 'projects',
      label: 'Projects',
      icon: <FolderKanban className="w-4 h-4" />,
      badge: activeProject ? '1' : undefined,
      badgeColor: 'text-cyan-300 bg-cyan-950/60 border-cyan-800/60',
    },
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: <LayoutDashboard className="w-4 h-4" />,
    },
    {
      id: 'scanner',
      label: 'API Scanner',
      icon: <Scan className="w-4 h-4" />,
      badge: 'Live',
      badgeColor: 'text-emerald-400 bg-emerald-950/60 border-emerald-800/60',
    },
    {
      id: 'inventory',
      label: 'API Inventory',
      icon: <Database className="w-4 h-4" />,
    },
    {
      id: 'vulnerabilities',
      label: 'Vulnerabilities',
      icon: <AlertTriangle className="w-4 h-4" />,
      badge: `${criticalCount} Crit`,
      badgeColor: 'text-rose-400 bg-rose-950/60 border-rose-800/60',
    },
    {
      id: 'reports',
      label: 'Reports',
      icon: <FileText className="w-4 h-4" />,
    },
    {
      id: 'scan-history',
      label: 'Scan History',
      icon: <History className="w-4 h-4" />,
    },
    {
      id: 'assistant',
      label: 'AI Assistant',
      icon: <Bot className="w-4 h-4" />,
      badge: 'SentinelAI',
      badgeColor: 'text-cyan-400 bg-cyan-950/60 border-cyan-800/60',
    },
    {
      id: 'cicd',
      label: 'CI/CD Pipelines',
      icon: <GitBranch className="w-4 h-4" />,
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: <Settings className="w-4 h-4" />,
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      <aside
        className={`fixed lg:static top-0 bottom-0 left-0 z-50 w-64 h-screen max-h-screen bg-slate-950/80 backdrop-blur-2xl border-r border-cyan-900/30 flex flex-col justify-between overflow-y-auto overscroll-contain transition-transform duration-300 ease-out select-none shadow-[4px_0_24px_rgba(0,0,0,0.4)] ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Top: Brand */}
        <div>
          <div className="h-16 px-5 flex items-center justify-between border-b border-slate-800/80">
            <button
              onClick={() => handleNavClick('landing')}
              className="flex items-center gap-2.5 text-left group interactive-btn"
              data-cursor-label="HOME"
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-emerald-500 flex items-center justify-center text-slate-950 shadow-md shadow-cyan-500/20">
                <ShieldAlert className="w-5 h-5 text-slate-950 stroke-[2.4]" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-bold tracking-tight text-white text-base font-mono">
                    Sentinel<span className="text-cyan-400">API</span>
                  </span>
                </div>
                <div className="text-[10px] text-slate-400 tracking-wider font-mono uppercase">Zero-Trust Scanner</div>
              </div>
            </button>

            <button
              onClick={() => handleNavClick('landing')}
              title="View Public Landing Page"
              className={`p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900 transition-colors interactive-btn ${
                currentPage === 'landing' ? 'text-cyan-400 bg-slate-900' : ''
              }`}
              data-cursor-label="OVERVIEW"
            >
              <Home className="w-4 h-4" />
            </button>
          </div>

          {/* Active Persona or Role Selector banner */}
          {user ? (
            <div className="px-3.5 py-2.5 mx-3 mt-3 rounded-xl border border-cyan-500/30 bg-cyan-950/20 text-xs">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Active Portal</span>
                <span className="text-[10px] font-mono text-cyan-300 font-bold px-1.5 py-0.5 rounded bg-cyan-950 border border-cyan-800">
                  {USER_ROLES_CATALOG[user.userRole]?.badge || 'Portal'}
                </span>
              </div>
              <div className="font-bold text-white text-xs truncate">
                {user.roleTitle}
              </div>
              <button
                onClick={() => openAuthModal()}
                className="text-[10px] font-mono text-cyan-400 hover:underline mt-1.5 block"
              >
                Switch Role / Portal ❯
              </button>
            </div>
          ) : (
            <div className="px-3.5 py-2.5 mx-3 mt-3 rounded-xl border border-slate-800 bg-slate-900/60 text-xs">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Zero-Trust Access</span>
                <span className="text-emerald-400 flex items-center gap-1 font-mono text-[10px]">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Ready
                </span>
              </div>
              <button
                onClick={() => openAuthModal()}
                className="w-full mt-1 py-1.5 px-2 rounded-lg bg-cyan-950/70 hover:bg-cyan-900/80 text-cyan-300 border border-cyan-800/80 text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-colors interactive-btn"
                data-cursor-label="SIGN IN"
              >
                <KeyRound className="w-3 h-3 text-cyan-400" />
                <span>Choose Role Sign-In</span>
              </button>
            </div>
          )}

          {/* Active Project */}
          <div className="mx-3 mt-3 rounded-xl border border-slate-800 bg-slate-900/60 p-3">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[9px] font-mono text-slate-500 uppercase tracking-wider">Active Project</span>
              <FolderKanban className="w-3 h-3 text-cyan-500" />
            </div>
            <div className="text-xs font-bold text-white truncate">{activeProject?.name || 'SentinelAPI Demo Sandbox'}</div>
            <div className="text-[10px] text-emerald-400 font-mono mt-1 flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> {activeProject?.environment || 'Demo Sandbox'}</div>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1 mt-1">
            {navItems.map((item) => {
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all interactive-btn ${
                    isActive
                      ? 'bg-cyan-500/15 text-cyan-300 border-l-2 border-cyan-400 pl-[10px] font-semibold shadow-[inset_0_0_12px_rgba(6,182,212,0.1)]'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900/70'
                  }`}
                  data-cursor-label={item.label.toUpperCase()}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <span className={isActive ? 'text-cyan-400' : 'text-slate-500'}>
                      {item.icon}
                    </span>
                    <span className="truncate">{item.label}</span>
                  </div>

                  {item.badge && (
                    <span
                      className={`text-[10px] font-mono px-1.5 py-0.5 rounded border ${
                        item.badgeColor || 'text-slate-400 border-slate-800 bg-slate-900'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Section */}
        <div className="p-4 border-t border-slate-800/80">
          <div className="bg-slate-900/80 rounded-xl p-3 border border-slate-800 text-xs shadow-inner">
            <div className="flex items-center justify-between text-slate-300 mb-1">
              <span className="font-semibold">Security Posture</span>
              <span className="font-mono text-amber-400 text-xs font-bold">Grade C+</span>
            </div>
            <p className="text-[11px] text-slate-400 mb-2.5">
              {openCount} unresolved findings require patch verification.
            </p>
            <button
              onClick={() => {
                onSelectPage('scanner');
                onCloseMobile?.();
              }}
              className="w-full py-2 px-2.5 rounded-lg bg-cyan-400 hover:bg-cyan-300 text-slate-950 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-md shadow-cyan-400/20 interactive-btn"
              data-cursor-label="FUZZER"
            >
              <Scan className="w-3.5 h-3.5" />
              <span>Launch Scan</span>
            </button>
          </div>

          <div className="mt-3 flex items-center justify-between text-[11px] text-slate-500 px-1 font-mono">
            <span>SentinelAPI v2.4</span>
            <span className="flex items-center gap-1 text-emerald-400">
              <CheckCircle2 className="w-3 h-3" /> Zero-Trust
            </span>
          </div>
        </div>
      </aside>
    </>
  );
};
