"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader } from "../../../components/ui/card";
import { Input } from "../../../components/ui/input";
import { Button } from "../../../components/ui/button";
import { api } from "../../../lib/api";
import { ToastRoot, ToastTitle, ToastDescription } from "../../../components/ui/toast";
import { 
  UserPlus, 
  ArrowLeft, 
  Save, 
  Briefcase, 
  User, 
  Mail, 
  Phone, 
  Calendar,
  Building2,
  Shield,
  Loader2,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { Badge } from "../../../components/ui/badge";
import { cn } from "../../../lib/utils";

export default function NewEmployeePage() {
  const router = useRouter();
  const [departments, setDepartments] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState({ open: false, title: "", description: "", variant: "success" as "success" | "error" });

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    designation: "",
    departmentId: "",
    role: "EMPLOYEE",
    status: "ACTIVE"
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    api.departments.list()
      .then((res: any) => {
        const depts = Array.isArray(res) ? res : (res.departments || []);
        setDepartments(depts);
        if (depts.length > 0) {
          setForm(prev => ({ ...prev, departmentId: depts[0].id }));
        }
      })
      .catch(console.error);
  }, []);

  const showToast = (title: string, description: string, variant: "success" | "error" = "success") => {
    setToast({ open: true, title, description, variant });
  };

  function validate() {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Full name is required";
    if (!form.email.trim()) e.email = "Email address is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Invalid email format";
    if (!form.designation.trim()) e.designation = "Job designation is required";
    if (!form.departmentId) e.departmentId = "Please select a department";
    
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function save() {
    if (!validate()) return;
    
    setIsSubmitting(true);
    try {
      await api.employees.create({
        ...form,
        // Mocking password for new employees
        password: "Password123!" 
      });
      showToast("Employee Added", `${form.name} has been successfully registered.`);
      setTimeout(() => router.push("/employees"), 1500);
    } catch (error: any) {
      showToast("Registration Failed", error.message || "Could not add employee.", "error");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()} className="rounded-full">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Add New Employee</h1>
            <p className="text-muted-foreground mt-1">Onboard a new member to your organization.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8">
        <Card className="border-none shadow-sm overflow-hidden">
          <div className="h-1.5 bg-primary" />
          <CardHeader className="pb-4 border-b border-border/50">
            <div className="flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-bold">Personal Information</h2>
            </div>
          </CardHeader>
          <CardContent className="p-6 pt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="John Doe" 
                    className={cn("pl-10", errors.name && "border-destructive focus-visible:ring-destructive")}
                    value={form.name} 
                    onChange={(e) => setForm({ ...form, name: e.target.value })} 
                  />
                </div>
                {errors.name && <p className="text-xs text-destructive font-medium">{errors.name}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    type="email"
                    placeholder="john@company.com" 
                    className={cn("pl-10", errors.email && "border-destructive focus-visible:ring-destructive")}
                    value={form.email} 
                    onChange={(e) => setForm({ ...form, email: e.target.value })} 
                  />
                </div>
                {errors.email && <p className="text-xs text-destructive font-medium">{errors.email}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="+1 (555) 000-0000" 
                    className="pl-10"
                    value={form.phone} 
                    onChange={(e) => setForm({ ...form, phone: e.target.value })} 
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm overflow-hidden">
          <div className="h-1.5 bg-primary" />
          <CardHeader className="pb-4 border-b border-border/50">
            <div className="flex items-center gap-2">
              <Briefcase className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-bold">Employment Details</h2>
            </div>
          </CardHeader>
          <CardContent className="p-6 pt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold">Job Designation</label>
                <div className="relative">
                  <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="Senior Developer" 
                    className={cn("pl-10", errors.designation && "border-destructive focus-visible:ring-destructive")}
                    value={form.designation} 
                    onChange={(e) => setForm({ ...form, designation: e.target.value })} 
                  />
                </div>
                {errors.designation && <p className="text-xs text-destructive font-medium">{errors.designation}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold">Department</label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <select
                    className={cn(
                      "h-10 w-full rounded-md border border-input bg-background pl-10 pr-3 text-sm focus:ring-1 focus:ring-primary outline-none",
                      errors.departmentId && "border-destructive"
                    )}
                    value={form.departmentId}
                    onChange={(e) => setForm({ ...form, departmentId: e.target.value })}
                  >
                    <option value="" disabled>Select Department</option>
                    {departments.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
                  </select>
                </div>
                {errors.departmentId && <p className="text-xs text-destructive font-medium">{errors.departmentId}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold">System Role</label>
                <div className="relative">
                  <Shield className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <select
                    className="h-10 w-full rounded-md border border-input bg-background pl-10 pr-3 text-sm focus:ring-1 focus:ring-primary outline-none"
                    value={form.role}
                    onChange={(e) => setForm({ ...form, role: e.target.value })}
                  >
                    <option value="EMPLOYEE">Employee</option>
                    <option value="ADMIN">Administrator</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold">Employment Status</label>
                <div className="flex gap-4 pt-2">
                  {["ACTIVE", "INACTIVE"].map((s) => (
                    <label key={s} className="flex items-center gap-2 cursor-pointer group">
                      <input 
                        type="radio" 
                        name="status" 
                        className="h-4 w-4 text-primary focus:ring-primary border-border"
                        checked={form.status === s}
                        onChange={() => setForm({ ...form, status: s })}
                      />
                      <span className={cn(
                        "text-sm font-medium transition-colors",
                        form.status === s ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                      )}>
                        {s.charAt(0) + s.slice(1).toLowerCase()}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center justify-end gap-4 pt-4 border-t border-border">
        <Button variant="ghost" onClick={() => router.back()}>Cancel</Button>
        <Button 
          className="px-8 shadow-lg shadow-primary/20" 
          onClick={save} 
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Adding...</>
          ) : (
            <><Save className="mr-2 h-4 w-4" /> Save Employee</>
          )}
        </Button>
      </div>

      <ToastRoot open={toast.open} onOpenChange={(open) => setToast(prev => ({ ...prev, open }))}>
        <div className="flex gap-3">
          {toast.variant === "success" ? (
            <CheckCircle2 className="h-5 w-5 text-success" />
          ) : (
            <AlertCircle className="h-5 w-5 text-destructive" />
          )}
          <div className="space-y-1">
            <ToastTitle>{toast.title}</ToastTitle>
            <ToastDescription>{toast.description}</ToastDescription>
          </div>
        </div>
      </ToastRoot>
    </div>
  );
}
