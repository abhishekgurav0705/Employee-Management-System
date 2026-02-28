export type Role = "admin" | "hr" | "manager" | "employee";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatarUrl?: string;
}

export interface Department {
  id: string;
  name: string;
  headId?: string;
}

export interface Employee {
  id: string;
  name: string;
  departmentId: string;
  designation: string;
  joinDate: string;
  status: "Active" | "Inactive" | "On Leave";
  managerId?: string;
  email: string;
  phone?: string;
}

export type LeaveStatus = "Pending" | "Approved" | "Rejected";

export interface LeaveRequest {
  id: string;
  employeeId: string;
  type: "Annual" | "Sick" | "Unpaid" | "Other";
  startDate: string;
  endDate: string;
  reason?: string;
  status: LeaveStatus;
  approverId?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface AttendanceEntry {
  id: string;
  employeeId: string;
  date: string;
  checkIn?: string;
  checkOut?: string;
}

export interface ActivityLog {
  id: string;
  actorId: string;
  action: string;
  target: string;
  timestamp: string;
}
