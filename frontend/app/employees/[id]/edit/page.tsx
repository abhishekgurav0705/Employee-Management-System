"use client";
import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader } from "../../../../components/ui/card";
import { Input } from "../../../../components/ui/input";
import { Button } from "../../../../components/ui/button";
import { api } from "../../../../lib/api";
import { ToastRoot, ToastTitle, ToastDescription } from "../../../../components/ui/toast";
import { 
  ArrowLeft, 
  Save, 
  User, 
  Mail, 
  Phone, 
  Briefcase, 
  Building2, 
  Shield, 
  Loader2,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { cn } from "../../../../lib/utils";

export default function EditEmployeePage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [departments, setDepartments] = useState<any[]>([]);
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
    fetchData();
  }, [params?.id]);

  const fetchData = async () => {
    if (!params?.id) return;
    setLoading(true);
    try {
      const [empRes, deptRes] = await Promise.all([
        api.employees.get(params.id),
        api.departments.list()
      ]);
      
      const emp = (empRes as any).employee ?? empRes;
      const depts = Array.isArray(deptRes) ? deptRes : (deptRes as any).departments || [];
      
      setDepartments(depts);
      setForm({
        name: emp.name || "",
        email: emp.email || "",
        phone: emp.phone || "",
        designation: emp.designation || "",
        departmentId: emp.departmentId || "",
        role: emp.role || "EMPLOYEE",
        status: emp.status || "ACTIVE"
      });
    } catch (error) {
      console.error("Error fetching data", error);
      showToast("Error", "Could not load employee data.", "error");
    } finally {
      setLoading(false);
    }
  };

  const showToast = (title: string, description: string, variant: "success" | "error" = "success") => {
    setToast({ open: true, title, description, variant });
  };

  function validate() {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Full name is required";
    if (!form.email.trim()) e.email = "Email address is required";
    if (!form.designation.trim()) e.designation = "Job designation is required";
    
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function save() {
    if (!validate() || !params?.id) return;
    
    setIsSubmitting(true);
    try {
      await api.employees.update(params.id, form);
      showToast("Employee Updated", "Changes have been saved successfully.");
      setTimeout(() => router.push("/employees"), 1500);
    } catch (error: any) {
      showToast("Update Failed", error.message || "Could not update employee.", "error");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="py-20 text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent" />
        <p className="mt-4 text-muted-foreground font-medium">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()} className="rounded-full">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Edit Profile</h1>
            <p className="text-muted-foreground mt-1">Update employee information and system access.</p>
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
                    className={cn("pl-10", errors.name && "border-destructive")}
                    value={form.name} 
                    onChange={(e) => setForm({ ...form, name: e.target.value })} 
                  />
                </div>
                {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    type="email"
                    className={cn("pl-10", errors.email && "border-destructive")}
                    value={form.email} 
                    onChange={(e) => setForm({ ...form, email: e.target.value })} 
                  />
                </div>
                {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
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
                    className={cn("pl-10", errors.designation && "border-destructive")}
                    value={form.designation} 
                    onChange={(e) => setForm({ ...form, designation: e.target.value })} 
                  />
                </div>
                {errors.designation && <p className="text-xs text-destructive">{errors.designation}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold">Department</label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <select
                    className="h-10 w-full rounded-md border border-input bg-background pl-10 pr-3 text-sm focus:ring-1 focus:ring-primary outline-none"
                    value={form.departmentId}
                    onChange={(e) => setForm({ ...form, departmentId: e.target.value })}
                  >
                    <option value="">Select Department</option>
                    {departments.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
                  </select>
                </div>
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
            <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</>
          ) : (
            <><Save className="mr-2 h-4 w-4" /> Update Profile</>
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
