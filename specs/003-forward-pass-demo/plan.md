# Implementation Plan: Visual Forward Pass Demonstration

**Branch**: `003-forward-pass-demo` | **Date**: 2025-12-09 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/003-forward-pass-demo/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Add an interactive demonstration mode that visually shows how input data propagates through the neural network layer by layer. Users can watch a traveling pulse/dot signal move from input neurons through hidden layers to output, with mathematical calculations displayed in a dedicated panel. Supports both auto-play (1s/2s/3s per layer speeds) and step-through modes with Next/Previous navigation.

## Technical Context

**Language/Version**: TypeScript 5.9 (ES2020 target)
**Primary Dependencies**: D3.js 7.9, Vite 7.2
**Storage**: N/A (client-side only)
**Testing**: Vitest 4.0
**Target Platform**: Modern browsers (Chrome, Firefox, Safari, Edge latest 2 versions)
**Project Type**: Single static web application
**Performance Goals**: 30fps minimum during animation; <100ms main thread blocking
**Constraints**: <500KB gzipped bundle; GitHub Pages static hosting; offline-capable
**Scale/Scope**: 5-layer network (12 neurons, 28 weights); 4 XOR inputs

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Evidence |
|-----------|--------|----------|
| I. Visual-First Design | ✅ PASS | Core feature is animated signal visualization; math panel supports visuals |
| II. Educational Clarity | ✅ PASS | Every animation element maps to forward propagation concepts |
| III. Static Deployment | ✅ PASS | Client-side only; no server dependencies; existing D3.js stack |
| IV. Progressive Disclosure | ✅ PASS | Auto-play for beginners; step-through + math for advanced users |
| V. Interactivity | ✅ PASS | Input selection, step controls, pause/resume, speed adjustment |

| Constraint | Status | Evidence |
|------------|--------|----------|
| GitHub Pages static hosting | ✅ PASS | No new server-side requirements |
| <500KB gzipped bundle | ✅ PASS | Extends existing codebase; no new dependencies |
| 30fps animation | ✅ PASS | Uses existing D3 animation patterns; timing-based transitions |
| Keyboard navigation | ✅ PASS | FR-021 requires D, N, Escape shortcuts |
| Desktop 1024px+ | ✅ PASS | Calculation panel positioned beside/below network |

## Project Structure

### Documentation (this feature)

```text
specs/003-forward-pass-demo/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command)
```

### Source Code (repository root)

```text
src/
├── network/
│   ├── types.ts         # Existing: Neuron, Layer, Weight, Network types
│   ├── network.ts       # Existing: Network creation and utilities
│   ├── training.ts      # Existing: forwardPass(), backwardPass()
│   ├── neuron.ts        # Existing: sigmoid activation
│   └── layer.ts         # Existing: layer creation
├── visualisation/
│   ├── renderer.ts      # Existing: SVG rendering
│   ├── layout.ts        # Existing: position calculations
│   ├── animation.ts     # Existing: animateWeights(), animateNeurons()
│   └── tooltip.ts       # Existing: hover tooltips
├── controls/
│   ├── playback.ts      # Existing: Step, Play controls
│   ├── parameters.ts    # Existing: Learning rate slider
│   └── reset.ts         # Existing: Reset button
├── education/
│   ├── types.ts         # Existing: Hint, LegendItem types
│   ├── content.ts       # Existing: Static content
│   ├── legend.ts        # Existing: Legend component
│   ├── hints.ts         # Existing: HintManager
│   └── resources.ts     # Existing: Resources panel
├── demo/                # NEW: Forward pass demo module
│   ├── types.ts         # DemoState, DemoStep, DemoSpeed types
│   ├── state.ts         # Demo state machine management
│   ├── calculator.ts    # Generate DemoStep calculations
│   ├── animation.ts     # Pulse/dot signal animation
│   ├── controls.ts      # Demo button, input selector, step nav
│   └── panel.ts         # Calculation display panel
├── styles.css           # Extend with demo styles
├── index.html           # Add demo containers
└── main.ts              # Wire demo module

tests/
└── unit/
    ├── network.test.ts  # Existing tests
    └── demo.test.ts     # NEW: Demo calculation tests
```

**Structure Decision**: Single project structure. New `src/demo/` module for all forward pass demonstration functionality, following existing patterns from `src/education/` and `src/controls/`.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

No violations. All constitution principles and constraints are satisfied.
