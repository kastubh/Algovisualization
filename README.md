# AlgoViz

AlgoViz is a full-stack algorithm visualization app. Users register, save an encrypted LLM API key, submit an algorithm, and receive animated step-by-step visualizations with history and public sharing.

## Stack

- Backend: FastAPI, SQLAlchemy async, Alembic, JWT auth, Fernet encryption, LiteLLM
- Frontend: React 18, Vite, Tailwind CSS, Zustand, Framer Motion, React Flow
- Local infra: Docker Compose with PostgreSQL

## Local Backend

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
copy ..\.env.example .env
python -c "from cryptography.fernet import Fernet; print(Fernet.generate_key().decode())"
```

Put the generated Fernet key in `backend/.env`, then run:

```bash
alembic upgrade head
uvicorn app.main:app --reload --port 8000
```

## Local Frontend

```bash
cd frontend
npm.cmd install
npm.cmd run dev
```

Open `http://localhost:5173`.

## Demo Visualization

For local testing without a real LLM call, use any API key value starting with `demo` when saving a provider key or submitting a visualization override.

## Docker

```bash
docker compose up --build
```

## CI and Deployment Notes

The GitHub Actions workflow in `.github/workflows/ci.yml` installs backend and frontend dependencies, runs backend tests, and builds the React app.

For Render/Supabase deployment:

1. Create a Supabase PostgreSQL project and copy the async SQLAlchemy URL into `DATABASE_URL`.
2. Create a Render Web Service from `backend/Dockerfile` and set `DATABASE_URL`, `SECRET_KEY`, `FERNET_SECRET_KEY`, and `FRONTEND_URL`.
3. Create a Render Static Site from `frontend`, build with `npm run build`, publish `dist`, and set `VITE_API_BASE_URL` to the backend `/api/v1` URL.
4. Push to `main`; CI should pass before Render auto-deploys.
