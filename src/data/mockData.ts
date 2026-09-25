import {
  VulnerabilityFinding,
  ApiInventoryItem,
  ScanReport,
  ScanStep,
} from '../types';

export const INITIAL_FINDINGS: VulnerabilityFinding[] = [
  {
    id: 'VULN-2026-0811',
    title: 'Broken Object-Level Authorization (BOLA / IDOR)',
    category: 'Broken Object-Level Authorization (BOLA)',
    severity: 'Critical',
    cvssScore: 9.1,
    cwe: 'CWE-639: Authorization Bypass Through User-Controlled Key',
    owaspRank: 'API1:2023 - Broken Object Level Authorization',
    endpoint: '/api/orders/{id}',
    httpMethod: 'GET',
    status: 'Open',
    detectedAt: '12 minutes ago',
    apiName: 'Customer Orders API',
    description:
      'The endpoint does not validate whether the requesting authenticated user owns or is authorized to view the requested order record. By modifying the URL parameter `id` from 1001 to 1002, a standard customer can inspect other customers\' order details, billing addresses, and payment transaction references.',
    evidence: {
      requestA: {
        method: 'GET',
        url: 'https://sandbox.sentinelapi.internal/api/orders/1001',
        headers: {
          Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6... (User A, ID: 4882)',
          'Content-Type': 'application/json',
          'X-Client-Version': '2.14.0',
        },
        userRole: 'Customer A (Valid Owner of Order 1001)',
      },
      requestB: {
        method: 'GET',
        url: 'https://sandbox.sentinelapi.internal/api/orders/1002',
        headers: {
          Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6... (User A, ID: 4882)',
          'Content-Type': 'application/json',
          'X-Client-Version': '2.14.0',
        },
        userRole: 'Customer A (Requesting Order 1002 belonging to User B)',
      },
      diffDescription:
        'HTTP 200 OK returned with full confidential payload of Order 1002 (customer_id: 9912, amount: $1,420.00, billing_address: "142 Market St, SF"). Expected HTTP 403 Forbidden or 404 Not Found.',
      exposedFields: ['customer_id', 'billing_address', 'cc_last4', 'order_items', 'transaction_ref'],
    },
    reproductionSteps: [
      'Authenticate as User A to obtain a standard valid session JWT.',
      'Send GET request to /api/orders/1001 and observe successful response for owned resource.',
      'Replace path parameter ID with an adjacent or targeted object ID: /api/orders/1002.',
      'Dispatch request using User A\'s credentials without modifying headers.',
      'Observe HTTP 200 OK returning User B\'s order data without any ownership rejection.',
    ],
    impact:
      'Total breach of confidentiality. Attackers can enumerate all sequential customer orders across the platform, harvest personally identifiable information (PII), shipping destinations, and financial transaction metadata.',
    recommendedFix: {
      explanation:
        'Enforce server-side object ownership verification in the data access layer. Validate that `order.customerId === req.user.id` or that the requesting user holds an explicit administrative role before returning records.',
      codeLanguage: 'typescript',
      codeSnippet: `// Server-side fix in Orders Controller / Service
export async function getOrderById(req: AuthenticatedRequest, res: Response) {
  const { id } = req.params;
  const currentUserId = req.user.id;

  const order = await db.orders.findUnique({
    where: { id: Number(id) }
  });

  if (!order) {
    return res.status(404).json({ error: 'Order not found' });
  }

  // Verify object-level ownership
  if (order.customerId !== currentUserId && !req.user.roles.includes('ADMIN')) {
    return res.status(403).json({
      error: 'Access denied: You do not have permission to view this resource'
    });
  }

  return res.status(200).json({ data: order });
}`,
    },
    pocCurl: `curl -X GET "https://sandbox.sentinelapi.internal/api/orders/1002" \\
  -H "Authorization: Bearer <USER_A_TOKEN>" \\
  -H "Accept: application/json"`,
  },
  {
    id: 'VULN-2026-0812',
    title: 'Excessive Data Exposure in User Profile Endpoint',
    category: 'Excessive Data Exposure',
    severity: 'High',
    cvssScore: 7.5,
    cwe: 'CWE-200: Exposure of Sensitive Information to an Unauthorized Actor',
    owaspRank: 'API3:2023 - Broken Object Property Level Authorization',
    endpoint: '/api/users/{id}',
    httpMethod: 'GET',
    status: 'Open',
    detectedAt: '24 minutes ago',
    apiName: 'Identity & User Service',
    description:
      'The endpoint serializes the full internal database entity of the User model rather than returning a sanitized Data Transfer Object (DTO). Sensitive internal properties including password_hash, mfa_secret_seed, internal_roles, and ssn_last4 are transmitted in the JSON response body.',
    evidence: {
      requestA: {
        method: 'GET',
        url: 'https://sandbox.sentinelapi.internal/api/users/8821',
        headers: {
          Authorization: 'Bearer eyJhbGciOiJIUzI1Ni...',
          Accept: 'application/json',
        },
        userRole: 'Authenticated Mobile Client',
      },
      requestB: {
        method: 'GET',
        url: 'https://sandbox.sentinelapi.internal/api/users/8821',
        headers: {
          Authorization: 'Bearer eyJhbGciOiJIUzI1Ni...',
          Accept: 'application/json',
        },
        userRole: 'Public Query Response',
      },
      diffDescription:
        'Response payload contains 24 attributes, including cryptographic hash ("$2b$12$eX8..."), reset_password_token, and internal flag "is_superuser: false". Client UI only renders username and avatar_url.',
      exposedFields: ['password_hash', 'mfa_secret', 'internal_notes', 'ssn_last4', 'reset_token'],
    },
    reproductionSteps: [
      'Call GET /api/users/8821 with standard bearer authentication.',
      'Inspect the raw JSON response payload returned by the server.',
      'Locate fields "password_hash", "mfa_secret", and "reset_password_token" inside the profile envelope.',
      'Notice that the API relies on client-side filtering to hide attributes, rather than server-side projection.',
    ],
    impact:
      'Cryptographic hashes and multi-factor authentication setup seeds can be extracted by any viewer, paving the way for offline credential cracking and MFA bypass.',
    recommendedFix: {
      explanation:
        'Never return raw ORM entities directly. Use strict response DTOs or schema projections (e.g. Zod or Prisma select) that only expose explicit public fields.',
      codeLanguage: 'typescript',
      codeSnippet: `// Safe projection DTO with Zod / Prisma
export const PublicUserProfileSchema = z.object({
  id: z.string(),
  displayName: z.string(),
  avatarUrl: z.string().url().nullable(),
  createdAt: z.date(),
});

export async function getUserProfile(req: Request, res: Response) {
  const user = await db.user.findUnique({
    where: { id: req.params.id },
    select: {
      id: true,
      displayName: true,
      avatarUrl: true,
      createdAt: true,
      // password_hash and mfa_secret excluded by design
    }
  });

  return res.json(user);
}`,
    },
    pocCurl: `curl -X GET "https://sandbox.sentinelapi.internal/api/users/8821" \\
  -H "Authorization: Bearer <AUTH_TOKEN>"`,
  },
  {
    id: 'VULN-2026-0813',
    title: 'Authentication Misconfiguration & Missing Token Expiry',
    category: 'Authentication Misconfiguration',
    severity: 'High',
    cvssScore: 8.2,
    cwe: 'CWE-306: Missing Authentication for Critical Function',
    owaspRank: 'API2:2023 - Broken Authentication',
    endpoint: '/api/admin',
    httpMethod: 'POST',
    status: 'In Review',
    detectedAt: '45 minutes ago',
    apiName: 'Payment API & Gateway',
    description:
      'The administrative dispatch endpoint accepts unauthenticated calls when a custom header `X-Internal-Gateway: true` is supplied, or fails to validate the signature algorithm (accepting `alg: none` JWTs in request headers).',
    evidence: {
      requestA: {
        method: 'POST',
        url: 'https://sandbox.sentinelapi.internal/api/admin/system/flush-cache',
        headers: {
          'Content-Type': 'application/json',
          'X-Internal-Gateway': 'true',
        },
        body: '{"scope": "all"}',
        userRole: 'Unauthenticated Attacker spoofing proxy header',
      },
      requestB: {
        method: 'POST',
        url: 'https://sandbox.sentinelapi.internal/api/admin/system/flush-cache',
        headers: {
          'Content-Type': 'application/json',
        },
        body: '{"scope": "all"}',
        userRole: 'Standard External Client',
      },
      diffDescription:
        'With X-Internal-Gateway header present, the endpoint bypasses auth middleware and executes privileged system routines.',
    },
    reproductionSteps: [
      'Formulate a POST request to /api/admin without supplying Authorization headers.',
      'Inject header "X-Internal-Gateway: true".',
      'Observe server returning HTTP 200 with privileged confirmation payload.',
    ],
    impact:
      'Complete administrative compromise without valid credentials. Attackers can execute destructive maintenance routines, alter system state, or trigger privileged data dumps.',
    recommendedFix: {
      explanation:
        'Do not rely on trusting incoming client headers for perimeter authentication. Strip internal spoofable headers at the reverse proxy layer and mandate cryptographic mTLS or verified JWTs with strict algorithm checking.',
      codeLanguage: 'typescript',
      codeSnippet: `// Secure Admin Authentication Middleware
export function requireAdminMtlsOrJwt(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing or malformed authorization token' });
  }

  try {
    const token = authHeader.split(' ')[1];
    // Explicitly enforce trusted algorithm (RS256)
    const decoded = jwt.verify(token, process.env.JWT_PUBLIC_KEY!, {
      algorithms: ['RS256'],
      issuer: 'sentinelapi-auth',
    }) as JwtPayload;

    if (!decoded.roles?.includes('SYSTEM_ADMIN')) {
      return res.status(403).json({ error: 'Administrative privileges required' });
    }

    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}`,
    },
    pocCurl: `curl -X POST "https://sandbox.sentinelapi.internal/api/admin" \\
  -H "X-Internal-Gateway: true" \\
  -H "Content-Type: application/json" \\
  -d '{"action": "grant_role", "userId": 4882, "role": "admin"}'`,
  },
  {
    id: 'VULN-2026-0814',
    title: 'Weak Rate Limiting on Credential Endpoint',
    category: 'Rate Limiting Issues',
    severity: 'Medium',
    cvssScore: 5.8,
    cwe: 'CWE-307: Improper Restriction of Excessive Authentication Attempts',
    owaspRank: 'API4:2023 - Unrestricted Resource Consumption',
    endpoint: '/api/login',
    httpMethod: 'POST',
    status: 'Open',
    detectedAt: '1 hour ago',
    apiName: 'Identity & User Service',
    description:
      'The authentication endpoint does not enforce rate limiting or account lockout controls. A burst of 1,200 simulated login attempts across 30 seconds resulted in zero HTTP 429 Too Many Requests responses. The API is susceptible to automated credential stuffing and brute-force attacks.',
    evidence: {
      requestA: {
        method: 'POST',
        url: 'https://sandbox.sentinelapi.internal/api/login',
        headers: { 'Content-Type': 'application/json' },
        body: '{"email": "test@example.com", "password": "pass1"}',
        userRole: 'Simulated Attacker (Request #1)',
      },
      requestB: {
        method: 'POST',
        url: 'https://sandbox.sentinelapi.internal/api/login',
        headers: { 'Content-Type': 'application/json' },
        body: '{"email": "test@example.com", "password": "pass1200"}',
        userRole: 'Simulated Attacker (Request #1200 within 30s)',
      },
      diffDescription:
        'All 1,200 requests returned HTTP 401 with standard latency. No exponential backoff, CAPTCHA challenge, or 429 status code was triggered.',
    },
    reproductionSteps: [
      'Execute a fast concurrency script against /api/login with invalid credentials.',
      'Send 500 requests at 50 req/sec from a single IP address.',
      'Review responses: All return 401 Unauthorized without throttling or IP block.',
    ],
    impact:
      'Allows high-speed brute force attacks, credential stuffing from compromised breach dumps, and potential resource starvation of backend hashing algorithms (bcrypt/argon2).',
    recommendedFix: {
      explanation:
        'Implement distributed token-bucket rate limiting via Redis at the gateway. Restrict login attempts to 5 per IP and 5 per account per minute, accompanied by progressive delays.',
      codeLanguage: 'typescript',
      codeSnippet: `import rateLimit from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';

export const loginLimiter = rateLimit({
  store: new RedisStore({ sendCommand: (...args: string[]) => redisClient.sendCommand(args) }),
  windowMs: 60 * 1000, // 1 minute
  max: 5, // max 5 attempts per window per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'Too many authentication attempts. Please try again after 60 seconds.',
    retryAfterSeconds: 60,
  },
});`,
    },
    pocCurl: `for i in {1..20}; do
  curl -s -o /dev/null -w "%{http_code}\\n" -X POST "https://sandbox.sentinelapi.internal/api/login" \\
    -H "Content-Type: application/json" \\
    -d '{"email":"admin@target.com","password":"guess"}'
done`,
  },
  {
    id: 'VULN-2026-0815',
    title: 'Broken Function-Level Authorization (BFLA) on User Role Elevation',
    category: 'Broken Function-Level Authorization (BFLA)',
    severity: 'Critical',
    cvssScore: 9.3,
    cwe: 'CWE-285: Improper Authorization',
    owaspRank: 'API5:2023 - Broken Function Level Authorization',
    endpoint: '/api/users/{id}/role',
    httpMethod: 'PUT',
    status: 'Open',
    detectedAt: '2 hours ago',
    apiName: 'Identity & User Service',
    description:
      'Standard low-privileged authenticated users can promote their own or other accounts to superadmin by dispatching a PUT request to the role modification sub-resource without role validation checks.',
    evidence: {
      requestA: {
        method: 'PUT',
        url: 'https://sandbox.sentinelapi.internal/api/users/4882/role',
        headers: {
          Authorization: 'Bearer eyJ... (User A, Role: MEMBER)',
          'Content-Type': 'application/json',
        },
        body: '{"role": "SUPERADMIN"}',
        userRole: 'Standard Member',
      },
      requestB: {
        method: 'PUT',
        url: 'https://sandbox.sentinelapi.internal/api/users/4882/role',
        headers: {
          Authorization: 'Bearer eyJ... (User A, Role: MEMBER)',
          'Content-Type': 'application/json',
        },
        body: '{"role": "SUPERADMIN"}',
        userRole: 'Self-Elevation Outcome',
      },
      diffDescription:
        'HTTP 200 OK returned: {"success": true, "user": {"id": 4882, "role": "SUPERADMIN"}}. Role immediately granted without admin session.',
    },
    reproductionSteps: [
      'Log in as an unprivileged user.',
      'Extract access token.',
      'Send PUT request to /api/users/<your-id>/role with payload {"role":"SUPERADMIN"}.',
      'Verify role update returned in response.',
    ],
    impact:
      'Immediate privilege escalation to superadmin, bypassing all tenant isolation and granting full system compromise.',
    recommendedFix: {
      explanation:
        'Enforce strict role-based access control (RBAC) middleware verifying that the invoker has `security:role:manage` authorization permission.',
      codeLanguage: 'typescript',
      codeSnippet: `export function requirePermission(permission: string) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user.permissions?.includes(permission)) {
      return res.status(403).json({
        error: 'Forbidden: Insufficient privileges to alter account governance'
      });
    }
    next();
  };
}`,
    },
    pocCurl: `curl -X PUT "https://sandbox.sentinelapi.internal/api/users/4882/role" \\
  -H "Authorization: Bearer <MEMBER_TOKEN>" \\
  -H "Content-Type: application/json" \\
  -d '{"role":"SUPERADMIN"}'`,
  },
  {
    id: 'VULN-2026-0816',
    title: 'Missing Rate Limiting on Batch Export API',
    category: 'Rate Limiting Issues',
    severity: 'Medium',
    cvssScore: 6.5,
    cwe: 'CWE-770: Allocation of Resources Without Limits or Throttling',
    owaspRank: 'API4:2023 - Unrestricted Resource Consumption',
    endpoint: '/api/reports/export-all',
    httpMethod: 'POST',
    status: 'Open',
    detectedAt: '3 hours ago',
    apiName: 'Analytics & Reporting API',
    description:
      'The batch export endpoint initiates heavy asynchronous PDF/CSV compression pipelines without restricting concurrent jobs per tenant, allowing Denial of Service via worker pool exhaustion.',
    evidence: {
      requestA: {
        method: 'POST',
        url: 'https://sandbox.sentinelapi.internal/api/reports/export-all',
        headers: { Authorization: 'Bearer eyJhbGci...' },
        userRole: 'Single Tenant User',
      },
      requestB: {
        method: 'POST',
        url: 'https://sandbox.sentinelapi.internal/api/reports/export-all',
        headers: { Authorization: 'Bearer eyJhbGci...' },
        userRole: '50 Concurrent Requests',
      },
      diffDescription:
        'All 50 jobs queued simultaneously, CPU utilization spiked to 98% and queue backlog exceeded 400 jobs.',
    },
    reproductionSteps: [
      'Dispatch multiple concurrent POST requests to /api/reports/export-all.',
      'Monitor server queue: no throttling or maximum concurrent worker cap enforced per tenant.',
    ],
    impact: 'Backend worker queue starvation, service denial for other users.',
    recommendedFix: {
      explanation: 'Limit concurrent export jobs per organization and enforce a minimum cooldown timer.',
      codeLanguage: 'typescript',
      codeSnippet: `// Check active tenant jobs before queuing
const activeJobs = await queue.getJobsCountByTenant(req.tenantId, ['active', 'waiting']);
if (activeJobs >= 2) {
  return res.status(429).json({
    error: 'Maximum concurrent exports reached (2). Please wait for ongoing jobs to complete.'
  });
}`,
    },
    pocCurl: `curl -X POST "https://sandbox.sentinelapi.internal/api/reports/export-all" \\
  -H "Authorization: Bearer <AUTH_TOKEN>"`,
  },
  {
    id: 'VULN-2026-0817',
    title: 'Permissive CORS Configuration with Wildcard Origin',
    category: 'Security Misconfiguration',
    severity: 'Low',
    cvssScore: 4.3,
    cwe: 'CWE-942: Permissive Cross-Domain Policy with Untrusted Domains',
    owaspRank: 'API7:2023 - Server Side Request Forgery & Misconfig',
    endpoint: '/api/v1/meta/config',
    httpMethod: 'GET',
    status: 'Open',
    detectedAt: '5 hours ago',
    apiName: 'Customer Orders API',
    description:
      'The API reflects the `Origin` header from incoming requests in `Access-Control-Allow-Origin: *` along with credentials enabled, allowing malicious origins to read authenticated cross-origin responses.',
    evidence: {
      requestA: {
        method: 'GET',
        url: 'https://sandbox.sentinelapi.internal/api/v1/meta/config',
        headers: { Origin: 'https://evil-attacker-site.com' },
        userRole: 'Third-party Cross-Origin site',
      },
      requestB: {
        method: 'GET',
        url: 'https://sandbox.sentinelapi.internal/api/v1/meta/config',
        headers: { Origin: 'https://evil-attacker-site.com' },
        userRole: 'Server Response Headers',
      },
      diffDescription:
        'Response headers contained: Access-Control-Allow-Origin: * and Access-Control-Allow-Credentials: true.',
    },
    reproductionSteps: [
      'Send GET request with custom header Origin: https://unauthorized-domain.com.',
      'Inspect response headers for wildcard or reflected origin with credentials.',
    ],
    impact: 'Potential data leak to malicious cross-origin websites executing JavaScript in victim browser.',
    recommendedFix: {
      explanation: 'Define an explicit whitelist of trusted origins and avoid wildcard matching.',
      codeLanguage: 'typescript',
      codeSnippet: `import cors from 'cors';

const allowedOrigins = ['https://app.sentinelapi.io', 'https://portal.mycompany.com'];

export const secureCors = cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Blocked by CORS policy'));
    }
  },
  credentials: true,
});`,
    },
    pocCurl: `curl -I -X GET "https://sandbox.sentinelapi.internal/api/v1/meta/config" \\
  -H "Origin: https://attacker.example.org"`,
  },
  {
    id: 'VULN-2026-0818',
    title: 'Verbose Stack Trace Exposure on Unhandled Database Exception',
    category: 'Security Misconfiguration',
    severity: 'Low',
    cvssScore: 3.7,
    cwe: 'CWE-209: Generation of Error Message Containing Sensitive Information',
    owaspRank: 'API8:2023 - Security Misconfiguration',
    endpoint: '/api/catalog/search',
    httpMethod: 'GET',
    status: 'Resolved',
    detectedAt: '1 day ago',
    apiName: 'Inventory & Catalog API',
    description:
      'Providing an invalid SQL wildcard or malformed query string causes an unhandled database exception that dumps file system paths, PostgreSQL version, and internal SQL statements into the HTTP 500 error response.',
    evidence: {
      requestA: {
        method: 'GET',
        url: "https://sandbox.sentinelapi.internal/api/catalog/search?q='%3B--",
        headers: { Accept: 'application/json' },
        userRole: 'External Client',
      },
      requestB: {
        method: 'GET',
        url: "https://sandbox.sentinelapi.internal/api/catalog/search?q='%3B--",
        headers: { Accept: 'application/json' },
        userRole: 'Server Error Response',
      },
      diffDescription:
        'HTTP 500 containing raw pg error: "syntax error at or near \\"--\\", File: /app/src/db/catalog.ts, line 42".',
    },
    reproductionSteps: [
      'Submit malformed characters in query parameter q.',
      'Review HTTP 500 body for unhandled internal call stack.',
    ],
    impact: 'System reconnaissance: leaks internal file structures, database engine versions, and query construction.',
    recommendedFix: {
      explanation: 'Catch unhandled database errors and return generic error envelopes in non-dev environments.',
      codeLanguage: 'typescript',
      codeSnippet: `// Global error handler middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  logger.error({ err, path: req.path }); // Log internally
  res.status(500).json({
    error: 'An unexpected internal server error occurred. Reference: ' + req.id
  });
});`,
    },
    pocCurl: `curl -X GET "https://sandbox.sentinelapi.internal/api/catalog/search?q='%3B--"`,
  },
];

export const API_INVENTORY: ApiInventoryItem[] = [
  {
    id: 'api-01',
    name: 'Customer Orders API',
    baseUrl: 'https://sandbox.sentinelapi.internal/api/orders',
    environment: 'Sandbox',
    endpointsCount: 42,
    authType: 'OAuth 2.0',
    lastScanDate: '10 minutes ago',
    riskLevel: 'Critical',
    openVulnerabilitiesCount: 3,
    ownerTeam: 'Checkout & Commerce',
    specType: 'OpenAPI 3.1',
  },
  {
    id: 'api-02',
    name: 'Identity & User Service',
    baseUrl: 'https://sandbox.sentinelapi.internal/api/users',
    environment: 'Sandbox',
    endpointsCount: 28,
    authType: 'JWT Bearer',
    lastScanDate: '2 hours ago',
    riskLevel: 'High',
    openVulnerabilitiesCount: 4,
    ownerTeam: 'Security & Auth Core',
    specType: 'OpenAPI 3.1',
  },
  {
    id: 'api-03',
    name: 'Payment Gateway Broker',
    baseUrl: 'https://sandbox.sentinelapi.internal/api/payments',
    environment: 'Sandbox',
    endpointsCount: 19,
    authType: 'mTLS',
    lastScanDate: '4 hours ago',
    riskLevel: 'Medium',
    openVulnerabilitiesCount: 1,
    ownerTeam: 'FinTech Platform',
    specType: 'OpenAPI 3.1',
  },
  {
    id: 'api-04',
    name: 'Inventory & Catalog API',
    baseUrl: 'https://sandbox.sentinelapi.internal/api/catalog',
    environment: 'Sandbox',
    endpointsCount: 24,
    authType: 'API Key',
    lastScanDate: '1 day ago',
    riskLevel: 'Low',
    openVulnerabilitiesCount: 1,
    ownerTeam: 'Supply Chain Ops',
    specType: 'Swagger 2.0',
  },
  {
    id: 'api-05',
    name: 'Analytics & Reporting Service',
    baseUrl: 'https://sandbox.sentinelapi.internal/api/reports',
    environment: 'Sandbox',
    endpointsCount: 15,
    authType: 'OAuth 2.0',
    lastScanDate: '2 days ago',
    riskLevel: 'Medium',
    openVulnerabilitiesCount: 1,
    ownerTeam: 'Data Infrastructure',
    specType: 'OpenAPI 3.1',
  },
];

export const SCAN_REPORTS: ScanReport[] = [
  {
    id: 'REP-9041',
    scanId: 'SCN-88194',
    apiName: 'Customer Orders API (Sandbox)',
    scanDate: '2026-09-24 00:45 UTC',
    durationSeconds: 38,
    endpointsScanned: 42,
    vulnerabilitiesFound: 3,
    criticalCount: 1,
    highCount: 1,
    mediumCount: 1,
    lowCount: 0,
    riskScore: 84,
    riskLevel: 'Critical',
    complianceStatus: {
      owaspApiTop10: 'Fail',
      pciDssApi: 'Warning',
      gdprDataExposure: 'Fail',
    },
    vulnerabilityBreakdown: [{ name: 'BOLA', count: 1 }, { name: 'Data Exposure', count: 1 }, { name: 'Auth', count: 1 }],
    summary:
      'Critical BOLA vulnerability detected on /api/orders/{id}. Any valid customer token can read arbitrary customer transactions. Immediate remediation recommended.',
  },
  {
    id: 'REP-9040',
    scanId: 'SCN-88190',
    apiName: 'Identity & User Service',
    scanDate: '2026-09-23 22:15 UTC',
    durationSeconds: 44,
    endpointsScanned: 28,
    vulnerabilitiesFound: 4,
    criticalCount: 1,
    highCount: 1,
    mediumCount: 1,
    lowCount: 1,
    riskScore: 78,
    riskLevel: 'High',
    complianceStatus: {
      owaspApiTop10: 'Fail',
      pciDssApi: 'Pass',
      gdprDataExposure: 'Fail',
    },
    vulnerabilityBreakdown: [{ name: 'Data Exposure', count: 1 }, { name: 'Rate Limiting', count: 1 }, { name: 'Auth', count: 1 }, { name: 'Other', count: 1 }],
    summary:
      'Excessive Data Exposure on /api/users/{id} exposes password hashes and MFA seeds. Rate limiting is missing on login endpoints.',
  },
  {
    id: 'REP-9039',
    scanId: 'SCN-88182',
    apiName: 'Payment Gateway Broker',
    scanDate: '2026-09-23 18:30 UTC',
    durationSeconds: 29,
    endpointsScanned: 19,
    vulnerabilitiesFound: 1,
    criticalCount: 0,
    highCount: 0,
    mediumCount: 1,
    lowCount: 0,
    riskScore: 35,
    riskLevel: 'Medium',
    complianceStatus: {
      owaspApiTop10: 'Pass',
      pciDssApi: 'Pass',
      gdprDataExposure: 'Pass',
    },
    summary:
      'Endpoint authorization conforms to strict mTLS requirements. One minor resource consumption notice detected on webhook dispatch retry queue.',
  },
  {
    id: 'REP-9038',
    scanId: 'SCN-88174',
    apiName: 'Inventory & Catalog API',
    scanDate: '2026-09-22 14:10 UTC',
    durationSeconds: 22,
    endpointsScanned: 24,
    vulnerabilitiesFound: 1,
    criticalCount: 0,
    highCount: 0,
    mediumCount: 0,
    lowCount: 1,
    riskScore: 18,
    riskLevel: 'Low',
    complianceStatus: {
      owaspApiTop10: 'Pass',
      pciDssApi: 'Pass',
      gdprDataExposure: 'Pass',
    },
    summary:
      'Clean security posture. Informational stack trace leak resolved during scan verification cycle.',
  },
];

export const DEFAULT_SCAN_STEPS: ScanStep[] = [
  {
    id: 'step-1',
    label: 'Parsing API specification',
    description: 'Validating OpenAPI 3.1 / Swagger schema, verifying schema components and operation definitions.',
    status: 'pending',
    logMessages: [
      'Ingesting OpenAPI 3.1.0 contract definition...',
      'Loaded 42 path items and 18 schema models.',
      'Extracted base URL: https://sandbox.sentinelapi.internal/api/v1',
    ],
  },
  {
    id: 'step-2',
    label: 'Discovering endpoints',
    description: 'Enumerating parameters, path wildcards, query filters, and payload bodies.',
    status: 'pending',
    logMessages: [
      'Discovered 42 distinct HTTP operations (22 GET, 11 POST, 6 PUT, 3 DELETE).',
      'Identified 8 dynamic object IDs: {id}, {orderId}, {userId}, {reportId}.',
    ],
  },
  {
    id: 'step-3',
    label: 'Mapping authentication',
    description: 'Identifying security schemes: Bearer JWT, OAuth2 scopes, API keys, and public routes.',
    status: 'pending',
    logMessages: [
      'Detected SecuritySchemes: bearerAuth (JWT), OAuth2 (read:orders, write:orders).',
      'Categorized 4 public endpoints and 38 authenticated routes.',
      'Initialized test actor pairs (User A: id=4882, User B: id=9912).',
    ],
  },
  {
    id: 'step-4',
    label: 'Generating test cases',
    description: 'Synthesizing dual-token BOLA permutations, boundary payloads, and concurrency bursts.',
    status: 'pending',
    logMessages: [
      'Synthesized 168 targeted security test cases.',
      'Generated 48 cross-tenant IDOR permutation vectors.',
      'Prepared high-speed throttling burst suite (500 requests / 5s).',
    ],
  },
  {
    id: 'step-5',
    label: 'Testing authorization',
    description: 'Executing cross-tenant resource access against sandbox endpoints using isolated tokens.',
    status: 'pending',
    logMessages: [
      'Dispatching vector: User A token against User B /api/orders/1002...',
      'ANOMALY DETECTED: HTTP 200 OK returned with confidential order object.',
      'Dispatching vector: User A token against /api/users/4882/role (PUT)...',
      'ANOMALY DETECTED: Function-level authorization bypassed.',
    ],
  },
  {
    id: 'step-6',
    label: 'Analyzing responses',
    description: 'Diffing payload shapes, inspecting leaked PII, evaluating entropy and status codes.',
    status: 'pending',
    logMessages: [
      'Inspecting /api/users/{id} response attributes...',
      'FLAGGED: Response body contains "password_hash" ($2b$12...) and "mfa_secret".',
      'Inspecting /api/login rate limits: 500 requests accepted with no HTTP 429 response.',
    ],
  },
  {
    id: 'step-7',
    label: 'Calculating severity',
    description: 'Scoring findings with CVSS v3.1 vector equations and OWASP API Security 2023 ranks.',
    status: 'pending',
    logMessages: [
      'Calculated CVSS 9.1 for /api/orders/{id} (BOLA - Critical).',
      'Calculated CVSS 8.2 for /api/admin (Auth Bypass - High).',
      'Calculated CVSS 7.5 for /api/users/{id} (Data Exposure - High).',
      'Calculated CVSS 5.8 for /api/login (Rate Limiting - Medium).',
    ],
  },
  {
    id: 'step-8',
    label: 'Generating report',
    description: 'Compiling proof-of-concept curl commands, remediation diffs, and compliance status.',
    status: 'pending',
    logMessages: [
      'Synthesizing reproducible PoC commands...',
      'Generated remediation code recommendations.',
      'Scan SCN-88194 finalized. Ready for review.',
    ],
  },
];

export const SAMPLE_OPENAPI_SPEC = `{
  "openapi": "3.1.0",
  "info": {
    "title": "Vulnerable Sandbox E-Commerce API",
    "version": "1.4.0",
    "description": "Intentionally configured sandbox API for SentinelAPI zero-trust vulnerability scanning demonstrations."
  },
  "servers": [
    {
      "url": "https://sandbox.sentinelapi.internal/api/v1",
      "description": "Safe Isolated Hackathon Sandbox"
    }
  ],
  "paths": {
    "/orders/{id}": {
      "get": {
        "summary": "Retrieve order by identifier",
        "description": "Returns full order transaction details. Vulnerable to BOLA/IDOR.",
        "parameters": [
          { "name": "id", "in": "path", "required": true, "schema": { "type": "string" } }
        ],
        "security": [{ "bearerAuth": [] }]
      }
    },
    "/users/{id}": {
      "get": {
        "summary": "Get user profile details",
        "description": "Returns user account object. Vulnerable to Excessive Data Exposure.",
        "parameters": [
          { "name": "id", "in": "path", "required": true, "schema": { "type": "string" } }
        ],
        "security": [{ "bearerAuth": [] }]
      }
    },
    "/login": {
      "post": {
        "summary": "Authenticate user credentials",
        "description": "Issues access token. Missing rate limit controls.",
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "email": { "type": "string" },
                  "password": { "type": "string" }
                }
              }
            }
          }
        }
      }
    },
    "/admin": {
      "post": {
        "summary": "Administrative operations",
        "description": "Privileged dispatch. Vulnerable to header-based authentication bypass.",
        "security": [{ "adminToken": [] }]
      }
    },
    "/users/{id}/role": {
      "put": {
        "summary": "Update user account role",
        "description": "Vulnerable to Broken Function-Level Authorization (BFLA).",
        "security": [{ "bearerAuth": [] }]
      }
    }
  }
}`;
