# Tasks: Visual Forward Pass Demonstration

**Input**: Design documents from `/specs/003-forward-pass-demo/`
**Prerequisites**: plan.md (required), spec.md (required), research.md, data-model.md, quickstart.md

**Tests**: Tests NOT explicitly requested in spec. Unit tests included for core calculation accuracy (SC-006 requirement).

**Organization**: Tasks grouped by user story for independent implementation and testing.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story (US1-US5)
- File paths relative to repository root

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Create demo module directory structure and type definitions

- [x] T001 Create src/demo/ directory for forward pass demo module
- [x] T002 [P] Define DemoMode, DemoSpeed, DemoState types in src/demo/types.ts
- [x] T003 [P] Define DemoStep, NeuronCalculation interfaces in src/demo/types.ts
- [x] T004 [P] Define XORInput, XOR_INPUTS, XOR_EXPECTED constants in src/demo/types.ts
- [x] T005 [P] Define DemoSpeedConfig, SPEED_CONFIGS constants in src/demo/types.ts
- [x] T006 [P] Define SignalPosition, SignalAnimation interfaces in src/demo/types.ts

**Checkpoint**: Demo module types ready; all interfaces defined

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: State machine and calculation engine that ALL user stories depend on

**⚠️ CRITICAL**: No user story work can begin until state machine and calculator are functional

- [x] T007 Create DemoStateMachine class with state transitions in src/demo/state.ts
- [x] T008 Implement startDemo(), cancel(), getState() methods in src/demo/state.ts
- [x] T009 Implement subscribe()/notify() listener pattern in src/demo/state.ts
- [x] T010 Create generateDemoSteps() function in src/demo/calculator.ts
- [x] T011 Implement formatCalculation() for 3-decimal precision in src/demo/calculator.ts
- [x] T012 [P] Add unit tests for DemoStateMachine transitions in tests/unit/demo.test.ts
- [x] T013 [P] Add unit tests for generateDemoSteps() accuracy in tests/unit/demo.test.ts

**Checkpoint**: State machine handles all transitions; calculator generates accurate DemoStep arrays; `npm run test` passes

---

## Phase 3: User Story 1 - Watch Data Flow Through Network (Priority: P1) 🎯 MVP

**Goal**: Animate visual signal traveling through network layer by layer

**Independent Test**: Click "Demo" button, watch pulse travel from input to output through all layers with visible animations

### Implementation for User Story 1

- [x] T014 [US1] Create DemoButton component in src/demo/controls.ts
- [x] T015 [US1] Add demo button to controls panel in src/index.html
- [x] T016 [US1] Style demo button consistent with existing controls in src/styles.css
- [x] T017 [US1] Create pulse SVG element factory in src/demo/animation.ts
- [x] T018 [US1] Implement animatePulse() with D3 transition along weight path in src/demo/animation.ts
- [x] T019 [US1] Implement highlightNeuron() for activation glow effect in src/demo/animation.ts
- [x] T020 [US1] Implement dimInactiveElements() to fade non-current layer in src/demo/animation.ts
- [x] T021 [US1] Add pulse styling (.demo-pulse, colors for positive/negative) in src/styles.css
- [x] T022 [US1] Create animateLayer() to orchestrate pulse + highlight for one layer in src/demo/animation.ts
- [x] T023 [US1] Create runDemo() main loop calling animateLayer() per step in src/demo/animation.ts
- [x] T024 [US1] Wire DemoButton click to startDemo() in src/main.ts
- [x] T025 [US1] Wire DemoStateMachine to animation callbacks in src/main.ts

**Checkpoint**: Demo button starts animation; pulse travels through network; neurons highlight on activation

---

## Phase 4: User Story 2 - Select XOR Input to Demonstrate (Priority: P2)

**Goal**: Allow users to choose which XOR input pair to demonstrate

**Independent Test**: Select input [1,0], run demo, verify input neurons show 1 and 0, output prediction displayed

### Implementation for User Story 2

- [x] T026 [US2] Create InputSelector dropdown component in src/demo/controls.ts
- [x] T027 [US2] Add input selector to demo controls section in src/index.html
- [x] T028 [US2] Style input selector dropdown in src/styles.css
- [x] T029 [US2] Display expected output label next to selector in src/demo/controls.ts
- [x] T030 [US2] Update DemoStateMachine.setInput() method in src/demo/state.ts
- [x] T031 [US2] Show input values on input neurons during demo in src/demo/animation.ts
- [x] T032 [US2] Display prediction vs expected result at demo end in src/demo/controls.ts
- [x] T033 [US2] Wire InputSelector change to state machine in src/main.ts

**Checkpoint**: All four XOR inputs selectable; input values visible on neurons; correct/incorrect shown at end

---

## Phase 5: User Story 3 - Step Through Forward Pass (Priority: P3)

**Goal**: Enable manual step-by-step navigation through forward pass

**Independent Test**: Click "Next" repeatedly, observe each layer highlight in sequence with step indicator

### Implementation for User Story 3

- [x] T034 [US3] Add nextStep(), prevStep() methods to DemoStateMachine in src/demo/state.ts
- [x] T035 [US3] Add step-through mode handling in state machine in src/demo/state.ts
- [x] T036 [US3] Create StepControls component (Next, Previous buttons) in src/demo/controls.ts
- [x] T037 [US3] Add step controls to demo section in src/index.html
- [x] T038 [US3] Style step control buttons in src/styles.css
- [x] T039 [US3] Create StepIndicator component ("Step 2 of 5") in src/demo/controls.ts
- [x] T040 [US3] Implement jumpToStep() for immediate layer visualization in src/demo/animation.ts
- [x] T041 [US3] Wire step controls to state machine in src/main.ts
- [x] T042 [US3] Update visualization on step change (highlight current layer) in src/main.ts

**Checkpoint**: Next/Previous navigate through layers; step indicator shows progress; visualization updates per step

---

## Phase 6: User Story 4 - Auto-Play Complete Demonstration (Priority: P4)

**Goal**: Provide automatic playback with speed control and pause/resume

**Independent Test**: Click "Auto Demo", watch entire forward pass animate automatically at comfortable pace

### Implementation for User Story 4

- [x] T043 [US4] Add pause(), resume() methods to DemoStateMachine in src/demo/state.ts
- [x] T044 [US4] Implement auto-advance timer using SPEED_CONFIGS in src/demo/animation.ts
- [x] T045 [US4] Create SpeedSelector component (slow/medium/fast) in src/demo/controls.ts
- [x] T046 [US4] Add speed selector to demo controls in src/index.html
- [x] T047 [US4] Style speed selector buttons/toggle in src/styles.css
- [x] T048 [US4] Create PauseResumeButton component in src/demo/controls.ts
- [x] T049 [US4] Update animation to respect current speed setting in src/demo/animation.ts
- [x] T050 [US4] Wire speed selector and pause/resume to state machine in src/main.ts
- [x] T051 [US4] Handle speed change during playback (adjust remaining time) in src/demo/animation.ts

**Checkpoint**: Auto demo plays through all layers; pause/resume works mid-animation; speed adjustable

---

## Phase 7: User Story 5 - See Mathematical Calculations (Priority: P5)

**Goal**: Display calculation formulas in dedicated panel

**Independent Test**: During demo, verify calculation panel shows formulas like "0.500 × 1.234 + ... = 0.547"

### Implementation for User Story 5

- [x] T052 [US5] Create CalculationPanel component in src/demo/panel.ts
- [x] T053 [US5] Add calculation panel container to HTML in src/index.html
- [x] T054 [US5] Style calculation panel (layout, typography) in src/styles.css
- [x] T055 [US5] Implement renderNeuronCalculations() displaying formulas in src/demo/panel.ts
- [x] T056 [US5] Show layer label heading in panel in src/demo/panel.ts
- [x] T057 [US5] Highlight current neuron calculation in panel in src/demo/panel.ts
- [x] T058 [US5] Wire panel updates to state machine step changes in src/main.ts
- [x] T059 [US5] Add responsive layout (below network on narrow, beside on wide) in src/styles.css

**Checkpoint**: Calculation panel shows formulas per layer; updates on step change; responsive positioning

---

## Phase 8: Integration & Cross-Cutting Concerns

**Purpose**: Training integration, keyboard shortcuts, edge cases, polish

- [x] T060 Implement training pause on demo start (FR-019) in src/main.ts
- [x] T061 Implement training restore on demo end (FR-020) in src/main.ts
- [x] T062 Disable training controls during demo (FR-004) in src/demo/controls.ts
- [x] T063 Add keyboard shortcut D for demo start in src/main.ts
- [x] T064 Add keyboard shortcut N for next step in src/main.ts
- [x] T065 Add keyboard shortcut P for previous step in src/main.ts
- [x] T066 Add keyboard shortcut Escape to cancel demo in src/main.ts
- [x] T067 Add keyboard shortcut Space for pause/resume in src/main.ts
- [x] T068 [P] Handle rapid demo button clicks (ignore while running) in src/demo/state.ts
- [x] T069 [P] Ensure minimum animation duration at fast speed in src/demo/animation.ts
- [x] T070 [P] Handle demo after network reset (work with new weights) in src/main.ts
- [x] T071 [P] Add ARIA labels to demo controls in src/demo/controls.ts
- [x] T072 [P] Add keyboard focus styles for demo elements in src/styles.css
- [x] T073 Verify bundle size still under 500KB gzipped with `npm run build`
- [ ] T074 Run full integration test: select input → run demo → step through → verify calculations (Manual testing)
- [ ] T075 Test in Chrome, Firefox, Safari - verify animations render correctly (Manual testing)

**Checkpoint**: All edge cases handled; keyboard navigation works; production-ready

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - start immediately
- **Foundational (Phase 2)**: Depends on Setup - BLOCKS all user stories
- **US1 (Phase 3)**: Depends on Foundational - MVP baseline
- **US2 (Phase 4)**: Depends on Foundational - Can parallel with US1
- **US3 (Phase 5)**: Depends on Foundational - Can parallel with US1/US2
- **US4 (Phase 6)**: Depends on Foundational + partial US1 (animation base) - Recommended after US1
- **US5 (Phase 7)**: Depends on Foundational - Can parallel with others
- **Polish (Phase 8)**: Depends on all user stories completion

### User Story Independence

```
Foundational (state machine + calculator)
     │
     ▼
   ┌─────────────────────────────────────────┐
   │                                         │
   ▼         ▼         ▼         ▼          ▼
  US1       US2       US3       US4        US5
(Animate) (Input)   (Step)   (Auto)    (Calc Panel)
   │         │         │         │          │
   └─────────┴─────────┴─────────┴──────────┘
                       │
                       ▼
                Integration & Polish
```

US1 is the MVP and recommended first. US2-US5 can proceed in parallel after Foundational, but US4 (Auto-Play) benefits from US1 animation code.

### Parallel Opportunities

**Phase 1 (Setup)**: T002, T003, T004, T005, T006 can run in parallel (different type groups)
**Phase 2 (Foundational)**: T012, T013 can parallel with T007-T011
**Phase 8 (Polish)**: T068, T069, T070, T071, T072 can run in parallel

---

## Parallel Example: Phase 1 Setup

```bash
# Launch all type definition tasks together:
Task: "Define DemoMode, DemoSpeed, DemoState types in src/demo/types.ts"
Task: "Define DemoStep, NeuronCalculation interfaces in src/demo/types.ts"
Task: "Define XORInput, XOR_INPUTS, XOR_EXPECTED constants in src/demo/types.ts"
Task: "Define DemoSpeedConfig, SPEED_CONFIGS constants in src/demo/types.ts"
Task: "Define SignalPosition, SignalAnimation interfaces in src/demo/types.ts"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (T001-T006)
2. Complete Phase 2: Foundational (T007-T013)
3. Complete Phase 3: User Story 1 (T014-T025)
4. **STOP and VALIDATE**: Click Demo → pulse animates through network
5. Deploy MVP to GitHub Pages

### Incremental Delivery

1. Setup + Foundational → Types and state machine ready
2. + US1 → Animated demo works (MVP!)
3. + US2 → Input selection available
4. + US3 → Step-through mode available
5. + US4 → Auto-play with speed control
6. + US5 → Calculation panel displayed
7. + Polish → Production ready

### Task Counts by Phase

| Phase | Tasks | Parallelizable |
|-------|-------|----------------|
| Setup | 6 | 5 |
| Foundational | 7 | 2 |
| US1 | 12 | 0 |
| US2 | 8 | 0 |
| US3 | 9 | 0 |
| US4 | 9 | 0 |
| US5 | 8 | 0 |
| Polish | 16 | 5 |
| **Total** | **75** | **12** |

---

## Notes

- [P] tasks = different files, no dependencies on incomplete tasks
- [US#] label maps task to specific user story
- Each user story independently completable after Foundational
- US1 is largest (12 tasks) - core animation implementation
- Commit after each task or logical group
- Stop at any checkpoint to validate independently
- SC-006 (3 decimal accuracy) validated by unit tests in T013
