"use client";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader } from "../../../components/ui/card";
import { Table, THead, TBody, TR, TH, TD } from "../../../components/ui/table";
import { Button } from "../../../components/ui/button";
import { api } from "../../../lib/api";
import { ToastRoot, ToastTitle, ToastDescription } from "../../../components/ui/toast";
import { 
  CheckCircle2, 
  XCircle, 
  Clock, 
  User, 
  Calendar, 
  FileCheck, 
  AlertCircle,
  MoreHorizontal,
  ChevronRight
} from "lucide-react";
import { Badge } from "../../../components/ui/badge";
import { formatDate } from "../../../lib/utils";

export default function LeaveApprovalsPage() {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [toastOpen, setToastOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchRequests = () => {
    setLoading(true);
    api.leaves.pending()
      .then((res: any) => setRequests((res.requests ?? res) || []))
      .catch((e: any) => { setError(e?.message ?? "Failed to load requests"); setToastOpen(true); })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleAction = async (id: string, action: "approve" | "reject") => {
    setActionLoading(id);
    try {
      if (action === "approve") {
        await api.leaves.approve(id);
      } else {
        await api.leaves.reject(id);
      }
      fetchRequests();
    } catch (e: any) {
      setError(e?.message || `Failed to ${action} request`);
      setToastOpen(true);
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Leave Requests</h1>
          <p className="text-muted-foreground mt-1">Review and manage employee time-off applications.</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="warning" className="px-3 py-1 font-bold uppercase tracking-wider">
            {requests.length} Pending
          </Badge>
        </div>
      </div>

      <Card className="border-none shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between border-b border-border/50 pb-4">
          <div>
            <h2 className="text-lg font-bold">Pending Approvals</h2>
            <p className="text-xs text-muted-foreground">Requests awaiting your decision.</p>
          </div>
          <FileCheck className="h-5 w-5 text-muted-foreground" />
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="py-20 text-center">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent" />
              <p className="mt-4 text-muted-foreground font-medium">Loading requests...</p>
            </div>
          ) : requests.length === 0 ? (
            <div className="py-20 text-center border-2 border-dashed border-border m-6 rounded-xl bg-muted/30">
              <div className="mx-auto h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-4">
                <CheckCircle2 className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold">All caught up!</h3>
              <p className="text-muted-foreground mt-1">There are no pending leave requests to review.</p>
            </div>
          ) : (
            <div className="overflow-x-auto -mx-0">
              <Table className="min-w-[900px]">
                <THead className="bg-muted/30">
                  <TR>
                    <TH className="px-6 py-4">Employee</TH>
                    <TH className="px-6 py-4">Leave Details</TH>
                    <TH className="px-6 py-4">Period</TH>
                    <TH className="px-6 py-4">Duration</TH>
                    <TH className="px-6 py-4 text-right">Actions</TH>
                  </TR>
                </THead>
                <TBody className="divide-y divide-border/50">
                  {requests.map((r) => {
                    const startDate = new Date(r.startDate);
                    const endDate = new Date(r.endDate);
                    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

                    return (
                      <TR key={r.id} className="hover:bg-muted/30 transition-colors group">
                        <TD className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                              {r.employee?.name?.charAt(0) || "E"}
                            </div>
                            <div className="flex flex-col">
                              <span className="font-semibold text-foreground">{r.employee?.name || "Unknown"}</span>
                              <span className="text-xs text-muted-foreground">{r.employee?.email || "No email"}</span>
                            </div>
                          </div>
                        </TD>
                        <TD className="px-6 py-4">
                          <div className="space-y-1">
                            <Badge variant="secondary" className="text-[10px] font-bold tracking-wider">
                              {r.type || "ANNUAL"}
                            </Badge>
                            {r.reason && (
                              <p className="text-xs text-muted-foreground line-clamp-1 italic max-w-[200px]">
                                "{r.reason}"
                              </p>
                            )}
                          </div>
                        </TD>
                        <TD className="px-6 py-4">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Calendar className="h-3.5 w-3.5" />
                            <span>{formatDate(r.startDate)} - {formatDate(r.endDate)}</span>
                          </div>
                        </TD>
                        <TD className="px-6 py-4">
                          <span className="text-sm font-bold text-primary">{diffDays} Days</span>
                        </TD>
                        <TD className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="h-8 text-xs font-bold border-success/50 text-success hover:bg-success hover:text-white"
                              disabled={!!actionLoading}
                              onClick={() => handleAction(r.id, "approve")}
                            >
                              {actionLoading === r.id ? "..." : <><CheckCircle2 className="h-3.5 w-3.5 mr-1" /> Approve</>}
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="h-8 text-xs font-bold border-destructive/50 text-destructive hover:bg-destructive hover:text-white"
                              disabled={!!actionLoading}
                              onClick={() => handleAction(r.id, "reject")}
                            >
                              {actionLoading === r.id ? "..." : <><XCircle className="h-3.5 w-3.5 mr-1" /> Reject</>}
                            </Button>
                          </div>
                        </TD>
                      </TR>
                    );
                  })}
                </TBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <ToastRoot open={toastOpen} onOpenChange={setToastOpen}>
        <div className="flex gap-3">
          <AlertCircle className="h-5 w-5 text-destructive" />
          <div className="space-y-1">
            <ToastTitle>Request Failed</ToastTitle>
            <ToastDescription>{error}</ToastDescription>
          </div>
        </div>
      </ToastRoot>
    </div>
  );
}
