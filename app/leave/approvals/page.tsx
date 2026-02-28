"use client";
import { useState } from "react";
import { leaves as initialLeaves, employees } from "../../../lib/mock";
import { Card, CardContent } from "../../../components/ui/card";
import { Table, THead, TBody, TR, TH, TD } from "../../../components/ui/table";
import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";
import { Drawer, DrawerContent, DrawerTrigger, DrawerClose } from "../../../components/ui/drawer";
import { formatDate } from "../../../lib/utils";

export default function LeaveApprovalsPage() {
  const [leaves, setLeaves] = useState(initialLeaves);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  function setStatus(id: string, status: "Approved" | "Rejected") {
    setLeaves((prev) => prev.map((l) => (l.id === id ? { ...l, status, updatedAt: new Date().toISOString() } : l)));
  }

  return (
    <div className="space-y-6">
      <div className="page-header">
        <h1 className="text-xl font-semibold">Leave Requests</h1>
      </div>

      <Card>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <THead>
                <TR>
                  <TH>Employee</TH>
                  <TH>Leave Type</TH>
                  <TH>Dates</TH>
                  <TH>Status</TH>
                  <TH></TH>
                </TR>
              </THead>
              <TBody>
                {leaves.map((l) => {
                  const emp = employees.find((e) => e.id === l.employeeId)?.name ?? "-";
                  return (
                    <TR key={l.id} className="cursor-pointer" onClick={() => setSelectedId(l.id)}>
                      <TD>{emp}</TD>
                      <TD>{l.type}</TD>
                      <TD>{formatDate(l.startDate)} - {formatDate(l.endDate)}</TD>
                      <TD>
                        <Badge variant={l.status === "Approved" ? "success" : l.status === "Rejected" ? "destructive" : "warning"}>{l.status}</Badge>
                      </TD>
                      <TD className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button size="sm" variant="outline" onClick={(e) => { e.stopPropagation(); setStatus(l.id, "Approved"); }}>Approve</Button>
                          <Button size="sm" variant="outline" onClick={(e) => { e.stopPropagation(); setStatus(l.id, "Rejected"); }}>Reject</Button>
                        </div>
                      </TD>
                    </TR>
                  );
                })}
              </TBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Drawer open={!!selectedId} onOpenChange={(o) => !o && setSelectedId(null)}>
        <DrawerTrigger asChild />
        <DrawerContent>
          {selectedId ? <LeaveDetail id={selectedId} /> : null}
          <div className="mt-4 flex justify-end">
            <DrawerClose asChild>
              <Button variant="outline">Close</Button>
            </DrawerClose>
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
}

function LeaveDetail({ id }: { id: string }) {
  const l = initialLeaves.find((x) => x.id === id)!;
  const emp = employees.find((e) => e.id === l.employeeId)?.name ?? "-";
  return (
    <div>
      <h3 className="text-lg font-semibold">{emp}</h3>
      <div className="subtle">{l.type} • {formatDate(l.startDate)} - {formatDate(l.endDate)}</div>
      {l.reason && <p className="mt-3 text-sm">{l.reason}</p>}
      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="rounded-lg border border-border p-3">
          <div className="text-xs text-secondary">Submitted</div>
          <div className="text-sm">{formatDate(l.createdAt)}</div>
        </div>
        {l.updatedAt && (
          <div className="rounded-lg border border-border p-3">
            <div className="text-xs text-secondary">Updated</div>
            <div className="text-sm">{formatDate(l.updatedAt)}</div>
          </div>
        )}
      </div>
    </div>
  );
}
