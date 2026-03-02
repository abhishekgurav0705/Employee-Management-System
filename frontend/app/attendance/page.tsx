"use client";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader } from "../../components/ui/card";
import { Table, THead, TBody, TR, TH, TD } from "../../components/ui/table";
import { Button } from "../../components/ui/button";
import { Spinner } from "../../components/ui/spinner";
import { api } from "../../lib/api";
import { ToastRoot, ToastTitle, ToastDescription } from "../../components/ui/toast";

export default function AttendancePage() {
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [toastOpen, setToastOpen] = useState(false);

  useEffect(() => {
    setLoading(true);
    api.attendance.my()
      .then((res: any) => setRecords((res.records ?? res) || []))
      .catch((e: any) => { setError(e?.message ?? "Failed to load attendance"); setToastOpen(true); })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div className="page-header">
        <h1 className="text-xl font-semibold">Attendance</h1>
      </div>
      <Card>
        <CardHeader className="flex items-center justify-between">
          <span className="text-sm text-secondary">My Records</span>
          <div className="flex gap-2">
            <Button disabled title="Coming soon">Check In</Button>
            <Button disabled title="Coming soon" variant="outline">Check Out</Button>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center gap-3 text-secondary"><Spinner /> Loading attendance...</div>
          ) : records.length === 0 ? (
            <div className="rounded-lg border border-border p-8 text-center text-secondary">No records yet</div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <THead>
                  <TR>
                    <TH>Date</TH>
                    <TH>Check In</TH>
                    <TH>Check Out</TH>
                  </TR>
                </THead>
                <TBody>
                  {records.map((r) => (
                    <TR key={`${r.employeeId}-${r.date}`}>
                      <TD>{new Date(r.date).toLocaleDateString()}</TD>
                      <TD>{r.checkInTime ? new Date(r.checkInTime).toLocaleTimeString() : "-"}</TD>
                      <TD>{r.checkOutTime ? new Date(r.checkOutTime).toLocaleTimeString() : "-"}</TD>
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
