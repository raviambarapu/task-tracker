import { useEffect, useState } from "react";
import { api } from "../api.js";

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api.getDashboard().then(setData).catch((e) => setError(e.message));
  }, []);

  if (error) return <p className="error">{error}</p>;
  if (!data) return <p className="muted">Loading summary…</p>;

  const cards = [
    { label: "Employees", value: data.total_employees },
    { label: "Total tasks", value: data.total_tasks },
    { label: "Pending", value: data.pending_tasks },
    { label: "In progress", value: data.in_progress_tasks },
    { label: "Completed", value: data.completed_tasks },
  ];

  return (
    <section>
      <h2>Dashboard</h2>
      <div className="cards">
        {cards.map((c) => (
          <div className="card" key={c.label}>
            <span className="card-value">{c.value}</span>
            <span className="card-label">{c.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
