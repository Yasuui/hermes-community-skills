# Contributing to Hermes Community Skills

Thanks for sharing your skills with the Hermes Agent community. This guide covers everything you need to submit, update, or review a skill.

## Quick Start

```bash
# 1. Fork and clone
git clone https://github.com/YOUR_USERNAME/hermes-community-skills.git
cd hermes-community-skills

# 2. Create your skill from template
mkdir -p skills/community/my-awesome-skill
cp docs/SKILL_TEMPLATE.md skills/community/my-awesome-skill/SKILL.md

# 3. Edit SKILL.md — follow the template, fill all fields
# 4. Test: copy to your local Hermes skills folder and invoke it
cp -r skills/community/my-awesome-skill ~/.hermes/profiles/chief/skills/devops/

# 5. Commit and PR
git checkout -b skill/my-awesome-skill
git add skills/community/my-awesome-skill/
git commit -m "Add my-awesome-skill"
git push origin skill/my-awesome-skill
# Open PR on GitHub
```

## Skill Requirements

Every community skill MUST have:

### Frontmatter (YAML at top of SKILL.md)

```yaml
---
name: my-skill-name           # lowercase, hyphens, max 64 chars
description: "One-line summary of what this skill enables"
author: your-github-username  # or "community" for group efforts
version: 1.0.0                # semver
requires:                     # prerequisites
  - "Hermes Agent v0.13.0+"
  - "Python 3.11+"
  - "web_search tool enabled" # if needed
category: devops              # see categories below
tags: ["git", "automation", "ci"]
license: MIT
---
```

### Body Requirements

- Clear trigger conditions (when should the agent load this skill?)
- Numbered steps with exact commands
- Verification steps (how to confirm it worked)
- Pitfalls section (edge cases, known issues, workarounds)
- No hardcoded secrets, tokens, or API keys

### Categories

| Category | Use For |
|----------|---------|
| `devops` | System ops, health checks, deployment, monitoring |
| `software-development` | Coding, debugging, testing, PRs |
| `creative` | Art, music, design, diagrams, video |
| `research` | Academic, web search, data gathering |
| `productivity` | Notes, email, calendar, task management |
| `mlops` | ML training, inference, evaluation |
| `github` | GitHub-specific workflows |
| `media` | Audio, video, image processing |
| `note-taking` | Obsidian, wiki management |
| `social-media` | X/Twitter, Discord, messaging |
| `gaming` | Game servers, emulators |
| `smart-home` | IoT, home automation |
| `security` | Auditing, hardening, scanning |
| `domain` | Domain-specific knowledge (legal, medical, finance) |

## Review Process

Every PR goes through automated checks and human review:

### Automated Checks (CI)
- [ ] Frontmatter is valid YAML
- [ ] All required fields present (`name`, `description`, `version`, `category`)
- [ ] No hardcoded secrets detected (`sk-`, `API_KEY`, `token`, passwords)
- [ ] SKILL.md passes the Hermes validator (`hermes-skill-validate`)
- [ ] File paths follow convention (`skills/community/<name>/SKILL.md`)

### Maintainer Review
- [ ] Skill works as described (we test it locally)
- [ ] Instructions are clear and complete
- [ ] Prerequisites are accurate
- [ ] Attribution is correct
- [ ] No malicious patterns (arbitrary shell exec without warning, data exfiltration)

**Timeline:** We aim to review PRs within 48 hours. If urgent, ping us on Discord.

## Updating a Skill

1. Open a PR with your changes
2. Bump the version in frontmatter following semver
3. Add a note in the PR description about what changed
4. Maintainers test the updated version before merging

## Reporting Issues

- **Bug in a skill:** Open an issue with the skill name and exact error
- **Security concern:** See [SECURITY.md](SECURITY.md) — do NOT open a public issue
- **Request a skill:** Open an issue with `[REQUEST]` in the title

## Code of Conduct

Be respectful. We're building tools for the community, together. No gatekeeping, no harassment, no spam. See [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md).

## Recognition

Contributors are listed on the website and in `CONTRIBUTORS.md`. Significant contributors may be invited as maintainers.

---

Questions? Join the [Nous Research Discord](https://discord.gg/nousresearch) #hermes-skills channel.
