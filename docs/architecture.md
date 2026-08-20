# Architecture

Phase 1 only establishes the process boundaries. The target architecture is documented in the master specification and [gap-report.md](gap-report.md).

```
[React :5173] --/health,/api--> [FastAPI :8000]
                                      |
                        (unused until Phase 2/3)
                       PostgreSQL 16     Redis 7
```

Detailed component design will be written when those phases land. This file is a placeholder so the docs tree exists.
