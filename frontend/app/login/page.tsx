// OOP: Encapsulation — This component encapsulates login state and credential submission.
// OOP: Abstraction — Exposes a simple authentication form interface while hiding NextAuth details.

"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { Bot, Lock, Mail, ArrowRight, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError(error.message);
      } else {
        router.push("/");
        router.refresh();
      }
    } catch (err) {
      setError("A critical system error occurred during authentication.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background p-4 relative overflow-hidden">
      {/* Dynamic Background Elements */}
      <div className="absolute inset-0 bg-grid-slate-900/[0.04] dark:bg-grid-white/[0.02] pointer-events-none"></div>
      <div className="absolute inset-0 flex items-center justify-center bg-background [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)] pointer-events-none"></div>
      <div className="absolute top-0 -left-4 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-0 -right-4 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl animate-pulse delay-700"></div>

      <Card className="w-full max-w-md border-border bg-card/50 backdrop-blur-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-500 relative z-10">
        <div className="h-1.5 w-full bg-gradient-to-r from-primary via-primary/50 to-primary animate-pulse"></div>
        <CardHeader className="space-y-1 text-center pt-8">
          <div className="flex justify-center mb-4">
            <div className="p-3 rounded-2xl bg-primary/10 border border-primary/20 shadow-[0_0_15px_rgba(var(--primary),0.1)]">
              <Bot className="size-10 text-primary" />
            </div>
          </div>
          <CardTitle className="text-3xl font-black tracking-tight text-foreground uppercase tracking-tighter">Qshield Control</CardTitle>
          <CardDescription className="text-muted-foreground font-medium tracking-tight">Access restricted to authorized personnel</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6 pt-4">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <Alert variant="destructive" className="bg-destructive/10 border-destructive/20 animate-in fade-in slide-in-from-top-2">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle className="font-bold uppercase tracking-tight text-xs">Access Denied</AlertTitle>
                <AlertDescription className="text-xs opacity-90">
                  {error}
                </AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Terminal ID (Email)</Label>
              <div className="relative group">
                <Mail className="absolute left-3 top-3 size-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <Input
                  id="email"
                  placeholder="agent@Qshield-ops.com"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-background/50 border-input text-foreground pl-10 h-12 focus-visible:ring-primary/50 transition-all"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Access Key</Label>
              <div className="relative group">
                <Lock className="absolute left-3 top-3 size-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <Input
                  id="password"
                  placeholder="••••••••"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-background/50 border-input text-foreground pl-10 h-12 focus-visible:ring-primary/50 transition-all"
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-12 text-sm font-bold uppercase tracking-wider group transition-all overflow-hidden shadow-lg shadow-primary/10"
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="animate-spin size-5" />
              ) : (
                <>
                  Validate Credentials
                  <ArrowRight className="ml-2 size-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col gap-4 pb-8 border-t border-border/50 pt-6 bg-muted/20">
          <p className="text-[10px] text-center text-muted-foreground uppercase font-black tracking-[0.2em] opacity-50">
            Level 3 Security Clearance Active
          </p>
          <div className="text-sm text-center">
            <span className="text-muted-foreground">Need access?</span>{" "}
            <Link href="/register" className="text-primary hover:text-primary/80 font-bold transition-colors">Request Authorization</Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
