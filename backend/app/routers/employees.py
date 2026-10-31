from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, Query, Response, status
from sqlalchemy.orm import Session

from .. import models, schemas
from ..database import get_db

router = APIRouter(prefix="/employees", tags=["Employees"])


@router.get("", response_model=List[schemas.EmployeeOut])
def list_employees(
    search: Optional[str] = Query(None, description="Search by employee name"),
    db: Session = Depends(get_db),
):
    query = db.query(models.Employee)
    if search:
        query = query.filter(models.Employee.name.ilike(f"%{search}%"))
    return query.order_by(models.Employee.id.desc()).all()


@router.post("", response_model=schemas.EmployeeOut, status_code=status.HTTP_201_CREATED)
def create_employee(payload: schemas.EmployeeCreate, db: Session = Depends(get_db)):
    email = payload.email.lower()
    if db.query(models.Employee).filter(models.Employee.email == email).first():
        raise HTTPException(status_code=409, detail="An employee with this email already exists")

    employee = models.Employee(name=payload.name.strip(), email=email, department=payload.department.strip())
    db.add(employee)
    db.commit()
    db.refresh(employee)
    return employee


@router.delete("/{employee_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_employee(employee_id: int, db: Session = Depends(get_db)):
    employee = db.get(models.Employee, employee_id)
    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")
    db.delete(employee)
    db.commit()
    return Response(status_code=status.HTTP_204_NO_CONTENT)
