export const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";
export type ApiUser = { id: string; email: string; role: string; name?: string };

function delay(ms: number) {
  return new Promise((res) => setTimeout(res, ms));
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const token = typeof window !== "undefined" ? localStorage.getItem("ems_token") : null;
  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(init.headers || {})
  };

  // Auto-upgrade http -> https for same-host Render URLs to avoid mixed-content
  let base = API_BASE;
  if (typeof window !== "undefined" && window.location.protocol === "https:" && API_BASE.startsWith("http://")) {
    try {
      const u = new URL(API_BASE);
      base = `https://${u.host}`;
    } catch {
      // ignore parsing errors and use the original base
    }
  }

  // Lightweight retry for transient network/cold-start errors
  const attempts = [0, 600, 1500]; // ms
  let lastErr: any;
  for (let i = 0; i < attempts.length; i++) {
    if (attempts[i] > 0) await delay(attempts[i]);
    try {
      const res = await fetch(`${base}${path}`, { ...init, headers, mode: "cors" });
      if (res.status === 401 || res.status === 403) {
        if (typeof window !== "undefined") {
          localStorage.removeItem("ems_token");
          window.location.href = "/login";
        }
        throw new Error("unauthorized");
      }
      if (!res.ok) {
        // Retry on typical cold start / transient codes
        if ([502, 503, 504].includes(res.status) && i < attempts.length - 1) continue;
        const errorText = await res.text();
        throw new Error(errorText || `Request failed with status ${res.status}`);
      }
      return res.json();
    } catch (e: any) {
      lastErr = e;
      // fetch throws TypeError on network errors / CORS blocks – retry
      const msg = String(e?.message || "");
      const isNetwork = msg.includes("Failed to fetch") || e?.name === "TypeError";
      if (isNetwork && i < attempts.length - 1) continue;
      break;
    }
  }
  
  const msg = String(lastErr?.message || "");
  if (msg.includes("Failed to fetch")) {
    throw new Error("network_error: Could not reach the API. Check backend status or API base URL.");
  }
  throw lastErr;
}

export const api = {
  auth: {
    login: (email: string, password: string) =>
      request<{ token: string }>("/api/auth/login", { method: "POST", body: JSON.stringify({ email, password }) }),
    me: () => request<{ user: ApiUser } | ApiUser>("/api/auth/me")
  },
  employees: {
    list: () => request("/api/employees"),
    get: (id: string) => request(`/api/employees/${id}`),
    create: (data: any) => request("/api/employees", { method: "POST", body: JSON.stringify(data) }),
    update: (id: string, data: any) => request(`/api/employees/${id}`, { method: "PUT", body: JSON.stringify(data) }),
    remove: (id: string) => request(`/api/employees/${id}`, { method: "DELETE" }),
    resetPassword: (id: string, password: string) =>
      request(`/api/employees/${id}/password`, { method: "PATCH", body: JSON.stringify({ password }) })
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
