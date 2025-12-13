# Tasks: Training UX Improvements

**Input**: Design documents from `/specs/009-training-ux-improvements/`
**Prerequisites**: plan.md (required), spec.md (required), research.md, data-model.md, quickstart.md

**Tests**: Not explicitly requested - omitting test tasks per plan.md (manual validation via quickstart).

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup

**Purpose**: Verify project structure and add foundational types

- [x] T001 Verify TypeScript compilation passes with `npx tsc --noEmit`
- [x] T002 [P] Add `TrainingStep` type and `currentTrainingStep` field to tutorial state in `src/tutorial/state.ts`
- [x] T003 [P] Add hint persistence utilities (`isHintDismissed`, `dismissHint`) in `src/tutorial/state.ts`

---

## Phase 2: Foundational (Shared CSS & Types)

**Purpose**: CSS classes and base styles needed by multiple user stories

**⚠️ CRITICAL**: These changes enable proper styling across US1, US3, US5, US6

- [x] T004 Add `.training-controls-inline` CSS class in `src/styles.css` for horizontal Play/Reset layout with blue styling
- [x] T005 [P] Add `.prediction-overlay` CSS classes in `src/styles.css` for SVG text overlay (`.correct` green, `.incorrect` red)
- [x] T006 [P] Add `.signal-pulse` CSS animation in `src/styles.css` for signal flow visualization (3s interval, GPU-accelerated)
- [x] T007 [P] Add `.interaction-hint` CSS styles in `src/styles.css` for dismissible hint tooltip

**Checkpoint**: Foundation ready - user story implementation can now begin

---

## Phase 3: User Story 1 - Synchronized Training Step Visualizations (Priority: P1) 🎯 MVP

**Goal**: Animations trigger automatically when user navigates through Forward Pass, Calculate Loss, Backpropagation steps

**Independent Test**: Navigate Understanding Training steps and observe corresponding animations on each step

### Implementation for User Story 1

- [x] T008 [US1] Add step change detection in `src/tutorial/sections/training.ts` - hook into Next/Previous button handlers to detect step transitions
- [x] T009 [US1] Wire Forward Pass step to `renderer.animateForwardPass()` in `src/tutorial/sections/training.ts`
- [x] T010 [US1] Wire Calculate Loss step to `renderer.animateLossHighlight()` in `src/tutorial/sections/training.ts`
- [x] T011 [US1] Wire Backpropagation step to `renderer.animateBackpropagation()` in `src/tutorial/sections/training.ts`
- [x] T012 [US1] Cancel any active animations before starting new step animation in `src/tutorial/sections/training.ts` using `renderer.cancelAnimations()`
- [x] T013 [US1] Ensure animations replay when user revisits a step (Previous button) in `src/tutorial/sections/training.ts`

**Checkpoint**: User Story 1 complete - all three training steps have synchronized animations

---

## Phase 4: User Story 2 - Contextual Math Explanations (Priority: P1) 🎯 MVP

**Goal**: Math content appears within each training step instead of standalone section

**Independent Test**: Expand math in each training step, verify contextual formulas appear

### Implementation for User Story 2

- [x] T014 [US2] Create `getForwardPassMath()` function in `src/education/content.ts` returning sigmoid and weighted sum formulas
- [x] T015 [P] [US2] Create `getLossMath()` function in `src/education/content.ts` returning MSE formula
- [x] T016 [P] [US2] Create `getBackpropMath()` function in `src/education/content.ts` returning weight update formula and learning rate trade-offs
- [x] T017 [US2] Remove standalone "Show Math" section from `src/tutorial/sections/training.ts`
- [x] T018 [US2] Add expandable `<details>` math section to Forward Pass step content in `src/tutorial/sections/training.ts`
- [x] T019 [US2] Add expandable `<details>` math section to Calculate Loss step content in `src/tutorial/sections/training.ts`
- [x] T020 [US2] Add expandable `<details>` math section to Backpropagation step content in `src/tutorial/sections/training.ts`

**Checkpoint**: User Story 2 complete - each training step has its own contextual math

---

## Phase 5: User Story 3 - Simplified Training Controls (Priority: P1) 🎯 MVP

**Goal**: Minimal Play/Reset controls, no duplicate stats, clean interface

**Independent Test**: View training controls, verify only Play/Reset buttons (horizontal, blue), single stats display

### Implementation for User Story 3

- [x] T021 [US3] Modify `createUI()` in `src/controls/playback.ts` to remove `<h3>Training Controls</h3>` heading
- [x] T022 [US3] Modify `createUI()` in `src/controls/reset.ts` to remove `<h3>Reset Network</h3>` heading
- [x] T023 [US3] Combine Play and Reset buttons into single horizontal container using `.training-controls-inline` class in `src/controls/playback.ts`
- [x] T024 [US3] Move Reset button creation from `src/controls/reset.ts` into playback controls for unified layout
- [x] T025 [US3] Remove duplicate stats display - keep only one Steps/Loss in training info area of `src/controls/playback.ts`
- [x] T026 [US3] Remove `[1, 1] -> expects 0` training sample display in `src/controls/playback.ts` (or replace with simple "Training on XOR")
- [x] T027 [US3] Ensure learning rate slider remains hidden in `<details>` in `src/controls/parameters.ts` (verify existing behavior)

**Checkpoint**: User Story 3 complete - training controls simplified to 2 buttons

---

## Phase 6: User Story 4 - Clean Trained Network Section (Priority: P2)

**Goal**: Remove confusing messages and buttons, add signal visualization

**Independent Test**: Train network, navigate to Trained Network section, verify no warning messages, weights pulsate, signal flows

### Implementation for User Story 4

- [x] T028 [US4] Remove "Network not yet trained" conditional message from `src/tutorial/sections/tour.ts`
- [x] T029 [US4] Remove "Highlight strong weights" button and handler from `src/tutorial/sections/tour.ts`
- [x] T030 [US4] Create `animateSignalPulse()` method in `src/visualisation/renderer.ts` - periodic pulse (every 3s) flowing through weight lines
- [x] T031 [US4] Add signal pulse animation trigger when Trained Network section becomes visible in `src/tutorial/sections/tour.ts`
- [x] T032 [US4] Stop signal animation when user navigates away from Trained Network section in `src/tutorial/sections/tour.ts`
- [x] T033 [US4] Ensure signal animation doesn't interfere with weight pulsation CSS in `src/visualisation/renderer.ts`

**Checkpoint**: User Story 4 complete - clean trained network view with ambient signal flow

---

## Phase 7: User Story 5 - Streamlined Run Network Controls (Priority: P2)

**Goal**: Simple inference controls, prominent prediction display

**Independent Test**: Run inference, verify no speed/step controls, prediction prominently visible in panel and on network

### Implementation for User Story 5

- [x] T034 [US5] Remove speed selector (1x/2x/4x buttons) from `src/demo/controls.ts`
- [x] T035 [US5] Remove Previous/Next step buttons from `src/demo/controls.ts`
- [x] T036 [US5] Wrap calculation panel in `<details>` element (collapsed by default) in `src/demo/controls.ts`
- [x] T037 [US5] Create `showPredictionOverlay()` method in `src/visualisation/renderer.ts` - SVG text above output neuron
- [x] T038 [US5] Enhance prediction display in left panel of `src/tutorial/sections/inference.ts` - large font, color-coded (green/red)
- [x] T039 [US5] Call `renderer.showPredictionOverlay()` after inference completes in `src/demo/controls.ts`
- [x] T040 [US5] Add `clearPredictionOverlay()` method and call before new inference in `src/visualisation/renderer.ts`

**Checkpoint**: User Story 5 complete - streamlined inference with prominent prediction

---

## Phase 8: User Story 6 - Interactive Training Encouragement (Priority: P3)

**Goal**: Hint prompts users to interact with weights and nodes

**Independent Test**: Clear localStorage, visit training section, see hint after 2s, dismiss, refresh, hint doesn't reappear

### Implementation for User Story 6

- [x] T041 [US6] Create hint HTML structure with dismiss button in `src/tutorial/sections/training.ts`
- [x] T042 [US6] Add 2-second delay timer before showing hint when training section loads in `src/tutorial/sections/training.ts`
- [x] T043 [US6] Check `isHintDismissed()` before showing hint in `src/tutorial/sections/training.ts`
- [x] T044 [US6] Call `dismissHint()` on dismiss button click in `src/tutorial/sections/training.ts`
- [x] T045 [US6] Style hint with `.interaction-hint` class for positioning and animation in `src/tutorial/sections/training.ts`

**Checkpoint**: User Story 6 complete - first-time users see interaction encouragement

---

## Phase 9: User Story 7 - Real-time Signal Visualization (Priority: P3)

**Goal**: Ambient signal flow animation on trained network

**Independent Test**: On Trained Network section, observe periodic pulse flowing through network layers

### Implementation for User Story 7

- [x] T046 [US7] Implement D3-based signal pulse in `animateSignalPulse()` - traveling dots/brightness along weight lines in `src/visualisation/renderer.ts`
- [x] T047 [US7] Use `setInterval` (3s) for periodic pulse trigger in `src/tutorial/sections/tour.ts`
- [x] T048 [US7] Clear interval when leaving Trained Network section in `src/tutorial/sections/tour.ts`
- [x] T049 [US7] Respect `prefers-reduced-motion` - disable animation if user prefers reduced motion in `src/visualisation/renderer.ts`

**Checkpoint**: User Story 7 complete - trained network has ambient signal visualization

---

## Phase 10: Polish & Cross-Cutting Concerns

**Purpose**: Final validation and cleanup

- [x] T050 Verify all animations respect `prefers-reduced-motion` media query in `src/styles.css` and `src/visualisation/renderer.ts`
- [x] T051 Run TypeScript compilation check with `npx tsc --noEmit`
- [x] T052 Run production build with `npm run build`
- [ ] T053 Run quickstart.md validation checklist - test all 7 user stories' acceptance scenarios
- [ ] T054 Test responsive behavior - verify horizontal buttons stack vertically on mobile (<768px)
- [x] T055 Remove any dead code from removed controls (cleanup in `src/demo/controls.ts`, `src/controls/`)
- [ ] T056 Verify localStorage hint dismissal works correctly (manual test)

---

## Implementation Complete

**Status**: 53/56 tasks complete (94.6%)

Remaining tasks (T053, T054, T056) require manual browser testing via quickstart.md validation checklist.

### Summary of Changes

| Phase | User Story | Status |
|-------|------------|--------|
| 1 | Setup | ✅ Complete |
| 2 | Foundational CSS | ✅ Complete |
| 3 | US1: Synchronized Animations | ✅ Complete |
| 4 | US2: Contextual Math | ✅ Complete |
| 5 | US3: Simplified Controls | ✅ Complete |
| 6 | US4: Clean Trained Network | ✅ Complete |
| 7 | US5: Streamlined Inference | ✅ Complete |
| 8 | US6: Interaction Hints | ✅ Complete |
| 9 | US7: Signal Visualization | ✅ Complete |
| 10 | Polish | 🔄 Manual testing remaining |

### Files Modified

- `src/tutorial/types.ts` - Added TrainingStep type
- `src/tutorial/state.ts` - Added hint persistence utilities
- `src/tutorial/sections/training.ts` - Animations, contextual math, interaction hints
- `src/tutorial/sections/tour.ts` - Cleaned UI, signal pulse animation
- `src/tutorial/sections/inference.ts` - Prominent prediction display
- `src/controls/playback.ts` - Horizontal Play/Reset layout
- `src/controls/reset.ts` - Simplified to use existing button
- `src/visualisation/renderer.ts` - Prediction overlay methods
- `src/styles.css` - All new CSS classes

### Next Steps

1. Open http://localhost:5173/neural-network-visualiser/
2. Run quickstart.md validation checklist for all 7 user stories
3. Test responsive behavior on mobile viewport
4. Verify hint dismissal persists across page refresh
