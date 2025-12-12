# Tasks: Educational Enhancements

**Input**: Design documents from `/specs/002-educational-enhancements/`
**Prerequisites**: plan.md (required), spec.md (required), research.md, data-model.md

**Tests**: Tests NOT explicitly requested in spec. Unit tests included in Foundational phase for deeper network math correctness.

**Organization**: Tasks grouped by user story for independent implementation and testing.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story (US1-US5)
- File paths relative to repository root

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Create educational module directory structure

- [x] T001 Create src/education/ directory for educational content module
- [x] T002 [P] Define Hint, HintState, LegendItem, LossTrend interfaces in src/education/types.ts
- [x] T003 [P] Define LearningResource, EducationalContent interfaces in src/education/types.ts
- [x] T004 [P] Add previousLoss field to TrainingConfig interface in src/network/types.ts

**Checkpoint**: Education module structure ready; types defined

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Deeper network architecture that ALL user stories depend on

**⚠️ CRITICAL**: No user story work can begin until network displays correctly with 5 layers

- [x] T005 Update default network architecture to [2, 4, 3, 2, 1] in src/main.ts
- [x] T006 Adjust layout calculations for 5-layer network in src/visualisation/layout.ts
- [x] T007 Verify neuron spacing prevents overlap with 12 neurons in src/visualisation/layout.ts
- [x] T008 [P] Update unit tests for deeper architecture in tests/unit/network.test.ts
- [x] T009 Verify training still converges with deeper network (may need more steps)

**Checkpoint**: Network renders 5 layers (12 neurons, 26 weights); training converges; `npm run test` passes

---

## Phase 3: User Story 1 - Understand Network Components (Priority: P1) 🎯 MVP

**Goal**: Display persistent legend explaining neurons, weights, layers, activations, and loss

**Independent Test**: Load page → see legend with all component explanations visible

### Implementation for User Story 1

- [x] T010 [US1] Create legend data with all LegendItems in src/education/content.ts
- [x] T011 [US1] Implement Legend class rendering collapsible sidebar in src/education/legend.ts
- [x] T012 [US1] Add legend styles (sidebar, sections, visual samples) in src/styles.css
- [x] T013 [US1] Add SVG visual samples for neurons (circle, opacity gradient) in src/education/legend.ts
- [x] T014 [US1] Add SVG visual samples for weights (blue/red lines, thickness) in src/education/legend.ts
- [x] T015 [US1] Add layer type indicators (input/hidden/output columns) in src/education/legend.ts
- [x] T016 [US1] Add loss explanation text alongside loss value display in src/controls/playback.ts
- [x] T017 [US1] Update index.html with legend container element in src/index.html
- [x] T018 [US1] Wire Legend component to main.ts in src/main.ts
- [x] T019 [US1] Implement legend collapse/expand toggle with keyboard support in src/education/legend.ts

**Checkpoint**: Legend displays all component explanations; collapsible on desktop; users can reference while exploring

---

## Phase 4: User Story 2 - Deeper Network Architecture (Priority: P2)

**Goal**: Users can see and understand the 5-layer network with multiple hidden layers

**Independent Test**: Count layers → see 5 distinct columns; training flows visually through all layers

### Implementation for User Story 2

- [x] T020 [US2] Add distinct visual styling for layer types (input/hidden/output) in src/styles.css
- [x] T021 [US2] Update layer labels to show "Hidden 1", "Hidden 2", "Hidden 3" in src/visualisation/renderer.ts
- [x] T022 [US2] Add layer index annotations above each column in src/visualisation/renderer.ts
- [x] T023 [US2] Enhance animation to show data flow direction during forward pass in src/visualisation/animation.ts
- [x] T024 [US2] Ensure responsive layout maintains readability at 1024px width in src/visualisation/layout.ts

**Checkpoint**: 5-layer network clearly shows layer structure; animation demonstrates data flow through depth

---

## Phase 5: User Story 3 - Contextual Explanations (Priority: P3)

**Goal**: Inline hints appear during user interactions to explain what's happening

**Independent Test**: Click Step → see explanation; adjust slider → see explanation; watch loss → see trend

### Implementation for User Story 3

- [x] T025 [US3] Create all Hint content data in src/education/content.ts
- [x] T026 [US3] Implement HintManager class with localStorage persistence in src/education/hints.ts
- [x] T027 [US3] Implement hint positioning logic (top/bottom/left/right of target) in src/education/hints.ts
- [x] T028 [US3] Add hint callout styles (bubble, arrow, dismiss button) in src/styles.css
- [x] T029 [US3] Implement hint dismiss functionality with × button in src/education/hints.ts
- [x] T030 [US3] Add load-triggered hints (network, weights) in src/education/hints.ts
- [x] T031 [US3] Add first-interaction hints for Step button in src/controls/playback.ts
- [x] T032 [US3] Add first-interaction hints for Play button in src/controls/playback.ts
- [x] T033 [US3] Add first-interaction hints for learning rate slider in src/controls/parameters.ts
- [x] T034 [US3] Add first-interaction hints for Reset button in src/controls/reset.ts
- [x] T035 [US3] Implement LossTrend calculation (improving/worsening/stable) in src/education/loss-indicator.ts
- [x] T036 [US3] Add traffic light indicator UI next to loss value in src/education/loss-indicator.ts
- [x] T037 [US3] Track previousLoss in training step for trend calculation in src/controls/playback.ts
- [x] T038 [US3] Add "Reset Hints" button to re-show all hints in src/education/hints.ts
- [x] T039 [US3] Wire HintManager and LossTrend to main.ts in src/main.ts

**Checkpoint**: Hints appear contextually; loss trend shows direction; hints persist across page reload; reset works

---

## Phase 6: User Story 4 - Connection to Real AI (Priority: P4)

**Goal**: Content explains how demo concepts relate to LLMs and real AI systems

**Independent Test**: Find and read LLM connection content; understand scale difference

### Implementation for User Story 4

- [x] T040 [US4] Create LLM connection content (EducationalContent) in src/education/content.ts
- [x] T041 [US4] Create expandable "How This Relates to AI" panel component in src/education/resources.ts
- [x] T042 [US4] Add panel styles (expandable, sections, emphasis) in src/styles.css
- [x] T043 [US4] Include key comparison points (12 neurons vs billions) in src/education/content.ts
- [x] T044 [US4] Wire AI connection panel to main.ts in src/main.ts

**Checkpoint**: Users can find and read LLM connection; understand this demo uses same concepts at smaller scale

---

## Phase 7: User Story 5 - Navigation Guidance (Priority: P5)

**Goal**: First-time visitors get clear onboarding and can find external resources

**Independent Test**: Load page → see initial hints; find "Learn More" section with resource links

### Implementation for User Story 5

- [x] T045 [US5] Create LearningResource data (5-7 curated links) in src/education/content.ts
- [x] T046 [US5] Implement Resources panel component with link cards in src/education/resources.ts
- [x] T047 [US5] Add resource link styles (cards, icons by type, hover states) in src/styles.css
- [x] T048 [US5] Ensure all links open in new tab with rel="noopener" in src/education/resources.ts
- [x] T049 [US5] Add enhanced control labels/descriptions in src/index.html
- [x] T050 [US5] Wire Resources panel to main.ts in src/main.ts
- [x] T051 [US5] Add keyboard navigation for resources panel in src/education/resources.ts

**Checkpoint**: Initial hints guide exploration; resources panel shows curated links; all links work

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Edge cases, accessibility, and integration testing

- [x] T052 [P] Handle hint overlap with network diagram (z-index, repositioning) in src/education/hints.ts
- [x] T053 [P] Handle small screen layout (collapse legend, stack panels) in src/styles.css
- [x] T054 [P] Suppress contextual hints during rapid training (play mode) in src/education/hints.ts
- [x] T055 [P] Add ARIA labels to legend and resource links in src/education/legend.ts and src/education/resources.ts
- [x] T056 [P] Add keyboard focus styles for all new interactive elements in src/styles.css
- [x] T057 Verify bundle size still under 500KB gzipped with `npm run build`
- [x] T058 Run full integration test: load → explore → train → check resources
- [x] T059 Test in Chrome, Firefox, Safari - verify hints position correctly

**Checkpoint**: All edge cases handled; accessibility verified; production-ready

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - start immediately
- **Foundational (Phase 2)**: Depends on Setup - BLOCKS all user stories
- **US1 (Phase 3)**: Depends on Foundational - MVP baseline (legend)
- **US2 (Phase 4)**: Depends on Foundational - Can parallel with US1
- **US3 (Phase 5)**: Depends on Foundational - Can parallel with US1/US2
- **US4 (Phase 6)**: Depends on Foundational - Can parallel with others
- **US5 (Phase 7)**: Depends on Foundational - Can parallel with others
- **Polish (Phase 8)**: Depends on US1-US5 completion

### User Story Independence

```
Foundational (5-layer network)
     │
     ▼
   ┌─────────────────────────────────────────┐
   │                                         │
   ▼         ▼         ▼         ▼          ▼
  US1       US2       US3       US4        US5
(Legend) (Layers) (Hints)  (LLM)    (Resources)
   │         │         │         │          │
   └─────────┴─────────┴─────────┴──────────┘
                       │
                       ▼
                    Polish
```

All user stories can proceed in parallel after Foundational phase. They integrate but don't depend on each other.

### Parallel Opportunities

**Phase 1 (Setup)**: T002, T003, T004 can run in parallel
**Phase 2 (Foundational)**: T008 can parallel with T005-T007
**Phase 3 (US1)**: T013, T014, T015 can run in parallel (visual samples)
**Phase 5 (US3)**: T031, T032, T033, T034 can run in parallel (control hints)
**Phase 8 (Polish)**: T052, T053, T054, T055, T056 can run in parallel

---

## Parallel Example: User Story 3 Control Hints

```bash
# Launch all control hint tasks together:
Task: "Add first-interaction hints for Step button in src/controls/playback.ts"
Task: "Add first-interaction hints for Play button in src/controls/playback.ts"
Task: "Add first-interaction hints for learning rate slider in src/controls/parameters.ts"
Task: "Add first-interaction hints for Reset button in src/controls/reset.ts"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (T001-T004)
2. Complete Phase 2: Foundational (T005-T009)
3. Complete Phase 3: User Story 1 (T010-T019)
4. **STOP and VALIDATE**: Legend visible with all explanations
5. Deploy MVP to GitHub Pages

### Incremental Delivery

1. Setup + Foundational → 5-layer network renders
2. + US1 → Legend explains all components (MVP!)
3. + US2 → Layer structure clearly visible
4. + US3 → Contextual hints guide learning
5. + US4 → LLM connection content
6. + US5 → External resources available
7. + Polish → Production ready

### Task Counts by Phase

| Phase | Tasks | Parallelizable |
|-------|-------|----------------|
| Setup | 4 | 3 |
| Foundational | 5 | 1 |
| US1 | 10 | 3 |
| US2 | 5 | 0 |
| US3 | 15 | 4 |
| US4 | 5 | 0 |
| US5 | 7 | 0 |
| Polish | 8 | 5 |
| **Total** | **59** | **16** |

---

## Notes

- [P] tasks = different files, no dependencies on incomplete tasks
- [US#] label maps task to specific user story
- Each user story independently completable after Foundational
- US3 (hints) is the most complex with 15 tasks
- Commit after each task or logical group
- Stop at any checkpoint to validate independently
- localStorage persistence enables hints to survive page refresh
