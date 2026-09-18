# PRD — Design for Differences (prompt router web app)

**Owner:** Kerri
**Build agent:** Claude Code
**Status:** Ready to build
**Version:** 1.0

---

## 1. What this is

A single-page web app that interviews an educator about their teaching material, then
recommends and assembles the right UDL redesign prompts for them to paste into whichever
AI assistant they already use.

The app does **not** call an AI model. It is a guided form plus a deterministic
recommendation engine plus a prompt assembler. All the intelligence lives in the prompt
templates and the routing rules.

### Why it exists

The prompt pack currently exists as a printed one-pager. Educators either run the wrong
prompt for their material (text prompts on a physical procedure, which produces plausible
and useless advice) or never start because prompt 0 asks seven questions they have to
answer in a chat window with no structure. The app removes both failure modes.

### Non-goals for v1

- No AI API calls. No cost, no latency, no API key.
- No accounts, no login, no database.
- No storage of user material on any server.
- No file upload or document parsing.
- No analytics beyond anonymous page views (optional, see §11).

---

## 2. Users

| User | Context | What they need |
|---|---|---|
| University lecturer | Has UDL training, limited time, moderate AI fluency | To be told which prompt, not given seven |
| Preschool / school teacher | Strong pedagogy, low AI fluency | Plain language, no jargon, worked examples |
| Corporate trainer | Procedural material, deadline pressure | Speed — under five minutes to a usable prompt |
| Workshop attendee | Just saw a 15-minute demo, has a QR code | To get something usable before they lose interest |

**Design implication:** the app must be usable by someone who has never written a prompt,
on a phone, in a conference corridor, in under five minutes.

---

## 3. Core flow

```
Landing  →  Interview (8 steps)  →  Results  →  Copy / Export
   ↑                  ↓
   └────── Edit answers ──────────┘
```

1. **Landing** — one screen explaining what the app does and what the user needs to hand.
2. **Interview** — eight questions, one per screen, with progress indicator. Back/forward.
3. **Results** — a recommended sequence of prompts, each pre-filled with the user's answers.
4. **Copy / Export** — per-prompt copy button, plus copy-all and download-as-markdown.

The user can return to any interview step from the results screen and the prompts
re-assemble live.

---

## 4. The interview

Eight steps. Each screen: one question, helper text, input, Back / Next.
**Every question except Q1 and Q4 must be skippable** — a skipped question means the
router falls back to a safe default (see §5.3). Never block progress.

### Q1 — Your material *(required)*

- **Question:** What are you redesigning?
- **Input:** Large textarea. Placeholder: *"Paste your handout, instructions, slide text or task brief — or describe it if you don't have it to hand."*
- **Helper:** "This stays in your browser. It is never sent anywhere."
- **Validation:** Minimum 20 characters. Error copy: "Add a bit more so the prompts can refer to it."

### Q2 — Kind of material *(required, single select)*

- **Question:** Is this something to read, something to do, or both?
- **Options:**
  - `text` — Something to read or understand (a handout, a reading, an explanation)
  - `procedural` — Something to physically do (a technique, a folding task, equipment, a lab or workshop process)
  - `both` — Both (instructions for a physical task, with reading involved)
- **Drives:** which lens is appended to prompts 1 and 2.

### Q3 — Sequence *(single select)*

- **Question:** Does the order matter?
- **Helper:** "If a learner does step 4 before step 3, does it go wrong?"
- **Options:** `yes` / `no` / `not sure`
- **Drives:** whether prompt 5 (Checkpoints) is recommended and how strongly.
- **Default if skipped:** `yes` when Q2 is `procedural` or `both`, otherwise `not sure`.

### Q4 — Outcome *(required)*

- **Question:** What must the learner be able to do at the end?
- **Helper:** "Write it as something you could watch them do. Not 'understand buoyancy' — 'fold a boat that floats for two minutes'."
- **Input:** Single-line text, ~140 chars.
- **Soft validation:** If the answer begins with or contains only *understand / know / appreciate / be aware of / be familiar with*, show a non-blocking nudge: *"That's hard to design around. Can you name something observable?"* with a **Keep it anyway** button. Never block.

### Q5 — Competency vs delivery *(two fields, skippable)*

- **Question:** What part of that is the actual skill, and what part is just how you happen to deliver it?
- **Field A:** "The part that must not change" (this is the competency)
- **Field B:** "The part that could be done another way" (this is the delivery)
- **Helper:** "Example: the competency is explaining the process. Delivering it as a spoken presentation is just how you've been doing it."
- **Drives:** interpolated into prompts 1, 2 and 4. If skipped, prompts include a line telling the AI to ask the user about it.

### Q6 — Presence *(single select)*

- **Question:** Will you be there when they use it?
- **Options:**
  - `present` — I'll be in the room
  - `standalone` — It has to work on its own
  - `mixed` — Some of each
- **Drives:** `standalone` promotes prompt 5 to **required** and adds a line to prompt 3.
- **Default if skipped:** `mixed`.

### Q7 — Constraints *(multi-select chips + free text, skippable)*

- **Question:** What can't you change?
- **Chips:** `Time in session` · `Room or layout` · `Equipment or budget` · `Assessment rules` · `Class size` · `Fixed materials` · `Nothing much`
- **Free text:** "Anything else that's fixed"
- **Drives:** appended verbatim to prompts 2 and 4 so suggestions stay implementable.

### Q8 — Known barriers *(multi-select chips + free text, skippable)*

- **Question:** Anything you already know about access barriers in this group?
- **Helper (must be prominent):** "Describe what's hard to do, not who anyone is. Don't name learners or conditions."
- **Chips (functional only):** `Reading or writing speed` · `Vision` · `Hearing` · `Fine motor control` · `Mental rotation / spatial` · `Language of instruction` · `Sustained attention` · `Stamina or fatigue` · `Technology or connectivity access` · `Confidence to ask for help` · `None that I know of`
- **Free text:** "Anything else, described as a barrier"
- **Drives:** `Vision` selected ⇒ prompt 6 becomes **required**. All selections interpolate into prompts 1 and 3.

#### Privacy guard on Q1 and Q8

Client-side only, advisory, never blocking. If the text matches a small list of
diagnosis and identity terms (see `src/lib/privacyTerms.ts` — include common condition
names, "diagnosed with", "has a statement of", "IEP", "EHCP", and similar), show an
inline amber notice:

> **Worth rewording.** It looks like there's a diagnosis or a named learner in here.
> The prompts work better with the barrier described instead — and that information
> isn't yours to put into a general-purpose AI tool.

Include a **Dismiss** action. Do not prevent the user continuing. Do not log the match.

---

## 5. The recommendation engine

### 5.1 Rules — deterministic, no AI

Evaluate in order. Each prompt gets a status of `required`, `recommended`, or `optional`,
plus a one-line reason shown on the results card.

| Prompt | Status rule | Reason string shown to user |
|---|---|---|
| **0 Route my material** | Never shown in results — the app *is* prompt 0 | — |
| **1 Barrier scan** | Always `required` | "Start here. It tells you what your material assumes." |
| **2 Channel multiplier** | Always `required` | "Three real alternatives, before anyone has to ask." |
| **3 Who does this exclude?** | Always `required` | "Run this on your new version, not just the old one." |
| **4 Disclosure reducer** | Always `required` | "Turns the barriers you found into things nobody has to ask for." |
| **5 Checkpoints** | `required` if Q3 = `yes` **or** Q6 = `standalone`; else `recommended` | Q3=yes → "Your material has an order that matters, so an early mistake stays hidden."<br>Q6=standalone → "Nobody will be there to catch a wrong turn." |
| **6 Sight-independent** | `required` if Q8 includes `Vision`; else `optional` | Vision → "You've flagged a vision barrier. This is the one that actually addresses it."<br>Otherwise → "Worth running even with nobody visually impaired in the room — it exposes assumptions the other prompts miss." |

### 5.2 Lens selection

| Q2 answer | Prompt 1 lens | Prompt 2 lens |
|---|---|---|
| `text` | Text lens only | Text lens only |
| `procedural` | Procedural lens only | Procedural lens only |
| `both` | Both lenses, text first, with a merge instruction | Both lenses, with a merge instruction |

Merge instruction appended when `both`:
`Run both lenses and give me one combined list, flagging anything that appears in both.`

### 5.3 Defaults when skipped

Never block and never guess silently. If a question was skipped, the assembled prompt
includes an explicit instruction to the AI to ask for it:

```
[The educator did not specify the competency. Ask them what part of the outcome
must not change before you give redesign advice.]
```

Show a small **"3 answers skipped — prompts will ask for these"** note on the results screen.

### 5.4 Ordering

Results display in this order, grouped by status:
`1 → 2 → 5 (if required) → 3 → 4 → 6`

Rationale: scan the material, generate alternatives, add checkpoints to those
alternatives, then stress-test the whole thing, then reduce disclosure, then the
sight-independent rewrite as a final pass.

---

## 6. Prompt templates

Store in `src/content/prompts.ts` as typed objects. **Do not hardcode prompt text in
components.** Structure:

```ts
type PromptId = 'p1' | 'p2' | 'p3' | 'p4' | 'p5' | 'p6';

interface PromptTemplate {
  id: PromptId;
  number: number;          // display number
  title: string;           // "Barrier scan"
  tagline: string;         // "What does this assume?"
  intro?: string;          // optional short explainer shown above the prompt
  base: string;            // shared body, with {{placeholders}}
  lenses?: {
    text?: string;
    procedural?: string;
  };
}
```

### Placeholders

Interpolate with double braces. If a value is empty, substitute the corresponding
"ask me" fallback line from §5.3 rather than leaving the placeholder or an empty string.

| Placeholder | Source |
|---|---|
| `{{material}}` | Q1 |
| `{{outcome}}` | Q4 |
| `{{competency}}` | Q5 field A |
| `{{delivery}}` | Q5 field B |
| `{{presence}}` | Q6, rendered as a sentence |
| `{{constraints}}` | Q7 chips + free text, comma-joined |
| `{{barriers}}` | Q8 chips + free text, comma-joined |

### Prompt content

Use the text from **The Design for Differences Prompt Pack, version 2** (HTML file
supplied alongside this PRD) verbatim for prompts 1–6, with these modifications:

- Replace the manual `[PASTE]` and `[FROM PROMPT 0]` markers with the placeholders above.
- Prepend to every prompt the standing preamble:

```
You are helping an educator redesign teaching material using Universal Design for
Learning. I am not a disability specialist, so explain things plainly and avoid jargon.

My material: {{material}}

What the learner must be able to do at the end: {{outcome}}
The part that must not change: {{competency}}
The part that could be done another way: {{delivery}}
Where it's used: {{presence}}
Fixed constraints: {{constraints}}
Access barriers I already know about: {{barriers}}

---
```

- Append to every prompt:

```
---
Before you finish, tell me anything you needed and had to assume. Do not invent detail
about my learners or my room.
```

---

## 7. Screens

### 7.1 Landing

- Title, one-sentence explanation, "About 5 minutes" time estimate.
- A short "What you'll need" list (the six items from the pack's pre-flight table).
- Primary button: **Start**.
- Secondary link: **See all seven prompts** → static reference page (§7.4).
- Privacy line, visible without scrolling: *"Everything stays in your browser. Nothing is sent to a server."*

### 7.2 Interview

- One question per screen. Progress bar with step count ("3 of 8").
- **Back** always available. **Next** always available except when Q1/Q4 validation fails.
- **Skip this** link on skippable questions.
- Answers persist to `localStorage` under a single key so a refresh doesn't lose work.
- A **Start over** action clears storage, with a confirm.

### 7.3 Results

- Heading: "Run these, in this order."
- Skipped-answers note if any.
- One card per recommended prompt, in the §5.4 order:
  - Status pill: `Required` (amber) / `Recommended` (sage) / `Optional` (grey)
  - Number, title, tagline
  - **Why this one** — the reason string from §5.1
  - Collapsed prompt body; **Show prompt** expands it
  - **Copy prompt** button → clipboard, with a "Copied" confirmation that is announced to screen readers
  - Optional tip line for prompts 3, 5, 6 (from the pack's grey explainer paragraphs)
- Sticky footer bar: **Copy all prompts** · **Download as .md** · **Edit my answers**
- Below the cards: the **Where to stop and refer** panel from the pack, verbatim, always shown regardless of answers. This is not optional content.

### 7.4 All prompts (static reference)

Plain page listing all seven prompts including prompt 0, uninterpolated, for someone who
wants the whole pack without the interview. Linked from landing and results.

---

## 8. Design system

Match the existing printed pack and slide decks exactly.

```
--deep:  #1F3A46   (dark panels, headings on light)
--sand:  #F3ECE2   (page background)
--tint:  #EBE1D3   (secondary panels)
--amber: #D97642   (primary accent, required status, CTAs)
--sage:  #7FA090   (recommended status, secondary accent)
--clay:  #8C6A4E   (procedural lens marker, warnings)
--ink:   #22323A   (body text)
--mute:  #6E7F87   (secondary text)
--line:  #E5DDD1   (dividers)
```

- **Headings:** a serif — Cambria if available, else Georgia, else system serif.
- **Body and UI:** a humanist sans — Calibri if available, else system sans.
- **Prompt bodies:** monospace, in a `--sand` panel on white cards.
- Rounded corners (8–12px), soft shadows on white cards, generous whitespace.
- Kicker labels: uppercase, letterspaced, small, amber.

**Mobile first.** Single column throughout. Minimum tap target 44×44px. The results cards
and the interview must both work at 360px wide.

---

## 9. Accessibility requirements

This app is about inclusive design. If it isn't accessible, it fails on its own terms.
**Treat these as acceptance criteria, not aspirations.**

- WCAG 2.2 AA minimum. Verify contrast on every colour pairing used — check amber-on-sand
  and sage-on-white in particular, and darken the token rather than keeping a failing pair.
- Full keyboard operation. Visible focus ring on every interactive element; never remove
  outlines without a replacement.
- Every input has a real `<label>`. Helper text linked via `aria-describedby`. Errors via
  `aria-invalid` and `role="alert"`.
- Progress announced on step change via a polite live region ("Step 3 of 8, Sequence").
- Copy confirmations announced via a polite live region.
- Chip multi-selects implemented as real checkboxes (visually restyled), not `div`s with
  click handlers.
- Respect `prefers-reduced-motion`: no transitions beyond opacity when set.
- Page `<title>` updates per step.
- Logical heading order, one `<h1>` per view.
- Never use colour alone to convey status — the status pills carry text as well.
- Test with keyboard only, and with a screen reader on at least one full pass.

---

## 10. Tech

- **React 18 + Vite + TypeScript**
- **Tailwind CSS** — define the palette above as theme tokens, don't use arbitrary hex in components
- **No backend.** No Supabase in v1.
- **State:** React context or a single `useReducer`. `localStorage` for persistence.
- **Routing:** `react-router-dom` — `/`, `/interview/:step`, `/results`, `/prompts`
- **Clipboard:** `navigator.clipboard.writeText` with a `document.execCommand` fallback
- **Deploy:** Vercel, static build

### Suggested structure

```
src/
  content/
    prompts.ts          // prompt templates, single source of truth
    questions.ts        // question definitions, options, helper text
    copy.ts             // all user-facing strings
  lib/
    router.ts           // recommendation rules (§5) — pure functions
    assemble.ts         // placeholder interpolation
    privacyTerms.ts     // advisory term list
    storage.ts
  components/
    Interview/
    Results/
    ui/                 // Button, Chip, Card, StatusPill, ProgressBar, LiveRegion
  pages/
```

`src/lib/router.ts` must be pure and unit-testable: takes an answers object, returns an
ordered array of `{ promptId, status, reason }`. No React imports.

---

## 11. Optional analytics

If added: anonymous page-view counts only, via a privacy-respecting provider (Plausible
or similar). **Never** transmit Q1 material text, Q4–Q8 answers, or assembled prompts.
No cookies. If this can't be guaranteed, ship without analytics.

---

## 12. Acceptance criteria

The build is done when all of the following pass.

**Routing**
1. `Q2=text, Q3=no, Q6=present, Q8=[]` → prompts 1,2,3,4 required; 5 recommended; 6 optional. Text lens only.
2. `Q2=procedural, Q3=yes` → prompt 5 shows as **required** with the sequence reason string.
3. `Q6=standalone` → prompt 5 **required** even when `Q3=no`.
4. `Q8` includes `Vision` → prompt 6 **required** with the vision reason string.
5. `Q2=both` → prompts 1 and 2 each contain both lenses plus the merge instruction.

**Assembly**
6. Every `{{placeholder}}` is resolved in every assembled prompt. No braces survive to the output.
7. A skipped Q5 produces the "ask me" fallback line, not an empty string.
8. Copy-all produces prompts separated by a clear divider and numbered in the §5.4 order.
9. Download produces a valid `.md` file containing every recommended prompt.

**Flow**
10. The whole interview is completable using only the keyboard.
11. Refreshing mid-interview restores answers.
12. Editing an answer from results re-assembles prompts without a reload.
13. Q1 and Q4 validation blocks Next; every other question can be skipped.
14. The Q4 soft nudge appears for "understand X" and can be dismissed without changing the answer.

**Content**
15. Prompt text matches the v2 pack exactly, apart from the specified placeholder substitutions.
16. The "Where to stop and refer" panel appears on results for every user, in every state.
17. The privacy notice appears on the landing screen without scrolling.

**Accessibility**
18. Automated axe scan: zero violations on landing, each interview step, and results.
19. Every colour pairing used meets AA contrast.
20. Screen reader announces step changes and copy confirmations.

---

## 13. Phasing

**Phase 1 — usable.** Landing, interview, routing, assembly, per-prompt copy. Desktop and mobile. This is shippable on its own.

**Phase 2 — polish.** Copy-all, markdown download, static all-prompts page, localStorage persistence, privacy guard on Q1/Q8.

**Phase 3 — optional, only if wanted later.** Shareable result links via URL-encoded answers (note: this puts material text in a URL — probably don't). A saved-sessions feature would need Supabase and accounts, which is a different product.

---

## 14. Open questions for Kerri

1. Should the app carry your name / AI Class ASEAN branding, or stay unbranded for wider use?
2. Do you want a feedback link on the results screen ("did this help?"), or keep it entirely frictionless?
3. Is there a domain for this, or should it go to a Vercel subdomain for now?
