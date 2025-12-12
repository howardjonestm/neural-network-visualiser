# Research: Training Insights

**Date**: 2025-12-11
**Feature**: 004-training-insights

## Research Topics

### 1. D3.js Animation Best Practices for Color Transitions

**Decision**: Use D3 transitions with CSS classes for color changes, combined with opacity fade

**Rationale**:
- D3.js transitions are GPU-accelerated when using CSS properties
- Combining `.attr('class')` changes with `.transition().style('opacity')` provides smooth visual feedback
- Using CSS classes (`.weight-increase`, `.weight-decrease`) allows easy theming and consistent styling
- 500ms duration aligns with Material Design motion guidelines for "emphasized" transitions

**Alternatives considered**:
- Raw CSS animations: Less control over timing relative to data updates
- requestAnimationFrame manual animation: More complex, unnecessary for this use case
- SVG filters: Higher performance cost, less browser support

**Implementation approach**:
```typescript
// After training step, apply temporary highlight class
selection
  .classed('weight-increase', d => d.delta > 0)
  .classed('weight-decrease', d => d.delta < 0)
  .transition()
  .duration(500)
  .on('end', () => selection.classed('weight-increase weight-decrease', false));
```

### 2. Weight Delta Tracking Pattern

**Decision**: Store previous weight values in a parallel data structure, compute deltas after each training step

**Rationale**:
- Minimal change to existing Weight interface (no new fields required initially)
- Allows tracking history without modifying core network types
- Clear separation between network state and visualization state
- Memory efficient: only store what's needed for visualization (last value + history)

**Alternatives considered**:
- Add `previousValue` field to Weight type: Mixes concerns, forces all code to handle extra field
- Store complete network snapshots: Memory-heavy for larger networks
- Event-based delta emission: Over-engineered for synchronous training steps

**Data structure**:
```typescript
interface WeightDeltaTracker {
  previousValues: Map<string, number>;  // weightId -> previous value
  history: Map<string, number[]>;       // weightId -> last 10 values (for P3 feature)

  captureSnapshot(weights: Weight[]): void;
  computeDeltas(weights: Weight[]): Map<string, WeightDelta>;
}
```

### 3. Tooltip Content for Activation Functions

**Decision**: Create dedicated ActivationTooltip component separate from existing Tooltip class

**Rationale**:
- Activation tooltips have significantly different content (formula, mini-graph, multiple values)
- Existing Tooltip class is simple text-based; extending it would bloat the interface
- Separate component allows for specialized rendering (SVG mini-curve)
- Easier to test in isolation

**Alternatives considered**:
- Extend existing Tooltip class: Would require complex branching and mixed responsibilities
- Use external tooltip library (Tippy.js): Adds dependency, bundle size impact
- Inline HTML in neuron hover handler: Poor separation, hard to maintain

**Content structure**:
```typescript
interface ActivationTooltipContent {
  neuronType: 'input' | 'hidden' | 'output';
  formula: string;           // "σ(x) = 1/(1+e^-x)"
  preActivation: number;     // The x value
  postActivation: number;    // The σ(x) value
  showCurve: boolean;        // False for input neurons
}
```

### 4. Mini Sigmoid Curve Visualization

**Decision**: Use inline SVG path for sigmoid curve, with marker for current position

**Rationale**:
- SVG is already used throughout the app (D3.js)
- Small curve (60x40px) renders quickly
- Pre-computed path string for sigmoid shape (doesn't need to recalculate)
- Position marker uses simple coordinate transform based on pre-activation value

**Alternatives considered**:
- Canvas rendering: Overkill for simple curve, harder to style
- Unicode/emoji representation: Not precise enough, accessibility concerns
- External charting library: Heavy dependency for simple visualization

**Implementation sketch**:
```typescript
const SIGMOID_PATH = "M0,35 C10,35 20,30 30,20 S50,5 60,5";  // Approximate sigmoid shape
const curveX = mapRange(preActivation, -6, 6, 0, 60);  // Map x to curve position
const curveY = sigmoid(preActivation) * 35;  // Map output to y position
```

### 5. Performance Considerations for Rapid Training

**Decision**: Debounce visual updates during continuous training (10+ steps/sec)

**Rationale**:
- SC-005 requires smooth visualization during rapid training
- At 10+ steps/sec, individual 500ms animations would overlap chaotically
- Debouncing ensures one visual update per ~100ms max (10fps for weight highlights)
- Final weight values are always shown; only intermediate highlights are skipped

**Alternatives considered**:
- Cancel previous animations: Complex timing logic, potential flickering
- Skip all visualization during rapid mode: Loses educational value
- Queue animations: Memory buildup, delayed feedback

**Implementation approach**:
```typescript
let lastVisualizationTime = 0;
const MIN_VISUAL_INTERVAL = 100;  // ms

function onTrainingStep() {
  const now = Date.now();
  if (now - lastVisualizationTime >= MIN_VISUAL_INTERVAL) {
    applyWeightChangeVisualization();
    lastVisualizationTime = now;
  }
  // Always update final values, just skip animation
  renderer.update();
}
```

### 6. Color Accessibility for Green/Red Scheme

**Decision**: Supplement green/red with secondary visual cues (arrow icons, brightness change)

**Rationale**:
- Constitution requires not relying solely on color (WCAG compliance)
- Green/red is intuitive for most users but problematic for colorblind users
- Adding ↑/↓ indicators or brightness shifts provides redundant encoding
- Consistent with existing app patterns (loss trend indicator uses symbols)

**Alternatives considered**:
- Switch to blue/orange only: Less intuitive for majority of users
- Add texture patterns: Visual noise, doesn't work well on thin lines
- Require user preference setting: Extra complexity, most users won't configure

**CSS approach**:
```css
.weight-increase {
  stroke: #22c55e;           /* Green */
  filter: brightness(1.3);   /* Brighter = growing */
}
.weight-decrease {
  stroke: #ef4444;           /* Red */
  filter: brightness(0.8);   /* Dimmer = shrinking */
}
```

## Summary

All research topics resolved. No blocking unknowns remain.

| Topic | Decision | Impact |
|-------|----------|--------|
| Animation | D3 transitions + CSS classes | Low risk, proven pattern |
| Delta tracking | Parallel WeightDeltaTracker | Clean separation of concerns |
| Activation tooltip | New dedicated component | Maintainable, testable |
| Mini curve | Inline SVG with pre-computed path | Lightweight, fast |
| Performance | Debounce at 100ms | Prevents animation pile-up |
| Accessibility | Color + brightness + symbols | WCAG compliant |
