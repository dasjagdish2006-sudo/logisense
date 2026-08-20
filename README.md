# LogiSense AI

**AI-Powered Proactive Logistics Risk Intelligence & Corrective Action Platform**

LogiSense AI predicts shipment delays 24–48 hours in advance, explains the causes of risk, recommends corrective actions, monitors shipments in real time, and exposes an operations command center with LogiBot.

> **Honesty note:** this repository is in **Phase 1 — project initialization**. Features listed as “planned” below are specified but **not implemented yet**. Do not treat this README as a completed-product claim.

---

## Problem

Indian logistics operations typically discover delay only after it has already happened. Weather, festivals, last-mile quality, carrier reliability, and stationary vehicles interact, but they are rarely scored together in time to act.

## Solution (target)

A closed loop:

`data → features → ML risk score → SHAP explanation → corrective actions → alerts → dashboard → LogiBot`

## Current status

| Phase | Name | Status |
|------:|------|--------|
| 1 | Project initialization | **Implemented** |
| 2–29 | Data, ML, product, demo, docs | Not started |

Phase 1 delivers:

- Monorepo layout matching the target architecture
- FastAPI backend with `GET /health` → `{ "status": "ok" }`
- React + TypeScript + Vite + Tailwind health page that probes the live API
- Docker Compose definitions for PostgreSQL 16, Redis 7, backend, and frontend
- `.env.example`, `.gitignore`, MIT license, gap report

See [docs/gap-report.md](docs/gap-report.md) for the full missing-component list and locked implementation order.

---

## Architecture (target)

```
DATA SOURCES → INGESTION → FEATURE ENGINEERING → ML (XGBoost / LSTM / Ensemble)
        → SHAP → RISK ENGINE → Alerts / Actions / Financial Shield
        → FASTAPI → PostgreSQL / Redis / WebSocket → React dashboard → LogiBot
```

Phase 1 only runs the FastAPI process and the React shell. Postgres and Redis are defined in Compose but unused by application code until later phases.

---

## Tech stack

| Layer | Choice |
|-------|--------|
| Backend | Python 3.11, FastAPI, Uvicorn, Pydantic |
| Frontend | React, TypeScript, Vite, Tailwind CSS |
| Data stores | PostgreSQL 16, Redis 7 (Compose only in Phase 1) |
| Containers | Docker Compose |

---

## Project structure

```
logisense/
├── backend/                 # FastAPI application
│   ├── app/main.py          # GET /health
│   ├── tests/test_health.py
│   └── Dockerfile
├── frontend/                # React command-center shell
├── ml/                      # reserved (Phase 4+)
├── data/                    # reserved
├── simulators/              # reserved
├── scripts/                 # reserved
├── docs/
│   └── gap-report.md
├── docker-compose.yml
├── .env.example
└── README.md
```

---

## Prerequisites

- Docker + Docker Compose **or**
- Python 3.11+ and Node.js 20+ for a local (non-Docker) run

---

## Environment

```bash
cp .env.example .env
```

Never put real API keys in source control. `.env` is gitignored.

---

## Run with Docker (preferred)

```bash
cp .env.example .env
docker compose up --build
```

Then:

- Backend health: http://localhost:8000/health
- Backend docs: http://localhost:8000/docs
- Frontend: http://localhost:5173

Expected health payload:

```json
{ "status": "ok" }
```

Stop:

```bash
docker compose down
```

---

## Run locally (no Docker)

Useful when Docker is not installed.

**Backend**

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
pytest
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

**Frontend** (second terminal)

```bash
cd frontend
npm install
npm run dev
```

The Vite dev server proxies `/health` and `/api` to `http://127.0.0.1:8000`.

---

## Tests (Phase 1)

```bash
cd backend
pytest
```

Covers:

- `GET /health` returns `{ "status": "ok" }`
- `GET /api/v1/system/status` reports Phase 1

---

## API (implemented)

| Method | Path | Purpose |
|--------|------|---------|
| GET | `/health` | Liveness `{ "status": "ok" }` |
| GET | `/api/v1/system/status` | Phase / version identity |
| GET | `/docs` | OpenAPI UI |

All other specification endpoints are **not implemented** yet.

---

## Planned capabilities (not in Phase 1)

- 22-feature engineering + XGBoost / LSTM / ensemble + SHAP
- Risk scores, festival engine, weather fallback, GPS simulator
- Corrective actions, Financial Shield, alerts, JWT RBAC
- LogiBot (Gemini + Groq + Hindi)
- India risk map, analytics, admin, demo shipment `SH-2041`

---

## Documentation

| Document | Status |
|----------|--------|
| [docs/gap-report.md](docs/gap-report.md) | Written |
| docs/architecture.md | Phase 28 |
| docs/api.md | Phase 28 |
| docs/ml.md | Phase 28 |
| docs/database.md | Phase 28 |
| docs/deployment.md | Phase 28 |
| docs/demo.md | Phase 28 |

