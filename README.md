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

## 4. Deploy the frontend to Vercel

The frontend is a Vite app. Import this repository into Vercel and set the
project's **Root Directory** to `frontend`. Use the default Vite build settings:

- Build command: `npm run build`
- Output directory: `dist`

In the Vercel project settings, add this environment variable and replace the
value with the public URL of your deployed API (no trailing slash):

    VITE_API_URL=https://your-backend.example.com

Redeploy after adding or changing the variable. The frontend calls the API
through `frontend/src/api.js`; the Vercel rewrite in `frontend/vercel.json`
supports client-side routes.

The FastAPI backend and PostgreSQL database must also be deployed and reachable
on the internet; Vercel does not host this project's database. Configure these
environment variables on the backend host:

    DATABASE_URL=<your PostgreSQL connection URL>
    CORS_ORIGINS=https://your-project.vercel.app

For Vercel preview deployments, add their origins to `CORS_ORIGINS` as a
comma-separated list. Keep database credentials in the backend host's
environment settings, not in frontend variables or committed files.
