import React, { useState, useRef } from 'react';
import {
  UploadCloud,
  FileCode,
  Globe,
  AlertTriangle,
  Play,
  CheckSquare,
  Square,
  Sparkles,
  ShieldAlert,
  Info,
  Check,
  Plus,
  Key,
  Eye,
  EyeOff,
  FileText,
  Search,
  X,
  Layers,
  ChevronDown,
} from 'lucide-react';
import { SAMPLE_OPENAPI_SPEC } from '../../data/mockData';
import { ScanConfig } from '../../types';
import { useAction3D } from '../../context/Action3DContext';

interface SpecUploaderProps {
  onStartScan: (config: ScanConfig, rawSpecContent: string) => void;
  isScanning: boolean;
}

export const SpecUploader: React.FC<SpecUploaderProps> = ({ onStartScan, isScanning }) => {
  const { trigger3DAction } = useAction3D();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const plusFileInputRef = useRef<HTMLInputElement>(null);

  // File state
  const [dragOver, setDragOver] = useState(false);
  const [fileName, setFileName] = useState<string>('vulnerable_ecommerce_openapi.json');
  const [fileSize, setFileSize] = useState<string>('42.8 KB');
  const [specContent, setSpecContent] = useState<string>('');
  const [hasUserSpec, setHasUserSpec] = useState<boolean>(false);
  const [showPlusMenu, setShowPlusMenu] = useState<boolean>(false);

  // Target API and Auth state
  const [targetUrl, setTargetUrl] = useState<string>('https://sandbox.sentinelapi.dev/v1');
  const [apiName, setApiName] = useState<string>('Custom Enterprise API');
  const [apiKey, setApiKey] = useState<string>(import.meta.env.VITE_API_KEY || '');
  const [authHeaderType, setAuthHeaderType] = useState<'api-key' | 'bearer' | 'custom'>('api-key');
  const [customHeaderName, setCustomHeaderName] = useState<string>('X-API-Key');
  const [showApiKey, setShowApiKey] = useState<boolean>(false);
  const [userAcknowledgedAuth, setUserAcknowledgedAuth] = useState<boolean>(true);

  // Scan configurations
  const [bolaTesting, setBolaTesting] = useState(true);
  const [excessiveDataExposure, setExcessiveDataExposure] = useState(true);
  const [authenticationChecks, setAuthenticationChecks] = useState(true);
  const [rateLimitTesting, setRateLimitTesting] = useState(true);
  const [aiTestGeneration, setAiTestGeneration] = useState(false);

  // File loading helper
  const processFile = async (file: File) => {
    await trigger3DAction({
      title: 'Validating API Specification',
      subtitle: `${file.name} (${(file.size / 1024).toFixed(1)} KB)`,
      category: 'OPENAPI 3.1 CONTRACT INGESTION',
      iconType: 'upload',
      durationMs: 1200,
    });

    setFileName(file.name);
    setFileSize(`${(file.size / 1024).toFixed(1)} KB`);
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        const content = event.target.result as string;
        setSpecContent(content);
        setHasUserSpec(true);

        // Try extracting API title from JSON/YAML
        try {
          if (file.name.endsWith('.json')) {
            const parsed = JSON.parse(content);
            if (parsed.info?.title) {
              setApiName(parsed.info.title);
            }
            if (parsed.servers?.[0]?.url) {
              setTargetUrl(parsed.servers[0].url);
            }
          }
        } catch {
          // keep existing name
        }
      }
    };
    reader.readAsText(file);
    setShowPlusMenu(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleSetSandboxTarget = () => {
    setTargetUrl('https://sandbox.sentinelapi.dev/v1');
    setApiName('Sentinel Sandbox API');
    setSpecContent(SAMPLE_OPENAPI_SPEC);
    setHasUserSpec(true);
  };

  const handlePresetSelect = (preset: 'sandbox' | 'foodrescue' | 'custom') => {
    if (preset === 'sandbox') {
      setTargetUrl('https://sandbox.sentinelapi.dev/v1');
      setApiName('Sentinel Sandbox API');
      setFileName('vulnerable_ecommerce_openapi.json');
      setSpecContent(SAMPLE_OPENAPI_SPEC);
    } else if (preset === 'foodrescue') {
      setTargetUrl('https://api.foodrescue-network.org/v2');
      setApiName('FoodRescue Community Network API');
      setFileName('foodrescue_distribution_spec.json');
      setSpecContent(
        JSON.stringify(
          {
            openapi: '3.1.0',
            info: {
              title: 'FoodRescue Community Network API',
              version: '2.4.0',
              description: 'Real-time surplus food donation exchange and distribution logistics API',
            },
            servers: [{ url: 'https://api.foodrescue-network.org/v2' }],
            paths: {
              '/donations/{id}': {
                get: { summary: 'Get donation consignment record (BOLA tested)' },
                put: { summary: 'Update consignment status' },
              },
              '/volunteers/{id}/profile': {
                get: { summary: 'Volunteer profile and credentials' },
              },
              '/distribution/centers': {
                get: { summary: 'List distribution facilities' },
              },
              '/auth/token': {
                post: { summary: 'Exchange volunteer OAuth token' },
              },
            },
          },
          null,
          2
        )
      );
    }
    setShowPlusMenu(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userAcknowledgedAuth) {
      alert('You must acknowledge that you own or have explicit authorization to test this API.');
      return;
    }

    await trigger3DAction({
      title: 'Engaging Zero-Trust Security Scanner',
      subtitle: `Target: ${apiName} · ${targetUrl}`,
      category: 'ACTIVE FUZZING PROTOCOL',
      iconType: 'scan',
      durationMs: 1400,
      onComplete: () => {
        onStartScan(
          {
            targetUrl,
            apiName,
            apiKey,
            authHeaderType,
            customHeaderName: authHeaderType === 'bearer' ? 'Authorization' : customHeaderName,
            uploadedFileName: fileName,
            bolaTesting,
            excessiveDataExposure,
            authenticationChecks,
            rateLimitTesting,
            aiTestGeneration,
            rateLimitConcurrency: Math.min(20, Math.max(1, rateLimitTesting ? 20 : 1)),
          },
          specContent
        );
      },
    });
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Hidden File Inputs */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileInput}
        accept=".json,.yaml,.yml"
        className="hidden"
      />
      <input
        type="file"
        ref={plusFileInputRef}
        onChange={handleFileInput}
        accept=".json,.yaml,.yml"
        className="hidden"
      />

      {/* Warning Box Matching Reference Image */}
      <div className="p-4 rounded-xl border border-amber-500/30 bg-amber-950/20 text-amber-200 shadow-md">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="text-xs space-y-1">
            <div className="font-semibold text-amber-300 text-sm">
              Only scan APIs that you own or have explicit authorization to test.
            </div>
            <p className="text-amber-200/90 leading-relaxed">
              This demo scans exclusively against an intentionally vulnerable sandbox API or your authorized test target — no third-party or production systems are contacted without explicit authorization.
            </p>
          </div>
        </div>
      </div>

      {/* Main Scanner Container */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Upload OpenAPI Specification Card - EXACT LAYOUT FROM REFERENCE IMAGE */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-white tracking-wide">
              Upload OpenAPI Specification
            </h2>

            {/* Quick Action Button to Add Spec via + symbol */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowPlusMenu(!showPlusMenu)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 text-xs font-mono transition-colors shadow-sm"
                title="Add or Select API Specification"
              >
                <Plus className="w-4 h-4 text-cyan-400" />
                <span>Add API File</span>
              </button>

              {/* Popover Menu when clicking + button */}
              {showPlusMenu && (
                <div className="absolute right-0 mt-2 w-72 bg-slate-950 border border-slate-700 rounded-xl shadow-2xl p-2 z-50 text-xs animate-fadeIn">
                  <div className="px-2.5 py-1.5 text-[11px] font-mono text-slate-400 uppercase tracking-wider border-b border-slate-800">
                    Add API Source
                  </div>
                  <div className="py-1 space-y-1">
                    <button
                      type="button"
                      onClick={() => {
                        plusFileInputRef.current?.click();
                      }}
                      className="w-full text-left p-2 rounded-lg hover:bg-slate-900 text-slate-200 flex items-center gap-2.5 group transition-colors"
                    >
                      <div className="w-6 h-6 rounded bg-cyan-950 border border-cyan-800 flex items-center justify-center text-cyan-400 group-hover:border-cyan-400">
                        <UploadCloud className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <div className="font-semibold text-white">Upload Specification File</div>
                        <div className="text-[10px] text-slate-400">OpenAPI / Swagger (.json, .yaml)</div>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => handlePresetSelect('foodrescue')}
                      className="w-full text-left p-2 rounded-lg hover:bg-slate-900 text-slate-200 flex items-center gap-2.5 group transition-colors"
                    >
                      <div className="w-6 h-6 rounded bg-emerald-950 border border-emerald-800 flex items-center justify-center text-emerald-400 group-hover:border-emerald-400">
                        <Globe className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <div className="font-semibold text-white">FoodRescue Community API</div>
                        <div className="text-[10px] text-slate-400">Donation & logistics endpoints</div>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => handlePresetSelect('sandbox')}
                      className="w-full text-left p-2 rounded-lg hover:bg-slate-900 text-slate-200 flex items-center gap-2.5 group transition-colors"
                    >
                      <div className="w-6 h-6 rounded bg-purple-950 border border-purple-800 flex items-center justify-center text-purple-400 group-hover:border-purple-400">
                        <FileCode className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <div className="font-semibold text-white">Customer Orders & Auth API</div>
                        <div className="text-[10px] text-slate-400">E-Commerce sandbox sample</div>
                      </div>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Drag & Drop Zone Styled Identically to Reference Image */}
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-8 sm:p-10 text-center cursor-pointer transition-all ${
              dragOver
                ? 'border-emerald-400 bg-emerald-950/20'
                : 'border-emerald-500/60 bg-slate-950/70 hover:border-emerald-400 hover:bg-slate-950/90'
            }`}
          >
            <div className="flex flex-col items-center justify-center">
              <div className="w-12 h-12 rounded-lg bg-slate-900/80 border border-emerald-500/40 flex items-center justify-center text-emerald-400 mb-3 shadow-inner">
                <UploadCloud className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-semibold text-slate-100">
                Drop your OpenAPI / Swagger file here
              </h3>
              <p className="text-xs text-slate-400 mt-1 font-mono">
                Supports JSON and YAML
              </p>
            </div>
          </div>

          {/* Active Uploaded File Info Chip */}
          {fileName && (
            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between text-xs font-mono">
              <div className="flex items-center gap-2 truncate">
                <FileCode className="w-4 h-4 text-cyan-400 shrink-0" />
                <span className="text-slate-200 font-semibold truncate">{fileName}</span>
                <span className="text-slate-500 text-[11px]">({fileSize})</span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px]">
                  Parsed Ready
                </span>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-cyan-400 hover:underline text-[11px] ml-2"
                >
                  Change File
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Scan API URL Card - MATCHING REFERENCE IMAGE WITH SEARCH & INPUT CAPABILITY */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-white tracking-wide">
              Scan API URL
            </h2>
            <span className="text-[11px] font-mono text-slate-400">
              Target HTTP / HTTPS Host
            </span>
          </div>

          {/* URL Input Box with Search and + icon inside */}
          <div className="space-y-3">
            <div className="relative flex items-center">
              {/* Left Plus Button inside the URL Input */}
              <button
                type="button"
                onClick={() => setShowPlusMenu(!showPlusMenu)}
                className="absolute left-2.5 p-1 rounded-md text-slate-400 hover:text-cyan-300 hover:bg-slate-800 transition-colors"
                title="Add API File or Preset (+)"
              >
                <Plus className="w-4 h-4 text-cyan-400" />
              </button>

              <input
                type="url"
                required
                value={targetUrl}
                onChange={(e) => { const value = e.target.value; setTargetUrl(value); if (!hasUserSpec) setSpecContent(''); if (value && value !== 'https://sandbox.sentinelapi.dev/v1') setApiName('Custom API'); }}
                placeholder="Enter or search API URL (e.g. https://api.yourdomain.com/v1)"
                className="w-full pl-10 pr-28 py-2.5 text-xs bg-slate-950 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono tracking-tight shadow-inner"
              />

              <div className="absolute right-2.5 flex items-center gap-1.5 text-slate-500 text-[11px] font-mono pointer-events-none">
                <Globe className="w-3.5 h-3.5 text-slate-400" />
                <span>REST / GraphQL</span>
              </div>
            </div>

            {/* "Use Sandbox Target" Button - IDENTICAL TO REFERENCE IMAGE */}
            <button
              type="button"
              onClick={handleSetSandboxTarget}
              className="w-full py-2.5 rounded-lg bg-slate-950 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 text-xs font-semibold transition-colors flex items-center justify-center gap-2 shadow-sm"
            >
              <span>Use Sandbox Target</span>
            </button>
          </div>
        </div>

        {/* API Key / Authentication Credentials Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Key className="w-4 h-4 text-cyan-400" />
              <h2 className="text-sm font-bold text-white tracking-wide">
                API Authentication Key / Token
              </h2>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
              Required for BOLA & Auth Tests
            </span>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed">
            Provide the API key or authorization token used by SentinelAPI to authenticate fuzzing probes and verify authorization boundary controls.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Header Type Selector */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Auth Header Format
              </label>
              <select
                value={authHeaderType}
                onChange={(e) => setAuthHeaderType(e.target.value as any)}
                className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
              >
                <option value="api-key">X-API-Key</option>
                <option value="bearer">Authorization: Bearer</option>
                <option value="custom">Custom Header</option>
              </select>
            </div>

            {/* Custom Header Name if chosen */}
            {authHeaderType === 'custom' && (
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Header Name
                </label>
                <input
                  type="text"
                  value={customHeaderName}
                  onChange={(e) => setCustomHeaderName(e.target.value)}
                  placeholder="e.g. api-key or X-Auth-Token"
                  className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-700 rounded-lg text-slate-200 font-mono focus:outline-none focus:border-cyan-500"
                />
              </div>
            )}

            {/* API Key Input */}
            <div className={authHeaderType === 'custom' ? 'sm:col-span-1' : 'sm:col-span-2'}>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                API Key / Secret Token
              </label>
              <div className="relative flex items-center">
                <input
                  type={showApiKey ? 'text' : 'password'}
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="Enter API key (e.g. sk_live_...)"
                  className="w-full pr-10 pl-3 py-2 text-xs bg-slate-950 border border-slate-700 rounded-lg text-slate-200 font-mono focus:outline-none focus:border-cyan-500"
                />
                <button
                  type="button"
                  onClick={() => setShowApiKey(!showApiKey)}
                  className="absolute right-3 text-slate-500 hover:text-slate-300 transition-colors"
                  title={showApiKey ? 'Hide secret key' : 'Show secret key'}
                >
                  {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Scan Configuration Checkboxes */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl space-y-4">
          <h2 className="text-sm font-bold text-white tracking-wide">
            Scan Configuration
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <label className="flex items-center gap-3 p-3 rounded-lg bg-slate-950 border border-slate-800 hover:border-slate-700 cursor-pointer transition-colors">
              <input
                type="checkbox"
                checked={bolaTesting}
                onChange={(e) => setBolaTesting(e.target.checked)}
                className="w-4 h-4 rounded border-slate-700 text-cyan-500 focus:ring-0 cursor-pointer"
              />
              <div>
                <span className="font-semibold text-slate-200">Authorization / BOLA Testing</span>
                <p className="text-[11px] text-slate-400">Object identifier parameter tampering</p>
              </div>
            </label>

            <label className="flex items-center gap-3 p-3 rounded-lg bg-slate-950 border border-slate-800 hover:border-slate-700 cursor-pointer transition-colors">
              <input
                type="checkbox"
                checked={excessiveDataExposure}
                onChange={(e) => setExcessiveDataExposure(e.target.checked)}
                className="w-4 h-4 rounded border-slate-700 text-cyan-500 focus:ring-0 cursor-pointer"
              />
              <div>
                <span className="font-semibold text-slate-200">Excessive Data Exposure</span>
                <p className="text-[11px] text-slate-400">Inspect response payloads for leaked PII</p>
              </div>
            </label>

            <label className="flex items-center gap-3 p-3 rounded-lg bg-slate-950 border border-slate-800 hover:border-slate-700 cursor-pointer transition-colors">
              <input
                type="checkbox"
                checked={authenticationChecks}
                onChange={(e) => setAuthenticationChecks(e.target.checked)}
                className="w-4 h-4 rounded border-slate-700 text-cyan-500 focus:ring-0 cursor-pointer"
              />
              <div>
                <span className="font-semibold text-slate-200">Authentication Checks</span>
                <p className="text-[11px] text-slate-400">Validate JWT claims & token headers</p>
              </div>
            </label>

            <label className="flex items-center gap-3 p-3 rounded-lg bg-slate-950 border border-slate-800 hover:border-slate-700 cursor-pointer transition-colors">
              <input
                type="checkbox"
                checked={rateLimitTesting}
                onChange={(e) => setRateLimitTesting(e.target.checked)}
                className="w-4 h-4 rounded border-slate-700 text-cyan-500 focus:ring-0 cursor-pointer"
              />
              <div>
                <span className="font-semibold text-slate-200">Rate Limit Testing</span>
                <p className="text-[11px] text-slate-400">Simulate burst requests & throttle thresholds</p>
              </div>
            </label>
          </div>

          {/* Optional AI-Assisted Test Generation */}
          <div className="pt-2 border-t border-slate-800">
            <label className="flex items-center gap-3 p-3 rounded-lg bg-slate-950/60 border border-slate-800/80 cursor-pointer">
              <input
                type="checkbox"
                checked={aiTestGeneration}
                onChange={(e) => setAiTestGeneration(e.target.checked)}
                className="w-4 h-4 rounded border-slate-700 text-cyan-500 focus:ring-0 cursor-pointer"
              />
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400 shrink-0" />
                <span className="text-xs font-semibold text-slate-200">
                  AI-Assisted Test Generation (Optional)
                </span>
                <span className="text-[10px] font-mono text-cyan-400 px-1.5 py-0.5 rounded bg-cyan-950 border border-cyan-800">
                  Adaptive Probing
                </span>
              </div>
            </label>
          </div>
        </div>

        {/* Start Security Scan Submit Button */}
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Ready to dispatch zero-trust probe against: <strong className="text-cyan-400">{targetUrl}</strong></span>
          </div>

          <button
            type="submit"
            disabled={isScanning}
            className="flex items-center gap-2 px-8 py-3 rounded-lg bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-xs tracking-wider uppercase transition-all shadow-lg shadow-cyan-400/20 active:scale-95 disabled:opacity-50"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>Start Security Scan</span>
          </button>
        </div>
      </form>
    </div>
  );
};
