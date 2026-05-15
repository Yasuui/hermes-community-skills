---
name: my-skill-name
description: "One-line summary of what this skill enables — keep it under 120 chars"
version: 1.0.0
author: your-github-username
category: devops
tags: ["tag1", "tag2", "tag3"]
requires:
  - "Hermes Agent v0.13.0+"
  - "Python 3.11+"
  - "web_search tool enabled"  # if needed
license: MIT
---

# Skill Name — Human-Readable Title

Brief 2-3 sentence description of what this skill does, when it should load,
and what problem it solves for Hermes Agent users.

## Trigger Conditions

When should the agent automatically load this skill? Be specific:

- User mentions "deploy", "CI/CD", "pipeline"
- User asks for system health check
- During daily briefing sessions
- When configuring a new project

## Prerequisites

- Hermes Agent v0.13.0 or later
- Python 3.11+ (or other language)
- External tools: `jq`, `curl`, `gh` CLI, etc.
- API keys (declared in environment): `API_KEY`, `TOKEN`
- Specific toolset enabled: `web_search`, `terminal`, etc.

## Setup

```bash
# Install dependencies
pip install package-name

# Configure
cp config.example.yaml ~/.hermes/config.yaml
# Edit and add your API key
```

## Usage

### Step 1: Trigger the skill
```
User: help me deploy my project
Agent: [loads this skill] Running deploy checklist...
```

### Step 2: What the agent does
1. Verify prerequisites
2. Run pre-deploy checks
3. Execute deployment
4. Verify success

### Step 3: Verification
```bash
# Confirm deployment succeeded
curl https://your-app.com/health
```

## Examples

### Example 1: Basic usage
```
User: run health check
Agent: [loads skill] 
  1. Gateway: ✓ RUNNING
  2. Session DB: ✓ 4 active
  3. Memory: ✓ 88% used
```

### Example 2: Advanced usage
```
User: full system audit
Agent: [loads skill in audit mode]
  [detailed output with sections]
```

## Reference

### Command Reference
| Command | Description | Example |
|---------|-------------|---------|
| `command-one` | What it does | `command-one --flag value` |

### Configuration Options
| Option | Default | Description |
|--------|---------|-------------|
| `timeout` | 30 | Max execution seconds |
| `retries` | 3 | Retry attempts on failure |

## Pitfalls

- **Issue 1:** What goes wrong and how to fix it
- **Issue 2:** Edge case — workaround here
- **Performance:** Large datasets may need `--batch` flag
- **Permission:** May need `sudo` or admin access for some operations

## Related Skills

- `related-skill-1` — for X workflow
- `related-skill-2` — for Y use case

## Contributing

Found a bug or improvement? Open a PR or issue at:
https://github.com/Yasuui/hermes-community-skills

---

*Maintained by @your-github-username · Licensed under MIT*
