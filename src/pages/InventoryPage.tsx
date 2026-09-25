import React, { useState } from 'react';
import {
  Database,
  Plus,
  Scan,
  ShieldAlert,
  CheckCircle2,
  ExternalLink,
  Lock,
  Layers,
  Search,
  Filter,
  AlertTriangle,
} from 'lucide-react';
import { ApiInventoryItem } from '../types';
import { PageId } from '../components/layout/Sidebar';

interface InventoryPageProps {
  inventory: ApiInventoryItem[];
  onScanApi: (item: ApiInventoryItem) => void;
  onNavigate: (page: PageId) => void;
  searchQuery?: string;
}

export const InventoryPage: React.FC<InventoryPageProps> = ({
  inventory,
  onScanApi,
  onNavigate,
  searchQuery = '',
}) => {
  const [items, setItems] = useState<ApiInventoryItem[]>(inventory);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newApiName, setNewApiName] = useState('');
  const [newBaseUrl, setNewBaseUrl] = useState('');
  const [newAuthType, setNewAuthType] = useState<ApiInventoryItem['authType']>('JWT Bearer');
  const [newEndpointsCount, setNewEndpointsCount] = useState('12');

  const handleScanApiDirect = (api: ApiInventoryItem) => {
    onScanApi(api);
    onNavigate('scanner');
  };

  const filteredItems = items.filter((item) => {
    return (
      searchQuery === '' ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.baseUrl.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.authType.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const handleAddApi = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newApiName || !newBaseUrl) return;

    const newItem: ApiInventoryItem = {
      id: `api-0${items.length + 1}`,
      name: newApiName,
      baseUrl: newBaseUrl,
      environment: 'Sandbox',
      endpointsCount: parseInt(newEndpointsCount, 10) || 10,
      authType: newAuthType,
      lastScanDate: 'Just now',
      riskLevel: 'Low',
      openVulnerabilitiesCount: 0,
      ownerTeam: 'Core Engineering',
      specType: 'OpenAPI 3.1',
    };

    setItems([newItem, ...items]);
    setShowAddModal(false);
    setNewApiName('');
    setNewBaseUrl('');
  };

  const getRiskBadge = (level: ApiInventoryItem['riskLevel']) => {
    switch (level) {
      case 'Critical':
        return <span className="font-mono text-rose-400 font-bold">Critical Risk</span>;
      case 'High':
        return <span className="font-mono text-orange-400 font-bold">High Risk</span>;
      case 'Medium':
        return <span className="font-mono text-amber-400 font-bold">Medium Risk</span>;
      case 'Low':
        return <span className="font-mono text-blue-400 font-bold">Low Risk</span>;
      default:
        return <span className="font-mono text-emerald-400 font-bold">Secure</span>;
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner with Summary & Add Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded bg-slate-900 border border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-cyan-400" />
            <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
              Managed API Surface Catalog
            </h2>
          </div>
          <p className="text-xs text-slate-300 mt-1">
            {items.length} registered API microservices under continuous zero-trust authorization surveillance.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-xs transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Register New API</span>
        </button>
      </div>

      {/* Grid of Inventory Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredItems.map((api) => (
          <div
            key={api.id}
            className="p-5 rounded bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <h3 className="font-bold text-sm text-white">{api.name}</h3>
                <div className="text-xs font-mono">{getRiskBadge(api.riskLevel)}</div>
              </div>

              <div className="text-xs text-slate-400 font-mono truncate mb-4 bg-slate-950 px-2.5 py-1 rounded border border-slate-800/80">
                {api.baseUrl}
              </div>

              <div className="space-y-2 text-xs border-t border-slate-800/80 pt-3">
                <div className="flex items-center justify-between text-slate-400">
                  <span>Endpoints Exposed:</span>
                  <span className="font-mono text-white font-bold tabular-nums">
                    {api.endpointsCount} endpoints
                  </span>
                </div>

                <div className="flex items-center justify-between text-slate-400">
                  <span>Authentication:</span>
                  <span className="font-mono text-cyan-300">{api.authType}</span>
                </div>

                <div className="flex items-center justify-between text-slate-400">
                  <span>Last Scanned:</span>
                  <span className="font-mono text-slate-300">{api.lastScanDate}</span>
                </div>

                <div className="flex items-center justify-between text-slate-400">
                  <span>Open Findings:</span>
                  <span
                    className={`font-mono font-bold tabular-nums ${
                      api.openVulnerabilitiesCount > 0 ? 'text-rose-400' : 'text-emerald-400'
                    }`}
                  >
                    {api.openVulnerabilitiesCount} active
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
              <span className="text-[11px] font-mono text-slate-500">{api.ownerTeam}</span>

              <button
                onClick={() => handleScanApiDirect(api)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-cyan-400 hover:text-slate-950 text-slate-200 text-xs font-semibold transition-all interactive-btn"
                data-cursor-label="SCAN"
              >
                <Scan className="w-3.5 h-3.5" />
                <span>Scan API</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal: Register New API with Strong Blur and 3D Depth Pop-Out */}
      {showAddModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300 animate-fadeIn select-none"
          style={{
            backdropFilter: 'blur(28px) saturate(180%)',
            WebkitBackdropFilter: 'blur(28px) saturate(180%)',
            backgroundColor: 'rgba(2, 6, 23, 0.85)',
          }}
        >
          <div
            className="bg-gradient-to-b from-slate-900 via-slate-900/98 to-slate-950 border border-cyan-500/50 rounded-2xl p-6 w-full max-w-md shadow-[0_30px_90px_-15px_rgba(6,182,212,0.4),0_0_40px_rgba(6,182,212,0.15)] transition-all duration-300 transform-gpu"
            style={{
              transform: 'perspective(1400px) translateZ(30px) scale(1)',
              transformStyle: 'preserve-3d',
            }}
          >
            <h3 className="text-sm font-bold text-white mb-1">Register API Service</h3>
            <p className="text-xs text-slate-400 mb-4">
              Add an internal or sandbox API to continuous vulnerability scanning queues.
            </p>

            <form onSubmit={handleAddApi} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  API Service Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Billing Microservice"
                  value={newApiName}
                  onChange={(e) => setNewApiName(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-700 rounded text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Base URL (Sandbox / Introspection)
                </label>
                <input
                  type="url"
                  required
                  placeholder="https://sandbox.sentinelapi.internal/api/billing"
                  value={newBaseUrl}
                  onChange={(e) => setNewBaseUrl(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-700 rounded text-white font-mono focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Authentication Scheme
                  </label>
                  <select
                    value={newAuthType}
                    onChange={(e) => setNewAuthType(e.target.value as any)}
                    className="w-full px-2.5 py-2 text-xs bg-slate-950 border border-slate-700 rounded text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value="OAuth 2.0">OAuth 2.0</option>
                    <option value="JWT Bearer">JWT Bearer</option>
                    <option value="API Key">API Key</option>
                    <option value="mTLS">mTLS</option>
                    <option value="None">None (Public)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Endpoints Estimate
                  </label>
                  <input
                    type="number"
                    value={newEndpointsCount}
                    onChange={(e) => setNewEndpointsCount(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-700 rounded text-white font-mono focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-1.5 rounded text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-colors"
                >
                  Save API
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
