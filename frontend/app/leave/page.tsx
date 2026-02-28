"use client";
import { useState } from "react";
import { currentUser, leaves as initialLeaves } from "../../lib/mock";
import { Card, CardContent, CardHeader } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { formatDate } from "../../lib/utils";

export default function MyLeavePage() {
  const [leaves, setLeaves] = useState(initialLeaves.filter((l) => l.employeeId === currentUser.id));
  const [form, setForm] = useState({ type: "Annual", startDate: "", endDate: "", reason: "" });

  function submit() {
    if (!form.startDate || !form.endDate) return;
    setLeaves([
      ...leaves,
      {
        id: `l-${Date.now()}`,
        employeeId: currentUser.id,
        type: form.type as any,
        startDate: form.startDate,
        endDate: form.endDate,
        reason: form.reason,
        status: "Pending",
        createdAt: new Date().toISOString()
      }
    ]);
    setForm({ type: "Annual", startDate: "", endDate: "", reason: "" });
  }

  return (
    <div className="space-y-6">
      <div className="page-header">
        <h1 className="text-xl font-semibold">My Leave</h1>
      </div>

      <Card>
        <CardHeader className="section-title">Create Leave Request</CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <select
            className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
            value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value })}
          >
            <option>Annual</option>
            <option>Sick</option>
            <option>Unpaid</option>
            <option>Other</option>
          </select>
          <Input type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} />
          <Input type="date" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} />
          <Input placeholder="Reason (optional)" value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })} />
          <div className="md:col-span-4">
            <Button onClick={submit}>Submit Request</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="section-title">My Requests</CardHeader>
        <CardContent>
          {leaves.length === 0 ? (
            <div className="rounded-lg border border-border p-8 text-center text-secondary">No leave requests yet</div>
          ) : (
            <ul className="divide-y divide-border">
              {leaves.map((l) => (
                <li key={l.id} className="py-3 flex items-center justify-between">
                  <div>
                    <div className="text-sm">{l.type} • {formatDate(l.startDate)} - {formatDate(l.endDate)}</div>
                    <div className="text-xs text-secondary">Submitted {formatDate(l.createdAt)}</div>
                  </div>
                  <Badge variant={l.status === "Approved" ? "success" : l.status === "Rejected" ? "destructive" : "warning"}>{l.status}</Badge>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
