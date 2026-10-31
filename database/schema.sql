-- Reference schema (PostgreSQL). The FastAPI app also creates these tables
-- automatically on startup, so running this file is optional.
CREATE TABLE IF NOT EXISTS employees (
    id          SERIAL PRIMARY KEY,
    name        VARCHAR(100) NOT NULL,
    email       VARCHAR(150) NOT NULL UNIQUE,
    department  VARCHAR(100) NOT NULL
);

CREATE TABLE IF NOT EXISTS tasks (
    id           SERIAL PRIMARY KEY,
    title        VARCHAR(200) NOT NULL,
    description  TEXT,
    priority     VARCHAR(10)  NOT NULL DEFAULT 'Medium',   -- Low | Medium | High
    status       VARCHAR(20)  NOT NULL DEFAULT 'Pending',  -- Pending | In Progress | Completed
    due_date     DATE NOT NULL,
    employee_id  INTEGER NOT NULL REFERENCES employees(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_tasks_employee ON tasks(employee_id);
CREATE INDEX IF NOT EXISTS idx_tasks_status   ON tasks(status);
