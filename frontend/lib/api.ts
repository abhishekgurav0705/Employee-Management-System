export const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const token = typeof window !== "undefined" ? localStorage.getItem("ems_token") : null;
  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(init.headers || {})
  };
  const res = await fetch(`${API_BASE}${path}`, { ...init, headers });
  if (res.status === 401 || res.status === 403) {
    if (typeof window !== "undefined") window.location.href = "/login";
    throw new Error("unauthorized");
  }
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export const api = {
  auth: {
    login: (email: string, password: string) =>
      request<{ token: string }>("/api/auth/login", { method: "POST", body: JSON.stringify({ email, password }) }),
    me: () => request("/api/auth/me")
  },
  employees: {
    list: () => request("/api/employees"),
    get: (id: string) => request(`/api/employees/${id}`),
    create: (data: any) => request("/api/employees", { method: "POST", body: JSON.stringify(data) }),
    update: (id: string, data: any) => request(`/api/employees/${id}`, { method: "PUT", body: JSON.stringify(data) }),
    remove: (id: string) => request(`/api/employees/${id}`, { method: "DELETE" })
  },
  departments: {
    list: () => request("/api/departments"),
    create: (data: any) => request("/api/departments", { method: "POST", body: JSON.stringify(data) }),
    update: (id: string, data: any) => request(`/api/departments/${id}`, { method: "PUT", body: JSON.stringify(data) }),
    remove: (id: string) => request(`/api/departments/${id}`, { method: "DELETE" })
  },
  leaves: {
    create: (data: any) => request("/api/leaves", { method: "POST", body: JSON.stringify(data) }),
    my: () => request("/api/leaves/my"),
    pending: () => request("/api/leaves/pending"),
    approve: (id: string) => request(`/api/leaves/${id}/approve`, { method: "PATCH" }),
    reject: (id: string) => request(`/api/leaves/${id}/reject`, { method: "PATCH" })
  },
  attendance: {
    checkIn: (employeeId: string, date: string) =>
      request("/api/attendance/check-in", { method: "POST", body: JSON.stringify({ employeeId, date }) }),
    checkOut: (employeeId: string, date: string) =>
      request("/api/attendance/check-out", { method: "POST", body: JSON.stringify({ employeeId, date }) }),
    my: () => request("/api/attendance/my")
  },
  activityLogs: {
    list: () => request("/api/activity-logs")
  }
};
