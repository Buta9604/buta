# Adult Browser Roleplay Game — Master Plan

**Working title:** (TBD)  
**Genre:** Erotic relationship sim + choice-driven visual novel (browser)  
**Audience:** Adults 18+ only  
**Goal of this doc:** Lock the best buildable design before code.

---

## 1. Product verdict (what to build)

Build a **relationship-first erotic roleplay game**, not a porn slideshow and not a freeform chatbot-first product.

**Core fantasy loop:**

1. Meet / pick a partner (or create chemistry with one)
2. Talk, flirt, make choices that change trust / desire / kink unlocks
3. Unlock intimate scenes that feel earned
4. Replay with different partners, paths, and intensity

This is the proven browser pattern (visual novel + dating sim) and ships quality faster than open-world or AI-only RP.

**Do not start with:** full AI chat, multiplayer, 3D, or a huge sandbox. Those kill focus and quality.

---

## 2. Non‑negotiables

| Rule | Why |
|------|-----|
| Hard **18+ age gate** before any content | Legal / platform safety |
| Explicit **consent / content preferences** setup | Players set soft/hard limits up front |
| All characters clearly **adult** | Absolute requirement |
| Content is **data-driven** (JSON/YAML), not hard-coded in UI | Writers can expand without rewriting app logic |
| Local save + export/import | Browser games die without reliable saves |
| Scene intensity gated by relationship + prefs | Feels like roleplay, not random jumps |

---

## 3. Player fantasy (north star)

> “I am in a charged relationship with someone specific. What I say and choose changes how close we get — and what we’re willing to do together.”

Everything (UI, writing, systems) should serve that sentence.

---

## 4. Recommended game structure

### 4.1 Modes

| Mode | Purpose | Priority |
|------|---------|----------|
| **Story arcs** | Hand-authored routes with strong scenes | MVP |
| **Free roam evenings** | Pick location → talk / date / escalate | MVP-light |
| **Replay / gallery** | Revisit unlocked scenes | Post-MVP |
| **AI assist dialogue** (optional later) | Extra banter between authored beats | Phase 3 only |

### 4.2 Session flow

```
Age gate → Content prefs → Character select / create
→ Hub (apartment / city night)
→ Encounter (dialogue + choices)
→ Relationship update
→ Intimate scene (if unlocked)
→ Save → return to hub
```

### 4.3 Content pillars (start with 1, not 5)

Pick **one** tone for v1 so writing stays coherent:

**Recommended v1 tone:** Contemporary romantic heat — flirty, emotional, explicit when earned.  
(Alternate tones later: power-exchange, workplace slow-burn, supernatural, etc.)

Ship **2 partners** in MVP (different personalities / dynamics), not 10 shallow ones.

---

## 5. Core systems (must design before coding)

### 5.1 Relationship stats (keep small)

Per partner:

- **Trust** (0–100) — vulnerability, honesty, softness
- **Desire** (0–100) — sexual tension / escalation readiness
- **Comfort** (0–100) — how far they go with specific acts
- **Flags** — story/kink unlock booleans (`first_kiss`, `slept_over`, `collar_talk`, …)

Avoid 20 stats. Three meters + flags is enough for meaningful branching.

### 5.2 Content preference profile (player)

On first launch, player sets:

- Soft limits (warn / fade)
- Hard limits (never show)
- Intensity ceiling (suggestive → explicit)
- Dynamics they want (gentle, dominant, playful, etc.)

The engine **filters choices and scenes** against this profile. That is the “roleplay safety layer.”

### 5.3 Dialogue / scene graph

Each scene is a node graph:

```text
node_id
  speaker, text, emotion, background
  choices[] → effects (stat deltas, flags, next node)
  conditions (min trust/desire, required flags, pref tags)
  tags (romance, oral, bondage, aftercare, …)
```

**Intimate scenes** are normal scenes with higher tag intensity + optional multi-step beats (tease → act → aftercare).

### 5.4 Escalation rules

A scene unlocks only if:

1. Relationship thresholds met  
2. Required story flags set  
3. Player prefs allow the scene tags  
4. (Optional) player explicitly consents at a “continue?” beat for high-intensity tags

This makes sex feel like roleplay consequence, not a menu.

### 5.5 Player identity (light)

MVP: name + pronouns + presentation preset.  
Later: fuller character creator if it matters to the fantasy.

---

## 6. Best technical approach

### 6.1 Stack (browser, fast, maintainable)

| Layer | Choice | Reason |
|-------|--------|--------|
| App | **Vite + React + TypeScript** | Fast SPA, great for game UI |
| State | **Zustand** (or similar) | Simple game state, easy persist |
| Content | **JSON/YAML scene files** | Non-dev editable content |
| Styling | CSS variables + modern layout | Atmospheric, brandable UI |
| Save | `localStorage` + JSON export/import | No backend required for MVP |
| Deploy | Static host (Vercel/Netlify/GitHub Pages) | Cheap, simple |

**Skip for MVP:** database, accounts, payments, native apps, Unity/WebGL.

### 6.2 Architecture sketch

```text
src/
  app/                 # routes: gate, prefs, hub, scene, settings
  engine/
    sceneRunner.ts     # walk node graph, apply effects
    conditions.ts      # canShowChoice / canUnlockScene
    prefsFilter.ts     # hard/soft limit filtering
  state/
    gameStore.ts       # relationships, flags, inventory, history
    save.ts            # persist / export / import
  content/
    partners/
    scenes/
    endings/
  ui/
    DialogueView
    ChoiceList
    RelationshipHUD
    AgeGate
    PrefsSetup
```

### 6.3 Content pipeline

Writers (or you) author scenes in structured files. The app never hardcodes story text in components.

Example scene fragment:

```yaml
id: cafe_first_date_01
partner: maya
background: cafe_night
nodes:
  start:
    speaker: maya
    text: "You kept looking at me like you already knew how tonight ends."
    choices:
      - text: "I was trying not to."
        effects: { desire: +2, trust: +1 }
        next: soft_flirt
      - text: "Maybe I do."
        effects: { desire: +4 }
        requires: { prefsAllow: [dominant_tease] }
        next: bold_flirt
```

---

## 7. UX / presentation plan

Browser erotic RP wins on **mood + readable dialogue**, not chrome.

**First session experience:**

1. Age gate (clear, no tease-around)
2. Short content prefs
3. Partner intro (strong personality, not a stats sheet)
4. One complete evening arc ending in a meaningful intimate beat or charged almost

**UI principles:**

- Full-bleed scene atmosphere (background art / gradient / lighting)
- Dialogue + choices as the main interaction
- Minimal HUD (only trust/desire when useful)
- No dashboard clutter in the romantic/sexual moments
- Mobile-first tap targets; desktop gets keyboard continue

**Art strategy for MVP:**

- Stylized still backgrounds + character portraits / expression variants
- Optional simple sprite poses later
- Avoid waiting on full animation before writing/systems ship

---

## 8. Content plan (MVP scope)

### Must ship

- Age gate + prefs
- 1 player identity setup
- **2 partners**
- **~8–12 dialogue scenes** total
- **3–5 intimate scenes** (branched, preference-gated)
- Hub with 2–3 locations
- Save / load / export
- Basic gallery of unlocked scenes

### Explicitly out of MVP

- AI-generated sex chat as the core loop
- Multiplayer / online partners
- Voice acting
- Complex inventory crafting
- Dozens of partners
- Monetization paywalls (add only after fun loop exists)

---

## 9. Build phases

### Phase 0 — Plan lock (this doc)

Decide tone, partner concepts, kink tag list, MVP scene list.

### Phase 1 — Engine skeleton

- Project bootstrap (Vite/React/TS)
- Age gate, prefs, save store
- Scene runner + one dummy scene end-to-end

### Phase 2 — Vertical slice

- One partner, one full evening: meet → flirt → escalate → intimate → aftercare
- Prove prefs filtering + stat gating feel good

### Phase 3 — MVP content pack

- Second partner + hub + remaining scenes
- Polish UI, mobile layout, gallery

### Phase 4 — Depth

- More branches, endings, replay hooks
- Optional AI-assisted side banter (strictly wrapped, tagged, skippable)
- Optional accounts/cloud save

---

## 10. Partner concept template (fill before writing)

For each partner define:

1. **Fantasy in one line** (what the player gets emotionally/sexually)
2. **Voice** (how they talk)
3. **Soft / hard limits** (in-character)
4. **Escalation curve** (what unlocks at Trust/Desire bands)
5. **Signature scenes** (2–3 must-play moments)
6. **Aftercare style**

Example seeds (replace with your taste):

- **Partner A — Warm slow-burn:** teasing intimacy, praise, emotional nakedness before explicit acts  
- **Partner B — Playful power:** banter, light control dynamics, clear safeword fiction inside the fiction  

---

## 11. Tag taxonomy (start small)

Use tags for filtering and gallery:

`romance`, `kissing`, `undress`, `oral`, `penetrative`, `toys`, `light_bondage`, `dominant`, `submissive`, `praise`, `rough`, `aftercare`

Player hard-limits hide matching content. Soft-limits warn or fade.

Expand tags only when a scene needs a new one.

---

## 12. Risks and how we avoid them

| Risk | Mitigation |
|------|------------|
| Endless content scope | Cap MVP partners/scenes hard |
| Feels like menu porn | Gate intimacy behind relationship + story |
| AI chat becomes the product too early | Authored scenes first; AI only as garnish later |
| Shamey / creepy UX | Clear consent prefs, aftercare beats, adult framing |
| Unmaintainable story code | All narrative in data files |
| Mobile unusable | Design dialogue UI for phone first |

---

## 13. Success criteria for “MVP is good”

A stranger can:

1. Pass age gate and set limits in under 2 minutes  
2. Finish one evening route in one sitting  
3. Feel the partner’s personality in dialogue  
4. Unlock an intimate scene that matches their prefs  
5. Reload and take a different branch  

If those five work, expand content. If not, do not add partners.

---

## 14. Immediate next decisions (need from you)

Answer these and implementation can start cleanly:

1. **Tone:** romantic heat / darker power / playful smut / other?
2. **Perspective:** you play as a customizable PC, or fixed protagonist?
3. **Art direction:** illustrated anime-like, semi-realistic, stylized minimal, or text-forward with strong UI atmosphere?
4. **Partner count for v1:** stick with 2?
5. **Any hard content bans** you personally want in the whole game (beyond player prefs)?
6. **Title / brand name?**

---

## 15. Recommended next build step

After you answer §14, implement **Phase 1 + Phase 2 vertical slice** in this repo:

- Scaffold Vite/React/TS app  
- Age gate + prefs + save  
- One partner, one complete route with an intimate scene  
- Atmospheric UI (not a dashboard)

That slice proves the game. Everything else is content volume.
