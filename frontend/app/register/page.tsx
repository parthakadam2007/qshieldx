// OOP: Encapsulation — This component encapsulates registration form state and validation.
// OOP: Abstraction — Offers a simple registration interface while hiding form submission and routing logic.

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Bot, User, Mail, Lock, Shield, ArrowRight, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("customer");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const resp = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name, role }),
      });

      if (resp.ok) {
        router.push("/login");
      } else {
        const data = await resp.json();
        setError(data.error || "Registration initialization failed.");
      }
    } catch (err) {
      setError("An unexpected network error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background p-4 relative overflow-hidden">
      {/* Dynamic Background Elements */}
      <div className="absolute inset-0 bg-grid-slate-900/[0.04] dark:bg-grid-white/[0.02] pointer-events-none"></div>
      <div className="absolute inset-0 flex items-center justify-center bg-background [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)] pointer-events-none"></div>
      <div className="absolute top-0 -left-4 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-0 -right-4 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse delay-700"></div>

      <Card className="w-full max-w-md border-border bg-card/50 backdrop-blur-xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500 relative z-10">
        <div className="h-1.5 w-full bg-gradient-to-r from-emerald-500 via-primary to-emerald-500/50"></div>
        <CardHeader className="space-y-1 text-center pt-8">
          <div className="flex justify-center mb-4">
            <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]">
              <Shield className="size-10 text-emerald-500" />
            </div>
          </div>
          <CardTitle className="text-3xl font-black tracking-tight text-foreground uppercase tracking-tighter">Request Clearance</CardTitle>
          <CardDescription className="text-muted-foreground font-medium tracking-tight">Initialize your operative profile in the network</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6 pt-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive" className="bg-destructive/10 border-destructive/20 animate-in fade-in slide-in-from-top-2">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle className="font-bold uppercase tracking-tight text-xs">Provisioning Error</AlertTitle>
                <AlertDescription className="text-xs opacity-90">
                  {error}
                </AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="name" className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Operative Name</Label>
              <div className="relative group">
                <User className="absolute left-3 top-3 size-4 text-muted-foreground group-focus-within:text-emerald-500 transition-colors" />
                <Input
                  id="name"
                  placeholder="John Doe"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-background/50 border-input text-foreground pl-10 h-12 focus-visible:ring-emerald-500/50 transition-all"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Terminal ID (Email)</Label>
              <div className="relative group">
                <Mail className="absolute left-3 top-3 size-4 text-muted-foreground group-focus-within:text-emerald-500 transition-colors" />
                <Input
                  id="email"
                  placeholder="agent@Qshield-ops.com"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-background/50 border-input text-foreground pl-10 h-12 focus-visible:ring-emerald-500/50 transition-all"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Security Access Key</Label>
              <div className="relative group">
                <Lock className="absolute left-3 top-3 size-4 text-muted-foreground group-focus-within:text-emerald-500 transition-colors" />
                <Input
                  id="password"
                  placeholder="••••••••"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-background/50 border-input text-foreground pl-10 h-12 focus-visible:ring-emerald-500/50 transition-all"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Operational Role</Label>
              <Select value={role} onValueChange={setRole}>
                <SelectTrigger className="bg-background/50 border-input text-foreground h-12 focus:ring-emerald-500/50">
                  <SelectValue placeholder="Select Role" />
                </SelectTrigger>
                <SelectContent className="bg-card border-border text-foreground">
                  <SelectItem value="admin">Administrator (Full Access)</SelectItem>
                  <SelectItem value="maintainer">Maintainer (Scan + Read)</SelectItem>
                  <SelectItem value="customer">Customer (Read Only)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button
              type="submit"
              className="w-full h-12 text-sm font-bold uppercase tracking-wider group bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-500/10"
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="animate-spin size-5" />
              ) : (
                <>
                  Initialize Profile
                  <ArrowRight className="ml-2 size-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col gap-4 pb-8 border-t border-border/50 pt-6 bg-muted/20">
          <div className="text-sm text-center">
            <span className="text-muted-foreground">Already authorized?</span>{" "}
            <Link href="/login" className="text-emerald-500 hover:text-emerald-400 font-bold transition-colors">Return to Login</Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
