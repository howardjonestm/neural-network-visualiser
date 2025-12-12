# Implementation Plan: Neural Network Visualisation

**Branch**: `001-nn-visualisation` | **Date**: 2025-12-09 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-nn-visualisation/spec.md`

## Summary

Build an interactive neural network visualisation that teaches users fundamental
concepts (neurons, layers, weights, biases) through visual demonstration. Users
observe a feedforward network training on a simple problem (XOR), watching
weights adjust in real-time. The visualisation runs entirely in-browser as a
static site deployable to GitHub Pages.

**Technical Approach**: Use D3.js for SVG-based rendering with smooth animations
and native hover/tooltip support. Implement a simple feedforward neural network
in vanilla TypeScript with backpropagation. Bundle with Vite for optimal static
deployment with tree-shaking.

## Technical Context

**Language/Version**: TypeScript 5.x (transpiled to ES2020+ JavaScript)
**Primary Dependencies**: D3.js v7 (~75KB gzipped, tree-shakeable)
**Storage**: N/A (no persistence required)
**Testing**: Vitest (unit tests for neural network logic)
**Target Platform**: Modern browsers (Chrome, Firefox, Safari, Edge - latest 2 versions)
**Project Type**: Single static web application
**Performance Goals**: 30fps animation, <3s initial load, <100ms interaction response
**Constraints**: <500KB gzipped total, client-side only, GitHub Pages compatible
**Scale/Scope**: Single page, ~20-30 neurons maximum, educational demo

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Evidence |
|-----------|--------|----------|
| I. Visual-First Design | PASS | Primary interface is the network diagram; text is minimal labels only |
| II. Educational Clarity | PASS | Every visual element maps to NN concept (neuron=circle, weight=line, etc.) |
| III. Static Deployment | PASS | No backend, no API calls, pure client-side with Vite static build |
| IV. Progressive Disclosure | PASS | Initial view shows structure; values revealed on hover; advanced math hidden |
| V. Interactivity Over Passivity | PASS | Step/play/pause/reset/learning-rate controls all implemented |

**Technical Constraints Check**:
- Bundle <500KB gzipped: PASS (D3.js ~75KB + app code ~50KB estimate = ~125KB)
- Modern browsers: PASS (ES2020 target)
- 3s load time: PASS (small bundle + no API calls)
- 30fps animation: PASS (D3.js optimized for transitions)
- Keyboard navigation: PLANNED (will implement in P2)

## Project Structure

### Documentation (this feature)

```text
specs/001-nn-visualisation/
├── plan.md              # This file
├── spec.md              # Feature specification
├── research.md          # Technology decisions
├── data-model.md        # Entity definitions
├── quickstart.md        # Developer guide
├── contracts/           # N/A (no API contracts for static site)
│   └── README.md        # Explains why no contracts needed
├── checklists/          # Quality checklists
│   └── requirements.md  # Spec quality checklist
└── tasks.md             # Implementation tasks (created by /speckit.tasks)
```

### Source Code (repository root)

```text
src/
├── network/
│   ├── neuron.ts        # Neuron class with bias, activation
│   ├── layer.ts         # Layer containing neurons
│   ├── network.ts       # Network orchestrating layers
│   ├── training.ts      # Forward/backward propagation logic
│   └── types.ts         # Shared type definitions
├── visualisation/
│   ├── renderer.ts      # D3-based SVG rendering
│   ├── animation.ts     # Weight change animations
│   ├── tooltip.ts       # Hover tooltip component
│   └── layout.ts        # Network layout calculations
├── controls/
│   ├── playback.ts      # Play/pause/step controls
│   ├── parameters.ts    # Learning rate slider
│   └── reset.ts         # Network reset functionality
├── main.ts              # Application entry point
├── styles.css           # Global styles
└── index.html           # Single page entry

tests/
├── unit/
│   ├── neuron.test.ts   # Neuron computation tests
│   ├── layer.test.ts    # Layer propagation tests
│   ├── network.test.ts  # End-to-end network tests
│   └── training.test.ts # Backpropagation tests
└── integration/
    └── visualisation.test.ts  # Rendering + interaction tests
```

**Structure Decision**: Single project structure selected. No backend required
(static site), no separate frontend (single HTML entry point). All code in
`src/` with clear module boundaries for network logic vs. visualisation.

## Complexity Tracking

> No constitution violations. Structure is minimal for requirements.

| Aspect | Decision | Rationale |
|--------|----------|-----------|
| Single project | Chosen | No backend needed; static site is simplest |
| D3.js over Konva | Chosen | Better educational resources, native SVG for accessibility |
| TypeScript | Chosen | Type safety for neural network math; compiles to JS |
| Vite bundler | Chosen | Fast dev server, optimized production builds for static hosting |
