# Procedural Infinite Quiz Engine

## Architecture Overview

The new Quiz Engine is built around a modular procedural generation system:

- `QuizEngine`
  - `TemplateRegistry`
  - `DifficultyEngine`
  - `AntiRepetitionStore`
  - `ValidationEngine`
  - `SeedSystem`
  - `Subject Generators`
  - `LaTeX Rendering`

## Key modules

### `src/lib/quizEngine/types.ts`
Defines the core types used across the engine:
- `Difficulty`
- `GeneratedQuestion`
- `Template`
- `SubjectGenerator`

### `src/lib/quizEngine/seed.ts`
Provides robust deterministic seed generation and PRNG:
- `createSessionSeed()`
- `createRng(seed)`

### `src/lib/quizEngine/difficulty.ts`
Contains difficulty profiles and selection logic.

### `src/lib/quizEngine/antiRepetition.ts`
Stores recent signatures and prevents repeated question generation.

### `src/lib/quizEngine/validation.ts`
Validates generated expressions before questions are used.

### `src/lib/quizEngine/engine.ts`
Core generation engine that combines templates, anti-repetition, and difficulty.

## Subject generators added

- `derivatives`
- `integrals`
- `limits`
- `sequences`
- `probabilities`
- `vectors`
- `geometry`

Each generator is registered as a template in `src/lib/quizEngine/registrySetup.ts`.

## Frontend integration

- `src/components/QuizPlayer.tsx`
- `src/pages/Quiz.tsx`
- `src/App.tsx` route `/quiz`

The UI uses `react-katex` and `BlockMath` for safe LaTeX rendering.

## How to run

```bash
npm install
npm test
npm run build
```

## QA criteria

- [x] No static question bank
- [x] Seeded generation with unique session seeds
- [x] Anti-repetition layer for signatures
- [x] Difficulty profiles applied
- [x] Validation engine checks expressions
- [x] LaTeX rendering with `react-katex`
- [x] Frontend page integrated with routing
- [x] Performance generation tested

## Notes

The implementation is lightweight and designed to avoid freezes by generating one question at a time and caching the engine instance in React.
