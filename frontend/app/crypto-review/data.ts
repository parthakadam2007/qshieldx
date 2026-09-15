export interface Finding {
  id: string
  title: string
  severity: "Critical" | "High" | "Medium" | "Low" | "Safe"
  file: string
  line: number
  usage: string
  threat: string
  recommendation: string
  codeSnippet?: {
    lang: string
    code: string
    highlightLine: number
  }
  suggestedFix?: {
    description: string
    diff: string
  }
}

export interface PRReview {
  id: string
  prNumber: number
  title: string
  repository: string
  author: {
    name: string
    username: string
    avatar?: string
  }
  branch: string
  baseBranch: string
  cryptoChanges: string[]
  hasCryptoChanges: boolean
  risk: "Critical" | "High" | "Medium" | "Low" | "Safe"
  status: "Reviewed" | "Reviewing" | "Action Needed"
  reviewedAt: string
  findingsCount: number
  cbomDiff: {
    before: string[]
    after: string[]
    cryptoAssetsBefore: number
    cryptoAssetsAfter: number
    criticalRisksBefore: number
    criticalRisksAfter: number
    quantumReadinessBefore: number
    quantumReadinessAfter: number
    newAssets: {
      name: string
      risk: "Critical" | "High" | "Medium" | "Low"
      category: string
    }[]
  }
  findings: Finding[]
  summary: {
    dependencyAnalysis: boolean
    cryptoApiAnalysis: boolean
    cbomComparison: boolean
    quantumRiskAnalysis: boolean
    policyCheck: boolean
  }
  botComment?: {
    title: string
    severity: string
    detail: string
    threat: string
    recommendation: string
  }
}

export interface ReviewSettings {
  monitoredRepos: Record<string, boolean>
  autoReview: boolean
  generateCbomDiff: boolean
  detectQuantumVulnerable: boolean
  commentOnPR: boolean
  createIssuesForCritical: boolean
  autoRemediationPR: boolean
  failPolicy: "Critical" | "High" | "Medium" | "Any Risk" | "Disabled"
}

export const defaultSettings: ReviewSettings = {
  monitoredRepos: {
    "payment-service": true,
    "auth-service": true,
    "api-gateway": true,
    "user-service": true,
    "vault-core": false,
    "frontend-portal": false,
  },
  autoReview: true,
  generateCbomDiff: true,
  detectQuantumVulnerable: true,
  commentOnPR: true,
  createIssuesForCritical: true,
  autoRemediationPR: false,
  failPolicy: "Critical",
}

export const initialPRReviews: PRReview[] = [
  {
    id: "142",
    prNumber: 142,
    title: "Add payment signing and transaction verification",
    repository: "payment-service",
    author: {
      name: "John Doe",
      username: "johndoe",
    },
    branch: "feature/payment-signing",
    baseBranch: "main",
    cryptoChanges: ["+ RSA-2048", "ECDSA-P256"],
    hasCryptoChanges: true,
    risk: "Critical",
    status: "Reviewed",
    reviewedAt: "2m ago",
    findingsCount: 2,
    cbomDiff: {
      before: ["ECDSA-P256", "AES-256"],
      after: ["ECDSA-P256", "AES-256", "+ RSA-2048 🔴"],
      cryptoAssetsBefore: 124,
      cryptoAssetsAfter: 125,
      criticalRisksBefore: 3,
      criticalRisksAfter: 4,
      quantumReadinessBefore: 86,
      quantumReadinessAfter: 79,
      newAssets: [
        {
          name: "RSA-2048",
          risk: "Critical",
          category: "Asymmetric / Digital Signature",
        },
      ],
    },
    findings: [
      {
        id: "f-142-1",
        title: "RSA-2048 detected in transaction signing pipeline",
        severity: "Critical",
        file: "src/security/Signer.java",
        line: 42,
        usage: "Digital Signature / Transaction Authorization",
        threat: "Shor's Algorithm (Polynomial time discrete logarithm/factorization)",
        recommendation:
          "Consider migration to a post-quantum signature algorithm such as ML-DSA (CRYSTALS-Dilithium) or stateful hash-based signatures (LMS/XMSS).",
        codeSnippet: {
          lang: "java",
          highlightLine: 42,
          code: `// src/security/Signer.java
public class Signer {
    public byte[] signTransaction(byte[] payload) throws Exception {
        // [PQ-Guard Warning]: Insecure for long-term quantum resistance
        KeyPairGenerator keyGen = KeyPairGenerator.getInstance("RSA");
        keyGen.initialize(2048);
        KeyPair pair = keyGen.generateKeyPair();
        Signature signature = Signature.getInstance("SHA256withRSA");
        signature.initSign(pair.getPrivate());
        signature.update(payload);
        return signature.sign();
    }
}`,
        },
        suggestedFix: {
          description: "Replace RSA-2048 with NIST FIPS 204 ML-DSA (CRYSTALS-Dilithium) quantum-safe signature scheme.",
          diff: `@@ -40,7 +40,7 @@
- KeyPairGenerator keyGen = KeyPairGenerator.getInstance("RSA");
- keyGen.initialize(2048);
+ // PQ-Guard Remediation: FIPS 204 ML-DSA-65 (Dilithium3)
+ MLDSAKeyPairGenerator keyGen = new MLDSAKeyPairGenerator();
+ keyGen.init(new MLDSAParameters(MLDSAConstants.ML_DSA_65));`,
        },
      },
      {
        id: "f-142-2",
        title: "Legacy SHA-256 with RSA padding vulnerable to chosen-ciphertext",
        severity: "Medium",
        file: "src/security/Signer.java",
        line: 46,
        usage: "Signature Padding Scheme",
        threat: "Bleichenbacher-style oracle vulnerability in non-PSS padding",
        recommendation: "Ensure RSASSA-PSS with SHA-384 or transition immediately to hybrid ML-DSA/ECDSA scheme.",
      },
    ],
    summary: {
      dependencyAnalysis: true,
      cryptoApiAnalysis: true,
      cbomComparison: true,
      quantumRiskAnalysis: true,
      policyCheck: false,
    },
    botComment: {
      title: "🔐 PQ-Guard Crypto Review",
      severity: "🔴 1 Critical Crypto Risk",
      detail: "RSA-2048 detected in Signer.java:42",
      threat: "Shor's Algorithm",
      recommendation:
        "Consider migration to a post-quantum signature algorithm such as ML-DSA (FIPS 204).",
    },
  },
  {
    id: "87",
    prNumber: 87,
    title: "Refactor OAuth2 token refresh rotation logic",
    repository: "auth-service",
    author: {
      name: "Sarah Jenkins",
      username: "sarahj",
    },
    branch: "chore/oauth-refresh-rotation",
    baseBranch: "main",
    cryptoChanges: ["No crypto changes"],
    hasCryptoChanges: false,
    risk: "Safe",
    status: "Reviewed",
    reviewedAt: "8m ago",
    findingsCount: 0,
    cbomDiff: {
      before: ["ECDSA-P384", "AES-256-GCM"],
      after: ["ECDSA-P384", "AES-256-GCM"],
      cryptoAssetsBefore: 68,
      cryptoAssetsAfter: 68,
      criticalRisksBefore: 0,
      criticalRisksAfter: 0,
      quantumReadinessBefore: 94,
      quantumReadinessAfter: 94,
      newAssets: [],
    },
    findings: [],
    summary: {
      dependencyAnalysis: true,
      cryptoApiAnalysis: true,
      cbomComparison: true,
      quantumRiskAnalysis: true,
      policyCheck: true,
    },
  },
  {
    id: "221",
    prNumber: 221,
    title: "Upgrade edge reverse proxy TLS cipher suite priorities",
    repository: "api-gateway",
    author: {
      name: "Alex Chen",
      username: "alexchen",
    },
    branch: "infra/tls-cipher-hardening",
    baseBranch: "main",
    cryptoChanges: ["+ ChaCha20-Poly1305", "ECDH-P384"],
    hasCryptoChanges: true,
    risk: "Medium",
    status: "Reviewing",
    reviewedAt: "24m ago",
    findingsCount: 1,
    cbomDiff: {
      before: ["AES-128-GCM", "ECDHE-RSA-AES128"],
      after: ["AES-128-GCM", "+ ChaCha20-Poly1305", "+ ECDH-P384"],
      cryptoAssetsBefore: 42,
      cryptoAssetsAfter: 44,
      criticalRisksBefore: 1,
      criticalRisksAfter: 1,
      quantumReadinessBefore: 72,
      quantumReadinessAfter: 76,
      newAssets: [
        {
          name: "ChaCha20-Poly1305",
          risk: "Low",
          category: "Symmetric Cipher / Stream",
        },
        {
          name: "ECDH-P384",
          risk: "Medium",
          category: "Key Exchange / Classical Elliptic Curve",
        },
      ],
    },
    findings: [
      {
        id: "f-221-1",
        title: "Classical Key Exchange ECDH-P384 vulnerable to Harvest Now, Decrypt Later (HNDL)",
        severity: "Medium",
        file: "config/envoy/tls_config.yaml",
        line: 18,
        usage: "TLS 1.3 Key Agreement",
        threat: "HNDL (Harvest Now Decrypt Later) adversary interception",
        recommendation: "Enable hybrid post-quantum key exchange using X25519MLKEM768 (Kyber768 hybrid).",
        codeSnippet: {
          lang: "yaml",
          highlightLine: 18,
          code: `# config/envoy/tls_config.yaml
tls_certificates:
  - certificate_chain: { filename: "/certs/edge.crt" }
    private_key: { filename: "/certs/edge.key" }
common_tls_context:
  tls_params:
    tls_minimum_protocol_version: TLSv1_3
    ecdh_curves:
      - secp384r1 # ⚠️ Classical curve - vulnerable to HNDL`,
        },
      },
    ],
    summary: {
      dependencyAnalysis: true,
      cryptoApiAnalysis: true,
      cbomComparison: true,
      quantumRiskAnalysis: true,
      policyCheck: true,
    },
  },
  {
    id: "64",
    prNumber: 64,
    title: "Update user avatar upload endpoint and S3 bucket prefix",
    repository: "user-service",
    author: {
      name: "Elena Rostova",
      username: "erostova",
    },
    branch: "feature/avatar-bucket-cleanup",
    baseBranch: "main",
    cryptoChanges: ["No crypto changes"],
    hasCryptoChanges: false,
    risk: "Safe",
    status: "Reviewed",
    reviewedAt: "1h ago",
    findingsCount: 0,
    cbomDiff: {
      before: ["AES-256"],
      after: ["AES-256"],
      cryptoAssetsBefore: 18,
      cryptoAssetsAfter: 18,
      criticalRisksBefore: 0,
      criticalRisksAfter: 0,
      quantumReadinessBefore: 98,
      quantumReadinessAfter: 98,
      newAssets: [],
    },
    findings: [],
    summary: {
      dependencyAnalysis: true,
      cryptoApiAnalysis: true,
      cbomComparison: true,
      quantumRiskAnalysis: true,
      policyCheck: true,
    },
  },
  {
    id: "319",
    prNumber: 319,
    title: "Legacy vault checksum calculation helper",
    repository: "vault-core",
    author: {
      name: "Marcus Brody",
      username: "mbrody",
    },
    branch: "bugfix/vault-checksum-digest",
    baseBranch: "main",
    cryptoChanges: ["+ SHA-1 (deprecated)", "HMAC-SHA256"],
    hasCryptoChanges: true,
    risk: "High",
    status: "Reviewed",
    reviewedAt: "3h ago",
    findingsCount: 1,
    cbomDiff: {
      before: ["HMAC-SHA256", "AES-256-CBC"],
      after: ["HMAC-SHA256", "AES-256-CBC", "+ SHA-1 🔴"],
      cryptoAssetsBefore: 55,
      cryptoAssetsAfter: 56,
      criticalRisksBefore: 1,
      criticalRisksAfter: 2,
      quantumReadinessBefore: 88,
      quantumReadinessAfter: 81,
      newAssets: [
        {
          name: "SHA-1",
          risk: "High",
          category: "Cryptographic Hash (Collision Insecure)",
        },
      ],
    },
    findings: [
      {
        id: "f-319-1",
        title: "Deprecated SHA-1 hashing algorithm introduced",
        severity: "High",
        file: "pkg/crypto/hasher.go",
        line: 58,
        usage: "Integrity Checksum Validation",
        threat: "Practical collision attacks (SHAttered, Shambles)",
        recommendation: "Replace with SHA-256, SHA-384, or quantum-resistant SHA3-256.",
      },
    ],
    summary: {
      dependencyAnalysis: true,
      cryptoApiAnalysis: true,
      cbomComparison: true,
      quantumRiskAnalysis: true,
      policyCheck: false,
    },
  },
]

