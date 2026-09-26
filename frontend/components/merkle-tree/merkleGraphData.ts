import { Node, Edge } from "reactflow"

// Vulnerability data for leaf nodes
const VULNERABILITIES = [
  { 
    id: "leaf-1", 
    label: "Hardcoded RSA-2048 Key", 
    hash: "0xf1e2d3c4b5a697887766554433221100ffeeddccbbaa99887766554433221100",
    algorithm: "RSA-2048",
    severity: "Critical" as const,
    file: "/src/backend/auth.ts",
    description: "Private key embedded in authentication module - immediate rotation required"
  },
  { 
    id: "leaf-2", 
    label: "Legacy TLS 1.1 Endpoint", 
    hash: "0xe2d3c4b5a697887766554433221100ffeeddccbbaa99887766554433221100ff",
    algorithm: "TLS 1.1",
    severity: "Critical" as const,
    file: "/src/network/tls.ts",
    description: "Deprecated TLS version detected on payment API endpoint"
  },
  { 
    id: "leaf-3", 
    label: "MD5 Hash Algorithm", 
    hash: "0xd3c4b5a697887766554433221100ffeeddccbbaa99887766554433221100ffe2",
    algorithm: "MD5",
    severity: "Critical" as const,
    file: "/src/crypto/hashing.ts",
    description: "Cryptographically broken hash function used for password storage"
  },
  { 
    id: "leaf-4", 
    label: "Weak ECDSA Signature", 
    hash: "0xc4b5a697887766554433221100ffeeddccbbaa99887766554433221100ffe2d3",
    algorithm: "ECDSA P-256",
    severity: "Critical" as const,
    file: "/src/crypto/signing.ts",
    description: "Nonce reuse vulnerability in ECDSA signing implementation"
  },
  { 
    id: "leaf-5", 
    label: "Exposed AWS Secret Key", 
    hash: "0xb5a697887766554433221100ffeeddccbbaa99887766554433221100ffe2d3c4",
    algorithm: "AWS-KMS",
    severity: "Critical" as const,
    file: "/src/config/aws.ts",
    description: "Production AWS secret key committed to repository"
  },
  { 
    id: "leaf-6", 
    label: "Weak RSA-1024 Certificate", 
    hash: "0xa697887766554433221100ffeeddccbbaa99887766554433221100ffe2d3c4b5",
    algorithm: "RSA-1024",
    severity: "High" as const,
    file: "/src/certs/legacy.pem",
    description: "RSA-1024 certificate vulnerable to factorization attacks"
  },
  { 
    id: "leaf-7", 
    label: "SHA-1 Hash in Use", 
    hash: "0x97887766554433221100ffeeddccbbaa99887766554433221100ffe2d3c4b5a6",
    algorithm: "SHA-1",
    severity: "High" as const,
    file: "/src/crypto/legacy.ts",
    description: "Collision-vulnerable SHA-1 used for digital signatures"
  },
  { 
    id: "leaf-8", 
    label: "Static IV in AES-CBC", 
    hash: "0x887766554433221100ffeeddccbbaa99887766554433221100ffe2d3c4b5a697",
    algorithm: "AES-256-CBC",
    severity: "High" as const,
    file: "/src/crypto/encrypt.ts",
    description: "Static initialization vector reduces semantic security"
  },
  { 
    id: "leaf-9", 
    label: "ECDSA P-384 Key", 
    hash: "0x7766554433221100ffeeddccbbaa99887766554433221100ffe2d3c4b5a69788",
    algorithm: "ECDSA P-384",
    severity: "Medium" as const,
    file: "/src/crypto/keys.ts",
    description: "NIST P-384 curve - quantum vulnerable but not immediately exploitable"
  },
  { 
    id: "leaf-10", 
    label: "RSA-4096 Certificate", 
    hash: "0x66554433221100ffeeddccbbaa99887766554433221100ffe2d3c4b5a6978877",
    algorithm: "RSA-4096",
    severity: "Medium" as const,
    file: "/src/certs/rsa4096.pem",
    description: "Long-term certificate - quantum vulnerable but not immediately exploitable"
  },
  { 
    id: "leaf-11", 
    label: "X25519 Key Exchange", 
    hash: "0x554433221100ffeeddccbbaa99887766554433221100ffe2d3c4b5a697887766",
    algorithm: "X25519",
    severity: "Low" as const,
    file: "/src/crypto/x25519.ts",
    description: "Modern elliptic curve DH - quantum vulnerable but widely deployed"
  },
  { 
    id: "leaf-12", 
    label: "Ed25519 Signature", 
    hash: "0x4433221100ffeeddccbbaa99887766554433221100ffe2d3c4b5a69788776655",
    algorithm: "Ed25519",
    severity: "Low" as const,
    file: "/src/crypto/ed25519.ts",
    description: "Modern EdDSA signature scheme - quantum vulnerable"
  },
  { 
    id: "leaf-13", 
    label: "AES-256-GCM Key", 
    hash: "0x33221100ffeeddccbbaa99887766554433221100ffe2d3c4b5a6978877665544",
    algorithm: "AES-256-GCM",
    severity: "Low" as const,
    file: "/src/crypto/aes.ts",
    description: "Quantum-resistant symmetric encryption (Grover's algorithm only halves key space)"
  },
  { 
    id: "leaf-14", 
    label: "ChaCha20-Poly1305 Key", 
    hash: "0x221100ffeeddccbbaa99887766554433221100ffe2d3c4b5a697887766554433",
    algorithm: "ChaCha20-Poly1305",
    severity: "Low" as const,
    file: "/src/crypto/chacha.ts",
    description: "Modern stream cipher - quantum resistant"
  },
  { 
    id: "leaf-15", 
    label: "ML-KEM-768 (Kyber) Key", 
    hash: "0x1100ffeeddccbbaa99887766554433221100ffe2d3c4b5a69788776655443322",
    algorithm: "ML-KEM-768",
    severity: "Low" as const,
    file: "/src/pqc/kem.ts",
    description: "Post-quantum KEM - NIST standardized, quantum resistant"
  },
  { 
    id: "leaf-16", 
    label: "ML-DSA-65 (Dilithium) Sig", 
    hash: "0x00ffeeddccbbaa99887766554433221100ffe2d3c4b5a6978877665544332211",
    algorithm: "ML-DSA-65",
    severity: "Low" as const,
    file: "/src/pqc/sig.ts",
    description: "Post-quantum signatures - NIST standardized, quantum resistant"
  },
]

// Generate deterministic hash for intermediate nodes
function generateNodeHash(label: string, level: number, index: number): string {
  const base = "0x"
  const chars = "0123456789abcdef"
  let hash = base
  for (let i = 0; i < 60; i++) {
    hash += chars[(label.charCodeAt(i % label.length) + level * 7 + index * 13 + i * 3) % 16]
  }
  return hash
}

// Build initial nodes
export const initialNodes: Node[] = [
  // Root node
  {
    id: "root",
    type: "merkleNode",
    position: { x: 0, y: 0 },
    data: {
      label: "Merkle Root",
      hash: "0x9a8b8e8dfdeee7f6a5c4b3d2e1f0a9b8c7d6e5f4a3b2c1d0e9f8a7b6c5d4e3f2",
      type: "root",
      level: 0,
    },
  },
  // Level 1 nodes (2)
  {
    id: "L1-1",
    type: "merkleNode",
    position: { x: 0, y: 0 },
    data: {
      label: "Combined Hash L1-A",
      hash: generateNodeHash("Combined Hash L1-A", 1, 0),
      type: "branch",
      level: 1,
    },
  },
  {
    id: "L1-2",
    type: "merkleNode",
    position: { x: 0, y: 0 },
    data: {
      label: "Combined Hash L1-B",
      hash: generateNodeHash("Combined Hash L1-B", 1, 1),
      type: "branch",
      level: 1,
    },
  },
  // Level 2 nodes (4)
  {
    id: "L2-1",
    type: "merkleNode",
    position: { x: 0, y: 0 },
    data: {
      label: "Combined Hash L2-A",
      hash: generateNodeHash("Combined Hash L2-A", 2, 0),
      type: "branch",
      level: 2,
    },
  },
  {
    id: "L2-2",
    type: "merkleNode",
    position: { x: 0, y: 0 },
    data: {
      label: "Combined Hash L2-B",
      hash: generateNodeHash("Combined Hash L2-B", 2, 1),
      type: "branch",
      level: 2,
    },
  },
  {
    id: "L2-3",
    type: "merkleNode",
    position: { x: 0, y: 0 },
    data: {
      label: "Combined Hash L2-C",
      hash: generateNodeHash("Combined Hash L2-C", 2, 2),
      type: "branch",
      level: 2,
    },
  },
  {
    id: "L2-4",
    type: "merkleNode",
    position: { x: 0, y: 0 },
    data: {
      label: "Combined Hash L2-D",
      hash: generateNodeHash("Combined Hash L2-D", 2, 3),
      type: "branch",
      level: 2,
    },
  },
  // Level 3 leaf nodes (16)
  ...VULNERABILITIES.map((vuln, i) => ({
    id: vuln.id,
    type: "merkleNode",
    position: { x: 0, y: 0 },
    data: {
      label: vuln.label,
      hash: vuln.hash,
      type: "leaf" as const,
      level: 3,
      details: {
        algorithm: vuln.algorithm,
        severity: vuln.severity,
        file: vuln.file,
        description: vuln.description,
      },
    },
  })),
]

// Build initial edges
export const initialEdges: Edge[] = [
  // Root to Level 1
  { id: "e-root-L1-1", source: "root", target: "L1-1", type: "smoothstep", animated: true, style: { strokeWidth: 2 } },
  { id: "e-root-L1-2", source: "root", target: "L1-2", type: "smoothstep", animated: true, style: { strokeWidth: 2 } },
  
  // Level 1 to Level 2
  { id: "e-L1-1-L2-1", source: "L1-1", target: "L2-1", type: "smoothstep", animated: true, style: { strokeWidth: 2 } },
  { id: "e-L1-1-L2-2", source: "L1-1", target: "L2-2", type: "smoothstep", animated: true, style: { strokeWidth: 2 } },
  { id: "e-L1-2-L2-3", source: "L1-2", target: "L2-3", type: "smoothstep", animated: true, style: { strokeWidth: 2 } },
  { id: "e-L1-2-L2-4", source: "L1-2", target: "L2-4", type: "smoothstep", animated: true, style: { strokeWidth: 2 } },
  
  // Level 2 to Leaves (16 leaves, 4 per level-2 node)
  { id: "e-L2-1-leaf-1", source: "L2-1", target: "leaf-1", type: "smoothstep", animated: true, style: { strokeWidth: 1.5 } },
  { id: "e-L2-1-leaf-2", source: "L2-1", target: "leaf-2", type: "smoothstep", animated: true, style: { strokeWidth: 1.5 } },
  { id: "e-L2-1-leaf-3", source: "L2-1", target: "leaf-3", type: "smoothstep", animated: true, style: { strokeWidth: 1.5 } },
  { id: "e-L2-1-leaf-4", source: "L2-1", target: "leaf-4", type: "smoothstep", animated: true, style: { strokeWidth: 1.5 } },
  
  { id: "e-L2-2-leaf-5", source: "L2-2", target: "leaf-5", type: "smoothstep", animated: true, style: { strokeWidth: 1.5 } },
  { id: "e-L2-2-leaf-6", source: "L2-2", target: "leaf-6", type: "smoothstep", animated: true, style: { strokeWidth: 1.5 } },
  { id: "e-L2-2-leaf-7", source: "L2-2", target: "leaf-7", type: "smoothstep", animated: true, style: { strokeWidth: 1.5 } },
  { id: "e-L2-2-leaf-8", source: "L2-2", target: "leaf-8", type: "smoothstep", animated: true, style: { strokeWidth: 1.5 } },
  
  { id: "e-L2-3-leaf-9", source: "L2-3", target: "leaf-9", type: "smoothstep", animated: true, style: { strokeWidth: 1.5 } },
  { id: "e-L2-3-leaf-10", source: "L2-3", target: "leaf-10", type: "smoothstep", animated: true, style: { strokeWidth: 1.5 } },
  { id: "e-L2-3-leaf-11", source: "L2-3", target: "leaf-11", type: "smoothstep", animated: true, style: { strokeWidth: 1.5 } },
  { id: "e-L2-3-leaf-12", source: "L2-3", target: "leaf-12", type: "smoothstep", animated: true, style: { strokeWidth: 1.5 } },
  
  { id: "e-L2-4-leaf-13", source: "L2-4", target: "leaf-13", type: "smoothstep", animated: true, style: { strokeWidth: 1.5 } },
  { id: "e-L2-4-leaf-14", source: "L2-4", target: "leaf-14", type: "smoothstep", animated: true, style: { strokeWidth: 1.5 } },
  { id: "e-L2-4-leaf-15", source: "L2-4", target: "leaf-15", type: "smoothstep", animated: true, style: { strokeWidth: 1.5 } },
  { id: "e-L2-4-leaf-16", source: "L2-4", target: "leaf-16", type: "smoothstep", animated: true, style: { strokeWidth: 1.5 } },
]