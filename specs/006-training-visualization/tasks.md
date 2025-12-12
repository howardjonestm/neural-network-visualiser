# Tasks: Training Visualization

**Input**: Design documents from `/specs/006-training-visualization/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, quickstart.md

**Tests**: No automated tests explicitly requested. Manual testing per quickstart.md.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Single project**: `src/`, `tests/` at repository root (per plan.md)

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Add type definitions and CSS infrastructure needed by all user stories

- [ ] T001 Add TrainingStepResult interface to src/network/types.ts
- [ ] T002 Add TrainingStepSummary interface to src/network/types.ts
- [ ] T003 [P] Add WeightDirection type ('increasing' | 'decreasing' | 'stable') to src/visualisation/weight-delta.ts
- [ ] T004 [P] Add CSS classes for error severity colors (.error-good, .error-moderate, .error-poor) in src/styles.css
- [ ] T005 [P] Add CSS for training info display section in src/styles.css

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that enables per-sample tracking for all visualization features

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T006 Extend trainStep() in src/network/training.ts to return per-sample results array
- [ ] T007 Add onSampleProcessed callback to PlaybackCallbacks interface in src/controls/playback.ts
- [ ] T008 Call onSampleProcessed callback during training loop in src/controls/playback.ts
- [ ] T009 Add getDirection() helper function to src/visualisation/weight-delta.ts
- [ ] T010 Extend WeightDelta interface with direction field in src/visualisation/weight-delta.ts
- [ ] T011 Update computeDeltas() to include direction in src/visualisation/weight-delta.ts
- [ ] T012 Add training info container element to src/index.html (inside #training-panel)

**Checkpoint**: Foundation ready - per-sample tracking enabled, user stories can now be implemented

---

## Phase 3: User Story 1 - Training Progress Summary (Priority: P1) 🎯 MVP

**Goal**: Display real-time summary of training progress showing step count, loss, and current sample

**Independent Test**: Click "Play" to train and verify the summary panel displays current step count, loss value, and which training sample is being used.

### Implementation for User Story 1

- [ ] T013 [US1] Create TrainingPanel class skeleton in src/visualisation/training-panel.ts with constructor and state
- [ ] T014 [US1] Implement createUI() method in TrainingPanel to render step/loss/sample display elements in src/visualisation/training-panel.ts
- [ ] T015 [US1] Implement updateSummary() method to update step count and loss display in src/visualisation/training-panel.ts
- [ ] T016 [US1] Implement reset() method to clear/reset display state in src/visualisation/training-panel.ts
- [ ] T017 [US1] Import and instantiate TrainingPanel in src/main.ts
- [ ] T018 [US1] Wire onAfterTrainStep callback to update TrainingPanel summary in src/main.ts
- [ ] T019 [US1] Wire handleReset to call trainingPanel.reset() in src/main.ts

**Checkpoint**: User Story 1 complete - training progress summary visible during training

---

## Phase 4: User Story 2 - Current Training Sample Display (Priority: P1)

**Goal**: Show which input/output pair the network is currently learning from

**Independent Test**: During training, verify the display shows "Training on: [0,1] → expects 1" format for each sample.

### Implementation for User Story 2

- [ ] T020 [US2] Add current sample display element to TrainingPanel UI in src/visualisation/training-panel.ts
- [ ] T021 [US2] Implement updateSample() method to show current sample in "[inputs] → expects [output]" format in src/visualisation/training-panel.ts
- [ ] T022 [US2] Implement formatSample() helper for display formatting in src/visualisation/training-panel.ts
- [ ] T023 [US2] Wire onSampleProcessed callback to update TrainingPanel.updateSample() in src/main.ts
- [ ] T024 [US2] Update reset() to clear sample display with "Ready to train" message in src/visualisation/training-panel.ts

**Checkpoint**: User Story 2 complete - current training sample visible during training

---

## Phase 5: User Story 3 - Per-Sample Error Display (Priority: P1)

**Goal**: Show network output vs expected output with color-coded error

**Independent Test**: During training, verify display shows "Output: 0.73, Expected: 1, Error: -0.27" with appropriate coloring.

### Implementation for User Story 3

- [ ] T025 [US3] Add error display element to TrainingPanel UI in src/visualisation/training-panel.ts
- [ ] T026 [US3] Implement getErrorSeverity() function returning 'good' | 'moderate' | 'poor' in src/visualisation/training-panel.ts
- [ ] T027 [US3] Implement updateError() method showing output, expected, error with color class in src/visualisation/training-panel.ts
- [ ] T028 [US3] Call updateError() from within updateSample() using TrainingStepResult data in src/visualisation/training-panel.ts
- [ ] T029 [US3] Add CSS transitions for smooth color changes on error severity classes in src/styles.css

**Checkpoint**: User Story 3 complete - error display with color coding visible during training

---

## Phase 6: User Story 4 - Weight Change Highlighting (Priority: P2)

**Goal**: Highlight weights based on magnitude of change during training

**Independent Test**: During training, observe that weights changing significantly are visually distinct from those changing minimally.

### Implementation for User Story 4

- [ ] T030 [US4] Verify existing highlightWeightChanges() in src/visualisation/renderer.ts applies magnitude classes
- [ ] T031 [US4] Add CSS for magnitude-based glow intensity (.magnitude-small, .magnitude-medium, .magnitude-large) in src/styles.css
- [ ] T032 [US4] Update tooltip to show delta magnitude when hovering weights in src/visualisation/tooltip.ts
- [ ] T033 [US4] Ensure tooltip showWeight() displays magnitude classification text in src/visualisation/tooltip.ts
- [ ] T034 [US4] Adjust highlight fade duration from 500ms to 800ms for better visibility in src/visualisation/renderer.ts

**Checkpoint**: User Story 4 complete - weight change highlighting visible during training

---

## Phase 7: User Story 5 - Gradient Direction Indicators (Priority: P2)

**Goal**: Show visual indicators for whether weights are increasing or decreasing

**Independent Test**: During training, verify weights show visual indicators (arrows or colors) for direction.

### Implementation for User Story 5

- [ ] T035 [US5] Add SVG defs for arrow markers (#arrow-up, #arrow-down) in src/visualisation/renderer.ts
- [ ] T036 [US5] Extend highlightWeightChanges() to apply direction class (weight-arrow-up, weight-arrow-down) in src/visualisation/renderer.ts
- [ ] T037 [US5] Add CSS for arrow marker positioning and styling in src/styles.css
- [ ] T038 [US5] Update ARIA labels to include direction ("increasing by X" or "decreasing by X") in src/visualisation/renderer.ts
- [ ] T039 [US5] Add threshold check - only show arrows when magnitude is not 'none' in src/visualisation/renderer.ts

**Checkpoint**: User Story 5 complete - gradient direction indicators visible during training

---

## Phase 8: User Story 6 - Training Forward Pass Animation (Priority: P3)

**Goal**: Animate data flow through network during training (optional mode)

**Independent Test**: Enable animated training mode and verify pulses flow from input through hidden layers to output.

### Implementation for User Story 6

- [ ] T040 [US6] Add isAnimated state and toggle button to TrainingPanel UI in src/visualisation/training-panel.ts
- [ ] T041 [US6] Implement setAnimated() method and getAnimated() getter in src/visualisation/training-panel.ts
- [ ] T042 [US6] Create animateTrainingSample() wrapper function in src/demo/animation.ts that reuses existing pulse animation
- [ ] T043 [US6] Modify PlaybackControls.step() to await animation when animated mode enabled in src/controls/playback.ts
- [ ] T044 [US6] Add CSS for animation toggle button styling in src/styles.css
- [ ] T045 [US6] Wire animation toggle state to main.ts training loop in src/main.ts
- [ ] T046 [US6] Auto-disable animation when training speed exceeds threshold (>10 steps/sec) in src/main.ts

**Checkpoint**: User Story 6 complete - animated training mode available as optional feature

---

## Phase 9: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] T047 [P] Verify all existing tests pass (npm run test)
- [ ] T048 [P] Verify build succeeds (npm run build)
- [ ] T049 Run manual testing checklist from quickstart.md
- [ ] T050 [P] Add convergence detection - display "Converged!" when loss < 0.01 in src/visualisation/training-panel.ts
- [ ] T051 [P] Verify throttling prevents UI flicker at rapid training speeds in src/main.ts
- [ ] T052 [P] Verify WCAG AA color contrast for error severity colors in src/styles.css

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-8)**: All depend on Foundational phase completion
  - US1, US2, US3 (all P1) share TrainingPanel - implement sequentially
  - US4, US5 (both P2) can proceed in parallel after US1-3
  - US6 (P3) can proceed independently after Foundational
- **Polish (Phase 9)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - Creates TrainingPanel foundation
- **User Story 2 (P1)**: Depends on US1 (uses TrainingPanel) - Adds sample display
- **User Story 3 (P1)**: Depends on US2 (extends sample display with error) - Adds error coloring
- **User Story 4 (P2)**: Can start after Foundational - Extends existing renderer
- **User Story 5 (P2)**: Can start after Foundational - Extends existing renderer, can parallel with US4
- **User Story 6 (P3)**: Can start after Foundational - Uses existing animation, needs US1 for toggle

### Within Each User Story

- CSS changes can run in parallel with TS changes (different files)
- UI creation before method implementation
- Method implementation before wiring in main.ts

### Parallel Opportunities

**Phase 1 (Setup):**
```
T003 (weight direction type) || T004 (error CSS) || T005 (training info CSS)
```

**Phase 2 (Foundational):**
```
T009 (getDirection) || T010 (WeightDelta extend) can follow T003
T006 (trainStep) || T012 (HTML container) - different files
```

**Phase 6+7 (US4 + US5 - both P2):**
```
US4 tasks (T030-T034) || US5 tasks (T035-T039) - different code paths in renderer
```

**Phase 9 (Polish):**
```
T047 (tests) || T048 (build) || T050 (convergence) || T051 (throttle) || T052 (contrast)
```

---

## Implementation Strategy

### MVP First (User Stories 1 + 2 + 3)

1. Complete Phase 1: Setup (T001-T005)
2. Complete Phase 2: Foundational (T006-T012)
3. Complete Phase 3: User Story 1 (T013-T019) - Progress summary
4. Complete Phase 4: User Story 2 (T020-T024) - Sample display
5. Complete Phase 5: User Story 3 (T025-T029) - Error display
6. **STOP and VALIDATE**: Test training panel shows step, loss, sample, and colored error
7. Deploy/demo if ready - core training visibility delivered!

### Incremental Delivery

1. Setup + Foundational → Foundation ready (T001-T012)
2. Add User Story 1 → Test → Deploy (step/loss summary)
3. Add User Story 2 → Test → Deploy (sample display)
4. Add User Story 3 → Test → Deploy (error with colors)
5. Add User Story 4 → Test → Deploy (weight highlighting)
6. Add User Story 5 → Test → Deploy (gradient direction)
7. Add User Story 6 → Test → Deploy (animated training)
8. Polish → Final release

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Stories 1-3 (TrainingPanel focused)
   - Developer B: User Stories 4-5 (Renderer focused)
3. User Story 6 can be done by either after their stories complete
4. Stories integrate via shared callbacks and state

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- US1-3 build on each other within TrainingPanel (sequential)
- US4-5 extend renderer independently (parallel opportunity)
- US6 is optional enhancement (P3)
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
