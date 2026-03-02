"use client";
import { useState } from "react";
import { useAuth } from "../lib/auth";
import { Card, CardContent, CardHeader } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { ToastRoot, ToastTitle, ToastDescription } from "../components/ui/toast";
import { Building2, Lock, Mail, Loader2 } from "lucide-react";

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [toastOpen, setToastOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !password) return;
    
    setError(null);
    setIsLoading(true);
    try {
      await login(email, password);
    } catch (e: any) {
      setError(e?.message ?? "Invalid email or password");
      setToastOpen(true);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-muted/30 px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground mb-4">
            <Building2 className="h-6 w-6" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Welcome back</h1>
          <p className="text-muted-foreground mt-2">Enter your credentials to access your account</p>
        </div>

        <Card className="border-none shadow-xl">
          <CardHeader className="pb-2">
            <h2 className="text-lg font-semibold">Sign In</h2>
          </CardHeader>
          <CardContent>
            <form onSubmit={onSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="email">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="email"
                    placeholder="name@company.com" 
                    type="email" 
                    className="pl-10"
                    value={email} 
                    onChange={e => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium" htmlFor="password">Password</label>
                  <button type="button" className="text-xs text-primary hover:underline">Forgot password?</button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="password"
                    placeholder="••••••••" 
                    type="password" 
                    className="pl-10"
                    value={password} 
                    onChange={e => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>
              
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>
              
              {error && (
                <p className="text-sm text-center text-destructive font-medium">{error}</p>
              )}
            </form>
          </CardContent>
        </Card>
        
        <p className="text-center text-sm text-muted-foreground">
          Don't have an account? <span className="text-primary font-medium">Contact your HR administrator</span>
        </p>
      </div>

      <ToastRoot open={toastOpen} onOpenChange={setToastOpen}>
        <div className="flex gap-3">
          <div className="h-5 w-5 rounded-full bg-destructive/10 flex items-center justify-center">
            <Lock className="h-3 w-3 text-destructive" />
          </div>
          <div className="space-y-1">
            <ToastTitle>Authentication Failed</ToastTitle>
            <ToastDescription>{error}</ToastDescription>
          </div>
        </div>
      </ToastRoot>
    </div>
  );
}
