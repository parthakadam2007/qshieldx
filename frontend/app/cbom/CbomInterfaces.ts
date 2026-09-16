export interface Property {
name: string;
value: string;
}

export interface AlgorithmProperties {
primitive?: string;
parameterSetIdentifier?: string;
}

export interface CryptoProperties {
assetType?: string;
algorithmProperties?: AlgorithmProperties;
protocolProperties?: {
    type?: string;
    version?: string;
};
}

export interface CBOMComponent {
type: string;
"bom-ref": string;
name: string;
version?: string;
description?: string;
cryptoProperties?: CryptoProperties;
properties?: Property[];
}