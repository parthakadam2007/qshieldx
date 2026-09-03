// OOP: Encapsulation — This component encapsulates target detail view and interaction logic.
// OOP: Composition — Composes tabs, chat interface, and scan controls to create a comprehensive target management view.

"use client"

import * as React from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import {
  Building2, Globe, Activity, Server, Target, CornerDownRight, Network,
  Terminal, Bot, Send, HardDrive, ListEnd, Clock,
  AlertTriangle,
  PlayIcon,
  Trash2,
  FileText,
  Download,
  Loader2
} from "lucide-react"
import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { useGlobalData } from "@/app/context/GlobalDataContext"
import { Play } from "next/font/google"

import { Progress } from "@/components/ui/progress"
import { useUser } from "@/hooks/useUser"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Zap, Search, ShieldAlert } from "lucide-react"
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

export default function TargetDetailPage() {
  const { user } = useUser()
  const userRole = user?.user_metadata?.role
  const canRunScan = Boolean(user) && userRole !== "customer"
  const params = useParams()
  const router = useRouter()
  const targetId = params.id as string
  const { data, refreshData } = useGlobalData()

  // Find target from live context
  const rawTarget = data.targets.find(t => String(t._id || t.id) === targetId)
  const targetName = rawTarget ? (rawTarget.organizationName || rawTarget.name) : "Target Details";

  React.useEffect(() => {
    if (targetName) {
      document.title = `${targetName} - Intelligence | Qshield Dashboard`;
    }
  }, [targetName]);

  // Simulation state for the interactive Agent Chat / Logs
  const [chatMessages, setChatMessages] = React.useState([
    { role: 'agent', content: "Initializing discovery pipeline...", type: "log" },
    { role: 'agent', content: "Ready for operations. Describe reconnaissance goal.", type: "chat" }
  ]);
  const [chatInput, setChatInput] = React.useState("");
  const scrollRef = React.useRef<HTMLDivElement>(null);

  // Scan status and progress
  const [isScanning, setIsScanning] = React.useState(false);
  const [scanMode, setScanMode] = React.useState("fast");
  const [scanElapsed, setScanElapsed] = React.useState(0);
  const [simulatedProgress, setSimulatedProgress] = React.useState(0);
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [isGeneratingReport, setIsGeneratingReport] = React.useState(false);

  const handleDeleteTarget = async () => {
    if (!window.confirm("Are you sure you want to PERMANENTLY remove this target and all its associated scan results?")) {
      return;
    }

    setIsDeleting(true);
    try {
      const resp = await fetch(`/api/targets/${targetId}`, { method: 'DELETE' });
      if (resp.ok) {
        setChatMessages(prev => [...prev, { role: 'agent', content: "Target deletion sequence complete. Purged all records.", type: 'log' }]);
        // Brief delay for the log to show before redirecting
        setTimeout(() => {
          router.push("/targets");
        }, 1000);
      } else {
        alert("Failed to delete target.");
        setIsDeleting(false);
      }
    } catch (err) {
      console.error(err);
      alert("Error deleting target.");
      setIsDeleting(false);
    }
  };

  React.useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isScanning) {
      const startTime = Date.now();
      interval = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTime) / 1000);
        setScanElapsed(elapsed);

        // Simulated progress: fast at first, then slow, capped at 99%
        setSimulatedProgress(prev => {
          if (prev < 30) return prev + 1;
          if (prev < 70) return prev + 0.5;
          if (prev < 99) return prev + 0.1;
          return prev;
        });
      }, 1000);
    } else {
      setScanElapsed(0);
      setSimulatedProgress(0);
    }
    return () => clearInterval(interval);
  }, [isScanning]);

  React.useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chatMessages, data]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const newMsg = { role: 'user', content: chatInput, type: 'chat' };
    setChatMessages(prev => [...prev, newMsg]);
    setChatInput("");

    // Optimistic UI updates - Analysis focused, not scanning focused
    setChatMessages(prev => [
      ...prev,
      { role: 'agent', content: `Analyzing target context and preparing intelligence response...`, type: 'log' }
    ]);

    // We don't set isScanning to true here because chatting is an analytical query, 
    // not a long-running reconnaissance scan with progress bars.
    try {
      // Gather current intelligence context to pass to the AI
      const context = {
        target: {
          name: target.organizationName,
          domain: target.primaryDomain
        },
        assets: targetAssets.map(a => ({ name: a.subdomain || a.name, ip: a.ip })),
        ports: targetPorts.map(p => ({ port: p.portNumber, protocol: p.protocol, service: p.service })),
        services: targetServices.map(s => ({ name: s.name, version: s.version, port: s.port }))
      };

      const resp = await fetch('/api/agent/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: newMsg.content,
          targetId: targetId,
          context: context
        })
      });

      if (resp.ok) {
        const result = await resp.json();

        if (result.response) {
          setChatMessages(prev => [
            ...prev,
            { role: 'agent', content: result.response, type: "chat" }
          ]);
        } else if (result.rawText) {
          setChatMessages(prev => [
            ...prev,
            { role: 'agent', content: result.rawText, type: "chat" }
          ]);
        }
      } else {
        setChatMessages(prev => [...prev, { role: 'agent', content: "Failed to reach intelligence analyst service.", type: "log" }]);
      }
    } catch (e) {
      setChatMessages(prev => [...prev, { role: 'agent', content: "Network error engaging intelligence analyst.", type: "log" }]);
    } finally {
      setIsScanning(false);
    }
  }

  const handleRunRecon = async () => {
    if (!canRunScan) {
      setChatMessages(prev => [
        ...prev,
        { role: 'agent', content: "Scan blocked: please login with an admin/analyst account.", type: 'log' }
      ]);
      return;
    }

    // Add messages to the terminal to show the button click triggered the action
    setChatMessages(prev => [
      ...prev,
      { role: 'user', content: 'Execute Full OSINT Reconnaissance', type: 'chat' },
      { role: 'agent', content: `Acknowledged. Engaging AI pipeline for full target scan...`, type: 'log' }
    ]);

    setIsScanning(true);
    try {
      const resp = await fetch('/api/agent/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: 'Execute Full OSINT Reconnaissance', targetId: targetId, mode: scanMode })
      });

      if (resp.ok) {
        const result = await resp.json();
        const stats = result.stats || {};
        const assetsFound = stats.assets ?? 0;
        const portsFound = stats.ports ?? 0;
        const servicesFound = stats.services ?? 0;

        setChatMessages(prev => [
          ...prev,
          {
            role: 'agent',
            content: `Reconnaissance OSINT pipeline complete. Stored ${assetsFound} assets, ${portsFound} ports, ${servicesFound} services.`,
            type: "log"
          },
          ...(assetsFound === 0
            ? [{
                role: 'agent',
                content: `Scan finished but returned zero assets. This usually means the backend OSINT pipeline did not discover any eligible subdomains/hosts or the required tools were unavailable.`,
                type: "log"
              }]
            : [])
        ]);

        await refreshData();
      } else {
        let detail = "Agent backend failed to complete OSINT process."
        try {
          const body = await resp.json()
          detail = body?.error || body?.detail || detail
        } catch {
          // no-op: keep default detail
        }
        setChatMessages(prev => [...prev, { role: 'agent', content: `Scan failed (${resp.status}): ${detail}`, type: "log" }]);
      }
    } catch {
      setChatMessages(prev => [...prev, { role: 'agent', content: "Failed to reach AI pipeline.", type: "log" }]);
    } finally {
      setIsScanning(false);
    }
  }

  if (!rawTarget) {
    return (
      <div className="flex h-full items-center justify-center p-8">
        <div className="max-w-md text-center bg-card border border-muted p-8 rounded-xl shadow-lg">
          <Terminal className="size-10 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2 tracking-tight">Target Not Found</h2>
          <p className="text-muted-foreground mb-6">The infrastructure mapped to ID {targetId} could not be located in the current database.</p>
          <Button asChild><Link href="/targets">Return to Targets List</Link></Button>
        </div>
      </div>
    )
  }

  // Gracefully conform MongoDB object to UI requirements
  const target = {
    ...rawTarget,
    organizationName: rawTarget.organizationName || rawTarget.name || "Unknown Target",
    primaryDomain: rawTarget.domain || rawTarget.primaryDomain || "unknown.com",
  };

  // Derive live counts from global data relationships strictly scoped to this target! 
  // No dummy data overlays here!
  const targetAssets = data.assets.filter(a => String(a.targetId) === String(targetId));
  const targetPorts = data.ports.filter(p => String(p.targetId) === String(targetId));
  const targetServices = data.services.filter(s => String(s.targetId) === String(targetId));

  const handleGenerateReport = async () => {
    setIsGeneratingReport(true);
    try {
      // 1. Get AI Summary for the report
      const context = {
        target: { name: target.organizationName, domain: target.primaryDomain },
        assets: targetAssets.map(a => ({ name: a.subdomain || a.name, ip: a.ip })),
        ports: targetPorts.map(p => ({ port: p.portNumber, protocol: p.protocol, service: p.service })),
        services: targetServices.map(s => ({ name: s.name, version: s.version, port: s.port }))
      };

      const aiResp = await fetch('/api/agent/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: "Generate a professional executive summary for a security reconnaissance report. Focus on the overall attack surface and key findings. Keep it to 2-3 paragraphs.",
          targetId: targetId,
          context: context
        })
      });

      let aiSummary = "Intelligence analyst response unavailable at this time.";
      if (aiResp.ok) {
        const result = await aiResp.json();
        aiSummary = result.response || result.rawText || aiSummary;
      }

      // 2. Initialize PDF
      const doc = new jsPDF() as any;
      const timestamp = new Date().toLocaleString();

      // Header
      doc.setFontSize(22);
      doc.setTextColor(40, 40, 40);
      doc.text("Security Reconnaissance Report", 14, 22);

      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.text(`Generated on: ${timestamp}`, 14, 30);

      // Target Details
      doc.setFontSize(14);
      doc.setTextColor(0, 0, 0);
      doc.text("Target Information", 14, 45);
      doc.setLineWidth(0.5);
      doc.line(14, 47, 60, 47);

      doc.setFontSize(11);
      doc.text(`Organization: ${target.organizationName}`, 14, 55);
      doc.text(`Primary Domain: ${target.primaryDomain}`, 14, 62);
      doc.text(`Status: ${target.status || 'Active'}`, 14, 69);

      // AI Summary
      doc.setFontSize(14);
      doc.text("Executive Summary", 14, 85);
      doc.setLineWidth(0.5);
      doc.line(14, 87, 60, 87);

      doc.setFontSize(10);
      const splitText = doc.splitTextToSize(aiSummary, 180);
      doc.text(splitText, 14, 95);

      // Assets Table
      doc.addPage();
      doc.setFontSize(14);
      doc.text("Discovered Assets", 14, 22);

      const assetData = targetAssets.map(a => [
        a.subdomain || a.name || 'N/A',
        a.ip || 'Pending...',
        'Active'
      ]);

      autoTable(doc, {
        startY: 28,
        head: [['Subdomain / Host', 'IP Address', 'Status']],
        body: assetData,
        theme: 'grid',
        headStyles: { fillColor: [63, 81, 181] }
      });

      // Services Table
      const finalY = (doc as any).lastAutoTable.finalY || 30;
      doc.setFontSize(14);
      doc.text("Network Services & Exposure", 14, finalY + 15);

      const serviceData = targetServices.map(s => [
        s.name,
        `${s.port}/${s.protocol}`,
        s.version || 'Detected',
        s.riskScore || 'Low'
      ]);

      autoTable(doc, {
        startY: finalY + 20,
        head: [['Service', 'Port/Proto', 'Version', 'Risk Level']],
        body: serviceData,
        theme: 'striped',
        headStyles: { fillColor: [33, 33, 33] }
      });

      // Save
      doc.save(`Security_Report_${target.organizationName.replace(/\s+/g, '_')}.pdf`);

    } catch (error) {
      console.error("Report generation failed:", error);
      alert("Failed to generate PDF report.");
    } finally {
      setIsGeneratingReport(false);
    }
  };

  return (
    <div className="flex h-full flex-col gap-6 p-4 md:p-8 max-w-[1600px] mx-auto w-full">

      {/* 1. Header: Live Summary and Info */}
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between bg-card border rounded-lg p-6 shadow-sm">
        <div className="flex gap-5 items-center">
          <div className="p-4 bg-primary/10 rounded-xl border border-primary/20 shadow-inner">
            <Building2 className="size-8 text-primary" />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-extrabold tracking-tight">{target.organizationName}</h1>
              <Badge variant="outline" className={`gap-1.5 px-2.5 py-0.5 ${target.status === "Scanning" || isScanning ? "text-amber-500 border-amber-500/30 bg-amber-500/10" : "text-emerald-500 border-emerald-500/30 bg-emerald-500/10"
                }`}>
                <span className="relative flex h-2 w-2">
                  <span className={`absolute inline-flex h-full w-full rounded-full opacity-75 ${target.status === "Scanning" || isScanning ? "animate-ping bg-amber-400" : "bg-emerald-400"
                    }`}></span>
                  <span className={`relative inline-flex rounded-full h-2 w-2 ${target.status === "Scanning" || isScanning ? "bg-amber-500" : "bg-emerald-500"
                    }`}></span>
                </span>
                {target.status === "Scanning" || isScanning ? "Agent Scanning..." : "Agent Active"}
              </Badge>
            </div>
            <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground font-medium">
              <span className="flex items-center gap-1.5"><Globe className="size-4" /> {target.primaryDomain}</span>
              <span className="hidden md:inline text-muted-foreground/30">•</span>
              <span className="flex items-center gap-1.5 font-mono text-xs">ID: {targetId}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {canRunScan && (
            <div className="flex items-center gap-2">
              <Select value={scanMode} onValueChange={setScanMode}>
                <SelectTrigger className="w-[130px] h-9 bg-muted/50 border-muted text-xs font-bold uppercase tracking-tight">
                  <SelectValue placeholder="Mode" />
                </SelectTrigger>
                <SelectContent className="bg-card border-border">
                  <SelectItem value="fast" className="text-xs font-bold uppercase tracking-tight">
                    <div className="flex items-center gap-2">
                      <Zap className="size-3 text-amber-500" /> Fast
                    </div>
                  </SelectItem>
                  <SelectItem value="medium" className="text-xs font-bold uppercase tracking-tight">
                    <div className="flex items-center gap-2">
                      <Search className="size-3 text-primary" /> Medium
                    </div>
                  </SelectItem>
                  <SelectItem value="deep" className="text-xs font-bold uppercase tracking-tight">
                    <div className="flex items-center gap-2">
                      <ShieldAlert className="size-3 text-emerald-500" /> Deep
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={handleRunRecon} size="sm" className="gap-2 bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20" disabled={isScanning || isDeleting}>
                <PlayIcon className="size-4" /> Vulnerability Scan
              </Button>
              <Button
                onClick={handleDeleteTarget}
                variant="outline"
                size="sm"
                className="gap-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 border-muted"
                disabled={isScanning || isDeleting}
              >
                <Trash2 className={`size-4 ${isDeleting ? 'animate-pulse' : ''}`} />
                {isDeleting ? 'Deleting...' : 'Delete'}
              </Button>
            </div>
          )}
          <Button
            variant="outline"
            className="gap-2 hidden md:flex"
            onClick={handleGenerateReport}
            disabled={isGeneratingReport}
          >
            {isGeneratingReport ? <Loader2 className="size-4 animate-spin" /> : <FileText className="size-4" />}
            {isGeneratingReport ? "Generating..." : "Generate Report"}
          </Button>
          <Button variant="outline" className="gap-2 hidden md:flex" asChild>
            <Link href="/assets">
              <Server className="size-4" /> View Asset Logs
            </Link>
          </Button>
        </div>
        {/* Live Counter Dashboard */}
        <div className="flex gap-3 overflow-x-auto pb-2 md:pb-0">
          <div className="flex flex-col justify-center items-center px-6 py-2 bg-muted/30 border rounded-lg min-w mt-2">
            <span className="text-2xl font-black tabular-nums text-foreground">{targetAssets.length}</span>
            <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider flex items-center gap-1"><Server className="size-3" /> Assets Discovered</span>
          </div>
          <div className="flex flex-col justify-center items-center px-6 py-2 bg-muted/30 border rounded-lg mt-2">
            <span className="text-2xl font-black tabular-nums text-foreground">{targetPorts.length}</span>
            <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider flex items-center gap-1"><Network className="size-3" /> Open Ports</span>
          </div>
          <div className="flex flex-col justify-center items-center px-6 py-2 bg-muted/30 border rounded-lg mt-2">
            <span className="text-2xl font-black tabular-nums text-foreground">{targetServices.length}</span>
            <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider flex items-center gap-1"><HardDrive className="size-3" /> Services Detected</span>
          </div>
        </div>
      </div>

      {/* 1.1 Live Scanning Progress (Only visible during scan) */}
      {isScanning && (
        <div className="bg-card/50 backdrop-blur border border-primary/20 rounded-lg p-5 shadow-inner animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-3">
              <div className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
              </div>
              <p className="text-sm font-semibold tracking-tight uppercase">AI Reconnaissance Pipeline in Progress...</p>
            </div>
            <div className="flex items-center gap-6 font-mono text-sm bg-background/50 px-4 py-1.5 rounded-full border border-muted shadow-sm">
              <div className="flex items-center gap-2">
                <Clock className="size-4 text-primary animate-pulse" />
                <span className="text-muted-foreground">Elapsed:</span>
                <span className="font-bold text-foreground w-12 text-right">{Math.floor(scanElapsed / 60)}:{String(scanElapsed % 60).padStart(2, '0')}</span>
              </div>
              <div className="h-4 w-px bg-muted px-0" />
              <div className="flex items-center gap-2">
                <Activity className="size-4 text-emerald-500" />
                <span className="text-muted-foreground text-xs uppercase font-bold tracking-widest">Active</span>
              </div>
            </div>
          </div>
          <Progress value={simulatedProgress} className="h-2 bg-muted shadow-inner" />
          <div className="flex justify-between mt-2">
            <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-tighter">Engaging: Subfinder / Amass / HTTPX / Wayback</p>
            <p className="text-[10px] text-primary font-bold uppercase tracking-tighter animate-pulse">{Math.round(simulatedProgress)}% Processed</p>
          </div>
        </div>
      )}

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0">

        {/* Left Column: Dynamic Sections */}
        <div className="lg:col-span-2 flex flex-col h-[750px] bg-card border rounded-lg shadow-sm overflow-hidden">
          <Tabs defaultValue="subdomains" className="flex flex-col w-full h-full">
            <div className="border-b px-4 py-3 bg-muted/10 overflow-x-auto">
              <TabsList className="bg-muted/50 border flex w-max h-auto">
                <TabsTrigger value="subdomains" className="gap-2 shrink-0"><Globe className="size-4" /> Found Subdomains</TabsTrigger>
                <TabsTrigger value="ports" className="gap-2 shrink-0"><Network className="size-4" /> Open Ports</TabsTrigger>
                <TabsTrigger value="services" className="gap-2 shrink-0"><Server className="size-4" /> Services</TabsTrigger>
                <TabsTrigger value="history" className="gap-2 shrink-0"><Clock className="size-4" /> History</TabsTrigger>
              </TabsList>
            </div>

            <div className="flex-1 overflow-y-auto p-4 bg-dot-black/[0.1] dark:bg-dot-white/[0.1]">

              <TabsContent value="subdomains" className="m-0 h-full">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {targetAssets.map((asset, i) => (
                    <Link
                      key={i}
                      href={`/assets/${asset._id || asset.id}`}
                      className="flex flex-col p-4 bg-background border rounded-lg shadow-sm hover:border-primary/50 hover:shadow-md transition-all group"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-semibold text-sm tracking-tight group-hover:text-primary transition-colors">
                          {asset.subdomain || asset.deviceName || asset.name || `host-${i}.${target.primaryDomain}`}
                        </span>
                        <Badge variant="outline" className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 text-[10px]">Alive</Badge>
                      </div>
                      <span className="font-mono text-xs text-muted-foreground mb-3">{asset.ip || "Pending..."}</span>
                      <div className="mt-auto flex items-center gap-2 text-xs text-muted-foreground pt-3 border-t">
                        <CornerDownRight className="size-3" /> Source: AI Agent Scan
                      </div>
                    </Link>
                  ))}
                  {targetAssets.length === 0 && (
                    <div className="col-span-full py-12 text-center text-muted-foreground border-2 border-dashed rounded-lg bg-background/50">
                      {isScanning || target.status === "Scanning"
                        ? "Scanning in progress. Waiting for subdomains..."
                        : "No discovered subdomains yet. If the scan completed with zero results, verify the backend pipeline and installed OSINT tools."
                      }
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="ports" className="m-0 h-full">
                <div className="rounded-md border bg-background overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-muted/30 text-xs uppercase text-muted-foreground">
                      <tr>
                        <th className="px-4 py-3 font-medium">Node IP</th>
                        <th className="px-4 py-3 font-medium">Port</th>
                        <th className="px-4 py-3 font-medium">Service</th>
                        <th className="px-4 py-3 font-medium text-right">State</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {targetPorts.map((port, i) => (
                        <tr key={i} className="hover:bg-muted/20 transition-colors">
                          <td className="px-4 py-3">
                            <div className="flex flex-wrap gap-1">
                              {port.assets?.slice(0, 2).map((a: any, idx: number) => (
                                <Link key={idx} href={`/assets/${a.id || a._id}`}>
                                  <Badge variant="secondary" className="text-[10px] py-0 cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors">
                                    {a.name}
                                  </Badge>
                                </Link>
                              )) || "N/A"}
                              {(port.assets?.length || 0) > 2 && <Badge variant="outline" className="text-[10px] py-0">+{port.assets.length - 2} more</Badge>}
                            </div>
                          </td>
                          <td className="px-4 py-3 font-bold">{port.portNumber || port.port} <span className="text-xs font-normal text-muted-foreground uppercase ml-1">{port.protocol}</span></td>
                          <td className="px-4 py-3 font-medium">{port.service || port.description || "Unidentified"}</td>
                          <td className="px-4 py-3 text-right">
                            <Badge variant="outline" className={port.state === 'open' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-destructive/10 text-destructive border-destructive/20'}>
                              {port.state || "open"}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                      {targetPorts.length === 0 && (
                        <tr>
                          <td colSpan={4} className="px-4 py-8 text-center text-muted-foreground italic">No open ports discovered yet.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </TabsContent>

              <TabsContent value="services" className="m-0 h-full">
                <div className="rounded-md border bg-background overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-muted/30 text-xs uppercase text-muted-foreground">
                      <tr>
                        <th className="px-4 py-3 font-medium">Service Name</th>
                        <th className="px-4 py-3 font-medium">Discovery</th>
                        <th className="px-4 py-3 font-medium">Version</th>
                        <th className="px-4 py-3 font-medium text-right">Risk</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {targetServices.map((service, i) => (
                        <tr key={i} className="hover:bg-muted/20 transition-colors">
                          <td className="px-4 py-3 font-bold">{service.name}</td>
                          <td className="px-4 py-3 font-mono text-xs">
                            {service.port}/{service.protocol}
                            <div className="flex gap-1 mt-1">
                              {service.assets?.map((asset: any, index: number) => (
                                <Link key={`${asset.id}-${index}`} href={`/assets/${asset.id}`}>
                                  <Badge variant="outline" className="text-[9px] px-1 h-4 cursor-pointer hover:bg-muted transition-colors">
                                    {asset.name}
                                  </Badge>
                                </Link>
                              ))}
                            </div>
                          </td>
                          <td className="px-4 py-3">{service.version || "Detected"}</td>
                          <td className="px-4 py-3 text-right">
                            <Badge className="bg-primary/10 text-primary border-primary/20">{service.riskScore || "Low"}</Badge>
                          </td>
                        </tr>
                      ))}
                      {targetServices.length === 0 && (
                        <tr>
                          <td colSpan={4} className="px-4 py-8 text-center text-muted-foreground italic">No services identified yet.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </TabsContent>

              <TabsContent value="history" className="m-0 h-full">
                <div className="space-y-3">
                  <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg flex gap-3 text-amber-500 items-start">
                    <AlertTriangle className="size-5 shrink-0" />
                    <div className="text-sm">
                      <p className="font-bold">Historical Data Gathering</p>
                      <p className="opacity-90 mt-1">Wayback Machine and AlienVault queries have been queued. The agent is analyzing archived URL parameters.</p>
                    </div>
                  </div>
                  <Card className="bg-background shadow-sm border-dashed">
                    <CardContent className="py-8 flex flex-col items-center justify-center text-center">
                      <ListEnd className="size-8 text-muted-foreground mb-3 opacity-50" />
                      <p className="text-sm font-medium">Synchronizing with historical archives...</p>
                      <p className="text-xs text-muted-foreground mt-1 max-w-sm">
                        As the agent uncovers URLs like /api/v1/auth?token= from historical sources, they will populate here dynamically.
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

            </div>
          </Tabs>
        </div>

        {/* Right Column: Interactive Agent Terminal */}
        <div className="flex flex-col h-[750px] bg-card border rounded-lg shadow-xl overflow-hidden text-foreground">
          <div className="flex items-center justify-between px-4 py-3 bg-muted/30 border-b">
            <div className="flex items-center gap-2">
              <Bot className="size-5 text-primary" />
              <h3 className="font-semibold text-sm tracking-tight">Agent Operations Console</h3>
            </div>
            <Badge variant="secondary" className="bg-muted text-muted-foreground border-border text-[10px] font-mono">Live Session</Badge>
          </div>

          {/* Feed List */}
          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-4 space-y-4 font-mono text-sm"
          >
            {chatMessages.map((msg, i) => (
              <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}>
                {msg.role === 'agent' && (
                  <div className={`mt-1 shrink-0 size-6 rounded flex items-center justify-center ${msg.type === 'log' ? 'bg-muted text-muted-foreground' : 'bg-primary/20 text-primary border border-primary/30'}`}>
                    {msg.type === 'log' ? <Terminal className="size-3" /> : <Bot className="size-3" />}
                  </div>
                )}
                <div className={`flex flex-col ${msg.role === 'user' ? 'items-end' : ''} max-w-[85%]`}>
                  {msg.role === 'agent' && <span className="text-[10px] text-muted-foreground mb-1">{msg.type === 'log' ? 'SYSTEM PROCESS' : 'AGENT REPLY'}</span>}

                  <div className={`
                    px-3 py-2 rounded-lg 
                    ${msg.role === 'user'
                      ? 'bg-primary text-primary-foreground font-sans text-sm shadow-md'
                      : msg.type === 'log'
                        ? 'bg-muted/50 border border-muted text-muted-foreground text-xs'
                        : 'bg-muted border border-border text-foreground text-sm font-sans prose prose-sm dark:prose-invert max-w-none'
                    }
                  `}>
                    {msg.type === 'log' && <span className="text-emerald-500 mr-2">➜</span>}
                    {msg.role === 'agent' && msg.type === 'chat' ? (
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                          table: ({ node, ...props }) => <div className="overflow-x-auto my-2"><table className="border-collapse border border-muted-foreground/20 w-full" {...props} /></div>,
                          th: ({ node, ...props }) => <th className="border border-muted-foreground/20 px-2 py-1 bg-muted/50" {...props} />,
                          td: ({ node, ...props }) => <td className="border border-muted-foreground/20 px-2 py-1" {...props} />,
                          code: ({ node, ...props }) => <code className="bg-muted-foreground/10 px-1 rounded font-mono text-xs" {...props} />,
                          a: ({ node, ...props }) => <a className="text-primary underline hover:text-primary/80" {...props} />,
                          p: ({ node, ...props }) => <p className="mb-2 last:mb-0" {...props} />,
                          ul: ({ node, ...props }) => <ul className="list-disc ml-4 mb-2" {...props} />,
                          ol: ({ node, ...props }) => <ol className="list-decimal ml-4 mb-2" {...props} />
                        }}
                      >
                        {msg.content}
                      </ReactMarkdown>
                    ) : (
                      msg.content
                    )}
                  </div>
                </div>
              </div>
            ))}
            {/* Pulsing indicator for active agent */}
            <div className="flex gap-3 opacity-50">
              <div className="mt-1 shrink-0 size-6 rounded bg-muted text-muted-foreground flex items-center justify-center animate-pulse">
                <Terminal className="size-3" />
              </div>
              <div className="px-3 py-2 rounded-lg bg-muted/50 border border-muted text-muted-foreground text-xs w-2/3">
                <span className="text-emerald-500 mr-2 animate-pulse">_</span>
              </div>
            </div>
          </div>

          {/* Chat Input */}
          <div className="p-3 bg-muted/30 border-t">
            <form onSubmit={handleSendMessage} className="relative flex items-center">
              <Terminal className="absolute left-3 size-4 text-muted-foreground" />
              <Input
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Instruct agent (e.g. 'Re-scan open ports')"
                className="w-full bg-background border-muted text-foreground placeholder:text-muted-foreground/50 pl-9 pr-12 focus-visible:ring-primary focus-visible:ring-1 focus-visible:border-primary shadow-inner"
              />
              <Button
                type="submit"
                size="icon"
                variant="ghost"
                className="absolute right-1 size-8 hover:bg-muted hover:text-foreground text-muted-foreground"
                disabled={!chatInput.trim()}
              >
                <Send className="size-4" />
              </Button>
            </form>
            <p className="text-[10px] text-center text-muted-foreground mt-2 font-sans">Everything updates dynamically. Chat & Log streams synced.</p>
          </div>
        </div>

      </div>

    </div>
  )
}
