# Implementation Plan: Educational Enhancements

**Branch**: `002-educational-enhancements` | **Date**: 2025-12-09 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/002-educational-enhancements/spec.md`

## Summary

Enhance the existing neural network visualiser with comprehensive educational content: persistent component explanations (legend, tooltips), a deeper network architecture (5+ layers), contextual learning through inline hints that appear during user interactions, content connecting the demo to real-world AI systems like LLMs, and external learning resources. The implementation extends the existing TypeScript/D3.js/Vite stack with new UI components for explanations and a restructured network architecture.

## Technical Context

**Language/Version**: TypeScript 5.x (existing)
**Primary Dependencies**: D3.js v7 (existing), Vite (existing)
**Storage**: Browser localStorage for persisting dismissed hint states
**Testing**: Vitest (existing)
**Target Platform**: Modern browsers (Chrome, Firefox, Safari, Edge - latest 2 versions)
**Project Type**: Single web application (static site)
**Performance Goals**: 30fps animation during training, <3s initial load
**Constraints**: <500KB gzipped bundle, desktop-first (1024px+), GitHub Pages deployment
**Scale/Scope**: Single-page educational visualiser, ~15 UI components

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Requirement | Status | Notes |
|-----------|-------------|--------|-------|
| I. Visual-First Design | Visual representation over text | ✅ PASS | Legend and hints support the visualisation, not replace it |
| II. Educational Clarity | Every element teaches a concept | ✅ PASS | All new components explain existing visual elements |
| III. Static Deployment | No server-side dependencies | ✅ PASS | localStorage only, no backend required |
| IV. Progressive Disclosure | Simple to complex layering | ✅ PASS | Inline hints are non-blocking, dismissible |
| V. Interactivity Over Passivity | User interaction required | ✅ PASS | Hints appear on interaction, resources are clickable |

**Technical Constraints Check:**
- ✅ Static files only (GitHub Pages compatible)
- ✅ Bundle size manageable (current ~20KB, new content is mostly text)
- ✅ 30fps maintained (no heavy computation added)
- ✅ Keyboard navigation preserved

**Gate Result: PASS** - Proceed to Phase 0

## Project Structure

### Documentation (this feature)

```text
specs/002-educational-enhancements/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
└── tasks.md             # Phase 2 output (from /speckit.tasks)
```

### Source Code (repository root)

```text
src/
├── network/
│   ├── types.ts              # Extended for deeper architecture
│   ├── neuron.ts             # Existing
│   ├── layer.ts              # Existing
│   ├── network.ts            # Modified for 5-layer architecture
│   └── training.ts           # Existing
├── visualisation/
│   ├── layout.ts             # Modified for deeper network layout
│   ├── renderer.ts           # Modified for layer annotations
│   ├── tooltip.ts            # Existing
│   └── animation.ts          # Existing
├── controls/
│   ├── playback.ts           # Existing
│   ├── parameters.ts         # Existing
│   └── reset.ts              # Existing
├── education/                # NEW - Educational content module
│   ├── content.ts            # Static educational text content
│   ├── legend.ts             # Visual legend component
│   ├── hints.ts              # Inline hint/callout system
│   ├── loss-indicator.ts     # Loss trend explanation
│   └── resources.ts          # External learning links
├── main.ts                   # Extended to wire new components
├── index.html                # Updated layout for legend/resources
└── styles.css                # Extended for new components

tests/unit/
├── neuron.test.ts            # Existing
├── network.test.ts           # Extended for deeper architecture
├── training.test.ts          # Existing
└── education.test.ts         # NEW - Tests for hint system
```

**Structure Decision**: Extend existing single-project structure with new `src/education/` module for all educational content components. This keeps educational concerns separated from core network logic while maintaining the simple flat structure.

## Complexity Tracking

No constitution violations requiring justification. All additions support existing principles.

## Post-Design Constitution Re-Check

*Verified after Phase 1 design completion*

| Principle | Status | Verification |
|-----------|--------|--------------|
| I. Visual-First Design | ✅ PASS | Legend uses visual samples; hints point to visual elements |
| II. Educational Clarity | ✅ PASS | Each legend item and hint explains a network concept |
| III. Static Deployment | ✅ PASS | Only localStorage used; no external APIs |
| IV. Progressive Disclosure | ✅ PASS | Hints are dismissible; legend is collapsible; resources in separate panel |
| V. Interactivity | ✅ PASS | Hints respond to user actions; resources are clickable links |

**Technical Constraints:**
- ✅ Static deployment: No server dependencies added
- ✅ Bundle size: Text content adds minimal weight
- ✅ Performance: No heavy computation in educational components
- ✅ Accessibility: Keyboard navigation preserved for new elements

**Final Gate Result: PASS** - Ready for task generation
