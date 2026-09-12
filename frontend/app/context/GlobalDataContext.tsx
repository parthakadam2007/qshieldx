// OOP: Encapsulation — This context encapsulates global state management, hiding data fetching and storage details from components.
// OOP: Abstraction — Provides an abstract interface for data access, allowing components to use data without knowing the source.

"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import demoData from "@/lib/demo/qshieldx-demo.json";

// Define the shape of our global data
export interface GlobalDataState {
  targets: any[];
  assets: any[];
  services: any[];
  ports: any[];
  topology: any[];
  findings: any[];
  certificates: any[];
  algorithms: any[];
  secrets: any[];
  quantumRisk: any[];
  cbom: any;
  scan: any;
}

interface GlobalDataContextType {
  data: GlobalDataState;
  isLoading: boolean;
  isDemoMode: boolean;
  setDemoMode: (enabled: boolean) => void;
  refreshData: () => Promise<void>;
  setTargets: (targets: any[]) => void;
  setAssets: (assets: any[]) => void;
  setServices: (services: any[]) => void;
  setPorts: (ports: any[]) => void;
  setTopology: (topology: any[]) => void;
}

const defaultState: GlobalDataState = {
  targets: [],
  assets: [],
  services: [],
  ports: [],
  topology: [],
  findings: [],
  certificates: [],
  algorithms: [],
  secrets: [],
  quantumRisk: [],
  cbom: null,
  scan: null,
};

const normalizeData = (result: any): GlobalDataState => ({
  targets: result?.targets || [],
  assets: result?.assets || [],
  services: result?.services || [],
  ports: result?.ports || [],
  topology: result?.topology || [],
  findings: result?.findings || [],
  certificates: result?.certificates || [],
  algorithms: result?.algorithms || [],
  secrets: result?.secrets || [],
  quantumRisk: result?.quantumRisk || [],
  cbom: result?.cbom || null,
  scan: result?.scan || null,
});

function demoState(): GlobalDataState {
  const assetNames = [
    ["payments.mypay.com", "domain", "RSA-2048"],
    ["api.mypay.com", "domain", "RSA-2048"],
    ["checkout.mypay.com", "domain", "ECDSA P-256"],
    ["merchant.mypay.com", "domain", "RSA-2048"],
    ["vault.mypay.com", "domain", "RSA-4096"],
    ["auth-service", "service", "RSA-2048"],
    ["webhook-gateway", "service", "ECDSA P-256"],
    ["merchant-dashboard", "service", "ML-KEM"],
  ];
  const assets = [
    ...(demoData.assets as any[]),
    ...assetNames.map(([name, asset_type, algorithm], index) => ({ id: `demo-${index}`, name, asset_type, artifact_type: "Cryptographic asset", algorithm, quantum_status: algorithm === "ML-KEM" ? "Quantum Ready" : "Vulnerable", confidence: 96, evidence_sources: ["Subfinder", "testssl", "CryptoFinder"] })),
  ];
  while (assets.length < demoData.scan.assetCount) {
    assets.push({ id: `demo-generated-${assets.length}`, name: `enterprise-asset-${String(assets.length + 1).padStart(3, "0")}`, asset_type: "service", artifact_type: "Cryptographic asset", algorithm: "AES-256-GCM", quantum_status: "Quantum Ready", confidence: 94, evidence_sources: ["CryptoFinder"] });
  }
  return {
    targets: [
      { id: demoData.scan.id, organizationName: demoData.scan.organization, name: demoData.scan.organization, target_domain: demoData.scan.primaryDomain, primaryDomain: demoData.scan.primaryDomain, domain: demoData.scan.primaryDomain, repository_url: demoData.scan.repository, repositoryUrl: demoData.scan.repository, status: demoData.scan.status, scanMode: demoData.scan.discoveryMode, lastCompleted: demoData.scan.completed, business_criticality: demoData.scan.businessCriticality, assets: demoData.scan.assetCount, qars: demoData.scan.riskScore, quantumStatus: demoData.scan.moscaStatus },
      { id: "TGT-ICICI-001", organizationName: "ICICI Payments API", name: "ICICI Payments API", primaryDomain: "payments.icicibank.com", status: "Completed", scanMode: "External Discovery", lastCompleted: "31 Aug 2026 · 05:18 PM IST", assets: 96, qars: 84, quantumStatus: "Wave 1 Migration" },
      { id: "TGT-FLIPKART-001", organizationName: "Flipkart Checkout Service", name: "Flipkart Checkout Service", primaryDomain: "checkout.flipkart.com", status: "Completed", scanMode: "Hybrid Discovery", lastCompleted: "30 Aug 2026 · 11:06 AM IST", assets: 121, qars: 79, quantumStatus: "Wave 1 Migration" },
      { id: "TGT-PNB-001", organizationName: "PNB Internet Banking", name: "PNB Internet Banking", primaryDomain: "netbanking.pnbindia.in", status: "Completed", scanMode: "Internal Discovery", lastCompleted: "29 Aug 2026 · 03:41 PM IST", assets: 74, qars: 88, quantumStatus: "Monitor" },
      { id: "TGT-AADHAAR-001", organizationName: "Aadhaar Sandbox", name: "Aadhaar Sandbox", primaryDomain: "sandbox.uidai.gov.in", status: "Completed", scanMode: "External Discovery", lastCompleted: "28 Aug 2026 · 09:22 AM IST", assets: 43, qars: 93, quantumStatus: "Quantum Ready" },
    ],
    assets: assets.filter((asset) => ["domain", "subdomain", "ip"].includes(asset.asset_type) || asset.id?.startsWith("demo-")),
    services: assets.filter((asset) => ["service", "cloud", "secret"].includes(asset.asset_type)),
    ports: assets.filter((asset) => asset.asset_type === "port"),
    topology: demoData.graph.edges,
    findings: demoData.findings,
    certificates: demoData.certificates,
    algorithms: demoData.algorithms,
    secrets: demoData.secrets,
    quantumRisk: demoData.quantumRisk,
    cbom: demoData.cbom,
    scan: demoData.scan,
  };
}

const GlobalDataContext = createContext<GlobalDataContextType | undefined>(undefined);

export function GlobalDataProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<GlobalDataState>(defaultState);
  const [isLoading, setIsLoading] = useState(true);
  const [isDemoMode, setIsDemoMode] = useState(true);

  const loadDemoData = () => {
    setData(demoState());
    setIsLoading(false);
    setIsDemoMode(true);
  };

  const setDemoMode = (enabled: boolean) => {
    setIsDemoMode(enabled);
    window.localStorage.setItem("qshieldx-demo-mode", String(enabled));
    if (enabled) loadDemoData();
    else refreshData();
  };

  // Fetch data globally
  const refreshData = async () => {
    if (window.localStorage.getItem("qshieldx-demo-mode") === "true") {
      loadDemoData();
      return;
    }

    try {
      const response = await fetch('/api/global-data');
      if (response.ok) {
        const result = await response.json();
        setData(normalizeData(result));
        setIsLoading(false);
        return;
      }
    } catch (error) {
      console.error("Failed to load live data, falling back to demo data:", error);
    }

    loadDemoData();
  };

  useEffect(() => {
    const enabled = window.localStorage.getItem("qshieldx-demo-mode") !== "false";
    setIsDemoMode(enabled);
    if (enabled) loadDemoData();
    else refreshData();
  }, []);

  const setTargets = (targets: any[]) => setData((prev) => ({ ...prev, targets }));
  const setAssets = (assets: any[]) => setData((prev) => ({ ...prev, assets }));
  const setServices = (services: any[]) => setData((prev) => ({ ...prev, services }));
  const setPorts = (ports: any[]) => setData((prev) => ({ ...prev, ports }));
  const setTopology = (topology: any[]) => setData((prev) => ({ ...prev, topology }));

  return (
    <GlobalDataContext.Provider
      value={{
        data,
        isLoading,
        isDemoMode,
        setDemoMode,
        refreshData,
        setTargets,
        setAssets,
        setServices,
        setPorts,
        setTopology,
      }}
    >
      {children}
    </GlobalDataContext.Provider>
  );
}

// Hook to use the global context easily
export function useGlobalData() {
  const context = useContext(GlobalDataContext);
  if (context === undefined) {
    throw new Error("useGlobalData must be used within a GlobalDataProvider");
  }
  return context;
}
