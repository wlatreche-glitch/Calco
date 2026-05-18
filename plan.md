# Calco — Public Beta Launch Plan

This is a large request touching navigation, homepage, design system, gamification, legal pages, feedback, analytics and mobile UX. To ship quality without breaking existing tools, I'll deliver it in **4 focused phases**. After you approve, I'll implement Phase 1 first, then continue.

> No existing tool will be removed. Everything is reorganized, not deleted.

---

## Phase 1 — Homepage restructure + Trust + Disclaimer (highest impact)

Rebuild `src/pages/Index.tsx` into clear sections:

1. **Hero 1 — BAC Calculator** (kept as primary). Polished gradient, mascot, headline "كم راح تجيب في الباك؟", CTAs "احسب معدلي الآن" / "ابدأ المراجعة".
2. **Hero 2 — Final Revision Quiz**. Dark premium gradient block with last score, XP, streak, weak subjects (read from `loadState()` in `coachEngine`). CTAs to `/coach`. Chips: BAC 2026, 5 دقائق, الأكثر استخدامًا.
3. **Choose your path** — two big cards: BAC and BEM/متوسط.
4. **Quick access tools** — compact cards for top 5 (Functions, Equations, Graph, Statistics, Physics) with badges.
5. **Organized categories** — collapsible accordion groups (Math / Sciences / Revision / BEM) listing **all existing tools** so nothing is lost.
6. **Trust strip** — glassmorphism cards (منهاج جزائري، AI، موبايل، مراجعة سريعة).
7. **Disclaimer card** — subtle warning UI with the exact Arabic text.

New small components under `src/components/home/`: `HeroBac`, `HeroRevision`, `PathCards`, `QuickTools`, `ToolCategories`, `TrustStrip`, `Disclaimer`.

## Phase 2 — Smart Navigation Hub + Footer + Legal pages

- Rebuild `src/components/Layout.tsx` header into a Smart Nav: search input, tabs (BAC / BEM / المفضلة / الأخيرة), recent + favorites stored in `localStorage`. Mobile-first slide drawer.
- New `src/components/Footer.tsx` with copyright, tagline, links to Terms and Privacy.
- New routes `/terms` and `/privacy` with the Arabic copy from the brief; registered in `App.tsx`.
- Active route highlighting preserved.

## Phase 3 — Feedback + Local Analytics + Gamification polish

- Floating `FeedbackButton` + modal (`src/components/FeedbackModal.tsx`) — stores entries in `localStorage` (`calco_feedback_v1`).
- `src/lib/analytics.ts` — track quizzes done, last/best score, most-used tool, weakest subject, favorites, recents (all localStorage).
- "تقدمك في Calco" card on homepage reading from analytics.
- Polish XP/streak in CalcoCoach: animated XP bumps (Framer Motion), badge chips, weekly goal line, motivational toasts on milestones.
- Smart suggestions: small "ربما تحتاج أيضًا" strip on Functions/Statistics pages (lightweight component, no engine change).

## Phase 4 — Quiz results UX + Mobile/perf polish + Design tokens

- CalcoCoach results: strengths, weaknesses, suggested tools, retry, share (Web Share API), mascot message.
- Empty-state component reused across pages.
- Performance: `React.lazy` + `Suspense` for heavy routes (Graph, Physics, Chemistry, BEMMath, CalcoCoach, Matrices, Statistics) in `App.tsx`; skeletons.
- Design system pass on `index.css` / `tailwind.config.ts`: standardize radii, shadow tokens (`--shadow-card`, `--shadow-glow`), spacing scale tokens, gradient tokens already used (`--gradient-calco`) — extend with `--gradient-revision`, `--gradient-trust`. Replace ad-hoc `from-* to-*` usages on home with token-backed classes.
- Mobile audit: tap targets ≥44px, no horizontal overflow, RTL spacing fixes.

---

## Technical notes

- All Arabic text is hardcoded as in the brief; no i18n framework added.
- No backend changes. No DB migrations. No new dependencies beyond what's already installed (framer-motion, lucide-react, shadcn — all present).
- Existing routes and tool pages are untouched in functionality; only navigation surfaces change.
- Files to add (~12 small components + 2 pages + 1 lib). Files to edit: `Index.tsx`, `Layout.tsx`, `App.tsx`, `index.css`, `tailwind.config.ts`, `CalcoCoach.tsx`.

---

**Reply "go" (or "ابدأ") to start with Phase 1.** You can also tell me to skip/merge phases or change priorities (e.g. "do Phase 1 + 2 together", "Phase 3 first").
