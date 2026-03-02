"use client";
import { useState, useEffect } from "react";
import { Card, CardContent } from "../../components/ui/card";
import { Table, THead, TBody, TR, TH, TD } from "../../components/ui/table";
import { Button } from "../../components/ui/button";
import { Dialog, DialogTrigger, DialogContent, DialogClose } from "../../components/ui/dialog";
import { Input } from "../../components/ui/input";
import { api } from "../../lib/api";
import { Building2, Users, MoreVertical, Plus, Search, Trash2, Edit2, Loader2, Sparkles } from "lucide-react";
import { Badge } from "../../components/ui/badge";
import { ToastRoot, ToastTitle, ToastDescription } from "../../components/ui/toast";

export default function DepartmentsPage() {
  const [departments, setDepartments] = useState<any[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState({ open: false, title: "", description: "" });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [deptRes, empRes] = await Promise.all([
        api.departments.list().catch(() => []) as any,
        api.employees.list().catch(() => []) as any
      ]);
      setDepartments(Array.isArray(deptRes) ? deptRes : (deptRes.departments || []));
      setEmployees(Array.isArray(empRes) ? empRes : (empRes.employees || []));
    } catch (error) {
      console.error("Error fetching data", error);
    } finally {
      setLoading(false);
    }
  };

  async function add() {
    if (!name.trim()) return;
    setIsSubmitting(true);
    try {
      await api.departments.create({ name });
      setName("");
      setOpen(false);
      fetchData();
    } catch (error) {
      console.error("Error adding department", error);
    } finally {
      setIsSubmitting(false);
    }
  }

  async function addDefaults() {
    const defaults = ["IT", "Sales", "HR"];
    setIsSubmitting(true);
    try {
      for (const n of defaults) {
        try {
          await api.departments.create({ name: n });
        } catch {
          // ignore duplicates or errors per item
        }
      }
      setToast({ open: true, title: "Departments Added", description: "IT, Sales and HR have been created." });
      fetchData();
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Departments</h1>
          <p className="text-muted-foreground mt-1">Organize your team into functional departments and units.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="shadow" onClick={addDefaults} disabled={isSubmitting}>
            <Sparkles className="mr-2 h-4 w-4" /> Add IT, Sales, HR
          </Button>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="shadow-lg shadow-primary/20">
                <Plus className="mr-2 h-4 w-4" /> Add Department
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <div className="space-y-4">
                <div className="space-y-2 text-center sm:text-left">
                  <h3 className="text-xl font-bold">New Department</h3>
                  <p className="text-sm text-muted-foreground">Create a new organizational unit.</p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Department Name</label>
                  <Input 
                    placeholder="e.g. Engineering, Marketing, HR" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && add()}
                    autoFocus
                  />
                </div>
                <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-4">
                  <DialogClose asChild>
                    <Button variant="outline">Cancel</Button>
                  </DialogClose>
                  <Button onClick={add} disabled={isSubmitting || !name.trim()}>
                    {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Create Department"}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          [1, 2, 3].map(i => (
            <Card key={i} className="animate-pulse border-none bg-muted/30 h-40" />
          ))
        ) : departments.map((d) => {
          const deptEmployees = employees.filter(e => e.departmentId === d.id);
          return (
            <Card key={d.id} className="border-none shadow-sm hover:shadow-md transition-all group overflow-hidden">
              <div className="h-2 bg-primary/20 group-hover:bg-primary transition-colors" />
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                    <Building2 className="h-6 w-6" />
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary">
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-bold text-foreground truncate">{d.name}</h3>
                    <p className="text-sm text-muted-foreground mt-1">Functional Unit</p>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-border/50">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Users className="h-4 w-4" />
                      <span className="text-sm font-medium">{deptEmployees.length} Members</span>
                    </div>
                    <Badge variant="secondary" className="text-[10px] font-bold uppercase tracking-wider">
                      Active
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {!loading && departments.length === 0 && (
        <div className="py-20 text-center border-2 border-dashed border-border rounded-2xl bg-muted/30">
          <div className="mx-auto h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-6">
            <Building2 className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-bold">No departments yet</h3>
          <p className="text-muted-foreground mt-2 max-w-sm mx-auto">
            Get started by creating your first department to organize your team members.
          </p>
          <div className="mt-6 flex items-center justify-center gap-2">
            <Button variant="outline" onClick={addDefaults}>
              <Sparkles className="mr-2 h-4 w-4" /> Add IT, Sales, HR
            </Button>
            <Button onClick={() => setOpen(true)}>
              <Plus className="mr-2 h-4 w-4" /> Add First Department
            </Button>
          </div>
        </div>
      )}
      <ToastRoot open={toast.open} onOpenChange={(open) => setToast(prev => ({ ...prev, open }))}>
        <ToastTitle>{toast.title}</ToastTitle>
        <ToastDescription>{toast.description}</ToastDescription>
      </ToastRoot>
    </div>
  );
}
