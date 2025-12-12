# Tasks: UI Layout Improvements

**Input**: Design documents from `/specs/005-ui-layout-improvements/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, quickstart.md

**Tests**: No automated tests requested. Manual testing per quickstart.md.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Single project**: `src/`, `tests/` at repository root (per plan.md)

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Prepare CSS infrastructure for layout changes

- [x] T001 Add CSS custom properties for neuron intensity colors (--neuron-hue, --neuron-saturation, --neuron-lightness-low, --neuron-lightness-high) in src/styles.css
- [x] T002 [P] Add CSS class for control panel grid layout (.control-panel-grid) in src/styles.css

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core HTML restructure that ALL user stories depend on

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T003 Restructure HTML layout in src/index.html: wrap #controls in #training-panel div, wrap #demo-controls in #run-panel div
- [x] T004 Add section headers (<h3>) to training and run panels in src/index.html: "Train Network" and "Run Network"
- [x] T005 Remove #legend-container element from src/index.html
- [x] T006 Remove #resources-container element from src/index.html
- [x] T007 Remove Legend import and initialization from src/main.ts
- [x] T008 Remove ResourcesPanel import and initialization from src/main.ts
- [x] T009 Update header CSS to align title to top-left (text-align: left) in src/styles.css

**Checkpoint**: Foundation ready - HTML structure reorganized, unused panels removed

---

## Phase 3: User Story 1 - Streamlined Interface with Cleaner Layout (Priority: P1) 🎯 MVP

**Goal**: Remove cluttering panels (Legend, Resources), move title to top-left, give visualization more space

**Independent Test**: Load app, verify no Legend/Resources panels visible, title in top-left, visualization area expanded

### Implementation for User Story 1

- [x] T010 [US1] Update #app grid layout to remove legend column in src/styles.css
- [x] T011 [US1] Remove grid-area: legend rule and related legend positioning styles in src/styles.css
- [x] T012 [US1] Update @media (min-width: 1024px) to use 2-column grid (visualisation + controls) in src/styles.css
- [x] T013 [US1] Adjust #visualisation section to expand into freed space in src/styles.css
- [x] T014 [US1] Verify header h1 displays in top-left with proper padding in src/styles.css

**Checkpoint**: User Story 1 complete - cleaner interface with no sidebar panels, title top-left

---

## Phase 4: User Story 2 - Reorganized Control Layout (Priority: P1)

**Goal**: Training controls on left, Run Network controls on right, clear section labels

**Independent Test**: Verify training panel (Step, Play, learning rate) on left; run panel (input selector, run button) on right with "Run Network" label

### Implementation for User Story 2

- [x] T015 [US2] Add CSS Grid styles for #controls-container with grid-template-columns: 1fr 1fr in src/styles.css
- [x] T016 [US2] Add .control-panel class styles (background, border-radius, padding) in src/styles.css
- [x] T017 [US2] Add .control-panel h3 header styles in src/styles.css
- [x] T018 [US2] Add responsive @media query to stack panels vertically below 768px in src/styles.css
- [x] T019 [US2] Update #demo-controls header text content to "Run Network" (remove "Demo" terminology) in src/index.html
- [x] T020 [US2] Verify keyboard navigation works across both panels in src/main.ts (no changes expected, just verify)

**Checkpoint**: User Story 2 complete - controls clearly organized left/right with proper labels

---

## Phase 5: User Story 3 - Enhanced Neuron Visualization (Priority: P2)

**Goal**: Neurons display as solid filled circles with color intensity based on activation (lighter=low, darker=high)

**Independent Test**: Run network with different inputs, observe neuron colors change intensity based on activation values

### Implementation for User Story 3

- [x] T021 [US3] Create getNeuronFill(activation: number): string helper function in src/visualisation/layout.ts
- [x] T022 [US3] Implement HSL color calculation: hsl(220, 70%, ${85 - activation * 60}%) in src/visualisation/layout.ts
- [x] T023 [US3] Update renderNeurons() in NetworkRenderer to use getNeuronFill() for fill attribute in src/visualisation/renderer.ts
- [x] T024 [US3] Update updateNeurons() to transition fill color on activation change in src/visualisation/renderer.ts
- [x] T025 [US3] Remove fill-opacity approach, use solid fill instead in src/visualisation/renderer.ts
- [x] T026 [US3] Update .neuron CSS to remove fill: var(--color-background) default in src/styles.css
- [x] T027 [US3] Add CSS transition for fill property on .neuron class in src/styles.css

**Checkpoint**: User Story 3 complete - neurons show activation intensity through color darkness

---

## Phase 6: User Story 4 - Interactive Weight and Bias Understanding (Priority: P2)

**Goal**: Hover over weights/neurons shows values with brief educational explanations

**Independent Test**: Hover over weight line, verify tooltip shows value + explanation; hover over neuron, verify bias + explanation (except input neurons)

### Implementation for User Story 4

- [x] T028 [US4] Add WEIGHT_EXPLANATION constant string in src/visualisation/tooltip.ts
- [x] T029 [US4] Add BIAS_EXPLANATION constant string in src/visualisation/tooltip.ts
- [x] T030 [US4] Update showWeight() method to include explanation text below value in src/visualisation/tooltip.ts
- [x] T031 [US4] Update showActivation() method to include bias value and explanation for non-input neurons in src/visualisation/tooltip.ts
- [x] T032 [US4] Add CSS styles for tooltip explanation text (.tooltip-explanation) in src/styles.css
- [x] T033 [US4] Ensure tooltip max-width accommodates longer content in src/styles.css
- [x] T034 [US4] Verify tooltip updates after training step (existing functionality) in src/main.ts

**Checkpoint**: User Story 4 complete - weights and biases have visible values and educational context

---

## Phase 7: User Story 5 - Real-time Value Display During Network Execution (Priority: P3)

**Goal**: Show value flow through network during forward pass (input values visible, intermediate calculations)

**Independent Test**: Run input through network, observe input values on neurons and layer-by-layer values in calculation panel

### Implementation for User Story 5

- [x] T035 [US5] Verify showInputValues() function displays input values on input neurons in src/demo/animation.ts
- [x] T036 [US5] Update CalculationPanel to show clearer input→weight→output flow in src/demo/panel.ts
- [x] T037 [US5] Add calculation breakdown format: "inputs × weights + bias = pre-activation → activation" in src/demo/panel.ts
- [x] T038 [US5] Ensure calculation panel updates step-by-step during demo in src/demo/panel.ts

**Checkpoint**: User Story 5 complete - users can follow value transformations through network

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [x] T039 [P] Verify all existing tests pass (npm run test)
- [x] T040 [P] Verify build succeeds (npm run build)
- [ ] T041 Run manual testing checklist from quickstart.md
- [x] T042 [P] Verify responsive layout at 768px breakpoint
- [x] T043 [P] Verify WCAG AA color contrast for neuron colors
- [ ] T044 [P] Remove any dead CSS rules from removed panels in src/styles.css (optional cleanup)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-7)**: All depend on Foundational phase completion
  - US1 and US2 (both P1) can proceed in parallel after Foundational
  - US3 and US4 (both P2) can proceed in parallel after Foundational
  - US5 (P3) can proceed after Foundational
- **Polish (Phase 8)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 3 (P2)**: Can start after Foundational (Phase 2) - Independent of US1/US2
- **User Story 4 (P2)**: Can start after Foundational (Phase 2) - Independent of US1/US2/US3
- **User Story 5 (P3)**: Can start after Foundational (Phase 2) - Uses existing demo infrastructure

### Within Each User Story

- CSS changes can often run in parallel with JS changes
- File-specific tasks marked [P] can run in parallel
- Verify functionality after each story completes

### Parallel Opportunities

**Phase 1 (Setup):**
```
T001 (CSS custom properties) || T002 (CSS grid class)
```

**Phase 2 (Foundational):**
```
T005 (remove legend HTML) || T006 (remove resources HTML)
T007 (remove Legend JS) || T008 (remove ResourcesPanel JS)
```

**Phase 3+4 (US1 + US2 - both P1):**
```
All of US1 (T010-T014) || All of US2 (T015-T020) - different CSS sections and HTML elements
```

**Phase 5+6 (US3 + US4 - both P2):**
```
US3 (T021-T027) focuses on renderer.ts + layout.ts
US4 (T028-T034) focuses on tooltip.ts
These can run in parallel
```

**Phase 8 (Polish):**
```
T039 (tests) || T040 (build) || T042 (responsive) || T043 (contrast) || T044 (cleanup)
```

---

## Implementation Strategy

### MVP First (User Stories 1 + 2 Only)

1. Complete Phase 1: Setup (T001-T002)
2. Complete Phase 2: Foundational (T003-T009)
3. Complete Phase 3: User Story 1 (T010-T014)
4. Complete Phase 4: User Story 2 (T015-T020)
5. **STOP and VALIDATE**: Test cleaner layout and reorganized controls
6. Deploy/demo if ready - core UI improvements delivered!

### Incremental Delivery

1. Setup + Foundational → Foundation ready (T001-T009)
2. Add User Story 1 → Test → Deploy (panels removed, title repositioned)
3. Add User Story 2 → Test → Deploy (controls reorganized)
4. Add User Story 3 → Test → Deploy (neuron intensity visualization)
5. Add User Story 4 → Test → Deploy (weight/bias explanations)
6. Add User Story 5 → Test → Deploy (value flow display)
7. Polish → Final release

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1 (layout cleanup) + User Story 3 (neuron colors)
   - Developer B: User Story 2 (control layout) + User Story 4 (tooltips)
3. User Story 5 can be done by either after their stories complete
4. Stories complete and integrate independently

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story is independently completable and testable
- US1 + US2 are both P1 priority - complete both for MVP
- US3 + US4 are both P2 - can be added incrementally
- US5 (P3) is optional enhancement
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
