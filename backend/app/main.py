import os

from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from . import models  # noqa: F401  (registers tables)
from .database import Base, engine
from .routers import dashboard, employees, tasks

load_dotenv()

# Create tables if they do not exist yet
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Employee Task Tracker API", version="1.0.0")

origins = [o.strip() for o in os.getenv("CORS_ORIGINS", "http://localhost:5173").split(",") if o.strip()]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(employees.router)
app.include_router(tasks.router)
app.include_router(dashboard.router)


@app.get("/", tags=["Health"])
def root():
    return {"message": "Employee Task Tracker API is running", "docs": "/docs"}
