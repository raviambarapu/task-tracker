from fastapi import APIRouter, Depends
from sqlalchemy import func
from sqlalchemy.orm import Session

from .. import models, schemas
from ..database import get_db

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])


@router.get("", response_model=schemas.DashboardOut)
def get_summary(db: Session = Depends(get_db)):
    total_employees = db.query(func.count(models.Employee.id)).scalar() or 0
    total_tasks = db.query(func.count(models.Task.id)).scalar() or 0

    def count(status_value: str) -> int:
        return db.query(func.count(models.Task.id)).filter(models.Task.status == status_value).scalar() or 0

    return schemas.DashboardOut(
        total_employees=total_employees,
        total_tasks=total_tasks,
        completed_tasks=count("Completed"),
        in_progress_tasks=count("In Progress"),
        pending_tasks=count("Pending"),
    )
