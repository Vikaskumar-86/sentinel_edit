export type SeverityLevel = 'Critical' | 'High' | 'Medium' | 'Low' | 'Info';

export type VulnerabilityStatus = 'Open' | 'In Review' | 'Resolved' | 'False Positive';

export type VulnerabilityCategory = 
  | 'Broken Object-Level Authorization (BOLA)'
  | 'Excessive Data Exposure'
  | 'Authentication Misconfiguration'
  | 'Rate Limiting Issues'
  | 'Broken Function-Level Authorization (BFLA)'
  | 'Security Misconfiguration';

export interface VulnerabilityFinding {
  id: string;
  title: string;
  category: VulnerabilityCategory;
  severity: SeverityLevel;
  cvssScore: number;
  cwe: string;
  owaspRank: string; // e.g. "API1:2023"
  endpoint: string;
  httpMethod: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  status: VulnerabilityStatus;
  detectedAt: string;
  apiName: string;
  description: string;
  evidence: {
    requestA: {
      method: string;
      url: string;
      headers: Record<string, string>;
      body?: string;
      userRole: string;
    };
    requestB: {
      method: string;
      url: string;
      headers: Record<string, string>;
      body?: string;
      userRole: string;
    };
    diffDescription: string;
    exposedFields?: string[];
  };
  reproductionSteps: string[];
  impact: string;
  recommendedFix: {
    explanation: string;
    codeLanguage: string;
    codeSnippet: string;
  };
  pocCurl: string;
}

export interface ApiInventoryItem {
  id: string;
  name: string;
  baseUrl: string;
  environment: 'Sandbox' | 'Staging' | 'Internal';
  endpointsCount: number;
  authType: 'OAuth 2.0' | 'JWT Bearer' | 'API Key' | 'mTLS' | 'None';
  lastScanDate: string;
  riskLevel: 'Critical' | 'High' | 'Medium' | 'Low' | 'Secure';
  openVulnerabilitiesCount: number;
  ownerTeam: string;
  specType: 'OpenAPI 3.1' | 'Swagger 2.0' | 'GraphQL';
}

export interface ScanHistoryEntry {
  id: string;
  projectId: string;
  projectName: string;
  scanId: string;
  scanDate: string;
  status: 'Completed' | 'In Progress' | 'Failed';
  endpointsScanned: number;
  vulnerabilitiesFound: number;
  riskScore: number;
  riskLevel: 'Critical' | 'High' | 'Medium' | 'Low';
}

export interface ScanReport {
  id: string;
  scanId: string;
  apiName: string;
  scanDate: string;
  durationSeconds: number;
  endpointsScanned: number;
  vulnerabilitiesFound: number;
  criticalCount: number;
  highCount: number;
  mediumCount: number;
  lowCount: number;
  riskScore: number; // 0 - 100
  riskLevel: 'Critical' | 'High' | 'Medium' | 'Low';
  complianceStatus: {
    owaspApiTop10: 'Fail' | 'Pass' | 'Warning';
    pciDssApi: 'Fail' | 'Pass' | 'Warning';
    gdprDataExposure: 'Fail' | 'Pass';
  };
  summary: string;
  vulnerabilityBreakdown?: { name: string; count: number }[];
}


export interface ScanStep {
  id: string;
  label: string;
  description: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  logMessages?: string[];
}

export interface ScanConfig {
  targetUrl: string;
  apiName: string;
  bolaTesting: boolean;
  excessiveDataExposure: boolean;
  authenticationChecks: boolean;
  rateLimitTesting: boolean;
  aiTestGeneration: boolean;
  uploadedSpecContent?: string;
  customAuthToken?: string;
  apiKey?: string;
  authHeaderType?: 'bearer' | 'api-key' | 'basic' | 'custom';
  customHeaderName?: string;
  uploadedFileName?: string;
  specSource?: 'upload' | 'url';
  rateLimitConcurrency: number;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  timestamp: string;
  content: string;
  codeSnippet?: string;
  suggestedActions?: string[];
}


export interface SecurityProject {
  id: string;
  name: string;
  description: string;
  environment: 'Demo Sandbox' | 'Authorized Project';
  endpoints: number;
  vulnerabilities: number;
  scans: number;
  securityScore: number | null;
  grade: string | null;
  lastScan: string | null;
}
