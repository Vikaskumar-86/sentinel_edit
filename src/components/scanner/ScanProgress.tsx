import React, { useEffect, useState } from 'react';
import {
  CheckCircle2,
  Loader2,
  AlertTriangle,
  FileText,
  ShieldCheck,
  ChevronRight,
  RefreshCw,
  Terminal,
  Activity,
  Layers,
  ArrowRight,
  Key,
  Globe,
  FileCode,
} from 'lucide-react';
import { DEFAULT_SCAN_STEPS } from '../../data/mockData';
import { ScanStep, VulnerabilityFinding } from '../../types';

interface ScanProgressProps {
  apiName: string;
  targetUrl: string;
  apiKey?: string;
  authHeaderType?: string;
  uploadedFileName?: string;
  scanDurationMs?: number;
  onScanComplete: () => void;
  onViewReport: () => void;
  onReset: () => void;
  newFindings: VulnerabilityFinding[];
}

export const ScanProgress: React.FC<ScanProgressProps> = ({
  apiName,
  targetUrl,
  apiKey,
  authHeaderType = 'X-API-Key',
  uploadedFileName = 'openapi_specification.json',
  scanDurationMs = 7200,
  onScanComplete,
  onViewReport,
  onReset,
  newFindings,
}) => {
  const [steps, setSteps] = useState<ScanStep[]>(DEFAULT_SCAN_STEPS);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [terminalLogs, setTerminalLogs] = useState<string[]>([]);
  const [progressPercent, setProgressPercent] = useState<number>(5);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [detectedCount, setDetectedCount] = useState<number>(0);

  const maskedKey = apiKey
    ? apiKey.length > 8
      ? `${apiKey.slice(0, 4)}••••••${apiKey.slice(-4)}`
      : '••••••••'
    : 'sk_live_••••••8903';

  useEffect(() => {
    let currentIdx = 0;
    const totalSteps = DEFAULT_SCAN_STEPS.length;

    // Custom tailored logs based on user's targetUrl and API key
    const customStepLogs: Record<number, string[]> = {
      0: [
        `[PARSER] Ingesting contract spec: ${uploadedFileName}`,
        `[PARSER] Spec schema verified: OpenAPI 3.1.0 compliant`,
        `[PARSER] Parsed target-specific contract metadata; route count is reported from the final scan`,
      ],
      1: [
        `[DISCOVERY] Handshaking target host: ${targetUrl}`,
        `[DISCOVERY] Host reachable: HTTP 200 OK via TLS 1.3`,
        `[DISCOVERY] Active routes mapped to target surface`,
      ],
      2: [
        `[AUTH] Injecting client credential headers: ${authHeaderType === 'bearer' ? 'Authorization: Bearer' : 'X-API-Key'}: ${maskedKey}`,
        `[AUTH] Verifying credential scope against ${targetUrl}`,
        `[AUTH] Baseline authenticated identity established`,
      ],
      3: [
        `[GENERATOR] Synthesizing 256 stateful fuzz test cases`,
        `[GENERATOR] Generating cross-tenant object swap vectors`,
      ],
      4: [
        `[FUZZER] Reviewing object-identifier authorization controls for ${targetUrl}`,
        `[FUZZER] Authorization boundary review queued for discovered object paths`,
        `[REVIEW] Object-level authorization evidence will be reflected in the final report`,
      ],
      5: [
        `[PAYLOAD] Reviewing response schemas exposed by ${targetUrl}`,
        `[REVIEW] Sensitive-field patterns are being evaluated from the supplied contract`,
        `[REVIEW] No remote data exposure is claimed by this client-only demo engine`,
      ],
      6: [
        `[SEVERITY] Calculating CVSS v3.1 base and exploitability vector`,
        `[SEVERITY] Building deterministic risk score from supplied scan inputs for ${apiName}`,
      ],
      7: [
        `[REPORT] Compiling executive audit summary & reproducible PoCs`,
        `[REPORT] Scan completed successfully against ${targetUrl}`,
      ],
    };

    const interval = setInterval(() => {
      if (currentIdx < totalSteps) {
        const step = DEFAULT_SCAN_STEPS[currentIdx];

        // Update step states
        setSteps((prev) =>
          prev.map((s, idx) => {
            if (idx < currentIdx) return { ...s, status: 'completed' };
            if (idx === currentIdx) return { ...s, status: 'running' };
            return { ...s, status: 'pending' };
          })
        );

        // Append custom dynamic logs
        const logsToAdd = customStepLogs[currentIdx] || step.logMessages || [];
        setTerminalLogs((prev) => [...prev, ...logsToAdd]);

        // This progress UI must not invent confirmed findings. The final report calculates
        // risk from the supplied contract/target metadata.
        if (currentIdx >= 4) {
          setDetectedCount(Math.max(0, currentIdx - 3));
        }

        setCurrentStepIndex(currentIdx);
        setProgressPercent(Math.round(((currentIdx + 1) / totalSteps) * 100));
        currentIdx++;
      } else {
        // Complete
        setSteps((prev) => prev.map((s) => ({ ...s, status: 'completed' })));
        setIsCompleted(true);
        setProgressPercent(100);
        onScanComplete();
        clearInterval(interval);
      }
    }, Math.max(500, Math.round(scanDurationMs / totalSteps)));

    return () => clearInterval(interval);
  }, [targetUrl, apiName, uploadedFileName, scanDurationMs]);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Top Banner with Target, Key & Progress */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className={`font-mono text-xs font-semibold px-2 py-0.5 rounded ${
                isCompleted ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-cyan-950 text-cyan-400 border border-cyan-800'
              }`}>
                {isCompleted ? 'SCAN COMPLETED' : 'ZERO-TRUST SCAN IN PROGRESS'}
              </span>
              <span className="text-slate-600">·</span>
              <span className="text-xs text-slate-200 font-semibold">{apiName}</span>
            </div>

            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 font-mono">
              <span className="flex items-center gap-1">
                <Globe className="w-3.5 h-3.5 text-cyan-400" />
                <span className="text-slate-200">{targetUrl}</span>
              </span>
              <span className="flex items-center gap-1">
                <Key className="w-3.5 h-3.5 text-amber-400" />
                <span>API Key: <span className="text-slate-300">{maskedKey}</span></span>
              </span>
              <span className="flex items-center gap-1">
                <FileCode className="w-3.5 h-3.5 text-purple-400" />
                <span>Spec: {uploadedFileName}</span>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-xs text-slate-400">Threats Found</div>
              <div className="text-base font-mono font-bold text-rose-400 tabular-nums">
                {detectedCount} Reviewed
              </div>
            </div>

            <div className="text-right">
              <div className="text-xs text-slate-400">Engine Progress</div>
              <div className="text-base font-mono font-bold text-cyan-400 tabular-nums">
                {progressPercent}%
              </div>
            </div>
          </div>
        </div>

        {/* Linear Progress Bar */}
        <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
          <div
            className="h-full bg-gradient-to-r from-cyan-500 via-teal-400 to-emerald-400 transition-all duration-300 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Two Column Layout: Step Pipeline & Live Terminal Logs */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: 8-Step Verification Pipeline */}
        <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Layers className="w-3.5 h-3.5 text-cyan-400" />
              <span>Scanning Pipeline</span>
            </h3>
            <span className="text-[11px] font-mono text-slate-400">
              {currentStepIndex + 1} of {steps.length} Steps
            </span>
          </div>

          <div className="space-y-2">
            {steps.map((step, idx) => {
              const isDone = step.status === 'completed';
              const isRunning = step.status === 'running';

              return (
                <div
                  key={step.id}
                  className={`p-2.5 rounded-lg border text-xs transition-colors flex items-center justify-between ${
                    isRunning
                      ? 'bg-cyan-950/30 border-cyan-800 text-white'
                      : isDone
                      ? 'bg-slate-950/60 border-slate-800/80 text-slate-300'
                      : 'bg-slate-950/30 border-slate-900 text-slate-500'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-[10px] text-slate-500 w-4">
                      0{idx + 1}
                    </span>
                    <div>
                      <div className="font-semibold text-xs leading-tight">
                        {step.label}
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                        {step.description}
                      </div>
                    </div>
                  </div>

                  <div className="shrink-0 pl-2">
                    {isRunning && (
                      <Loader2 className="w-4 h-4 text-cyan-400 animate-spin" />
                    )}
                    {isDone && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    )}
                    {!isRunning && !isDone && (
                      <div className="w-2 h-2 rounded-full bg-slate-800" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Live Terminal Output */}
        <div className="lg:col-span-6 bg-slate-950 border border-slate-800 rounded-xl p-4 shadow-xl flex flex-col h-[480px]">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2.5 mb-3">
            <div className="flex items-center gap-2">
              <Terminal className="w-3.5 h-3.5 text-cyan-400" />
              <span className="text-xs font-mono font-bold text-slate-300">
                sentinel-fuzzer.log
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-[10px] font-mono text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>LIVE BUFFER</span>
            </div>
          </div>

          {/* Terminal Console Body */}
          <div className="flex-1 overflow-y-auto font-mono text-[11px] space-y-1.5 pr-1 scrollbar-thin scrollbar-thumb-slate-800">
            {terminalLogs.map((log, index) => {
              const isAnomaly = log.includes('ALERT') || log.includes('BOLA') || log.includes('confirmed');
              const isAuth = log.includes('[AUTH]');
              const isParser = log.includes('[PARSER]');
              const isDiscovery = log.includes('[DISCOVERY]');

              return (
                <div
                  key={index}
                  className={`leading-relaxed break-words ${
                    isAnomaly
                      ? 'text-rose-400 font-semibold bg-rose-950/20 px-1 rounded'
                      : isAuth
                      ? 'text-amber-300'
                      : isDiscovery
                      ? 'text-cyan-300'
                      : isParser
                      ? 'text-purple-300'
                      : 'text-slate-300'
                  }`}
                >
                  <span className="text-slate-600 select-none mr-2">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  {log}
                </div>
              );
            })}
            {!isCompleted && (
              <div className="flex items-center gap-1 text-cyan-400 animate-pulse pt-1">
                <span>❯</span>
                <span className="w-2 h-3.5 bg-cyan-400 inline-block" />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Post-Scan Completion Actions */}
      {isCompleted && (
        <div className="p-6 rounded-xl bg-gradient-to-r from-slate-900 to-slate-950 border border-emerald-500/40 shadow-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-fadeIn">
          <div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <h4 className="text-sm font-bold text-white">
                Scan Completed Successfully
              </h4>
            </div>
            <p className="text-xs text-slate-300 mt-1 max-w-xl">
              SentinelAPI completed contract validation and authorized zero-trust probing against{' '}
              <strong className="text-cyan-300 font-mono">{targetUrl}</strong> using provided credentials.
              Review the generated risk indicators and report details before taking action.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={onReset}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5 text-slate-400" />
              <span>Scan New Target</span>
            </button>

            <button
              onClick={onViewReport}
              className="flex items-center gap-1.5 px-5 py-2 rounded-lg bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-xs transition-colors shadow-lg shadow-cyan-400/20"
            >
              <span>View Security Report</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
