from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, Query, Response, status
from sqlalchemy.orm import Session, joinedload

from .. import models, schemas
from ..database import get_db

router = APIRouter(prefix="/tasks", tags=["Tasks"])


def to_out(task: models.Task) -> schemas.TaskOut:
    return schemas.TaskOut(
        id=task.id,
        title=task.title,
        description=task.description,
        priority=task.priority,
        status=task.status,
        due_date=task.due_date,
        employee_id=task.employee_id,
        employee_name=task.employee.name,
    )


@router.get("", response_model=List[schemas.TaskOut])
def list_tasks(
    status_filter: Optional[schemas.Status] = Query(None, alias="status", description="Filter by status"),
    db: Session = Depends(get_db),
):
    query = db.query(models.Task).options(joinedload(models.Task.employee))
    if status_filter:
        query = query.filter(models.Task.status == status_filter)
    return [to_out(t) for t in query.order_by(models.Task.id.desc()).all()]


@router.post("", response_model=schemas.TaskOut, status_code=status.HTTP_201_CREATED)
def create_task(payload: schemas.TaskCreate, db: Session = Depends(get_db)):
    if not db.get(models.Employee, payload.employee_id):
        raise HTTPException(status_code=404, detail="Assigned employee not found")

    task = models.Task(
        title=payload.title.strip(),
        description=payload.description,
        priority=payload.priority,
        due_date=payload.due_date,
        employee_id=payload.employee_id,
        status="Pending",
    )
    db.add(task)
    db.commit()
    db.refresh(task)
    return to_out(task)


@router.patch("/{task_id}/status", response_model=schemas.TaskOut)
def update_task_status(task_id: int, payload: schemas.TaskStatusUpdate, db: Session = Depends(get_db)):
    task = db.get(models.Task, task_id)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    task.status = payload.status
    db.commit()
    db.refresh(task)
    return to_out(task)


@router.delete("/{task_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_task(task_id: int, db: Session = Depends(get_db)):
    task = db.get(models.Task, task_id)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    db.delete(task)
    db.commit()
    return Response(status_code=status.HTTP_204_NO_CONTENT)
