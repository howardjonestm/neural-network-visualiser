# Tasks: Training Insights

**Input**: Design documents from `/specs/004-training-insights/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, quickstart.md

**Tests**: Unit tests included per plan.md specification (tests/unit/weight-delta.test.ts, activation-tooltip.test.ts)

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Single project**: `src/`, `tests/` at repository root (per plan.md)

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Create new files and CSS classes needed for all user stories

- [x] T001 Add weight highlight CSS classes (.weight-increase, .weight-decrease) in src/styles.css
- [x] T002 [P] Create WeightDelta types (DeltaMagnitude, WeightDelta interface) in src/visualisation/weight-delta.ts
- [x] T003 [P] Create ActivationTooltipData interface in src/education/activation-tooltip.ts

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core WeightDeltaTracker service that ALL user stories depend on

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T004 Implement WeightDeltaTracker class with captureSnapshot() and computeDeltas() methods in src/visualisation/weight-delta.ts
- [x] T005 Implement getDeltaMagnitude() helper function with thresholds (none/small/medium/large) in src/visualisation/weight-delta.ts
- [x] T006 Add unit tests for WeightDeltaTracker.computeDeltas() in tests/unit/weight-delta.test.ts
- [x] T007 Add unit tests for magnitude classification thresholds in tests/unit/weight-delta.test.ts
- [x] T008 Initialize WeightDeltaTracker instance in src/main.ts
- [x] T009 Wire captureSnapshot() call before trainStep() in src/main.ts training handler
- [x] T010 Wire computeDeltas() call after trainStep() in src/main.ts training handler

**Checkpoint**: Foundation ready - WeightDeltaTracker operational, user story implementation can now begin

---

## Phase 3: User Story 1 - Visualize Weight Changes During Training (Priority: P1) 🎯 MVP

**Goal**: Users see green/red flashes on weight lines when training, making the learning process visible

**Independent Test**: Click "Train Step" and observe weight connections flashing green (increased) or red (decreased) with 500ms fade

### Implementation for User Story 1

- [x] T011 [US1] Add highlightWeightChanges(deltas: Map<string, WeightDelta>) method to NetworkRenderer in src/visualisation/renderer.ts
- [x] T012 [US1] Implement D3 transition for weight highlight with 500ms fade in src/visualisation/renderer.ts
- [x] T013 [US1] Add magnitude-based intensity (brighter for larger changes) to highlight animation in src/visualisation/renderer.ts
- [x] T014 [US1] Call highlightWeightChanges() from main.ts after computing deltas in src/main.ts
- [x] T015 [US1] Add debounce logic (100ms minimum interval) for rapid training mode in src/main.ts
- [x] T016 [US1] Extend showWeight() method in Tooltip class to display delta value in src/visualisation/tooltip.ts
- [x] T017 [US1] Format delta display with +/- prefix and color coding in src/visualisation/tooltip.ts

**Checkpoint**: User Story 1 complete - weight changes visible during training, tooltips show delta values

---

## Phase 4: User Story 2 - Understand Activation Function Mathematics (Priority: P2)

**Goal**: Users can hover over neurons to see sigmoid formula, pre/post-activation values, and mini curve visualization

**Independent Test**: Hover over any hidden/output neuron and verify tooltip shows formula, values, and curve position marker

### Implementation for User Story 2

- [x] T018 [P] [US2] Implement createActivationTooltipData() function in src/education/activation-tooltip.ts
- [x] T019 [P] [US2] Implement mapToRange() helper for curve position calculation in src/education/activation-tooltip.ts
- [x] T020 [P] [US2] Add unit tests for createActivationTooltipData() in tests/unit/activation-tooltip.test.ts
- [x] T021 [P] [US2] Add unit tests for curve position mapping in tests/unit/activation-tooltip.test.ts
- [x] T022 [US2] Create renderActivationTooltip() function with HTML template in src/education/activation-tooltip.ts
- [x] T023 [US2] Add inline SVG mini sigmoid curve with position marker to tooltip template in src/education/activation-tooltip.ts
- [x] T024 [US2] Add CSS styles for activation tooltip (.activation-tooltip, .sigmoid-curve) in src/styles.css
- [x] T025 [US2] Update neuron hover handler in main.ts to use activation tooltip for hidden/output neurons in src/main.ts
- [x] T026 [US2] Handle input neuron tooltip to show "Pass-through (no activation)" message in src/education/activation-tooltip.ts
- [x] T027 [US2] Format pre-activation values with scientific notation for extreme values in src/education/activation-tooltip.ts

**Checkpoint**: User Story 2 complete - activation function tooltips work independently of weight visualization

---

## Phase 5: User Story 3 - Track Weight Delta History (Priority: P3)

**Goal**: Users can click on weights to see last 10 training step values and identify learning patterns

**Independent Test**: Train 15+ steps, click any weight connection, verify panel shows 10 entries with color-coded deltas

### Implementation for User Story 3

- [x] T028 [US3] Add history ring buffer (Map<string, number[]>) to WeightDeltaTracker in src/visualisation/weight-delta.ts
- [x] T029 [US3] Implement getHistory(weightId: string): number[] method in src/visualisation/weight-delta.ts
- [x] T030 [US3] Update captureSnapshot() to push values to history buffer in src/visualisation/weight-delta.ts
- [x] T031 [US3] Add clear() method to reset history on network reset in src/visualisation/weight-delta.ts
- [x] T032 [US3] Add unit tests for history ring buffer (max 10 entries) in tests/unit/weight-delta.test.ts
- [x] T033 [US3] Create WeightHistoryPanel class in src/visualisation/weight-history-panel.ts
- [x] T034 [US3] Implement renderHistory() method with color-coded delta display in src/visualisation/weight-history-panel.ts
- [x] T035 [US3] Add CSS styles for history panel (.weight-history-panel, .history-entry) in src/styles.css
- [x] T036 [US3] Add click handler for weight lines in renderer in src/visualisation/renderer.ts
- [x] T037 [US3] Wire click handler to show/hide history panel in src/main.ts
- [x] T038 [US3] Call tracker.clear() when network is reset in src/main.ts

**Checkpoint**: All user stories complete - full feature set available

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [x] T039 [P] Verify all tests pass (npm run test)
- [x] T040 [P] Verify build succeeds (npm run build)
- [ ] T041 Run manual testing checklist from quickstart.md (requires manual testing)
- [x] T042 [P] Add keyboard accessibility for weight click (Enter key triggers history panel) in src/visualisation/renderer.ts
- [ ] T043 Verify 30fps performance during rapid training (requires manual testing)
- [x] T044 [P] Add ARIA labels for weight change states in src/visualisation/renderer.ts

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-5)**: All depend on Foundational phase completion
  - User stories can proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2 → P3)
- **Polish (Phase 6)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - Completely independent of US1
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) - Extends WeightDeltaTracker but independently testable

### Within Each User Story

- Tests (if included) written first, verify they fail
- Core logic before UI integration
- Main.ts wiring as final step
- Story complete before moving to next priority

### Parallel Opportunities

**Phase 1 (Setup):**
```
T002 (WeightDelta types) || T003 (ActivationTooltip types)
```

**Phase 2 (Foundational):**
```
T006 (unit tests) || T007 (unit tests) - after T004, T005
```

**Phase 4 (US2):**
```
T018 (createActivationTooltipData) || T019 (mapToRange) || T020 (tests) || T021 (tests)
```

**Phase 6 (Polish):**
```
T039 (tests) || T040 (build) || T042 (a11y) || T044 (ARIA)
```

---

## Parallel Example: User Story 2

```bash
# Launch all parallelizable US2 tasks together:
Task: "T018 [P] [US2] Implement createActivationTooltipData() in src/education/activation-tooltip.ts"
Task: "T019 [P] [US2] Implement mapToRange() helper in src/education/activation-tooltip.ts"
Task: "T020 [P] [US2] Add unit tests for createActivationTooltipData() in tests/unit/activation-tooltip.test.ts"
Task: "T021 [P] [US2] Add unit tests for curve position mapping in tests/unit/activation-tooltip.test.ts"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (T001-T003)
2. Complete Phase 2: Foundational (T004-T010)
3. Complete Phase 3: User Story 1 (T011-T017)
4. **STOP and VALIDATE**: Test weight change visualization independently
5. Deploy/demo if ready - users can see training working!

### Incremental Delivery

1. Setup + Foundational → Foundation ready (T001-T010)
2. Add User Story 1 → Test → Deploy (MVP: visible training feedback)
3. Add User Story 2 → Test → Deploy (activation function education)
4. Add User Story 3 → Test → Deploy (advanced pattern analysis)
5. Polish → Final release

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1 (weight visualization)
   - Developer B: User Story 2 (activation tooltips)
   - Developer C: User Story 3 (weight history)
3. Stories complete and integrate independently

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story is independently completable and testable
- Weight change visualization (US1) is MVP - delivers core educational value
- Activation tooltips (US2) and history (US3) can be skipped for faster initial release
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
