# Tasks: Training UI Polish & Visual Enhancements

**Input**: Design documents from `/specs/008-training-ui-polish/`
**Prerequisites**: plan.md (required), spec.md (required), research.md, data-model.md, quickstart.md

**Tests**: Not explicitly requested - omitting test tasks.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup

**Purpose**: Verify project structure and dependencies are in place

- [x] T001 Verify TypeScript and Vite configuration supports CSS keyframe animations
- [x] T002 [P] Verify D3.js is available for SVG animation sequences

---

## Phase 2: Foundational (Shared Types & State)

**Purpose**: Core state management changes that multiple user stories depend on

**⚠️ CRITICAL**: These changes enable proper training state detection across US2, US3, US4

- [x] T003 Add `trainingIterations: number` field to tutorial state in `src/tutorial/state.ts` - increment on each training step, reset on network reset
- [x] T004 Add `currentVisualization: VisualizationState` field to tutorial state in `src/tutorial/state.ts` with values: 'idle' | 'forward-pass-animating' | 'loss-highlighting' | 'backprop-animating'
- [x] T005 Add `lastPrediction: PredictionResult | null` field to tutorial state in `src/tutorial/state.ts` for prominent prediction display
- [x] T006 Add CSS keyframe animation for pulsating weights in `src/styles.css`:
  ```css
  @keyframes weight-pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.7; }
  }
  .weights-pulsating .weight-line {
    animation: weight-pulse 2s ease-in-out infinite;
  }
  ```
- [x] T007 [P] Add CSS classes for neuron firing animation in `src/styles.css`: `.neuron-firing { transform: scale(1.15); filter: brightness(1.3); transition: all 0.3s; }`
- [x] T008 [P] Add CSS classes for backpropagation weight animation in `src/styles.css`: `.weight-backprop { stroke-width: 3; filter: brightness(1.2); transition: all 0.3s; }`

**Checkpoint**: Foundation ready - user story implementation can now begin

---

## Phase 3: User Story 1 - Improved Layout with Larger Visualization (Priority: P1) 🎯 MVP

**Goal**: Neural network occupies ~60% of right side with floating card effect; left panel is narrower with clean borders

**Independent Test**: Open tutorial on desktop, verify visualization takes ~60% width, has floating shadow effect, left panel is compact

### Implementation for User Story 1

- [x] T009 [US1] Modify CSS grid layout in `src/styles.css` - change `.scrollytelling-container` from `1fr 1fr` to `1fr 1.5fr` for 40/60 split (FR-001, FR-003)
- [x] T010 [US1] Enhance floating card effect on `.viz-container` in `src/styles.css` - add multi-layer box-shadow: `box-shadow: 0 4px 6px rgba(0,0,0,0.1), 0 10px 20px rgba(0,0,0,0.15); transform: translateY(-2px);` (FR-002)
- [x] T011 [US1] Add thicker visual border to left panel `.tutorial-content` in `src/styles.css` with `border-right: 2px solid #e0e0e0;` (FR-003)
- [x] T012 [US1] Remove any extraneous text labels from panel borders in `src/styles.css` - ensure no decorative text on container borders (FR-004)

**Checkpoint**: User Story 1 complete - layout proportions and floating card effect verified

---

## Phase 4: User Story 2 - Visual Training Explanations (Priority: P1) 🎯 MVP

**Goal**: Understanding Training steps show synchronized animations: forward pass (neurons fire sequentially), loss calculation (output highlighted), backpropagation (weights animate backward)

**Independent Test**: Navigate Understanding Training steps, observe corresponding animations on each step

### Implementation for User Story 2

- [x] T013 [US2] Create forward pass animation function in `src/visualisation/renderer.ts` - animate neurons layer-by-layer from input to output using D3 transitions with 500ms per layer delay, total 2-3 seconds (FR-005)
- [x] T014 [US2] Create loss calculation highlight function in `src/visualisation/renderer.ts` - highlight output layer neurons and loss display area with brightness filter (FR-006)
- [x] T015 [US2] Create backpropagation animation function in `src/visualisation/renderer.ts` - animate weight lines backward from output to input using D3 reverse transitions, 2-3 seconds total (FR-007)
- [x] T016 [US2] Wire Understanding Training steps to visualization state in `src/tutorial/sections/training.ts` - when step changes, trigger corresponding animation via `currentVisualization` state
- [x] T017 [US2] Remove "Key Terms" section from Understanding Training in `src/tutorial/sections/training.ts` - delete key terms rendering and `termsIntroduced` from step data (FR-009)
- [x] T018 [US2] Simplify Understanding Training navigation in `src/tutorial/sections/training.ts` - show only Next/Previous buttons, remove completion markers/checkboxes (FR-008, FR-010)
- [x] T019 [US2] Handle animation cancellation in `src/visualisation/renderer.ts` - cancel active animations when user navigates away from step

**Checkpoint**: User Story 2 complete - all three training steps have synchronized animations

---

## Phase 5: User Story 3 - Trained Network State Recognition (Priority: P2)

**Goal**: System correctly detects trained state and shows pulsating weight animation; no false "Not Trained" messages

**Independent Test**: Train network, navigate to Trained Network section, verify trained state recognized with pulsating weights

### Implementation for User Story 3

- [x] T020 [US3] Fix training detection logic in `src/tutorial/sections/tour.ts` - check `trainingIterations > 0` instead of only checking `trainingCompleted` flag (FR-011)
- [x] T021 [US3] Apply pulsating CSS class to trained network in `src/tutorial/sections/tour.ts` - add `.weights-pulsating` class to SVG container when `trainingIterations > 0` (FR-012)
- [x] T022 [US3] Remove "Network Not Yet Trained" message from inference section in `src/tutorial/sections/inference.ts` - delete conditional warning message, allow users to experiment regardless (FR-013)

**Checkpoint**: User Story 3 complete - trained state correctly detected, pulsating animation visible

---

## Phase 6: User Story 4 - Enhanced Inference Display (Priority: P2)

**Goal**: Input values visible on neurons during inference; predicted output prominently displayed with expected comparison

**Independent Test**: Run inference, verify input values appear on neurons, prediction is prominently visible outside calculations panel

### Implementation for User Story 4

- [x] T023 [US4] Verify input value overlay function in `src/demo/animation.ts` - ensure `showInputValues()` displays values (0, 1) on input neurons with proper SVG text positioning (FR-014)
- [x] T024 [US4] Create prominent prediction display component in `src/demo/controls.ts` - add dedicated `.prediction-result-card` with large font (2rem, bold), showing Expected vs Predicted side-by-side with color coding (green=correct, red=incorrect) (FR-015, FR-016)
- [x] T025 [US4] Wire prediction result to state in `src/demo/controls.ts` - update `lastPrediction` state after inference completes, render prominent display
- [x] T026 [US4] Add CSS for prediction result card in `src/styles.css`:
  ```css
  .prediction-result-card { display: flex; justify-content: center; gap: 2rem; padding: 1rem; }
  .prediction-result-card .value { font-size: 2rem; font-weight: bold; }
  .prediction-result-card .correct { color: #22c55e; }
  .prediction-result-card .incorrect { color: #ef4444; }
  ```

**Checkpoint**: User Story 4 complete - inputs visible on neurons, prediction prominently displayed

---

## Phase 7: User Story 5 - Expanded Math Explanations (Priority: P3)

**Goal**: Show Math section displays sigmoid and backpropagation formulas in proper mathematical notation with learning rate explanation

**Independent Test**: Expand Show Math section, verify formulas use proper notation (fractions, Greek letters), learning rate trade-offs explained

### Implementation for User Story 5

- [x] T027 [US5] Add sigmoid formula with proper notation in `src/education/content.ts` - use HTML/CSS fraction layout with Unicode σ symbol: `σ(z) = 1 / (1 + e^−z)` rendered as stacked fraction (FR-017)
- [x] T028 [US5] Add backpropagation weight update formula in `src/education/content.ts` - display `w_new = w_old - η × ∂L/∂w` with proper subscripts and Greek eta (FR-018)
- [x] T029 [US5] Add learning rate trade-offs explanation in `src/education/content.ts` - explain high η (>0.5): fast but may overshoot; low η (<0.1): stable but slow; recommended 0.1-0.5 (FR-019)
- [x] T030 [US5] Add CSS for math formula rendering in `src/styles.css`:
  ```css
  .formula { font-family: 'Times New Roman', serif; font-style: italic; }
  .fraction { display: inline-flex; flex-direction: column; text-align: center; }
  .fraction .numerator { border-bottom: 1px solid currentColor; }
  ```

**Checkpoint**: User Story 5 complete - math formulas properly formatted

---

## Phase 8: User Story 6 - Simplified Training Controls (Priority: P3)

**Goal**: Training controls simplified - no Step button, hidden learning rate slider, no keyboard shortcut notice

**Independent Test**: View training controls, verify Step button gone, learning rate hidden, only Reset button shown

### Implementation for User Story 6

- [x] T031 [US6] Remove Step button from training controls in `src/controls/playback.ts` - delete step button element and click handler (FR-020)
- [x] T032 [US6] Hide learning rate slider in `src/controls/parameters.ts` - move to expandable/hidden section or remove from immediate view (FR-021)
- [x] T033 [US6] Remove keyboard shortcut notice from reset button in `src/controls/reset.ts` - change "R: Reset" to just "Reset" (FR-022)

**Checkpoint**: User Story 6 complete - controls simplified with 50% fewer visible elements

---

## Phase 9: Polish & Cross-Cutting Concerns

**Purpose**: Final validation and cleanup

- [x] T034 Verify all animations complete within timing requirements (2-3s for educational, <1.5s for UI) per SC-007
- [x] T035 Run quickstart.md validation checklist - test all 6 user stories' acceptance scenarios
- [x] T036 Test responsive behavior - verify layout adapts gracefully on window resize during animations
- [x] T037 Verify CSS animations are GPU-accelerated and maintain 30fps per constitution performance goals
- [x] T038 Remove any unused code from simplified controls (dead code cleanup)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS user stories 2, 3, 4
- **User Story 1 (Phase 3)**: Can start after Setup (CSS-only changes)
- **User Story 2 (Phase 4)**: Depends on Foundational (needs visualization state types)
- **User Story 3 (Phase 5)**: Depends on Foundational (needs trainingIterations field)
- **User Story 4 (Phase 6)**: Depends on Foundational (needs lastPrediction state)
- **User Story 5 (Phase 7)**: Can start after Setup (content-only changes)
- **User Story 6 (Phase 8)**: Can start after Setup (control simplification)
- **Polish (Phase 9)**: Depends on all user stories being complete

### Parallel Opportunities

- US1 (Phase 3) and US5 (Phase 7) and US6 (Phase 8) can run in parallel after Setup
- Once Foundational (Phase 2) completes: US2, US3, US4 can proceed
- Within phases: Tasks marked [P] can run in parallel

### Recommended Execution Order (Single Developer)

1. Phase 1: Setup (T001-T002)
2. Phase 2: Foundational (T003-T008) - Critical path
3. Phase 3: US1 Layout (T009-T012) - P1 MVP
4. Phase 4: US2 Visualizations (T013-T019) - P1 MVP
5. Phase 5: US3 Trained State (T020-T022) - P2
6. Phase 6: US4 Inference Display (T023-T026) - P2
7. Phase 7: US5 Math Explanations (T027-T030) - P3
8. Phase 8: US6 Simplified Controls (T031-T033) - P3
9. Phase 9: Polish (T034-T038)

---

## Notes

- All changes are CSS and TypeScript modifications to existing files - no new dependencies
- Animation timing: 2-3 seconds for educational visualizations (per clarification), <1.5s for UI animations
- CSS keyframe animations preferred for performance (GPU-accelerated)
- Commit after each phase or logical group of tasks
- Stop at any checkpoint to validate story independently
