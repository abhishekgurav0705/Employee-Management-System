"use client";
import { useState } from "react";
import { currentUser, attendance as initial } from "../../lib/mock";
import { Card, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Table, THead, TBody, TR, TH, TD } from "../../components/ui/table";
import { formatDate } from "../../lib/utils";

export default function AttendancePage() {
  const [records, setRecords] = useState(initial.filter((a) => a.employeeId === currentUser.id));
  const today = new Date().toISOString().slice(0, 10);
  const todayRecord = records.find((r) => r.date === today);

  function checkIn() {
    if (todayRecord?.checkIn) return;
    setRecords([{ id: `a-${Date.now()}`, employeeId: currentUser.id, date: today, checkIn: timeNow() }, ...records]);
  }

  function checkOut() {
    setRecords((prev) => prev.map((r) => r.date === today ? { ...r, checkOut: timeNow() } : r));
  }

  return (
    <div className="space-y-6">
      <div className="page-header">
        <h1 className="text-xl font-semibold">Attendance</h1>
      </div>

      <Card>
        <CardContent className="flex items-center gap-3">
          <Button onClick={checkIn} disabled={!!todayRecord?.checkIn}>Check In</Button>
          <Button onClick={checkOut} variant="outline" disabled={!todayRecord?.checkIn || !!todayRecord?.checkOut}>Check Out</Button>
          <div className="subtle">Today: {formatDate(today)}</div>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
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
                <TR key={r.id}>
                  <TD>{formatDate(r.date)}</TD>
                  <TD>{r.checkIn ?? "-"}</TD>
                  <TD>{r.checkOut ?? "-"}</TD>
                </TR>
              ))}
            </TBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

function timeNow() {
  const d = new Date();
  return `${pad(d.getHours())}:${pad(d.getMinutes())}`;
}
function pad(n: number) {
  return n.toString().padStart(2, "0");
}
