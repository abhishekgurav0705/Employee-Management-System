"use client";
import { useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader } from "../../../../components/ui/card";
import { Input } from "../../../../components/ui/input";
import { Button } from "../../../../components/ui/button";
import { departments, employees } from "../../../../lib/mock";
import { ToastRoot, ToastTitle, ToastDescription } from "../../../../components/ui/toast";

export default function EditEmployeePage() {
  const params = useParams<{ id: string }>();
  const emp = useMemo(() => employees.find(e => e.id === params?.id), [params]);
  type Status = "Active" | "Inactive" | "On Leave";
  type Form = {
    name: string;
    email: string;
    phone: string;
    designation: string;
    departmentId: string;
    managerId: string;
    joinDate: string;
    status: Status;
  };
  const [form, setForm] = useState<Form>({
    name: emp?.name ?? "",
    email: emp?.email ?? "",
    phone: emp?.phone ?? "",
    designation: emp?.designation ?? "",
    departmentId: emp?.departmentId ?? departments[0]?.id ?? "",
    managerId: emp?.managerId ?? employees.find((e) => e.designation.toLowerCase().includes("manager"))?.id ?? "",
    joinDate: emp?.joinDate ?? "",
    status: emp?.status ?? "Active"
  });
  const [toastOpen, setToastOpen] = useState(false);

  function save() {
    setToastOpen(true);
  }

  return (
    <div className="space-y-6">
      <div className="page-header">
        <h1 className="text-xl font-semibold">Edit Employee</h1>
      </div>

      <Card>
        <CardHeader className="section-title">Personal Info</CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input placeholder="Full name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <Input placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <Input placeholder="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="section-title">Job / Department</CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input placeholder="Designation" value={form.designation} onChange={(e) => setForm({ ...form, designation: e.target.value })} />
          <select
            className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
            value={form.departmentId}
            onChange={(e) => setForm({ ...form, departmentId: e.target.value })}
          >
            {departments.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
          </select>
          <select
            className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
            value={form.managerId}
            onChange={(e) => setForm({ ...form, managerId: e.target.value })}
          >
            {employees.filter((e) => e.designation.toLowerCase().includes("manager")).map((e) => (
              <option key={e.id} value={e.id}>{e.name}</option>
            ))}
          </select>
          <Input type="date" value={form.joinDate} onChange={(e) => setForm({ ...form, joinDate: e.target.value })} />
          <select
            className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value as Status })}
          >
            <option>Active</option>
            <option>Inactive</option>
            <option>On Leave</option>
          </select>
        </CardContent>
      </Card>

      <div className="flex gap-3">
        <Button onClick={save}>Save</Button>
        <Button variant="outline" onClick={() => history.back()}>Cancel</Button>
      </div>
      <ToastRoot open={toastOpen} onOpenChange={setToastOpen}>
        <ToastTitle>Employee updated</ToastTitle>
        <ToastDescription>Mock: ready to integrate with backend</ToastDescription>
      </ToastRoot>
    </div>
  );
}
