"use client"

import * as React from "react"

import { useRouter } from "next/navigation"
import { 
  Building2, Globe, Server, CheckCircle2, ChevronRight,
  ChevronLeft, ShieldCheck, Lock, Activity, Binary, Code, 
  Search, ScanLine, Key, Globe2, AlertTriangle, FileJson
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { DEMO_CRYPTO_ASSET_COUNT } from "@/lib/demo-metrics"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import { Badge } from "@/components/ui/badge"
import { useGlobalData } from "@/app/context/GlobalDataContext"

const steps = [
  { id: 1, name: "Organization Scope" },
  { id: 2, name: "Asset Discovery" },
  { id: 3, name: "Cryptographic Config" },
  { id: 4, name: "Planner Preview" },
]

export default function WizardPage() {
  const router = useRouter()
  const { isDemoMode, data } = useGlobalData()
  const [step, setStep] = React.useState(1)
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [isBuildingCbom, setIsBuildingCbom] = React.useState(false)
  const [cbomStep, setCbomStep] = React.useState(0)

  // Step 1 Form Data
  const [orgName, setOrgName] = React.useState("")
  const [domain, setDomain] = React.useState("")
  const [repoUrl, setRepoUrl] = React.useState("")
  const [industry, setIndustry] = React.useState("")
  const [shelfLife, setShelfLife] = React.useState([12])
  const [criticality, setCriticality] = React.useState("critical")

  // Step 2 Form Data
  const [scope, setScope] = React.useState({
    external: true,
    internal: true,
    cloud: true,
    ctl: true,
    secrets: true,
    tls: true
  })
  const [subdomains, setSubdomains] = React.useState("")
  const [cidr, setCidr] = React.useState("")
  const [branch, setBranch] = React.useState("main")
  const [folder, setFolder] = React.useState("/")
  const [cloudProvider, setCloudProvider] = React.useState("aws")

  // Step 3 Form Data
  const [engines, setEngines] = React.useState({
    subfinder: true,
    nmap: true,
    testssl: true,
    certParser: true,
    cryptoFinder: true,
    gitLeaks: true,
    semgrep: true
  })

  React.useEffect(() => {
    if (!isDemoMode || !data.scan) return
    setOrgName(data.scan.organization)
    setDomain(data.scan.primaryDomain)
    setRepoUrl(data.scan.repository)
    setIndustry(data.scan.industry)
    setShelfLife([data.scan.shelfLifeYears])
    setCriticality(data.scan.businessCriticality.toLowerCase())
    setSubdomains("auth.mypay.com\ncheckout.mypay.com\nvault.mypay.com")
  }, [isDemoMode, data.scan])

  const nextStep = () => setStep((s) => Math.min(s + 1, 4))
  const prevStep = () => setStep((s) => Math.max(s - 1, 1))

  const handleScopeToggle = (key: keyof typeof scope) => {
    setScope(prev => ({ ...prev, [key]: !prev[key] }))
  }

  const handleEngineToggle = (key: keyof typeof engines) => {
    setEngines(prev => ({ ...prev, [key]: !prev[key] }))
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    setIsBuildingCbom(true)
    setCbomStep(0)

    // Animate through CBOM build steps then redirect
    const stepDelays = [600, 1100, 800, 900, 600]
    let acc = 0
    stepDelays.forEach((delay, i) => {
      acc += delay
      setTimeout(() => setCbomStep(i + 1), acc)
    })

    setTimeout(() => {
      router.push("/")
    }, 4000)
  }

  return (
    <div className="flex h-full flex-col max-w-5xl mx-auto w-full p-4 md:p-8">

      {/* ── CBOM Building Overlay ── */}
      {isBuildingCbom && (() => {
        const cbomStages = [
          { icon: Search,     label: "Resolving asset scope & endpoints"       },
          { icon: Binary,     label: "Extracting cryptographic primitives"      },
          { icon: FileJson,   label: "Mapping algorithm dependencies (CBOM)"   },
          { icon: ScanLine,   label: "Running quantum-risk classification"      },
          { icon: ShieldCheck,label: "Finalising security posture report"       },
        ]
        const progress = Math.round((cbomStep / cbomStages.length) * 100)
        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
            <Card className="w-full max-w-md mx-4 shadow-2xl border-border">
              <CardHeader className="pb-3 text-center">
                {/* Animated shield icon */}
                <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-full bg-primary/10 ring-1 ring-primary/20">
                  <ShieldCheck className="size-7 text-primary animate-pulse" />
                </div>
                <CardTitle className="text-xl font-semibold">Building Cryptographic BOM</CardTitle>
                <CardDescription className="text-sm text-muted-foreground">
                  Initialising secure discovery pipeline…
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-5 pb-6">
                {/* Progress bar */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Overall progress</span>
                    <span className="font-medium tabular-nums">{progress}%</span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full rounded-full bg-primary transition-all duration-700 ease-out"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>

                {/* Stage list */}
                <ul className="space-y-2.5">
                  {cbomStages.map((stage, i) => {
                    const Icon = stage.icon
                    const done    = cbomStep > i
                    const current = cbomStep === i
                    return (
                      <li key={i} className="flex items-center gap-3">
                        <span
                          className={[
                            "flex size-7 shrink-0 items-center justify-center rounded-full border text-[11px] transition-colors duration-500",
                            done    ? "border-primary bg-primary text-primary-foreground"         : "",
                            current ? "border-primary/50 bg-primary/10 text-primary animate-pulse" : "",
                            !done && !current ? "border-border bg-muted text-muted-foreground"     : "",
                          ].join(" ")}
                        >
                          {done ? (
                            <CheckCircle2 className="size-3.5" />
                          ) : (
                            <Icon className="size-3.5" />
                          )}
                        </span>
                        <span
                          className={[
                            "text-xs leading-tight transition-colors duration-500",
                            done    ? "text-foreground font-medium" : "",
                            current ? "text-foreground font-medium" : "",
                            !done && !current ? "text-muted-foreground" : "",
                          ].join(" ")}
                        >
                          {stage.label}
                        </span>
                        {done && (
                          <Badge variant="outline" className="ml-auto shrink-0 text-[10px] px-1.5 py-0 border-primary/30 text-primary">
                            done
                          </Badge>
                        )}
                        {current && (
                          <Badge variant="outline" className="ml-auto shrink-0 text-[10px] px-1.5 py-0 border-amber-400/40 text-amber-500">
                            running
                          </Badge>
                        )}
                      </li>
                    )
                  })}
                </ul>
              </CardContent>

              <CardFooter className="justify-center pt-0 pb-5">
                <p className="text-[11px] text-muted-foreground text-center">
                  Redirecting to dashboard once complete…
                </p>
              </CardFooter>
            </Card>
          </div>
        )
      })()}

      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Cryptographic Discovery Wizard</h1>
        <p className="text-muted-foreground">Configure the intelligent agent pipeline for comprehensive cryptographic inventory mapping.</p>
      </div>

      {/* Stepper */}
      <div className="mb-8 relative">
        <div className="absolute top-1/2 left-0 w-full h-0.5 bg-muted -translate-y-1/2 z-0"></div>
        <div className="relative z-10 flex justify-between">
          {steps.map((s, i) => {
            const isActive = step === s.id
            const isPast = step > s.id
            return (
              <div key={s.id} className="flex flex-col items-center gap-2 bg-background px-2">
                <div className={`size-10 rounded-full flex items-center justify-center border-2 font-semibold text-sm transition-colors ${
                  isActive ? "border-primary bg-primary text-primary-foreground" : 
                  isPast ? "border-primary bg-primary text-primary-foreground" : 
                  "border-muted text-muted-foreground"
                }`}>
                  {isPast ? <CheckCircle2 className="size-5" /> : s.id}
                </div>
                <span className={`text-xs font-medium ${isActive ? "text-primary" : "text-muted-foreground"}`}>{s.name}</span>
              </div>
            )
          })}
        </div>
      </div>

      <div className="flex-1 overflow-hidden relative min-h-[500px]">
        <div className="absolute inset-0 transition-opacity duration-300">
          {/* STEP 1: ORGANIZATION SCOPE */}
          {step === 1 && (
            <div className="space-y-6 pb-20 animate-in fade-in slide-in-from-right-4 duration-300">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><Building2 className="size-5 text-primary"/> Organization Details</CardTitle>
                  <CardDescription>Primary identification and business context for risk scoring.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Organization Name <span className="text-destructive">*</span></label>
                      <Input value={orgName} onChange={e => setOrgName(e.target.value)} placeholder="mypay Software Pvt. Ltd." />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Primary Domain <span className="text-destructive">*</span></label>
                      <div className="relative">
                        <Globe className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input className="pl-9" value={domain} onChange={e => setDomain(e.target.value)} placeholder="mypay.com" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">GitHub Repository URL</label>
                      <div className="relative">
                        <Code className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input className="pl-9" value={repoUrl} onChange={e => setRepoUrl(e.target.value)} placeholder="https://github.com/mypay/mypay-payment-gateway" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Industry</label>
                      <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={industry} onChange={e => setIndustry(e.target.value)}>
                        <option value="">Select Industry</option>
                        <option value="financial">Financial Services</option>
                        <option value="healthcare">Healthcare</option>
                        <option value="technology">Technology</option>
                        <option value="government">Government / Defense</option>
                        <option value="retail">Retail / E-Commerce</option>
                      </select>
                    </div>
                    
                    <div className="space-y-4 md:col-span-2 pt-4">
                      <div className="flex justify-between">
                        <label className="text-sm font-medium">Data Shelf Life (Years)</label>
                        <span className="text-sm font-mono font-bold text-primary">{shelfLife[0]} Years</span>
                      </div>
                      <Slider value={shelfLife} onValueChange={setShelfLife} max={30} min={1} step={1} />
                      <p className="text-xs text-muted-foreground">How long must the data processed by this organization remain secure against quantum decryption?</p>
                    </div>

                    <div className="space-y-2 md:col-span-2 pt-2">
                      <label className="text-sm font-medium">Business Criticality</label>
                      <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={criticality} onChange={e => setCriticality(e.target.value)}>
                        <option value="low">Low (Internal tools, non-sensitive)</option>
                        <option value="medium">Medium (Standard business apps)</option>
                        <option value="high">High (Customer data, PII)</option>
                        <option value="critical">Critical (Financial data, PHI, Core IP)</option>
                      </select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* STEP 2: ASSET DISCOVERY SCOPE */}
          {step === 2 && (
            <div className="space-y-6 pb-20 animate-in fade-in slide-in-from-right-4 duration-300">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><Server className="size-5 text-primary"/> Discovery Scope</CardTitle>
                  <CardDescription>Select the attack surface and repositories to include in this scan.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    
                    <div className="flex items-start space-x-3 rounded-md border p-4 hover:bg-muted/50 transition-colors">
                      <Checkbox id="ext" checked={scope.external} onCheckedChange={() => handleScopeToggle('external')} />
                      <div className="space-y-1 leading-none">
                        <label htmlFor="ext" className="text-sm font-medium cursor-pointer">External Internet Assets</label>
                        <p className="text-xs text-muted-foreground">Scan public-facing subdomains and endpoints.</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3 rounded-md border p-4 hover:bg-muted/50 transition-colors">
                      <Checkbox id="int" checked={scope.internal} onCheckedChange={() => handleScopeToggle('internal')} />
                      <div className="space-y-1 leading-none">
                        <label htmlFor="int" className="text-sm font-medium cursor-pointer">Internal Repository Analysis</label>
                        <p className="text-xs text-muted-foreground">Deep scan of provided repository source code.</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3 rounded-md border p-4 hover:bg-muted/50 transition-colors">
                      <Checkbox id="cld" checked={scope.cloud} onCheckedChange={() => handleScopeToggle('cloud')} />
                      <div className="space-y-1 leading-none">
                        <label htmlFor="cld" className="text-sm font-medium cursor-pointer">Cloud Cryptographic Inventory</label>
                        <p className="text-xs text-muted-foreground">Discover KMS keys and cloud cert managers.</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3 rounded-md border p-4 hover:bg-muted/50 transition-colors">
                      <Checkbox id="ctl" checked={scope.ctl} onCheckedChange={() => handleScopeToggle('ctl')} />
                      <div className="space-y-1 leading-none">
                        <label htmlFor="ctl" className="text-sm font-medium cursor-pointer">Certificate Transparency Logs</label>
                        <p className="text-xs text-muted-foreground">Query public CT logs for historical certificates.</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3 rounded-md border p-4 hover:bg-muted/50 transition-colors">
                      <Checkbox id="sec" checked={scope.secrets} onCheckedChange={() => handleScopeToggle('secrets')} />
                      <div className="space-y-1 leading-none">
                        <label htmlFor="sec" className="text-sm font-medium cursor-pointer">Secrets Discovery</label>
                        <p className="text-xs text-muted-foreground">Detect hardcoded keys, passwords, and tokens.</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3 rounded-md border p-4 hover:bg-muted/50 transition-colors">
                      <Checkbox id="tls" checked={scope.tls} onCheckedChange={() => handleScopeToggle('tls')} />
                      <div className="space-y-1 leading-none">
                        <label htmlFor="tls" className="text-sm font-medium cursor-pointer">TLS Endpoint Discovery</label>
                        <p className="text-xs text-muted-foreground">Analyze live TLS handshakes and cipher suites.</p>
                      </div>
                    </div>

                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Additional Subdomains</label>
                      <Textarea value={subdomains} onChange={e => setSubdomains(e.target.value)} placeholder="api.mypay.com&#10;checkout.mypay.com" className="h-24 resize-none" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">CIDR Allowlist</label>
                      <Textarea value={cidr} onChange={e => setCidr(e.target.value)} placeholder="192.168.1.0/24&#10;10.0.0.0/8" className="h-24 resize-none" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Repository Branch</label>
                      <Input value={branch} onChange={e => setBranch(e.target.value)} placeholder="main" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Cloud Provider</label>
                      <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={cloudProvider} onChange={e => setCloudProvider(e.target.value)}>
                        <option value="aws">AWS</option>
                        <option value="azure">Azure</option>
                        <option value="gcp">Google Cloud</option>
                      </select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* STEP 3: CRYPTOGRAPHIC DISCOVERY CONFIG */}
          {step === 3 && (
            <div className="space-y-6 pb-20 animate-in fade-in slide-in-from-right-4 duration-300">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><ScanLine className="size-5 text-primary"/> Cryptographic Engines</CardTitle>
                  <CardDescription>Select the specialized discovery and parsing engines for the scan job.</CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  
                  <HoverCard>
                    <HoverCardTrigger asChild>
                      <div onClick={() => handleEngineToggle('subfinder')} className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${engines.subfinder ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'}`}>
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex items-center gap-2">
                            <Globe2 className={`size-5 ${engines.subfinder ? 'text-primary' : 'text-muted-foreground'}`} />
                            <span className="font-semibold text-sm">Subfinder</span>
                          </div>
                          {engines.subfinder && <CheckCircle2 className="size-4 text-primary" />}
                        </div>
                        <p className="text-xs text-muted-foreground line-clamp-2">Passive subdomain enumeration engine for asset discovery.</p>
                        <div className="mt-3 flex items-center gap-2">
                          <Badge variant="outline" className="text-[10px]">~2 mins</Badge>
                        </div>
                      </div>
                    </HoverCardTrigger>
                    <HoverCardContent className="w-80">
                      <div className="space-y-2">
                        <h4 className="text-sm font-semibold">Subfinder Engine</h4>
                        <p className="text-sm text-muted-foreground">Uses passive sources (Shodan, Censys, Virustotal) to discover subdomains without interacting directly with the target infrastructure.</p>
                      </div>
                    </HoverCardContent>
                  </HoverCard>

                  <HoverCard>
                    <HoverCardTrigger asChild>
                      <div onClick={() => handleEngineToggle('nmap')} className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${engines.nmap ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'}`}>
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex items-center gap-2">
                            <Activity className={`size-5 ${engines.nmap ? 'text-primary' : 'text-muted-foreground'}`} />
                            <span className="font-semibold text-sm">Nmap TLS Discovery</span>
                          </div>
                          {engines.nmap && <CheckCircle2 className="size-4 text-primary" />}
                        </div>
                        <p className="text-xs text-muted-foreground line-clamp-2">Network mapper configured specifically for SSL/TLS port detection.</p>
                        <div className="mt-3 flex items-center gap-2">
                          <Badge variant="outline" className="text-[10px]">~5 mins</Badge>
                        </div>
                      </div>
                    </HoverCardTrigger>
                    <HoverCardContent className="w-80">
                      <div className="space-y-2">
                        <h4 className="text-sm font-semibold">Nmap TLS Discovery</h4>
                        <p className="text-sm text-muted-foreground">Scans network ranges to identify open ports specifically hosting TLS/SSL services (e.g., 443, 8443, 465) for further cryptographic analysis.</p>
                      </div>
                    </HoverCardContent>
                  </HoverCard>

                  <HoverCard>
                    <HoverCardTrigger asChild>
                      <div onClick={() => handleEngineToggle('testssl')} className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${engines.testssl ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'}`}>
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex items-center gap-2">
                            <ShieldCheck className={`size-5 ${engines.testssl ? 'text-primary' : 'text-muted-foreground'}`} />
                            <span className="font-semibold text-sm">testssl.sh</span>
                          </div>
                          {engines.testssl && <CheckCircle2 className="size-4 text-primary" />}
                        </div>
                        <p className="text-xs text-muted-foreground line-clamp-2">Deep TLS/SSL configuration, cipher, and certificate analysis.</p>
                        <div className="mt-3 flex items-center gap-2">
                          <Badge variant="outline" className="text-[10px]">~10 mins</Badge>
                        </div>
                      </div>
                    </HoverCardTrigger>
                    <HoverCardContent className="w-80">
                      <div className="space-y-2">
                        <h4 className="text-sm font-semibold">testssl.sh Engine</h4>
                        <p className="text-sm text-muted-foreground">Checks server's service on any port for the support of TLS/SSL ciphers, protocols, as well as recent cryptographic flaws and more.</p>
                      </div>
                    </HoverCardContent>
                  </HoverCard>

                  <HoverCard>
                    <HoverCardTrigger asChild>
                      <div onClick={() => handleEngineToggle('certParser')} className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${engines.certParser ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'}`}>
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex items-center gap-2">
                            <FileJson className={`size-5 ${engines.certParser ? 'text-primary' : 'text-muted-foreground'}`} />
                            <span className="font-semibold text-sm">Certificate Parser</span>
                          </div>
                          {engines.certParser && <CheckCircle2 className="size-4 text-primary" />}
                        </div>
                        <p className="text-xs text-muted-foreground line-clamp-2">X.509 ASN.1 parsing for keys, signatures, and expiration.</p>
                        <div className="mt-3 flex items-center gap-2">
                          <Badge variant="outline" className="text-[10px]">~1 min</Badge>
                        </div>
                      </div>
                    </HoverCardTrigger>
                    <HoverCardContent className="w-80">
                      <div className="space-y-2">
                        <h4 className="text-sm font-semibold">Certificate Parser</h4>
                        <p className="text-sm text-muted-foreground">Extracts cryptographic primitives (RSA/ECC), key lengths, signature algorithms, and subject alternative names from raw certificates.</p>
                      </div>
                    </HoverCardContent>
                  </HoverCard>

                  <HoverCard>
                    <HoverCardTrigger asChild>
                      <div onClick={() => handleEngineToggle('cryptoFinder')} className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${engines.cryptoFinder ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'}`}>
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex items-center gap-2">
                            <Binary className={`size-5 ${engines.cryptoFinder ? 'text-primary' : 'text-muted-foreground'}`} />
                            <span className="font-semibold text-sm">CryptoFinder</span>
                          </div>
                          {engines.cryptoFinder && <CheckCircle2 className="size-4 text-primary" />}
                        </div>
                        <p className="text-xs text-muted-foreground line-clamp-2">Static analysis of code for cryptographic API calls.</p>
                        <div className="mt-3 flex items-center gap-2">
                          <Badge variant="outline" className="text-[10px]">~15 mins</Badge>
                        </div>
                      </div>
                    </HoverCardTrigger>
                    <HoverCardContent className="w-80">
                      <div className="space-y-2">
                        <h4 className="text-sm font-semibold">CryptoFinder</h4>
                        <p className="text-sm text-muted-foreground">Statically analyzes source code to identify instances of cryptographic algorithms (AES, DES, MD5, SHA-1) embedded within the application logic.</p>
                      </div>
                    </HoverCardContent>
                  </HoverCard>

                  <HoverCard>
                    <HoverCardTrigger asChild>
                      <div onClick={() => handleEngineToggle('gitLeaks')} className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${engines.gitLeaks ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'}`}>
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex items-center gap-2">
                            <Key className={`size-5 ${engines.gitLeaks ? 'text-primary' : 'text-muted-foreground'}`} />
                            <span className="font-semibold text-sm">GitLeaks</span>
                          </div>
                          {engines.gitLeaks && <CheckCircle2 className="size-4 text-primary" />}
                        </div>
                        <p className="text-xs text-muted-foreground line-clamp-2">Scan repositories for hardcoded secrets and API keys.</p>
                        <div className="mt-3 flex items-center gap-2">
                          <Badge variant="outline" className="text-[10px]">~3 mins</Badge>
                        </div>
                      </div>
                    </HoverCardTrigger>
                    <HoverCardContent className="w-80">
                      <div className="space-y-2">
                        <h4 className="text-sm font-semibold">GitLeaks</h4>
                        <p className="text-sm text-muted-foreground">Scans git repositories (or files) for secrets using regex and entropy-based heuristics to prevent credential compromise.</p>
                      </div>
                    </HoverCardContent>
                  </HoverCard>

                  <HoverCard>
                    <HoverCardTrigger asChild>
                      <div onClick={() => handleEngineToggle('semgrep')} className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${engines.semgrep ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'}`}>
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex items-center gap-2">
                            <Search className={`size-5 ${engines.semgrep ? 'text-primary' : 'text-muted-foreground'}`} />
                            <span className="font-semibold text-sm">Semgrep Crypto</span>
                          </div>
                          {engines.semgrep && <CheckCircle2 className="size-4 text-primary" />}
                        </div>
                        <p className="text-xs text-muted-foreground line-clamp-2">AST-based scanning for vulnerable cryptographic implementations.</p>
                        <div className="mt-3 flex items-center gap-2">
                          <Badge variant="outline" className="text-[10px]">~20 mins</Badge>
                        </div>
                      </div>
                    </HoverCardTrigger>
                    <HoverCardContent className="w-80">
                      <div className="space-y-2">
                        <h4 className="text-sm font-semibold">Semgrep Crypto</h4>
                        <p className="text-sm text-muted-foreground">Advanced SAST tool using semantic rules to find misconfigured cryptography (e.g. hardcoded IVs, weak RNGs) in source code.</p>
                      </div>
                    </HoverCardContent>
                  </HoverCard>

                </CardContent>
              </Card>
            </div>
          )}

          {/* STEP 4: PLANNER PREVIEW */}
          {step === 4 && (
            <div className="space-y-6 pb-20 animate-in fade-in slide-in-from-right-4 duration-300">
              <Card className="border-primary bg-primary/5">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><CheckCircle2 className="size-5 text-primary"/> Ready for Discovery</CardTitle>
                  <CardDescription>Review the AI Planner Agent's execution strategy before initializing.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-background rounded-lg p-3 border">
                      <div className="text-xs text-muted-foreground mb-1">Organization</div>
                      <div className="font-medium">{orgName || "Not set"}</div>
                    </div>
                    <div className="bg-background rounded-lg p-3 border">
                      <div className="text-xs text-muted-foreground mb-1">Target Domain</div>
                      <div className="font-medium">{domain || "Not set"}</div>
                    </div>
                    <div className="bg-background rounded-lg p-3 border">
                      <div className="text-xs text-muted-foreground mb-1">Repository</div>
                      <div className="font-medium truncate">{repoUrl || "N/A"}</div>
                    </div>
                    <div className="bg-background rounded-lg p-3 border">
                      <div className="text-xs text-muted-foreground mb-1">Risk Model</div>
                      <div className="font-medium">Mosca + QARS</div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold">Enabled Engines</h4>
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(engines).filter(([_, v]) => v).map(([key]) => (
                        <Badge key={key} variant="secondary" className="capitalize">{key}</Badge>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t pt-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-full bg-primary/10 text-primary"><Activity className="size-4" /></div>
                      <div>
                        <div className="text-xs text-muted-foreground">Est. Runtime</div>
                        <div className="text-sm font-semibold">8m 32s</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-full bg-primary/10 text-primary"><Server className="size-4" /></div>
                      <div>
                        <div className="text-xs text-muted-foreground">Est. Target Assets</div>
                        <div className="text-sm font-semibold">{DEMO_CRYPTO_ASSET_COUNT}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-full bg-primary/10 text-primary"><ShieldCheck className="size-4" /></div>
                      <div>
                        <div className="text-xs text-muted-foreground">Output Format</div>
                        <div className="text-sm font-semibold">CBOM (CycloneDX 1.7)</div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 p-4 rounded-lg flex gap-3 text-sm">
                    <AlertTriangle className="size-5 shrink-0" />
                    <div>
                      <strong>Notice:</strong> This action will dispatch multiple autonomous AI agents (Planner, Discovery, Classification, Threat Intel, Quantum Risk, CBOM). Ensure you are authorized to scan the provided targets.
                    </div>
                  </div>

                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background border-t md:relative md:border-0 md:bg-transparent md:p-0 flex justify-between items-center">
        <Button variant="outline" onClick={prevStep} disabled={step === 1 || isSubmitting}>
          <ChevronLeft className="size-4 mr-2" /> Back
        </Button>
        
        {step < 4 ? (
          <Button onClick={nextStep}>
            Next Step <ChevronRight className="size-4 ml-2" />
          </Button>
        ) : (
          <Button onClick={handleSubmit} disabled={isSubmitting || !domain || !orgName}>
            {isSubmitting ? (
              <span className="flex items-center gap-2"><Activity className="size-4 animate-spin" /> Initializing...</span>
            ) : (
              <span className="flex items-center gap-2"><ShieldCheck className="size-4" /> Initialize Cryptographic Discovery</span>
            )}
          </Button>
        )}
      </div>

    </div>
  )
}
