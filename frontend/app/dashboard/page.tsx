"use client";
import { Card, CardContent, CardHeader } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { formatDate } from "../../lib/utils";
import { useAuth } from "../../lib/auth";
import { useEffect, useMemo, useState } from "react";
import { api } from "../../lib/api";
import { 
  Users, 
  Calendar, 
  Clock, 
  TrendingUp, 
  Building2, 
  ArrowUpRight, 
  ArrowDownRight,
  MoreHorizontal
} from "lucide-react";
import { Button } from "../../components/ui/button";

export default function DashboardPage() {
  const { user } = useAuth();
  const role = String(user?.role ?? "EMPLOYEE").toUpperCase();
  const isEmployee = role === "EMPLOYEE";
  const [employees, setEmployees] = useState<any[]>([]);
  const [leaves, setLeaves] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [attendance, setAttendance] = useState<any[]>([]);
  const [myLeaves, setMyLeaves] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    if (isEmployee) {
      Promise.all([
        api.attendance.my().catch(() => ({ records: [] })),
        api.leaves.my().catch(() => ({ leaves: [] }))
      ]).then(([att, myL]: any[]) => {
        const recs = (att?.records ?? att) || [];
        const ms = (myL?.leaves ?? myL) || [];
        setAttendance(Array.isArray(recs) ? recs : []);
        setMyLeaves(Array.isArray(ms) ? ms : []);
      }).finally(() => setIsLoading(false));
    } else {
      Promise.all([
        api.employees.list().catch(() => []),
        api.leaves.pending().catch(() => []),
        api.departments.list().catch(() => [])
      ]).then(([empRes, leavesRes, deptRes]: any[]) => {
        const emps = (empRes?.employees ?? empRes);
        const reqs = (leavesRes?.requests ?? leavesRes);
        const depts = (deptRes?.departments ?? deptRes);
        setEmployees(Array.isArray(emps) ? emps : []);
        setLeaves(Array.isArray(reqs) ? reqs : []);
        setDepartments(Array.isArray(depts) ? depts : []);
      }).finally(() => setIsLoading(false));
    }
  }, []);

  const totalEmployees = employees.length;
  const activeEmployees = employees.filter((e) => (e.status ?? "ACTIVE").toUpperCase() === "ACTIVE").length;
  const pendingLeaves = leaves.filter((l) => (l.status ?? "PENDING").toUpperCase() === "PENDING").length;

  // Employee-centric metrics
  const empStats = useMemo(() => {
    // Read default shift from settings or fallback
    let startTime = "09:00";
    let endTime = "18:00";
    try {
      const s = localStorage.getItem("ems_settings_hours");
      if (s) {
        const v = JSON.parse(s);
        startTime = v.startTime || startTime;
        endTime = v.endTime || endTime;
      }
    } catch {}
    const [sh, sm] = startTime.split(":").map((x: string) => Number(x));
    const [eh, em] = endTime.split(":").map((x: string) => Number(x));
    const now = new Date();
    const ym = `${now.getUTCFullYear()}-${now.getUTCMonth() + 1}`;
    const inMonth = attendance.filter((r) => {
      const d = new Date(r.date);
      return d.getUTCFullYear() === now.getUTCFullYear() && d.getUTCMonth() === now.getUTCMonth();
    });
    const presentDays = inMonth.filter((r) => !!r.checkInTime).length;
    let late = 0;
    let early = 0;
    inMonth.forEach((r) => {
      if (r.checkInTime) {
        const cin = new Date(r.checkInTime);
        if (cin.getUTCHours() > sh || (cin.getUTCHours() === sh && cin.getUTCMinutes() > sm)) late++;
      }
      if (r.checkOutTime) {
        const cout = new Date(r.checkOutTime);
        if (cout.getUTCHours() < eh || (cout.getUTCHours() === eh && cout.getUTCMinutes() < em)) early++;
      }
    });
    const pendingMine = myLeaves.filter((l) => String(l.status ?? "PENDING").toUpperCase() === "PENDING").length;
    const attendanceRate = inMonth.length > 0 ? Math.round((presentDays / inMonth.length) * 100) : 0;
    return { late, early, pendingMine, attendanceRate, presentDays, ym };
  }, [attendance, myLeaves]);

  const stats = isEmployee
    ? [
        { label: "Late Arrivals (This Month)", value: empStats.late, icon: Clock, color: "text-orange-600", bg: "bg-orange-100", trend: "", trendUp: true },
        { label: "Early Check-outs (This Month)", value: empStats.early, icon: Clock, color: "text-rose-600", bg: "bg-rose-100", trend: "", trendUp: false },
        { label: "My Pending Leaves", value: empStats.pendingMine, icon: Calendar, color: "text-blue-600", bg: "bg-blue-100", trend: "", trendUp: true },
        { label: "Attendance Rate", value: `${empStats.attendanceRate}%`, icon: TrendingUp, color: "text-green-600", bg: "bg-green-100", trend: "", trendUp: true }
      ]
    : [
        { label: "Total Employees", value: totalEmployees, icon: Users, color: "text-blue-600", bg: "bg-blue-100", trend: "+12%", trendUp: true },
        { label: "Active Now", value: activeEmployees, icon: TrendingUp, color: "text-green-600", bg: "bg-green-100", trend: "+5%", trendUp: true },
        { label: "Pending Leaves", value: pendingLeaves, icon: Calendar, color: "text-orange-600", bg: "bg-orange-100", trend: "-2%", trendUp: false },
        { label: "On Time Today", value: "94%", icon: Clock, color: "text-purple-600", bg: "bg-purple-100", trend: "+1.2%", trendUp: true }
      ];

  const holidays: Array<{ id: number; name: string; date: string }> = useMemo(() => {
    try {
      const s = localStorage.getItem("ems_settings_leave");
      if (s) {
        const v = JSON.parse(s);
        if (Array.isArray(v.holidays)) return v.holidays;
      }
    } catch {}
    return [];
  }, []);

  const monthDays = useMemo(() => {
    const today = new Date();
    const y = today.getUTCFullYear();
    const m = today.getUTCMonth();
    const first = new Date(Date.UTC(y, m, 1));
    const last = new Date(Date.UTC(y, m + 1, 0));
    const days = [];
    for (let d = 1; d <= last.getUTCDate(); d++) {
      const date = new Date(Date.UTC(y, m, d));
      const iso = date.toISOString().slice(0, 10);
      const rec = attendance.find((r) => new Date(r.date).toISOString().slice(0, 10) === iso);
      const hol = holidays.find((h) => h.date === iso);
      let state: "none" | "present" | "late" | "early" | "holiday" = "none";
      if (hol) state = "holiday";
      if (rec?.checkInTime) state = "present";
      // late/early overlays
      if (rec?.checkInTime) {
        try {
          const sh = (localStorage.getItem("ems_settings_hours") && JSON.parse(localStorage.getItem("ems_settings_hours") || "{}").startTime) || "09:00";
          const [h, mi] = String(sh).split(":").map((x: string) => Number(x));
          const cin = new Date(rec.checkInTime);
          if (cin.getUTCHours() > h || (cin.getUTCHours() === h && cin.getUTCMinutes() > mi)) state = "late";
        } catch {}
      }
      if (rec?.checkOutTime) {
        try {
          const eh = (localStorage.getItem("ems_settings_hours") && JSON.parse(localStorage.getItem("ems_settings_hours") || "{}").endTime) || "18:00";
          const [h, mi] = String(eh).split(":").map((x: string) => Number(x));
          const cout = new Date(rec.checkOutTime);
          if (cout.getUTCHours() < h || (cout.getUTCHours() === h && cout.getUTCMinutes() < mi)) state = "early";
        } catch {}
      }
      days.push({ iso, num: d, state, holiday: hol?.name });
    }
    return days;
  }, [attendance, holidays]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Welcome back, {user?.name || "User"}. Here's what's happening today.</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="secondary" className="px-3 py-1 text-xs font-semibold uppercase tracking-wider">
            {user?.role || "Employee"} Mode
          </Badge>
          <Button size="sm">Download Report</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <Card key={i} className="border-none shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-2 rounded-lg ${stat.bg}`}>
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </div>
                <div className={`flex items-center text-xs font-medium ${stat.trendUp ? "text-green-600" : "text-red-600"}`}>
                  {stat.trend}
                  {stat.trendUp ? <ArrowUpRight className="h-3 w-3 ml-1" /> : <ArrowDownRight className="h-3 w-3 ml-1" />}
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                <p className="text-2xl font-bold">{isLoading ? "..." : stat.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {isEmployee ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2 border-none shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between border-b border-border/50 pb-4">
              <div>
                <h2 className="text-lg font-semibold">This Month</h2>
                <p className="text-xs text-muted-foreground">Attendance and holidays overview</p>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-7 gap-2 text-center">
                {monthDays.map((d) => (
                  <div key={d.iso} className="p-2 rounded-md border border-border text-xs">
                    <div className="font-semibold">{d.num}</div>
                    <div className={
                      d.state === "holiday" ? "text-[10px] text-orange-600" :
                      d.state === "late" ? "text-[10px] text-rose-600" :
                      d.state === "early" ? "text-[10px] text-amber-600" :
                      d.state === "present" ? "text-[10px] text-green-600" : "text-[10px] text-muted-foreground"
                    }>
                      {d.holiday ? "Holiday" : d.state !== "none" ? d.state : ""}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          <Card className="border-none shadow-sm">
            <CardHeader className="border-b border-border/50 pb-4">
              <h2 className="text-lg font-semibold">Upcoming Holidays</h2>
              <p className="text-xs text-muted-foreground">Company holidays from settings</p>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              {holidays.length === 0 ? (
                <p className="text-sm text-muted-foreground">No holidays configured.</p>
              ) : (
                holidays
                  .filter(h => new Date(h.date) >= new Date(new Date().toISOString().slice(0,10)))
                  .slice(0, 6)
                  .map(h => (
                    <div key={h.id} className="flex items-center justify-between text-sm">
                      <div className="font-medium">{h.name}</div>
                      <div className="text-muted-foreground">{formatDate(h.date)}</div>
                    </div>
                  ))
              )}
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2 border-none shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between border-b border-border/50 pb-4">
              <div>
                <h2 className="text-lg font-semibold">Recent Employees</h2>
                <p className="text-xs text-muted-foreground">Latest additions to your team</p>
              </div>
              <Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead>
                    <tr className="bg-muted/30 text-muted-foreground font-medium border-b border-border/50">
                      <th className="px-6 py-3">Employee</th>
                      <th className="px-6 py-3">Department</th>
                      <th className="px-6 py-3">Status</th>
                      <th className="px-6 py-3">Joined</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/50">
                    {isLoading ? (
                      [1,2,3].map(i => (
                        <tr key={i} className="animate-pulse">
                          <td colSpan={4} className="px-6 py-4 bg-muted/10"></td>
                        </tr>
                      ))
                    ) : employees.slice(0, 5).map((emp) => (
                      <tr key={emp.id} className="hover:bg-muted/30 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold">
                              {emp.name?.charAt(0) || "E"}
                            </div>
                            <span className="font-medium">{emp.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-muted-foreground">
                          {departments.find(d => d.id === emp.departmentId)?.name || "N/A"}
                        </td>
                        <td className="px-6 py-4">
                          <Badge variant={emp.status === "ACTIVE" ? "default" : "secondary"} className="text-[10px] font-bold">
                            {emp.status}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 text-muted-foreground text-xs">
                          {formatDate(emp.createdAt || new Date().toISOString())}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {employees.length === 0 && !isLoading && (
                <div className="p-12 text-center text-muted-foreground">
                  No employee records found.
                </div>
              )}
            </CardContent>
          </Card>
          <Card className="border-none shadow-sm">
            <CardHeader className="border-b border-border/50 pb-4">
              <h2 className="text-lg font-semibold">Department Distribution</h2>
              <p className="text-xs text-muted-foreground">Headcount by department</p>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-6">
                {departments.map((dept) => {
                  const count = employees.filter(e => e.departmentId === dept.id).length;
                  const percentage = totalEmployees > 0 ? (count / totalEmployees) * 100 : 0;
                  return (
                    <div key={dept.id} className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <Building2 className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{dept.name}</span>
                        </div>
                        <span className="text-muted-foreground font-bold">{count}</span>
                      </div>
                      <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary transition-all duration-500" 
                          style={{ width: `${percentage}%` }} 
                        />
                      </div>
                    </div>
                  );
                })}
                {departments.length === 0 && !isLoading && (
                  <p className="text-sm text-center text-muted-foreground py-8">No department data available.</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
