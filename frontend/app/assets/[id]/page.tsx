// OOP: Encapsulation — This asset detail view encapsulates asset-specific state and detail rendering.
// OOP: Composition — Combines cards, progress, tabs, and status badges into a reusable asset details page.

"use client"
import * as React from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { ChevronLeft, Globe, Activity, ShieldCheck, Cpu, TerminalSquare, AlertTriangle, CheckCircle2, XCircle, ArrowUpRight, Clock } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { Lock, Unlock, ShieldAlert as SSLAlert, Check, X, Loader2 } from "lucide-react"

import { useGlobalData } from "@/app/context/GlobalDataContext"

export default function AssetDetailPage() {
  const params = useParams()
  const id = params.id as string
  const { data, refreshData } = useGlobalData()

  const asset = data.assets.find(a => String(a._id || a.id) === id)
  // Highly accurate cross-reference logic
  const relatedPorts = data.ports.filter(p => {
    if (!asset) return false;

    // 1. Match by Subdomain (The Agent stores subdomain as 'id' in the port.assets array)
    const subdomainMatch = p.assets?.some((a: any) =>
      a.id === asset.subdomain ||
      a.name === asset.subdomain ||
      a.name === asset.name
    );

    // 2. Match by IP (Reliable cross-reference)
    const ipMatch = p.assets?.some((a: any) => a.ip === asset.ip && asset.ip !== "Pending...");

    return subdomainMatch || ipMatch;
  })
  const relatedServices = data.services.filter(s =>
    s.assets?.some((a: any) => String(a.id || a._id) === id)
  )

  const riskScore = asset?.riskScore ?? 0;
  const status = asset?.status ?? "Active";

  // Adapter for testssl.sh flat JSON array format
  const parseTestSslData = (rawArray: any[]) => {
    const find = (id: string) => rawArray.find(item => item.id === id);

    // Mapping severity to offered status
    const isOffered = (finding: string) => finding && !finding.toLowerCase().includes("not offered");

    return {
      overallGrade: find("overall_grade")?.finding || "N/A",
      finalScore: parseInt(find("final_score")?.finding) || 0,
      metrics: {
        "Protocol Support": parseInt(find("protocol_support_score")?.finding) || 0,
        "Key Exchange": parseInt(find("key_exchange_score")?.finding) || 0,
        "Cipher Strength": parseInt(find("cipher_strength_score")?.finding) || 0
      },
      protocols: [
        { name: "SSLv2", offered: isOffered(find("SSLv2")?.finding), status: find("SSLv2")?.severity },
        { name: "SSLv3", offered: isOffered(find("SSLv3")?.finding), status: find("SSLv3")?.severity },
        { name: "TLS 1.0", offered: isOffered(find("TLS1")?.finding), status: find("TLS1")?.severity },
        { name: "TLS 1.1", offered: isOffered(find("TLS1_1")?.finding), status: find("TLS1_1")?.severity },
        { name: "TLS 1.2", offered: isOffered(find("TLS1_2")?.finding), status: find("TLS1_2")?.severity },
        { name: "TLS 1.3", offered: isOffered(find("TLS1_3")?.finding), status: find("TLS1_3")?.severity }
      ],
      vulnerabilities: [
        { id: "Heartbleed", vulnerable: find("heartbleed")?.severity !== "OK", cve: find("heartbleed")?.cve, finding: find("heartbleed")?.finding },
        { id: "CCS", vulnerable: find("CCS")?.severity !== "OK", cve: find("CCS")?.cve, finding: find("CCS")?.finding },
        { id: "ROBOT", vulnerable: find("ROBOT")?.severity !== "OK", cve: find("ROBOT")?.cve, finding: find("ROBOT")?.finding },
        { id: "SWEET32", vulnerable: find("SWEET32")?.severity !== "OK", cve: find("SWEET32")?.cve, finding: find("SWEET32")?.finding },
        { id: "BEAST", vulnerable: find("BEAST")?.severity !== "OK", cve: find("BEAST")?.cve, finding: find("BEAST")?.finding },
        { id: "POODLE", vulnerable: find("POODLE_SSL")?.severity !== "OK", cve: find("POODLE_SSL")?.cve, finding: find("POODLE_SSL")?.finding }
      ],
      certificate: {
        commonName: find("cert_commonName")?.finding || find("cert_subjectName")?.finding || "Unknown",
        issuer: find("cert_issuer")?.finding || "N/A",
        notBefore: find("cert_notBefore")?.finding || "N/A",
        notAfter: find("cert_notAfter")?.finding || "N/A",
        keySize: find("cert_keySize")?.finding || "N/A",
        signatureAlgorithm: find("cert_signatureAlgorithm")?.finding || "N/A"
      }
    };
  };

  const [sslData, setSslData] = React.useState<any>(null);
  const [sslScannedAt, setSslScannedAt] = React.useState<string | null>(null);
  const [isSslLoading, setIsSslLoading] = React.useState(true);
  const [isSslScanning, setIsSslScanning] = React.useState(false);

  // Load saved SSL scan from DB on mount
  React.useEffect(() => {
    if (!id) return;
    setIsSslLoading(true);
    fetch(`/api/testssl?assetId=${id}`)
      .then(r => r.json())
      .then(res => {
        if (res.data) {
          setSslData(parseTestSslData(res.data));
          setSslScannedAt(res.scannedAt ? new Date(res.scannedAt).toLocaleString() : null);
        }
      })
      .catch(console.error)
      .finally(() => setIsSslLoading(false));
  }, [id]);

  const handleRunSslScan = async () => {
    if (!asset) {
      return;
    }
    setIsSslScanning(true);
    setSslData(null);
    try {
      const resp = await fetch("/api/testssl", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ domain: asset.name, assetId: id })
      });
      if (resp.ok) {
        const rawJson = await resp.json();
        const formattedData = parseTestSslData(rawJson);
        setSslData(formattedData);
        setSslScannedAt(new Date().toLocaleString());
      } else {
        alert("SSL Scan failed. Ensure testssl is configured on backend.");
      }
    } catch (err) {
      console.error(err);
      alert("Network error during SSL scan.");
    } finally {
      setIsSslScanning(false);
    }
  };

  if (!asset) {
    return (
      <div className="flex h-full items-center justify-center p-8">
        <div className="text-center space-y-4">
          <TerminalSquare className="size-12 text-muted-foreground mx-auto" />
          <h2 className="text-xl font-bold">Asset Not Found</h2>
          <p className="text-muted-foreground">The requested asset ID {id} does not exist.</p>
          <Button asChild><Link href="/assets">Back to Assets</Link></Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col gap-6 p-4 md:p-8">
      {/* Header section */}
      <div className="flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild className="shrink-0 rounded-full">
            <Link href="/assets">
              <ChevronLeft className="size-5" />
              <span className="sr-only">Back to Assets</span>
            </Link>
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold tracking-tight">
                {asset.name || asset.deviceName || asset.subdomain}
              </h1>
              <Badge variant="default" className="h-6 uppercase px-2 text-[10px] tracking-wider">Active</Badge>
            </div>
            <p className="text-sm font-mono text-muted-foreground mt-1">
              {id} &bull; {asset.type || "Asset"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Activity className="mr-2 size-4" />
            Run Scan
          </Button>
          <Button size="sm">
            <TerminalSquare className="mr-2 size-4" />
            Connect
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="vulnerabilities">Vulnerabilities</TabsTrigger>
          <TabsTrigger value="network">Network Config</TabsTrigger>
          <TabsTrigger value="ssl" className="gap-2">
            <Lock className="size-3" /> SSL / TLS
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {/* Quick Stats Summary */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium"> Security Rating </CardTitle>
                <ShieldCheck className="h-4 w-4 text-emerald-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-emerald-500">
                  {Math.max(40, 100 - (relatedPorts.length * 5))} / 100
                </div>
                <Progress value={Math.max(40, 100 - (relatedPorts.length * 5))} className="h-2 mt-3 [&>div]:bg-emerald-500" />
                <p className="text-xs text-muted-foreground mt-2">
                  Security rating based on exposure
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Active Exposures
                </CardTitle>
                <AlertTriangle className="h-4 w-4 text-amber-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{relatedPorts.length} Instances</div>
                <div className="flex items-center gap-2 mt-3">
                  <Badge variant="destructive" className="px-1 text-[10px]">
                    {relatedPorts.filter(p => p.severity > 70).length} HIGH
                  </Badge>
                  <Badge variant="secondary" className="px-1 text-[10px] text-amber-500">
                    {relatedPorts.filter(p => p.severity <= 70).length} INFO
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Attack surface detected
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Connectivity
                </CardTitle>
                <Activity className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{status === "Active" ? "100%" : "0%"}</div>
                <Progress value={status === "Active" ? 100 : 0} className="h-2 mt-3" />
                <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                  {status === "Active" ? (
                    <><CheckCircle2 className="size-3 text-emerald-500" /> Reachable</>
                  ) : (
                    <><XCircle className="size-3 text-destructive" /> Unreachable</>
                  )}
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Environment Details</CardTitle>
                <CardDescription>
                  Hardware and deployment configuration for this asset.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
                <div className="space-y-1">
                  <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Hostname / Subdomain</span>
                  <p className="font-semibold">{asset.subdomain || asset.name || asset.deviceName}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Target Organization</span>
                  <p className="font-semibold flex items-center gap-2">
                    <Globe className="size-4 text-primary" /> {data.targets.find(t => String(t._id || t.id) === asset.targetId)?.organizationName || "Unknown"}
                  </p>
                </div>
                <div className="space-y-1">
                  <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Detected IP</span>
                  <p className="font-mono text-sm font-medium">{asset.ip || "Unknown"}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Last Scanned</span>
                  <p className="font-medium flex items-center gap-2">
                    <Clock className="size-4 text-muted-foreground" /> {asset.lastScanned ? new Date(asset.lastScanned).toLocaleString() : "Recently"}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Recent Scan Activity</CardTitle>
                <CardDescription>
                  Automated security posture checks.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="size-2 rounded-full ring-4 ring-emerald-500/20 bg-emerald-500" />
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium leading-none">AI Asset Mapping</p>
                      <p className="text-xs text-muted-foreground">
                        {asset.lastScanned ? new Date(asset.lastScanned).toLocaleString() : "Sync active"}
                      </p>
                    </div>
                  </div>
                  {relatedPorts.length > 0 && (
                    <div className="flex items-center gap-4">
                      <div className="size-2 rounded-full ring-4 ring-amber-500/20 bg-amber-500" />
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium leading-none">Network Exposure Check</p>
                        <p className="text-xs text-muted-foreground">{relatedPorts.length} ports verified</p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="vulnerabilities" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Identified Vulnerabilities</CardTitle>
              <CardDescription>
                Detailed list of security issues found during the last scan.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border divide-y">
                {relatedPorts.length === 0 ? (
                  <div className="p-8 text-center text-muted-foreground italic">
                    No verified vulnerabilities currently logged for this asset.
                  </div>
                ) : (
                  relatedPorts.map((p, i) => (
                    <div key={i} className="p-4 flex items-center justify-between hover:bg-muted/50 transition-colors">
                      <div className="flex items-start gap-4">
                        <div className="mt-1">
                          {p.severity > 70 ? <XCircle className="size-5 text-destructive" /> : <AlertTriangle className="size-5 text-amber-500" />}
                        </div>
                        <div>
                          <h4 className="font-semibold text-sm">Port {p.portNumber} Identified: {p.service || p.description}</h4>
                          <p className="text-xs text-muted-foreground mt-1 line-clamp-1">Status: {p.state || "Detected"}. This port has been verified as active by the AI scanner.</p>
                          <div className="flex items-center gap-2 mt-2">
                            <Badge variant={p.severity > 70 ? "destructive" : "secondary"} className="h-5 text-[10px]">
                              {p.severity > 70 ? "Critical" : "Detected Area"}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="network" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Exposed Services & Ports</CardTitle>
              <CardDescription>
                Active network exposure based on nmap scans.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="w-full overflow-auto rounded-md border">
                <table className="w-full text-sm text-left">
                  <thead className="bg-muted text-muted-foreground text-xs uppercase font-medium">
                    <tr>
                      <th className="px-6 py-3 font-semibold">Port</th>
                      <th className="px-6 py-3 font-semibold">Protocol</th>
                      <th className="px-6 py-3 font-semibold">Service</th>
                      <th className="px-6 py-3 font-semibold">State</th>
                      <th className="px-6 py-3 font-semibold text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {relatedPorts.map((p, i) => (
                      <tr key={i} className="hover:bg-muted/50 transition-colors">
                        <td className="px-6 py-4 font-mono">{p.portNumber}</td>
                        <td className="px-6 py-4 uppercase tracking-tighter text-[10px] font-bold">{p.protocol}</td>
                        <td className="px-6 py-4 font-medium text-primary">{p.service || p.description}</td>
                        <td className="px-6 py-4"><Badge variant="default" className="text-[10px] uppercase font-bold tracking-widest h-5">{p.state || "Open"}</Badge></td>
                        <td className="px-6 py-4 text-right">
                          <Button variant="ghost" size="icon" className="size-8"><ArrowUpRight className="size-4" /></Button>
                        </td>
                      </tr>
                    ))}
                    {relatedPorts.length === 0 && (
                      <tr>
                        <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground italic">No port data found for this specific asset.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ssl" className="space-y-4">
          {isSslLoading ? (
            <Card className="p-12 flex flex-col items-center justify-center text-center">
              <Loader2 className="size-10 text-muted-foreground animate-spin mb-4" />
              <CardTitle>Loading SSL Data...</CardTitle>
              <CardDescription>Checking for saved SSL scan results.</CardDescription>
            </Card>
          ) : !sslData && !isSslScanning ? (
            <Card className="border-dashed flex flex-col items-center justify-center p-12 text-center">
              <SSLAlert className="size-12 text-muted-foreground mb-4 opacity-50" />
              <CardTitle>No SSL Analysis Found</CardTitle>
              <CardDescription className="max-w-xs mx-auto mt-2">
                Perform a deep TLS/SSL handshake analysis to identify weak ciphers and protocol vulnerabilities.
              </CardDescription>
              <Button onClick={handleRunSslScan} className="mt-6 gap-2">
                <Activity className="size-4" /> Start testssl.sh Scan
              </Button>
            </Card>
          ) : isSslScanning ? (
            <Card className="p-12 flex flex-col items-center justify-center text-center">
              <Loader2 className="size-10 text-primary animate-spin mb-4" />
              <CardTitle>Analyzing SSL Handshake...</CardTitle>
              <CardDescription>Requesting deep scan from backend agent. This may take up to 60 seconds.</CardDescription>
            </Card>
          ) : (
            <div className="grid gap-6 md:grid-cols-12">
              {/* Re-scan button + last scanned info */}
              <div className="md:col-span-12 flex items-center justify-between">
                <p className="text-xs text-muted-foreground">
                  {sslScannedAt ? <>Last scanned: <span className="font-medium text-foreground">{sslScannedAt}</span></> : null}
                </p>
                <Button variant="outline" size="sm" onClick={handleRunSslScan} className="gap-2" disabled={isSslScanning}>
                  <Activity className="size-3.5" /> Re-run Scan
                </Button>
              </div>
              {/* Grade and Metrics */}
              <Card className="md:col-span-4 bg-muted/20">
                <CardHeader className="text-center">
                  <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Overall Rating</span>
                  <div className={`text-8xl font-black mx-auto mb-4 ${sslData.overallGrade?.startsWith('A') ? 'text-emerald-500' :
                    sslData.overallGrade?.startsWith('B') ? 'text-amber-500' : 'text-destructive'
                    }`}>
                    {sslData.overallGrade}
                  </div>
                  <CardTitle className="text-xl">Score: {sslData.finalScore}/100</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {Object.entries(sslData.metrics || {}).map(([key, val]: [string, any]) => (
                    <div key={key} className="space-y-1">
                      <div className="flex justify-between text-xs font-medium uppercase tracking-tight">
                        <span>{key}</span>
                        <span>{val}%</span>
                      </div>
                      <Progress value={val} className="h-1.5" />
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Protocol Support */}
              <Card className="md:col-span-8">
                <CardHeader>
                  <CardTitle>Protocol Support</CardTitle>
                  <CardDescription>Supported versions of SSL and TLS detected on this interface.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {sslData.protocols?.map((p: any) => (
                      <div key={p.name} className="flex items-center justify-between p-3 border rounded-lg bg-background">
                        <span className="text-sm font-semibold">{p.name}</span>
                        {p.offered ? (
                          <Badge variant={p.status === "OK" ? "default" : "secondary"} className={p.status === "OK" ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" : "bg-amber-500/10 text-amber-500 border-amber-500/20"}>
                            {p.status}
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="opacity-50 text-[10px]">NOT OFFERED</Badge>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Vulnerabilities Table */}
              <Card className="md:col-span-12">
                <CardHeader>
                  <CardTitle>TLS Vulnerability Scan Results</CardTitle>
                  <CardDescription>Direct checks for common SSL/TLS attacks.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {sslData.vulnerabilities?.map((v: any) => (
                      <div key={v.id} className={`p-4 rounded-lg border ${v.vulnerable ? 'border-destructive bg-destructive/5' : 'bg-muted/10'}`}>
                        <div className="flex items-start justify-between mb-2">
                          <span className="font-bold text-sm">{v.id}</span>
                          {v.vulnerable ? <X className="size-4 text-destructive" /> : <Check className="size-4 text-emerald-500" />}
                        </div>
                        <p className="text-[10px] text-muted-foreground font-mono">{v.cve || "No CVE provided"}</p>
                        <p className={`text-xs font-bold mt-1 ${v.vulnerable ? 'text-destructive' : 'text-emerald-500'}`}>
                          {v.vulnerable ? 'VULNERABLE' : 'Secured'}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Certificate Details */}
              <Card className="md:col-span-12">
                <CardHeader>
                  <CardTitle>Certificate Information</CardTitle>
                </CardHeader>
                <CardContent className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-2 text-sm italic">
                      <span className="text-muted-foreground">Subject Name:</span>
                      <span className="font-bold">{sslData.certificate?.commonName}</span>
                      <span className="text-muted-foreground">Issuer:</span>
                      <span className="font-medium text-primary">{sslData.certificate?.issuer}</span>
                      <span className="text-muted-foreground">Algorithm:</span>
                      <span className="font-mono text-xs">{sslData.certificate?.signatureAlgorithm}</span>
                      <span className="text-muted-foreground">Key Specs:</span>
                      <span className="font-mono text-xs">{sslData.certificate?.keySize}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex flex-col p-3 rounded bg-muted/30 border border-muted">
                      <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest mb-1">Validity Timeline</span>
                      <div className="flex justify-between text-xs font-mono">
                        <span>Start: {sslData.certificate?.notBefore}</span>
                        <span>End: {sslData.certificate?.notAfter}</span>
                      </div>
                      <Progress value={60} className="h-1.5 mt-2" />
                    </div>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {sslData.certificate?.subjectAltNames?.slice(0, 10).map((name: string, i: number) => (
                        <Badge key={i} variant="outline" className="text-[9px] font-mono opacity-70">SAN: {name}</Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
