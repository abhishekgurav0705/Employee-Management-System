"use client";
import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader } from "../../components/ui/card";
import { Table, THead, TBody, TR, TH, TD } from "../../components/ui/table";
import { Input } from "../../components/ui/input";
import { formatDate } from "../../lib/utils";
import { api } from "../../lib/api";
import { 
  Activity, 
  Search, 
  Filter, 
  Calendar, 
  User, 
  Shield, 
  ArrowRight,
  Clock,
  ChevronRight,
  Info
} from "lucide-react";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";

export default function ActivityLogPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actor, setActor] = useState("");
  const [action, setAction] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const res = await api.activityLogs.list() as any;
      setLogs(Array.isArray(res) ? res : (res.logs || []));
    } catch (error) {
      console.error("Error fetching logs", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredLogs = useMemo(() => {
    return logs.filter((l) => {
      const actorName = l.actor?.name || l.actorId || "";
      const matchesActor = !actor || actorName.toLowerCase().includes(actor.toLowerCase());
      const matchesAction = !action || l.action.toLowerCase().includes(action.toLowerCase());
      const logDate = new Date(l.timestamp).toISOString().slice(0, 10);
      const matchesFrom = !dateFrom || logDate >= dateFrom;
      const matchesTo = !dateTo || logDate <= dateTo;
      return matchesActor && matchesAction && matchesFrom && matchesTo;
    });
  }, [actor, action, dateFrom, dateTo, logs]);

  const getActionBadge = (action: string) => {
    const act = action.toUpperCase();
    if (act.includes("CREATE") || act.includes("ADD")) return "success";
    if (act.includes("DELETE") || act.includes("REMOVE")) return "destructive";
    if (act.includes("UPDATE") || act.includes("EDIT")) return "warning";
    return "default";
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Activity Log</h1>
          <p className="text-muted-foreground mt-1">Audit trail of all system actions and changes.</p>
        </div>
        <div className="flex items-center gap-2">
           <Button variant="outline" size="sm" onClick={fetchLogs}>
             <Activity className="h-4 w-4 mr-2" /> Refresh Logs
           </Button>
        </div>
      </div>

      <Card className="border-none shadow-sm">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Filter by actor" 
                className="pl-10"
                value={actor} 
                onChange={(e) => setActor(e.target.value)} 
              />
            </div>
            <div className="relative">
              <Shield className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Filter by action" 
                className="pl-10"
                value={action} 
                onChange={(e) => setAction(e.target.value)} 
              />
            </div>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                type="date" 
                className="pl-10"
                value={dateFrom} 
                onChange={(e) => setDateFrom(e.target.value)} 
              />
            </div>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                type="date" 
                className="pl-10"
                value={dateTo} 
                onChange={(e) => setDateTo(e.target.value)} 
              />
            </div>
          </div>

          <div className="overflow-x-auto -mx-6">
            <Table className="min-w-[800px]">
              <THead className="bg-muted/30">
                <TR>
                  <TH className="px-6 py-4">Timestamp</TH>
                  <TH className="px-6 py-4">Actor</TH>
                  <TH className="px-6 py-4">Action</TH>
                  <TH className="px-6 py-4">Details</TH>
                </TR>
              </THead>
              <TBody className="divide-y divide-border/50">
                {loading ? (
                  [1, 2, 3, 4, 5].map(i => (
                    <TR key={i} className="animate-pulse">
                      <TD colSpan={4} className="px-6 py-8 bg-muted/10"></TD>
                    </TR>
                  ))
                ) : filteredLogs.length === 0 ? (
                  <TR>
                    <TD colSpan={4} className="px-6 py-20 text-center">
                      <div className="mx-auto h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-4">
                        <Activity className="h-6 w-6 text-muted-foreground" />
                      </div>
                      <h3 className="text-lg font-semibold">No activities found</h3>
                      <p className="text-muted-foreground mt-1">Try adjusting your filters to see more results.</p>
                    </TD>
                  </TR>
                ) : (
                  filteredLogs.map((l) => (
                    <TR key={l.id} className="hover:bg-muted/30 transition-colors group">
                      <TD className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                          <Clock className="h-3.5 w-3.5" />
                          {new Date(l.timestamp).toLocaleString([], { 
                            month: 'short', 
                            day: 'numeric', 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </div>
                      </TD>
                      <TD className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold">
                            {l.actor?.name?.charAt(0) || "A"}
                          </div>
                          <span className="font-semibold text-foreground text-sm">
                            {l.actor?.name || l.actorId || "System"}
                          </span>
                        </div>
                      </TD>
                      <TD className="px-6 py-4">
                        <Badge variant={getActionBadge(l.action)} className="text-[10px] font-bold uppercase tracking-wider">
                          {l.action}
                        </Badge>
                      </TD>
                      <TD className="px-6 py-4">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span className="truncate max-w-[300px]">{l.target || "System Resource"}</span>
                        </div>
                      </TD>
                    </TR>
                  ))
                )}
              </TBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center gap-2 p-4 bg-primary/5 rounded-xl border border-primary/10">
        <Info className="h-5 w-5 text-primary shrink-0" />
        <p className="text-xs text-muted-foreground leading-relaxed">
          The activity log records all significant events within the EMS. This information is read-only and serves as an immutable audit trail for compliance and security purposes.
        </p>
      </div>
    </div>
  );
}
