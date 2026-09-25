import React from 'react';
import {
  ShieldAlert,
  ArrowRight,
  ShieldCheck,
  Zap,
  Lock,
  FileCode,
  Layers,
  Activity,
  AlertTriangle,
  GitBranch,
  Terminal,
  Database,
  CheckCircle2,
  Cpu,
  ChevronRight,
  HeartHandshake,
  Users,
  Sparkles,
  FileCheck2,
  ExternalLink,
} from 'lucide-react';
import { PageId } from '../components/layout/Sidebar';
import { useAuth, UserRole, USER_ROLES_CATALOG } from '../context/AuthContext';
import { useAction3D } from '../context/Action3DContext';

interface LandingPageProps {
  onNavigate: (page: PageId) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {
  const { openAuthModal } = useAuth();
  const { trigger3DAction } = useAction3D();

  const handleLaunchScan = async () => {
    await trigger3DAction({
      title: 'Initializing API Security Scanner',
      subtitle: 'Opening Automated Vulnerability Fuzzing Environment',
      category: 'CONSOLE TRANSITION',
      iconType: 'scan',
      durationMs: 1200,
      onComplete: () => {
        onNavigate('scanner');
      },
    });
  };

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative pt-4 sm:pt-8 text-center max-w-5xl mx-auto px-4">
        {/* Defense & Mission Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/80 border border-cyan-800/80 text-cyan-300 text-xs font-mono mb-6 shadow-lg shadow-cyan-950/50 backdrop-blur">
          <ShieldAlert className="w-4 h-4 text-cyan-400" />
          <span>Zero-Trust API Security Engine · Multi-Persona Defense Console</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.15] max-w-4xl mx-auto">
          Find API Vulnerabilities{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400">
            Before They Become Breaches.
          </span>
        </h1>

        {/* Subtitle */}
        <p className="mt-5 text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
          SentinelAPI continuously scans your API surface for authorization flaws, data exposure,
          authentication weaknesses, and rate-limit issues.
        </p>

        {/* Action Buttons: Clean & Professional (NO pre-logged-in user text) */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={handleLaunchScan}
            className="flex items-center gap-2 px-6 py-3 rounded-lg bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-xs tracking-wide transition-all shadow-lg shadow-cyan-400/20 active:scale-95 interactive-btn"
            data-cursor-label="SCANNER"
          >
            <span>Start Security Scan</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => onNavigate('dashboard')}
            className="flex items-center gap-2 px-5 py-3 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 font-semibold text-xs tracking-wide transition-colors interactive-btn"
            data-cursor-label="PREVIEW"
          >
            <span>View Demo</span>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </button>

        </div>

        {/* ROLE-BASED ACCESS PORTALS - Dedicated Sign-In for Different User Types */}
        <div className="mt-12 text-left">
          <div className="flex items-center justify-between mb-4 px-1">
            <div>
              <div className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">
                Select Your Role
              </div>
              <h3 className="text-base sm:text-lg font-bold text-white">
                Role-Based Portals & Specialized Dashboards
              </h3>
            </div>
            <span className="text-xs font-mono text-slate-400 hidden sm:block">
              Dedicated workflows for each team
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            {/* 1. Security Engineer */}
            <div
              onClick={() => openAuthModal('security_engineer')}
              className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-rose-500/60 transition-all cursor-pointer group interactive-card"
              data-cursor-label="SECOPS"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="w-8 h-8 rounded-lg bg-rose-950/80 border border-rose-800 flex items-center justify-center text-rose-400">
                  <ShieldAlert className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-mono text-rose-400 px-2 py-0.5 rounded bg-rose-950/50 border border-rose-900">
                  Dashboard
                </span>
              </div>
              <h4 className="text-xs font-bold text-white group-hover:text-rose-300 transition-colors">
                Security Engineer / Pentester
              </h4>
              <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">
                Deep vulnerability triage, BOLA test harnesses, raw fuzzing logs, and PoC exploits.
              </p>
              <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono text-cyan-400 group-hover:translate-x-0.5 transition-transform">
                <span>Sign In ❯ Threat Matrix</span>
                <ArrowRight className="w-3 h-3" />
              </div>
            </div>

            {/* 2. DevSecOps */}
            <div
              onClick={() => openAuthModal('devsecops')}
              className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-cyan-500/60 transition-all cursor-pointer group interactive-card"
              data-cursor-label="CI/CD"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="w-8 h-8 rounded-lg bg-cyan-950/80 border border-cyan-800 flex items-center justify-center text-cyan-400">
                  <GitBranch className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-mono text-cyan-400 px-2 py-0.5 rounded bg-cyan-950/50 border border-cyan-900">
                  CI/CD
                </span>
              </div>
              <h4 className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors">
                DevSecOps & Platform
              </h4>
              <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">
                Build-time SARIF gates, GitHub Actions automation, and API inventory discovery.
              </p>
              <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono text-cyan-400 group-hover:translate-x-0.5 transition-transform">
                <span>Sign In ❯ CI/CD Portal</span>
                <ArrowRight className="w-3 h-3" />
              </div>
            </div>

            {/* 3. CISO & Compliance */}
            <div
              onClick={() => openAuthModal('ciso_executive')}
              className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-emerald-500/60 transition-all cursor-pointer group interactive-card"
              data-cursor-label="AUDIT"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-950/80 border border-emerald-800 flex items-center justify-center text-emerald-400">
                  <FileCheck2 className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-mono text-emerald-400 px-2 py-0.5 rounded bg-emerald-950/50 border border-emerald-900">
                  Reports
                </span>
              </div>
              <h4 className="text-xs font-bold text-white group-hover:text-emerald-300 transition-colors">
                CISO / Compliance Officer
              </h4>
              <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">
                OWASP API Top 10 certifications, executive audit packets, and PCI-DSS compliance.
              </p>
              <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono text-emerald-400 group-hover:translate-x-0.5 transition-transform">
                <span>Sign In ❯ Audit Reports</span>
                <ArrowRight className="w-3 h-3" />
              </div>
            </div>

            {/* 4. API Developer */}
            <div
              onClick={() => openAuthModal('api_developer')}
              className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-purple-500/60 transition-all cursor-pointer group interactive-card"
              data-cursor-label="BUILDER"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="w-8 h-8 rounded-lg bg-purple-950/80 border border-purple-800 flex items-center justify-center text-purple-400">
                  <Cpu className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-mono text-purple-400 px-2 py-0.5 rounded bg-purple-950/50 border border-purple-900">
                  Scanner
                </span>
              </div>
              <h4 className="text-xs font-bold text-white group-hover:text-purple-300 transition-colors">
                API Developer / Architect
              </h4>
              <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">
                OpenAPI spec fuzzing, automated test generation, code patches, and SentinelAI assistance.
              </p>
              <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono text-purple-400 group-hover:translate-x-0.5 transition-transform">
                <span>Sign In ❯ Scanner Console</span>
                <ArrowRight className="w-3 h-3" />
              </div>
            </div>
          </div>
        </div>

        {/* HIGH-QUALITY HERO IMAGE SHOWCASE: SentinelAPI Zero-Trust API Security */}
        <div className="mt-12 relative rounded-2xl overflow-hidden border border-slate-700/80 bg-slate-900 shadow-2xl group text-left interactive-card">
          <div className="relative aspect-[16/9] max-h-[480px] w-full overflow-hidden bg-slate-950">
            <img
              src="/src/assets/images/sentinelapi_hero.png"
              alt="SentinelAPI Zero-Trust API Vulnerability Scanner"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-center transform group-hover:scale-[1.02] transition-transform duration-700 ease-out brightness-[0.88] contrast-[1.05]"
            />
            {/* Elegant Gradient overlays to seamlessly blend with dark theme */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-transparent to-slate-950/60" />

            {/* Top Badges over image */}
            <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-950/80 backdrop-blur border border-cyan-500/40 text-cyan-300 text-xs font-mono">
                <ShieldCheck className="w-4 h-4 text-cyan-400" />
                <span>SENTINELAPI · ZERO-TRUST API SECURITY</span>
              </div>

              <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-950/80 backdrop-blur border border-emerald-500/40 text-emerald-400 text-xs font-mono">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Zero-Trust Shield Active</span>
              </div>
            </div>

            {/* Bottom Caption & Threat Protection Statistics */}
            <div className="absolute bottom-6 left-6 right-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div className="max-w-xl">
                <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight drop-shadow-md">
                  Zero-Trust Protection for Every API Endpoint
                </h3>
                <p className="text-xs sm:text-sm text-slate-200 mt-1.5 leading-relaxed drop-shadow">
                  SentinelAPI continuously scans API endpoints for vulnerabilities, authentication weaknesses,
                  injection risks, unauthorized access, and cross-tenant data leakage.
                </p>
              </div>

              {/* Mini telemetry stats on image */}
              <div className="flex items-center gap-3 shrink-0">
                <div className="px-3.5 py-2 rounded-lg bg-slate-950/85 backdrop-blur border border-slate-700/80 text-center">
                  <div className="text-[10px] font-mono text-slate-400 uppercase">API Endpoints Scanned</div>
                  <div className="text-base font-bold font-mono text-cyan-400 tabular-nums">480+ Endpoints</div>
                </div>
                <div className="px-3.5 py-2 rounded-lg bg-slate-950/85 backdrop-blur border border-slate-700/80 text-center">
                  <div className="text-[10px] font-mono text-slate-400 uppercase">Data Breach Rate</div>
                  <div className="text-base font-bold font-mono text-emerald-400 tabular-nums">0.00%</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Cybersecurity Visual: API → Scanner → Vulnerability Detection → Security Report */}
        <div className="mt-14 p-6 rounded-xl border border-slate-800 bg-slate-900/60 shadow-2xl text-left">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-3 mb-6">
            <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
              <Activity className="w-3.5 h-3.5 text-cyan-400" />
              <span>DEFENSIVE THREAT SCAN PIPELINE</span>
            </div>
            <div className="text-[11px] font-mono text-emerald-400 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Engine Online
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
            {/* Step 1: API */}
            <div className="p-4 rounded-lg bg-slate-950/80 border border-slate-800 relative group hover:border-cyan-500/50 transition-colors interactive-card">
              <div className="w-8 h-8 rounded bg-cyan-950/80 border border-cyan-800 flex items-center justify-center text-cyan-400 mb-3">
                <FileCode className="w-4 h-4" />
              </div>
              <div className="text-[11px] font-mono text-cyan-400 uppercase">Input Layer</div>
              <div className="text-sm font-bold text-white mt-0.5">API Specification</div>
              <p className="text-[11px] text-slate-400 mt-1">
                OpenAPI 3.1 & Swagger schemas parsed to map endpoints and auth parameters.
              </p>
            </div>

            {/* Step 2: Scanner */}
            <div className="p-4 rounded-lg bg-slate-950/80 border border-slate-800 relative group hover:border-cyan-500/50 transition-colors interactive-card">
              <div className="w-8 h-8 rounded bg-emerald-950/80 border border-emerald-800 flex items-center justify-center text-emerald-400 mb-3">
                <Cpu className="w-4 h-4" />
              </div>
              <div className="text-[11px] font-mono text-emerald-400 uppercase">Fuzzing Engine</div>
              <div className="text-sm font-bold text-white mt-0.5">Zero-Trust Scanner</div>
              <p className="text-[11px] text-slate-400 mt-1">
                Dual-token simulation, boundary testing, and authorization matrix fuzzing.
              </p>
            </div>

            {/* Step 3: Detection */}
            <div className="p-4 rounded-lg bg-slate-950/80 border border-slate-800 relative group hover:border-rose-500/50 transition-colors interactive-card">
              <div className="w-8 h-8 rounded bg-rose-950/80 border border-rose-800 flex items-center justify-center text-rose-400 mb-3">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <div className="text-[11px] font-mono text-rose-400 uppercase">Threat Analysis</div>
              <div className="text-sm font-bold text-white mt-0.5">Vulnerability Detection</div>
              <p className="text-[11px] text-slate-400 mt-1">
                CVSS v3.1 scoring for BOLA, data exposure, auth bypass, and rate limits.
              </p>
            </div>

            {/* Step 4: Report */}
            <div className="p-4 rounded-lg bg-slate-950/80 border border-slate-800 relative group hover:border-cyan-500/50 transition-colors interactive-card">
              <div className="w-8 h-8 rounded bg-purple-950/80 border border-purple-800 flex items-center justify-center text-purple-400 mb-3">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div className="text-[11px] font-mono text-purple-400 uppercase">Remediation</div>
              <div className="text-sm font-bold text-white mt-0.5">Actionable Security Report</div>
              <p className="text-[11px] text-slate-400 mt-1">
                Reproducible cURL PoC, code patches, and compliance auditing.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section: Why SentinelAPI? */}
      <section className="max-w-5xl mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">
            Enterprise Architecture
          </h2>
          <h3 className="text-2xl sm:text-3xl font-bold text-white mt-1">
            Why SentinelAPI?
          </h3>
          <p className="text-xs text-slate-400 mt-1 max-w-xl mx-auto">
            Traditional web vulnerability scanners test web pages. SentinelAPI speaks raw REST, GraphQL,
            and JSON payloads natively.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-5 rounded-lg bg-slate-900/80 border border-slate-800 interactive-card">
            <div className="w-9 h-9 rounded bg-cyan-950 border border-cyan-800 flex items-center justify-center text-cyan-400 mb-3">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-white">API Security Testing</h4>
            <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
              Automated testing tailored for modern distributed architectures. Validates input bounds,
              parameter tampering, HTTP verb tampering, and contract drift.
            </p>
          </div>

          <div className="p-5 rounded-lg bg-slate-900/80 border border-slate-800 interactive-card">
            <div className="w-9 h-9 rounded bg-rose-950 border border-rose-800 flex items-center justify-center text-rose-400 mb-3">
              <Lock className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-white">Authorization Analysis</h4>
            <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
              Employs dual-persona token emulation to detect Broken Object-Level Authorization flaws where User A
              can access or alter records belonging to User B.
            </p>
          </div>

          <div className="p-5 rounded-lg bg-slate-900/80 border border-slate-800 interactive-card">
            <div className="w-9 h-9 rounded bg-amber-950 border border-amber-800 flex items-center justify-center text-amber-400 mb-3">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-white">Data Exposure Detection</h4>
            <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
              Analyzes response envelopes for leaked database internals, password hashes, PII, and unnecessary
              sensitive fields before they reach clients.
            </p>
          </div>

          <div className="p-5 rounded-lg bg-slate-900/80 border border-slate-800 interactive-card">
            <div className="w-9 h-9 rounded bg-emerald-950 border border-emerald-800 flex items-center justify-center text-emerald-400 mb-3">
              <Activity className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-white">Continuous Monitoring</h4>
            <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
              Integrates seamlessly into GitHub Actions, GitLab CI, and Jenkins to fail pull requests that introduce
              unauthorized endpoints or authorization bypasses.
            </p>
          </div>
        </div>
      </section>

      {/* Section: How It Works */}
      <section className="max-w-5xl mx-auto px-4">
        <div className="p-8 rounded-xl bg-slate-900/60 border border-slate-800">
          <div className="text-center mb-8">
            <h2 className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">
              Scan Workflow
            </h2>
            <h3 className="text-xl sm:text-2xl font-bold text-white mt-1">
              How It Works
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-lg bg-slate-950/70 border border-slate-800 interactive-card">
              <div className="font-mono text-cyan-400 text-xs font-bold mb-1">01. INGEST</div>
              <h4 className="text-xs font-bold text-white mb-1">Upload OpenAPI / Swagger</h4>
              <p className="text-[11px] text-slate-400">
                Provide contract JSON/YAML or configure target introspective endpoint.
              </p>
            </div>

            <div className="p-4 rounded-lg bg-slate-950/70 border border-slate-800 interactive-card">
              <div className="font-mono text-cyan-400 text-xs font-bold mb-1">02. MAP</div>
              <h4 className="text-xs font-bold text-white mb-1">Analyze API Endpoints</h4>
              <p className="text-[11px] text-slate-400">
                Maps auth schemes, object identifiers, role boundaries, and parameters.
              </p>
            </div>

            <div className="p-4 rounded-lg bg-slate-950/70 border border-slate-800 interactive-card">
              <div className="font-mono text-cyan-400 text-xs font-bold mb-1">03. EXECUTE</div>
              <h4 className="text-xs font-bold text-white mb-1">Run Security Tests</h4>
              <p className="text-[11px] text-slate-400">
                Simulates cross-tenant token swaps, burst concurrency, and header tampering.
              </p>
            </div>

            <div className="p-4 rounded-lg bg-slate-950/70 border border-slate-800 interactive-card">
              <div className="font-mono text-cyan-400 text-xs font-bold mb-1">04. REPORT</div>
              <h4 className="text-xs font-bold text-white mb-1">Generate Actionable Report</h4>
              <p className="text-[11px] text-slate-400">
                Deliver CVSS rankings, reproducible PoCs, and framework-specific patches.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section: Vulnerability Categories */}
      <section className="max-w-5xl mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">
            Detection Taxonomy
          </h2>
          <h3 className="text-xl sm:text-2xl font-bold text-white mt-1">
            Vulnerability Categories
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-5 rounded-lg bg-slate-900 border border-slate-800 flex items-start gap-4 interactive-card">
            <div className="w-8 h-8 rounded bg-rose-950/80 border border-rose-800 flex items-center justify-center text-rose-400 shrink-0 mt-0.5">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-xs font-bold text-white">Broken Object-Level Authorization</h4>
                <span className="text-[10px] font-mono text-rose-400">API1:2023</span>
              </div>
              <p className="text-xs text-slate-300 mt-1">
                Endpoints allowing one authenticated user to access another user's private data by simply
                changing an ID parameter in the URL or payload.
              </p>
            </div>
          </div>

          <div className="p-5 rounded-lg bg-slate-900 border border-slate-800 flex items-start gap-4 interactive-card">
            <div className="w-8 h-8 rounded bg-orange-950/80 border border-orange-800 flex items-center justify-center text-orange-400 shrink-0 mt-0.5">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-xs font-bold text-white">Excessive Data Exposure</h4>
                <span className="text-[10px] font-mono text-orange-400">API3:2023</span>
              </div>
              <p className="text-xs text-slate-300 mt-1">
                Backend returns entire data models relying on client-side filtering, leaking password hashes,
                personal identifiers, and administrative flags.
              </p>
            </div>
          </div>

          <div className="p-5 rounded-lg bg-slate-900 border border-slate-800 flex items-start gap-4 interactive-card">
            <div className="w-8 h-8 rounded bg-purple-950/80 border border-purple-800 flex items-center justify-center text-purple-400 shrink-0 mt-0.5">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-xs font-bold text-white">Authentication Misconfiguration</h4>
                <span className="text-[10px] font-mono text-purple-400">API2:2023</span>
              </div>
              <p className="text-xs text-slate-300 mt-1">
                Weak JWT signature verification, accepting `alg: none`, lack of expiration validation, or
                trusting spoofed client proxy headers.
              </p>
            </div>
          </div>

          <div className="p-5 rounded-lg bg-slate-900 border border-slate-800 flex items-start gap-4 interactive-card">
            <div className="w-8 h-8 rounded bg-yellow-950/80 border border-yellow-800 flex items-center justify-center text-yellow-400 shrink-0 mt-0.5">
              <Activity className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-xs font-bold text-white">Rate Limiting Issues</h4>
                <span className="text-[10px] font-mono text-yellow-400">API4:2023</span>
              </div>
              <p className="text-xs text-slate-300 mt-1">
                Missing throttling on credential endpoints or heavy reporting APIs, leaving services exposed to
                brute-force attacks and Denial of Service.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section: Key Benefits */}
      <section className="max-w-5xl mx-auto px-4">
        <div className="p-6 rounded-xl bg-slate-900 border border-slate-800">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 text-center">
            Key Benefits
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-slate-200">Automated API security testing:</span>
                <span className="text-slate-400 ml-1">Run continuous scheduled or triggered scans without manual pen-testing overhead.</span>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-slate-200">Severity-ranked findings:</span>
                <span className="text-slate-400 ml-1">Prioritize fixes by mathematical CVSS v3.1 exploitability rather than noise.</span>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-slate-200">Reproducible proof-of-concept requests:</span>
                <span className="text-slate-400 ml-1">Every finding includes copyable cURL commands and token diff proofs.</span>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-slate-200">Developer-friendly reports:</span>
                <span className="text-slate-400 ml-1">Concrete code examples in Node, Python, and Go showing exactly how to patch.</span>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-slate-200">CI/CD integration ready:</span>
                <span className="text-slate-400 ml-1">Drop-in GitHub Action and GitLab CI templates with configurable fail thresholds.</span>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-slate-200">Zero-Trust Perimeter Check:</span>
                <span className="text-slate-400 ml-1">Validates authorization at the data access layer, not just the front door.</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* End CTA */}
      <section className="max-w-4xl mx-auto px-4 text-center">
        <div className="p-8 sm:p-12 rounded-2xl border border-cyan-500/30 bg-gradient-to-b from-slate-900 to-slate-950 relative overflow-hidden shadow-2xl">
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Secure Your APIs Before Attackers Find Them.
          </h2>
          <p className="mt-3 text-xs sm:text-sm text-slate-300 max-w-xl mx-auto">
            Scan your OpenAPI specification in 60 seconds against our sandbox environment and receive
            a full CVSS-scored vulnerability audit.
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={handleLaunchScan}
              className="px-6 py-2.5 rounded-lg bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-xs tracking-wide transition-all shadow-md shadow-cyan-400/20 interactive-btn"
              data-cursor-label="START"
            >
              Launch Interactive Scanner
            </button>
            <button
              onClick={() => openAuthModal()}
              className="px-5 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors border border-slate-700 interactive-btn"
              data-cursor-label="PORTALS"
            >
              Role Sign-In Portals
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
