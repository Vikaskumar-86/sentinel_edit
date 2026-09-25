import React, { useState } from 'react';
import {
  Settings,
  Shield,
  Key,
  Bell,
  Sliders,
  Check,
  RotateCcw,
  Copy,
  Lock,
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const [apiKey, setApiKey] = useState('sentinel_live_99d14f4882e81190bc27');
  const [copiedKey, setCopiedKey] = useState(false);
  const [savedNotice, setSavedNotice] = useState(false);

  // Settings states
  const [strictSandboxOnly, setStrictSandboxOnly] = useState(true);
  const [maxConcurrency, setMaxConcurrency] = useState(25);
  const [requestTimeoutMs, setRequestTimeoutMs] = useState(5000);
  const [slackWebhook, setSlackWebhook] = useState('https://hooks.slack.com/services/T00/B00/XXXXX');
  const [notifyOnCritical, setNotifyOnCritical] = useState(true);
  const [autoSarifExport, setAutoSarifExport] = useState(true);

  const handleCopyKey = () => {
    navigator.clipboard.writeText(apiKey);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2500);
  };

  return (
    <div className="space-y-6 max-w-4xl pb-12">
      {/* Top Banner */}
      <div className="p-5 rounded bg-slate-900 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Settings className="w-4 h-4 text-cyan-400" />
            <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
              Scanner Policies & Configuration
            </h2>
          </div>
          <p className="text-xs text-slate-300 mt-1">
            Configure defensive boundary constraints, rate-limit thresholds, and alert destinations.
          </p>
        </div>

        {savedNotice && (
          <div className="flex items-center gap-1.5 px-3 py-1 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 text-xs font-mono">
            <Check className="w-3.5 h-3.5" />
            <span>Settings Saved</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* API Keys for CI/CD */}
        <div className="p-5 rounded bg-slate-900/90 border border-slate-800 space-y-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-white uppercase tracking-wider">
            <Key className="w-4 h-4 text-cyan-400" />
            <span>SentinelAPI Authentication Token (CI/CD)</span>
          </div>
          <p className="text-xs text-slate-400">
            Use this token in your GitHub Actions secret or GitLab CI variables to authenticate CLI scans.
          </p>

          <div className="flex items-center gap-2">
            <input
              type="password"
              readOnly
              value={apiKey}
              className="flex-1 px-3 py-2 text-xs font-mono bg-slate-950 border border-slate-800 rounded text-slate-300 focus:outline-none"
            />
            <button
              type="button"
              onClick={handleCopyKey}
              className="px-3 py-2 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-colors flex items-center gap-1.5"
            >
              {copiedKey ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedKey ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
        </div>

        {/* Safety & Defensive Guardrails */}
        <div className="p-5 rounded bg-slate-900/90 border border-slate-800 space-y-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-white uppercase tracking-wider">
            <Shield className="w-4 h-4 text-emerald-400" />
            <span>Defensive Safety Guardrails</span>
          </div>

          <label className="flex items-start justify-between gap-4 p-3 rounded bg-slate-950 border border-slate-800 cursor-pointer">
            <div>
              <div className="text-xs font-semibold text-slate-200">
                Enforce Sandbox-Only Scan Mode (Hackathon Safety)
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Restricts scanning vectors strictly to isolated sandbox domains or localhost environments to prevent accidental calls to production.
              </p>
            </div>
            <input
              type="checkbox"
              checked={strictSandboxOnly}
              onChange={(e) => setStrictSandboxOnly(e.target.checked)}
              className="mt-1 rounded border-slate-700 text-cyan-500"
            />
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Max Concurrency Limit (Workers)
              </label>
              <input
                type="number"
                value={maxConcurrency}
                onChange={(e) => setMaxConcurrency(parseInt(e.target.value, 10))}
                className="w-full px-3 py-2 text-xs font-mono bg-slate-950 border border-slate-800 rounded text-slate-200 focus:outline-none focus:border-cyan-500"
              />
              <span className="text-[10px] text-slate-500">Limits concurrent HTTP connections during burst tests.</span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                HTTP Request Timeout (ms)
              </label>
              <input
                type="number"
                value={requestTimeoutMs}
                onChange={(e) => setRequestTimeoutMs(parseInt(e.target.value, 10))}
                className="w-full px-3 py-2 text-xs font-mono bg-slate-950 border border-slate-800 rounded text-slate-200 focus:outline-none focus:border-cyan-500"
              />
              <span className="text-[10px] text-slate-500">Maximum socket wait before marking endpoint unresponsive.</span>
            </div>
          </div>
        </div>

        {/* Webhooks & Alerts */}
        <div className="p-5 rounded bg-slate-900/90 border border-slate-800 space-y-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-white uppercase tracking-wider">
            <Bell className="w-4 h-4 text-cyan-400" />
            <span>Alerting & Notification Channels</span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Slack / PagerDuty Incident Webhook URL
            </label>
            <input
              type="url"
              value={slackWebhook}
              onChange={(e) => setSlackWebhook(e.target.value)}
              className="w-full px-3 py-2 text-xs font-mono bg-slate-950 border border-slate-800 rounded text-slate-200 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <label className="flex items-center gap-2.5 cursor-pointer">
            <input
              type="checkbox"
              checked={notifyOnCritical}
              onChange={(e) => setNotifyOnCritical(e.target.checked)}
              className="rounded border-slate-700 text-cyan-500"
            />
            <span className="text-xs text-slate-300">
              Trigger instant alert webhook when a Critical (BOLA / Auth bypass) flaw is confirmed.
            </span>
          </label>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="px-6 py-2 rounded bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold transition-colors shadow-sm shadow-cyan-500/20"
          >
            Save Configuration
          </button>
        </div>
      </form>
    </div>
  );
};
