import { Card, CardContent, CardHeader } from "../../components/ui/card";
import { activityLogs, employees, leaves, departments } from "../../lib/mock";
import { Badge } from "../../components/ui/badge";
import { formatDate } from "../../lib/utils";

export default function DashboardPage() {
  const totalEmployees = employees.length;
  const activeEmployees = employees.filter(e => e.status === "Active").length;
  const pendingLeaves = leaves.filter(l => l.status === "Pending").length;
  const todayAttendance = 42;

  const leavesByType = Object.entries(
    leaves.reduce<Record<string, number>>((acc, l) => {
      acc[l.type] = (acc[l.type] ?? 0) + 1;
      return acc;
    }, {})
  );

  const deptDistribution = Object.entries(
    employees.reduce<Record<string, number>>((acc, e) => {
      const d = departments.find(d => d.id === e.departmentId)?.name ?? "Unknown";
      acc[d] = (acc[d] ?? 0) + 1;
      return acc;
    }, {})
  );

  return (
    <div className="space-y-6">
      <div className="page-header">
        <h1 className="text-xl font-semibold">Dashboard</h1>
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
                    <div className="h-2 rounded bg-primary" style={{ width: `${(count / leaves.length) * 100}%` }} />
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
                    <div className="h-2 rounded bg-secondary" style={{ width: `${(count / employees.length) * 100}%` }} />
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
            {activityLogs.map((log) => (
              <li key={log.id} className="py-3 flex items-center justify-between">
                <div>
                  <div className="text-sm">{log.action} - {log.target}</div>
                  <div className="text-xs text-secondary">{formatDate(log.timestamp)}</div>
                </div>
                <Badge variant="default">Log</Badge>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
