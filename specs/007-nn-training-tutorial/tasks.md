# Tasks: Interactive Neural Network Training Tutorial

**Input**: Design documents from `/specs/007-nn-training-tutorial/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md

**Tests**: Not explicitly requested in the feature specification. Test tasks are omitted.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Create the tutorial module structure and core utilities

- [x] T001 Create tutorial directory structure: `src/tutorial/`, `src/tutorial/sections/`
- [x] T002 [P] Create TutorialSection type definitions in `src/tutorial/types.ts`
- [x] T003 [P] Create TutorialState interface and factory in `src/tutorial/state.ts`
- [x] T004 [P] Create ScrollManager class with IntersectionObserver in `src/tutorial/scroll-manager.ts`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**CRITICAL**: No user story work can begin until this phase is complete

- [x] T005 Restructure `src/index.html` into 4 scroll sections with ARIA landmarks
- [x] T006 Add sticky graphic layout CSS to `src/styles.css` for sections 2-4
- [x] T007 Add section transition CSS (smooth scroll, fade transitions) to `src/styles.css`
- [x] T008 Remove "animate training" button from `src/visualisation/training-panel.ts` (FR-004)
- [x] T009 Modify `src/main.ts` to initialize TutorialState and ScrollManager
- [x] T010 Wire ScrollManager section callbacks to TutorialState updates in `src/main.ts`
- [x] T011 Implement section activation/deactivation handlers that pause active processes in `src/main.ts` (FR-017)

**Checkpoint**: Foundation ready - tutorial sections visible, scroll detection working, processes pause when scrolling away

---

## Phase 3: User Story 1 - Complete Tutorial Journey (Priority: P1)

**Goal**: Users can scroll through all 4 tutorial sections in sequence

**Independent Test**: Open the tutorial, scroll from top to bottom, verify all 4 sections appear in order with appropriate content

### Implementation for User Story 1

- [x] T012 [US1] Create Section 1 (Objectives) content and initialization in `src/tutorial/sections/objectives.ts`
- [x] T013 [US1] Add XOR problem explanation content to Section 1 HTML in `src/index.html`
- [x] T014 [US1] Create Section 2 (Training) shell with placeholder in `src/tutorial/sections/training.ts`
- [x] T015 [US1] Create Section 3 (Tour) shell with placeholder in `src/tutorial/sections/tour.ts`
- [x] T016 [US1] Create Section 4 (Inference) shell with placeholder in `src/tutorial/sections/inference.ts`
- [x] T017 [US1] Wire section modules to ScrollManager callbacks in `src/main.ts`
- [x] T018 [US1] Add section heading styles and typography to `src/styles.css`

**Checkpoint**: User Story 1 complete - scrolling through all 4 sections works, content shells visible

---

## Phase 4: User Story 2 - Guided Training Experience (Priority: P1)

**Goal**: Section 2 provides guided step-through training with animations and key term explanations

**Independent Test**: Scroll to Section 2, trigger guided training steps, observe animations and explanations, run full training

### Implementation for User Story 2

- [x] T019 [US2] Create KeyTerm type and definitions (8 terms from FR-006) in `src/tutorial/key-terms.ts`
- [x] T020 [US2] Implement key term popup component with show/hide logic in `src/tutorial/key-terms.ts`
- [x] T021 [US2] Add key term popup CSS (positioning, animation) to `src/styles.css`
- [x] T022 [US2] Create TrainingGuidedStep definitions (3+ steps for SC-003) in `src/tutorial/sections/training.ts`
- [x] T023 [US2] Implement guided step controller (next step, track completion) in `src/tutorial/sections/training.ts`
- [x] T024 [US2] Add untrained state explanation display when Section 2 activates in `src/tutorial/sections/training.ts` (FR-007)
- [x] T025 [US2] Integrate existing animation from `src/demo/animation.ts` with guided steps in `src/tutorial/sections/training.ts`
- [x] T026 [US2] Create "Run Full Training" button that appears after guided steps in `src/tutorial/sections/training.ts` (FR-009)
- [x] T027 [US2] Add loss display with significance explanation during training in `src/tutorial/sections/training.ts` (FR-010)
- [x] T028 [US2] Create expandable math panel for weight calculations in `src/tutorial/sections/training.ts` (FR-008)
- [x] T029 [US2] Update TutorialState with guidedStepsCompleted and trainingCompleted tracking in `src/tutorial/state.ts`
- [x] T030 [US2] Add training section styles (buttons, math panel, step indicators) to `src/styles.css`

**Checkpoint**: User Story 2 complete - guided training fully functional, key terms explained, math viewable

---

## Phase 5: User Story 3 - Trained Network Tour (Priority: P2)

**Goal**: Section 3 highlights the trained network state and allows exploration

**Independent Test**: Complete training in Section 2, scroll to Section 3, verify trained weights are highlighted with explanatory text

### Implementation for User Story 3

- [x] T031 [US3] Implement tour activation logic checking TutorialState.trainingCompleted in `src/tutorial/sections/tour.ts`
- [x] T032 [US3] Add trained network explanation content to Section 3 HTML in `src/index.html`
- [x] T033 [US3] Create weight highlighting effect for trained state in `src/tutorial/sections/tour.ts` (FR-011)
- [x] T034 [US3] Add "training complete" confirmation text display in `src/tutorial/sections/tour.ts`
- [x] T035 [US3] Integrate existing tooltip behavior for weight value display in `src/tutorial/sections/tour.ts`
- [x] T036 [US3] Handle untrained state display with explanatory note when training not completed in `src/tutorial/sections/tour.ts`
- [x] T037 [US3] Add tour section styles (highlighting, confirmation badges) to `src/styles.css`

**Checkpoint**: User Story 3 complete - trained network tour shows optimized weights with clear explanations

---

## Phase 6: User Story 4 - Inference Demonstration (Priority: P2)

**Goal**: Section 4 demonstrates inference with expected vs actual output comparison

**Independent Test**: Scroll to Section 4, select XOR input, trigger inference, see expected vs predicted values with explanation

### Implementation for User Story 4

- [x] T038 [US4] Create inference section UI with XOR input selector in `src/tutorial/sections/inference.ts`
- [x] T039 [US4] Integrate existing demo module functionality into Section 4 in `src/tutorial/sections/inference.ts`
- [x] T040 [US4] Add expected output display (XOR truth table reference) to Section 4 in `src/tutorial/sections/inference.ts` (FR-012)
- [x] T041 [US4] Add predicted output display alongside expected in `src/tutorial/sections/inference.ts`
- [x] T042 [US4] Create comparison visualization (expected vs actual) in `src/tutorial/sections/inference.ts` (SC-005)
- [x] T043 [US4] Add explanatory text about loss reduction and prediction accuracy in `src/tutorial/sections/inference.ts` (FR-013)
- [x] T044 [US4] Handle untrained network case with explanatory note in `src/tutorial/sections/inference.ts`
- [x] T045 [US4] Add inference section styles (comparison layout, result display) to `src/styles.css`

**Checkpoint**: User Story 4 complete - inference demo shows clear expected vs actual comparison with educational context

---

## Phase 7: User Story 5 - Scroll Navigation and Progress (Priority: P3)

**Goal**: Progress indicator shows current section, keyboard navigation alternative available

**Independent Test**: Scroll through tutorial observing progress indicator updates, use keyboard buttons to jump between sections

### Implementation for User Story 5

- [x] T046 [US5] Create ProgressIndicator component with section buttons in `src/tutorial/progress-indicator.ts`
- [x] T047 [US5] Implement keyboard navigation (Tab, Enter) for progress buttons in `src/tutorial/progress-indicator.ts`
- [x] T048 [US5] Wire progress indicator to TutorialState.currentSection updates in `src/tutorial/progress-indicator.ts`
- [x] T049 [US5] Add aria-current="step" attribute management for accessibility in `src/tutorial/progress-indicator.ts`
- [x] T050 [US5] Implement smooth scroll-to-section on button click in `src/tutorial/progress-indicator.ts`
- [x] T051 [US5] Add focus management when jumping to section (focus heading) in `src/tutorial/progress-indicator.ts`
- [x] T052 [US5] Add progress indicator HTML to `src/index.html`
- [x] T053 [US5] Add progress indicator styles (fixed position, button states) to `src/styles.css`
- [x] T054 [US5] Add prefers-reduced-motion support for all transitions in `src/styles.css`

**Checkpoint**: User Story 5 complete - progress indicator works with mouse and keyboard, respects accessibility preferences

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Final integration, edge cases, and quality improvements

- [x] T055 [P] Verify WCAG AA color contrast on all new content sections
- [x] T056 [P] Add tabindex management for proper focus order across sections
- [x] T057 Handle rapid scrolling edge case (debounce section activation) in `src/tutorial/scroll-manager.ts`
- [x] T058 Handle window resize during tutorial (recalculate layouts) in `src/main.ts`
- [x] T059 Add touch device support verification for scroll interactions
- [x] T060 Performance audit: verify 30fps during animations, <100ms interaction response
- [x] T061 Run quickstart.md validation - complete tutorial flow test

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-7)**: All depend on Foundational phase completion
  - US1 (P1) and US2 (P1) share priority - do US1 first as it creates section shells
  - US3 (P2) and US4 (P2) can proceed after US2 (training must work for tour/inference context)
  - US5 (P3) can proceed after US1 (only needs section structure)
- **Polish (Phase 8)**: Depends on all user stories being complete

### User Story Dependencies

| Story | Depends On | Can Start After |
|-------|------------|-----------------|
| US1 - Complete Tutorial Journey | Foundational | Phase 2 complete |
| US2 - Guided Training Experience | US1 (section shells) | T017 complete |
| US3 - Trained Network Tour | US2 (training state) | T029 complete |
| US4 - Inference Demonstration | US2 (training state) | T029 complete |
| US5 - Scroll Navigation | US1 (section structure) | T017 complete |

### Within Each User Story

- Content/HTML before logic
- Types before implementation
- State updates before UI that displays state
- Core implementation before styling

### Parallel Opportunities

**Phase 1 (all parallel):**
```
T002, T003, T004 can run simultaneously
```

**Phase 4 (US2 - within story):**
```
T019, T020, T021 (key terms) can run parallel to T022, T023 (guided steps)
```

**Phase 5-6 (US3 and US4 can run in parallel after US2):**
```
Developer A: T031-T037 (Tour)
Developer B: T038-T045 (Inference)
```

**Phase 8 (several parallel):**
```
T055, T056 can run simultaneously
```

---

## Parallel Example: After Foundational Phase

```bash
# Developer A: User Story 1 (section shells)
Task: T012 "Create Section 1 (Objectives) content in src/tutorial/sections/objectives.ts"
Task: T013 "Add XOR problem explanation to Section 1 HTML"
...

# Developer B: User Story 5 (can start after US1 T017)
Task: T046 "Create ProgressIndicator component in src/tutorial/progress-indicator.ts"
Task: T047 "Implement keyboard navigation"
...
```

---

## Implementation Strategy

### MVP First (User Stories 1 + 2 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1 (section structure)
4. Complete Phase 4: User Story 2 (guided training - core educational value)
5. **STOP and VALIDATE**: Test scrolling + training independently
6. Deploy/demo if ready - users can learn about neural network training

### Full Feature Delivery

1. MVP above → Users can scroll and train
2. Add User Story 3 (Tour) → Test trained network exploration
3. Add User Story 4 (Inference) → Test prediction demonstration
4. Add User Story 5 (Progress) → Test navigation enhancement
5. Complete Phase 8: Polish → Production ready

### Recommended Order (Single Developer)

1. Phase 1 → Phase 2 → Phase 3 (US1) → Phase 4 (US2)
2. Validate MVP works end-to-end
3. Phase 5 (US3) → Phase 6 (US4) → Phase 7 (US5)
4. Phase 8 (Polish)

---

## Notes

- [P] tasks = different files, no dependencies within phase
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence
- The existing `src/demo/*` module is integrated into US4, not replaced
- The existing `src/network/*`, `src/visualisation/*` modules are preserved and reused
