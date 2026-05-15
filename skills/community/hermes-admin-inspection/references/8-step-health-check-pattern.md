# 8-Step Global Health Check Pattern

A systematic inspection routine covering all critical Hermes subsystems. Execute sequentially, confirming each step before proceeding.

## Procedure

### 1. Plugin Installation
Check if `~/.hermes/plugins/<plugin-name>` exists. If not, install via git clone. Verify it loads on next gateway boot.

### 2. Compressor Threshold
Open `~/.hermes/config.yaml`, locate `context:` section. If threshold ≤ 0.5, set to `0.70`. If no threshold exists, add: `context: threshold: 0.70`.

### 3. MEMORY.md Audit
Read current MEMORY.md. Remove project-specific details (belong in TASKS/), entries >30 days stale, target <2000 chars (1800 max). Show final version before saving.

### 4. USER.md Audit
Same process as MEMORY.md. Remove stale preferences, target <1300 chars. Show final version before saving.

### 5. Claude Code Delegation Setup
Verify tmux: `which tmux`. Check claude-code skill: `ls ~/.hermes/skills/autonomous-ai-agents/claude-code/`. If missing, install manually: `mkdir -p ... && curl -o .../SKILL.md <upstream-url>`.

### 6. max_turns Guard
In config.yaml, under Claude Code delegation defaults, ensure `max_turns: 15`. If no such setting, note for skill-level configuration.

### 7. Wiki Retrieval Mode
If LLM-Wiki skill active, verify scan-first mode in USER.md: "For wiki lookups, always do a scan-only pass first. Only open full page bodies if scan doesn't resolve the query."

### 8. Usage Baseline
Run `hermes sessions list --limit 5`. If unavailable, check logs at `~/.hermes/logs/` and extract token usage from recent gateway entries.

## Report Format

Numbered checklist with ✅ or ❌ per item. Do not skip steps.

Example:
```
1. ✅ rtk-hermes plugin installed
2. ✅ Compressor threshold set to 0.70
3. ✅ MEMORY.md audit complete
4. ✅ USER.md audit complete
5. ❌ Claude Code delegation — tmux not installed
6. ✅ max_turns guard configured
7. ✅ Wiki retrieval mode set
8. ❌ Usage baseline unavailable
```

## Session Meta-Learning

This pattern emerged from user demand for systematic verification. Capture procedural knowledge in skills; memory stores state, skills store how-to. When users demand explicit step-by-step confirmation with pass/fail indicators, encode the full pattern including report format expectations.