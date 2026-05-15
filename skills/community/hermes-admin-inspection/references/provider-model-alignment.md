# Provider + Tool Alignment Workflow

Multi-profile model provider alignment — updating all crew profiles (default, builder, chief, researcher, reviewer) with specific models per role, fallback models, and auxiliary services.

## Pre-requisites

- Copilot provider configured (for gpt-5-mini fallback/auxiliary)
- OpenRouter API key obtained (for researcher/reviewer fallbacks)
- ollama-cloud models available locally (kimi-k2.6, qwen3-coder:32b, deepseek-v4-flash)

## May 2026 Alignment Reference

| Profile | Model | Provider | Fallback |
|---------|-------|----------|----------|
| Chief | kimi-k2.6 | ollama-cloud | gpt-5-mini (copilot) |
| Builder | qwen3-coder:32b | ollama-cloud | gpt-5-mini (copilot) |
| Researcher | gemini-3-flash | openrouter | gpt-5-mini (copilot) |
| Reviewer | qwen3-coder:32b | ollama-cloud | openrouter/pareto-code |
| Default | deepseek-v4-flash | ollama-cloud | gpt-5-mini (copilot) |

## Phase 1 — Global Defaults

In `~/.hermes/config.yaml`:

```yaml
model:
  default: deepseek-v4-flash
  provider: ollama-cloud
  fallback_model:
    provider: copilot
    model: gpt-5-mini

auxiliary:
  compression:
    provider: copilot
    model: gpt-5-mini
  summarization:
    provider: copilot
    model: gpt-5-mini
  vision:
    provider: copilot
    model: gpt-5-mini

web:
  backend: firecrawl
```

## Phase 2 — Per-Profile Models

### Chief (kimi-k2.6)

`~/.hermes/profiles/chief/config.yaml`:
```yaml
model:
  default: kimi-k2.6
  provider: ollama-cloud
  fallback_model:
    provider: copilot
    model: gpt-5-mini
```

### Builder (qwen3-coder:32b)

`~/.hermes/profiles/builder/config.yaml`:
```yaml
model:
  default: qwen3-coder:32b
  provider: ollama-cloud
  fallback_model:
    provider: copilot
    model: gpt-5-mini
```

### Researcher (gemini-3-flash + openrouter)

`~/.hermes/profiles/researcher/config.yaml`:
```yaml
model:
  default: gemini-3-flash
  provider: openrouter
  fallback_model:
    provider: copilot
    model: gpt-5-mini
```

### Reviewer (qwen3-coder:32b + pareto-code fallback)

`~/.hermes/profiles/reviewer/config.yaml`:
```yaml
model:
  default: qwen3-coder:32b
  provider: ollama-cloud
  fallback_model:
    provider: openrouter
    model: openrouter/pareto-code
```

## Phase 3 — API Keys

Add to `~/.hermes/.env`:
```
OPENROUTER_API_KEY=<key>
```

And to each profile `.env`:
```bash
for p in builder chief researcher reviewer default; do
  echo "OPENROUTER_API_KEY=" >> ~/.hermes/profiles/$p/.env
done
```

## Phase 4 — Verify

Test each profile:

```bash
# Chief
hermes chat -m kimi-k2.6 --provider ollama-cloud -q "Model check" --quiet

# Builder
hermes chat -m qwen3-coder:32b --provider ollama-cloud -q "Model check" --quiet

# Researcher (requires OpenRouter key set)
hermes chat -m gemini-3-flash --provider openrouter -q "Model check" --quiet

# Reviewer
hermes chat -m qwen3-coder:32b --provider ollama-cloud -q "Model check" --quiet
```

## Pitfalls

- **Model name variants**: kimi-k2.6 vs kimi-k2.5 vs kimi-k2 — verify exact ollama model name
- **OpenRouter requires key**: Researcher will fail without OPENROUTER_API_KEY in env
- **Provider drift**: Researcher uses openrouter, others use ollama-cloud — intentional for API diversity
- **Fallback model array syntax**: Single fallback uses direct object, not array
- **Auxiliary models**: Must be globally set in config.yaml, not per-profile

## Automation Script

For bulk updates, use this bash pattern:

```bash
update_profile_model() {
  local profile=$1
  local model=$2
  local provider=$3
  local fallback_provider=$4
  local fallback_model=$5
  
  cat > ~/.hermes/profiles/$profile/config.yaml << EOF
model:
  default: $model
  provider: $provider
  fallback_model:
    provider: $fallback_provider
    model: $fallback_model
EOF
}

update_profile_model chief kimi-k2.6 ollama-cloud copilot gpt-5-mini
update_profile_model builder qwen3-coder:32b ollama-cloud copilot gpt-5-mini
# etc
```
