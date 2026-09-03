from typing import Dict, Any
from datetime import datetime

try:
    from OpenSSL import crypto
    HAS_OPENSSL = True
except ImportError:
    HAS_OPENSSL = False

class CertificateParserService:
    @staticmethod
    def parse_certificate(cert_pem: str) -> Dict[str, Any]:
        """
        Parses a PEM encoded certificate and extracts cryptographic details.
        """
        if not HAS_OPENSSL:
            return {
                "error": "OpenSSL module not available. Mocked cert data returned.",
                "subject": {"CN": "mock.example.com"},
                "issuer": {"CN": "Mock CA"},
                "algorithm": "RSA-2048",
                "signature_algorithm": "sha256WithRSAEncryption",
                "not_before": datetime.utcnow().isoformat(),
                "not_after": datetime.utcnow().isoformat(),
                "lifetime_years": 1.0
            }

        try:
            cert = crypto.load_certificate(crypto.FILETYPE_PEM, cert_pem.encode('utf-8'))
            
            # Subject & Issuer
            subject = dict(cert.get_subject().get_components())
            issuer = dict(cert.get_issuer().get_components())
            
            # Keys
            pubkey = cert.get_pubkey()
            key_type_id = pubkey.type()
            
            key_type = "UNKNOWN"
            if key_type_id == crypto.TYPE_RSA:
                key_type = "RSA"
            elif key_type_id == crypto.TYPE_DSA:
                key_type = "DSA"
            else:
                key_type = "ECC" # Approximate, OpenSSL python wrapper abstracts some specifics
                
            key_size = pubkey.bits()
            
            # Dates
            not_before = datetime.strptime(cert.get_notBefore().decode('ascii'), '%Y%m%d%H%M%SZ')
            not_after = datetime.strptime(cert.get_notAfter().decode('ascii'), '%Y%m%d%H%M%SZ')
            lifetime_years = (not_after - not_before).days / 365.25
            
            return {
                "subject": {k.decode('utf-8'): v.decode('utf-8') for k, v in subject.items()},
                "issuer": {k.decode('utf-8'): v.decode('utf-8') for k, v in issuer.items()},
                "algorithm": f"{key_type}-{key_size}",
                "signature_algorithm": cert.get_signature_algorithm().decode('utf-8'),
                "not_before": not_before.isoformat(),
                "not_after": not_after.isoformat(),
                "lifetime_years": round(lifetime_years, 2)
            }
        except Exception as e:
            return {"error": f"Failed to parse certificate: {str(e)}"}
