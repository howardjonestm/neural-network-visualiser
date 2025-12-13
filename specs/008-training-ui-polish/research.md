# Research: Training UI Polish & Visual Enhancements

**Feature**: 008-training-ui-polish
**Date**: 2025-12-13

## Research Tasks

This feature involves UI/CSS modifications and animation enhancements. No external dependencies or complex technical decisions require extensive research. Key implementation patterns are documented below.

---

### 1. CSS Grid Layout Proportions (FR-001, FR-003)

**Decision**: Use CSS Grid with `1fr 1.5fr` column template for 40%/60% split

**Rationale**:
- Current scrollytelling layout uses `grid-template-columns: 1fr 1fr` (50/50 split)
- Changing to `1fr 1.5fr` achieves approximately 40% left panel, 60% visualization
- CSS Grid is already in use, so no new layout system needed
- Maintains responsive behavior for smaller screens

**Alternatives Considered**:
- Flexbox with percentage widths: More verbose, less semantic
- Fixed pixel widths: Not responsive, rejected

---

### 2. Floating Card Effect (FR-002)

**Decision**: Use `box-shadow` with multiple layers and slight scale transform

**Rationale**:
- Multiple shadow layers create depth perception (near shadow + ambient shadow)
- CSS: `box-shadow: 0 4px 6px rgba(0,0,0,0.1), 0 10px 20px rgba(0,0,0,0.15)`
- Optional subtle `transform: translateY(-2px)` for "lifted" appearance
- Existing `.viz-container` already has `box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1)`
- Enhancement adds secondary shadow layer for more depth

**Alternatives Considered**:
- Border with gradient: Less natural depth perception
- CSS `filter: drop-shadow()`: Higher GPU usage, not needed

---

### 3. Neuron Firing Animation (FR-005)

**Decision**: Sequential CSS class application with D3 transitions and opacity/scale changes

**Rationale**:
- Existing codebase uses D3 for SVG manipulation
- Animation approach: Add `.neuron-firing` class sequentially per layer
- CSS handles visual effect: `transform: scale(1.15); filter: brightness(1.3)`
- D3 `transition().delay()` chains layer-by-layer animation
- Duration: 2-3 seconds total (per clarification), ~500ms per layer for 5-layer network

**Implementation Pattern**:
```typescript
// Pseudocode
layers.forEach((layer, index) => {
  d3.selectAll(`.layer-${index} .neuron`)
    .transition()
    .delay(index * 500)
    .duration(300)
    .attr('class', 'neuron neuron-firing')
    .transition()
    .duration(200)
    .attr('class', 'neuron');
});
```

**Alternatives Considered**:
- Canvas animation: Would require rewrite, existing SVG works well
- requestAnimationFrame manual: More complex, D3 handles this

---

### 4. Backpropagation Animation (FR-007)

**Decision**: Reverse layer-by-layer weight pulse animation

**Rationale**:
- Animate from output layer backward to input layer
- Weight lines pulse in sequence (brightness/stroke-width animation)
- Conveys "error flowing backward" conceptually
- CSS: `.weight-backprop { stroke-width: +2; filter: brightness(1.2); }`
- Same timing pattern as forward pass but reversed order

**Alternatives Considered**:
- Particle animation along weights: Too complex for educational clarity
- Color gradient sweep: Harder to see on thin lines

---

### 5. Pulsating Trained Weights (FR-012)

**Decision**: CSS `@keyframes` animation on weight lines when trained

**Rationale**:
- Pure CSS animation for performance (GPU-accelerated)
- Subtle opacity pulse: 1.0 → 0.7 → 1.0 over 2 seconds
- Applied via class `.weights-pulsating` on SVG container
- CSS handles selection: `.weights-pulsating .weight-line { animation: pulse 2s infinite; }`

**CSS Pattern**:
```css
@keyframes weight-pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}
.weights-pulsating .weight-line {
  animation: weight-pulse 2s ease-in-out infinite;
}
```

**Alternatives Considered**:
- JavaScript-driven animation: Higher CPU, unnecessary
- Stroke-width animation: Can distort layout

---

### 6. Input Value Overlay on Neurons (FR-014)

**Decision**: SVG `<text>` elements positioned over input neurons

**Rationale**:
- Existing demo already has `showInputValues()` function in `src/demo/animation.ts`
- Uses D3 to append `<text>` elements at neuron center positions
- CSS: `.input-value-label { font-weight: bold; fill: white; text-anchor: middle; }`
- Values positioned with `dominant-baseline: middle` for vertical centering

**Existing Code Reference**: `src/demo/animation.ts:showInputValues()` - already implemented

---

### 7. Prominent Prediction Display (FR-015)

**Decision**: Dedicated prediction result card below the demo controls

**Rationale**:
- Current prediction is only shown in calculations panel (too hidden)
- Add prominent card with large font: `font-size: 2rem; font-weight: bold`
- Show both expected and predicted with color coding
- Green for correct (within threshold), red for incorrect
- Layout: Side-by-side comparison boxes

**UI Pattern**:
```html
<div class="prediction-result-card">
  <div class="expected-box">
    <label>Expected</label>
    <span class="value">1</span>
  </div>
  <div class="vs">vs</div>
  <div class="predicted-box">
    <label>Predicted</label>
    <span class="value correct">0.97</span>
  </div>
</div>
```

---

### 8. Mathematical Notation Rendering (FR-017, FR-018)

**Decision**: HTML/CSS with Unicode characters and subscript/superscript tags

**Rationale**:
- No external math rendering library needed (MathJax/KaTeX would bloat bundle)
- Unicode provides sufficient symbols: σ (sigma), η (eta), Σ (summation), ∂ (partial)
- HTML `<sub>` and `<sup>` for subscripts/superscripts
- CSS styling: `font-family: 'Times New Roman', serif; font-style: italic`
- Fractions rendered with stacked divs and borders

**Example**:
```html
<div class="formula">
  σ(z) = <span class="fraction">
    <span class="numerator">1</span>
    <span class="denominator">1 + e<sup>−z</sup></span>
  </span>
</div>
```

**Alternatives Considered**:
- MathJax/KaTeX: Adds 100KB+ to bundle, overkill for 3 formulas
- SVG math: Complex to maintain

---

### 9. Training State Detection Fix (FR-011)

**Decision**: Track training iterations in state, not just completion

**Rationale**:
- Current bug: `trainingCompleted` only true when explicitly completed
- User may train partially (loss decreases) but never reach "complete"
- Solution: Add `trainingIterations: number` to state
- Trained = `trainingIterations > 0`
- This already exists partially via `stepCount` in `trainingConfig`

**Implementation**:
- Modify `TutorialStateManager` to expose training iterations
- Check `trainingConfig.stepCount > 0` as "trained" indicator
- Or add explicit `hasBeenTrained: boolean` flag set on first step

---

### 10. Learning Rate Explanation (FR-019)

**Decision**: Add dedicated section in math panel explaining η trade-offs

**Content**:
- High learning rate (η > 0.5): Fast learning but may overshoot optimal weights, oscillate
- Low learning rate (η < 0.1): Stable but slow convergence, may get stuck
- Recommended range: 0.1 - 0.5 for small networks like this XOR example
- Include simple formula: `w_new = w_old - η × gradient`

---

## Summary of Technical Decisions

| Topic | Decision | Key Rationale |
|-------|----------|---------------|
| Layout split | CSS Grid `1fr 1.5fr` | Existing pattern, responsive |
| Floating card | Multi-layer box-shadow | Pure CSS, performant |
| Neuron firing | D3 transitions + CSS classes | Existing tooling |
| Backprop animation | Reverse layer sequence | Educational clarity |
| Trained pulsation | CSS keyframes | GPU-accelerated |
| Input overlay | SVG text elements | Already implemented |
| Prediction display | Dedicated card component | High visibility |
| Math notation | Unicode + HTML tags | No bundle bloat |
| Training detection | Iteration count check | Robust state tracking |
| Learning rate docs | Math panel section | Progressive disclosure |

---

## No Outstanding Clarifications

All technical decisions are resolved. Ready for Phase 1 design.
