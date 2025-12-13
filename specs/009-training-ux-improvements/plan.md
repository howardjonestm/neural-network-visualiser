# Implementation Plan: Training UX Improvements

**Branch**: `009-training-ux-improvements` | **Date**: 2025-12-13 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/009-training-ux-improvements/spec.md`

## Summary

Comprehensive UX improvements to simplify training controls, synchronize visualizations with training steps, and enhance the overall learning experience. Key changes include: combining Play/Reset buttons horizontally, moving math explanations into each training step, removing redundant controls and messages, adding signal flow animations, and prominently displaying predictions.

## Technical Context

**Language/Version**: TypeScript 5.9+
**Primary Dependencies**: D3.js v7.9, Vite v7.2 (build tooling)
**Storage**: N/A (client-side only, localStorage for hint dismissal)
**Testing**: Manual validation via quickstart checklist (no automated test suite)
**Target Platform**: Modern browsers (Chrome, Firefox, Safari, Edge - latest 2 versions)
**Project Type**: Single web application (static SPA)
**Performance Goals**: 30fps minimum during animations, initial render <1s
**Constraints**: <500KB gzipped bundle, offline-capable once loaded, no backend
**Scale/Scope**: Single-page tutorial application, ~15 source files affected

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Requirement | This Feature | Status |
|-----------|-------------|--------------|--------|
| I. Visual-First Design | Prioritize visual over text | Adds synchronized animations for each training concept; signal flow visualization | ✅ PASS |
| II. Educational Clarity | Every visual maps to NN concept | Animations show forward pass, loss, backprop; prediction overlays on neurons | ✅ PASS |
| III. Static Deployment | No server dependencies | Pure client-side changes, localStorage only | ✅ PASS |
| IV. Progressive Disclosure | Simple to complex layering | Math hidden in expandable sections per step; calculations collapsible | ✅ PASS |
| V. Interactivity | Users can interact, not just observe | Hints encourage interaction; maintains play/pause/reset controls | ✅ PASS |

**Technical Constraints Check:**
- Deployment: Static files only ✅
- Bundle size: Changes are code simplification, no new heavy deps ✅
- Browser support: Standard CSS/JS features ✅
- Performance: Animations use GPU-accelerated properties ✅

**Accessibility Check:**
- Keyboard navigation: Maintained for all controls ✅
- Color contrast: Existing system unchanged ✅
- Reduced motion: Existing `prefers-reduced-motion` support ✅

**Gate Result: ✅ PASS - No violations**

## Project Structure

### Documentation (this feature)

```text
specs/009-training-ux-improvements/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
└── tasks.md             # Phase 2 output (via /speckit.tasks)
```

### Source Code (repository root)

```text
src/
├── controls/
│   ├── playback.ts      # Modify: horizontal layout, remove titles
│   ├── parameters.ts    # Modify: ensure hidden by default
│   └── reset.ts         # Modify: horizontal layout, remove title
├── demo/
│   ├── animation.ts     # Existing animation utilities
│   └── controls.ts      # Modify: remove speed/step controls, collapsible calcs
├── education/
│   └── content.ts       # Modify: reorganize math content per training step
├── tutorial/
│   ├── sections/
│   │   ├── training.ts  # Modify: auto-trigger animations, contextual math
│   │   ├── tour.ts      # Modify: remove messages/buttons, signal animation
│   │   └── inference.ts # Modify: simplify controls, prominent prediction
│   └── state.ts         # May modify: hint dismissal state
├── visualisation/
│   ├── renderer.ts      # Modify: signal flow animation, prediction overlay
│   └── layout.ts        # Existing layout utilities
├── styles.css           # Modify: horizontal buttons, new animation styles
├── main.ts              # Entry point (minor changes if any)
└── index.html           # Template (no changes expected)
```

**Structure Decision**: Single web application structure. All modifications are to existing files in the established codebase. No new directories or major architectural changes required.

## Complexity Tracking

> No constitution violations - this section is empty.

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| (none) | - | - |
