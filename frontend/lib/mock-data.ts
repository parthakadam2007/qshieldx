// centralized mock data for Qshield-ui

export const targetsData = [
  {
    id: "TGT-001",
    organizationName: "Acme Corp",
    primaryDomain: "acme.com",
    domainsCount: 3,
    status: "Scanning",
    lastCompleted: "2 hrs ago",
    assets: 142,
    industry: "Fintech",
    scope: {
      domains: ["acme-internal.local", "acme-staging.com", "api.acme.com"],
      ips: ["192.168.1.0/24", "10.42.0.0/16"]
    },
    config: {
      frequency: "Daily",
      tools: ["Subfinder", "Nmap_Deep", "Nuclei_Critical_Only", "TLS_Scanner"]
    }
  },
  {
    id: "TGT-002",
    organizationName: "Globex Logistics",
    primaryDomain: "globex.io",
    domainsCount: 1,
    status: "Idle",
    lastCompleted: "12 hrs ago",
    assets: 34,
    industry: "Supply Chain",
    scope: {
      domains: ["internal.globex.io"],
      ips: ["10.0.0.0/8"]
    },
    config: {
      frequency: "Weekly",
      tools: ["Subfinder", "Nmap_Deep"]
    }
  },
  {
    id: "TGT-003",
    organizationName: "Stark Industries",
    primaryDomain: "stark.net",
    domainsCount: 12,
    status: "Paused",
    lastCompleted: "3 days ago",
    assets: 589,
    industry: "Manufacturing",
    scope: {
      domains: ["dev.stark.net", "staging.stark.net"],
      ips: ["172.16.0.0/12"]
    },
    config: {
      frequency: "Manual",
      tools: ["Subfinder"]
    }
  }
]

export const assets = [
  {
    id: "AST-001",
    targetId: "TGT-001",
    name: "Primary Database Server",
    type: "Server",
    status: "Active",
    lastScanned: "2023-11-20 10:30 AM",
    internalIp: "192.168.1.10",
    externalIp: "10.42.1.205",
    datacenter: "us-east-1 (AWS)",
    os: "Ubuntu 22.04 LTS",
    overallScore: 92,
    uptimePercentage: 99.98,
    vulnerabilities: [
      { id: "CVE-2023-4863", title: "WebP Heap Buffer Overflow", description: "Buffer overflow via malformed WebP image...", cvss: 8.8, severity: "Critical" }
    ],
    exposedServices: [
      { port: 5432, protocol: "TCP", serviceName: "PostgreSQL", state: "Active", isVulnerable: false },
      { port: 22, protocol: "TCP", serviceName: "SSH", state: "Active", isVulnerable: true }
    ],
    recentScans: [
      { name: "Complete System Scan", date: "2023-11-20T10:30:00Z", status: "Success" }
    ]
  },
  {
    id: "AST-002",
    targetId: "TGT-001",
    name: "Web API Gateway",
    type: "Gateway",
    status: "Active",
    lastScanned: "2023-11-20 09:15 AM",
    internalIp: "10.42.1.205",
    externalIp: "203.0.113.45",
    datacenter: "us-east-2 (AWS)",
    os: "Alpine Linux",
    overallScore: 78,
    uptimePercentage: 99.99,
    vulnerabilities: [],
    exposedServices: [
      { port: 443, protocol: "TCP", serviceName: "HTTPS", state: "Active", isVulnerable: false },
      { port: 80, protocol: "TCP", serviceName: "HTTP", state: "Active", isVulnerable: true }
    ],
    recentScans: [
      { name: "Basic Web Scan", date: "2023-11-20T09:15:00Z", status: "Success" }
    ]
  },
  {
    id: "AST-003",
    targetId: "TGT-002",
    name: "Legacy Auth Service",
    type: "Microservice",
    status: "Inactive",
    lastScanned: "2023-11-15 14:00 PM",
    internalIp: "192.168.1.50",
    externalIp: "203.0.113.50",
    datacenter: "eu-central-1 (AWS)",
    os: "CentOS 7",
    overallScore: 45,
    uptimePercentage: 85.00,
    vulnerabilities: [
      { id: "CVE-2021-44228", title: "Log4j Remote Code Execution", description: "JNDI features used in configuration...", cvss: 10.0, severity: "Critical" }
    ],
    exposedServices: [
      { port: 6379, protocol: "TCP", serviceName: "Redis", state: "Open", isVulnerable: true }
    ],
    recentScans: [
      { name: "Deep Compliance Scan", date: "2023-11-15T14:00:00Z", status: "Failed" }
    ]
  },
  {
    id: "AST-004",
    targetId: "TGT-003",
    name: "Customer Portal Frontend",
    type: "Web Server",
    status: "Active",
    lastScanned: "2023-11-20 11:45 AM",
    internalIp: "10.42.1.210",
    externalIp: "203.0.113.99",
    datacenter: "us-west-1 (AWS)",
    os: "Debian 11",
    overallScore: 98,
    uptimePercentage: 100.0,
    vulnerabilities: [],
    exposedServices: [
      { port: 443, protocol: "TCP", serviceName: "HTTPS", state: "Active", isVulnerable: false }
    ],
    recentScans: [
      { name: "TLS Validation", date: "2023-11-20T11:45:00Z", status: "Success" }
    ]
  },
  {
    id: "AST-005",
    targetId: "TGT-001",
    name: "Data Lake Storage",
    type: "Storage",
    status: "Warning",
    lastScanned: "2023-11-19 16:20 PM",
    internalIp: "192.168.2.55",
    externalIp: "-",
    datacenter: "us-east-1 (AWS)",
    os: "Ubuntu 20.04 LTS",
    overallScore: 65,
    uptimePercentage: 99.90,
    vulnerabilities: [
      { id: "CVE-2022-XXXX", title: "Storage Access Policy Misconfig", description: "Open bucket policy detected.", cvss: 6.5, severity: "Medium" }
    ],
    exposedServices: [
      { port: 22, protocol: "TCP", serviceName: "SSH", state: "Active", isVulnerable: false }
    ],
    recentScans: [
      { name: "Bucket Security Check", date: "2023-11-19T16:20:00Z", status: "Warning" }
    ]
  },
]

export const servicesData = [
  {
    id: "SRV-HTTP",
    targetId: "TGT-001",
    name: "HTTP / Web Server",
    type: "HTTP",
    version: "Nginx 1.18.0",
    riskScore: 68,
    lastSeen: "2 mins ago",
    trendData: [40, 50, 45, 60, 50, 68, 68],
    assets: [
      { id: "AST-002", name: "Web API Gateway", ip: "10.42.1.205", assetRisk: 82 },
      { id: "AST-004", name: "Customer Portal Frontend", ip: "10.42.1.210", assetRisk: 54 },
    ],
  },
  {
    id: "SRV-SSH",
    targetId: "TGT-001",
    name: "Secure Shell",
    type: "SSH",
    version: "OpenSSH 8.9p1",
    riskScore: 24,
    lastSeen: "14 mins ago",
    trendData: [20, 22, 24, 24, 24, 24, 24],
    assets: [
      { id: "AST-001", name: "Primary Database Server", ip: "192.168.1.10", assetRisk: 14 },
      { id: "AST-002", name: "Web API Gateway", ip: "10.42.1.205", assetRisk: 30 },
      { id: "AST-005", name: "Data Lake Storage", ip: "192.168.2.55", assetRisk: 28 },
    ],
  },
  {
    id: "SRV-PSQL",
    targetId: "TGT-001",
    name: "PostgreSQL Database",
    type: "Database",
    version: "PostgreSQL 14.5",
    riskScore: 12,
    lastSeen: "Just now",
    trendData: [15, 12, 12, 12, 10, 12, 12],
    assets: [
      { id: "AST-001", name: "Primary Database Server", ip: "192.168.1.10", assetRisk: 12 },
    ],
  },
  {
    id: "SRV-REDIS",
    targetId: "TGT-002",
    name: "Redis KV Store",
    type: "Cache",
    version: "Redis 6.2.6",
    riskScore: 89,
    lastSeen: "4 hours ago",
    trendData: [50, 70, 75, 80, 85, 89, 89],
    assets: [
      { id: "AST-003", name: "Legacy Auth Service", ip: "192.168.1.50", assetRisk: 89 },
    ],
  },
]

export const portsData = [
  {
    id: "PRT-443",
    targetId: "TGT-001",
    portNumber: 443,
    protocol: "TCP",
    description: "HTTPS securely encrypts web traffic.",
    severity: 10,
    assets: [
      { id: "AST-002", name: "Web API Gateway", ip: "10.42.1.205", lastDetected: "2 mins ago" },
      { id: "AST-004", name: "Customer Portal Frontend", ip: "10.42.1.210", lastDetected: "45 mins ago" },
    ],
  },
  {
    id: "PRT-80",
    targetId: "TGT-001",
    portNumber: 80,
    protocol: "TCP",
    description: "Unencrypted web traffic, highly discouraged.",
    severity: 85,
    assets: [
      { id: "AST-002", name: "Web API Gateway", ip: "10.42.1.205", lastDetected: "1 hour ago" },
    ],
  },
  {
    id: "PRT-22",
    targetId: "TGT-001",
    portNumber: 22,
    protocol: "TCP",
    description: "SSH Remote Login Protocol.",
    severity: 45,
    assets: [
      { id: "AST-001", name: "Primary Database Server", ip: "192.168.1.10", lastDetected: "Just now" },
      { id: "AST-005", name: "Data Lake Storage", ip: "192.168.2.55", lastDetected: "3 hours ago" },
    ],
  },
  {
    id: "PRT-3389",
    targetId: "TGT-003",
    portNumber: 3389,
    protocol: "TCP",
    description: "Microsoft Terminal Server (RDP).",
    severity: 95,
    assets: [
      { id: "AST-010", name: "Admin Windows Terminal", ip: "192.168.5.105", lastDetected: "12 mins ago" },
    ],
  },
  {
    id: "PRT-53",
    targetId: "TGT-002",
    portNumber: 53,
    protocol: "UDP",
    description: "Domain Name System (DNS) resolution.",
    severity: 20,
    assets: [
      { id: "AST-006", name: "Internal DNS Resolver", ip: "192.168.1.2", lastDetected: "5 mins ago" },
    ],
  },
]

export const initialNodes = [
  // Core Assets
  { id: 'ast-1', type: 'asset', position: { x: 400, y: 100 }, data: { targetId: "TGT-001", id: "AST-002", name: "Web API Gateway", ip: "10.42.1.205" } },
  { id: 'ast-2', type: 'asset', position: { x: 100, y: 100 }, data: { targetId: "TGT-001", id: "AST-001", name: "Primary Database Server", ip: "192.168.1.10" } },

  // Attached Services - API Gateway
  { id: 'srv-1', type: 'service', position: { x: 300, y: 300 }, data: { targetId: "TGT-001", label: "HTTPS / API", type: "HTTP", port: 443, risk: 10 } },
  { id: 'srv-2', type: 'service', position: { x: 500, y: 300 }, data: { targetId: "TGT-001", label: "Legacy HTTP", type: "Unencrypted", port: 80, risk: 85 } },

  // Attached Services - DB Server
  { id: 'srv-3', type: 'service', position: { x: 100, y: 300 }, data: { targetId: "TGT-001", label: "PostgreSQL", type: "Database", port: 5432, risk: 12 } },
  { id: 'srv-4', type: 'service', position: { x: 250, y: 250 }, data: { targetId: "TGT-001", label: "Secure Shell", type: "SSH", port: 22, risk: 24 } },
]

export const initialEdges = [
  { id: 'e-ast1-srv1', source: 'ast-1', target: 'srv-1', animated: true, style: { stroke: '#10b981', strokeWidth: 2 } }, // Secure connection
  { id: 'e-ast1-srv2', source: 'ast-1', target: 'srv-2', animated: true, style: { stroke: '#ef4444', strokeWidth: 3, strokeDasharray: '5,5' } }, // Risky
  { id: 'e-ast2-srv3', source: 'ast-2', target: 'srv-3', animated: true, style: { stroke: '#10b981', strokeWidth: 2 } },
  { id: 'e-ast2-srv4', source: 'ast-2', target: 'srv-4', animated: true },
  { id: 'e-ast1-srv4', source: 'ast-1', target: 'srv-4', animated: true }, // Shared SSH connection
]
