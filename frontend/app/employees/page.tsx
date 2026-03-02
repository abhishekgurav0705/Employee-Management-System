"use client";
import { useEffect, useMemo, useState } from "react";
import { Card, CardContent } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { Table, THead, TBody, TR, TH, TD } from "../../components/ui/table";
import Link from "next/link";
import { Drawer, DrawerContent, DrawerTrigger, DrawerClose } from "../../components/ui/drawer";
import { formatDate } from "../../lib/utils";
import { api } from "../../lib/api";
import { 
  Search, 
  Filter, 
  UserPlus, 
  MoreVertical, 
  Mail, 
  Phone, 
  Calendar, 
  MapPin,
  Briefcase,
  Building2,
  X,
  Edit,
  Trash2,
  ChevronRight
} from "lucide-react";
import { Badge } from "../../components/ui/badge";

export default function EmployeesPage() {
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState<string>("all");
  const [status, setStatus] = useState<string>("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [employeesData, setEmployeesData] = useState<any[]>([]);
  const [departmentsData, setDepartmentsData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [deleting, setDeleting] = useState<boolean>(false);
  const [resetting, setResetting] = useState<boolean>(false);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      api.employees.list().catch(() => ({ employees: [] })), 
      api.departments.list().catch(() => ({ departments: [] }))
    ])
      .then(([eRes, dRes]: any[]) => {
        setEmployeesData((eRes.employees ?? eRes) || []);
        setDepartmentsData((dRes.departments ?? dRes) || []);
      })
      .finally(() => setLoading(false));
  }, []);

  const employees = useMemo(() => {
    return employeesData.filter((e) => {
      const matchesSearch =
        (e.name ?? `${e.firstName ?? ""} ${e.lastName ?? ""}`).toLowerCase().includes(search.toLowerCase()) ||
        (e.designation ?? "").toLowerCase().includes(search.toLowerCase()) ||
        (e.email ?? "").toLowerCase().includes(search.toLowerCase());
      const matchesDept = department === "all" || e.departmentId === department;
      const normStatus = String(e.status ?? "").toUpperCase();
      const matchesStatus = status === "all" || normStatus === status.toUpperCase();
      return matchesSearch && matchesDept && matchesStatus;
    });
  }, [search, department, status, employeesData]);

  const selectedEmployee = useMemo(() => 
    employeesData.find(e => e.id === selectedId), 
  [selectedId, employeesData]);

  async function handleDeleteSelected() {
    if (!selectedId) return;
    const employee = employeesData.find(e => e.id === selectedId);
    const name = employee?.name || "this employee";
    const ok = typeof window !== "undefined" ? window.confirm(`Delete ${name}?`) : true;
    if (!ok) return;
    setDeleting(true);
    try {
      await api.employees.remove(selectedId);
      setEmployeesData(prev => prev.filter(e => e.id !== selectedId));
      setSelectedId(null);
    } catch (e) {
      setDeleting(false);
    } finally {
      setDeleting(false);
    }
  }

  async function handleResetPassword() {
    if (!selectedId) return;
    const pwd = typeof window !== "undefined" ? window.prompt("Enter new password (min 6 chars):", "") : "";
    if (!pwd || pwd.length < 6) return;
    setResetting(true);
    try {
      await api.employees.resetPassword(selectedId, pwd);
      // no UI change necessary
    } finally {
      setResetting(false);
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Employee Directory</h1>
          <p className="text-muted-foreground mt-1">Manage and view all your team members in one place.</p>
        </div>
        <Link href="/employees/new">
          <Button className="shadow-lg shadow-primary/20">
            <UserPlus className="mr-2 h-4 w-4" /> Add Employee
          </Button>
        </Link>
      </div>

      <Card className="border-none shadow-sm">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search by name, email, or role..." 
                className="pl-10"
                value={search} 
                onChange={(e) => setSearch(e.target.value)} 
              />
            </div>
            <div className="flex flex-wrap gap-3">
              <select
                className="h-10 rounded-md border border-input bg-background px-3 text-sm focus:ring-1 focus:ring-primary outline-none"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
              >
                <option value="all">All Departments</option>
                {departmentsData.map((d) => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </select>
              <select
                className="h-10 rounded-md border border-input bg-background px-3 text-sm focus:ring-1 focus:ring-primary outline-none"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
              </select>
              <Button variant="ghost" size="sm" onClick={() => { setSearch(""); setDepartment("all"); setStatus("all"); }}>
                Clear Filters
              </Button>
            </div>
          </div>

          {loading ? (
            <div className="py-20 text-center">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" />
              <p className="mt-4 text-muted-foreground font-medium">Fetching team members...</p>
            </div>
          ) : employees.length === 0 ? (
            <div className="py-20 text-center border-2 border-dashed border-border rounded-xl bg-muted/30">
              <div className="mx-auto h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-4">
                <Search className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold">No employees found</h3>
              <p className="text-muted-foreground mt-1">Try adjusting your search or filters to find what you're looking for.</p>
              <Button variant="outline" className="mt-4" onClick={() => { setSearch(""); setDepartment("all"); setStatus("all"); }}>
                Reset Filters
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto -mx-6">
              <Table className="min-w-[800px]">
                <THead className="bg-muted/30">
                  <TR>
                    <TH className="px-6 py-4">Employee</TH>
                    <TH className="px-6 py-4">Department</TH>
                    <TH className="px-6 py-4">Designation</TH>
                    <TH className="px-6 py-4">Join Date</TH>
                    <TH className="px-6 py-4">Status</TH>
                    <TH className="px-6 py-4 w-10"></TH>
                  </TR>
                </THead>
                <TBody className="divide-y divide-border/50">
                  {employees.map((e) => (
                    <TR 
                      key={e.id} 
                      onClick={() => setSelectedId(e.id)} 
                      className="cursor-pointer group hover:bg-muted/50 transition-colors"
                    >
                      <TD className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                            {e.name?.charAt(0) || "E"}
                          </div>
                          <div className="flex flex-col">
                            <span className="font-semibold text-foreground">{e.name}</span>
                            <span className="text-xs text-muted-foreground">{e.email}</span>
                          </div>
                        </div>
                      </TD>
                      <TD className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Building2 className="h-3.5 w-3.5 text-muted-foreground" />
                          <span className="text-sm font-medium">
                            {departmentsData.find(d => d.id === e.departmentId)?.name || "N/A"}
                          </span>
                        </div>
                      </TD>
                      <TD className="px-6 py-4">
                        <span className="text-sm text-muted-foreground">{e.designation || "Team Member"}</span>
                      </TD>
                      <TD className="px-6 py-4 text-sm text-muted-foreground">
                        {formatDate(e.createdAt || new Date().toISOString())}
                      </TD>
                      <TD className="px-6 py-4">
                        <Badge variant={e.status === "ACTIVE" ? "default" : "secondary"} className="font-bold text-[10px] tracking-wider">
                          {e.status}
                        </Badge>
                      </TD>
                      <TD className="px-6 py-4">
                        <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                      </TD>
                    </TR>
                  ))}
                </TBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <Drawer open={!!selectedId} onOpenChange={(open) => !open && setSelectedId(null)}>
        <DrawerContent className="max-w-2xl">
          {selectedEmployee && (
            <div className="h-full flex flex-col">
              <div className="flex items-center justify-between p-6 border-b border-border">
                <h2 className="text-xl font-bold">Employee Details</h2>
                <DrawerClose asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <X className="h-4 w-4" />
                  </Button>
                </DrawerClose>
              </div>
              
              <div className="flex-1 overflow-y-auto p-6 space-y-8">
                <div className="flex items-center gap-6">
                  <div className="h-20 w-20 rounded-2xl bg-primary/10 flex items-center justify-center text-primary text-2xl font-bold border-2 border-primary/20">
                    {selectedEmployee.name?.charAt(0) || "E"}
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-2xl font-bold text-foreground">{selectedEmployee.name}</h3>
                    <p className="text-primary font-medium">{selectedEmployee.designation || "Team Member"}</p>
                    <Badge variant={selectedEmployee.status === "ACTIVE" ? "default" : "secondary"}>
                      {selectedEmployee.status}
                    </Badge>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Contact Information</h4>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 text-sm">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span>{selectedEmployee.email}</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span>{selectedEmployee.phone || "Not provided"}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Employment Details</h4>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 text-sm">
                        <Briefcase className="h-4 w-4 text-muted-foreground" />
                        <span>{departmentsData.find(d => d.id === selectedEmployee.departmentId)?.name || "N/A"}</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>Joined on {formatDate(selectedEmployee.createdAt || new Date().toISOString())}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-border">
                   <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">Quick Actions</h4>
                   <div className="flex flex-wrap gap-3">
                    <Link href={`/employees/${selectedId}/edit`}>
                       <Button variant="outline" size="sm">
                         <Edit className="h-4 w-4 mr-2" /> Edit Profile
                       </Button>
                     </Link>
                     <Button 
                       variant="outline" 
                       size="sm"
                       onClick={handleResetPassword}
                       disabled={resetting}
                     >
                       {resetting ? "Resetting..." : "Reset Password"}
                     </Button>
                     <Button 
                       variant="outline" 
                       size="sm" 
                       className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                       onClick={handleDeleteSelected}
                       disabled={deleting}
                     >
                       <Trash2 className="h-4 w-4 mr-2" /> {deleting ? "Deleting..." : "Delete"}
                     </Button>
                   </div>
                </div>
              </div>
              
              <div className="p-6 border-t border-border bg-muted/30">
                <Button className="w-full" variant="secondary" onClick={() => setSelectedId(null)}>
                  Close
                </Button>
              </div>
            </div>
          )}
        </DrawerContent>
      </Drawer>
    </div>
  );
}
