# AlgoViz Task Checklist

This file is the durable progress tracker for the project. Update `[ ]` to `[x]` as work is completed.

## Phase 0 - Project Setup
- [x] Read project blueprint
- [x] Create backend, frontend, and CI directory structure
- [x] Create persistent task checklist
- [x] Initialize git repository
- [x] Create `.env.example`
- [x] Create `docker-compose.yml`

## Phase 1 - Backend
- [x] Add FastAPI application structure
- [x] Add configuration and database session setup
- [x] Add SQLAlchemy models
- [x] Add Alembic configuration and initial migration
- [x] Add auth, API key, algorithm, and share schemas
- [x] Add password, JWT, refresh token, and encryption services
- [x] Add LLM visualization service with deterministic local fallback
- [x] Implement auth routes
- [x] Implement API key routes
- [x] Implement algorithm visualization and history routes
- [x] Implement share routes
- [x] Add backend tests
- [x] Backend tests added
- [x] Run backend tests locally

## Phase 2 - Frontend
- [x] Add Vite React application structure
- [x] Add Tailwind configuration
- [x] Add API clients and Zustand stores
- [x] Add routing and protected routes
- [x] Build auth pages
- [x] Build dashboard, history, visualizer, and shared pages
- [x] Build visualizer components for array, tree, and graph flows
- [x] Run frontend build locally

## Phase 3 - Integration
- [x] Connect frontend to backend API
- [x] Add API key save/list/delete support
- [x] Add visualization submit flow
- [x] Add history and share link flow
- [x] Run backend and frontend locally together
- [x] Test register to visualization to share flow end-to-end

## Phase 4 - Deployment
- [x] Add backend Dockerfile
- [x] Add Docker Compose for local dev
- [x] Add GitHub Actions CI workflow
- [ ] Test Docker build locally
- [x] Document local setup
- [x] Document Render/Supabase deployment steps

## Phase 5 - Final QA
- [ ] Test auth happy path
- [ ] Test API key never returns raw secret
- [ ] Test history list
- [ ] Test public share link
- [ ] Test mobile viewport
- [ ] Write final README polish
