# Adult Browser HFO Roleplay Game — Master Plan

**Working title:** (TBD)  
**Genre:** Guided erotic roleplay + trance / tease sessions (browser)  
**Audience:** Adults 18+ only  
**Core player outcome:** Achieve **HFO** (hands-free orgasm) through play  
**Goal of this doc:** Locked design before code.

---

## 0. Locked decisions

| Decision | Choice |
|----------|--------|
| Primary goal while playing | **HFO** — guided arousal to climax without touching |
| Player character | **Fully customizable** |
| Art direction | **Dreamlike sensual realism** (see §7) |
| Hard content bans in the game | **None** (player may still set personal soft/hard prefs) |
| Absolute rule | All characters **adult (18+)** only |

---

## 1. Product verdict (what to build)

Build a **partner-led HFO session game**: relationship roleplay that opens into timed, immersive induction scenes designed to make the player finish hands-free.

This is **not**:
- a porn gallery with click-next pages
- an AI chatbot as the main product
- a combat/RPG with sex as a side reward

This **is**:
- customizable you + a dominant/guiding partner fantasy
- story and chemistry that earn deeper control
- session scenes paced like erotic hypnosis / JOI-for-HFO (tease → deepen → peak → aftercare)

**Why this wins for HFO:** Hands-free climax needs focus, rhythm, voice/text cadence, and low distraction — a session runner beats an open sandbox.

---

## 2. Player fantasy (north star)

> “Someone specific has my attention completely. They guide my body with words, eyes, and timing until I finish without touching myself.”

Every system exists to protect that trance: fewer UI interruptions, stronger partner presence, escalating permission/control, clear “don’t touch” framing inside scenes.

---

## 3. Non‑negotiables

| Rule | Why |
|------|-----|
| Hard **18+ age gate** | Legal / platform safety |
| Optional **personal prefs** (soft/hard limits) | Player comfort — game itself has no bans |
| All characters clearly **adult** | Absolute requirement |
| **Session mode** distinct from story/hub | HFO needs uninterrupted pacing |
| Content is **data-driven** | Expand routes without rewriting engine |
| Local save + export/import | Browser reliability |
| Explicit **hands-free framing** in climax scenes | Reinforces the HFO contract |

---

## 4. Game structure

### 4.1 Two layers

| Layer | Purpose |
|-------|---------|
| **Bond layer** | Customize PC, meet partners, talk, flirt, earn trust/control |
| **Session layer** | Full-bleed guided HFO scenes (timed beats, minimal UI) |

Bond unlocks deeper sessions. Sessions are where HFO is designed to happen.

### 4.2 Modes

| Mode | Purpose | Priority |
|------|---------|----------|
| **Character create** | Build the body/identity partners address | MVP |
| **Story / bond arcs** | Earn access + personalize dynamic | MVP |
| **HFO sessions** | Guided climax routes | MVP core |
| **Quick session** | Replay unlocked inductions | MVP-light |
| **Gallery / journal** | Unlocked scenes + climax history | Post-MVP |
| **AI assist banter** | Extra talk between authored beats | Phase 4 only |

### 4.3 Session flow

```
Age gate → optional prefs → Character creator
→ Partner select / bond scene
→ “Begin session” (explicit hands-free consent beat)
→ Induction (focus, breathing, eye contact)
→ Deepening (tease, control, sensory language)
→ Peak (HFO climax sequence)
→ Aftercare
→ Save → hub / journal
```

### 4.4 Tone for v1

**Intimate erotic hypnosis / guided control** with romantic heat available as a flavor — partner talks you into trance and climax.

Ship **2 partners** with different induction styles:

- **Partner A — Soft overwhelm:** praise, warmth, slow breathing, “let go for me”
- **Partner B — Sharp control:** commands, denial edges, precise timing, “don’t touch — finish anyway”

---

## 5. Core systems

### 5.1 Player character (customizable)

MVP creator fields:

- Name / nicknames partners can use
- Pronouns
- Body preset (type, presentation, skin/hair ranges)
- Voice addressed as (sir/baby/good boy/good girl/neutral — player picks allowed terms)
- Sensitivity profile (what language hits harder: praise, degradation-lite, ownership, sensory, etc.)
- Optional: arousal triggers list used by session writer tags

Creator output is referenced in dialogue via tokens (`{name}`, `{praise_term}`, etc.).

### 5.2 Relationship / control stats (per partner)

Keep small:

- **Trust** (0–100) — safety, vulnerability
- **Attunement** (0–100) — how well they “read” the player (affects induction strength)
- **Control** (0–100) — permission to go deeper / stricter HFO guidance
- **Flags** — unlocks (`first_session`, `edged_once`, `finished_for_them`, …)

### 5.3 Player session state (during HFO)

Runtime-only meters (not permanent RPG clutter):

- **Focus** — built by following beats / choosing surrender choices
- **Heat** — arousal build toward climax
- **Edge count** — optional denial loops before release permission

Climax triggers when Heat hits threshold **and** partner grants release (or a “break and finish” fail-forward beat exists).

### 5.4 Personal prefs (optional, not game bans)

Player may set soft/hard limits for tags.  
**Game content policy:** no category bans from the design side; engine still honors the player’s own limits if they set them.

### 5.5 Scene graph + session timeline

Story scenes = normal node graph (dialogue/choices/effects).

HFO sessions add **timed stage scripts**:

```text
session_id
  partner, required stats/flags, tags
  stages[]:
    - id, durationHint, visual, breathCue, textBeats[]
      choices? (rare; prefer continue / deepen / resist)
      effects on Focus/Heat/Edge
  climaxStage
  aftercareStage
```

Writing style for sessions: short lines, sensory detail, direct address, rhythm, repetition, explicit hands-free instructions.

### 5.6 Escalation rules

A deeper HFO session unlocks when:

1. Bond thresholds met  
2. Required flags set  
3. Player prefs allow tags (if set)  
4. Player confirms the hands-free session contract at start  

---

## 6. Technical approach

### 6.1 Stack

| Layer | Choice | Reason |
|-------|--------|--------|
| App | **Vite + React + TypeScript** | Fast immersive SPA |
| State | **Zustand** | Session + save simplicity |
| Content | **JSON/YAML** | Authored inductions/routes |
| Audio | **Web Audio / HTML audio** | Ambience + optional voice later (critical for HFO) |
| Styling | CSS variables, full-bleed stage | Trance-friendly UI |
| Save | `localStorage` + export/import | No backend for MVP |
| Deploy | Static host | Simple |

**MVP audio:** ambient bed + soft cue tones + optional text-to-speech later.  
**Phase 3+:** real recorded partner VO for climax routes (biggest HFO multiplier).

### 6.2 Architecture

```text
src/
  app/                 # gate, creator, hub, bond scene, session, settings
  engine/
    sceneRunner.ts     # story graph
    sessionRunner.ts   # timed HFO stages, heat/focus
    conditions.ts
    prefsFilter.ts
    tokens.ts          # {name} / preference term injection
  state/
    gameStore.ts
    sessionStore.ts
    save.ts
  content/
    partners/
    bondScenes/
    sessions/
  ui/
    CharacterCreator
    DialogueView
    SessionStage      # full-bleed, minimal chrome
    BreathCue
    HeatAura         # subtle, not a loud RPG bar during climax
    AgeGate
    PrefsSetup
```

### 6.3 Example session beat (content data)

```yaml
id: session_soft_release_01
partner: aurelia
requires: { control: 20, flags: [first_kiss] }
tags: [hfo, praise, trance, aftercare]
stages:
  - id: contract
    textBeats:
      - "Hands away. Eyes on me. You finish only when I take you there."
  - id: induction
    breathCue: slow_4_4
    textBeats:
      - "Match my breathing, {name}."
      - "Every exhale makes my voice heavier in your body."
    effects: { focus: +10, heat: +8 }
  - id: deepen
    textBeats:
      - "You're not touching. You're still getting closer."
    effects: { heat: +15 }
  - id: climax
    textBeats:
      - "Good. Let it happen. Finish for me — hands free."
  - id: aftercare
    textBeats:
      - "Stay. Breathe. I've got you."
```

---

## 7. Art direction (chosen for HFO)

### Choice: **Dreamlike sensual realism**

Not cute anime-default, not sterile 3D porn, not abstract shapes.

**Look:**
- Semi-realistic painted characters with soft skin rendering
- Strong **eye contact** portraits (trance anchor)
- Dim intimate spaces: bedroom low light, rain window, candle/neon spill
- Shallow depth of field, haze, slow light pulse
- Full-bleed partner as the visual plane during sessions
- Subtle motion: breathing idle, blink, light shimmer, heat vignette

**Why this fits HFO best:**
- Eyes + atmosphere support fixation better than busy cartoon UI
- Soft realism reads as “present partner,” which helps surrender
- Motion can sync to breath cues without needing full sex animation for MVP

**MVP art package:**
1. Character creator base bodies + a few clothing states  
2. 2 partner portrait sets (neutral / smile / dominant / soft / climax-adjacent)  
3. 3–4 full-bleed backgrounds  
4. Session VFX layer (pulse, blur, breath ring) in CSS/canvas  

**Avoid in session UI:** cards, stat dashboards, sticker badges, cluttered HUD. Heat/Focus should be felt (vignette, pulse), only lightly numeric in settings/debug.

---

## 8. Content plan (MVP)

### Must ship

- Age gate + optional prefs  
- Customizable PC  
- **2 partners** (soft overwhelm vs sharp control)  
- Bond scenes to unlock sessions (~6–10)  
- **3 HFO sessions** (short / medium / deep)  
- Hands-free contract beat + aftercare on every session  
- Save / load / export  
- Quick replay of unlocked sessions  

### Explicitly out of MVP

- Multiplayer  
- AI as the climax engine  
- Full animated sex 3D  
- Huge partner roster  
- Account/cloud (unless needed later)  

### Voice

- MVP: text rhythm + ambience + breath/metronome cues  
- Best upgrade path: recorded VO for session stages (highest HFO impact per effort)

---

## 9. Build phases

### Phase 0 — Plan lock (this doc) ✅

Decisions locked: HFO goal, customizable PC, sensual-realism art, no game-side content bans.

### Phase 1 — Engine skeleton ✅

- Vite/React/TS bootstrap  
- Age gate, optional prefs, save  
- Character creator (MVP fields)  
- Story runner + session runner  

### Phase 2 — Vertical slice (prove HFO loop) ✅

- 1 partner (Aurelia)  
- 1 bond scene  
- 1 complete HFO session (contract → induction → deepen → edge → peak → aftercare)  
- Breath cues + heat/focus feel  
- Dreamlike full-bleed UI  

### Phase 3 — MVP pack

- Second partner + 2 more sessions  
- Creator polish + tokenized dialogue  
- Quick session replay  
- Mobile pass  

### Phase 4 — Depth

- More routes / longer denial chains  
- Optional VO  
- Optional AI side-banter between authored beats  
- Journal of finishes / favorite inductions  

---

## 10. Partner templates (v1)

### Partner A — Aurelia (soft overwhelm)

1. **Fantasy:** She melts your resistance with praise until finishing feels inevitable  
2. **Voice:** Warm, close, slow  
3. **Escalation:** Trust → Attunement → gentle Control  
4. **Signature:** Breathing sync session; “finish because you’re safe” climax  
5. **Aftercare:** Grounding, water, affection  

### Partner B — Vex (sharp control)

1. **Fantasy:** They own the pacing; you edge on command and release only when allowed  
2. **Voice:** Precise, teasing, firm  
3. **Escalation:** Control rises faster; Trust gates aftercare intensity  
4. **Signature:** Denial loops → permission climax  
5. **Aftercare:** Short, dominant-soft (“good. rest.”)

---

## 11. Tag taxonomy

Core: `hfo`, `trance`, `joi_handsfree`, `breathplay_light`, `praise`, `degrade_lite`, `denial`, `edging`, `ownership`, `sensory`, `aftercare`, `romance`, `dominant`, `worship`

Used for prefs filtering + gallery — not as a ban list for the game itself.

---

## 12. Risks and mitigations

| Risk | Mitigation |
|------|------------|
| Session broken by UI chrome | Separate SessionStage with almost no HUD |
| HFO fails without audio | Ship breath/metronome + ambience early; VO next |
| Creator delays content | Preset bodies first, deep sliders later |
| Feels like generic VN | Time-based heat/focus + hands-free contract |
| Scope explosion | Cap at 2 partners / 3 sessions for MVP |
| Trance broken by choices spam | Few choices inside sessions; mostly continue/deepen/resist |

---

## 13. Success criteria (MVP)

A player can:

1. Create a custom character in a few minutes  
2. Bond enough to unlock a session  
3. Run a full hands-free guided scene without UI breaking focus  
4. Reach a designed climax beat (Heat + release permission)  
5. Get aftercare and save  
6. Replay that session from the hub  

If #3–4 don’t feel immersive, fix presentation/audio before adding partners.

---

## 14. Open (optional) leftovers

Only still open if you care:

1. Working **title / brand name**  
2. Partner gender presentation preferences for v1 cast  
3. Whether PC customization includes explicit body detail for partner dialogue  

---

## 15. Next build step

Implement **Phase 1 + Phase 2 vertical slice** next:

- Scaffold app  
- Character creator  
- One partner (Aurelia)  
- One full HFO session with breath cues + heat/focus  
- Dreamlike sensual-realism UI shell (full-bleed, minimal chrome)

That slice proves the product. Content volume comes after.
