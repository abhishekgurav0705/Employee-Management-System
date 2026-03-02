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

export default function EmployeesPage() {
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState<string>("all");
  const [status, setStatus] = useState<string>("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [employeesData, setEmployeesData] = useState<any[]>([]);
  const [departmentsData, setDepartmentsData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([api.employees.list().catch(() => ({ employees: [] })), api.departments.list().catch(() => ({ departments: [] }))])
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
        (e.designation ?? "").toLowerCase().includes(search.toLowerCase());
      const matchesDept = department === "all" || e.departmentId === department;
      const normStatus = String(e.status ?? "").toUpperCase();
      const matchesStatus = status === "all" || normStatus === status.toUpperCase();
      return matchesSearch && matchesDept && matchesStatus;
    });
  }, [search, department, status, employeesData]);

  return (
    <div className="space-y-6">
      <div className="page-header">
        <h1 className="text-xl font-semibold">Employee Directory</h1>
        <Link href="/employees/new">
          <Button>Add Employee</Button>
        </Link>
      </div>

      <Card>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-4">
            <Input placeholder="Search employees" value={search} onChange={(e) => setSearch(e.target.value)} />
            <select
              className="h-10 rounded-md border border-input bg-background px-3 text-sm"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
            >
              <option value="all">All Departments</option>
              {departmentsData.map((d) => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>
            <select
              className="h-10 rounded-md border border-input bg-background px-3 text-sm"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
            </select>
            <Button variant="outline" onClick={() => { setSearch(""); setDepartment("all"); setStatus("all"); }}>
              Reset
            </Button>
          </div>

          {loading ? (
            <div className="rounded-lg border border-border p-8 text-center text-secondary">Loading employees...</div>
          ) : employees.length === 0 ? (
            <div className="rounded-lg border border-border p-8 text-center text-secondary">
              No employees found yet
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <THead>
                  <TR>
                    <TH>Name</TH>
                    <TH>Department</TH>
                    <TH>Designation</TH>
                    <TH>Join Date</TH>
                    <TH>Status</TH>
                  </TR>
                </THead>
                <TBody>
                  {employees.map((e) => (
                    <TR key={e.id} onClick={() => setSelectedId(e.id)} className="cursor-pointer">
                      <TD>{e.name ?? `${e.firstName ?? ""} ${e.lastName ?? ""}`}</TD>
                      <TD>{departmentsData.find((d) => d.id === e.departmentId)?.name ?? "-"}</TD>
                      <TD>{e.designation}</TD>
                      <TD>{formatDate(e.dateOfJoining ?? e.joinDate)}</TD>
                      <TD>{String(e.status ?? "").toUpperCase()}</TD>
                    </TR>
                  ))}
                </TBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <Drawer open={!!selectedId} onOpenChange={(o) => !o && setSelectedId(null)}>
        <DrawerTrigger asChild />
        <DrawerContent>
          {selectedId ? (
            <EmployeeDetail id={selectedId} employees={employeesData} departments={departmentsData} />
          ) : null}
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

function EmployeeDetail({ id, employees, departments }: { id: string, employees: any[], departments: any[] }) {
  const e = employees.find((x) => x.id === id);
  if (!e) return <div className="text-secondary">Employee not found</div>;
  const dept = departments.find((d) => d.id === e.departmentId)?.name ?? "";
  return (
    <div>
      <h3 className="text-lg font-semibold">{e.name ?? `${e.firstName ?? ""} ${e.lastName ?? ""}`}</h3>
      <div className="subtle">{e.designation} • {dept}</div>
      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="rounded-lg border border-border p-3">
          <div className="text-xs text-secondary">Email</div>
          <div className="text-sm">{e.email}</div>
        </div>
        <div className="rounded-lg border border-border p-3">
          <div className="text-xs text-secondary">Phone</div>
          <div className="text-sm">{e.phone ?? "-"}</div>
        </div>
        <div className="rounded-lg border border-border p-3">
          <div className="text-xs text-secondary">Join Date</div>
          <div className="text-sm">{formatDate(e.dateOfJoining ?? e.joinDate)}</div>
        </div>
        <div className="rounded-lg border border-border p-3">
          <div className="text-xs text-secondary">Status</div>
          <div className="text-sm">{String(e.status ?? "").toUpperCase()}</div>
        </div>
      </div>
      <div className="mt-6">
        <Link href={`/employees/${id}/edit`}>
          <Button>Edit</Button>
        </Link>
      </div>
    </div>
  );
}
