import { useCallback, useEffect, useState } from "react";
import { api } from "../api.js";

const STATUSES = ["Pending", "In Progress", "Completed"];
const PRIORITIES = ["Low", "Medium", "High"];
const EMPTY = { title: "", description: "", priority: "Medium", due_date: "", employee_id: "" };

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [form, setForm] = useState(EMPTY);
  const [filter, setFilter] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const loadTasks = useCallback(() => {
    api.getTasks(filter).then(setTasks).catch((e) => setError(e.message));
  }, [filter]);

  useEffect(() => {
    api.getEmployees().then(setEmployees).catch((e) => setError(e.message));
  }, []);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      await api.createTask({ ...form, employee_id: Number(form.employee_id) });
      setForm(EMPTY);
      loadTasks();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const onStatusChange = async (id, status) => {
    try {
      await api.updateTaskStatus(id, status);
      loadTasks();
    } catch (err) {
      setError(err.message);
    }
  };

  const onDelete = async (id) => {
    if (!window.confirm("Delete this task?")) return;
    try {
      await api.deleteTask(id);
      loadTasks();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <section>
      <h2>Tasks</h2>

      {employees.length === 0 && (
        <p className="muted">Add an employee first, then you can assign tasks to them.</p>
      )}

      <form className="form" onSubmit={onSubmit}>
        <input name="title" placeholder="Task title" value={form.title} onChange={onChange} required />
        <input name="description" placeholder="Description" value={form.description} onChange={onChange} />
        <select name="priority" value={form.priority} onChange={onChange}>
          {PRIORITIES.map((p) => <option key={p}>{p}</option>)}
        </select>
        <input name="due_date" type="date" value={form.due_date} onChange={onChange} required />
        <select name="employee_id" value={form.employee_id} onChange={onChange} required>
          <option value="">Assign to…</option>
          {employees.map((emp) => (
            <option key={emp.id} value={emp.id}>{emp.name}</option>
          ))}
        </select>
        <button type="submit" disabled={saving || employees.length === 0}>
          {saving ? "Creating…" : "Create task"}
        </button>
      </form>

      {error && <p className="error">{error}</p>}

      <div className="toolbar">
        <label>
          Filter by status{" "}
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="">All</option>
            {STATUSES.map((s) => <option key={s}>{s}</option>)}
          </select>
        </label>
      </div>

      {tasks.length === 0 ? (
        <p className="muted">No tasks found.</p>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Title</th><th>Description</th><th>Priority</th><th>Due</th>
                <th>Assigned to</th><th>Status</th><th></th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((t) => (
                <tr key={t.id}>
                  <td>{t.title}</td>
                  <td>{t.description || "—"}</td>
                  <td><span className={`badge p-${t.priority.toLowerCase()}`}>{t.priority}</span></td>
                  <td>{t.due_date}</td>
                  <td>{t.employee_name}</td>
                  <td>
                    <select value={t.status} onChange={(e) => onStatusChange(t.id, e.target.value)}>
                      {STATUSES.map((s) => <option key={s}>{s}</option>)}
                    </select>
                  </td>
                  <td><button className="danger" onClick={() => onDelete(t.id)}>Delete</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
