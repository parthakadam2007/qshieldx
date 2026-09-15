 export const seedCBOM = {
  
  "bomFormat": "CycloneDX",
  "specVersion": "1.7",
  "serialNumber": "urn:uuid:3e671687-395b-41f5-a30f-a58921a69b79",
  "version": 1,

  "metadata": {
    "timestamp": "2026-09-15T16:05:00.000Z",

    "tools": [
      {
        "vendor": "QShieldX",
        "name": "CBOM Generator",
        "version": "1.0.0"
      }
    ],

    "authors": [
      {
        "name": "QShieldX Security Team"
      }
    ],

    "component": {
      "type": "application",
      "bom-ref": "application:qshieldx-demo",
      "name": "qshieldx-demo-application",
      "version": "1.0.0",
      "description": "Application scanned for cryptographic assets and quantum readiness"
    },

    "properties": [
      {
        "name": "scan.type",
        "value": "cryptographic-bill-of-materials"
      },
      {
        "name": "scan.engine",
        "value": "QShieldX CBOM Engine"
      },
      {
        "name": "scan.status",
        "value": "completed"
      },
      {
        "name": "quantum.readiness",
        "value": "at-risk"
      }
    ]
  },

  "components": [

    {
      "type": "cryptographic-asset",
      "bom-ref": "crypto:rsa-2048",
      "name": "RSA-2048",
      "version": "2048",
      "description": "RSA asymmetric encryption algorithm",
      "cryptoProperties": {
        "assetType": "algorithm",
        "algorithmProperties": {
          "primitive": "public-key-encryption",
          "parameterSetIdentifier": "RSA-2048"
        },
        "protocolProperties": {
          "type": "TLS"
        }
      },
      "properties": [
        {
          "name": "quantum.status",
          "value": "vulnerable"
        },
        {
          "name": "quantum.threat",
          "value": "Shor"
        },
        {
          "name": "security.level",
          "value": "legacy"
        },
        {
          "name": "migration.priority",
          "value": "critical"
        }
      ]
    },

    {
      "type": "cryptographic-asset",
      "bom-ref": "crypto:rsa-3072",
      "name": "RSA-3072",
      "version": "3072",
      "cryptoProperties": {
        "assetType": "algorithm",
        "algorithmProperties": {
          "primitive": "public-key-encryption",
          "parameterSetIdentifier": "RSA-3072"
        }
      },
      "properties": [
        {
          "name": "quantum.status",
          "value": "vulnerable"
        },
        {
          "name": "migration.priority",
          "value": "high"
        }
      ]
    },

    {
      "type": "cryptographic-asset",
      "bom-ref": "crypto:ecdsa-p256",
      "name": "ECDSA",
      "version": "P-256",
      "cryptoProperties": {
        "assetType": "algorithm",
        "algorithmProperties": {
          "primitive": "digital-signature",
          "parameterSetIdentifier": "secp256r1"
        }
      },
      "properties": [
        {
          "name": "quantum.status",
          "value": "vulnerable"
        },
        {
          "name": "quantum.threat",
          "value": "Shor"
        },
        {
          "name": "migration.priority",
          "value": "high"
        }
      ]
    },

    {
      "type": "cryptographic-asset",
      "bom-ref": "crypto:ed25519",
      "name": "Ed25519",
      "cryptoProperties": {
        "assetType": "algorithm",
        "algorithmProperties": {
          "primitive": "digital-signature"
        }
      },
      "properties": [
        {
          "name": "quantum.status",
          "value": "vulnerable"
        },
        {
          "name": "migration.priority",
          "value": "high"
        }
      ]
    },

    {
      "type": "cryptographic-asset",
      "bom-ref": "crypto:aes-256",
      "name": "AES",
      "version": "256",
      "cryptoProperties": {
        "assetType": "algorithm",
        "algorithmProperties": {
          "primitive": "block-cipher",
          "parameterSetIdentifier": "AES-256"
        }
      },
      "properties": [
        {
          "name": "quantum.status",
          "value": "quantum-resistant"
        },
        {
          "name": "quantum.security",
          "value": "strong"
        }
      ]
    },

    {
      "type": "cryptographic-asset",
      "bom-ref": "crypto:aes-128",
      "name": "AES",
      "version": "128",
      "cryptoProperties": {
        "assetType": "algorithm",
        "algorithmProperties": {
          "primitive": "block-cipher",
          "parameterSetIdentifier": "AES-128"
        }
      },
      "properties": [
        {
          "name": "quantum.status",
          "value": "reduced-security"
        },
        {
          "name": "migration.priority",
          "value": "medium"
        }
      ]
    },

    {
      "type": "cryptographic-asset",
      "bom-ref": "crypto:sha256",
      "name": "SHA-256",
      "cryptoProperties": {
        "assetType": "algorithm",
        "algorithmProperties": {
          "primitive": "hash"
        }
      },
      "properties": [
        {
          "name": "quantum.status",
          "value": "acceptable"
        }
      ]
    },

    {
      "type": "cryptographic-asset",
      "bom-ref": "crypto:sha512",
      "name": "SHA-512",
      "cryptoProperties": {
        "assetType": "algorithm",
        "algorithmProperties": {
          "primitive": "hash"
        }
      },
      "properties": [
        {
          "name": "quantum.status",
          "value": "acceptable"
        }
      ]
    },

    {
      "type": "cryptographic-asset",
      "bom-ref": "crypto:chacha20-poly1305",
      "name": "ChaCha20-Poly1305",
      "cryptoProperties": {
        "assetType": "algorithm",
        "algorithmProperties": {
          "primitive": "authenticated-encryption"
        }
      },
      "properties": [
        {
          "name": "quantum.status",
          "value": "acceptable"
        }
      ]
    },

    {
      "type": "cryptographic-asset",
      "bom-ref": "crypto:ml-kem-768",
      "name": "ML-KEM",
      "version": "768",
      "cryptoProperties": {
        "assetType": "algorithm",
        "algorithmProperties": {
          "primitive": "key-encapsulation-mechanism",
          "parameterSetIdentifier": "ML-KEM-768"
        }
      },
      "properties": [
        {
          "name": "quantum.status",
          "value": "post-quantum"
        },
        {
          "name": "nist.status",
          "value": "standardized"
        }
      ]
    },

    {
      "type": "cryptographic-asset",
      "bom-ref": "crypto:ml-dsa-65",
      "name": "ML-DSA",
      "version": "65",
      "cryptoProperties": {
        "assetType": "algorithm",
        "algorithmProperties": {
          "primitive": "digital-signature",
          "parameterSetIdentifier": "ML-DSA-65"
        }
      },
      "properties": [
        {
          "name": "quantum.status",
          "value": "post-quantum"
        },
        {
          "name": "nist.status",
          "value": "standardized"
        }
      ]
    },

    {
      "type": "cryptographic-asset",
      "bom-ref": "crypto:slh-dsa",
      "name": "SLH-DSA",
      "cryptoProperties": {
        "assetType": "algorithm",
        "algorithmProperties": {
          "primitive": "digital-signature"
        }
      },
      "properties": [
        {
          "name": "quantum.status",
          "value": "post-quantum"
        }
      ]
    },

    {
      "type": "cryptographic-asset",
      "bom-ref": "crypto:dh-2048",
      "name": "Diffie-Hellman",
      "version": "2048",
      "cryptoProperties": {
        "assetType": "algorithm",
        "algorithmProperties": {
          "primitive": "key-agreement",
          "parameterSetIdentifier": "DH-2048"
        }
      },
      "properties": [
        {
          "name": "quantum.status",
          "value": "vulnerable"
        }
      ]
    },

    {
      "type": "cryptographic-asset",
      "bom-ref": "crypto:x25519",
      "name": "X25519",
      "cryptoProperties": {
        "assetType": "algorithm",
        "algorithmProperties": {
          "primitive": "key-agreement"
        }
      },
      "properties": [
        {
          "name": "quantum.status",
          "value": "vulnerable"
        }
      ]
    },

    {
      "type": "cryptographic-asset",
      "bom-ref": "crypto:tls13",
      "name": "TLS",
      "version": "1.3",
      "cryptoProperties": {
        "assetType": "protocol",
        "protocolProperties": {
          "type": "TLS",
          "version": "1.3"
        }
      },
      "properties": [
        {
          "name": "quantum.status",
          "value": "partially-resistant"
        },
        {
          "name": "pqc.support",
          "value": "hybrid-required"
        }
      ]
    },

    {
      "type": "cryptographic-asset",
      "bom-ref": "crypto:tls12",
      "name": "TLS",
      "version": "1.2",
      "cryptoProperties": {
        "assetType": "protocol",
        "protocolProperties": {
          "type": "TLS",
          "version": "1.2"
        }
      },
      "properties": [
        {
          "name": "security.status",
          "value": "legacy"
        }
      ]
    },

    {
      "type": "cryptographic-asset",
      "bom-ref": "crypto:jwt-rs256",
      "name": "JWT RS256",
      "cryptoProperties": {
        "assetType": "cryptographic-function",
        "algorithmProperties": {
          "primitive": "digital-signature",
          "parameterSetIdentifier": "RSA-SHA256"
        }
      },
      "properties": [
        {
          "name": "usage",
          "value": "authentication"
        },
        {
          "name": "quantum.status",
          "value": "vulnerable"
        }
      ]
    },

    {
      "type": "cryptographic-asset",
      "bom-ref": "crypto:password-bcrypt",
      "name": "bcrypt",
      "cryptoProperties": {
        "assetType": "password-hashing"
      },
      "properties": [
        {
          "name": "usage",
          "value": "password-storage"
        }
      ]
    },

    {
      "type": "cryptographic-asset",
      "bom-ref": "crypto:hmac-sha256",
      "name": "HMAC-SHA256",
      "cryptoProperties": {
        "assetType": "message-authentication-code",
        "algorithmProperties": {
          "primitive": "MAC"
        }
      }
    }

  ],

  "services": [

    {
      "bom-ref": "service:api-gateway",
      "provider": {
        "name": "QShieldX"
      },
      "name": "API Gateway",
      "version": "1.0.0",
      "endpoints": [
        "https://api.example.com"
      ],
      "authenticated": true,
      "trustBoundary": true,
      "properties": [
        {
          "name": "tls.version",
          "value": "1.3"
        },
        {
          "name": "certificate.algorithm",
          "value": "RSA-2048"
        }
      ]
    },

    {
      "bom-ref": "service:authentication",
      "provider": {
        "name": "QShieldX"
      },
      "name": "Authentication Service",
      "version": "2.1.0",
      "authenticated": true,
      "trustBoundary": true,
      "properties": [
        {
          "name": "jwt.algorithm",
          "value": "RS256"
        },
        {
          "name": "password.hash",
          "value": "bcrypt"
        }
      ]
    },

    {
      "bom-ref": "service:database",
      "provider": {
        "name": "PostgreSQL"
      },
      "name": "PostgreSQL Database",
      "version": "16",
      "authenticated": true,
      "properties": [
        {
          "name": "connection.encryption",
          "value": "TLS"
        },
        {
          "name": "data.classification",
          "value": "confidential"
        }
      ]
    }

  ],

  "dependencies": [

    {
      "ref": "service:api-gateway",
      "dependsOn": [
        "crypto:tls13",
        "crypto:rsa-2048"
      ]
    },

    {
      "ref": "service:authentication",
      "dependsOn": [
        "crypto:jwt-rs256",
        "crypto:password-bcrypt",
        "crypto:hmac-sha256"
      ]
    },

    {
      "ref": "service:database",
      "dependsOn": [
        "crypto:tls13",
        "crypto:aes-256"
      ]
    }
  ],

  "vulnerabilities": [

    {
      "bom-ref": "vulnerability:weak-rsa",
      "id": "QX-CRYPTO-001",
      "source": {
        "name": "QShieldX"
      },
      "ratings": [
        {
          "severity": "critical",
          "method": "other",
          "score": 9.5
        }
      ],
      "analysis": {
        "state": "exploitable",
        "response": [
          "update"
        ]
      },
      "affects": [
        {
          "ref": "crypto:rsa-2048"
        }
      ],
      "description": "RSA-2048 is vulnerable to future cryptographically relevant quantum computers using Shor's algorithm.",
      "recommendation": "Migrate to a post-quantum or hybrid cryptographic mechanism."
    },

    {
      "bom-ref": "vulnerability:ecdsa-p256",
      "id": "QX-CRYPTO-002",
      "source": {
        "name": "QShieldX"
      },
      "ratings": [
        {
          "severity": "high",
          "method": "other",
          "score": 8.5
        }
      ],
      "affects": [
        {
          "ref": "crypto:ecdsa-p256"
        }
      ],
      "description": "ECDSA relies on elliptic-curve discrete logarithms and is vulnerable to Shor's algorithm.",
      "recommendation": "Adopt ML-DSA or another approved post-quantum signature scheme."
    },

    {
      "bom-ref": "vulnerability:tls12",
      "id": "QX-CRYPTO-003",
      "source": {
        "name": "QShieldX"
      },
      "ratings": [
        {
          "severity": "medium",
          "method": "other",
          "score": 6.5
        }
      ],
      "affects": [
        {
          "ref": "crypto:tls12"
        }
      ],
      "description": "Legacy TLS configuration detected.",
      "recommendation": "Upgrade to TLS 1.3 and evaluate hybrid PQC key exchange."
    }

  ],

  "evidence": [

    {
      "bom-ref": "evidence:rsa-source",
      "identity": {
        "field": "file",
        "concludedValue": "src/security/auth.ts",
        "methods": [
          {
            "technique": "source-code-analysis",
            "confidence": 0.98
          }
        ]
      },
      "occurrences": [
        {
          "location": "src/security/auth.ts",
          "line": 42,
          "offset": 12
        }
      ]
    },

    {
      "bom-ref": "evidence:tls-config",
      "identity": {
        "field": "file",
        "concludedValue": "nginx/nginx.conf",
        "methods": [
          {
            "technique": "configuration-analysis",
            "confidence": 0.96
          }
        ]
      },
      "occurrences": [
        {
          "location": "nginx/nginx.conf",
          "line": 87
        }
      ]
    }

  ],

  "properties": [

    {
      "name": "qshieldx.scan.id",
      "value": "scan-2026-09-15-001"
    },

    {
      "name": "qshieldx.scan.duration",
      "value": "48.2s"
    },

    {
      "name": "qshieldx.assets.total",
      "value": "22"
    },

    {
      "name": "qshieldx.assets.quantum-vulnerable",
      "value": "8"
    },

    {
      "name": "qshieldx.assets.quantum-resistant",
      "value": "6"
    },

    {
      "name": "qshieldx.assets.legacy",
      "value": "4"
    },

    {
      "name": "qshieldx.risk.score",
      "value": "78"
    },

    {
      "name": "qshieldx.risk.level",
      "value": "HIGH"
    },

    {
      "name": "qshieldx.quantum-readiness.score",
      "value": "42"
    },

    {
      "name": "qshieldx.pqc.adoption",
      "value": "27%"
    },

    {
      "name": "qshieldx.migration.required",
      "value": "true"
    },

    {
      "name": "qshieldx.crypto-agility",
      "value": "partial"
    },

    {
      "name": "qshieldx.harvest-now-decrypt-later",
      "value": "high-risk"
    },

    {
      "name": "qshieldx.long-lived-data",
      "value": "true"
    },

    {
      "name": "qshieldx.recommendation.count",
      "value": "14"
    }

  ]
} 