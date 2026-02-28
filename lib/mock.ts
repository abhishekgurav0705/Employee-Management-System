import { ActivityLog, AttendanceEntry, Department, Employee, LeaveRequest, User } from "./types";

export const currentUser: User = {
  id: "u-1",
  name: "Alex Johnson",
  email: "alex.johnson@example.com",
  role: "admin",
  avatarUrl: ""
};

export const departments: Department[] = [
  { id: "d-1", name: "Engineering", headId: "e-3" },
  { id: "d-2", name: "HR", headId: "e-5" },
  { id: "d-3", name: "Sales", headId: "e-7" }
];

export const employees: Employee[] = [
  { id: "e-1", name: "John Carter", departmentId: "d-1", designation: "Senior Engineer", joinDate: "2022-05-12", status: "Active", managerId: "e-3", email: "john.carter@example.com", phone: "+1-555-210-4301" },
  { id: "e-2", name: "Priya Singh", departmentId: "d-1", designation: "Frontend Engineer", joinDate: "2023-01-08", status: "Active", managerId: "e-3", email: "priya.singh@example.com", phone: "+1-555-541-8832" },
  { id: "e-3", name: "Daniel Kim", departmentId: "d-1", designation: "Engineering Manager", joinDate: "2021-03-19", status: "Active", email: "daniel.kim@example.com", phone: "+1-555-667-1101" },
  { id: "e-4", name: "Marta Lopez", departmentId: "d-3", designation: "Account Executive", joinDate: "2022-11-22", status: "Active", managerId: "e-7", email: "marta.lopez@example.com" },
  { id: "e-5", name: "Sarah Green", departmentId: "d-2", designation: "HR Lead", joinDate: "2020-07-04", status: "Active", email: "sarah.green@example.com" },
  { id: "e-6", name: "Wei Zhang", departmentId: "d-3", designation: "Sales Ops", joinDate: "2023-06-16", status: "On Leave", managerId: "e-7", email: "wei.zhang@example.com" },
  { id: "e-7", name: "Michael Brown", departmentId: "d-3", designation: "Sales Manager", joinDate: "2019-10-01", status: "Active", email: "michael.brown@example.com" }
];

export const leaves: LeaveRequest[] = [
  { id: "l-1", employeeId: "e-2", type: "Annual", startDate: "2026-03-01", endDate: "2026-03-05", reason: "Vacation", status: "Pending", createdAt: "2026-02-20" },
  { id: "l-2", employeeId: "e-6", type: "Sick", startDate: "2026-02-21", endDate: "2026-02-23", status: "Approved", approverId: "e-5", createdAt: "2026-02-20", updatedAt: "2026-02-21" },
  { id: "l-3", employeeId: "e-4", type: "Unpaid", startDate: "2026-03-10", endDate: "2026-03-12", status: "Rejected", approverId: "e-7", createdAt: "2026-02-22", updatedAt: "2026-02-22" }
];

export const attendance: AttendanceEntry[] = [
  { id: "a-1", employeeId: "e-1", date: "2026-02-27", checkIn: "09:08", checkOut: "17:41" },
  { id: "a-2", employeeId: "e-2", date: "2026-02-27", checkIn: "09:15", checkOut: "17:15" },
  { id: "a-3", employeeId: "e-3", date: "2026-02-27", checkIn: "08:53", checkOut: "18:02" }
];

export const activityLogs: ActivityLog[] = [
  { id: "ac-1", actorId: "e-5", action: "Approved Leave", target: "Wei Zhang - Sick Leave", timestamp: "2026-02-21 10:24" },
  { id: "ac-2", actorId: "e-3", action: "Added Employee", target: "Priya Singh", timestamp: "2026-01-09 09:02" },
  { id: "ac-3", actorId: "e-7", action: "Rejected Leave", target: "Marta Lopez - Unpaid", timestamp: "2026-02-22 15:41" }
];
