# Wrapper Instructions for **wrapping up**

**CRITICAL:** "Wrapping up" in this context means **documenting all fixes and/or feature implementations or code changes that occured in this user session!**

<scenario>
User asks you to fix a bug. User wants you to document this step. User does NOT open a new conversation, continues in Chat. User makes new bug fix request, asks you to document - and so on.
</scenario>

In this case, with "Wrapping up" you would:

- Use the upcoming instructions to document the step when user instructs
- On subsequent wrappings, **ALWAYS** check the chat message history if wrapping had been done before, then:
- Wrapping up the latest steps yet to be documented ONLY

When wrapping up, you **Never** update existing changelogs! You create a new changelog for every wrapping job!






## Steps:

### 1. Update existing docs

Ask yourself: Did the last steps have any impact on:

- Database logic
- Frontend-design logic, including filtering
- Frontend-design architecture, i.e. Token System, Language system, global styling components

in a meaningful manner? 

Scrutinize the documentation! Start with README.md and any referrenced doc / prd file related to your work!

It the implementation / fix you performed was architecturally substantual enought: Write a new PRD and/or make an addition in the README.

**Update the documentaion accordingly!**




### 2. Changelog

See instruction file .codex/commands/changelogger.md

**Follow it precisely!**

- Make sure to incorporate the reasons behind your task.
- **CRITICAL:** ONLY use characters that do not break git commit! Illegal character <examples>()"</examples>

### 3. Git message

After Changelog was written: Provide the user with a concise git message!

**Git message must include**

- What was the problem (if any)
- What was fixed and how
- Concise bullet point list
- Basic ins and outs

<git-message-example>

fix: Collapsed starter view shows accumulated overlap Gonna count                                                                                                                                   
                                                                                                                                                                                                      
  Problem:                                                                                                                                                                                            
  - Collapsed Session Starter view showed same-session Gonna count only                                                                                                                               
  - Users with long Wanna sessions saw "0 Gonna" even with overlapping activity                                                                                                                       
  - Right indicator bar didn't reflect overlap starters                                                                                                                                               
  - Starter buttons targeted full session range even when Gonna was from overlaps                                                                                                                     
                                                                                                                                                                                                      
  Changes:                                                                                                                                                                                            
  - Split overlapEnabled into fetch (collapsed) vs display (expanded) conditions                                                                                                                      
  - Add accumulated Gonna count + avatars from overlap starters                                                                                                                                       
  - Update showStarterCollapsed to trigger on overlap starters                                                                                                                                        
  - Add effectiveRightIndicatorStatus for right indicator bar                                                                                                                                         
  - Hide starter buttons when Gonna is overlap-only (force expansion)                                                                                                                                 
                                                                                                                                                                                                      
  Result:                                                                                                                                                                                             
  - Collapsed view shows accumulated Gonna from ALL overlapping sessions                                                                                                                              
  - Right indicator bar shows green when overlaps exist                                                                                                                                               
  - Users must expand to choose specific time-targeted overlapping session    

  Architecture changes:

  - None; purely front-end 


  Changed files:                                                                                                                                                                                             
  - SessionListItem.tsx


  Changelog:

  - 2026-01-18_1452_collapsed-starter-accumulated-overlaps.md

</git-message-example>
