# Space Time Soul Game

## Current State
Existing project scaffold with backend/frontend directories. Previous version had three heroes vs villain turn-based combat but is expired.

## Requested Changes (Diff)

### Add
- Full turn-based combat game with 3 heroes: Space Master, Time Keeper, Soul Binder
- Villain: The Architect (3 phases with increasing difficulty)
- Each hero has 3 unique abilities based on their domain
- Reality-warping villain mechanics that alter battlefield conditions
- Team switcher to choose active hero each turn
- Cosmic visual theme with particle effects
- HP bars for heroes and villain
- Turn-based combat log/battle feed
- Win/lose conditions with game over screen
- Mobile-first responsive layout

### Modify
- Nothing (rebuild from scratch)

### Remove
- Old game state

## Implementation Plan
1. Backend: store game state, handle turn actions, track hero/villain HP, manage phases
2. Frontend: battle arena UI, hero cards with ability buttons, villain display, particle effects, cosmic styling
3. Hero abilities:
   - Space: Warp Strike (damage), Black Hole (stun), Dimensional Shield (defense)
   - Time: Time Slash (damage), Rewind (heal), Slow Field (reduce villain attack)
   - Soul: Soul Drain (damage + heal), Spirit Bind (prevent villain warping), Ethereal Form (dodge)
4. Villain phases: Phase 1 normal, Phase 2 gravity flip UI effect, Phase 3 chaos mode
5. Reality warp effects: screen distortion, mirrored controls, random obstacles
