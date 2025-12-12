# Quickstart: Visual Forward Pass Demonstration

**Feature**: 003-forward-pass-demo
**Date**: 2025-12-09

## Prerequisites

- Node.js 18+ installed
- Feature 002 (Educational Enhancements) completed and merged
- Working knowledge of existing codebase structure

## Setup

```bash
# Ensure you're on the feature branch
git checkout 003-forward-pass-demo

# Install dependencies (should already be installed)
npm install

# Start development server
npm run dev
```

## Implementation Order

### Phase 1: Types & State (Foundation)

1. Create `src/demo/types.ts` with all type definitions
2. Create `src/demo/state.ts` with state machine
3. Add unit tests in `tests/unit/demo.test.ts`

### Phase 2: Calculations (Core Logic)

1. Create `src/demo/calculator.ts`
2. Implement `generateDemoSteps()` using existing `forwardPass()`
3. Format calculation strings with 3 decimal precision

### Phase 3: Controls (User Interface)

1. Create `src/demo/controls.ts`
2. Add Demo button, input selector dropdown
3. Add Next/Previous/Pause buttons
4. Add speed selector

### Phase 4: Animation (Visual)

1. Create `src/demo/animation.ts`
2. Implement pulse creation and movement
3. Implement neuron highlight/dim effects
4. Integrate with existing SVG structure

### Phase 5: Panel (Display)

1. Create `src/demo/panel.ts`
2. Implement calculation display panel
3. Add step indicator (Step 2 of 5)
4. Style with CSS

### Phase 6: Integration

1. Update `src/main.ts` to wire everything
2. Update `src/index.html` with containers
3. Update `src/styles.css` with demo styles
4. Add keyboard shortcuts

## Key Files to Modify

| File | Changes |
|------|---------|
| `src/main.ts` | Import and initialize DemoController |
| `src/index.html` | Add `#demo-controls`, `#calculation-panel` containers |
| `src/styles.css` | Add `.demo-*` classes, pulse styling |
| `src/controls/playback.ts` | Expose pause handler for demo coordination |

## Key Functions to Implement

### src/demo/calculator.ts

```typescript
/**
 * Generate all DemoStep objects for a forward pass
 */
export function generateDemoSteps(network: Network, input: XORInput): DemoStep[] {
  // 1. Run forwardPass to set activations
  // 2. For each layer, collect neuron calculations
  // 3. Format formulas with actual values
  // 4. Return array of DemoStep
}

/**
 * Format a neuron's calculation as a readable string
 */
export function formatCalculation(calc: NeuronCalculation): string {
  // "0.500×1.234 + 0.300×-0.567 + 0.100 = 0.547 → σ(0.547) = 0.633"
}
```

### src/demo/animation.ts

```typescript
/**
 * Animate pulse traveling along a weight line
 */
export function animatePulse(
  svg: d3.Selection<SVGSVGElement, unknown, null, undefined>,
  from: SignalPosition,
  to: SignalPosition,
  duration: number,
  isPositive: boolean
): Promise<void> {
  // 1. Create circle element at 'from' position
  // 2. Transition to 'to' position over duration
  // 3. Return promise that resolves when complete
}

/**
 * Highlight a neuron to show activation
 */
export function highlightNeuron(
  neuronsGroup: d3.Selection<SVGGElement, unknown, HTMLElement, unknown>,
  neuronId: string,
  intensity: number
): void {
  // 1. Find neuron circle by data-id
  // 2. Apply highlight style (stroke, glow)
}
```

### src/demo/state.ts

```typescript
/**
 * Demo state machine
 */
export class DemoStateMachine {
  private state: DemoState;
  private listeners: ((state: DemoState) => void)[] = [];

  startDemo(input: XORInput): void { /* idle -> running */ }
  startStepThrough(input: XORInput): void { /* idle -> step-through */ }
  nextStep(): void { /* advance step index */ }
  prevStep(): void { /* decrement step index */ }
  pause(): void { /* running -> paused */ }
  resume(): void { /* paused -> running */ }
  cancel(): void { /* any -> idle */ }

  subscribe(listener: (state: DemoState) => void): () => void;
}
```

## Testing Strategy

### Unit Tests (tests/unit/demo.test.ts)

```typescript
describe('DemoStateMachine', () => {
  it('transitions from idle to running on startDemo');
  it('prevents invalid transitions');
  it('tracks step index correctly');
});

describe('generateDemoSteps', () => {
  it('creates correct number of steps for 5-layer network');
  it('captures accurate weighted sums');
  it('formats calculations to 3 decimal places');
});
```

### Manual Testing Checklist

- [ ] Demo button starts animation
- [ ] Input selector changes expected output display
- [ ] Pulse visibly travels along weight lines
- [ ] Neurons highlight when receiving signal
- [ ] Step indicator shows "Step X of 5"
- [ ] Next/Previous navigate correctly
- [ ] Pause stops animation mid-flow
- [ ] Resume continues from paused position
- [ ] Escape cancels and returns to idle
- [ ] Training controls disabled during demo
- [ ] Keyboard shortcuts work (D, N, P, Escape, Space)
- [ ] Calculation panel shows formulas
- [ ] Final step shows correct/incorrect prediction

## Common Issues

### Animation Not Visible

- Check pulse element is appended to correct SVG group
- Verify z-index places pulse above weight lines
- Check pulse radius is > 0 and fill color is visible

### Timing Issues

- Ensure promises chain correctly for sequential animations
- Use `await` for each layer animation before incrementing step
- Check SPEED_CONFIGS values are in milliseconds

### State Conflicts

- Verify training is paused before demo starts
- Check `interruptedTraining` flag is set/cleared correctly
- Ensure control button enable/disable matches state

## Next Steps After Implementation

1. Run `npm run build` to verify bundle size
2. Run `npm run test` to verify all tests pass
3. Test in Chrome, Firefox, Safari
4. Deploy to GitHub Pages for live testing
