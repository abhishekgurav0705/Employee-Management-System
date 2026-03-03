"use client";
import { useEffect, useState } from "react";
import { Card, CardContent } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Badge } from "../../../components/ui/badge";
import { api } from "../../../lib/api";
import { useAuth } from "../../../lib/auth";
import { Mail, Phone, Briefcase, Building2, Calendar } from "lucide-react";
import { formatDate } from "../../../lib/utils";
import Link from "next/link";

export default function MyProfilePage() {
  const { user, logout } = useAuth();
  const [profile, setProfile] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api.employees.me()
      .then((res: any) => {
        setProfile(res.employee ?? res);
      })
      .catch(() => setProfile(null))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="py-20 text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent" />
        <p className="mt-4 text-muted-foreground font-medium">Loading your profile...</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="py-20 text-center">
        <p className="text-muted-foreground">Profile not found.</p>
        <Button className="mt-4" onClick={logout}>Logout</Button>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary text-2xl font-bold border-2 border-primary/20">
            {(profile.firstName || profile.name || "E").charAt(0)}
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {profile.firstName && profile.lastName ? `${profile.firstName} ${profile.lastName}` : (profile.name || "Employee")}
            </h1>
            <p className="text-muted-foreground">{user?.role || "EMPLOYEE"}</p>
          </div>
        </div>
        <Badge variant={String(profile.status).toUpperCase() === "ACTIVE" ? "default" : "secondary"}>
          {profile.status}
        </Badge>
      </div>

      <Card className="border-none shadow-sm">
        <CardContent className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>{profile.email}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>{profile.phone || "Not provided"}</span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <Building2 className="h-4 w-4 text-muted-foreground" />
                <span>{profile.department?.name || "N/A"}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Briefcase className="h-4 w-4 text-muted-foreground" />
                <span>{profile.designation || "Team Member"}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>Joined on {formatDate(profile.dateOfJoining || profile.createdAt)}</span>
              </div>
            </div>
          </div>
          <div className="pt-4 border-t border-border">
            <Link href={`/employees/${profile.id}/edit`}>
              <Button variant="outline">Edit Profile</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
