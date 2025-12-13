# Implementation Plan: Interactive Neural Network Training Tutorial

**Branch**: `007-nn-training-tutorial` | **Date**: 2025-12-13 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/007-nn-training-tutorial/spec.md`

## Summary

Transform the existing neural network visualiser into an interactive scroll-based tutorial that guides users through four progressive sections: (1) XOR objectives introduction, (2) guided training with animations, (3) trained network tour, and (4) inference demonstration. The implementation will restructure the current single-page app into a vertical scroll-driven experience while preserving all existing visualization, training, and demo functionality.

## Technical Context

**Language/Version**: TypeScript 5.9+
**Primary Dependencies**: D3.js v7.9, Vite v7.2 (build tooling)
**Storage**: N/A (client-side only, no persistence required)
**Testing**: Vitest
**Target Platform**: Modern browsers (Chrome, Firefox, Safari, Edge - latest 2 versions), GitHub Pages static hosting
**Project Type**: Single web application (frontend only)
**Performance Goals**: 30fps minimum during animations, <1s initial render, <100ms interaction response
**Constraints**: Static deployment (no backend), <500KB gzipped bundle, offline-capable once loaded
**Scale/Scope**: Single-page scroll-based tutorial with 4 sections

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Visual-First Design | PASS | Tutorial centers on the neural network visualization; text supports what users see |
| II. Educational Clarity | PASS | Every visual element maps to NN concepts; key terms explained contextually |
| III. Static Deployment | PASS | Remains a static site deployable to GitHub Pages; no backend |
| IV. Progressive Disclosure | PASS | Scroll-based progression reveals content layered from simple to complex; math details opt-in |
| V. Interactivity Over Passivity | PASS | Users interact via scroll (navigation) and click (training/inference triggers) |

**Technical Constraints Check**:
- Static files deployment: PASS
- Modern browser support: PASS
- <3s load time: PASS (existing bundle well under limit)
- Keyboard navigation: REQUIRES VERIFICATION (new scroll sections need keyboard support)
- WCAG AA contrast: REQUIRES VERIFICATION (new content sections)
- 30fps animation: PASS (existing animations meet this)

**No violations requiring justification.**

## Project Structure

### Documentation (this feature)

```text
specs/007-nn-training-tutorial/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output (N/A - no API contracts for this feature)
└── tasks.md             # Phase 2 output (/speckit.tasks command)
```

### Source Code (repository root)

```text
src/
├── main.ts                      # Entry point (to be refactored for tutorial flow)
├── index.html                   # Main HTML (to be restructured for scroll sections)
├── styles.css                   # Styles (to be extended for tutorial sections)
├── tutorial/                    # NEW: Tutorial-specific components
│   ├── sections/                # Section components (Objectives, Training, Tour, Inference)
│   │   ├── objectives.ts        # Section 1: XOR intro
│   │   ├── training.ts          # Section 2: Guided training
│   │   ├── tour.ts              # Section 3: Trained network tour
│   │   └── inference.ts         # Section 4: Inference demo
│   ├── scroll-manager.ts        # Scroll detection and section transitions
│   ├── progress-indicator.ts    # Visual progress indicator
│   ├── key-terms.ts             # Term definitions and contextual display
│   └── state.ts                 # Tutorial state management
├── controls/                    # Existing controls (preserved)
├── demo/                        # Existing demo (to be integrated into Section 4)
├── education/                   # Existing education components (to be integrated)
├── network/                     # Existing network logic (preserved)
└── visualisation/               # Existing visualisation (preserved)

tests/
├── unit/
│   └── tutorial/                # NEW: Tests for tutorial components
└── integration/
    └── tutorial-flow.test.ts    # NEW: End-to-end tutorial navigation tests
```

**Structure Decision**: Extend the existing single-project structure with a new `tutorial/` module. This preserves all existing functionality while adding the scroll-based tutorial layer. The existing `demo/` module will be integrated as the foundation for Section 4 (Inference).

## Complexity Tracking

No constitution violations require justification.
