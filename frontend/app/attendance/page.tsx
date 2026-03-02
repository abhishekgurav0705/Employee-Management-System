"use client";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader } from "../../components/ui/card";
import { Table, THead, TBody, TR, TH, TD } from "../../components/ui/table";
import { Button } from "../../components/ui/button";
import { api } from "../../lib/api";
import { useAuth } from "../../lib/auth";
import { 
  Clock, 
  MapPin, 
  Calendar, 
  LogIn, 
  LogOut, 
  CheckCircle2, 
  AlertCircle,
  History,
  Info,
  ArrowRight
} from "lucide-react";
import { ToastRoot, ToastTitle, ToastDescription } from "../../components/ui/toast";
import { Badge } from "../../components/ui/badge";
import { cn, formatDate } from "../../lib/utils";

export default function AttendancePage() {
  const { user } = useAuth();
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [toast, setToast] = useState({ open: false, title: "", description: "", variant: "success" as "success" | "error" });

  const fetchAttendance = async () => {
    setLoading(true);
    try {
      const res = await api.attendance.my() as any;
      setRecords(Array.isArray(res) ? res : (res.records || []));
    } catch (e: any) {
      showToast("Error", e?.message ?? "Failed to load attendance", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, []);

  const showToast = (title: string, description: string, variant: "success" | "error" = "success") => {
    setToast({ open: true, title, description, variant });
  };

  const handleAction = async (type: "check-in" | "check-out") => {
    if (!user?.id) return;
    setIsActionLoading(true);
    try {
      const date = new Date().toISOString();
      if (type === "check-in") {
        await api.attendance.checkIn(user.id, date);
        showToast("Checked In", "Good morning! Your entry has been recorded.");
      } else {
        await api.attendance.checkOut(user.id, date);
        showToast("Checked Out", "Work completed! Your exit has been recorded.");
      }
      fetchAttendance();
    } catch (e: any) {
      showToast("Action Failed", e?.message || "Something went wrong.", "error");
    } finally {
      setIsActionLoading(false);
    }
  };

  const todayRecord = records.find(r => new Date(r.date).toDateString() === new Date().toDateString());
  const isCheckedIn = !!todayRecord?.checkInTime;
  const isCheckedOut = !!todayRecord?.checkOutTime;

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Attendance</h1>
          <p className="text-muted-foreground mt-1">Manage your daily work hours and check-ins.</p>
        </div>
        <div className="flex items-center gap-3 bg-card p-1 rounded-xl border border-border shadow-sm">
           <div className="px-4 py-2 text-center">
             <p className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest">Status</p>
             <div className="flex items-center gap-2 mt-1">
               <div className={cn("h-2 w-2 rounded-full", isCheckedIn && !isCheckedOut ? "bg-success animate-pulse" : "bg-muted")} />
               <span className="text-sm font-bold">{isCheckedIn && !isCheckedOut ? "On Duty" : isCheckedOut ? "Shift Ended" : "Off Duty"}</span>
             </div>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <Card className="border-none shadow-sm overflow-hidden">
            <div className={cn("h-1.5", isCheckedIn && !isCheckedOut ? "bg-success" : "bg-primary")} />
            <CardHeader className="pb-2">
              <h2 className="text-lg font-bold">Quick Action</h2>
              <p className="text-xs text-muted-foreground">Check in/out for your current shift.</p>
            </CardHeader>
            <CardContent className="space-y-6 pt-4">
              <div className="text-center py-6 bg-muted/30 rounded-2xl border border-dashed border-border">
                <Clock className="h-10 w-10 text-primary mx-auto mb-2" />
                <p className="text-3xl font-bold tracking-tighter">
                  {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
                <p className="text-xs text-muted-foreground font-medium mt-1">
                  {new Date().toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' })}
                </p>
              </div>

              <div className="grid grid-cols-1 gap-3">
                <Button 
                  size="lg" 
                  className="w-full h-12 shadow-lg shadow-primary/20" 
                  disabled={isCheckedIn || isActionLoading}
                  onClick={() => handleAction("check-in")}
                >
                  <LogIn className="h-4 w-4 mr-2" /> Check In
                </Button>
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="w-full h-12" 
                  disabled={!isCheckedIn || isCheckedOut || isActionLoading}
                  onClick={() => handleAction("check-out")}
                >
                  <LogOut className="h-4 w-4 mr-2" /> Check Out
                </Button>
              </div>

              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between text-sm p-3 rounded-lg bg-muted/50 border border-border/50">
                  <span className="text-muted-foreground">Check In</span>
                  <span className="font-bold">{todayRecord?.checkInTime ? new Date(todayRecord.checkInTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "--:--"}</span>
                </div>
                <div className="flex items-center justify-between text-sm p-3 rounded-lg bg-muted/50 border border-border/50">
                  <span className="text-muted-foreground">Check Out</span>
                  <span className="font-bold">{todayRecord?.checkOutTime ? new Date(todayRecord.checkOutTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "--:--"}</span>
                </div>
              </div>

              <div className="flex items-start gap-2 p-3 bg-muted/50 rounded-lg">
                <Info className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                <p className="text-[10px] text-muted-foreground leading-relaxed">
                  Your location and timestamp are recorded upon check-in. Please ensure you are within the designated work zone.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <Card className="border-none shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between border-b border-border/50 pb-4">
              <div>
                <h2 className="text-lg font-bold">Attendance History</h2>
                <p className="text-xs text-muted-foreground">Your recent log of work hours.</p>
              </div>
              <History className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent className="p-0">
              {loading ? (
                <div className="py-20 text-center">
                  <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-solid border-primary border-r-transparent" />
                  <p className="mt-2 text-xs text-muted-foreground font-medium">Loading history...</p>
                </div>
              ) : records.length === 0 ? (
                <div className="py-20 text-center">
                  <div className="mx-auto h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-4">
                    <Calendar className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold">No records yet</h3>
                  <p className="text-muted-foreground mt-1">You haven't recorded any attendance yet.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table className="min-w-[500px]">
                    <THead className="bg-muted/30">
                      <TR>
                        <TH className="px-6 py-4">Date</TH>
                        <TH className="px-6 py-4">Check In</TH>
                        <TH className="px-6 py-4">Check Out</TH>
                        <TH className="px-6 py-4">Duration</TH>
                        <TH className="px-6 py-4 text-right">Status</TH>
                      </TR>
                    </THead>
                    <TBody className="divide-y divide-border/50">
                      {records.map((r) => {
                        const date = new Date(r.date);
                        const cin = r.checkInTime ? new Date(r.checkInTime) : null;
                        const cout = r.checkOutTime ? new Date(r.checkOutTime) : null;
                        
                        let duration = "-";
                        if (cin && cout) {
                          const diff = Math.abs(cout.getTime() - cin.getTime());
                          const hours = Math.floor(diff / (1000 * 60 * 60));
                          const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
                          duration = `${hours}h ${minutes}m`;
                        }

                        return (
                          <TR key={`${r.employeeId}-${r.date}`} className="hover:bg-muted/30 transition-colors group">
                            <TD className="px-6 py-4">
                              <div className="flex items-center gap-2">
                                <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                                <span className="font-medium">{formatDate(r.date)}</span>
                              </div>
                            </TD>
                            <TD className="px-6 py-4 text-muted-foreground">
                              {cin ? cin.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "-"}
                            </TD>
                            <TD className="px-6 py-4 text-muted-foreground">
                              {cout ? cout.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "-"}
                            </TD>
                            <TD className="px-6 py-4 font-medium text-primary">
                              {duration}
                            </TD>
                            <TD className="px-6 py-4 text-right">
                              <Badge variant={cin && cout ? "success" : "warning"} className="text-[10px] font-bold tracking-wider">
                                {cin && cout ? "COMPLETED" : cin ? "IN PROGRESS" : "MISSING"}
                              </Badge>
                            </TD>
                          </TR>
                        );
                      })}
                    </TBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
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
