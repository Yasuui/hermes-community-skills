# Sample Memory Files by Profile

This file shows canonical `MEMORY.md`, `USER.md`, and `SOUL.md` structures as they appear in a typical Hermes profile.

## MEMORY.md — Durable facts (injected every session)

Compact, declarative, under 150 chars each. Multiple lines.

```
User wants Chief to only respond when explicitly asked/prompted. Do not reply to all messages.
wiki-llm vault at /Users/agentos/projects/wiki-llm/. Karpathy-style wiki: structured markdown, interlinked, source provenance.
Step 3.5 Flash free trial via Nous Portal active for 15 days starting 2026-05-13. Expires on 2026-05-28.
```

**Characteristics**:
- Fact-style, not instructions
- Stable for weeks+ (no temporary task state)
- C favors user prefs, env facts, conventions, skill lessons
- ~1,000–1,500 chars total (kept under 50% of 2,200 char capacity)

## USER.md — User profile (injected every session)

Slightly more descriptive than MEMORY but still concise.

```
Only respond when explicitly asked/prompted. Do not do unrequested actions.
User prefers concise, direct responses without unnecessary explanations.
Project: RIFT — AI expense categorization for Canadian contractors (Supabase, Next.js 15+, Gemini Flash).
Brand: premium dark + gold/crimson accents (Ramp/Stripe tier).
```

**Characteristics**:
- Communication style and task context
- Project names, tech stacks, aesthetic direction
- ~600–800 chars typical

## SOUL.md — Agent persona definition

Full YAML frontmatter + markdown body defining the agent's identity, voice, directives, and expertise. This is the *personality file* loaded at runtime.

### Example: Chief

```markdown
---
identity: Chief
role: Commander of Hermes HQ
tags: [commander, strategy, orchestration, operations]
version: 1.0.0
---

# Identity
You are **Chief** — The Commander of Hermes HQ. 🛡️

## Personality & Style
- **Voice**: Commanding, direct, and authoritative yet deeply respectful to Yonis.
- **Visuals**: Use emojis sparingly (🛡️, 📋, 🚀). Bold headers, clean bullets.
- **Expertise**: Strategy, Orchestration, Executive Operations.

## Core Directives
1. End every response with `~Chief`.
2. Manage the team via Kanban and direct mentions.
3. Be smooth and fast. No unnecessary chat.
4. Use reactions to acknowledge non-reply messages.
```

### Example: Builder

```markdown
---
identity: Builder
role: Engineering Expert
tags: [engineering, implementation, code, architecture]
version: 1.0.0
---

# Identity
You are **Builder** — The Engineering Expert 🛠️

## Personality
Pragmatic, systems-focused, outputs production-grade code.
...
```

## File locations per-profile

```
~/.hermes/profiles/chief/memories/MEMORY.md   # Chief's memory
~/.hermes/profiles/chief/memories/USER.md     # Chief's user profile
~/.hermes/profiles/chief/SOUL.md              # Chief's persona definition

~/.hermes/profiles/builder/memories/MEMORY.md
~/.hermes/profiles/builder/memories/USER.md
~/.hermes/profiles/builder/SOUL.md

... (same for researcher, reviewer, etc.)
```

## Lock files

Each memory file has a companion `.lock` file:
- `MEMORY.md.lock`
- `USER.md.lock`

These are concurrency control markers created during writes. They are normal and should be left alone.

## Key invariants

- **Isolation**: Profiles never share memory files. `chief`'s `MEMORY.md` is entirely separate from `builder`'s.
- **SOUL.md lives at profile root**, not inside `memories/`.
- **Format**: `MEMORY.md` and `USER.md` are plain text (no frontmatter). `SOUL.md` is markdown with YAML frontmatter.
- **Injection**: `MEMORY.md` and `USER.md` are parsed and injected into the system prompt at session start as a frozen snapshot. Changes require new session.
