# Hermes Doctor — Check Reference

`hermes doctor` runs a comprehensive installation health check. This document explains what each section validates.

## Environment

- **Project**: Path to the checked-out `hermes-agent` repo (used for local tool loading).
- **Python**: Python version and virtual environment status.
- **.env file**: Presence of `~/.hermes/profiles/<profile>/.env`.
- **Model/Provider**: Currently configured default model and provider.

## API Keys

Scans for provider API keys in `.env` and gateway config:
- OpenRouter, OpenAI, Google/Gemini, DeepSeek, xAI, NVIDIA NIM, Z.AI, Kimi, StepPlan, MiniMax, Firecrawl, Tavily, Browser Use, Browserbase, FAL, Tinker, WandB, ElevenLabs, GitHub, Anthropic.

Checkmarks mean:
- ✓ Key present in env/config
- ✗ Missing (not required unless you plan to use that provider)

## Auth Providers

OAuth-based providers needing separate login:
- **Nous Portal** — Must be logged in (`hermes auth`). Shows expiry timestamps.
- **OpenAI Codex** — Requires `codex` CLI login.
- **Google Gemini OAuth** — Requires separate OAuth flow.
- **MiniMax Oauth** — Same.

## Nous Tool Gateway

Validates that managed tools are available through your Nous subscription:
- **Nous Portal** — Connection to portal.nousresearch.com
- **Web tools** — Included by subscription (may be disabled in config)
- **Image generation** — Active via provider integration
- **OpenAI TTS** — Active via Edge TTS fallback
- **Browser automation** — Active via Browser Use
- **Modal execution** — Active via local Modal setup

## API-Key Providers

Additional providers that use raw API keys (not OAuth).

## Configuration Files

- `.env file exists` — `~/.hermes/profiles/<profile>/.env` present
- `API key or custom endpoint configured` — At least one provider key found
- `Config version up to date` — `config.yaml` matches current schema version
- `Could not validate model/provider config` — Warns if config has schema issues (non-fatal)

## Directory Structure

Verifies existence of:
- Profile root
- `cron/`, `sessions/`, `logs/`, `skills/`, `memories/`
- `SOUL.md` (persona configured)
- `MEMORY.md` and `USER.md` (memory files exist)

## Command Installation

- Venv entry point (`venv/bin/hermes`)
- Optional: system-wide `~/.local/bin/hermes` symlink

## External Tools

Checks presence of common system tools:
- `git`, `ripgrep (rg)`, `sqlite3` (optional but recommended)

## Common warnings & fixes

| Warning | Meaning | Fix |
|---|---|---|
| `Could not validate model/provider config` | `config.yaml` has a type/structure mismatch (e.g., string where dict expected). | Run `hermes config validate` or edit `config.yaml` manually. |
| `~/.local/bin/hermes not found` | Hermes not installed globally; you must activate the venv or add to PATH. | `source ~/.hermes/profiles/chief/venv/bin/activate` or create symlink. |
| `OpenAI Codex auth (not logged in)` | You haven't run `codex login` or `hermes auth`. | Run `codex` or `hermes auth` to import tokens. |
| Missing API keys | Expected if you don't use that provider. | Ignore or add key to `.env`. |

## Exit codes

- 0 — All critical checks passed.
- 1 — One or more required components missing or misconfigured.
- 2 — Doctor command itself errored (unexpected).
