# Hermes Health Check Scripts

## Session Context: 2026-05-14 Global Health Check

This reference captures the exact verification commands and patterns used during a systematic 8-step health check operation.

## Core Verification Patterns

### Plugin Installation and Verification
```bash
# Create plugins directory if missing
mkdir -p ~/.hermes/plugins

# Clone plugin repository
git clone https://github.com/ogallotti/rtk-hermes ~/.hermes/plugins/rtk-hermes

# Verify installation
ls -la ~/.hermes/plugins/rtk-hermes

# Check for Python entry points
find ~/.hermes/plugins/rtk-hermes -name "*.py" -o -name "pyproject.toml"
```

### Configuration File Management
```bash
# Read config (handle path resolution)
cat /Users/agentos/.hermes/config.yaml 2>/dev/null || echo "EMPTY_OR_MISSING"

# Update config with new settings
# Use write_file to avoid path resolution issues
```

### Memory File Sanity Checks
```bash
# Check if memory files exist and their sizes
test -e ~/.hermes/profiles/chief/MEMORY.md && echo EXISTS || echo CREATING
test -e ~/.hermes/profiles/chief/USER.md && echo EXISTS || echo CREATING

# Get byte counts
cat /Users/agentos/.hermes/profiles/chief/MEMORY.md 2>/dev/null | wc -c

# Handle empty files gracefully - 0 bytes is valid state, not an error
```

### Tool Availability Checks
```bash
# Check for tmux (Claude Code requirement)
which tmux || echo "tmux not found"

# Check for hermes CLI subcommands
hermes usage 2>&1 || echo "subcommand not available"

# Check for timeout command
timeout --help 2>/dev/null || echo "timeout not available (brew install coreutils)"
```

### Profile Path Resolution
```bash
# Always use absolute paths to avoid symlink confusion
# Instead of: ~/.hermes/config.yaml
# Use: /Users/agentos/.hermes/config.yaml

# Verify profile directory structure
ls -la /Users/agentos/.hermes/profiles/

# Check for nested home directories (active profile binding)
ls -la /Users/agentos/.hermes/profiles/chief/home/.hermes/ 2>/dev/null || echo "No nested binding"
```

## Command-Specific Workarounds

### hermes CLI Limitations
- `hermes usage` subcommand does not exist in current version
- Use `hermes --help` or `hermes <command> --help` instead
- Token consumption tracking requires direct API access or gateway logs

### Missing Core Utilities
- `timeout` command not available on macOS by default
- Install via: `brew install coreutils`
- Alternative: use `perl -e 'alarm shift @ARGV; exec @ARGV' <seconds> <command>`

### Configuration Path Handling
When updating config.yaml:
1. Always read from absolute path: `/Users/agentos/.hermes/config.yaml`
2. Avoid `~` expansion which may resolve to nested profile paths
3. Use write_file action to ensure correct path resolution

## Health Check Checklist Template

```bash
# This template implements the 8-step pattern from session 2026-05-14

echo "STEP 1: Plugin Installation"
[ -d ~/.hermes/plugins/rtk-hermes ] && echo "✅ Plugin installed" || echo "❌ Plugin missing"

echo "STEP 2: Compressor Threshold"
grep -q "threshold: 0.70" /Users/agentos/.hermes/config.yaml && echo "✅ Threshold set" || echo "❌ Threshold missing"

echo "STEP 3: MEMORY.md Audit"
mem_size=$(cat /Users/agentos/.hermes/profiles/chief/MEMORY.md 2>/dev/null | wc -c)
[ "$mem_size" -lt 2000 ] && echo "✅ MEMORY.md under limit ($mem_size bytes)" || echo "❌ MEMORY.md over limit"

echo "STEP 4: USER.md Audit"
user_size=$(cat /Users/agentos/.hermes/profiles/chief/USER.md 2>/dev/null | wc -c)
[ "$user_size" -lt 1300 ] && echo "✅ USER.md under limit ($user_size bytes)" || echo "❌ USER.md over limit"

echo "STEP 5: Claude Code Setup"
which tmux >/dev/null && echo "✅ tmux available" || echo "❌ tmux missing"
[ -d ~/.hermes/skills/autonomous-ai-agents/claude-code ] && echo "✅ Skill installed" || echo "❌ Skill missing"

echo "STEP 6: max_turns Guard"
grep -q "max_turns" /Users/agentos/.hermes/config.yaml && echo "✅ max_turns configured" || echo "❌ max_turns not set"

echo "STEP 7: Wiki Retrieval Mode"
grep -q "scan-only pass first" /Users/agentos/.hermes/profiles/chief/USER.md && echo "✅ Wiki mode configured" || echo "❌ Wiki mode not set"

echo "STEP 8: Usage Baseline"
hermes usage >/dev/null 2>&1 && echo "✅ Usage command available" || echo "❌ Usage command not available"
```

## Pitfalls Discovered

1. **Empty Memory Files**: 0-byte MEMORY.md and USER.md are valid states, not corruption
2. **Nested Path Resolution**: Active profile's ~/.hermes resolves to `/profiles/<name>/home/.hermes/`
3. **Missing CLI Subcommands**: 'usage' subcommand doesn't exist; need alternative token tracking
4. **macOS Core Utilities**: timeout command requires brew installation
5. **Configuration Path Confusion**: Always use absolute paths in scripts
6. **Plugin Loading**: No immediate verification possible; requires gateway restart to confirm

## Session-Specific Outcomes

From 2026-05-14 session:
- ✅ rtk-hermes plugin installed
- ✅ Compressor threshold set to 0.70
- ✅ MEMORY.md audit complete (was empty, 0 bytes)
- ✅ USER.md audit complete (was empty, 0 bytes)
- ❌ Claude Code delegation blocked (tmux missing, skill not installed)
- ✅ max_turns config noted (not applicable, no delegation blocks)
- ✅ Wiki retrieval mode configured in USER.md
- ❌ /usage baseline unavailable (subcommand doesn't exist)
