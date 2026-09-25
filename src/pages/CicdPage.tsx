import React, { useState } from 'react';
import {
  GitBranch,
  Copy,
  Check,
  Terminal,
  ShieldCheck,
  AlertTriangle,
  ArrowDown,
  ExternalLink,
  Sliders,
  PlayCircle,
  FileCode,
} from 'lucide-react';

export const CicdPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'github' | 'gitlab' | 'jenkins' | 'cli'>('github');
  const [copied, setCopied] = useState(false);
  const [failOnCritical, setFailOnCritical] = useState(true);
  const [failOnHigh, setFailOnHigh] = useState(true);
  const [failOnMedium, setFailOnMedium] = useState(false);
  const [maxCvssAllowed, setMaxCvssAllowed] = useState(7.0);

  const configs: Record<string, { filename: string; language: string; code: string }> = {
    github: {
      filename: '.github/workflows/sentinel-scan.yml',
      language: 'yaml',
      code: `name: "SentinelAPI Security Gate"

on:
  push:
    branches: [ "main", "develop" ]
  pull_request:
    branches: [ "main" ]

jobs:
  api-security-scan:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Codebase
        uses: actions/checkout@v4

      - name: Run SentinelAPI Zero-Trust Scanner
        uses: sentinelapi/scan-action@v1
        with:
          spec-file: "./openapi/openapi.json"
          api-token: \${{ secrets.SENTINEL_API_KEY }}
          fail-on-critical: ${failOnCritical}
          fail-on-high: ${failOnHigh}
          max-cvss-threshold: ${maxCvssAllowed}
          output-format: "sarif"
          sarif-file: "results.sarif"

      - name: Upload Security Findings to GitHub Code Scanning
        uses: github/codeql-action/upload-sarif@v3
        if: always()
        with:
          sarif_file: results.sarif`,
    },
    gitlab: {
      filename: '.gitlab-ci.yml',
      language: 'yaml',
      code: `stages:
  - test
  - security-gate
  - deploy

sentinelapi-zero-trust:
  stage: security-gate
  image: sentinelapi/cli:latest
  script:
    - sentinel-cli scan --spec ./specs/openapi.yaml \\
        --fail-on-critical=${failOnCritical} \\
        --fail-on-high=${failOnHigh} \\
        --max-cvss=${maxCvssAllowed} \\
        --report-json=gl-api-security-report.json
  artifacts:
    reports:
      api_fuzzing: gl-api-security-report.json
  rules:
    - if: '$CI_PIPELINE_SOURCE == "merge_request_event"'
    - if: '$CI_COMMIT_BRANCH == "main"'`,
    },
    jenkins: {
      filename: 'Jenkinsfile',
      language: 'groovy',
      code: `pipeline {
    agent any
    environment {
        SENTINEL_TOKEN = credentials('sentinel-api-token')
    }
    stages {
        stage('Checkout') {
            steps {
                git 'https://github.com/myorg/payment-service.git'
            }
        }
        stage('SentinelAPI Scan') {
            steps {
                sh '''
                    docker run --rm \\
                        -v $(pwd):/workspace \\
                        sentinelapi/cli:latest scan \\
                        --spec /workspace/openapi.json \\
                        --token $SENTINEL_TOKEN \\
                        --fail-on-critical=${failOnCritical}
                '''
            }
        }
    }
    post {
        failure {
            slackSend channel: '#security-alerts', message: "SentinelAPI build blocked by security gate!"
        }
    }
}`,
    },
    cli: {
      filename: 'Terminal / Local Docker Execution',
      language: 'bash',
      code: `# Install SentinelAPI CLI via Homebrew or npm
npm install -g @sentinelapi/cli

# Run an isolated sandbox contract scan
sentinel-cli scan \\
  --spec ./openapi.json \\
  --target https://sandbox.sentinelapi.internal/api/v1 \\
  --fail-on-critical \\
  --fail-on-high \\
  --output ./sentinel-report.json`,
    },
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(configs[activeTab].code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Top Banner */}
      <div className="p-5 rounded bg-slate-900 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <GitBranch className="w-4 h-4 text-cyan-400" />
            <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
              DevSecOps & CI/CD Pipeline Automation
            </h2>
          </div>
          <p className="text-xs text-slate-300 mt-1">
            Shift left by testing authorization logic and schema drift on every pull request before production deployment.
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs text-emerald-400">
          <ShieldCheck className="w-4 h-4" />
          <span>Zero-Trust PR Enforcement</span>
        </div>
      </div>

      {/* Pipeline Workflow Diagram */}
      <div className="p-6 rounded bg-slate-900/70 border border-slate-800">
        <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-6 text-center">
          Automated Pipeline Promotion Flow
        </h3>

        <div className="flex flex-col md:flex-row items-center justify-between gap-2 max-w-4xl mx-auto">
          {/* Step 1 */}
          <div className="w-full md:w-44 p-3 rounded bg-slate-950 border border-slate-800 text-center">
            <div className="text-[10px] font-mono text-cyan-400 font-bold mb-0.5">TRIGGER</div>
            <div className="text-xs font-bold text-white">Developer Push</div>
            <div className="text-[11px] text-slate-400 mt-0.5">Branch commit or PR</div>
          </div>

          <div className="hidden md:block text-slate-600 font-bold">→</div>
          <ArrowDown className="md:hidden w-4 h-4 text-slate-600 my-1" />

          {/* Step 2 */}
          <div className="w-full md:w-44 p-3 rounded bg-slate-950 border border-slate-800 text-center">
            <div className="text-[10px] font-mono text-cyan-400 font-bold mb-0.5">RUNNER</div>
            <div className="text-xs font-bold text-white">CI/CD Pipeline</div>
            <div className="text-[11px] text-slate-400 mt-0.5">GitHub, GitLab, Jenkins</div>
          </div>

          <div className="hidden md:block text-slate-600 font-bold">→</div>
          <ArrowDown className="md:hidden w-4 h-4 text-slate-600 my-1" />

          {/* Step 3 */}
          <div className="w-full md:w-48 p-3.5 rounded bg-cyan-950/40 border border-cyan-500 text-center shadow-lg shadow-cyan-950">
            <div className="text-[10px] font-mono text-cyan-300 font-bold mb-0.5">SCANNER</div>
            <div className="text-xs font-bold text-cyan-200">SentinelAPI Scan</div>
            <div className="text-[11px] text-slate-300 mt-0.5">Contract & BOLA tests</div>
          </div>

          <div className="hidden md:block text-slate-600 font-bold">→</div>
          <ArrowDown className="md:hidden w-4 h-4 text-slate-600 my-1" />

          {/* Step 4 */}
          <div className="w-full md:w-44 p-3 rounded bg-slate-950 border border-slate-800 text-center">
            <div className="text-[10px] font-mono text-purple-400 font-bold mb-0.5">EVALUATE</div>
            <div className="text-xs font-bold text-white">Security Analysis</div>
            <div className="text-[11px] text-slate-400 mt-0.5">CVSS threshold audit</div>
          </div>

          <div className="hidden md:block text-slate-600 font-bold">→</div>
          <ArrowDown className="md:hidden w-4 h-4 text-slate-600 my-1" />

          {/* Step 5 */}
          <div className="w-full md:w-44 p-3 rounded bg-slate-950 border border-slate-800 text-center">
            <div className="text-[10px] font-mono text-emerald-400 font-bold mb-0.5">VERDICT</div>
            <div className="text-xs font-bold text-white">Pass / Fail Gate</div>
            <div className="text-[11px] text-slate-400 mt-0.5">Blocks breach release</div>
          </div>
        </div>
      </div>

      {/* Gate Configuration & Code Samples */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 4 Cols: Gate Policy Rules */}
        <div className="lg:col-span-4 bg-slate-900/90 border border-slate-800 rounded p-5 space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
            <Sliders className="w-4 h-4 text-cyan-400" />
            <h3 className="text-xs font-semibold text-slate-200 uppercase tracking-wider">
              PR Security Gate Thresholds
            </h3>
          </div>

          <div className="space-y-3 text-xs">
            <label className="flex items-center justify-between p-2.5 rounded bg-slate-950 border border-slate-800 cursor-pointer">
              <span className="text-slate-200">Fail PR on Critical Findings (BOLA / Auth)</span>
              <input
                type="checkbox"
                checked={failOnCritical}
                onChange={(e) => setFailOnCritical(e.target.checked)}
                className="rounded border-slate-700 text-cyan-500"
              />
            </label>

            <label className="flex items-center justify-between p-2.5 rounded bg-slate-950 border border-slate-800 cursor-pointer">
              <span className="text-slate-200">Fail PR on High Severity (Data Exposure)</span>
              <input
                type="checkbox"
                checked={failOnHigh}
                onChange={(e) => setFailOnHigh(e.target.checked)}
                className="rounded border-slate-700 text-cyan-500"
              />
            </label>

            <label className="flex items-center justify-between p-2.5 rounded bg-slate-950 border border-slate-800 cursor-pointer">
              <span className="text-slate-200">Fail PR on Medium Severity</span>
              <input
                type="checkbox"
                checked={failOnMedium}
                onChange={(e) => setFailOnMedium(e.target.checked)}
                className="rounded border-slate-700 text-cyan-500"
              />
            </label>

            <div className="p-3 rounded bg-slate-950 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-slate-300">Maximum Allowed CVSS:</span>
                <span className="font-mono text-cyan-400 font-bold">{maxCvssAllowed.toFixed(1)}</span>
              </div>
              <input
                type="range"
                min="4.0"
                max="9.0"
                step="0.5"
                value={maxCvssAllowed}
                onChange={(e) => setMaxCvssAllowed(parseFloat(e.target.value))}
                className="w-full accent-cyan-400 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>Strict (4.0)</span>
                <span>Balanced (7.0)</span>
                <span>Permissive (9.0)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right 8 Cols: Code Snippets by Provider */}
        <div className="lg:col-span-8 bg-slate-900/90 border border-slate-800 rounded p-5 flex flex-col justify-between">
          <div>
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3 mb-4">
              <div className="flex items-center gap-1.5 p-1 bg-slate-950 border border-slate-800 rounded text-xs">
                {(['github', 'gitlab', 'jenkins', 'cli'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-3 py-1 rounded capitalize font-medium transition-colors ${
                      activeTab === tab
                        ? 'bg-slate-800 text-cyan-300'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {tab === 'github'
                      ? 'GitHub Actions'
                      : tab === 'gitlab'
                      ? 'GitLab CI'
                      : tab === 'jenkins'
                      ? 'Jenkins'
                      : 'Sentinel CLI'}
                  </button>
                ))}
              </div>

              <button
                onClick={handleCopyCode}
                className="flex items-center gap-1.5 px-3 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono border border-slate-700 transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy Config'}</span>
              </button>
            </div>

            <div className="flex items-center gap-2 text-xs font-mono text-slate-400 mb-2">
              <FileCode className="w-3.5 h-3.5 text-cyan-400" />
              <span>{configs[activeTab].filename}</span>
            </div>

            <pre className="p-4 bg-slate-950 border border-slate-800 rounded font-mono text-[11px] text-cyan-200 overflow-x-auto leading-relaxed max-h-[380px]">
              <code>{configs[activeTab].code}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
