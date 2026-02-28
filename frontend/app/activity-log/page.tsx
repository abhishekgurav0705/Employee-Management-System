"use client";
import { useMemo, useState } from "react";
import { activityLogs, employees } from "../../lib/mock";
import { Card, CardContent } from "../../components/ui/card";
import { Table, THead, TBody, TR, TH, TD } from "../../components/ui/table";
import { Input } from "../../components/ui/input";
import { formatDate } from "../../lib/utils";

export default function ActivityLogPage() {
  const [actor, setActor] = useState("");
  const [action, setAction] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const logs = useMemo(() => {
    return activityLogs.filter((l) => {
      const actorName = employees.find((e) => e.id === l.actorId)?.name ?? "";
      const matchesActor = !actor || actorName.toLowerCase().includes(actor.toLowerCase());
      const matchesAction = !action || l.action.toLowerCase().includes(action.toLowerCase());
      const date = new Date(l.timestamp).toISOString().slice(0, 10);
      const matchesFrom = !dateFrom || date >= dateFrom;
      const matchesTo = !dateTo || date <= dateTo;
      return matchesActor && matchesAction && matchesFrom && matchesTo;
    });
  }, [actor, action, dateFrom, dateTo]);

  return (
    <div className="space-y-6">
      <div className="page-header">
        <h1 className="text-xl font-semibold">Activity Log</h1>
      </div>

      <Card>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-4">
            <Input placeholder="Filter by actor" value={actor} onChange={(e) => setActor(e.target.value)} />
            <Input placeholder="Filter by action" value={action} onChange={(e) => setAction(e.target.value)} />
            <Input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
            <Input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
          </div>
          <div className="overflow-x-auto">
            <Table>
              <THead>
                <TR>
                  <TH>Actor</TH>
                  <TH>Action</TH>
                  <TH>Target</TH>
                  <TH>Timestamp</TH>
                </TR>
              </THead>
              <TBody>
                {logs.map((l) => {
                  const actorName = employees.find((e) => e.id === l.actorId)?.name ?? "-";
                  return (
                    <TR key={l.id}>
                      <TD>{actorName}</TD>
                      <TD>{l.action}</TD>
                      <TD>{l.target}</TD>
                      <TD>{formatDate(l.timestamp)}</TD>
                    </TR>
                  );
                })}
              </TBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
