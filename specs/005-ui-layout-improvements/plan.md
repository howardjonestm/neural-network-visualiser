# Implementation Plan: UI Layout Improvements

**Branch**: `005-ui-layout-improvements` | **Date**: 2025-12-11 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/005-ui-layout-improvements/spec.md`

## Summary

Clean up the UI by removing unused panels (Legend, Resources, "How this relates to AI"), reorganizing controls (training left, run network right), moving title to top-left, and enhancing neuron visualization with intensity-based coloring. Additionally, display weight/bias values on hover with educational explanations.

## Technical Context

**Language/Version**: TypeScript 5.9 with Vite 7.2
**Primary Dependencies**: D3.js v7.9.0 (visualization library)
**Storage**: N/A (client-side only, no persistence)
**Testing**: Vitest 4.0.15 (unit tests)
**Target Platform**: Modern browsers (Chrome, Firefox, Safari, Edge latest 2 versions)
**Project Type**: Single project (static web application)
**Performance Goals**: 30fps minimum during training, <1s initial render, <100ms interaction blocking
**Constraints**: Static deployment (GitHub Pages), <500KB gzipped bundle, offline-capable
**Scale/Scope**: Single-page educational visualization tool

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Visual-First Design | ✅ PASS | Neuron intensity visualization enhances visual understanding; weight/bias tooltips support visual elements |
| II. Educational Clarity | ✅ PASS | All changes improve educational value - clearer controls, better neuron visualization, weight/bias explanations |
| III. Static Deployment | ✅ PASS | No server-side dependencies added; all changes are CSS/JS |
| IV. Progressive Disclosure | ✅ PASS | Weight/bias details shown on hover (not always visible); controls reorganized for clarity |
| V. Interactivity Over Passivity | ✅ PASS | Hover interactions for weights/biases; improved control organization |
| Accessibility | ✅ PASS | Must maintain keyboard navigation; WCAG AA color contrast for neuron intensity |
| Performance | ✅ PASS | CSS-based intensity changes; no heavy computation added |

**Pre-Design Gate: PASSED** - All constitution principles satisfied.

## Project Structure

### Documentation (this feature)

```text
specs/005-ui-layout-improvements/
├── plan.md              # This file
├── research.md          # Phase 0: Layout patterns, color systems
├── data-model.md        # Phase 1: Entity definitions
├── quickstart.md        # Phase 1: Testing guide
└── tasks.md             # Phase 2 output (/speckit.tasks command)
```

### Source Code (repository root)

```text
src/
├── network/
│   └── types.ts           # Neuron, Weight, Layer types
├── visualisation/
│   ├── renderer.ts        # NetworkRenderer - neuron/weight rendering (MODIFY)
│   ├── layout.ts          # Position calculations (MODIFY for neuron styling)
│   ├── tooltip.ts         # Tooltip class (MODIFY for weight/bias info)
│   └── weight-delta.ts    # Weight change tracking (existing)
├── controls/
│   ├── playback.ts        # Training playback controls
│   ├── parameters.ts      # Learning rate controls
│   └── reset.ts           # Reset button
├── education/
│   ├── legend.ts          # Legend component (REMOVE usage)
│   ├── resources.ts       # Resources panel (REMOVE usage)
│   └── activation-tooltip.ts  # Activation function tooltip (existing)
├── demo/
│   └── panel.ts           # Demo controls (RENAME section)
├── index.html             # HTML structure (MODIFY layout)
├── styles.css             # Styles (MODIFY for layout, neuron intensity)
└── main.ts                # App initialization (MODIFY control wiring)

tests/
└── unit/
    ├── neuron.test.ts
    ├── training.test.ts
    └── ...
```

**Structure Decision**: Single project structure maintained. Changes primarily affect:
1. `src/index.html` - Layout restructuring
2. `src/styles.css` - Control positioning, neuron intensity styles
3. `src/main.ts` - Remove Legend/Resources initialization
4. `src/visualisation/renderer.ts` - Neuron fill based on activation
5. `src/visualisation/tooltip.ts` - Weight/bias educational content

## Complexity Tracking

> No violations - all changes align with existing architecture and constitution.

## Post-Design Constitution Re-Check

*Re-evaluated after Phase 1 design completion.*

| Principle | Status | Post-Design Notes |
|-----------|--------|-------------------|
| I. Visual-First Design | ✅ PASS | HSL-based neuron intensity directly visualizes activation values; no text-only additions |
| II. Educational Clarity | ✅ PASS | Tooltip explanations map directly to visual elements (weights/biases); section labels clarify purpose |
| III. Static Deployment | ✅ PASS | Design uses only CSS/JS; no external dependencies or API calls introduced |
| IV. Progressive Disclosure | ✅ PASS | Explanations appear on hover (not default view); layout simplification reduces cognitive load |
| V. Interactivity Over Passivity | ✅ PASS | Existing hover/click interactions maintained; no passive-only features added |
| Accessibility | ✅ PASS | HSL color range (25%-85% lightness) maintains WCAG AA contrast; keyboard nav preserved |
| Performance | ✅ PASS | No new computations in render loop; CSS handles color transitions |

**Post-Design Gate: PASSED** - Design maintains all constitution principles.

## Generated Artifacts

| Artifact | Path | Status |
|----------|------|--------|
| Research | `specs/005-ui-layout-improvements/research.md` | Complete |
| Data Model | `specs/005-ui-layout-improvements/data-model.md` | Complete |
| Quickstart | `specs/005-ui-layout-improvements/quickstart.md` | Complete |
| Agent Context | `CLAUDE.md` | Updated |

## Next Steps

Run `/speckit.tasks` to generate the implementation task list.
