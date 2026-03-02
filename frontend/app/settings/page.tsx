"use client";
import { Card, CardContent, CardHeader } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div className="page-header">
        <h1 className="text-xl font-semibold">Settings</h1>
        <Badge>Coming soon</Badge>
      </div>
      <Card>
        <CardHeader className="section-title">Application Settings</CardHeader>
        <CardContent>
          <p className="text-sm text-secondary">
            This is a placeholder Settings page. Core configuration will be added soon.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
