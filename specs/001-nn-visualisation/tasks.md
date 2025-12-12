# Tasks: Neural Network Visualisation

**Input**: Design documents from `/specs/001-nn-visualisation/`
**Prerequisites**: plan.md (required), spec.md (required), research.md, data-model.md

**Tests**: Tests NOT explicitly requested in spec. Unit tests included in Foundational phase for neural network math correctness (critical for educational accuracy).

**Organization**: Tasks grouped by user story for independent implementation and testing.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story (US1-US5)
- File paths relative to repository root

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization with Vite + TypeScript + D3.js

- [x] T001 Create project structure with directories: src/network/, src/visualisation/, src/controls/, tests/unit/
- [x] T002 Initialize Vite project with TypeScript template and configure for static build in vite.config.ts
- [x] T003 [P] Install D3.js v7 dependency and add to package.json
- [x] T004 [P] Configure TypeScript with strict mode in tsconfig.json targeting ES2020
- [x] T005 [P] Create base HTML entry point in src/index.html with SVG container
- [x] T006 [P] Create global styles with CSS variables for colors in src/styles.css

**Checkpoint**: Project builds and runs empty page with `npm run dev`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core type definitions and neural network entities that ALL user stories depend on

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T007 Define all TypeScript interfaces (Neuron, Layer, Weight, Network, TrainingConfig) in src/network/types.ts
- [x] T008 Implement Neuron class with bias, activation, sigmoid function in src/network/neuron.ts
- [x] T009 Implement Layer class containing neurons with type designation in src/network/layer.ts
- [x] T010 Implement Network class orchestrating layers and weights with Xavier initialization in src/network/network.ts
- [x] T011 [P] Create unit test for sigmoid function correctness in tests/unit/neuron.test.ts
- [x] T012 [P] Create unit test for Xavier initialization bounds in tests/unit/network.test.ts
- [x] T013 Configure Vitest in vite.config.ts and add test script to package.json

**Checkpoint**: `npm run test` passes; Network can be instantiated with [2,2,1] architecture

---

## Phase 3: User Story 1 - View Network Structure (Priority: P1) 🎯 MVP

**Goal**: Display neural network diagram with neurons as circles and weights as connecting lines

**Independent Test**: Load page → see 5 neurons in 3 layers with 6 connecting lines

### Implementation for User Story 1

- [x] T014 [US1] Implement layout calculations (neuron x/y positions by layer) in src/visualisation/layout.ts
- [x] T015 [US1] Implement D3 SVG renderer for neurons as circles in src/visualisation/renderer.ts
- [x] T016 [US1] Add weight line rendering between neurons with thickness encoding in src/visualisation/renderer.ts
- [x] T017 [US1] Add weight color encoding (blue positive, red negative) in src/visualisation/renderer.ts
- [x] T018 [US1] Add layer labels (Input, Hidden, Output) to SVG in src/visualisation/renderer.ts
- [x] T019 [US1] Wire up main.ts to create Network and render on page load in src/main.ts
- [x] T020 [US1] Add responsive scaling for viewport 1024-1920px in src/visualisation/layout.ts

**Checkpoint**: Page loads showing XOR network (2-2-1) with visible neurons and weighted connections

---

## Phase 4: User Story 2 - Inspect Weights and Biases (Priority: P2)

**Goal**: Hover over elements to see numerical values (weight values, neuron bias/activation)

**Independent Test**: Hover neuron → see bias and activation; hover connection → see weight value

### Implementation for User Story 2

- [x] T021 [US2] Create tooltip component with positioning logic in src/visualisation/tooltip.ts
- [x] T022 [US2] Add hover event handlers to neuron circles showing bias/activation in src/visualisation/renderer.ts
- [x] T023 [US2] Add hover event handlers to weight lines showing weight value in src/visualisation/renderer.ts
- [x] T024 [US2] Format numbers to 3 decimal places (avoid scientific notation) in src/visualisation/tooltip.ts
- [x] T025 [US2] Style tooltip with high contrast (WCAG AA) in src/styles.css

**Checkpoint**: Hovering any element shows formatted numerical value in tooltip

---

## Phase 5: User Story 3 - Watch Training in Action (Priority: P3)

**Goal**: Step through training and watch weights animate; play/pause continuous training

**Independent Test**: Click Step → weights visually change; Click Play → continuous animation

### Implementation for User Story 3

- [x] T026 [US3] Implement forward propagation in src/network/training.ts
- [x] T027 [US3] Implement backpropagation with gradient computation in src/network/training.ts
- [x] T028 [US3] Implement weight update step with learning rate in src/network/training.ts
- [x] T029 [US3] Add XOR training data as constant in src/network/training.ts
- [x] T030 [P] [US3] Create unit test for forward pass output correctness in tests/unit/training.test.ts
- [x] T031 [P] [US3] Create unit test for backpropagation gradient calculation in tests/unit/training.test.ts
- [x] T032 [US3] Implement weight change animation with D3 transitions in src/visualisation/animation.ts
- [x] T033 [US3] Implement neuron activation animation (fill opacity) in src/visualisation/animation.ts
- [x] T034 [US3] Create playback controls UI (Step, Play, Pause buttons) in src/controls/playback.ts
- [x] T035 [US3] Implement step button triggering single training iteration in src/controls/playback.ts
- [x] T036 [US3] Implement play/pause with requestAnimationFrame loop in src/controls/playback.ts
- [x] T037 [US3] Add step counter and loss display to UI in src/controls/playback.ts
- [x] T038 [US3] Add keyboard shortcuts (Space=play/pause, Right=step) in src/controls/playback.ts
- [x] T039 [US3] Wire training controls to network and renderer in src/main.ts

**Checkpoint**: Can step through training watching weights animate; play runs continuously at 30fps

---

## Phase 6: User Story 4 - Adjust Learning Parameters (Priority: P4)

**Goal**: Slider to change learning rate with immediate visual effect on training speed

**Independent Test**: Move slider → see faster/slower weight changes during training

### Implementation for User Story 4

- [x] T040 [US4] Create learning rate slider UI component in src/controls/parameters.ts
- [x] T041 [US4] Display current learning rate value next to slider in src/controls/parameters.ts
- [x] T042 [US4] Connect slider to TrainingConfig.learningRate in src/controls/parameters.ts
- [x] T043 [US4] Add keyboard accessibility to slider (arrow keys) in src/controls/parameters.ts
- [x] T044 [US4] Wire parameters control to main application in src/main.ts

**Checkpoint**: Adjusting slider visibly affects magnitude of weight changes per step

---

## Phase 7: User Story 5 - Reset and Experiment (Priority: P5)

**Goal**: Reset button re-initializes weights; different training trajectories each run

**Independent Test**: Click Reset → weights change to new random values; retrain shows different path

### Implementation for User Story 5

- [x] T045 [US5] Create Reset button UI component in src/controls/reset.ts
- [x] T046 [US5] Implement network re-initialization with new Xavier weights in src/network/network.ts
- [x] T047 [US5] Reset step counter and loss on reset in src/controls/reset.ts
- [x] T048 [US5] Add keyboard shortcut (R=reset) in src/controls/reset.ts
- [x] T049 [US5] Wire reset control to network and renderer in src/main.ts

**Checkpoint**: Reset produces new random weights; retraining shows different convergence path

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Edge cases, accessibility, and deployment readiness

- [x] T050 [P] Handle exploding gradients - cap weight visual encoding at 6px thickness in src/visualisation/renderer.ts
- [x] T051 [P] Handle vanishing weights - ensure minimum 1px line visibility in src/visualisation/renderer.ts
- [x] T052 [P] Debounce rapid step clicks to prevent animation queue overflow in src/controls/playback.ts
- [x] T053 [P] Add window resize handler for responsive layout in src/visualisation/layout.ts
- [x] T054 Ensure all controls have visible focus states for keyboard navigation in src/styles.css
- [x] T055 Add ARIA labels to interactive elements for screen readers in src/visualisation/renderer.ts
- [x] T056 Verify color contrast meets WCAG AA (4.5:1 minimum) in src/styles.css
- [x] T057 Run production build and verify bundle <500KB gzipped with `npm run build`
- [ ] T058 Test in Chrome, Firefox, Safari - verify 30fps animation in all browsers
- [x] T059 Create GitHub Pages deployment workflow in .github/workflows/deploy.yml

**Checkpoint**: All edge cases handled; passes accessibility checks; deploys to GitHub Pages

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - start immediately
- **Foundational (Phase 2)**: Depends on Setup - BLOCKS all user stories
- **US1 (Phase 3)**: Depends on Foundational - MVP baseline
- **US2 (Phase 4)**: Depends on US1 (needs rendered elements to hover)
- **US3 (Phase 5)**: Depends on US1 (needs visualization to animate)
- **US4 (Phase 6)**: Depends on US3 (needs training to adjust)
- **US5 (Phase 7)**: Depends on US3 (needs training to reset)
- **Polish (Phase 8)**: Depends on US1-US5 completion

### User Story Dependencies

```
Foundational
     │
     ▼
   US1 (View Structure) ─────────────────────┐
     │                                        │
     ▼                                        │
   US2 (Inspect Values)                       │
     │                                        │
     ├────────────────────────────────────────┤
     │                                        │
     ▼                                        ▼
   US3 (Training) ◄─── US4 (Learning Rate)   │
     │                                        │
     ▼                                        │
   US5 (Reset) ◄──────────────────────────────┘
```

### Parallel Opportunities

**Phase 1 (Setup)**: T003, T004, T005, T006 can run in parallel
**Phase 2 (Foundational)**: T011, T012 can run in parallel (tests)
**Phase 5 (US3)**: T030, T031 can run in parallel (tests)
**Phase 8 (Polish)**: T050, T051, T052, T053 can run in parallel

---

## Parallel Example: Setup Phase

```bash
# Launch parallelizable setup tasks together:
Task: "Install D3.js dependency in package.json"
Task: "Configure TypeScript in tsconfig.json"
Task: "Create HTML entry point in src/index.html"
Task: "Create global styles in src/styles.css"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (T001-T006)
2. Complete Phase 2: Foundational (T007-T013)
3. Complete Phase 3: User Story 1 (T014-T020)
4. **STOP and VALIDATE**: Page shows network diagram
5. Deploy MVP to GitHub Pages

### Incremental Delivery

1. Setup + Foundational → `npm run dev` works
2. + US1 → See network structure (MVP!)
3. + US2 → Hover to see values
4. + US3 → Watch training animate (core educational goal!)
5. + US4 → Adjust learning rate
6. + US5 → Reset and experiment
7. + Polish → Production ready

### Task Counts by Phase

| Phase | Tasks | Parallelizable |
|-------|-------|----------------|
| Setup | 6 | 4 |
| Foundational | 7 | 2 |
| US1 | 7 | 0 |
| US2 | 5 | 0 |
| US3 | 14 | 2 |
| US4 | 5 | 0 |
| US5 | 5 | 0 |
| Polish | 10 | 4 |
| **Total** | **59** | **12** |

---

## Notes

- [P] tasks = different files, no dependencies on incomplete tasks
- [US#] label maps task to specific user story
- Each user story independently completable after Foundational
- US3 is the key educational payoff - seeing weights adjust
- Commit after each task or logical group
- Stop at any checkpoint to validate independently
- Avoid cross-story dependencies that break independence
