"use client";
import { useState } from "react";
import { Card, CardContent, CardHeader } from "../../../components/ui/card";
import { Input } from "../../../components/ui/input";
import { Button } from "../../../components/ui/button";
import { departments, employees } from "../../../lib/mock";
import { ToastRoot, ToastTitle, ToastDescription } from "../../../components/ui/toast";

export default function NewEmployeePage() {
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
    name: "",
    email: "",
    phone: "",
    designation: "",
    departmentId: departments[0]?.id ?? "",
    managerId: employees.find((e) => e.designation.toLowerCase().includes("manager"))?.id ?? "",
    joinDate: "",
    status: "Active"
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [toastOpen, setToastOpen] = useState(false);

  function validate() {
    const e: Record<string, string> = {};
    if (!form.name) e.name = "Name is required";
    if (!form.email) e.email = "Email is required";
    if (!form.designation) e.designation = "Designation is required";
    if (!form.joinDate) e.joinDate = "Join date is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function save() {
    if (!validate()) return;
    setToastOpen(true);
  }

  return (
    <div className="space-y-6">
      <div className="page-header">
        <h1 className="text-xl font-semibold">Add Employee</h1>
      </div>

      <Card>
        <CardHeader className="section-title">Personal Info</CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Input placeholder="Full name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            {errors.name && <p className="mt-1 text-xs text-destructive">{errors.name}</p>}
          </div>
          <div>
            <Input placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            {errors.email && <p className="mt-1 text-xs text-destructive">{errors.email}</p>}
          </div>
          <div>
            <Input placeholder="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="section-title">Job / Department</CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Input placeholder="Designation" value={form.designation} onChange={(e) => setForm({ ...form, designation: e.target.value })} />
            {errors.designation && <p className="mt-1 text-xs text-destructive">{errors.designation}</p>}
          </div>
          <div>
            <select
              className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
              value={form.departmentId}
              onChange={(e) => setForm({ ...form, departmentId: e.target.value })}
            >
              {departments.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
            </select>
          </div>
          <div>
            <select
              className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
              value={form.managerId}
              onChange={(e) => setForm({ ...form, managerId: e.target.value })}
            >
              {employees.filter((e) => e.designation.toLowerCase().includes("manager")).map((e) => (
                <option key={e.id} value={e.id}>{e.name}</option>
              ))}
            </select>
          </div>
          <div>
            <Input type="date" value={form.joinDate} onChange={(e) => setForm({ ...form, joinDate: e.target.value })} />
            {errors.joinDate && <p className="mt-1 text-xs text-destructive">{errors.joinDate}</p>}
          </div>
          <div>
            <select
              className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value as Status })}
            >
              <option>Active</option>
              <option>Inactive</option>
              <option>On Leave</option>
            </select>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-3">
        <Button onClick={save}>Save</Button>
        <Button variant="outline" onClick={() => history.back()}>Cancel</Button>
      </div>
      <ToastRoot open={toastOpen} onOpenChange={setToastOpen}>
        <ToastTitle>Employee saved</ToastTitle>
        <ToastDescription>Mock: ready to integrate with backend</ToastDescription>
      </ToastRoot>
    </div>
  );
}
