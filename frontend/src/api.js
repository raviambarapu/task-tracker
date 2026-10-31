const BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";

async function request(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  if (!res.ok) {
    let message = `Request failed (${res.status})`;
    try {
      const data = await res.json();
      if (typeof data.detail === "string") message = data.detail;
      else if (Array.isArray(data.detail) && data.detail[0]?.msg) message = data.detail[0].msg;
    } catch {
      /* ignore non-JSON error bodies */
    }
    throw new Error(message);
  }
  return res.status === 204 ? null : res.json();
}

export const api = {
  getDashboard: () => request("/dashboard"),

  getEmployees: (search = "") =>
    request(`/employees${search ? `?search=${encodeURIComponent(search)}` : ""}`),
  createEmployee: (data) => request("/employees", { method: "POST", body: JSON.stringify(data) }),
  deleteEmployee: (id) => request(`/employees/${id}`, { method: "DELETE" }),

  getTasks: (status = "") => request(`/tasks${status ? `?status=${encodeURIComponent(status)}` : ""}`),
  createTask: (data) => request("/tasks", { method: "POST", body: JSON.stringify(data) }),
  updateTaskStatus: (id, status) =>
    request(`/tasks/${id}/status`, { method: "PATCH", body: JSON.stringify({ status }) }),
  deleteTask: (id) => request(`/tasks/${id}`, { method: "DELETE" }),
};
