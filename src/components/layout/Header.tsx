import React, { useState, useRef, useEffect } from 'react';
import {
  Menu,
  Scan,
  ShieldCheck,
  Search,
  Terminal,
  User,
  LogOut,
  ChevronDown,
  Sparkles,
  Shield,
  KeyRound,
  ExternalLink,
  ShieldAlert,
  GitBranch,
  FileCheck2,
  Cpu,
} from 'lucide-react';
import { PageId } from './Sidebar';
import { useAuth, USER_ROLES_CATALOG } from '../../context/AuthContext';

interface HeaderProps {
  currentPage: PageId;
  onSelectPage: (page: PageId) => void;
  onToggleMobileMenu: () => void;
  onOpenQuickScan?: () => void;
  searchQuery?: string;
  onSearchChange?: (q: string) => void;
}

const PAGE_TITLES: Record<PageId, { title: string; subtitle: string }> = {
  landing: { title: 'Overview', subtitle: 'Zero-Trust Security Platform' },
  dashboard: { title: 'Security Dashboard', subtitle: 'Live API Surface & Threat Matrix' },
  scanner: { title: 'API Security Scanner', subtitle: 'Contract Ingestion & Automated Fuzzing' },
  inventory: { title: 'API Inventory', subtitle: 'Discovered Services & Auth Catalog' },
  vulnerabilities: { title: 'Vulnerabilities', subtitle: 'Severity-Ranked Findings & PoCs' },
  reports: { title: 'Audit Reports', subtitle: 'Executive Summaries & Compliance' },
  assistant: { title: 'SentinelAI Assistant', subtitle: 'Context-Aware API Defense Intelligence' },
  cicd: { title: 'CI/CD Pipelines', subtitle: 'Automated DevSecOps Shift-Left Gates' },
  settings: { title: 'Scanner Settings', subtitle: 'Policies, Rate Thresholds & Webhooks' },
};

export const Header: React.FC<HeaderProps> = ({
  currentPage,
  onSelectPage,
  onToggleMobileMenu,
  onOpenQuickScan,
  searchQuery = '',
  onSearchChange,
}) => {
  const currentInfo = PAGE_TITLES[currentPage] || { title: 'SentinelAPI', subtitle: 'Security Console' };
  const { user, isAuthenticated, logout, openAuthModal } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getProviderIcon = (provider?: string) => {
    if (provider === 'google') {
      return (
        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
          <path
            fill="#4285F4"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="#34A853"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="#FBBC05"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
          />
          <path
            fill="#EA4335"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
          />
        </svg>
      );
    }
    if (provider === 'github') {
      return (
        <svg className="w-3.5 h-3.5 fill-current text-white" viewBox="0 0 24 24">
          <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
        </svg>
      );
    }
    return <KeyRound className="w-3.5 h-3.5 text-cyan-400" />;
  };

  const getRoleIcon = (role?: string) => {
    switch (role) {
      case 'security_engineer':
        return <ShieldAlert className="w-3 h-3 text-rose-400" />;
      case 'devsecops':
        return <GitBranch className="w-3 h-3 text-cyan-400" />;
      case 'ciso_executive':
        return <FileCheck2 className="w-3 h-3 text-emerald-400" />;
      case 'api_developer':
        return <Cpu className="w-3 h-3 text-purple-400" />;
      default:
        return <Shield className="w-3 h-3 text-cyan-400" />;
    }
  };

  return (
    <header className="h-16 px-4 lg:px-6 bg-slate-950/70 backdrop-blur-xl border-b border-cyan-900/30 flex items-center justify-between sticky top-0 z-30 shadow-[0_4px_20px_rgba(0,0,0,0.4)]">
      {/* Left Zone: Mobile toggle + Breadcrumb & Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleMobileMenu}
          className="lg:hidden p-2 rounded text-slate-400 hover:text-white hover:bg-slate-900 focus:outline-none interactive-btn"
          aria-label="Toggle navigation"
          data-cursor-label="MENU"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span>SentinelAPI</span>
            <span>/</span>
            <span className="text-slate-200 font-medium">{currentInfo.title}</span>
          </div>
          <h1 className="text-sm font-semibold text-white tracking-tight hidden sm:block">
            {currentInfo.subtitle}
          </h1>
        </div>
      </div>

      {/* Middle/Right: Actions, Environment & User Profile */}
      <div className="flex items-center gap-3">
        {/* Search Bar on Dashboard & Vulnerabilities */}
        {(currentPage === 'dashboard' || currentPage === 'vulnerabilities' || currentPage === 'inventory') && (
          <div className="relative hidden md:block">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Filter endpoints, CVEs, or APIs..."
              value={searchQuery}
              onChange={(e) => onSearchChange?.(e.target.value)}
              className="w-52 lg:w-60 pl-8 pr-3 py-1.5 text-xs bg-slate-900 border border-slate-800 rounded text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors font-mono"
            />
          </div>
        )}

        {/* Sandbox Guard Indicator */}
        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded border border-emerald-900/60 bg-emerald-950/30 text-emerald-400 text-xs font-mono">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Safe Sandbox</span>
        </div>

        {/* Primary Scanner CTA */}
        {currentPage !== 'scanner' && (
          <button
            onClick={() => onSelectPage('scanner')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-xs transition-colors shadow-sm shadow-cyan-400/20 whitespace-nowrap interactive-btn"
            data-cursor-label="SCAN"
          >
            <Scan className="w-3.5 h-3.5" />
            <span>Start Scan</span>
          </button>
        )}

        {/* Authentication Options: User Menu or Sign In */}
        {isAuthenticated && user ? (
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2 p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 transition-colors text-left interactive-btn"
              data-cursor-label="PROFILE"
            >
              <div className="w-7 h-7 rounded-full bg-cyan-950 border border-cyan-800/80 flex items-center justify-center text-cyan-300 text-xs font-bold overflow-hidden">
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span>{user.name.charAt(0)}</span>
                )}
              </div>
              <div className="hidden xl:block">
                <div className="text-xs font-semibold text-white leading-none">{user.name}</div>
                <div className="text-[10px] text-slate-400 font-mono mt-0.5 flex items-center gap-1">
                  {getRoleIcon(user.userRole)}
                  <span>{user.roleTitle || user.organization}</span>
                </div>
              </div>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {/* User Dropdown */}
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-slate-900 border border-slate-700/80 rounded-lg shadow-2xl py-2 z-50 text-xs animate-fadeIn">
                <div className="px-3.5 py-2 border-b border-slate-800">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white truncate">{user.name}</span>
                    <span className="text-[9px] font-mono uppercase px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800">
                      {user.userRole ? USER_ROLES_CATALOG[user.userRole]?.badge : 'Active'}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 font-mono truncate">{user.email}</div>
                  <div className="text-[10px] text-slate-500 font-mono truncate mt-0.5">{user.roleTitle} · {user.organization}</div>
                  
                  <div className="mt-2 flex items-center gap-1.5">
                    <span className="p-1 rounded bg-slate-950 border border-slate-800">
                      {getProviderIcon(user.provider)}
                    </span>
                    <span className="text-[10px] font-mono text-cyan-400 capitalize">
                      Connected via {user.provider}
                    </span>
                  </div>
                </div>

                <div className="py-1">
                  <button
                    onClick={() => {
                      setIsDropdownOpen(false);
                      onSelectPage(user.targetDashboard || 'dashboard');
                    }}
                    className="w-full text-left px-3.5 py-2 hover:bg-slate-800 text-slate-200 flex items-center gap-2"
                  >
                    <Shield className="w-3.5 h-3.5 text-cyan-400" />
                    <span>My Role Dashboard ({user.userRole ? USER_ROLES_CATALOG[user.userRole]?.destinationLabel : 'Console'})</span>
                  </button>

                  <button
                    onClick={() => {
                      setIsDropdownOpen(false);
                      onSelectPage('settings');
                    }}
                    className="w-full text-left px-3.5 py-2 hover:bg-slate-800 text-slate-200 flex items-center gap-2"
                  >
                    <KeyRound className="w-3.5 h-3.5 text-cyan-400" />
                    <span>API Keys & Preferences</span>
                  </button>

                  <button
                    onClick={() => {
                      setIsDropdownOpen(false);
                      openAuthModal();
                    }}
                    className="w-full text-left px-3.5 py-2 hover:bg-slate-800 text-slate-200 flex items-center gap-2"
                  >
                    <User className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Switch Role / Portal</span>
                  </button>
                </div>

                <div className="pt-1 border-t border-slate-800">
                  <button
                    onClick={() => {
                      setIsDropdownOpen(false);
                      logout();
                    }}
                    className="w-full text-left px-3.5 py-2 hover:bg-rose-950/30 text-rose-400 flex items-center gap-2 transition-colors"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={() => openAuthModal()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-semibold transition-colors interactive-btn"
            data-cursor-label="SIGN IN"
          >
            <User className="w-3.5 h-3.5 text-cyan-400" />
            <span>Sign In</span>
          </button>
        )}
      </div>
    </header>
  );
};
