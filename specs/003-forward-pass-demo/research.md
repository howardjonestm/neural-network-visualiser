# Research: Visual Forward Pass Demonstration

**Feature**: 003-forward-pass-demo
**Date**: 2025-12-09
**Status**: Complete

## Research Topics

### 1. Traveling Pulse Animation with D3.js

**Decision**: Use D3 transition with custom tween along SVG path

**Rationale**: D3's transition API with `attrTween` allows smooth interpolation along weight line paths. This approach:
- Leverages existing D3.js dependency (no new libraries)
- Provides precise control over animation timing
- Works well with SVG coordinate system already in use
- Supports pause/resume via transition interruption

**Alternatives Considered**:
- CSS animations: Rejected - less control over path following, harder to sync with step-through
- requestAnimationFrame manual: Rejected - more code, D3 abstracts this well
- GSAP library: Rejected - adds ~30KB to bundle, overkill for this use case

**Implementation Pattern**:
```typescript
// Create pulse element at start position
const pulse = svg.append('circle').attr('r', 6).attr('class', 'demo-pulse');

// Animate along weight path
pulse.transition()
  .duration(layerDuration)
  .ease(d3.easeLinear)
  .attrTween('transform', () => {
    return (t: number) => {
      const x = x1 + (x2 - x1) * t;
      const y = y1 + (y2 - y1) * t;
      return `translate(${x}, ${y})`;
    };
  });
```

### 2. State Machine for Demo Modes

**Decision**: Finite state machine with explicit transitions

**Rationale**: Demo has four distinct states (idle, running, paused, step-through) with well-defined transitions. A state machine:
- Prevents invalid state combinations
- Makes transition logic explicit
- Simplifies control button enable/disable logic
- Easy to test individual states

**Alternatives Considered**:
- Boolean flags: Rejected - leads to invalid combinations (isRunning && isPaused)
- Redux-style reducer: Rejected - overkill for single-component state
- Observable streams: Rejected - adds complexity without benefit here

**State Transitions**:
```
idle -> running (click Demo/Auto)
idle -> step-through (click Next)
running -> paused (click Pause)
paused -> running (click Resume)
paused -> idle (click Cancel/Escape)
step-through -> idle (complete or Cancel)
running -> idle (animation complete)
```

### 3. Calculation Display Formatting

**Decision**: Pre-computed DemoStep objects with formatted strings

**Rationale**: Generate calculation strings during forward pass capture, not during rendering. This:
- Separates calculation logic from display logic
- Ensures numbers match actual network values
- Enables testing of formatting independent of animation
- Supports 3 decimal places per SC-006

**Format Specification**:
```
Weighted Sum: a₁×w₁ + a₂×w₂ + ... + b = sum
Example: 0.500 × 1.234 + 0.300 × -0.567 + 0.100 = 0.547

Activation: σ(sum) = result
Example: σ(0.547) = 0.633
```

**Alternatives Considered**:
- LaTeX/MathJax rendering: Rejected - adds large dependency, slow rendering
- Canvas text: Rejected - harder to style, accessibility issues
- Unicode math symbols only: Selected - lightweight, accessible, readable

### 4. Integration with Training Controls

**Decision**: Pause training on demo start; restore state on demo end

**Rationale**: Training and demo both mutate network activations. Running simultaneously would:
- Cause confusing visual conflicts
- Make demo calculations incorrect
- Overwhelm users with too much happening

**Implementation**:
- Demo start: If `trainingConfig.isPlaying`, call pause handler, set `demoInterruptedTraining = true`
- Demo end: If `demoInterruptedTraining`, restore training state
- Demo start: Disable Step/Play/Reset buttons via CSS class
- Demo end: Re-enable controls

### 5. Keyboard Shortcuts Implementation

**Decision**: Global keydown listener with demo-aware context

**Rationale**: FR-021 requires D, N, Escape shortcuts. Global listener:
- Works regardless of focus position
- Consistent with existing keyboard hints pattern
- Can check demo state before acting

**Key Mappings**:
- `D` or `d`: Start demo (only if idle)
- `N` or `n`: Next step (only if step-through mode)
- `P` or `p`: Previous step (only if step-through mode)
- `Escape`: Cancel demo (any demo state)
- `Space`: Pause/Resume (only if running)

**Conflict Handling**:
- Do not capture if focus is on input element (unlikely in this app)
- Existing training shortcuts remain active when demo is idle

### 6. Responsive Panel Placement

**Decision**: Calculation panel below network on narrow screens, beside on wide

**Rationale**: Constitution requires 1024px+ desktop support. Calculation panel needs space for formulas without obscuring network.

**Layout Strategy**:
- Desktop (≥1024px): Panel in right sidebar, below controls
- Tablet/narrow: Panel below visualization, full width
- Use CSS grid area adjustment, same as existing controls-container

## Dependencies Confirmed

| Dependency | Version | Purpose |
|------------|---------|---------|
| D3.js | 7.9 | Animation, DOM manipulation |
| TypeScript | 5.9 | Type safety |
| Vite | 7.2 | Build tooling |
| Vitest | 4.0 | Unit testing |

No new dependencies required.

## Integration Points

| Existing Module | Integration Needed |
|-----------------|-------------------|
| `src/network/training.ts` | Reuse `forwardPass()` to capture activations |
| `src/network/types.ts` | Import `Network`, `XOR_DATA` types |
| `src/visualisation/renderer.ts` | Add pulse elements to SVG |
| `src/visualisation/layout.ts` | Get neuron/weight positions for animation |
| `src/controls/playback.ts` | Disable during demo; coordinate pause state |
| `src/main.ts` | Wire DemoController, add keyboard listener |
| `src/styles.css` | Add `.demo-*` class styles |
| `src/index.html` | Add calculation panel container |

## Open Questions Resolved

All NEEDS CLARIFICATION items from spec have been resolved via clarification session:
- Signal form: Traveling pulse/dot ✓
- Step granularity: Per-layer ✓
- Timing: 2s/layer default ✓
- Calculation display: Dedicated panel ✓
