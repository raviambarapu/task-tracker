import { useState } from "react";
import "./index.css";
import Dashboard from "./pages/Dashboard.jsx";
import Employees from "./pages/Employees.jsx";
import Tasks from "./pages/Tasks.jsx";



const TABS = ["Dashboard", "Employees", "Tasks"];

export default function App() {
  const [tab, setTab] = useState("Dashboard");

  return (
    <div className="app">
      <header className="topbar">
        <h1>Task Tracker</h1>
        <nav>
          {TABS.map((t) => (
            <button key={t} className={t === tab ? "tab active" : "tab"} onClick={() => setTab(t)}>
              {t}
            </button>
          ))}
        </nav>
      </header>

      <main>
        {tab === "Dashboard" && <Dashboard />}
        {tab === "Employees" && <Employees />}
        {tab === "Tasks" && <Tasks />}
      </main>
    </div>
  );
}
