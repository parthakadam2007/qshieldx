"use client"

import * as React from "react"
import { Save, Sun, Moon, Monitor, KeyRound, Copy, Blocks, ShieldCheck, Clock, Activity, Settings2 } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { useGlobalData } from "@/app/context/GlobalDataContext"

export default function SettingsPage() {
  const { theme, setTheme } = useTheme()
  const { isDemoMode, setDemoMode, data } = useGlobalData()
  const [saved, setSaved] = React.useState(false)

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  React.useEffect(() => {
    document.title = "Settings | QShieldX"
  }, [])

  return (
    <div className="flex h-full flex-col gap-6 p-4 md:p-8 max-w-6xl mx-auto w-full animate-in fade-in duration-300">
      
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight flex items-center gap-2">
            <Settings2 className="size-6 text-primary" />
            Developer Console & Settings
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Configure platform behavior, API integrations, and cryptographic scanning engines.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {saved && <span className="text-sm text-emerald-500 font-medium">Settings saved</span>}
          <Button onClick={handleSave} className="gap-2">
            <Save className="size-4" /> Save Configuration
          </Button>
        </div>
      </div>

      <Tabs defaultValue="general" className="w-full flex-1">
        <TabsList className="grid w-full md:w-auto grid-cols-2 md:grid-cols-4 mb-6">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="scanning">Scanning Engines</TabsTrigger>
          <TabsTrigger value="risk">Risk Thresholds</TabsTrigger>
          <TabsTrigger value="api">API Keys & Integrations</TabsTrigger>
        </TabsList>

        {/* TAB 1: General */}
        <TabsContent value="general" className="space-y-6">
          <Card className="bg-background/50 backdrop-blur">
            <CardHeader>
              <CardTitle>Organization Details</CardTitle>
              <CardDescription>Manage your primary workspace settings.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Organization Name</label>
                <Input defaultValue={data.scan?.organization || "Razorpay Software Pvt. Ltd."} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Primary Domain</label>
                <Input defaultValue={data.scan?.primaryDomain || "razorpay.com"} />
              </div>
            </CardContent>
          </Card>

          <Card className="border-primary/30 bg-primary/5 backdrop-blur">
            <CardHeader>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <CardTitle className="flex items-center gap-2"><Activity className="size-5 text-primary" /> SIH Demo Mode</CardTitle>
                  <CardDescription>Run a deterministic enterprise scan using the Razorpay reference dataset.</CardDescription>
                </div>
                <button type="button" role="switch" aria-checked={isDemoMode} aria-label="Toggle SIH Demo Mode" onClick={() => setDemoMode(!isDemoMode)} className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${isDemoMode ? "bg-primary" : "bg-muted"}`}>
                  <span className={`absolute top-1 size-4 rounded-full bg-white transition-transform ${isDemoMode ? "left-6" : "left-1"}`} />
                </button>
              </div>
            </CardHeader>
            <CardContent className="flex flex-wrap items-center gap-3 text-xs">
              <Badge variant={isDemoMode ? "default" : "outline"}>{isDemoMode ? "Active" : "Off"}</Badge>
              <span className="text-muted-foreground">{isDemoMode ? `${data.scan?.organization} • ${data.scan?.id}` : "Production scanners enabled"}</span>
            </CardContent>
          </Card>

          <Card className="bg-background/50 backdrop-blur">
            <CardHeader>
              <CardTitle>Appearance</CardTitle>
              <CardDescription>Customize the QShieldX dashboard interface.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4">
                <Button variant={theme === "light" ? "default" : "outline"} onClick={() => setTheme("light")} className="w-32 justify-start gap-2">
                  <Sun className="size-4" /> Light
                </Button>
                <Button variant={theme === "dark" ? "default" : "outline"} onClick={() => setTheme("dark")} className="w-32 justify-start gap-2">
                  <Moon className="size-4" /> Dark
                </Button>
                <Button variant={theme === "system" ? "default" : "outline"} onClick={() => setTheme("system")} className="w-32 justify-start gap-2">
                  <Monitor className="size-4" /> System
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB 2: Scanning */}
        <TabsContent value="scanning" className="space-y-6">
          <Card className="bg-background/50 backdrop-blur">
            <CardHeader>
              <CardTitle>Discovery Engine Configuration</CardTitle>
              <CardDescription>Enable or disable specific modules for the QShieldX autonomous agents.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Default Scan Frequency</label>
                <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary">
                  <option>Continuous Background Scanning</option>
                  <option>Daily at Midnight (UTC)</option>
                  <option>Weekly on Sunday</option>
                  <option>Manual Trigger Only</option>
                </select>
              </div>

              <div className="space-y-4 pt-4 border-t">
                <h3 className="text-sm font-semibold flex items-center gap-2"><Blocks className="size-4 text-primary" /> Core Engines</h3>
                
                <div className="flex items-center space-x-3 border rounded-md p-4 bg-card/50">
                  <input type="checkbox" className="size-4 accent-primary" defaultChecked />
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">Subfinder & Nmap TLS Discovery</span>
                    <span className="text-xs text-muted-foreground">Enumerate subdomains and crawl for TLS endpoints and certificates.</span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 border rounded-md p-4 bg-card/50">
                  <input type="checkbox" className="size-4 accent-primary" defaultChecked />
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">GitLeaks Secrets Scanner</span>
                    <span className="text-xs text-muted-foreground">Scan repositories for hardcoded cryptographic keys and tokens.</span>
                  </div>
                </div>

                <div className="flex items-center space-x-3 border rounded-md p-4 bg-card/50">
                  <input type="checkbox" className="size-4 accent-primary" defaultChecked />
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">Semgrep Cryptography Auditing</span>
                    <span className="text-xs text-muted-foreground">Static analysis for deprecated cryptographic primitives in source code.</span>
                  </div>
                </div>
              </div>

            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB 3: Risk Thresholds */}
        <TabsContent value="risk" className="space-y-6">
          <Card className="bg-background/50 backdrop-blur">
            <CardHeader>
              <CardTitle>Enterprise Risk Tolerances</CardTitle>
              <CardDescription>Configure how vulnerability urgency is calculated for your dashboards.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              
              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm font-medium">
                  <span className="flex items-center gap-2"><Clock className="size-4 text-destructive" /> Mosca Theorem Alert Threshold (Years)</span>
                  <span className="font-mono bg-muted px-2 py-1 rounded">7 Years</span>
                </div>
                <input type="range" min="0" max="10" defaultValue="7" className="w-full accent-destructive h-2 bg-muted rounded-lg appearance-none cursor-pointer" />
                <p className="text-xs text-muted-foreground">Alert when (Shelf Life + Migration Time) is within this many years of Q-Day.</p>
              </div>

              <div className="space-y-2 pt-4 border-t">
                <div className="flex justify-between items-center text-sm font-medium">
                  <span className="flex items-center gap-2"><ShieldCheck className="size-4 text-amber-500" /> Certificate Expiry Warning (Days)</span>
                  <span className="font-mono bg-muted px-2 py-1 rounded">90 Days</span>
                </div>
                <input type="range" min="0" max="90" defaultValue="90" className="w-full accent-amber-500 h-2 bg-muted rounded-lg appearance-none cursor-pointer" />
                <p className="text-xs text-muted-foreground">Mark assets as 'Warning' when certificates expire within this window.</p>
              </div>

            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB 4: API Keys */}
        <TabsContent value="api" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <Card className="bg-background/50 backdrop-blur">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">OpenAI Integration</CardTitle>
                    <CardDescription>Required for executive summary generation.</CardDescription>
                  </div>
                  <Badge variant="outline" className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20">Connected</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-medium">API Key</label>
                  <Input type="password" defaultValue="sk-proj-***************************" disabled />
                </div>
                <Button variant="outline" size="sm" className="w-full">Update Key</Button>
              </CardContent>
            </Card>

            <Card className="bg-background/50 backdrop-blur">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">Supabase Backend</CardTitle>
                    <CardDescription>Data persistence and real-time sockets.</CardDescription>
                  </div>
                  <Badge variant="outline" className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20">Connected</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-medium">Project URL</label>
                  <Input defaultValue="https://qwuoaiomlomdqaqbmvlv.supabase.co" disabled />
                </div>
                <Button variant="outline" size="sm" className="w-full">Manage in Supabase</Button>
              </CardContent>
            </Card>

            <Card className="bg-background/50 backdrop-blur md:col-span-2">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">Model Context Protocol (MCP)</CardTitle>
                    <CardDescription>Future integration for QShieldX subagents.</CardDescription>
                  </div>
                  <Badge variant="secondary">Coming Soon</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="p-4 bg-muted/50 rounded text-sm text-muted-foreground border">
                  MCP Server configuration will allow local LLMs to securely execute cryptographic discovery tools on your infrastructure.
                </div>
              </CardContent>
            </Card>

          </div>
        </TabsContent>

      </Tabs>
    </div>
  )
}
