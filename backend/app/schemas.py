from datetime import date
from typing import Literal, Optional

from pydantic import BaseModel, ConfigDict, EmailStr, Field

Priority = Literal["Low", "Medium", "High"]
Status = Literal["Pending", "In Progress", "Completed"]


# ---------- Employee ----------
class EmployeeCreate(BaseModel):
    name: str = Field(min_length=1, max_length=100)
    email: EmailStr
    department: str = Field(min_length=1, max_length=100)


class EmployeeOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    email: str
    department: str


# ---------- Task ----------
class TaskCreate(BaseModel):
    title: str = Field(min_length=1, max_length=200)
    description: Optional[str] = None
    priority: Priority = "Medium"
    due_date: date
    employee_id: int


class TaskStatusUpdate(BaseModel):
    status: Status


class TaskOut(BaseModel):
    id: int
    title: str
    description: Optional[str]
    priority: str
    status: str
    due_date: date
    employee_id: int
    employee_name: str


# ---------- Dashboard ----------
class DashboardOut(BaseModel):
    total_employees: int
    total_tasks: int
    completed_tasks: int
    in_progress_tasks: int
    pending_tasks: int
