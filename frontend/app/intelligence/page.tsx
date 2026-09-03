"use client"

import * as React from "react"
import { 
  Activity, Terminal, Cpu, Network, ShieldCheck, 
  FileJson, CheckCircle2, AlertCircle, Clock, Database, ChevronRight, ChevronDown, ChevronUp, Binary, BrainCircuit
} from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import { useGlobalData } from "@/app/context/GlobalDataContext"

const AGENTS = [
  { name: "Planner Agent", status: "completed", type: "supervisor" },
  { name: "Discovery Agent", status: "completed", type: "worker" },
  { name: "Classification Agent", status: "completed", type: "worker" },
  { name: "Threat Intelligence Agent", status: "completed", type: "worker" },
  { name: "Quantum Risk Agent", status: "completed", type: "worker" },
  { name: "CBOM Builder", status: "completed", type: "worker" },
  { name: "Migration Planner Agent", status: "completed", type: "worker" },
  { name: "CryptoWatch", status: "active", type: "monitor" },
]

const TIMELINE_EVENTS = [
  {
    id: 1,
    agent: "Planner Agent",
    node: "Observe",
    action: "Initialized Hybrid Discovery",
    tool: null,
    runtime: "1.2s",
    confidence: 0.98,
    timestamp: "19:40",
    result: "Scope confirmed: Razorpay enterprise perimeter and repository.",
    payload: { mode: "Hybrid Discovery", domain: "razorpay.com", assets_expected: 148 }
  },
  {
    id: 2,
    agent: "Planner Agent",
    node: "Decide",
    action: "Launched Subfinder",
    tool: "LangGraph Router",
    runtime: "2.5s",
    confidence: 0.95,
    timestamp: "19:40",
    result: "Subfinder discovered 34 subdomains.",
    payload: { subdomains_found: 34, engine: "Subfinder" }
  },
  {
    id: 3,
    agent: "Discovery Agent",
    node: "Tool Used",
    action: "Nmap TLS completed",
    tool: "subfinder-engine",
    runtime: "31.0s",
    confidence: 1.0,
    timestamp: "19:41",
    result: "Nmap identified 18 TLS services.",
    payload: { tls_services: 18, engine: "Nmap TLS Discovery" }
  },
  {
    id: 4,
    agent: "Discovery Agent",
    node: "Action",
    action: "testssl completed",
    tool: "testssl.sh",
    runtime: "42.0s",
    confidence: 0.99,
    timestamp: "19:41",
    result: "TLS 1.1 found on api.razorpay.com.",
    payload: { endpoint: "api.razorpay.com", finding: "TLS 1.1 enabled" }
  }
]

const MOCK_LOGS = [
  "[19:40] PLANNER: Agent initialized Hybrid Discovery.",
  "[19:40] DISCOVERY: Subfinder discovered 34 subdomains.",
  "[19:41] NMAP_TLS: Identified 18 TLS services.",
  "[19:41] TESTSSL: Found TLS 1.1 on api.razorpay.com.",
  "[19:42] CERT_PARSER: Extracted RSA-2048 certificates.",
  "[19:42] CRYPTOFINDER: Discovered crypto libraries.",
  "[19:42] GITLEAKS: Detected exposed AWS Access Key.",
  "[19:43] SEMGREP: Detected SHA-1 implementation.",
  "[19:43] CORRELATION: Merged evidence for 148 assets.",
  "[19:43] CBOM: Generated CycloneDX 1.7.",
  "[19:43] QARS: Calculated score 91.",
  "[19:43] MIGRATION: Generated Wave 1 roadmap."
]

export default function IntelligencePage() {
  const [expandedEvent, setExpandedEvent] = React.useState<number | null>(null)
  const { data, isDemoMode } = useGlobalData()
  
  React.useEffect(() => {
    document.title = "Intelligence Console | QShieldX Dashboard";
  }, []);

  return (
    <div className="flex h-full flex-col gap-6 p-4 md:p-8 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight flex items-center gap-2">
          <BrainCircuit className="size-6 text-primary" />
          Intelligence Command Center
        </h1>
        <p className="text-sm text-muted-foreground">
          Real-time LangGraph agent orchestration and execution telemetry.
        </p>
      </div>

      {/* Main Grid: 3 Columns for top sections */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* LEFT PANEL: Agent Queue */}
        <Card className="col-span-1 border-primary/20 bg-background/50 backdrop-blur">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Network className="size-4 text-primary" />
              Agent Queue
            </CardTitle>
            <CardDescription className="text-xs">Execution status of LangGraph nodes.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            {AGENTS.map((agent, idx) => (
              <div key={idx} className="flex items-center justify-between p-2 rounded-md border bg-card text-sm">
                <div className="flex items-center gap-2">
                  {agent.status === "completed" && <CheckCircle2 className="size-4 text-emerald-500" />}
                  {agent.status === "active" && <Activity className="size-4 text-amber-500 animate-pulse" />}
                  {agent.status === "pending" && <Clock className="size-4 text-muted-foreground" />}
                  <span className={`font-medium ${agent.status === 'pending' ? 'text-muted-foreground' : ''}`}>{agent.name}</span>
                </div>
                <Badge variant={agent.type === 'supervisor' ? 'default' : 'secondary'} className="text-[10px]">
                  {agent.type}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* CENTER PANEL: Live Agent Timeline */}
        <Card className="col-span-1 lg:col-span-2 border-primary/20 bg-background/50 backdrop-blur overflow-hidden flex flex-col h-[500px]">
          <CardHeader className="pb-3 shrink-0">
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <Cpu className="size-4 text-primary" />
                  Live Agent Timeline
                </CardTitle>
                <CardDescription className="text-xs">Real-time graph transitions and decisions.</CardDescription>
              </div>
              <Badge variant="outline" className="animate-pulse bg-emerald-500/10 text-emerald-500 border-emerald-500/20">{isDemoMode ? "DEMO STREAM" : "LIVE"}</Badge>
            </div>
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto pr-2 space-y-4 custom-scrollbar pb-4">
            {TIMELINE_EVENTS.map((ev, idx) => (
              <div key={ev.id} className="relative pl-6 pb-2">
                {/* Timeline line */}
                {idx !== TIMELINE_EVENTS.length - 1 && (
                  <div className="absolute left-[11px] top-6 bottom-[-16px] w-[2px] bg-border" />
                )}
                {/* Timeline dot */}
                <div className="absolute left-[7px] top-1.5 size-2.5 rounded-full bg-primary ring-4 ring-background" />

                <div className="rounded-lg border bg-card p-3 shadow-sm hover:border-primary/50 transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-[10px] uppercase font-mono">{ev.agent}</Badge>
                      <ChevronRight className="size-3 text-muted-foreground" />
                      <Badge variant="outline" className="text-[10px] uppercase font-mono text-primary border-primary/30 bg-primary/5">{ev.node}</Badge>
                    </div>
                    <span className="text-xs font-mono text-muted-foreground">{ev.timestamp}</span>
                  </div>
                  
                  <p className="text-sm font-medium mb-1">{ev.action}</p>
                  
                  <div className="flex flex-wrap gap-x-4 gap-y-2 mt-3 text-xs text-muted-foreground">
                    {ev.tool && (
                      <div className="flex items-center gap-1">
                        <Terminal className="size-3" /> Tool: <span className="text-foreground font-mono">{ev.tool}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1">
                      <Clock className="size-3" /> Runtime: <span className="text-foreground font-mono">{ev.runtime}</span>
                    </div>
                    <HoverCard>
                      <HoverCardTrigger asChild>
                        <div className="flex items-center gap-1 cursor-help border-b border-dashed border-muted-foreground/50">
                          <Activity className="size-3" /> Conf: <span className="text-foreground font-mono">{ev.confidence}</span>
                        </div>
                      </HoverCardTrigger>
                      <HoverCardContent className="w-60 text-xs">
                        LLM Confidence score based on tool output validation and prompt adherence.
                      </HoverCardContent>
                    </HoverCard>
                  </div>

                  <div className="mt-3 p-2 bg-muted/50 rounded text-xs border-l-2 border-primary">
                    <span className="font-semibold text-foreground/80">Result: </span>
                    {ev.result}
                  </div>

                  {/* JSON Payload Drawer Toggle */}
                  <div className="mt-2 flex justify-end">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-6 text-[10px] text-muted-foreground gap-1"
                      onClick={() => setExpandedEvent(expandedEvent === ev.id ? null : ev.id)}
                    >
                      <FileJson className="size-3" /> {expandedEvent === ev.id ? 'Hide Payload' : 'View Payload'} 
                      {expandedEvent === ev.id ? <ChevronUp className="size-3" /> : <ChevronDown className="size-3" />}
                    </Button>
                  </div>
                  
                  {expandedEvent === ev.id && (
                    <div className="mt-2 p-2 bg-black/90 dark:bg-black/40 rounded-md overflow-x-auto text-green-400 font-mono text-[10px] border border-primary/20">
                      <pre>{JSON.stringify(ev.payload, null, 2)}</pre>
                    </div>
                  )}

                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* RIGHT PANEL: Live Scan Progress */}
        <Card className="col-span-1 border-primary/20 bg-background/50 backdrop-blur h-[500px] flex flex-col">
          <CardHeader className="pb-3 shrink-0">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Activity className="size-4 text-primary" />
              Scan Progress
            </CardTitle>
            <CardDescription className="text-xs">Real-time asset discovery metrics.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-6 flex-1">
            
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-medium">
                <span>Overall Progress</span>
                <span className="text-primary font-mono">{data.scan ? "100%" : "28%"}</span>
              </div>
              <Progress value={data.scan ? 100 : 28} className="h-2" />
              <div className="text-[10px] text-muted-foreground text-right font-mono">{data.scan ? `Completed in ${data.scan.duration}` : "Est. Time Remaining: 38m 12s"}</div>
            </div>

            <div className="space-y-3">
              <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 border-b pb-1">Current Statistics</div>
              
              <div className="flex justify-between items-center bg-card p-2 rounded border shadow-sm">
                <div className="flex items-center gap-2">
                  <Database className="size-4 text-emerald-500" />
                  <span className="text-sm font-medium">Assets Mapped</span>
                </div>
                <span className="font-mono font-bold">{data.scan?.assetCount || 142}</span>
              </div>
              
              <div className="flex justify-between items-center bg-card p-2 rounded border shadow-sm">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="size-4 text-blue-500" />
                  <span className="text-sm font-medium">Certs Parsed</span>
                </div>
                <span className="font-mono font-bold">{data.scan?.certificateCount || 36}</span>
              </div>

              <div className="flex justify-between items-center bg-card p-2 rounded border shadow-sm">
                <div className="flex items-center gap-2">
                  <Binary className="size-4 text-purple-500" />
                  <span className="text-sm font-medium">Algorithms Found</span>
                </div>
                <span className="font-mono font-bold">{data.scan ? data.algorithms.length : 8}</span>
              </div>
              
              <div className="flex justify-between items-center bg-card p-2 rounded border shadow-sm border-amber-500/30">
                <div className="flex items-center gap-2">
                  <AlertCircle className="size-4 text-amber-500" />
                  <span className="text-sm font-medium">Secrets Exposed</span>
                </div>
                <span className="font-mono font-bold text-amber-500">{data.scan?.criticalSecrets || 2}</span>
              </div>

            </div>

          </CardContent>
        </Card>

      </div>

      {/* BOTTOM PANEL: Streaming Terminal */}
      <Card className="flex-1 min-h-[250px] border-primary/20 bg-black text-green-400 font-mono shadow-inner overflow-hidden flex flex-col rounded-lg">
        <div className="flex items-center justify-between px-4 py-2 border-b border-white/10 bg-black/60 shrink-0">
          <div className="flex items-center gap-2">
            <Terminal className="size-4 text-green-400" />
            <span className="text-xs font-semibold uppercase tracking-widest text-green-400/80">Agent Console Activity</span>
          </div>
          <div className="flex items-center gap-2">
             <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            <span className="text-[10px] text-green-400/60 uppercase">Streaming WebSocket</span>
          </div>
        </div>
        <div className="p-4 flex-1 overflow-y-auto text-[11px] leading-relaxed custom-scrollbar">
          {MOCK_LOGS.map((log, i) => (
            <div key={i} className="hover:bg-white/5 px-1 rounded transition-colors break-all">
              {log}
            </div>
          ))}
          {/* Blinking cursor */}
          <div className="inline-block w-2 h-3 bg-green-400 animate-pulse ml-1 mt-1" />
        </div>
      </Card>
      
    </div>
  )
}
