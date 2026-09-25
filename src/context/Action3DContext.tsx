import React, { createContext, useContext, useState, useCallback, useRef } from 'react';
import {
  Scan,
  Shield,
  UploadCloud,
  KeyRound,
  CheckCircle2,
  Lock,
  Cpu,
  Layers,
  Sparkles,
  LayoutDashboard,
  Database,
  AlertTriangle,
  FileText,
  Bot,
  GitBranch,
  Settings,
  Compass,
} from 'lucide-react';

export type ActionIconType =
  | 'scan'
  | 'auth'
  | 'upload'
  | 'security'
  | 'login'
  | 'nav'
  | 'card'
  | 'inspect';

export interface Action3DOptions {
  title: string;
  subtitle?: string;
  category?: string;
  iconType?: ActionIconType;
  durationMs?: number;
  onComplete?: () => void;
}

interface Action3DContextType {
  trigger3DAction: (options: Action3DOptions) => Promise<void>;
  is3DActive: boolean;
}

const Action3DContext = createContext<Action3DContextType | undefined>(undefined);

export const Action3DProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeAction, setActiveAction] = useState<Action3DOptions | null>(null);
  const [progress, setProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState('');
  const [isClosing, setIsClosing] = useState(false);
  const timeoutRef = useRef<number | null>(null);

  const getPhaseMessage = (percent: number, iconType: ActionIconType = 'security') => {
    if (percent < 30) {
      if (iconType === 'auth') return 'Establishing Zero-Trust Handshake...';
      if (iconType === 'scan') return 'Compiling Target Introspection Vector...';
      if (iconType === 'upload') return 'Sanitizing Specification Payload...';
      if (iconType === 'nav') return 'Rerouting Security Telemetry Plane...';
      if (iconType === 'inspect') return 'Extracting Deep CVSS Attack Vector...';
      return 'Initializing Isolated Session...';
    } else if (percent < 75) {
      if (iconType === 'auth') return 'Verifying Token Signatures & Identity Claims...';
      if (iconType === 'scan') return 'Synthesizing Fuzzing Payloads & Attack Matrix...';
      if (iconType === 'upload') return 'Validating OpenAPI 3.1 Contract Graph...';
      if (iconType === 'nav') return 'Synchronizing Zero-Trust Telemetry Bus...';
      if (iconType === 'inspect') return 'Auditing Exploit Chain & Remediation Snippet...';
      return 'Applying Multi-Tenant Isolation Controls...';
    } else {
      if (iconType === 'auth') return 'Identity Confirmed · Redirecting to Portal...';
      if (iconType === 'scan') return 'Security Engine Engaged · Live Fuzzing Ready...';
      if (iconType === 'upload') return 'Specification Ingested Successfully...';
      if (iconType === 'nav') return 'Workspace Swapped · View In Focus...';
      if (iconType === 'inspect') return 'Inspection Ready...';
      return 'Session Ready · Transitioning...';
    }
  };

  const trigger3DAction = useCallback((options: Action3DOptions): Promise<void> => {
    return new Promise((resolve) => {
      const duration = options.durationMs || 1200;
      setActiveAction(options);
      setProgress(0);
      setIsClosing(false);
      setStatusMessage(getPhaseMessage(0, options.iconType));

      const startTime = Date.now();
      const interval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const currentPercent = Math.min(100, Math.round((elapsed / duration) * 100));
        setProgress(currentPercent);
        setStatusMessage(getPhaseMessage(currentPercent, options.iconType));

        if (elapsed >= duration) {
          clearInterval(interval);
          setIsClosing(true);

          // Smooth exit transition before unmounting
          timeoutRef.current = window.setTimeout(() => {
            setActiveAction(null);
            setIsClosing(false);
            if (options.onComplete) {
              options.onComplete();
            }
            resolve();
          }, 240);
        }
      }, 25);
    });
  }, []);

  const renderIcon = (type: ActionIconType = 'security') => {
    switch (type) {
      case 'scan':
        return <Scan className="w-9 h-9 text-cyan-400 animate-pulse" />;
      case 'auth':
      case 'login':
        return <KeyRound className="w-9 h-9 text-emerald-400 animate-pulse" />;
      case 'upload':
        return <UploadCloud className="w-9 h-9 text-purple-400 animate-pulse" />;
      case 'nav':
        return <Compass className="w-9 h-9 text-cyan-300 animate-spin" style={{ animationDuration: '6s' }} />;
      case 'inspect':
        return <AlertTriangle className="w-9 h-9 text-rose-400 animate-pulse" />;
      default:
        return <Shield className="w-9 h-9 text-cyan-400 animate-pulse" />;
    }
  };

  return (
    <Action3DContext.Provider value={{ trigger3DAction, is3DActive: !!activeAction }}>
      {children}

      {/* 3D Modern Interaction Modal / Viewport with Strong Smooth Backdrop Blur */}
      {activeAction && (
        <div
          className={`fixed inset-0 z-[99998] flex items-center justify-center p-4 transition-all duration-300 ease-out select-none ${
            isClosing ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
          }`}
          style={{
            backdropFilter: 'blur(28px) saturate(180%)',
            WebkitBackdropFilter: 'blur(28px) saturate(180%)',
            backgroundColor: 'rgba(2, 6, 23, 0.82)',
          }}
        >
          {/* 3D Depth Perspective Stage */}
          <div
            className="relative w-full max-w-lg mx-auto"
            style={{
              perspective: '1400px',
              perspectiveOrigin: '50% 50%',
            }}
          >
            {/* Holographic Glowing 3D Orbit Rings */}
            <div className="absolute -inset-14 flex items-center justify-center pointer-events-none opacity-50">
              <div className="w-80 h-80 rounded-full border border-cyan-400/40 animate-spin-3d shadow-[0_0_30px_rgba(6,182,212,0.3)]" />
              <div
                className="absolute w-96 h-96 rounded-full border border-emerald-400/30 animate-spin-3d shadow-[0_0_40px_rgba(16,185,129,0.2)]"
                style={{ animationDirection: 'reverse', animationDuration: '14s' }}
              />
              <div className="absolute w-64 h-64 rounded-full border border-purple-500/20 animate-ping opacity-25" />
            </div>

            {/* Main 3D Pop-Out Card with Sharp Focus, Depth, Glow, and Shadow */}
            <div
              className="relative bg-gradient-to-b from-slate-900 via-[#0a1128] to-slate-950 border border-cyan-400/60 rounded-3xl p-6 sm:p-8 shadow-[0_30px_100px_-10px_rgba(6,182,212,0.5),0_0_50px_rgba(6,182,212,0.25)] transition-all duration-300 transform-gpu"
              style={{
                transform: 'rotateX(7deg) rotateY(-3deg) translateZ(50px) scale(1.02)',
                transformStyle: 'preserve-3d',
              }}
            >
              {/* Corner Sci-Fi Tech Reticle Accents */}
              <div className="absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2 border-cyan-400 shadow-[0_0_8px_#22d3ee]" />
              <div className="absolute top-3 right-3 w-4 h-4 border-t-2 border-r-2 border-cyan-400 shadow-[0_0_8px_#22d3ee]" />
              <div className="absolute bottom-3 left-3 w-4 h-4 border-b-2 border-l-2 border-cyan-400 shadow-[0_0_8px_#22d3ee]" />
              <div className="absolute bottom-3 right-3 w-4 h-4 border-b-2 border-r-2 border-cyan-400 shadow-[0_0_8px_#22d3ee]" />

              {/* Ambient Neon Backing Light Beam */}
              <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-64 h-24 bg-cyan-500/25 blur-3xl rounded-full pointer-events-none" />

              {/* Top Category & Status Header */}
              <div className="flex items-center justify-between border-b border-cyan-900/40 pb-3.5 mb-6">
                <div className="flex items-center gap-2.5">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-500" />
                  </span>
                  <span className="text-[11px] font-mono font-bold tracking-widest text-cyan-300 uppercase">
                    {activeAction.category || 'SENTINEL ENGINE · ZERO-TRUST PROTOCOL'}
                  </span>
                </div>
                <div className="px-2.5 py-0.5 rounded-full bg-cyan-950/80 border border-cyan-700/60 text-xs font-mono font-bold text-cyan-300 tabular-nums shadow-inner">
                  {progress}%
                </div>
              </div>

              {/* 3D Center Pop-Out Node */}
              <div className="relative flex flex-col items-center text-center my-3">
                <div
                  className="w-22 h-22 rounded-2xl bg-slate-950/90 border-2 border-cyan-400 flex items-center justify-center shadow-[0_0_40px_rgba(6,182,212,0.45),inset_0_0_20px_rgba(6,182,212,0.2)] mb-4 relative overflow-hidden group"
                  style={{
                    transform: 'translateZ(60px)',
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/20 via-transparent to-emerald-500/20" />
                  {renderIcon(activeAction.iconType)}
                </div>

                <h3
                  className="text-xl sm:text-2xl font-black text-white tracking-tight drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]"
                  style={{ transform: 'translateZ(45px)' }}
                >
                  {activeAction.title}
                </h3>

                {activeAction.subtitle && (
                  <p
                    className="text-xs sm:text-sm text-slate-300 mt-1.5 max-w-sm leading-relaxed font-mono"
                    style={{ transform: 'translateZ(30px)' }}
                  >
                    {activeAction.subtitle}
                  </p>
                )}
              </div>

              {/* Dynamic Status Log Terminal */}
              <div
                className="mt-6 p-3 rounded-xl bg-slate-950/90 border border-slate-800 shadow-inner text-center"
                style={{ transform: 'translateZ(25px)' }}
              >
                <div className="text-xs font-mono text-cyan-300 flex items-center justify-center gap-2">
                  <Cpu className="w-4 h-4 text-cyan-400 animate-spin" style={{ animationDuration: '3s' }} />
                  <span className="truncate">{statusMessage}</span>
                </div>
              </div>

              {/* Glowing High-Tech Neon Progress Bar */}
              <div className="mt-4 relative w-full h-2.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800 shadow-inner">
                <div
                  className="h-full bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400 transition-all duration-75 rounded-full shadow-[0_0_16px_#22d3ee]"
                  style={{ width: `${progress}%` }}
                />
              </div>

              <div className="mt-3 flex items-center justify-between text-[11px] font-mono text-slate-400">
                <span className="flex items-center gap-1">
                  <Lock className="w-3 h-3 text-cyan-400" />
                  <span>ENCRYPTED SEC-CHANNEL</span>
                </span>
                <span className="text-emerald-400 font-bold">ACTIVE · 3D PERSPECTIVE</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </Action3DContext.Provider>
  );
};

export const useAction3D = () => {
  const context = useContext(Action3DContext);
  if (!context) {
    throw new Error('useAction3D must be used within an Action3DProvider');
  }
  return context;
};
