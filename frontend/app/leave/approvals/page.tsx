"use client";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader } from "../../../components/ui/card";
import { Table, THead, TBody, TR, TH, TD } from "../../../components/ui/table";
import { Button } from "../../../components/ui/button";
import { Spinner } from "../../../components/ui/spinner";
import { api } from "../../../lib/api";
import { ToastRoot, ToastTitle, ToastDescription } from "../../../components/ui/toast";

export default function LeaveApprovalsPage() {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [toastOpen, setToastOpen] = useState(false);

  useEffect(() => {
    setLoading(true);
    api.leaves.pending()
      .then((res: any) => setRequests((res.requests ?? res) || []))
      .catch((e: any) => { setError(e?.message ?? "Failed to load requests"); setToastOpen(true); })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div className="page-header">
        <h1 className="text-xl font-semibold">Leave Requests</h1>
      </div>

      <Card>
        <CardHeader className="text-sm text-secondary">Pending Approvals</CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center gap-3 text-secondary"><Spinner /> Loading leave requests...</div>
          ) : requests.length === 0 ? (
            <div className="rounded-lg border border-border p-8 text-center text-secondary">No pending requests</div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <THead>
                  <TR>
                    <TH>Employee</TH>
                    <TH>Type</TH>
                    <TH>Start</TH>
                    <TH>End</TH>
                    <TH>Status</TH>
                    <TH>Actions</TH>
                  </TR>
                </THead>
                <TBody>
                  {requests.map((r) => (
                    <TR key={r.id}>
                      <TD>{r.employee?.name ?? r.employeeId}</TD>
                      <TD>{r.leaveType?.name ?? r.leaveTypeId}</TD>
                      <TD>{new Date(r.startDate).toLocaleDateString()}</TD>
                      <TD>{new Date(r.endDate).toLocaleDateString()}</TD>
                      <TD>{String(r.status ?? "").toUpperCase()}</TD>
                      <TD className="flex gap-2">
                        <Button onClick={() => api.leaves.approve(r.id).then(() => location.reload())}>Approve</Button>
                        <Button variant="outline" onClick={() => api.leaves.reject(r.id).then(() => location.reload())}>Reject</Button>
                      </TD>
                    </TR>
                  ))}
                </TBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <ToastRoot open={toastOpen} onOpenChange={setToastOpen}>
        <ToastTitle>Error</ToastTitle>
        <ToastDescription>{error}</ToastDescription>
      </ToastRoot>
    </div>
  );
}
