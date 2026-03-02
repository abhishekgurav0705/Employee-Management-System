"use client";
import React, { useState } from "react";
import { Card, CardContent, CardHeader } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { useAuth } from "../../lib/auth";
import { cn } from "../../lib/utils";
import { 
  Building2, 
  Clock, 
  CalendarDays, 
  Bell, 
  ShieldCheck, 
  User, 
  Save,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { ToastRoot, ToastTitle, ToastDescription } from "../../components/ui/toast";

type Tab = "organization" | "work-hours" | "leave-policy" | "notifications" | "roles" | "account";

export default function SettingsPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>("organization");
  const [toast, setToast] = useState({ open: false, title: "", description: "" });

  const isAdmin = user?.role?.toUpperCase() === "ADMIN";

  const showToast = (title: string, description: string) => {
    setToast({ open: true, title, description });
  };

  const tabs: { id: Tab; label: string; icon: any; adminOnly?: boolean }[] = [
    { id: "organization", label: "Organization", icon: Building2, adminOnly: true },
    { id: "work-hours", label: "Work Hours", icon: Clock, adminOnly: true },
    { id: "leave-policy", label: "Leave Policy", icon: CalendarDays, adminOnly: true },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "roles", label: "Roles & Permissions", icon: ShieldCheck, adminOnly: true },
    { id: "account", label: "My Account", icon: User },
  ];

  const visibleTabs = tabs.filter(tab => !tab.adminOnly || isAdmin);

  return (
    <div className="space-y-6">
      <div className="page-header">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">Manage your organization preferences and account security.</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar Tabs */}
        <aside className="w-full md:w-64 space-y-1">
          {visibleTabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors",
                  activeTab === tab.id 
                    ? "bg-primary text-primary-foreground" 
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </button>
            );
          })}
        </aside>

        {/* Content Area */}
        <div className="flex-1 space-y-6">
          {activeTab === "organization" && <OrganizationSettings onSave={showToast} />}
          {activeTab === "work-hours" && <WorkHoursSettings onSave={showToast} />}
          {activeTab === "leave-policy" && <LeavePolicySettings onSave={showToast} />}
          {activeTab === "notifications" && <NotificationSettings onSave={showToast} />}
          {activeTab === "roles" && <RolesPermissionsSettings onSave={showToast} />}
          {activeTab === "account" && <MyAccountSettings user={user} onSave={showToast} />}
        </div>
      </div>

      <ToastRoot open={toast.open} onOpenChange={(open) => setToast(prev => ({ ...prev, open }))}>
        <div className="flex gap-3">
          <CheckCircle2 className="h-5 w-5 text-success" />
          <div className="space-y-1">
            <ToastTitle>{toast.title}</ToastTitle>
            <ToastDescription>{toast.description}</ToastDescription>
          </div>
        </div>
      </ToastRoot>
    </div>
  );
}

function OrganizationSettings({ onSave }: { onSave: (t: string, d: string) => void }) {
  return (
    <Card>
      <CardHeader>
        <h2 className="text-lg font-semibold">Organization Profile</h2>
        <p className="text-sm text-muted-foreground">Update your company details and branding.</p>
      </CardHeader>
      <CardContent className="space-y-4 pt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Company Name</label>
            <Input defaultValue="Acme Corp" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Company Logo</label>
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 rounded bg-muted flex items-center justify-center border border-dashed border-border">
                <Building2 className="h-5 w-5 text-muted-foreground" />
              </div>
              <Button variant="outline" size="sm">Upload New</Button>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Primary Brand Color</label>
            <div className="flex gap-2">
              <Input defaultValue="#3b82f6" className="font-mono" />
              <div className="h-10 w-10 rounded border border-border" style={{ backgroundColor: "#3b82f6" }} />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Timezone</label>
            <select className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm">
              <option>UTC (GMT+00:00)</option>
              <option>EST (GMT-05:00)</option>
              <option>IST (GMT+05:30)</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Default Work Week</label>
            <select className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm">
              <option>Monday - Friday</option>
              <option>Monday - Saturday</option>
              <option>Sunday - Thursday</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Start of Week</label>
            <select className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm">
              <option>Monday</option>
              <option>Sunday</option>
            </select>
          </div>
        </div>
        <div className="pt-4">
          <Button onClick={() => onSave("Settings Saved", "Organization profile has been updated.")}>
            <Save className="h-4 w-4 mr-2" /> Save Changes
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function WorkHoursSettings({ onSave }: { onSave: (t: string, d: string) => void }) {
  return (
    <Card>
      <CardHeader>
        <h2 className="text-lg font-semibold">Attendance & Work Hours</h2>
        <p className="text-sm text-muted-foreground">Configure shifts, grace periods, and attendance rules.</p>
      </CardHeader>
      <CardContent className="space-y-6 pt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Default Shift</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Start Time</label>
                <Input type="time" defaultValue="09:00" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">End Time</label>
                <Input type="time" defaultValue="18:00" />
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Rules</h3>
            <div className="space-y-2">
              <label className="text-sm font-medium">Grace Period (Minutes)</label>
              <Input type="number" defaultValue="15" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Half-day Threshold (Hours)</label>
              <Input type="number" defaultValue="4" />
            </div>
          </div>
        </div>
        <div className="pt-4">
          <Button onClick={() => onSave("Settings Saved", "Work hours and attendance rules updated.")}>
            <Save className="h-4 w-4 mr-2" /> Save Rules
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function LeavePolicySettings({ onSave }: { onSave: (t: string, d: string) => void }) {
  const [holidays, setHolidays] = useState([
    { id: 1, name: "New Year's Day", date: "2026-01-01" },
    { id: 2, name: "Independence Day", date: "2026-08-15" },
  ]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold">Leave Quota</h2>
          <p className="text-sm text-muted-foreground">Define yearly leave types and limits.</p>
        </CardHeader>
        <CardContent className="space-y-4 pt-6">
          <div className="space-y-3">
            {[
              { type: "Casual Leave", quota: 12 },
              { type: "Sick Leave", quota: 8 },
              { type: "Paid Leave", quota: 15 },
            ].map((item) => (
              <div key={item.type} className="flex items-center justify-between p-3 border rounded-md">
                <span className="font-medium">{item.type}</span>
                <div className="flex items-center gap-3">
                  <Input type="number" defaultValue={item.quota} className="w-20" />
                  <span className="text-sm text-muted-foreground">days/year</span>
                </div>
              </div>
            ))}
          </div>
          <Button variant="outline" size="sm" className="w-full">
            <Plus className="h-4 w-4 mr-2" /> Add Leave Type
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold">Holiday Calendar</h2>
          <p className="text-sm text-muted-foreground">Manage company holidays for the current year.</p>
        </CardHeader>
        <CardContent className="space-y-4 pt-6">
          <div className="space-y-2">
            {holidays.map((h) => (
              <div key={h.id} className="flex items-center justify-between p-2 hover:bg-muted rounded-md group">
                <div>
                  <div className="text-sm font-medium">{h.name}</div>
                  <div className="text-xs text-muted-foreground">{h.date}</div>
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100">
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            ))}
          </div>
          <Button variant="outline" size="sm" className="w-full">
            <Plus className="h-4 w-4 mr-2" /> Add Holiday
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

function NotificationSettings({ onSave }: { onSave: (t: string, d: string) => void }) {
  return (
    <Card>
      <CardHeader>
        <h2 className="text-lg font-semibold">Notification Preferences</h2>
        <p className="text-sm text-muted-foreground">Control which emails and alerts you receive.</p>
      </CardHeader>
      <CardContent className="space-y-6 pt-6">
        <div className="space-y-4">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Leave Requests</h3>
          <div className="space-y-3">
            {[
              "Notify me when an employee submits a leave request",
              "Notify me when my leave request is approved/rejected",
              "Weekly leave summary for my department"
            ].map((label, i) => (
              <div key={i} className="flex items-center justify-between">
                <span className="text-sm">{label}</span>
                <input type="checkbox" defaultChecked className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary" />
              </div>
            ))}
          </div>
        </div>
        <div className="space-y-4">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Attendance</h3>
          <div className="space-y-3">
            {[
              "Alert for late check-in",
              "Alert for missing check-out",
              "Monthly attendance report"
            ].map((label, i) => (
              <div key={i} className="flex items-center justify-between">
                <span className="text-sm">{label}</span>
                <input type="checkbox" defaultChecked={i === 0} className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary" />
              </div>
            ))}
          </div>
        </div>
        <Button onClick={() => onSave("Preferences Updated", "Your notification settings have been saved.")}>
          Save Preferences
        </Button>
      </CardContent>
    </Card>
  );
}

function RolesPermissionsSettings({ onSave }: { onSave: (t: string, d: string) => void }) {
  const modules = ["Employees", "Departments", "Leaves", "Attendance", "Activity Log", "Settings"];
  const roles = ["Admin", "Manager", "Employee"];

  return (
    <Card>
      <CardHeader>
        <h2 className="text-lg font-semibold">Roles & Permissions</h2>
        <p className="text-sm text-muted-foreground">Configure access levels for different user roles.</p>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border-collapse">
            <thead>
              <tr className="border-b">
                <th className="py-3 px-4 font-semibold">Module</th>
                {roles.map(role => (
                  <th key={role} className="py-3 px-4 font-semibold text-center">{role}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {modules.map(module => (
                <tr key={module} className="border-b hover:bg-muted/50">
                  <td className="py-3 px-4 font-medium">{module}</td>
                  {roles.map(role => (
                    <td key={`${module}-${role}`} className="py-3 px-4 text-center">
                      <input 
                        type="checkbox" 
                        defaultChecked={role === "Admin" || (role === "Manager" && module !== "Settings") || (role === "Employee" && ["Leaves", "Attendance"].includes(module))}
                        disabled={role === "Admin"}
                        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary disabled:opacity-50" 
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-6 flex items-start gap-2 p-3 bg-muted rounded-md">
          <AlertCircle className="h-4 w-4 text-muted-foreground mt-0.5" />
          <p className="text-xs text-muted-foreground">
            Admin role has full access to all modules by default and cannot be modified. Changes to other roles will take effect upon user re-login.
          </p>
        </div>
        <div className="mt-6">
          <Button onClick={() => onSave("Permissions Updated", "Role-based access controls have been saved.")}>
            Save Matrix
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

import { api } from "../../lib/api";

function MyAccountSettings({ user, onSave }: { user: any, onSave: (t: string, d: string) => void }) {
  const [displayName, setDisplayName] = useState(user?.name || "John Doe");
  const [saving, setSaving] = useState(false);

  const persist = async () => {
    if (!user?.email) {
      onSave("Not Supported", "Missing user id for profile update.");
      return;
    }
    setSaving(true);
    try {
      const [firstName, ...rest] = String(displayName).trim().split(/\s+/);
      const lastName = rest.join(" ") || "NA";
      // Find employee by email and update first/last name
      const list = await api.employees.list() as any;
      const employees = Array.isArray(list) ? list : (list.employees || []);
      const emp = employees.find((e: any) => String(e.email).toLowerCase() === String(user.email).toLowerCase());
      if (!emp) {
        onSave("Not Supported", "No employee found linked to your account.");
        setSaving(false);
        return;
      }
      await api.employees.update(emp.id, { firstName, lastName });
      onSave("Profile Updated", "Your personal information has been saved.");
    } catch (e: any) {
      onSave("Update Failed", e?.message || "Could not update profile.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold">Profile Information</h2>
          <p className="text-sm text-muted-foreground">Manage your personal details and public profile.</p>
        </CardHeader>
        <CardContent className="space-y-4 pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Display Name</label>
              <Input value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Email Address</label>
              <Input defaultValue={user?.email || "john@example.com"} disabled />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Role</label>
              <div>
                <Badge variant="secondary">{user?.role?.toUpperCase() || "EMPLOYEE"}</Badge>
              </div>
            </div>
          </div>
          <Button onClick={persist} disabled={saving}>
            Update Profile
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold">Security</h2>
          <p className="text-sm text-muted-foreground">Secure your account with a strong password and 2FA.</p>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Change Password</h3>
            <div className="grid grid-cols-1 gap-4 max-w-md">
              <div className="space-y-2">
                <label className="text-sm font-medium">Current Password</label>
                <Input type="password" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">New Password</label>
                <Input type="password" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Confirm New Password</label>
                <Input type="password" />
              </div>
            </div>
            <Button variant="outline" onClick={() => onSave("Password Changed", "Your password has been updated successfully.")}>
              Update Password
            </Button>
          </div>

          <div className="pt-6 border-t border-border">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold">Two-Factor Authentication (2FA)</h3>
                <p className="text-xs text-muted-foreground">Add an extra layer of security to your account.</p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline">Coming Soon</Badge>
                <input type="checkbox" disabled className="h-4 w-4 rounded border-gray-300 opacity-50" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
