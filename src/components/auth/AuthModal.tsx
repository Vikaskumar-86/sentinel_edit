import React, { useState } from 'react';
import {
  X,
  Shield,
  ShieldAlert,
  GitBranch,
  FileCheck2,
  Cpu,
  CheckCircle2,
  Loader2,
  Mail,
  ArrowRight,
  KeyRound,
  ShieldCheck,
  Check,
  ExternalLink,
  ChevronRight,
  UserCheck,
  Lock,
  Building,
  Sparkles,
} from 'lucide-react';
import { useAuth, UserRole, USER_ROLES_CATALOG } from '../../context/AuthContext';
import { useAction3D } from '../../context/Action3DContext';
import { PageId } from '../layout/Sidebar';

interface AuthModalProps {
  onSuccessNavigate?: (page: PageId) => void;
}

type OAuthFlow = 'none' | 'google_accounts' | 'google_confirm' | 'github_accounts' | 'github_auth' | 'microsoft_auth' | 'email_otp';

interface GoogleAccountOption {
  email: string;
  name: string;
  avatar: string;
  badge?: string;
}

interface GitHubAccountOption {
  username: string;
  email: string;
  avatar: string;
  badge?: string;
}

const GITHUB_ACCOUNTS: GitHubAccountOption[] = [
  {
    username: 'vikas-secops',
    email: 'vikaskumar868903@gmail.com',
    avatar: 'https://github.com/identicons/vikas-secops.png',
    badge: 'Personal GitHub Account',
  },
  {
    username: 'sentinel-red-team',
    email: 'security@sentinelapi.dev',
    avatar: 'https://github.com/identicons/sentinel-red-team.png',
    badge: 'Enterprise Organization',
  },
];

const GOOGLE_ACCOUNTS: GoogleAccountOption[] = [
  {
    name: 'Vikas Kumar',
    email: 'vikaskumar868903@gmail.com',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    badge: 'Personal Google Account',
  },
  {
    name: 'Vikas Kumar (SecOps)',
    email: 'v.kumar@cyberdefense.org',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
    badge: 'Enterprise Workspace',
  },
];

export const AuthModal: React.FC<AuthModalProps> = ({ onSuccessNavigate }) => {
  const {
    isAuthModalOpen,
    closeAuthModal,
    selectedRoleForModal,
    loginAsRole,
  } = useAuth();

  const { trigger3DAction } = useAction3D();

  const [activeRole, setActiveRole] = useState<UserRole>(
    selectedRoleForModal || 'security_engineer'
  );

  const [activeFlow, setActiveFlow] = useState<OAuthFlow>('none');
  const [selectedGoogleAccount, setSelectedGoogleAccount] = useState<GoogleAccountOption>(GOOGLE_ACCOUNTS[0]);
  const [selectedGitHubAccount, setSelectedGitHubAccount] = useState<GitHubAccountOption>(GITHUB_ACCOUNTS[0]);
  const [customGoogleEmail, setCustomGoogleEmail] = useState('');
  const [isCustomEmailActive, setIsCustomEmailActive] = useState(false);

  // Microsoft account state
  const [msAccountEmail, setMsAccountEmail] = useState('vikas.kumar@enterprise-cloud.onmicrosoft.com');

  // GitHub organization / account
  const [githubOrg, setGithubOrg] = useState('sentinel-red-team');

  // Email OTP state
  const [emailInput, setEmailInput] = useState('');
  const [otpDigits, setOtpDigits] = useState(['7', '4', '9', '2', '0', '1']);

  React.useEffect(() => {
    if (selectedRoleForModal) {
      setActiveRole(selectedRoleForModal);
    }
  }, [selectedRoleForModal]);

  if (!isAuthModalOpen) return null;

  const currentRoleMeta = USER_ROLES_CATALOG[activeRole];

  // Helper to complete authentication and trigger 3D transition
  const finalizeAuth = async (
    provider: 'google' | 'github' | 'microsoft' | 'email',
    userEmail: string,
    actionTitle: string
  ) => {
    // 3D transition effect with slight background blur & depth
    await trigger3DAction({
      title: actionTitle,
      subtitle: `Authenticating ${userEmail} · Role: ${currentRoleMeta.title}`,
      category: 'IDENTITY & ACCESS HANDSHAKE',
      iconType: 'auth',
      durationMs: 1400,
      onComplete: () => {
        const dest = loginAsRole(activeRole, provider, userEmail);
        setActiveFlow('none');
        if (onSuccessNavigate) {
          onSuccessNavigate(dest);
        }
      },
    });
  };

  const getRoleIcon = (role: UserRole) => {
    switch (role) {
      case 'security_engineer':
        return <ShieldAlert className="w-4 h-4 text-rose-400" />;
      case 'devsecops':
        return <GitBranch className="w-4 h-4 text-cyan-400" />;
      case 'ciso_executive':
        return <FileCheck2 className="w-4 h-4 text-emerald-400" />;
      case 'api_developer':
        return <Cpu className="w-4 h-4 text-purple-400" />;
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto transition-all duration-300 animate-fadeIn select-none"
      style={{
        backdropFilter: 'blur(28px) saturate(180%)',
        WebkitBackdropFilter: 'blur(28px) saturate(180%)',
        backgroundColor: 'rgba(2, 6, 23, 0.85)',
      }}
    >
      <div
        className="relative w-full max-w-xl bg-gradient-to-b from-slate-900 via-slate-900/98 to-slate-950 border border-cyan-500/50 rounded-2xl shadow-[0_30px_90px_-15px_rgba(6,182,212,0.45),0_0_40px_rgba(6,182,212,0.15)] overflow-hidden flex flex-col max-h-[92vh] transition-all duration-300 transform-gpu"
        style={{
          transform: 'perspective(1400px) translateZ(30px) scale(1)',
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Top Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 bg-slate-950/90 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-cyan-950/80 border border-cyan-800 flex items-center justify-center text-cyan-400 shadow-inner">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-white tracking-tight">
                Role-Based Identity Gate
              </h2>
              <p className="text-[11px] text-slate-400 font-mono">
                Dedicated portals for Security Engineers, DevSecOps, CISOs, and Developers
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              setActiveFlow('none');
              closeAuthModal();
            }}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors interactive-btn"
            data-cursor-label="CLOSE"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="overflow-y-auto p-4 sm:p-6 space-y-6 flex-1">
          {/* FLOW: GOOGLE SIGN-IN FLOW */}
          {activeFlow === 'google_accounts' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="text-center pb-2">
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center mx-auto shadow-md mb-2">
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                  </svg>
                </div>
                <h3 className="text-sm font-bold text-white">Choose an account</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  to continue to <strong className="text-cyan-400">SentinelAPI</strong>
                </p>
              </div>

              {/* Account list */}
              <div className="space-y-2 border border-slate-800 rounded-xl overflow-hidden bg-slate-950/60 p-2">
                {GOOGLE_ACCOUNTS.map((acc, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => {
                      setSelectedGoogleAccount(acc);
                      setIsCustomEmailActive(false);
                      setActiveFlow('google_confirm');
                    }}
                    className="w-full p-3 rounded-lg flex items-center justify-between hover:bg-slate-800/80 transition-all text-left interactive-btn group"
                    data-cursor-label="SELECT"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={acc.avatar}
                        alt={acc.name}
                        referrerPolicy="no-referrer"
                        className="w-9 h-9 rounded-full object-cover border border-slate-700"
                      />
                      <div>
                        <div className="text-xs font-semibold text-white group-hover:text-cyan-300">
                          {acc.name}
                        </div>
                        <div className="text-[11px] text-slate-400 font-mono">{acc.email}</div>
                        {acc.badge && (
                          <div className="text-[9px] text-emerald-400 font-mono mt-0.5">{acc.badge}</div>
                        )}
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400" />
                  </button>
                ))}

                {/* Custom account input */}
                <div className="pt-2 border-t border-slate-800">
                  {isCustomEmailActive ? (
                    <div className="p-2 space-y-2">
                      <label className="text-[11px] text-slate-300 font-medium block">
                        Enter your Google/Gmail address:
                      </label>
                      <input
                        type="email"
                        autoFocus
                        placeholder="yourname@gmail.com"
                        value={customGoogleEmail}
                        onChange={(e) => setCustomGoogleEmail(e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-slate-900 border border-slate-700 rounded-lg text-white font-mono focus:border-cyan-500 focus:outline-none"
                      />
                      <button
                        type="button"
                        disabled={!customGoogleEmail}
                        onClick={() => {
                          setSelectedGoogleAccount({
                            name: customGoogleEmail.split('@')[0],
                            email: customGoogleEmail,
                            avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
                            badge: 'Custom Google Account',
                          });
                          setActiveFlow('google_confirm');
                        }}
                        className="w-full py-2 rounded-lg bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-xs transition-colors interactive-btn"
                        data-cursor-label="NEXT"
                      >
                        Continue with this account
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setIsCustomEmailActive(true)}
                      className="w-full p-2.5 text-xs text-slate-400 hover:text-white flex items-center gap-2 hover:bg-slate-900 rounded-lg transition-colors font-mono"
                    >
                      <UserCheck className="w-4 h-4 text-cyan-400" />
                      <span>Use another Google account</span>
                    </button>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveFlow('none')}
                  className="hover:text-slate-300"
                >
                  ← Back to roles
                </button>
                <span>Google Identity Services</span>
              </div>
            </div>
          )}

          {/* FLOW: GOOGLE CONFIRMATION */}
          {activeFlow === 'google_confirm' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="text-center pb-2">
                <div className="w-12 h-12 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center mx-auto mb-2 overflow-hidden">
                  <img
                    src={selectedGoogleAccount.avatar}
                    alt={selectedGoogleAccount.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-sm font-bold text-white">{selectedGoogleAccount.name}</h3>
                <p className="text-xs text-slate-400 font-mono">{selectedGoogleAccount.email}</p>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="text-xs font-semibold text-slate-200">
                  SentinelAPI will receive access to:
                </div>
                <div className="space-y-1.5 text-[11px] text-slate-300 font-mono">
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Basic profile info (Name, profile photo, user ID)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Verified email address ({selectedGoogleAccount.email})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Assign portal role: <strong className="text-cyan-300">{currentRoleMeta.title}</strong></span>
                  </div>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setActiveFlow('google_accounts')}
                  className="px-3 py-2 text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() =>
                    finalizeAuth(
                      'google',
                      selectedGoogleAccount.email,
                      'Google Authentication Handshake'
                    )
                  }
                  className="px-5 py-2.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-xs flex items-center gap-2 transition-all shadow-md interactive-btn"
                  data-cursor-label="CONTINUE"
                >
                  <span>Continue to {currentRoleMeta.destinationLabel}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* FLOW: GITHUB ACCOUNT SELECTION */}
          {activeFlow === 'github_accounts' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="text-center pb-2">
                <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center mx-auto shadow-md mb-2 text-white">
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                  </svg>
                </div>
                <h3 className="text-sm font-bold text-white">Choose a GitHub account</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  to continue to <strong className="text-cyan-400">SentinelAPI</strong>
                </p>
              </div>

              <div className="space-y-2 border border-slate-800 rounded-xl overflow-hidden bg-slate-950/60 p-2">
                {GITHUB_ACCOUNTS.map((acc, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => {
                      setSelectedGitHubAccount(acc);
                      setActiveFlow('github_auth');
                    }}
                    className="w-full p-3 rounded-lg flex items-center justify-between hover:bg-slate-800/80 transition-all text-left interactive-btn group"
                    data-cursor-label="SELECT"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={acc.avatar}
                        alt={acc.username}
                        className="w-9 h-9 rounded-full object-cover border border-slate-700 bg-slate-900"
                      />
                      <div>
                        <div className="text-xs font-semibold text-white group-hover:text-cyan-300">
                          @{acc.username}
                        </div>
                        <div className="text-[11px] text-slate-400 font-mono">{acc.email}</div>
                        {acc.badge && (
                          <div className="text-[9px] text-emerald-400 font-mono mt-0.5">{acc.badge}</div>
                        )}
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400" />
                  </button>
                ))}
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveFlow('none')}
                  className="hover:text-slate-300"
                >
                  ← Back to providers
                </button>
                <span>GitHub OAuth</span>
              </div>
            </div>
          )}

          {/* FLOW: GITHUB AUTH */}
          {activeFlow === 'github_auth' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="text-center pb-2">
                <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center mx-auto shadow-md mb-2 text-white">
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                  </svg>
                </div>
                <h3 className="text-sm font-bold text-white">Authorize SentinelAPI with GitHub</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Signed in as <strong className="text-cyan-400">@{selectedGitHubAccount.username}</strong>
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                <div>
                  <label className="text-[11px] text-slate-400 font-mono block mb-1">
                    Select Target Organization / Repository Access:
                  </label>
                  <select
                    value={githubOrg}
                    onChange={(e) => setGithubOrg(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-900 border border-slate-700 rounded-lg text-white font-mono focus:border-cyan-500 focus:outline-none"
                  >
                    <option value="sentinel-red-team">github.com/sentinel-red-team (Enterprise)</option>
                    <option value="personal-dev">github.com/vikas-secops (Personal)</option>
                    <option value="cloud-platform-ops">github.com/cloud-platform-ops (Org)</option>
                  </select>
                </div>

                <div className="pt-2 border-t border-slate-800 space-y-1 text-[11px] text-slate-300 font-mono">
                  <div className="text-slate-400 font-semibold mb-1">Requested Permissions:</div>
                  <div className="flex items-center gap-2 text-slate-300">
                    <Check className="w-3.5 h-3.5 text-cyan-400" />
                    <span>read:user (email and profile)</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-300">
                    <Check className="w-3.5 h-3.5 text-cyan-400" />
                    <span>repo:status (automated CI/CD SARIF check runs)</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-300">
                    <Check className="w-3.5 h-3.5 text-cyan-400" />
                    <span>security_events (SARIF vulnerability report sync)</span>
                  </div>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setActiveFlow('none')}
                  className="px-3 py-2 text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() =>
                    finalizeAuth(
                      'github',
                      selectedGitHubAccount.email,
                      'GitHub OAuth Authorization'
                    )
                  }
                  className="px-5 py-2.5 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold text-xs flex items-center gap-2 transition-all shadow-md interactive-btn"
                  data-cursor-label="AUTHORIZE"
                >
                  <span>Authorize & Open {currentRoleMeta.destinationLabel}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* FLOW: MICROSOFT AUTH */}
          {activeFlow === 'microsoft_auth' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="text-center pb-2">
                <div className="w-10 h-10 rounded bg-slate-800 flex items-center justify-center mx-auto shadow-md mb-2">
                  <svg className="w-5 h-5" viewBox="0 0 23 23">
                    <path fill="#f35325" d="M1 1h10v10H1z" />
                    <path fill="#81bc06" d="M12 1h10v10H12z" />
                    <path fill="#05a6f0" d="M1 12h10v10H1z" />
                    <path fill="#ffba08" d="M12 12h10v10H12z" />
                  </svg>
                </div>
                <h3 className="text-sm font-bold text-white">Microsoft Azure Active Directory</h3>
                <p className="text-xs text-slate-400 mt-0.5">Enterprise Single Sign-On (SSO)</p>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                <div>
                  <label className="text-[11px] text-slate-400 font-mono block mb-1">
                    Corporate Microsoft Account:
                  </label>
                  <input
                    type="email"
                    value={msAccountEmail}
                    onChange={(e) => setMsAccountEmail(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-900 border border-slate-700 rounded-lg text-white font-mono focus:border-cyan-500 focus:outline-none"
                  />
                </div>

                <div className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-900 text-xs text-slate-300">
                  <Lock className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>Azure AD Multi-Factor Authentication (MFA) Protected</span>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setActiveFlow('none')}
                  className="px-3 py-2 text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() =>
                    finalizeAuth(
                      'microsoft',
                      msAccountEmail,
                      'Microsoft Azure AD SSO Exchange'
                    )
                  }
                  className="px-5 py-2.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-xs flex items-center gap-2 transition-all shadow-md interactive-btn"
                  data-cursor-label="SIGN IN"
                >
                  <span>Sign In with Microsoft</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* FLOW: EMAIL OTP FLOW */}
          {activeFlow === 'email_otp' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="text-center pb-2">
                <div className="w-10 h-10 rounded-full bg-cyan-950 border border-cyan-800 flex items-center justify-center mx-auto shadow-md mb-2 text-cyan-400">
                  <Mail className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-white">Enter 6-Digit Verification Code</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Sent to <strong className="text-cyan-300">{emailInput || 'security.specialist@enterprise.com'}</strong>
                </p>
              </div>

              {/* 6 Digit Box Display */}
              <div className="flex items-center justify-center gap-2 py-3">
                {otpDigits.map((digit, idx) => (
                  <input
                    key={idx}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => {
                      const newDigits = [...otpDigits];
                      newDigits[idx] = e.target.value;
                      setOtpDigits(newDigits);
                    }}
                    className="w-10 h-12 text-center text-lg font-mono font-bold bg-slate-950 border border-cyan-500/50 rounded-lg text-cyan-300 focus:outline-none focus:border-cyan-400 shadow-inner"
                  />
                ))}
              </div>

              <div className="text-center">
                <span className="text-[11px] text-slate-500 font-mono">
                  Code expires in 04:59 · <button type="button" className="text-cyan-400 hover:underline">Resend code</button>
                </span>
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setActiveFlow('none')}
                  className="px-3 py-2 text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() =>
                    finalizeAuth(
                      'email',
                      emailInput || 'specialist@sentinelapi.dev',
                      'Magic Verification Code Check'
                    )
                  }
                  className="px-5 py-2.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-xs flex items-center gap-2 transition-all shadow-md interactive-btn"
                  data-cursor-label="VERIFY"
                >
                  <span>Verify Code & Enter</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* MAIN SELECTION VIEW (When no subflow is active) */}
          {activeFlow === 'none' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="text-center pb-1">
                <h3 className="text-base font-bold text-white">Sign in to SentinelAPI</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Choose an account provider to continue
                </p>
              </div>

              <div className="space-y-2.5">
                {/* Google */}
                <button
                  type="button"
                  onClick={() => setActiveFlow('google_accounts')}
                  className="w-full p-3.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-all flex items-center justify-center gap-3 group interactive-btn shadow-sm"
                  data-cursor-label="GOOGLE"
                >
                  <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center shrink-0">
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                    </svg>
                  </div>
                  <span className="text-sm font-semibold text-slate-800">Continue with Google</span>
                </button>

                {/* GitHub */}
                <button
                  type="button"
                  onClick={() => setActiveFlow('github_accounts')}
                  className="w-full p-3.5 rounded-xl bg-black border border-black hover:bg-slate-900 transition-all flex items-center justify-center gap-3 group interactive-btn shadow-sm"
                  data-cursor-label="GITHUB"
                >
                  <svg className="w-6 h-6 fill-white" viewBox="0 0 24 24">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                  </svg>
                  <span className="text-sm font-semibold text-white">Sign in with GitHub</span>
                </button>

                {/* Microsoft */}
                <button
                  type="button"
                  onClick={() => setActiveFlow('microsoft_auth')}
                  className="w-full p-3.5 rounded-xl bg-white border border-slate-300 hover:bg-slate-50 hover:border-slate-400 transition-all flex items-center justify-center gap-3 group interactive-btn shadow-sm"
                  data-cursor-label="MICROSOFT"
                >
                  <div className="w-6 h-6 flex items-center justify-center shrink-0">
                    <svg className="w-5 h-5" viewBox="0 0 23 23">
                      <path fill="#f35325" d="M1 1h10v10H1z" />
                      <path fill="#81bc06" d="M12 1h10v10H12z" />
                      <path fill="#05a6f0" d="M1 12h10v10H1z" />
                      <path fill="#ffba08" d="M12 12h10v10H12z" />
                    </svg>
                  </div>
                  <span className="text-sm font-semibold text-slate-800">Continue with Microsoft</span>
                </button>
              </div>

              <div className="pt-2 text-center text-[10px] text-slate-500 font-mono">
                Secure provider sign-in · SentinelAPI Zero-Trust Identity
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3.5 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between text-[11px] font-mono text-slate-400">
          <span className="flex items-center gap-1.5 text-slate-400">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Target: <strong className="text-cyan-300">{currentRoleMeta.destinationLabel}</strong></span>
          </span>
          <span className="text-slate-500">Zero-Trust Auth v3.1</span>
        </div>
      </div>
    </div>
  );
};
