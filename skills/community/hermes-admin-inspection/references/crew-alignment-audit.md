# Crew Alignment Audit Protocol

**Session:** 2026-05-14 | **Scope:** Multi-profile inspection before fixes

## Purpose

Comprehensive audit of all Hermes profiles to ensure consistency across model assignments, tool configurations, credentials, and access patterns. Executed as Phase 1 (audit) / Phase 2 (fixes) workflow.

## Audit Checklist

### 1. Profile Configuration Table

| Profile    | Model              | Compressor | WIKI_PATH | SOUL     | llm-wiki | claude-code |
|------------|--------------------|------------|-----------|----------|----------|-------------|
| default    | [from config]      | [threshold]| [env var] | [exists] | [status] | [status]    |
| builder    | [from config]      | [threshold]| [env var] | [exists] | [status] | [status]    |
| chief      | [from config]      | [threshold]| [env var] | [exists] | [status] | [status]    |
| researcher | [from config]      | [threshold]| [env var] | [exists] | [status] | [status]    |
| reviewer   | [from config]      | [threshold]| [env var] | [exists] | [status] | [status]    |

**Data sources:**
- Model: `~/.hermes/profiles/<profile>/config.yaml` → `model.default`, `model.provider`
- Compressor: `~/.hermes/profiles/<profile>/config.yaml` → `context.threshold` (or global)
- WIKI_PATH: `~/.hermes/profiles/<profile>/.env` or global `.env`
- SOUL: `~/.hermes/profiles/<profile>/SOUL.md` existence
- llm-wiki: `~/.hermes/skills/research/llm-wiki/SKILL.md` existence
- claude-code: `~/.hermes/skills/autonomous-ai-agents/claude-code/SKILL.md` existence

### 2. API Keys Audit

**Check:** `~/.hermes/.env` (global) and per-profile `.env` files

List which keys are set (name only):
- ANTHROPIC_API_KEY — Claude Code, Claude Pro
- OPENROUTER_API_KEY — Multi-model routing
- GEMINI_API_KEY — Google AI/Vertex
- DEEPSEEK_API_KEY — DeepSeek platform
- OPENCODE_API_KEY — OpenCode CLI

Report: Keys set vs keys missing with impact.

### 3. Tool Inventory per Profile

| Profile    | Web Search | Browser   | Delegation | Terminal   | MCP Servers |
|------------|------------|-------------|------------|------------|-------------|
| default    | [backend]  | [enabled?]  | [model]    | [toolsets] | [servers]   |
| builder    | [backend]  | [enabled?]  | [model]    | [toolsets] | [servers]   |
| ...        | ...        | ...         | ...        | ...        | ...         |

**Web search backends (priority order):**
1. parallel — default, fastest
2. firecrawl — when JS rendering required
3. tavily — fallback

**Check in config.yaml:**
```yaml
web:
  enabled: true
  backend: parallel|firecrawl|tavily
browser:
  enabled: true
delegation:
  enabled: true
  model: <model-name>
toolsets:
  - hermes-cli
mcp:
  servers: [...]
```

### 4. OpenCode Configuration

**Check:** Any profile with `provider: opencode` or `opencode-go`

**Binary location:** `which opencode`

**Expected:** `/opt/homebrew/bin/opencode` (macOS)

**Config pattern:**
```yaml
model:
  default: opencode
  provider: opencode
```

## Gap Reporting Template

After audit, present findings as:

```
**Critical Gaps:**
1. ❌ [Item] — [Impact] — [Proposed fix]
2. ❌ [Item] — [Impact] — [Proposed fix]

**Recommended Phase 2 Actions:**
1. [Specific numbered fix]
2. [Specific numbered fix]
```

Wait for explicit "approved" before executing.

## Success Criteria

- [ ] All 5 profiles inventoried
- [ ] All table cells populated
- [ ] All API keys identified (set vs missing)
- [ ] All tool configurations documented
- [ ] OpenCode status confirmed
- [ ] Phase 2 fixes explicitly approved before execution
