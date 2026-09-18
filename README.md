# Design for Differences — prompt router

Interviews an educator about their teaching material, then recommends and assembles the
right UDL redesign prompts to paste into any AI assistant. No AI calls, no backend; answers
live only in the browser's `localStorage`. See [prd.md](prd.md).

```bash
npm install
npm run dev      # http://localhost:5173
npm test         # routing, assembly, content-fidelity and contrast tests
npm run build    # static build in dist/ (Vercel-ready, SPA rewrite in vercel.json)
```

## Where things live

- `src/content/prompts.ts` — prompt text. `packText` is the v2 pack verbatim; `base` is derived
  from it by replacing markers only. A test checks every block against
  `design-for-variability-prompt-pack.html`.
- `src/content/questions.ts`, `src/content/copy.ts` — all other user-facing text.
- `src/lib/router.ts` — recommendation rules (§5), pure.
- `src/lib/assemble.ts`, `src/lib/export.ts` — interpolation, copy-all, markdown.
- `src/theme/colors.ts` — palette tokens (the only colours Tailwind knows about).

## Decisions beyond the PRD

- **Contrast:** amber, sage, clay and mute were darkened to pass AA; the pack originals remain
  as `amber-bright` / `sage-bright` for decorative rules only.
- **Markers with no interview answer:** prompt 3's improved material and prompt 4's
  "barriers you identified" / "how learners get help" are replaced with bracketed
  instructions telling the AI to ask, in the §5.3 style. Prompt 1 and 5's `[PASTE]` becomes
  `see "My material" above`, so the material isn't pasted twice.
- **Accessibility check:** with `npm run dev` running, axe can be loaded in the browser console
  from `/node_modules/axe-core/axe.min.js`.
