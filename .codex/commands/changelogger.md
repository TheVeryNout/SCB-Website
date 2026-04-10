---
<prompt>Examine the past conversation and summarize it for future reference! ** Put the document into the docs/changelogs/ folder! **
---



# File naming

**Critical:** Make a exact date+time suffix: 
Year-Month-Date_HHMM_[topic] . 
Time format: 24hrs

### Example: 
2025-12-21_1540_main-menu-restructure.md

**Important:** You MUST make sure you have the correct date and time! NEVER assume date+time - either ask or research or find other means of objective retrieval and confirmal.

**Note down who you are! <example>Claude Opus 4.5, Codex 5.2 max, Gemini 3 Flash, etc</example>**




# Content

## Most important

- **CRITICAL: Account for every codebase change (backend + fontend!) that altered the apps design, functionality, architecture, logic or app scope / aim**

- **CRITICAL: If a changelog had already been created during the session - pick up from there!**

# Instructions

Your changelog **MUST**

- outline the pressing issue or bug

- outline your analysis to tackle this problem, step-by-step

- document in detail the reasoning behind any code change

- document what was changed where and why

- provide ample context for future reference, especially for de-bugging! 

- document any compromises made to keep code integrity (for now) in-tact

- lay out precisely what this implementation was aimed to achieve, how exactly we went about it (describe the progress, including plan-divergence and compromises), and how it was all ultimately wired together.

- protocol in detail any backend change, i.e. supabase migrations, policies, etc.

- always list important reference documents that are essential or helpful for grasping the entire scope, i.e. changelogs, plans, docs etc

**Critical:** If the changelog covers only parts of an ongoing multi-stage plan, **detail the plan!** State clearly what had been implemented and what is still left to implement! If you had just completed a multi-stage plan - note it down accordingly!



