"use client";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { formatDate } from "../../lib/utils";
import { api } from "../../lib/api";
import { 
  Calendar, 
  Clock, 
  FileText, 
  Plus, 
  Send, 
  CheckCircle2, 
  XCircle, 
  AlertCircle,
  History,
  Info
} from "lucide-react";
import { ToastRoot, ToastTitle, ToastDescription } from "../../components/ui/toast";
import { cn } from "../../lib/utils";

export default function MyLeavePage() {
  const [leaves, setLeaves] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({ type: "ANNUAL", startDate: "", endDate: "", reason: "" });
  const [toast, setToast] = useState({ open: false, title: "", description: "", variant: "success" as "success" | "error" });

  useEffect(() => {
    fetchMyLeaves();
  }, []);

  const fetchMyLeaves = async () => {
    setLoading(true);
    try {
      const res = await api.leaves.my() as any;
      setLeaves(Array.isArray(res) ? res : (res.leaves || []));
    } catch (error) {
      console.error("Error fetching leaves", error);
    } finally {
      setLoading(false);
    }
  };

  const showToast = (title: string, description: string, variant: "success" | "error" = "success") => {
    setToast({ open: true, title, description, variant });
  };

  async function submit() {
    if (!form.startDate || !form.endDate) {
      showToast("Missing Dates", "Please select both start and end dates.", "error");
      return;
    }
    
    setIsSubmitting(true);
    try {
      await api.leaves.create({
        type: form.type,
        startDate: new Date(form.startDate).toISOString(),
        endDate: new Date(form.endDate).toISOString(),
        reason: form.reason
      });
      showToast("Request Submitted", "Your leave request has been sent for approval.");
      setForm({ type: "ANNUAL", startDate: "", endDate: "", reason: "" });
      fetchMyLeaves();
    } catch (error: any) {
      showToast("Submission Failed", error.message || "Could not submit leave request.", "error");
    } finally {
      setIsSubmitting(false);
    }
  }

  const getStatusVariant = (status: string) => {
    const s = status.toUpperCase();
    if (s === "APPROVED") return "success";
    if (s === "REJECTED") return "destructive";
    if (s === "PENDING") return "warning";
    return "default";
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Leave</h1>
          <p className="text-muted-foreground mt-1">Request time off and track your leave history.</p>
        </div>
        <div className="flex items-center gap-4 bg-card px-4 py-2 rounded-lg border border-border shadow-sm">
           <div className="text-center">
             <p className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest">Available</p>
             <p className="text-lg font-bold text-primary">12 Days</p>
           </div>
           <div className="w-px h-8 bg-border" />
           <div className="text-center">
             <p className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest">Used</p>
             <p className="text-lg font-bold text-foreground">4 Days</p>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <Card className="border-none shadow-sm overflow-hidden">
            <div className="h-1.5 bg-primary" />
            <CardHeader className="pb-2">
              <h2 className="text-lg font-bold">New Request</h2>
              <p className="text-xs text-muted-foreground">Fill in the details for your time off.</p>
            </CardHeader>
            <CardContent className="space-y-4 pt-4">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-muted-foreground">Leave Type</label>
                <select
                  className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm focus:ring-1 focus:ring-primary outline-none"
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value })}
                >
                  <option value="ANNUAL">Annual Leave</option>
                  <option value="SICK">Sick Leave</option>
                  <option value="UNPAID">Unpaid Leave</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase text-muted-foreground">Start Date</label>
                  <Input 
                    type="date" 
                    className="text-sm"
                    value={form.startDate} 
                    onChange={(e) => setForm({ ...form, startDate: e.target.value })} 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase text-muted-foreground">End Date</label>
                  <Input 
                    type="date" 
                    className="text-sm"
                    value={form.endDate} 
                    onChange={(e) => setForm({ ...form, endDate: e.target.value })} 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-muted-foreground">Reason</label>
                <textarea
                  placeholder="Why are you taking leave?"
                  className="w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm focus:ring-1 focus:ring-primary outline-none resize-none"
                  value={form.reason}
                  onChange={(e) => setForm({ ...form, reason: e.target.value })}
                />
              </div>

              <Button 
                className="w-full shadow-lg shadow-primary/20" 
                onClick={submit} 
                disabled={isSubmitting || !form.startDate || !form.endDate}
              >
                {isSubmitting ? (
                  "Submitting..."
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" /> Submit Request
                  </>
                )}
              </Button>
              
              <div className="flex items-start gap-2 p-3 bg-muted/50 rounded-lg">
                <Info className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                <p className="text-[10px] text-muted-foreground leading-relaxed">
                  Your request will be sent to your manager for approval. You will receive an email notification once a decision is made.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <Card className="border-none shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between border-b border-border/50 pb-4">
              <div>
                <h2 className="text-lg font-bold">Leave History</h2>
                <p className="text-xs text-muted-foreground">Tracking your previous and pending requests.</p>
              </div>
              <History className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent className="p-0">
              {loading ? (
                <div className="py-20 text-center">
                  <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-solid border-primary border-r-transparent" />
                  <p className="mt-2 text-xs text-muted-foreground font-medium">Loading history...</p>
                </div>
              ) : leaves.length === 0 ? (
                <div className="py-20 text-center">
                  <div className="mx-auto h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-4">
                    <Calendar className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold">No leave history</h3>
                  <p className="text-muted-foreground mt-1">You haven't submitted any leave requests yet.</p>
                </div>
              ) : (
                <div className="divide-y divide-border/50">
                  {leaves.map((l) => (
                    <div key={l.id} className="p-6 hover:bg-muted/30 transition-colors group">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-start gap-4">
                          <div className={cn(
                            "h-10 w-10 rounded-xl flex items-center justify-center shrink-0",
                            l.status.toUpperCase() === "APPROVED" ? "bg-success/10 text-success" : 
                            l.status.toUpperCase() === "REJECTED" ? "bg-destructive/10 text-destructive" : "bg-warning/10 text-warning"
                          )}>
                            <FileText className="h-5 w-5" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-foreground">{l.type} Leave</span>
                              <Badge variant={getStatusVariant(l.status)} className="text-[10px] font-bold uppercase tracking-wider">
                                {l.status}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                              <Calendar className="h-3.5 w-3.5" />
                              <span>{formatDate(l.startDate)} - {formatDate(l.endDate)}</span>
                            </div>
                            {l.reason && (
                              <p className="text-xs text-muted-foreground mt-2 bg-muted/50 p-2 rounded italic">
                                "{l.reason}"
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex flex-col sm:items-end gap-1">
                          <span className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest">Submitted On</span>
                          <span className="text-xs font-medium">{formatDate(l.createdAt)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <ToastRoot open={toast.open} onOpenChange={(open) => setToast(prev => ({ ...prev, open }))}>
        <div className="flex gap-3">
          {toast.variant === "success" ? (
            <CheckCircle2 className="h-5 w-5 text-success" />
          ) : (
            <AlertCircle className="h-5 w-5 text-destructive" />
          )}
          <div className="space-y-1">
            <ToastTitle>{toast.title}</ToastTitle>
            <ToastDescription>{toast.description}</ToastDescription>
          </div>
        </div>
      </ToastRoot>
    </div>
  );
}
