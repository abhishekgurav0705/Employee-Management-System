import { Card, CardContent, CardHeader } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { formatDate } from "../../lib/utils";
import { useAuth } from "../../lib/auth";
import { useEffect, useState } from "react";
import { api } from "../../lib/api";

export default function DashboardPage() {
  const { user } = useAuth();
  const [employees, setEmployees] = useState<any[]>([]);
  const [leaves, setLeaves] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [todayAttendance, setTodayAttendance] = useState<number>(0);

  useEffect(() => {
    // Basic dashboard data load
    Promise.all([
      api.employees.list().catch(() => []),
      api.leaves.pending().catch(() => []),
      api.departments.list().catch(() => [])
    ]).then(([empRes, leavesRes, deptRes]) => {
      setEmployees((empRes.employees ?? empRes) || []);
      setLeaves((leavesRes.requests ?? leavesRes) || []);
      setDepartments((deptRes.departments ?? deptRes) || []);
      setTodayAttendance(42);
    });
  }, []);

  const totalEmployees = employees.length;
  const activeEmployees = employees.filter((e) => (e.status ?? "ACTIVE").toUpperCase() === "ACTIVE").length;
  const pendingLeaves = leaves.filter((l) => (l.status ?? "PENDING").toUpperCase() === "PENDING").length;

  const leavesByType = Object.entries(
    leaves.reduce<Record<string, number>>((acc, l) => {
      const type = l.type ?? "Other";
      acc[type] = (acc[type] ?? 0) + 1;
      return acc;
    }, {})
  );

  const deptDistribution = Object.entries(
    employees.reduce<Record<string, number>>((acc, e) => {
      const d = departments.find((d) => d.id === e.departmentId)?.name ?? "Unknown";
      acc[d] = (acc[d] ?? 0) + 1;
      return acc;
    }, {})
  );

  return (
    <div className="space-y-6">
      <div className="page-header">
        <h1 className="text-xl font-semibold">Dashboard</h1>
        <Badge>{String(user?.role ?? "").toUpperCase() || "EMPLOYEE"}</Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="text-sm text-secondary">Total Employees</CardHeader>
          <CardContent className="text-2xl font-semibold">{totalEmployees}</CardContent>
        </Card>
        <Card>
          <CardHeader className="text-sm text-secondary">Active Employees</CardHeader>
          <CardContent className="text-2xl font-semibold">{activeEmployees}</CardContent>
        </Card>
        <Card>
          <CardHeader className="text-sm text-secondary">Pending Leaves</CardHeader>
          <CardContent className="text-2xl font-semibold">{pendingLeaves}</CardContent>
        </Card>
        <Card>
          <CardHeader className="text-sm text-secondary">Today's Attendance</CardHeader>
          <CardContent className="text-2xl font-semibold">{todayAttendance}</CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="flex items-center justify-between">
            <span className="text-sm text-secondary">Leaves Overview</span>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {leavesByType.map(([type, count]) => (
                <div key={type} className="flex items-center gap-3">
                  <span className="w-24 text-sm">{type}</span>
                  <div className="h-2 w-full rounded bg-muted">
                    <div className="h-2 rounded bg-primary" style={{ width: `${leaves.length ? (count / leaves.length) * 100 : 0}%` }} />
                  </div>
                  <span className="text-sm text-secondary">{count}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex items-center justify-between">
            <span className="text-sm text-secondary">Department Distribution</span>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {deptDistribution.map(([dept, count]) => (
                <div key={dept} className="flex items-center gap-3">
                  <span className="w-32 text-sm">{dept}</span>
                  <div className="h-2 w-full rounded bg-muted">
                    <div className="h-2 rounded bg-secondary" style={{ width: `${employees.length ? (count / employees.length) * 100 : 0}%` }} />
                  </div>
                  <span className="text-sm text-secondary">{count}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="text-sm text-secondary">Recent Activity</CardHeader>
        <CardContent>
          <ul className="divide-y divide-border">
            {/* Activity logs will be wired after backend endpoint alignment */}
            <li className="py-3 text-secondary">No recent activity yet</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
