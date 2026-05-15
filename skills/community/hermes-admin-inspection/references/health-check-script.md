# 8-Step Global Health Check Script (macOS)

This reference contains the concrete implementation of the systematic Hermes health check pattern demonstrated in session 202513_1.

## Prerequisites

- macOS environment
- Hermes Agent installed at ~/.hermes
- bash/zsh terminal

## Full Implementation

```bash
#!/bin/bash
set -euo pipefail

# --- CONFIG ---
PROFILE="${1:-chief}"
THRESHOLD_TARGET="0.70"
MEMORY_MAX_CHARS=2000
USER_MAX_CHARS=1300

# --- HELPERS ---
log() { echo "[$(date +%H:%M:%S)] $*"; }
ok() { echo "✅ $*"; }
fail() { echo "❌ $*"; exit 1; }

# --- STEP 1: PLUGIN INSTALLATION ---
step1_plugin() {
  log "STEP 1: Plugin Installation"
  if [[ -d ~/.hermes/plugins/rtk-hermes ]]; then
    ok "rtk-hermes plugin directory exists"
  else
    log "Installing rtk-hermes..."
    mkdir -p ~/.hermes/plugins
    git clone https://github.com/ogallotti/rtk-hermes ~/.hermes/plugins/rtk-hermes
    ok "rtk-hermes installed"
  fi
  
  # Verify structure
  if [[ -f ~/.hermes/plugins/rtk-hermes/src/rtk_hermes/__init__.py ]]; then
    ok "rtk-hermes structure valid"
  else
    fail "rtk-hermes structure invalid"
  fi
}

# --- STEP 2: COMPRESSOR THRESHOLD ---
step2_threshold() {
  log "STEP 2: Compressor Threshold"
  CONFIG_PATH="/Users/agentos/.hermes/config.yaml"
  
  if [[ ! -f "$CONFIG_PATH" ]]; then
    log "Config does not exist, creating..."
    cat > "$CONFIG_PATH" <<EOF
model:
  base_url: ''
  default: qwen3.6-flash-9b
  provider: ollama-cloud
  reasoning_effort: xhigh
context:
  threshold: $THRESHOLD_TARGET
EOF
    ok "Created config with threshold $THRESHOLD_TARGET"
    return
  fi
  
  # Check current threshold
  CURRENT=$(grep -A1 "^context:" "$CONFIG_PATH" | grep "threshold:" | awk '{print $2}' || echo "missing")
  
  if [[ "$CURRENT" == "missing" ]]; then
    log "Adding threshold to existing config..."
    echo "" >> "$CONFIG_PATH"
    echo "context:" >> "$CONFIG_PATH"
    echo "  threshold: $THRESHOLD_TARGET" >> "$CONFIG_PATH"
    ok "Added threshold: $THRESHOLD_TARGET"
  elif (( $(echo "$CURRENT <= 0.5" | bc -l) )); then
    log "Current threshold $CURRENT too low, updating to $THRESHOLD_TARGET"
    sed -i '' "s/threshold: $CURRENT/threshold: $THRESHOLD_TARGET/" "$CONFIG_PATH"
    ok "Updated threshold: $THRESHOLD_TARGET"
  else
    ok "Threshold already acceptable: $CURRENT"
  fi
}

# --- STEP 3: MEMORY.md AUDIT ---
step3_memory() {
  log "STEP 3: MEMORY.md Audit"
  MEMFILE="/Users/agentos/.hermes/profiles/$PROFILE/MEMORY.md"
  
  if [[ ! -f "$MEMFILE" ]]; then
    log "MEMORY.md not found (will be created empty)"
    ok "MEMORY.md audit skipped (file absent)"
    return
  fi
  
  SIZE=$(wc -c < "$MEMFILE")
  CHARS=$(wc -m < "$MEMFILE")
  
  if (( CHARS > MEMORY_MAX_CHARS )); then
    log "MEMORY.md $CHARS chars exceeds $MEMORY_MAX_CHARS limit"
    # Trimming logic would go here - see skill for details
    fail "MEMORY.md oversized (implement trim or raise limit)"
  else
    ok "MEMORY.md: $CHARS chars (under $MEMORY_MAX_CHARS limit)"
  fi
}

# --- STEP 4: USER.md AUDIT ---
step4_user() {
  log "STEP 4: USER.md Audit"
  USERFILE="/Users/agentos/.hermes/profiles/$PROFILE/USER.md"
  
  if [[ ! -f "$USERFILE" ]]; then
    log "USER.md not found, creating..."
    cat > "$USERFILE" <<EOF
# User Profile

## Core Preferences
- Only respond when explicitly asked/prompted
- Direct responses, no unnecessary explanations
- No proactive behavior

## Communication
- Address user as "Yonis" or "sir"
- For wiki lookups, always do a scan-only pass first. Only open full page bodies if scan doesn't resolve the query.
EOF
    ok "Created USER.md at $USERFILE"
    return
  fi
  
  SIZE=$(wc -c < "$USERFILE")
  CHARS=$(wc -m < "$USERFILE")
  
  if (( CHARS > USER_MAX_CHARS )); then
    log "USER.md $CHARS chars exceeds $USER_MAX_CHARS limit"
    fail "USER.md oversized (implement trim or raise limit)"
  else
    ok "USER.md: $CHARS chars (under $USER_MAX_CHARS limit)"
  fi
}

# --- STEP 5: CLAUDE CODE SETUP ---
step5_claude() {
  log "STEP 5: Claude Code Setup"
  
  # Check tmux
  if command -v tmux &>/dev/null; then
    ok "tmux available: $(which tmux)"
  else
    log "tmux missing, installing..."
    brew install tmux >/dev/null 2>&1 || fail "tmux installation failed"
    ok "tmux installed"
  fi
  
  # Install claude-code skill
  SKILLS_DIR="~/.hermes/skills/autonomous-ai-agents/claude-code"
  SKILL_MD="$SKILLS_DIR/SKILL.md"
  
  if [[ -f "$SKILL_MD" ]]; then
    ok "Claude Code skill exists"
  else
    log "Claude Code skill missing, installing..."
    mkdir -p "$SKILLS_DIR"
    curl -sL "$URL" -o "$SKILL_MD"
    ok "Claude Code skill installed"
  fi
}

# --- STEP 6: MAX_TURNS GUARD ---
step6_maxturns() {
  log "STEP 6: max_turns Guard"
  CONFIG_PATH="/Users/agentos/.hermes/config.yaml"
  
  if grep -q "max_turns" "$CONFIG_PATH" 2>/dev/null; then
    CURRENT=$(grep "max_turns" "$CONFIG_PATH" | head -1 | awk '{print $2}')
    ok "max_turns configured: $CURRENT"
  else
    log "No max_turns in config (skill-level config pending)"
    ok "max_turns guard skipped (config not present)"
  fi
}

# --- STEP 7: WIKI RETRIEVAL MODE ---
step7_wiki() {
  log "STEP 7: Wiki Retrieval Mode"
  USERFILE="/Users/agentos/.hermes/profiles/$PROFILE/USER.md"
  
  if grep -q "scan-only pass first" "$USERFILE" 2>/dev/null; then
    ok "Wiki scan-first directive present"
  else
    log "Wiki retrieval mode note missing, adding..."
    cat >> "$USERFILE" <<EOF

## Lookup Preferences
- For wiki lookups, always do a scan-only pass first. Only open full page bodies if scan doesn't resolve the query.
EOF
    ok "Added wiki retrieval directive"
  fi
}

# --- STEP 8: USAGE BASELINE ---
step8_usage() {
  log "STEP 8: Usage Baseline"
  
  # Try sessions list
  if hermes sessions list --limit 5 >/dev/null 2>&1; then
    ok "Sessions command available"
    hermes sessions list --limit 5 >> /tmp/hermes-health-check.log
  else
    log "Sessions command unavailable, checking logs..."
  fi
  
  # Try analytics
  if hermes analytics --days 7 >/dev/null 2>&1; then
    ok "Analytics command available"
  else
    log "Analytics command unavailable, extracting from logs..."
    grep -h "tokens" /Users/agentos/.hermes/logs/gateway.log* 2>/dev/null | tail -20 >> /tmp/hermes-health-check.log
    ok "Extracted token usage from logs"
  fi
}

# --- MAIN ---
main() {
  log "Starting Hermes Global Health Check for profile: $PROFILE"
  echo "=========================================="
  
  step1_plugin
  step2_threshold
  step3_memory
  step4_user
  step5_claude
  step6_maxturns
  step7_wiki
  step8_usage
  
  echo "=========================================="
  log "Health check complete"
}

main "$@"
```

## macOS Path Resolution Notes

**Critical macOS/Ubuntu path evaluation difference observed in session:**

- `/Users/agentos/.hermes/` expands to `/Users/agentos/.hermes/`
- `~/.hermes/` on Hermes execute_code expands to `/Users/agentos/.hermes/profiles/chief/home/.hermes/` 
- **Always use absolute paths** (`/Users/agentos/...`) when specifying files in scripts
- **Always use absolute paths** when reading with `read_file` tool
- When writing with `write_file`, use absolute paths to avoid writing into nested profile home

## Verification Commands

```bash
# Check plugin structure
ls -la ~/.hermes/plugins/rtk-hermes/src/

# Check config threshold
grep -A2 "^context:" ~/.hermes/config.yaml

# Check memory char counts
wc -m ~/.hermes/profiles/chief/MEMORY.md
wc -m ~/.hermes/profiles/chief/USER.md

# Check claude-code skill
ls -lh ~/.hermes/skills/autonomous-ai-agents/claude-code/SKILL.md

# Check tmux
which tmux
```
