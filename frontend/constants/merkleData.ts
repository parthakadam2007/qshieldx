// Mock data for Blockchain & Merkle Verification Dashboard
// Simulates a verified blockchain state with cryptographic discovery results

export interface VerificationStep {
  id: string;
  label: string;
  status: "pending" | "running" | "completed" | "failed";
  description: string;
}

export interface TreeNode {
  id: string;
  hash: string;
  label: string;
  type: "root" | "branch" | "leaf";
  children?: TreeNode[];
  finding?: {
    name: string;
    severity: "Critical" | "High" | "Medium" | "Low";
    file: string;
    algorithm: string;
    description: string;
  };
}

export interface BlockchainProof {
  network: string;
  txHash: string;
  blockNumber: number;
  anchorTimestamp: string;
  ipfsCid: string;
  status: "verified" | "pending" | "failed";
}

export interface MerkleMetadata {
  repositoryName: string;
  scanId: string;
  cbomSpec: string;
  assetsCount: number;
  scanDate: string;
  merkleRoot: string;
}

export const merkleMetadata: MerkleMetadata = {
  repositoryName: "QShieldX-Core",
  scanId: "SCN-2026-09-25-001",
  cbomSpec: "CycloneDX v1.5",
  assetsCount: 247,
  scanDate: "2026-09-25T14:32:18Z",
  merkleRoot: "0x9a8b8e8dfdeee7f6a5c4b3d2e1f0a9b8c7d6e5f4a3b2c1d0e9f8a7b6c5d4e3f2",
};

export const blockchainProof: BlockchainProof = {
  network: "Sepolia Testnet",
  txHash: "0x7f8e9d0c1b2a3f4e5d6c7b8a9f0e1d2c3b4a5f6e7d8c9b0a1f2e3d4c5b6a7f8e9",
  blockNumber: 6847291,
  anchorTimestamp: "2026-09-25T14:35:42Z",
  ipfsCid: "ipfs://QmYwAPJzv54ZsnFz3kRzNqQz8Yz7Xz6Wz5Vz4Uz3Tz2Sz1Rz",
  status: "verified",
};

export const verificationSteps: VerificationStep[] = [
  {
    id: "step-1",
    label: "CBOM Loaded",
    status: "completed",
    description: "CycloneDX v1.5 CBOM parsed and validated",
  },
  {
    id: "step-2",
    label: "Component Hashing",
    status: "completed",
    description: "All 247 cryptographic assets hashed with SHA-256",
  },
  {
    id: "step-3",
    label: "Merkle Tree Construction",
    status: "completed",
    description: "Binary Merkle tree built from leaf hashes (8 levels)",
  },
  {
    id: "step-4",
    label: "Digital Signature",
    status: "completed",
    description: "Merkle root signed with ECDSA P-256 (secp256r1)",
  },
  {
    id: "step-5",
    label: "Blockchain Anchor",
    status: "completed",
    description: "Root hash anchored to Sepolia via Chainlink Functions",
  },
  {
    id: "step-6",
    label: "Integrity Verified",
    status: "completed",
    description: "On-chain root matches computed root — verification passed",
  },
];

// Hierarchical Merkle Tree Structure
export const treeNodes: TreeNode = {
  id: "root",
  hash: "0x9a8b8e8dfdeee7f6a5c4b3d2e1f0a9b8c7d6e5f4a3b2c1d0e9f8a7b6c5d4e3f2",
  label: "Merkle Root",
  type: "root",
  children: [
    {
      id: "branch-1",
      hash: "0x3f2e1d0c9b8a7f6e5d4c3b2a1f0e9d8c7b6a5f4e3d2c1b0a9f8e7d6c5b4a3f2e1",
      label: "Combined Hash (Level 1)",
      type: "branch",
      children: [
        {
          id: "branch-1-1",
          hash: "0xa1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2",
          label: "Combined Hash (Level 2)",
          type: "branch",
          children: [
            {
              id: "leaf-1",
              hash: "0xf1e2d3c4b5a697887766554433221100ffeeddccbbaa99887766554433221100",
              label: "RSA-2048 Keys",
              type: "leaf",
              finding: {
                name: "Hardcoded RSA-2048 Private Key",
                severity: "Critical",
                file: "src/auth/keys.ts",
                algorithm: "RSA-2048",
                description: "Private key embedded in source code — immediate rotation required",
              },
            },
            {
              id: "leaf-2",
              hash: "0xe2d3c4b5a697887766554433221100ffeeddccbbaa99887766554433221100ff",
              label: "RSA-4096 Certificates",
              type: "leaf",
              finding: {
                name: "RSA-4096 Certificate Chain",
                severity: "Medium",
                file: "src/certs/chain.pem",
                algorithm: "RSA-4096",
                description: "Long-term certificate — quantum vulnerable but not immediately exploitable",
              },
            },
          ],
        },
        {
          id: "branch-1-2",
          hash: "0xb2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3",
          label: "Combined Hash (Level 2)",
          type: "branch",
          children: [
            {
              id: "leaf-3",
              hash: "0xd3c4b5a697887766554433221100ffeeddccbbaa99887766554433221100ffe2",
              label: "ECDSA P-256 Keys",
              type: "leaf",
              finding: {
                name: "ECDSA P-256 Signing Keys",
                severity: "High",
                file: "src/crypto/signing.ts",
                algorithm: "ECDSA P-256",
                description: "Elliptic curve keys — vulnerable to Shor's algorithm",
              },
            },
            {
              id: "leaf-4",
              hash: "0xc4b5a697887766554433221100ffeeddccbbaa99887766554433221100ffe2d3",
              label: "ECDSA P-384 Keys",
              type: "leaf",
              finding: {
                name: "ECDSA P-384 Keys",
                severity: "High",
                file: "src/crypto/signing.ts",
                algorithm: "ECDSA P-384",
                description: "Larger curve but still quantum vulnerable",
              },
            },
          ],
        },
      ],
    },
    {
      id: "branch-2",
      hash: "0x4e3d2c1b0a9f8e7d6c5b4a3f2e1d0c9b8a7f6e5d4c3b2a1f0e9d8c7b6a5f4e3d2",
      label: "Combined Hash (Level 1)",
      type: "branch",
      children: [
        {
          id: "branch-2-1",
          hash: "0x5f4e3d2c1b0a9f8e7d6c5b4a3f2e1d0c9b8a7f6e5d4c3b2a1f0e9d8c7b6a5f4e",
          label: "Combined Hash (Level 2)",
          type: "branch",
          children: [
            {
              id: "leaf-5",
              hash: "0x6a5b4c3d2e1f0a9b8c7d6e5f4a3b2c1d0e9f8a7b6c5d4e3f2a1b0c9d8e7f6a5",
              label: "AES-256-GCM Keys",
              type: "leaf",
              finding: {
                name: "AES-256-GCM Encryption Keys",
                severity: "Low",
                file: "src/crypto/encryption.ts",
                algorithm: "AES-256-GCM",
                description: "Symmetric encryption — quantum resistant (Grover's algorithm only halves key space)",
              },
            },
            {
              id: "leaf-6",
              hash: "0x7b6c5d4e3f2a1b0c9d8e7f6a5b4c3d2e1f0a9b8c7d6e5f4a3b2c1d0e9f8a7b6",
              label: "ChaCha20-Poly1305 Keys",
              type: "leaf",
              finding: {
                name: "ChaCha20-Poly1305 Keys",
                severity: "Low",
                file: "src/crypto/stream.ts",
                algorithm: "ChaCha20-Poly1305",
                description: "Modern stream cipher — quantum resistant",
              },
            },
          ],
        },
        {
          id: "branch-2-2",
          hash: "0x8c7d6e5f4a3b2c1d0e9f8a7b6c5d4e3f2a1b0c9d8e7f6a5b4c3d2e1f0a9b8c7",
          label: "Combined Hash (Level 2)",
          type: "branch",
          children: [
            {
              id: "leaf-7",
              hash: "0x9d8e7f6a5b4c3d2e1f0a9b8c7d6e5f4a3b2c1d0e9f8a7b6c5d4e3f2a1b0c9d8",
              label: "ML-KEM-768 Keys",
              type: "leaf",
              finding: {
                name: "ML-KEM-768 (Kyber) Keys",
                severity: "Low",
                file: "src/pqc/kem.ts",
                algorithm: "ML-KEM-768",
                description: "Post-quantum KEM — NIST standardized, quantum resistant",
              },
            },
            {
              id: "leaf-8",
              hash: "0xae9f8a7b6c5d4e3f2a1b0c9d8e7f6a5b4c3d2e1f0a9b8c7d6e5f4a3b2c1d0e9",
              label: "ML-DSA-65 Signatures",
              type: "leaf",
              finding: {
                name: "ML-DSA-65 (Dilithium) Signatures",
                severity: "Low",
                file: "src/pqc/signatures.ts",
                algorithm: "ML-DSA-65",
                description: "Post-quantum signatures — NIST standardized, quantum resistant",
              },
            },
          ],
        },
      ],
    },
  ],
};

// Flat list of all leaf nodes for List View
export const leafNodes: TreeNode[] = [
  treeNodes.children![0].children![0].children![0],
  treeNodes.children![0].children![0].children![1],
  treeNodes.children![0].children![1].children![0],
  treeNodes.children![0].children![1].children![1],
  treeNodes.children![1].children![0].children![0],
  treeNodes.children![1].children![0].children![1],
  treeNodes.children![1].children![1].children![0],
  treeNodes.children![1].children![1].children![1],
];

export const computedRootHash = merkleMetadata.merkleRoot;
export const onChainRootHash = "0x9a8b8e8dfdeee7f6a5c4b3d2e1f0a9b8c7d6e5f4a3b2c1d0e9f8a7b6c5d4e3f2";