# Hermes Profile Directory Layout

## Active profile binding

The active profile (e.g., `chief`) has its HOME directory bound into the Hermes tree:

```
~/.hermes/  → symlink/evaluates to
~/.hermes/profiles/chief/home/.hermes/
```

This means `~/.hermes/profiles/chief/home` is the actual HOME for the active profile. Inside it you'll find:
- `.config/hermes/` (may appear under the HOME path)
- `.local/` (bin, share, state)
- Library/Caches, etc.

## Per-profile root structure

Each profile `P` lives at:

```
~/.hermes/profiles/P/
├── bin/                    # Profile-specific scripts
├── cache/                  # HTTP/file cache (uv, etc.)
├── config.yaml             # Profile config
├── cron/                   # Scheduled job JSON files
├── home/                   # HOME directory binding (active profile only)
│   └── .hermes/            # Evaluated symlink back to profile root
├── logs/                   # Hermes logs per-profile
├── memories/               # Memory files
│   ├── MEMORY.md           # Persistent memory (durable facts)
│   ├── MEMORY.md.lock      # Concurrency lock (safe to ignore)
│   ├── USER.md             # User profile/preferences
│   └── USER.md.lock
├── sessions/               # Session transcript files (.json/.txt)
├── skills/                 # Loaded skills (SKILL.md + support files)
├── state.db                # SQLite: sessions, kanban, context
├── state.db-wal            # WAL log (normal)
├── state.db-shm            # Shared memory (normal)
├── memory_store.db         # SQLite: vector memory facts
├── memory_store.db-wal
├── memory_store.db-shm
├── SOUL.md                 # Agent persona definition
├── auth.json               # Auth tokens (Nous, etc.)
├── .env                    # Environment variables
├── gateway_state.json      # Tool gateway state
└── .skills_prompt_snapshot.json  # Last prompt snapshot (~50–100 KB)

```

## Key invariants

- Profiles are **fully isolated**: separate DBs, separate memories, separate sessions.
- The "active" profile is the one whose `home/` directory is bound to `~/.hermes/` root via symlink/evaluation.
- Global Hermes binary lives at `~/.local/bin/hermes` (venv entry point).
- State databases (`state.db`, `memory_store.db`) reside at the profile root, not inside `home/`.

## Common inspection commands

```bash
# Real path of the active Hermes root
realpath ~/.hermes

# All profiles
ls -1 ~/.hermes/profiles/

# Active profile's real home
ls -la ~/.hermes/profiles/chief/home
```

## File size norms (approx.)

- `state.db`: 20–50 MB (grows with session count)
- `memory_store.db`: 80–100 KB (vector memory facts)
- `.skills_prompt_snapshot.json`: 50–100 KB (single large JSON)
- `MEMORY.md`: 1–2 KB (compressed durable memory)
- `USER.md`: 600–700 bytes (user profile)
