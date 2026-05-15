<p align="center">
  <img src="docs/logo.svg" alt="Hermes Community Skills" width="480">
</p>

<p align="center">
  <strong>The official community skills directory for Hermes Agent.</strong><br>
  Discover, share, and install skills that extend your agent beyond the built-in catalog.
</p>

<p align="center">
  <a href="https://Yasuui.github.io/hermes-community-skills"><strong>Browse Skills →</strong></a>
  &nbsp;·&nbsp;
  <a href="#installing-skills"><strong>Install →</strong></a>
  &nbsp;·&nbsp;
  <a href="CONTRIBUTING.md"><strong>Contribute →</strong></a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/skills-50+-00e87a?style=flat-square&labelColor=041c1c" alt="Skills">
  <img src="https://img.shields.io/badge/verified-by%20community-ffe6cb?style=flat-square&labelColor=041c1c" alt="Verified">
  <img src="https://img.shields.io/badge/license-MIT-00e87a?style=flat-square&labelColor=041c1c" alt="License">
  <a href="https://discord.gg/nousresearch"><img src="https://img.shields.io/badge/discord-Nous%20Research-5865F2?style=flat-square&labelColor=041c1c" alt="Discord"></a>
</p>

---

## What Is This?

Hermes Agent ships with 25 built-in skill categories covering development, research, creative work, and system operations. This repository is where the community extends that foundation.

Every skill here:
- Follows the official [SKILL.md specification](docs/SKILL_TEMPLATE.md)
- Has been reviewed by community maintainers
- Includes clear installation instructions and prerequisites
- Is verified safe — no secrets, no malicious code, no system compromise

## Installing Skills

### Quick Install (any community skill)

```bash
# Install the skill manager
pip install hermes-skill-manager

# Browse available community skills
hsm list --community

# Install a skill
hsm install playwright-screen-recorder

# Or install directly from GitHub
hsm install https://github.com/Yasuui/hermes-community-skills --skill playwright-screen-recorder
```

### Manual Install

```bash
cd ~/.hermes/profiles/<profile>/skills/
git clone https://github.com/Yasuui/hermes-community-skills.git
cp -r hermes-community-skills/skills/community/<skill-name> .
```

## Skill Categories

| Category | Built-In | Community | Description |
|----------|----------|-----------|-------------|
| **Development** | 6 | +3 | Coding, debugging, PR workflow, code review |
| **Creative** | 5 | +2 | ASCII art, diagrams, videos, image generation |
| **DevOps** | 4 | +4 | Gateway health, session management, recording, deployment |
| **Research** | 3 | +1 | arXiv, web search, fact extraction |
| **Productivity** | 4 | +2 | Notes, email, calendar, wiki management |
| **ML/AI** | 3 | +1 | Fine-tuning, inference, model management |

See the [full catalog →](https://Yasuui.github.io/hermes-community-skills)

## Built-In Skills (Reference)

Hermes Agent v0.13.0 ships with these skill categories. They're cataloged here for discoverability — no install needed, they work out of the box:

<details>
<summary>Click to expand built-in skills list</summary>

| Category | Skills |
|----------|--------|
| **apple** | apple-notes, apple-reminders, findmy, imessage, macos-computer-use |
| **autonomous-ai-agents** | claude-code, codex, hermes-agent, opencode |
| **creative** | architecture-diagram, ascii-art, ascii-video, baoyu-comic, baoyu-infographic, claude-design, comfyui, design-md, excalidraw, humanizer, ideation, manim-video, p5js, pixel-art, popular-web-designs, pretext, sketch, songwriting-and-ai-music, touchdesigner-mcp |
| **data-science** | jupyter-live-kernel |
| **devops** | gateway-connectivity, hermes-admin-inspection, hq-resilience, kanban-orchestrator, kanban-worker, memory-providers, memory-wiki-health, orchestrator-efficiency-rules, webhook-subscriptions |
| **dogfood** | dogfood |
| **email** | himalaya |
| **gaming** | minecraft-modpack-server, pokemon-player |
| **github** | codebase-inspection, github-auth, github-code-review, github-issues, github-pr-workflow, github-repo-management |
| **mcp** | native-mcp |
| **media** | gif-search, heartmula, songsee, spotify, youtube-content |
| **mlops** | huggingface-hub, evaluating-llms-harness, weights-and-biases, llama-cpp, obliteratus, outlines, serving-llms-vllm, audiocraft-audio-generation, segment-anything-model, dspy, axolotl, fine-tuning-with-trl, unsloth |
| **note-taking** | obsidian, wiki-llm, wiki-llm-vault-management |
| **productivity** | airtable, google-workspace, linear, maps, nano-pdf, notion, ocr-and-documents, powerpoint, teams-meeting-pipeline |
| **red-teaming** | godmode |
| **research** | arxiv, blogwatcher, polymarket, wiki-llm |
| **smart-home** | openhue |
| **social-media** | xurl |
| **software-development** | debugging-hermes-tui-commands, hermes-agent-skill-authoring, node-inspect-debugger, plan, python-debugpy, requesting-code-review, reviewer-toolkit, spike, subagent-driven-development, systematic-debugging, test-driven-development, writing-plans |
| **yuanbao** | yuanbao |

</details>

## Community Skills (New!)

Skills built by Hermes Agent users, verified and published here:

### playright-screen-recorder
> Record browser UX flows and cinematic product demos — no vision model needed.

**Prerequisites:** Node.js 18+, Playwright, ffmpeg  
**Install:** `hsm install playwright-screen-recorder`  
**Author:** @Yasuui  
**Verified:** ✓ — May 2026

### hermes-admin-inspection
> Inspect, audit, and troubleshoot Hermes Agent profiles, memory storage, and installation layout.

**Prerequisites:** Hermes Agent v0.13.0+  
**Install:** `hsm install hermes-admin-inspection`  
**Author:** @Yasuui  
**Verified:** ✓ — May 2026

### daily-debrief-alpha
> Morning briefing: session rehash, tech news digest, and Polymarket alpha scanning.

**Prerequisites:** Hermes Agent v0.13.0+, web_search tool  
**Install:** `hsm install daily-debrief-alpha`  
**Author:** @Yasuui  
**Verified:** ✓ — May 2026

## Contributing

We welcome new skills! See [CONTRIBUTING.md](CONTRIBUTING.md) for the full process.

**Quick overview:**
1. Fork this repo
2. Copy `docs/SKILL_TEMPLATE.md` into `skills/community/<your-skill>/SKILL.md`
3. Fill out all required frontmatter
4. Open a PR — maintainers review for safety + quality
5. Once merged, your skill appears on the website

**Security:** Every PR is checked for:
- No API keys, tokens, or secrets in skill files
- No arbitrary code execution without user awareness
- Clear prerequisite declarations
- Proper attribution and licensing

## Security

If you discover a skill that contains malicious code, secrets, or security vulnerabilities:
1. **Do not** open a public issue
2. Email [security@example.com] or DM a maintainer on Discord
3. We'll remove the skill within 24 hours and notify affected users

See [SECURITY.md](SECURITY.md) for the full policy.

## FAQ

**Q: What's the difference between built-in and community skills?**  
Built-in skills ship with Hermes Agent and work out of the box. Community skills are created by users and require installation.

**Q: How do I know a community skill is safe?**  
Every community skill is reviewed by maintainers before merge. We check for secrets, malicious code patterns, and verify prerequisites. Look for the ✓ Verified badge.

**Q: Can I submit a skill that requires API keys?**  
Yes, but you must declare it clearly in the frontmatter and include setup instructions. Never hardcode keys in skill files.

**Q: How do skills get updated?**  
Open a PR with your changes. Maintainers review and merge. Version bumps follow semver.

## License

MIT — see [LICENSE](LICENSE). All contributed skills remain the property of their authors but are licensed MIT by default for community use.

---

<p align="center">
  Built by the <a href="https://discord.gg/nousresearch">Hermes Agent community</a> · 
  <a href="https://nousresearch.com">Nous Research</a>
</p>
