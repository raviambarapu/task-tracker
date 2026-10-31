# Employee Task Tracker (React + FastAPI + SQL)

## 1. Create the database (PostgreSQL)
    psql -U postgres -c "CREATE DATABASE task_tracker;"
(MySQL: `mysql -u root -p -e "CREATE DATABASE task_tracker;"` and switch DATABASE_URL in backend/.env)

## 2. Backend
    cd backend
    python -m venv venv
    venv\Scripts\activate          # Windows   |  source venv/bin/activate  # macOS/Linux
    pip install -r requirements.txt
    uvicorn app.main:app --reload --port 8000
Swagger UI: http://localhost:8000/docs

## 3. Frontend
    cd frontend
    npm install
    npm run dev
App: http://localhost:5173
