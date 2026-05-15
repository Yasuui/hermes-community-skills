#!/usr/bin/env python3
"""
Daily Note Generator for Hermes Agent
Creates daily notes in wiki-llm format
"""

import os
import datetime
from pathlib import Path

def generate_daily_note():
    # Get today's date
    today = datetime.date.today()
    date_str = today.strftime("%Y-%m-%d")
    
    # Define paths
    wiki_dir = Path("/Users/agentos/projects/wiki-llm")
    daily_dir = wiki_dir / "wiki" / "daily"
    template_path = daily_dir / "template.md"
    note_path = daily_dir / f"{date_str}.md"
    
    # Ensure daily directory exists
    daily_dir.mkdir(parents=True, exist_ok=True)
    
    # Read template
    if template_path.exists():
        with open(template_path, 'r') as f:
            template = f.read()
    else:
        # Fallback template
        template = '''---
date: {{date}}
type: daily-note
status: draft
tags: [daily, review, summary]
---

# Daily Note - {{date}}

## Summary
Brief overview of the day's accomplishments and key events.

## Tasks Completed
- [ ] Task 1
- [ ] Task 2
- [ ] Task 3

## Focus Areas
- Primary focus for the day
- Secondary objectives

## Metrics & Usage
- Total token usage: {{tokens}}
- Primary models used: {{models}}
- API credits consumed: {{credits}}
- Processes monitored: {{processes}}

## Issues & Resolutions
- Problems encountered
- Solutions implemented
- Follow-up needed

## Plans for Tomorrow
- Key objectives
- Scheduled tasks
- Preparation needed

## Notes & Observations
Any additional observations, ideas, or reflections.

---
*Automatically generated daily note template for Hermes Agent tracking.'''
    
    # Replace placeholders
    content = template.replace("{{date}}", date_str)
    content = content.replace("{{tokens}}", "0")
    content = content.replace("{{models}}", "xiaomi/mimo-v2-flash:exacto, openrouter/nemotron-3-super-120b-a12b:free")
    content = content.replace("{{credits}}", "TBD")
    content = content.replace("{{processes}}", "TBD")
    
    # Write the note
    with open(note_path, 'w') as f:
        f.write(content)
    
    print(f"Daily note created: {note_path}")
    print(f"Please edit this file to fill in the details for {date_str}")
    
    # Try to open in default editor (macOS)
    try:
        os.system(f"open '{note_path}'")
    except:
        print(f"You can edit the file manually: {note_path}")

if __name__ == "__main__":
    generate_daily_note()