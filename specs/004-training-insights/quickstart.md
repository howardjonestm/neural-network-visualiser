# Quickstart: Training Insights

**Feature**: 004-training-insights
**Prerequisites**: Existing neural network visualizer running (`npm run dev`)

## Overview

This feature adds three capabilities:
1. **Weight change visualization** (P1) - See green/red flashes when weights change during training
2. **Activation tooltips** (P2) - Hover over neurons to see sigmoid formula and values
3. **Weight history** (P3) - Click weights to see recent change history

## Development Setup

```bash
# Ensure on correct branch
git checkout 004-training-insights

# Install dependencies (if needed)
npm install

# Start development server
npm run dev

# Run tests
npm run test
```

## Implementation Order

### Phase 1: Weight Delta Tracking (Foundation)

1. Create `src/visualisation/weight-delta.ts`:
   - Implement `WeightDeltaTracker` class
   - Add delta computation logic
   - Add magnitude classification

2. Integrate tracker into `src/main.ts`:
   - Initialize tracker on app start
   - Call `captureSnapshot()` before each training step
   - Call `computeDeltas()` after each training step

### Phase 2: Weight Change Visualization (P1)

1. Add CSS classes in `src/styles.css`:
   ```css
   .weight-increase { stroke: #22c55e; filter: brightness(1.3); }
   .weight-decrease { stroke: #ef4444; filter: brightness(0.8); }
   ```

2. Update `src/visualisation/renderer.ts`:
   - Add `highlightWeightChanges(deltas: Map<string, WeightDelta>)` method
   - Apply classes with D3 transition (500ms fade)

3. Extend weight tooltips in `src/visualisation/tooltip.ts`:
   - Show current value AND delta in tooltip

### Phase 3: Activation Tooltips (P2)

1. Create `src/education/activation-tooltip.ts`:
   - Implement `createActivationTooltipData()` function
   - Create tooltip HTML generator with mini sigmoid curve

2. Update neuron hover handler in `src/main.ts`:
   - Use new activation tooltip for hidden/output neurons
   - Show pass-through message for input neurons

### Phase 4: Weight History (P3)

1. Extend `WeightDeltaTracker`:
   - Add ring buffer for history storage
   - Implement `getHistory()` method

2. Add click handler for weights:
   - Show history panel on weight click
   - Color-code increases/decreases

## Key Files to Modify

| File | Changes |
|------|---------|
| `src/visualisation/weight-delta.ts` | NEW - Delta tracking logic |
| `src/education/activation-tooltip.ts` | NEW - Activation tooltip component |
| `src/visualisation/renderer.ts` | Add weight highlight animation |
| `src/visualisation/tooltip.ts` | Extend weight tooltip with delta |
| `src/main.ts` | Wire up tracker and handlers |
| `src/styles.css` | Add highlight CSS classes |

## Testing Checklist

### Unit Tests
- [ ] `WeightDeltaTracker.computeDeltas()` returns correct deltas
- [ ] `WeightDeltaTracker.getHistory()` returns last 10 values
- [ ] `createActivationTooltipData()` computes correct curve positions
- [ ] Magnitude classification thresholds are correct

### Manual Testing
- [ ] Click "Train Step" → weights flash green/red appropriately
- [ ] Hover over weight → see value and delta
- [ ] Hover over hidden neuron → see sigmoid formula and values
- [ ] Hover over input neuron → see "pass-through" message
- [ ] Train 15 steps → click weight → see 10-entry history
- [ ] Click "Reset" → history cleared

## Common Issues

**Q: Weights don't flash on training**
A: Check that `captureSnapshot()` is called BEFORE `trainStep()`, not after.

**Q: Tooltip shows NaN for pre-activation**
A: Ensure `forwardPass()` has been run at least once before hovering.

**Q: Animation is choppy during rapid training**
A: Debounce is working; only 10 updates/sec during continuous training.

## Definition of Done

- [ ] All unit tests passing (`npm run test`)
- [ ] Build succeeds (`npm run build`)
- [ ] Manual testing checklist complete
- [ ] No console errors in browser
- [ ] Performance: 30fps maintained during rapid training
