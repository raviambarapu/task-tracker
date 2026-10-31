import { useCallback, useEffect, useState } from "react";
import { api } from "../api.js";

const EMPTY = { name: "", email: "", department: "" };

export default function Employees() {
  const [employees, setEmployees] = useState([]);
  const [form, setForm] = useState(EMPTY);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const load = useCallback(() => {
    api.getEmployees(search).then(setEmployees).catch((e) => setError(e.message));
  }, [search]);

  useEffect(() => {
    load();
  }, [load]);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      await api.createEmployee(form);
      setForm(EMPTY);
      load();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const onDelete = async (emp) => {
    if (!window.confirm(`Delete ${emp.name}? Their tasks will be deleted too.`)) return;
    try {
      await api.deleteEmployee(emp.id);
      load();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <section>
      <h2>Employees</h2>

      <form className="form" onSubmit={onSubmit}>
        <input name="name" placeholder="Full name" value={form.name} onChange={onChange} required />
        <input name="email" type="email" placeholder="Email" value={form.email} onChange={onChange} required />
        <input name="department" placeholder="Department" value={form.department} onChange={onChange} required />
        <button type="submit" disabled={saving}>{saving ? "Adding…" : "Add employee"}</button>
      </form>

      {error && <p className="error">{error}</p>}

      <div className="toolbar">
        <input
          className="search"
          placeholder="Search by name"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {employees.length === 0 ? (
        <p className="muted">No employees yet. Add one using the form above.</p>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>ID</th><th>Name</th><th>Email</th><th>Department</th><th></th></tr>
            </thead>
            <tbody>
              {employees.map((emp) => (
                <tr key={emp.id}>
                  <td>{emp.id}</td>
                  <td>{emp.name}</td>
                  <td>{emp.email}</td>
                  <td>{emp.department}</td>
                  <td><button className="danger" onClick={() => onDelete(emp)}>Delete</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
