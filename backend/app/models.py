from sqlalchemy import Column, Date, ForeignKey, Integer, String, Text
from sqlalchemy.orm import relationship

from .database import Base


class Employee(Base):
    __tablename__ = "employees"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(150), nullable=False, unique=True)
    department = Column(String(100), nullable=False)

    # Deleting an employee also deletes their tasks
    tasks = relationship(
        "Task", back_populates="employee", cascade="all, delete-orphan", passive_deletes=True
    )


class Task(Base):
    __tablename__ = "tasks"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(200), nullable=False)
    description = Column(Text, nullable=True)
    priority = Column(String(10), nullable=False, default="Medium")
    status = Column(String(20), nullable=False, default="Pending", index=True)
    due_date = Column(Date, nullable=False)
    employee_id = Column(
        Integer, ForeignKey("employees.id", ondelete="CASCADE"), nullable=False, index=True
    )

    employee = relationship("Employee", back_populates="tasks")
