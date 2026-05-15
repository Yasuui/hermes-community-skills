# Security Policy

## Reporting a Vulnerability

If you discover a security vulnerability in a community skill:

1. **Do NOT open a public issue.**
2. Email `security@hermes-community-skills.dev` with:
   - Skill name and version
   - Description of the vulnerability
   - Steps to reproduce
   - Impact assessment
3. We will acknowledge within 24 hours and resolve within 72 hours.

## What We Check

Every skill submitted to this repository undergoes automated and manual security review:

### Automated Scanning
- **Secret detection:** Scans for `sk-`, `api_key`, `API_KEY`, `token`, `password`, `secret`, bearer tokens, and common credential patterns
- **Command injection:** Flags patterns like `eval()`, `exec()`, unescaped shell commands, `os.system()` with dynamic input
- **File exfiltration:** Detects `curl`/`wget` uploading files to external hosts without user consent
- **Dependency risks:** Skills requiring unverified PyPI/npm packages are flagged for manual review

### Manual Review
- Does the skill clearly state what it does and what it accesses?
- Are API key requirements transparent?
- Does the skill attempt to modify system files outside `~/.hermes/`?
- Is attribution correct and license clear?
- Would a reasonable user understand the risk of installing this skill?

## Removal Policy

Skills found to contain:
- **Hardcoded secrets:** Removed immediately, users notified
- **Malicious code:** Removed immediately, author banned, users notified
- **Misleading description:** Removed within 24 hours, author contacted
- **Unmaintained/abandoned:** Archived after 90 days of no response to issues

## Safe Installation Tips

1. **Read the SKILL.md** before installing — every skill documents what it does
2. **Check the prerequisites** — understand what the skill needs access to
3. **Look for the ✓ Verified badge** — community-reviewed skills
4. **Run skills in a test profile first** — `hermes profile create test` to isolate
5. **Report anything suspicious** — see reporting instructions above

## For Skill Authors

- Never hardcode credentials in SKILL.md or reference files
- Use environment variables for API keys: `$API_KEY`, `$TOKEN`
- Document all external network calls the skill makes
- If your skill runs shell commands, clearly state why and what they do
- Test your skill before submitting: would you install this from a stranger?

## Maintainer Responsibilities

- Review 100% of community skill PRs before merge
- Test skills locally before approving
- Respond to security reports within 24 hours
- Remove compromised skills immediately, notify community
- Rotate maintainer credentials quarterly

---

Last updated: May 2026 · Maintained by @Yasuui and community volunteers
