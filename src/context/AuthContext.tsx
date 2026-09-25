import React, { createContext, useContext, useState, useEffect } from 'react';
import { PageId } from '../components/layout/Sidebar';

export type UserRole =
  | 'security_engineer'
  | 'devsecops'
  | 'ciso_executive'
  | 'api_developer';

export interface RoleMetadata {
  roleId: UserRole;
  title: string;
  badge: string;
  description: string;
  defaultDestination: PageId;
  destinationLabel: string;
  recommendedProvider: string;
  iconName: string;
  defaultPermissions: string[];
}

export const USER_ROLES_CATALOG: Record<UserRole, RoleMetadata> = {
  security_engineer: {
    roleId: 'security_engineer',
    title: 'Security Engineer / Pentester',
    badge: 'SecOps Lead',
    description: 'Deep vulnerability triage, BOLA test harnesses, raw fuzzing telemetry, and reproducible PoC payloads.',
    defaultDestination: 'dashboard',
    destinationLabel: 'Threat Matrix & Dashboard',
    recommendedProvider: 'Google / OAuth',
    iconName: 'ShieldAlert',
    defaultPermissions: ['Full Fuzzing Access', 'Payload Generation', 'CVE/CWE Triage', 'Mark Findings'],
  },
  devsecops: {
    roleId: 'devsecops',
    title: 'DevSecOps & Platform Engineer',
    badge: 'CI/CD Gatekeeper',
    description: 'Automate build-time SARIF ingestion, pull-request blocking thresholds, and multi-tenant inventory mapping.',
    defaultDestination: 'cicd',
    destinationLabel: 'CI/CD Pipelines Portal',
    recommendedProvider: 'GitHub Enterprise',
    iconName: 'GitBranch',
    defaultPermissions: ['Pipeline Token Admin', 'PR Blocking Gates', 'GitHub Webhooks', 'Inventory Sync'],
  },
  ciso_executive: {
    roleId: 'ciso_executive',
    title: 'CISO / Compliance Auditor',
    badge: 'Executive Audit',
    description: 'OWASP API Top 10 compliance certification, PCI-DSS / GDPR risk scoring, and board-ready export packets.',
    defaultDestination: 'reports',
    destinationLabel: 'Executive Audit Reports',
    recommendedProvider: 'Enterprise SAML / Okta',
    iconName: 'FileCheck2',
    defaultPermissions: ['Audit Report Signing', 'Compliance Attestation', 'Risk Analytics', 'Export Certifications'],
  },
  api_developer: {
    roleId: 'api_developer',
    title: 'API Developer / Backend Architect',
    badge: 'Builder Tier',
    description: 'Instant OpenAPI / Swagger schema validation, endpoint introspection, code-level remediation patches & AI help.',
    defaultDestination: 'scanner',
    destinationLabel: 'API Security Scanner Console',
    recommendedProvider: 'GitHub / Google',
    iconName: 'Cpu',
    defaultPermissions: ['Spec Ingestion', 'Endpoint Scans', 'Remediation Guides', 'SentinelAI Access'],
  },
};

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  avatar: string;
  provider: 'google' | 'github' | 'microsoft' | 'sso' | 'email';
  userRole: UserRole;
  roleTitle: string;
  organization: string;
  targetDashboard: PageId;
}

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  loginAsRole: (
    role: UserRole,
    provider: 'google' | 'github' | 'microsoft' | 'sso' | 'email',
    customEmail?: string
  ) => PageId;
  loginWithProvider: (provider: 'google' | 'github' | 'microsoft' | 'sso', customEmail?: string) => PageId;
  loginWithEmail: (email: string, role?: UserRole) => PageId;
  logout: () => void;
  isAuthModalOpen: boolean;
  selectedRoleForModal: UserRole | null;
  openAuthModal: (preselectedRole?: UserRole) => void;
  closeAuthModal: () => void;
}

const STORAGE_KEY = 'sentinel_auth_session_v2';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{
  children: React.ReactNode;
  onRedirect?: (page: PageId) => void;
}> = ({ children, onRedirect }) => {
  // Website opens completely clean by default without pre-logged in user
  const [user, setUser] = useState<AuthUser | null>(() => {
    try {
      localStorage.removeItem('sentinel_auth_user'); // wipe legacy pre-set user
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed?.name === 'Vikas Kumar' && !parsed?.userRole) {
          localStorage.removeItem(STORAGE_KEY);
          return null;
        }
        return parsed;
      }
      return null;
    } catch {
      return null;
    }
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [selectedRoleForModal, setSelectedRoleForModal] = useState<UserRole | null>(null);

  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
      } else {
        localStorage.removeItem(STORAGE_KEY);
      }
    } catch {
      // ignore
    }
  }, [user]);

  const loginAsRole = (
    role: UserRole,
    provider: 'google' | 'github' | 'microsoft' | 'sso' | 'email',
    customEmail?: string
  ): PageId => {
    const roleMeta = USER_ROLES_CATALOG[role];
    let name = 'Security Specialist';
    let email = customEmail || 'specialist@sentinelapi.dev';
    let avatar = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80';
    let org = 'Enterprise SecOps';

    if (role === 'security_engineer') {
      name = customEmail ? customEmail.split('@')[0] : 'Vikas Kumar';
      email = customEmail || 'vikaskumar868903@gmail.com';
      avatar = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80';
      org = 'Red Team & PenOps Lab';
    } else if (role === 'devsecops') {
      name = customEmail ? customEmail.split('@')[0] : 'Alex Mercer';
      email = customEmail || 'alex.mercer@devsecops-cloud.io';
      avatar = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80';
      org = 'Cloud Engineering & CI/CD';
    } else if (role === 'ciso_executive') {
      name = customEmail ? customEmail.split('@')[0] : 'Dr. Evelyn Vance';
      email = customEmail || 'evelyn.vance@governance-audit.org';
      avatar = 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80';
      org = 'Global Security & Compliance';
    } else if (role === 'api_developer') {
      name = customEmail ? customEmail.split('@')[0] : 'Jordan Lee';
      email = customEmail || 'jordan.lee@api-developer.dev';
      avatar = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80';
      org = 'Distributed Microservices Team';
    }

    const newUser: AuthUser = {
      id: `usr-${Date.now()}`,
      name,
      email,
      avatar,
      provider,
      userRole: role,
      roleTitle: roleMeta.title,
      organization: org,
      targetDashboard: roleMeta.defaultDestination,
    };

    setUser(newUser);
    setIsAuthModalOpen(false);
    setSelectedRoleForModal(null);

    if (onRedirect) {
      onRedirect(roleMeta.defaultDestination);
    }
    return roleMeta.defaultDestination;
  };

  const loginWithProvider = (provider: 'google' | 'github' | 'microsoft' | 'sso', customEmail?: string): PageId => {
    // Default to security engineer if no role chosen
    const role = selectedRoleForModal || 'security_engineer';
    return loginAsRole(role, provider, customEmail);
  };

  const loginWithEmail = (email: string, role?: UserRole): PageId => {
    const assignedRole = role || selectedRoleForModal || 'api_developer';
    return loginAsRole(assignedRole, 'email', email);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
    if (onRedirect) {
      onRedirect('landing');
    }
  };

  const openAuthModal = (preselectedRole?: UserRole) => {
    if (preselectedRole) {
      setSelectedRoleForModal(preselectedRole);
    }
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
    setSelectedRoleForModal(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loginAsRole,
        loginWithProvider,
        loginWithEmail,
        logout,
        isAuthModalOpen,
        selectedRoleForModal,
        openAuthModal,
        closeAuthModal,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
