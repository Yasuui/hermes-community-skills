# Hermes System Verification Report

## 1. Secrets Verification
- **GITHUB_TOKEN**: {{github_present}} ({{github_length}} chars)
- **ANTHROPIC_API_KEY**: {{anthropic_present}} ({{anthropic_length}} chars)  
- **OPENROUTER_API_KEY**: {{openrouter_present}} ({{openrouter_length}} chars)

## 2. Skills Verification
- **Coding skill**: {{coding_skill_present}}
- **Files in skills directory**: {{skills_list}}

## 3. Configuration Verification
- **GitHub configuration**: 
  - Default branch: {{github_default_branch}}
  - PR author: {{github_pr_author}}
  - PR reviewer: {{github_pr_reviewer}}
  - Commit author: {{github_commit_author}}
- **Telegram configuration**:
  - Mode: {{telegram_mode}}
  - Send as: {{telegram_send_as}}

## 4. System Status
- **Secrets directory permissions**: {{secrets_perms}}
- **Cron job status**: {{cron_status}}
- **Gateway status**: {{gateway_status}}

---
*Generated on {{timestamp}} by Hermes verification system*