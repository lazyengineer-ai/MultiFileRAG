# MultiFileRAG — Agent Development Instructions

| Field | Value |
|-------|-------|
| **Document Version** | 0.4 |
| **Status** | Phase 1 implementation **complete** |
| **Last Updated** | 2026-06-13 |
| **Audience** | AI coding agents and human developers |

---

## 1. Current Phase

```
┌─────────────────────────────────────────────────────────────┐
│  PHASE: Phase 1 complete — Phase 2 (Ingestion) next          │
│  PRD v1.0: APPROVED                                        │
│  Technical Plan v1.0: APPROVED (free-tier hosting)         │
│  Architecture: docs/ARCHITECTURE.md                        │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. Source of Truth

| Priority | Document | Path |
|----------|----------|------|
| 1 | PRD | `docs/PRD.md` |
| 2 | Technical Plan | `docs/TECHNICAL_PLAN.md` |
| 3 | Phase plan | `docs/plans/implementation-phase-1.md` |
| 4 | Features | `docs/FEATURES.md` |
| 5 | This file | `docs/AGENT_INSTRUCTIONS.md` |

---

## 3. Approved Stack (Do Not Change Without PO)

| Layer | Choice |
|-------|--------|
| Frontend | Next.js on **Vercel** (free) |
| Backend | FastAPI on **Render** (free) |
| Database | **Neon** PostgreSQL + pgvector (free) |
| Files | **Cloudflare R2** (free) |
| LLM | OpenAI GPT-4o-mini |
| Embeddings | OpenAI text-embedding-3-small |
| Auth | Auth.js — Google + GitHub only |

**Hosting budget:** $0/month for infra. OpenAI API is pay-as-you-go only.

---

## 4. Implementation Rules

- Follow [Phase 1 plan](./plans/implementation-phase-1.md) task order
- Do not use Render local disk for files (ephemeral) — always R2/MinIO
- Do not add paid services without PO approval
- Match all behavior to PRD §6
- Prefer FastAPI BackgroundTasks over Celery until free-tier limits require Redis

---

## 5. Quick Reference

See PRD §6 and Technical Plan for full requirements. Key pilot constraints:

- 15 MB/file, 100 MB/account
- OAuth only (Google + GitHub)
- Desktop-first; no mobile v1
- Free-tier hosts with documented limitations

---

## 6. Revision History

| Version | Date | Changes |
|---------|------|---------|
| 0.1 | 2026-06-13 | Initial planning instructions |
| 0.2 | 2026-06-13 | Technical planning phase |
| 0.3 | 2026-06-13 | Phase 1 authorized; free-tier hosting approved |
| 0.4 | 2026-06-13 | Phase 1 implementation complete |
