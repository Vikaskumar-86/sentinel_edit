/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Sidebar, PageId } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { LandingPage } from './pages/LandingPage';
import { DashboardPage } from './pages/DashboardPage';
import { ScannerPage } from './pages/ScannerPage';
import { InventoryPage } from './pages/InventoryPage';
import { VulnerabilitiesPage } from './pages/VulnerabilitiesPage';
import { ReportsPage } from './pages/ReportsPage';
import { CicdPage } from './pages/CicdPage';
import { SettingsPage } from './pages/SettingsPage';
import { SecurityAssistant } from './components/assistant/SecurityAssistant';
import { VulnerabilityDetailModal } from './components/vulnerabilities/VulnerabilityDetailModal';
import { AuthModal } from './components/auth/AuthModal';
import { AuthProvider } from './context/AuthContext';
import { Action3DProvider } from './context/Action3DContext';
import { CustomCursor } from './components/common/CustomCursor';
import { AnimatedCyberBackground } from './components/common/AnimatedCyberBackground';
import { HoverFocusEffect } from './components/common/HoverFocusEffect';
import { INITIAL_FINDINGS, API_INVENTORY, SCAN_REPORTS } from './data/mockData';
import { VulnerabilityFinding, ApiInventoryItem, ScanReport, SecurityProject } from './types';
import { ProjectsPage } from './pages/ProjectsPage';
import { ScanHistoryPage } from './pages/ScanHistoryPage';
import { ReportViewerModal } from './components/reports/ReportViewerModal';
import { ScanHistoryEntry } from './types';

function SentinelApp({
  currentPage,
  setCurrentPage,
  activeProject,
  setActiveProject,
  projects,
  setProjects,
}: {
  currentPage: PageId;
  setCurrentPage: (page: PageId) => void;
  activeProject: SecurityProject | null;
  setActiveProject: (project: SecurityProject | null) => void;
  projects: SecurityProject[];
  setProjects: React.Dispatch<React.SetStateAction<SecurityProject[]>>;
}) {
  const [findings, setFindings] = useState<VulnerabilityFinding[]>(INITIAL_FINDINGS);
  const [inventory, setInventory] = useState<ApiInventoryItem[]>(API_INVENTORY);
  const [reports, setReports] = useState<ScanReport[]>(SCAN_REPORTS);
  const [scanHistory, setScanHistory] = useState<ScanHistoryEntry[]>(() => {
    const saved = localStorage.getItem('sentinelapi-scan-history');
    if (saved) { try { return JSON.parse(saved); } catch {} }
    return SCAN_REPORTS.map((r, i) => ({ id: `hist-${r.id}`, projectId: i === 0 ? 'demo-sandbox' : `legacy-${i}`, projectName: r.apiName, scanId: r.scanId, scanDate: r.scanDate, status: 'Completed', endpointsScanned: r.endpointsScanned, vulnerabilitiesFound: r.vulnerabilitiesFound, riskScore: r.riskScore, riskLevel: r.riskLevel }));
  });
  const [selectedHistoryReport, setSelectedHistoryReport] = useState<ScanReport | null>(null);
  const [selectedFinding, setSelectedFinding] = useState<VulnerabilityFinding | null>(null);
  const [assistantActiveFinding, setAssistantActiveFinding] = useState<VulnerabilityFinding | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false);

  const handleToggleStatus = (id: string, newStatus: 'Open' | 'Resolved') => {
    setFindings((prev) =>
      prev.map((f) => (f.id === id ? { ...f, status: newStatus } : f))
    );
    if (selectedFinding && selectedFinding.id === id) {
      setSelectedFinding((prev) => (prev ? { ...prev, status: newStatus } : null));
    }
  };

  const handleAskAiAboutFinding = (finding: VulnerabilityFinding) => {
    setAssistantActiveFinding(finding);
    setCurrentPage('assistant');
  };

  React.useEffect(() => { localStorage.setItem('sentinelapi-scan-history', JSON.stringify(scanHistory)); }, [scanHistory]);

  const handleScanApi = (item: ApiInventoryItem) => {
    setCurrentPage('scanner');
  };

  const openCount = findings.filter((f) => f.status === 'Open').length;
  const criticalCount = findings.filter((f) => f.severity === 'Critical' && f.status === 'Open').length;

  return (
    <div className="relative min-h-screen bg-[#020617] text-slate-100 flex flex-col font-sans selection:bg-cyan-500/20 selection:text-cyan-200 overflow-x-hidden">
      {/* Animated Cyber Zero-Trust Background */}
      <AnimatedCyberBackground />

      {/* Interactive Cyber Cursor with Trailing Reticle, Particles & HUD tags */}
      <CustomCursor />

      {/* Minimal Hover / Click Interaction */}
      <HoverFocusEffect />

      <div className="relative z-10 flex flex-1 w-full min-h-screen">
        {/* Sidebar */}
        <Sidebar
          currentPage={currentPage}
          onSelectPage={(page) => {
            setCurrentPage(page);
            setIsMobileSidebarOpen(false);
          }}
          openCount={openCount}
          criticalCount={criticalCount}
          isOpenMobile={isMobileSidebarOpen}
          onCloseMobile={() => setIsMobileSidebarOpen(false)}
          activeProject={activeProject}
        />

        {/* Main Content Viewport */}
        <div className="flex-1 flex flex-col min-w-0 bg-transparent">
          {/* Top Bar Header with Sign-In Profile and Search */}
          <Header
            currentPage={currentPage}
            onSelectPage={setCurrentPage}
            onToggleMobileMenu={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />

          {/* Page Routing */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
            {currentPage === 'landing' && (
              <LandingPage onNavigate={setCurrentPage} />
            )}

            {currentPage === 'projects' && (
              <ProjectsPage
                projects={projects}
                onCreateProject={(name, description) => {
                  const newProject: SecurityProject = {
                    id: `project-${Date.now()}`,
                    name,
                    description,
                    environment: 'Authorized Project',
                    endpoints: 0,
                    vulnerabilities: 0,
                    scans: 0,
                    securityScore: null,
                    grade: null,
                    lastScan: null,
                  };
                  setProjects((prev) => [...prev, newProject]);
                  setScanHistory((prev) => prev);
                }}
                onOpenProject={(project) => {
                  const opened = project.securityScore == null
                    ? { ...project, endpoints: 24, vulnerabilities: 6, scans: 1, securityScore: 19, grade: 'F', lastScan: new Date().toLocaleDateString('en-US') }
                    : project;
                  setActiveProject(opened);
                  setProjects((prev) => prev.map((p) => p.id === opened.id ? opened : p));
                  setCurrentPage('dashboard');
                }}
                onNavigate={setCurrentPage}
              />
            )}

            {currentPage === 'scan-history' && (
              <ScanHistoryPage
                projects={projects}
                history={scanHistory}
                reports={reports}
                onNavigate={setCurrentPage}
                onViewReport={setSelectedHistoryReport}
              />
            )}

            {currentPage === 'dashboard' && (
              <DashboardPage
                findings={findings}
                onSelectFinding={setSelectedFinding}
                selectedFinding={selectedFinding}
                onCloseFindingModal={() => setSelectedFinding(null)}
                onToggleStatus={handleToggleStatus}
                onNavigate={setCurrentPage}
                onAskAiAboutFinding={handleAskAiAboutFinding}
                searchQuery={searchQuery}
              />
            )}

            {currentPage === 'scanner' && (
              <ScannerPage
                existingFindings={findings}
                activeProject={activeProject}
                onScanCompletedAddFindings={(newF) => {
                  setFindings((prev) => [...newF, ...prev]);
                }}
                onScanCompletedAddReport={(report) => {
                  setReports((prev) => [report, ...prev.filter(r => r.scanId !== report.scanId)]);
                  setScanHistory((prev) => [{ id: `hist-${report.id}`, projectId: activeProject?.id || 'unassigned', projectName: activeProject?.name || report.apiName, scanId: report.scanId, scanDate: report.scanDate, status: 'Completed', endpointsScanned: report.endpointsScanned, vulnerabilitiesFound: report.vulnerabilitiesFound, riskScore: report.riskScore, riskLevel: report.riskLevel }, ...prev.filter(h => h.scanId !== report.scanId)]);
                }}
                onNavigate={setCurrentPage}
              />
            )}

            {currentPage === 'inventory' && (
              <InventoryPage
                inventory={inventory}
                onScanApi={handleScanApi}
                onNavigate={setCurrentPage}
                searchQuery={searchQuery}
              />
            )}

            {currentPage === 'vulnerabilities' && (
              <VulnerabilitiesPage
                findings={findings}
                onToggleStatus={handleToggleStatus}
                onNavigate={setCurrentPage}
                onAskAiAboutFinding={handleAskAiAboutFinding}
                searchQuery={searchQuery}
              />
            )}

            {currentPage === 'reports' && (
              <ReportsPage reports={reports} onNavigate={setCurrentPage} />
            )}

            {currentPage === 'assistant' && (
              <SecurityAssistant
                findings={findings}
                activeFinding={assistantActiveFinding}
              />
            )}

            {currentPage === 'cicd' && <CicdPage />}

            {currentPage === 'settings' && <SettingsPage />}
          </main>
        </div>
      </div>

      {/* Global Vulnerability Inspection Modal */}
      {selectedFinding && currentPage !== 'dashboard' && currentPage !== 'vulnerabilities' && (
        <VulnerabilityDetailModal
          finding={selectedFinding}
          onClose={() => setSelectedFinding(null)}
          onToggleStatus={handleToggleStatus}
          onAskAiAboutFinding={handleAskAiAboutFinding}
        />
      )}

      {/* Global Authentication Modal with Persona Redirection */}
      <AuthModal onSuccessNavigate={setCurrentPage} />
      {selectedHistoryReport && <ReportViewerModal report={selectedHistoryReport} onClose={() => setSelectedHistoryReport(null)} />}
    </div>
  );
}

const INITIAL_PROJECTS: SecurityProject[] = [
  {
    id: 'demo-sandbox',
    name: 'SentinelAPI Demo Sandbox',
    description: 'Intentionally vulnerable sandbox environment for live defensive security evaluation.',
    environment: 'Demo Sandbox',
    endpoints: 24,
    vulnerabilities: 6,
    scans: 1,
    securityScore: 19,
    grade: 'F',
    lastScan: '9/24/2026',
  },
  {
    id: 'test-project',
    name: 'Test Project',
    description: 'Testing project',
    environment: 'Authorized Project',
    endpoints: 0,
    vulnerabilities: 0,
    scans: 0,
    securityScore: null,
    grade: null,
    lastScan: null,
  },
];

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageId>('projects');
  const [projects, setProjects] = useState<SecurityProject[]>(INITIAL_PROJECTS);
  const [activeProject, setActiveProject] = useState<SecurityProject | null>(INITIAL_PROJECTS[0]);

  return (
    <Action3DProvider>
      <AuthProvider onRedirect={setCurrentPage}>
        <SentinelApp
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          activeProject={activeProject}
          setActiveProject={setActiveProject}
          projects={projects}
          setProjects={setProjects}
        />
      </AuthProvider>
    </Action3DProvider>
  );
}
