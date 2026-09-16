import type { Node, Edge } from "@xyflow/react";

export const baseNodeStyle: React.CSSProperties = {
  width: 190,
  minHeight: 55,
  padding: "10px 14px",
  borderRadius: 10,
  border: "1px solid rgba(255,255,255,0.15)",
  color: "#fff",
  fontSize: 13,
  fontWeight: 500,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  textAlign: "center",
  boxSizing: "border-box",
};

export const initialNodes: Node[] = [
  // ROOT
  {
    id: "app",
    position: { x: 500, y: 20 },
    data: {
      label: "qshieldx-demo-application",
    },
    style: {
      ...baseNodeStyle,
      width: 240,
      background: "#10b981",
      fontWeight: 700,
    },
  },

  // SERVICES
  {
    id: "api-gateway",
    position: { x: 80, y: 140 },
    data: {
      label: "API Gateway",
    },
    style: {
      ...baseNodeStyle,
      background: "#3b82f6",
    },
  },

  {
    id: "auth",
    position: { x: 500, y: 140 },
    data: {
      label: "Authentication Service",
    },
    style: {
      ...baseNodeStyle,
      background: "#3b82f6",
    },
  },

  {
    id: "database",
    position: { x: 920, y: 140 },
    data: {
      label: "PostgreSQL Database",
    },
    style: {
      ...baseNodeStyle,
      background: "#8b5cf6",
    },
  },

  // API CRYPTO
  {
    id: "tls13",
    position: { x: 0, y: 280 },
    data: {
      label: "TLS 1.3",
    },
    style: {
      ...baseNodeStyle,
      background: "#10b981",
    },
  },

  {
    id: "rsa2048",
    position: { x: 210, y: 280 },
    data: {
      label: "RSA-2048 Certificate",
    },
    style: {
      ...baseNodeStyle,
      background: "#ef4444",
    },
  },

  // AUTH CRYPTO
  {
    id: "jwt",
    position: { x: 395, y: 280 },
    data: {
      label: "JWT RS256",
    },
    style: {
      ...baseNodeStyle,
      background: "#ef4444",
    },
  },

  {
    id: "bcrypt",
    position: { x: 605, y: 280 },
    data: {
      label: "bcrypt",
    },
    style: {
      ...baseNodeStyle,
      background: "#10b981",
    },
  },

  {
    id: "hmac",
    position: { x: 815, y: 280 },
    data: {
      label: "HMAC-SHA256",
    },
    style: {
      ...baseNodeStyle,
      background: "#10b981",
    },
  },

  // DATABASE CRYPTO
  {
    id: "db-tls",
    position: { x: 1020, y: 280 },
    data: {
      label: "TLS",
    },
    style: {
      ...baseNodeStyle,
      background: "#10b981",
    },
  },

  {
    id: "aes256",
    position: { x: 1020, y: 380 },
    data: {
      label: "AES-256",
    },
    style: {
      ...baseNodeStyle,
      background: "#10b981",
    },
  },

  // QUANTUM RISK
  {
    id: "risk",
    position: { x: 395, y: 430 },
    data: {
      label: "⚠ Quantum Risk",
    },
    style: {
      ...baseNodeStyle,
      width: 220,
      background: "#dc2626",
      fontWeight: 700,
    },
  },

  {
    id: "shor",
    position: { x: 395, y: 540 },
    data: {
      label: "Shor Vulnerable",
    },
    style: {
      ...baseNodeStyle,
      background: "#ef4444",
    },
  },

  // PQC
  {
    id: "pqc",
    position: { x: 720, y: 430 },
    data: {
      label: "Post-Quantum Cryptography",
    },
    style: {
      ...baseNodeStyle,
      width: 230,
      background: "#6366f1",
      fontWeight: 700,
    },
  },

  {
    id: "mlkem",
    position: { x: 600, y: 540 },
    data: {
      label: "ML-KEM-768",
    },
    style: {
      ...baseNodeStyle,
      background: "#10b981",
    },
  },

  {
    id: "mldsa",
    position: { x: 810, y: 540 },
    data: {
      label: "ML-DSA-65",
    },
    style: {
      ...baseNodeStyle,
      background: "#10b981",
    },
  },

  {
    id: "slhdsa",
    position: { x: 1020, y: 540 },
    data: {
      label: "SLH-DSA",
    },
    style: {
      ...baseNodeStyle,
      background: "#10b981",
    },
  },
];

export const initialEdges: Edge[] = [
  // Application → Services
  {
    id: "app-api",
    source: "app",
    target: "api-gateway",
  },
  {
    id: "app-auth",
    source: "app",
    target: "auth",
  },
  {
    id: "app-db",
    source: "app",
    target: "database",
  },

  // API Gateway
  {
    id: "api-tls",
    source: "api-gateway",
    target: "tls13",
  },
  {
    id: "api-rsa",
    source: "api-gateway",
    target: "rsa2048",
    animated: true,
    style: {
      stroke: "#ef4444",
      strokeWidth: 2,
    },
  },

  // Authentication
  {
    id: "auth-jwt",
    source: "auth",
    target: "jwt",
    animated: true,
    style: {
      stroke: "#ef4444",
      strokeWidth: 2,
    },
  },
  {
    id: "auth-bcrypt",
    source: "auth",
    target: "bcrypt",
  },
  {
    id: "auth-hmac",
    source: "auth",
    target: "hmac",
  },

  // Database
  {
    id: "database-tls",
    source: "database",
    target: "db-tls",
  },
  {
    id: "database-aes",
    source: "database",
    target: "aes256",
  },

  // Vulnerabilities
  {
    id: "rsa-risk",
    source: "rsa2048",
    target: "risk",
    animated: true,
    style: {
      stroke: "#ef4444",
      strokeWidth: 2,
    },
  },
  {
    id: "jwt-risk",
    source: "jwt",
    target: "risk",
    animated: true,
    style: {
      stroke: "#ef4444",
      strokeWidth: 2,
    },
  },

  {
    id: "risk-shor",
    source: "risk",
    target: "shor",
    animated: true,
    style: {
      stroke: "#ef4444",
      strokeWidth: 2,
    },
  },

  // PQC
  {
    id: "app-pqc",
    source: "app",
    target: "pqc",
  },
  {
    id: "pqc-kem",
    source: "pqc",
    target: "mlkem",
  },
  {
    id: "pqc-dsa",
    source: "pqc",
    target: "mldsa",
  },
  {
    id: "pqc-slh",
    source: "pqc",
    target: "slhdsa",
  },
];