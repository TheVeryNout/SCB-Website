# Git message

## TASK

<task>Provide the user with a concise git message!</task>


## FORMAT

Avoid any formatting and special characters that clash with the git CLI! 

Format the message as cleanly as possible!


## INTENT



## CONTENT

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