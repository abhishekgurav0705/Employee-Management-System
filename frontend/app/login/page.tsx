"use client";
import { useState } from "react";
import { useAuth } from "../../lib/auth";
import { Card, CardContent, CardHeader } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { ToastRoot, ToastTitle, ToastDescription } from "../../components/ui/toast";

export default function LoginAliasPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [toastOpen, setToastOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit() {
    setError(null);
    try {
      await login(email, password);
    } catch (e: any) {
      setError(e?.message ?? "Login failed");
      setToastOpen(true);
    }
  }

  return (
    <div className="min-h-[calc(100vh-56px)] flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader className="text-lg font-semibold">Sign In</CardHeader>
        <CardContent className="space-y-3">
          <Input placeholder="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} />
          <Input placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
          <Button onClick={onSubmit} className="w-full">Log In</Button>
          {error && <p className="text-xs text-destructive">{error}</p>}
        </CardContent>
      </Card>
      <ToastRoot open={toastOpen} onOpenChange={setToastOpen}>
        <ToastTitle>Login Error</ToastTitle>
        <ToastDescription>{error}</ToastDescription>
      </ToastRoot>
    </div>
  );
}
