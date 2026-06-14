# MultiFileRAG

Upload documents. Ask questions. Get answers grounded in your files.

---

## Status

| Item | State |
|------|-------|
| **Project phase** | Implementation ready — Phase 1 |
| **Requirements** | PRD v1.0 approved |
| **Technical plan** | v1.0 approved — **$0 hosting** (Vercel + Render + Neon + R2) |
| **Implementation** | **Phase 1 complete** — auth, upload, Files UI ([architecture](docs/ARCHITECTURE.md)) |

---

## Overview

MultiFileRAG is a product concept that enables users to:

1. **Upload files** — any number of text-extractable files (documents, spreadsheets, code), up to **15 MB per file**
2. **Ask questions** — natural-language queries against uploaded content
3. **Get accurate answers** — responses derived from the information in those files

Detailed requirements and the approved free-tier architecture are in the planning docs below.

---

## Planning Documents

| Document | Description |
|----------|-------------|
| [PRD](docs/PRD.md) | Product Requirements Document (v1.0) |
| [Technical Plan](docs/TECHNICAL_PLAN.md) | Approved architecture — **free-tier hosting** |
| [Architecture](docs/ARCHITECTURE.md) | **Implementation reference** — flows, layout, deploy |
| [Phase 1 Plan](docs/plans/implementation-phase-1.md) | Phase 1 tasks (complete) |
| [Features](docs/FEATURES.md) | Feature list, status, and acceptance criteria |
| [Agent Instructions](docs/AGENT_INSTRUCTIONS.md) | Rules for AI agents and developers |

---

## Confirmed Requirements (Summary)

| Requirement | Detail |
|-------------|--------|
| Target user | Individual — personal document Q&A |
| Delivery format | Web application (browser UI, chat-style Q&A) |
| App layout | Tabs: Files \| Chat; sidebar + chat; **desktop-first** (no mobile v1) |
| Authentication | OAuth only — Google + GitHub |
| Persistence | Server-side — files and history until user deletes |
| Chat history | Multiple conversations; New Chat; rename; default title = first question snippet |
| File processing | Per-file status; only Ready files in Q&A; failed = re-upload/replace |
| File upload | Drag-and-drop + file picker; 15 MB/file, 100 MB account total |
| File management | List, delete, replace; past chats unchanged on delete/replace |
| File types | Documents, spreadsheets, source code — see [PRD §9](docs/PRD.md#9-supported-file-types) |
| File size limit | 15 MB per file |
| Account storage limit | 100 MB total; usage always visible on Files tab |
| Q&A delivery | Streamed answers; citations appended at end when enabled |
| Q&A scope | All uploaded files by default; optional subset selection |
| Citations | On by default; file name + excerpt; toggle; preference saved |
| Not-found answers | Clearly state info not in documents — no guessing |
| No Ready files | Allow question; respond that documents aren't ready yet |

---

## Hosting (Pilot — $0/month)

| Service | Purpose | Cost |
|---------|---------|------|
| Vercel | Next.js frontend | Free |
| Render | FastAPI backend | Free |
| Neon | PostgreSQL + pgvector | Free |
| Cloudflare R2 | File storage | Free |
| OpenAI API | LLM + embeddings (Phase 2+) | Pay-as-you-go (~$1–5 study use) |

See [Technical Plan §3](docs/TECHNICAL_PLAN.md#3-free--cheapest-hosting-strategy-pilot) for limits and upgrade path.

---

## Local development

See [docs/ARCHITECTURE.md §9](docs/ARCHITECTURE.md#9-local-development) for full setup.

```bash
make docker-up          # Postgres + MinIO
make api-install && make api-migrate && make api-dev
make web-install && make web-dev   # separate terminal
```

Copy `.env.example` to `apps/api/.env` and `apps/web/.env.local`, then set OAuth credentials and secrets.

Quick check: `curl http://localhost:3000/api/backend/health`

---

**Product (non-blocking):** accuracy metrics, compliance — see [PRD §13](docs/PRD.md#13-open-questions).

---

## For Developers & AI Agents

Read [docs/AGENT_INSTRUCTIONS.md](docs/AGENT_INSTRUCTIONS.md) before making changes.

**During technical planning:**

- Do **not** implement until stack is approved in Technical Plan
- **Do** follow [Technical Plan](docs/TECHNICAL_PLAN.md) for architecture proposals
- **Do** ask the product owner before approving technical decisions

---

## Repository Context

Implementation lives under `apps/web` (Next.js) and `apps/api` (FastAPI). See [Architecture](docs/ARCHITECTURE.md) for system design and local setup.

---

## Revision History

| Date | Change |
|------|--------|
| 2026-06-13 | PRD v1.0 cleanup; Technical Plan created |
| 2026-06-13 | Confirmed target user: individual (personal document Q&A) |
| 2026-06-13 | Confirmed delivery format: web app (browser UI, chat-style Q&A) |
| 2026-06-13 | Confirmed auth + server-side persistence for files and chat history |
| 2026-06-13 | Confirmed optional source citations with user toggle |
| 2026-06-13 | Confirmed file types: documents + spreadsheets + code; no ppt/images |
| 2026-06-13 | Confirmed authentication: OAuth only (no email/password) |
| 2026-06-13 | Confirmed OAuth providers: Google + GitHub |
| 2026-06-13 | Confirmed not-found behavior: state clearly, do not guess |
| 2026-06-13 | Confirmed per-account storage limit: 100 MB total |
| 2026-06-13 | Confirmed multi-file Q&A: all files by default, optional subset |
| 2026-06-13 | Confirmed file management: list, delete, re-upload/replace |
| 2026-06-13 | Confirmed upload UX: drag-and-drop + file picker |
| 2026-06-13 | Confirmed unsupported file handling: reject with clear error |
| 2026-06-13 | Confirmed citation preference persisted per account |
| 2026-06-13 | Confirmed first-visit citation default: on |
| 2026-06-13 | Confirmed citation detail: file name + short excerpt |
| 2026-06-13 | Confirmed answer delivery: streamed + citations at end |
| 2026-06-13 | Confirmed data retention: indefinitely until user deletes |
| 2026-06-13 | Confirmed chat deletion: entire history or individual conversations |
| 2026-06-13 | Confirmed layout: tabbed Files/Chat + sidebar on Chat tab |
| 2026-06-13 | Confirmed file processing: per-file status; only Ready files in Q&A |
| 2026-06-13 | Confirmed conversations: New Chat + optional name/rename |
| 2026-06-13 | Confirmed zero Ready files: allow ask, respond with not-ready guidance |
| 2026-06-13 | Confirmed chat immutability: past answers/citations unchanged on file delete/replace |
| 2026-06-13 | Confirmed storage usage always visible on Files tab |
| 2026-06-13 | Confirmed default conversation title: first question snippet |
| 2026-06-13 | Confirmed failed file recovery: re-upload/replace only (no retry) |
| 2026-06-13 | Confirmed multi-sheet spreadsheets: all sheets indexed |
| 2026-06-13 | Confirmed confirm dialog before file or conversation delete |
| 2026-06-13 | Phase 1 implementation complete — auth, upload, Files UI |
