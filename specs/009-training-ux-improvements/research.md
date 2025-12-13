# Research: Training UX Improvements

**Feature**: 009-training-ux-improvements
**Date**: 2025-12-13

## Research Tasks

### RT-001: Signal Flow Animation Approach

**Question**: Should signal flow animation be continuous or pulse periodically?

**Research**:
- Continuous animation can be distracting during training when weight changes are the focus
- Periodic pulses (every 2-3 seconds) provide visual interest without overwhelming
- Best practice from educational visualizations: use subtle, slow animations for ambient state indication
- D3.js supports both approaches equally well

**Decision**: Periodic pulse animation (every 3 seconds)
**Rationale**: Provides visual engagement without competing with weight change animations during training. The pulse serves as an ambient reminder that the network is "alive" without demanding attention.
**Alternatives Considered**:
- Continuous flow: Rejected - too distracting, competes with weight animations
- On-demand only: Rejected - loses the ambient "alive" feeling

---

### RT-002: Interaction Hint Persistence

**Question**: Should interaction hints show once per session or once ever?

**Research**:
- Session-based: User sees hint each visit, may become annoying for repeat visitors
- Permanent dismissal: One-time hint, but new users after clearing localStorage miss it
- Common pattern: Show hint 2-3 times with increasing delay, then stop permanently
- localStorage has ~5MB limit, storing a simple flag is negligible

**Decision**: Show once per browser (permanent dismissal via localStorage)
**Rationale**: Repeat visitors have already learned the interaction model. First-time users get the hint exactly when needed. localStorage persistence survives page refreshes within same browser.
**Alternatives Considered**:
- Session-based: Rejected - annoying for regular users
- Count-based (show 3 times): Rejected - unnecessary complexity for this use case

---

### RT-003: Mobile Math Display

**Question**: For mobile, should we keep expandable math or show it inline?

**Research**:
- Mobile viewport is constrained, expandable sections work well
- Inline math on mobile can cause horizontal scrolling with formulas
- `<details>` element is touch-friendly and has native browser support
- Constitution allows "limited functionality on mobile" (MAY tier)

**Decision**: Keep expandable `<details>` on mobile
**Rationale**: Maintains consistency across viewports, prevents horizontal scroll issues, and expandable sections are touch-friendly. Users who want math can tap to expand.
**Alternatives Considered**:
- Inline math: Rejected - causes layout issues with formulas
- Hide math entirely on mobile: Rejected - limits educational value unnecessarily

---

### RT-004: Animation Trigger Mechanism

**Question**: How to detect when user navigates to each training step?

**Research**:
- Current implementation uses step navigation buttons (Next/Previous)
- Could use Intersection Observer API for scroll-based detection
- Step state already tracked in tutorial state management
- Existing `animateForwardPass`, `animateLossHighlight`, `animateBackpropagation` functions in renderer.ts

**Decision**: Hook into existing step navigation state changes
**Rationale**: The training steps are navigated via explicit button clicks (Next/Previous within Understanding Training). When step state changes, trigger corresponding animation. This is more reliable than scroll-based detection.
**Implementation**:
```typescript
// In training.ts, when step changes:
switch (currentStep) {
  case 'forward-pass':
    renderer.animateForwardPass();
    break;
  case 'calculate-loss':
    renderer.animateLossHighlight();
    break;
  case 'backpropagation':
    renderer.animateBackpropagation();
    break;
}
```
**Alternatives Considered**:
- Intersection Observer: Rejected - training steps use button navigation, not scroll
- Manual trigger button: Rejected - spec requires automatic triggering

---

### RT-005: Horizontal Button Layout Best Practices

**Question**: Best approach for horizontal Play/Reset button layout?

**Research**:
- CSS Flexbox with `gap` property is well-supported
- Equal-width buttons achieved with `flex: 1`
- Blue background for primary actions is consistent with existing `--control-active` variable
- Existing `.button-group` class already uses flexbox

**Decision**: Extend existing `.button-group` pattern with equal-width styling
**Rationale**: Consistent with existing codebase patterns, minimal CSS additions needed.
**Implementation**:
```css
.training-controls-inline {
  display: flex;
  gap: 0.5rem;
}
.training-controls-inline .control-btn {
  flex: 1;
  background-color: var(--control-active);
  color: white;
  border-color: var(--control-active);
}
```

---

### RT-006: Prediction Overlay on Network Visualization

**Question**: How to display predicted value on/near output neuron?

**Research**:
- D3.js can append SVG text elements positioned relative to neurons
- Output neuron position is known from layout calculations
- Need to avoid overlapping with existing neuron labels
- Color coding (green/red) should match prediction correctness

**Decision**: Add SVG text element above output neuron showing predicted class
**Rationale**: Direct visual association between network output and prediction. Text positioned above neuron to avoid overlap with activation display inside neuron.
**Implementation**:
```typescript
// In renderer.ts, new method:
showPredictionOverlay(predicted: number, expected: number): void {
  const outputNeuronPos = this.getOutputNeuronPosition();
  const isCorrect = Math.round(predicted) === expected;

  this.svg.append('text')
    .attr('class', `prediction-overlay ${isCorrect ? 'correct' : 'incorrect'}`)
    .attr('x', outputNeuronPos.x)
    .attr('y', outputNeuronPos.y - 40)
    .attr('text-anchor', 'middle')
    .text(`Predicted: ${predicted.toFixed(2)}`);
}
```

---

### RT-007: Collapsible Calculations Implementation

**Question**: Best approach for collapsible calculations section?

**Research**:
- Native HTML `<details>` and `<summary>` elements are accessible and keyboard-navigable
- No JavaScript required for basic expand/collapse
- Can style with CSS to match existing design system
- Already used in parameters.ts for advanced settings

**Decision**: Use native `<details>` element with styled `<summary>`
**Rationale**: Accessible by default, keyboard navigable, consistent with existing advanced settings pattern, zero JavaScript overhead.
**Implementation**:
```html
<details class="calculations-panel">
  <summary>View Calculations</summary>
  <div class="calculation-content">
    <!-- calculation details -->
  </div>
</details>
```

---

## Technology Decisions Summary

| Area | Decision | Confidence |
|------|----------|------------|
| Signal flow animation | Periodic pulse every 3s | High |
| Hint persistence | localStorage, permanent dismissal | High |
| Mobile math | Keep expandable `<details>` | High |
| Animation trigger | Hook into step state changes | High |
| Horizontal buttons | Flexbox with equal widths | High |
| Prediction overlay | SVG text above output neuron | High |
| Collapsible calcs | Native `<details>` element | High |

## Dependencies Confirmed

- **D3.js v7.9**: Already in use, no changes needed
- **localStorage API**: Browser-native, widely supported
- **CSS Flexbox**: Widely supported in target browsers
- **HTML `<details>` element**: Supported in all target browsers
- **Intersection Observer**: Not needed (using state-based triggers)

## Risks and Mitigations

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Animation performance on low-end devices | Low | Medium | Use GPU-accelerated properties, respect prefers-reduced-motion |
| localStorage unavailable (private browsing) | Low | Low | Graceful fallback - show hint anyway |
| Step animation conflicts with training | Medium | Low | Cancel existing animations before starting new ones (already implemented) |

## Open Items Resolved

All three open questions from spec.md have been resolved:

1. ✅ Signal flow: Periodic pulse (3s interval)
2. ✅ Hint persistence: Once per browser (localStorage)
3. ✅ Mobile math: Keep expandable
