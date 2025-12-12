# Quickstart: Training Visualization

**Feature**: 006-training-visualization
**Date**: 2025-12-11

## Prerequisites

- Node.js 18+ installed
- Repository cloned and dependencies installed (`npm install`)
- Development server runs successfully (`npm run dev`)

## Development Workflow

### 1. Start Development Server

```bash
npm run dev
```

Open http://localhost:5173 in browser.

### 2. Run Tests

```bash
npm run test        # Run all tests
npm run test:watch  # Watch mode during development
```

### 3. Build for Production

```bash
npm run build
```

---

## Manual Testing Checklist

### User Story 1: Training Progress Summary (P1)

**Setup**: Load app, locate training panel on left side

| Test | Steps | Expected Result |
|------|-------|-----------------|
| Step count updates | Click "Step" button 3 times | Step count shows "3" |
| Loss updates | Click "Step" button | Loss value updates after each step |
| Sample display | Click "Step" button | Shows "Training: [X,Y] → Z" format |
| Play mode | Click "Play", wait 5 seconds | Step count increases continuously |
| Pause mode | Click "Pause" during play | Updates stop, last values preserved |
| Reset clears | Click "Reset" | Step count = 0, loss resets, sample clears |

### User Story 2: Current Training Sample Display (P1)

**Setup**: Observe training panel during training

| Test | Steps | Expected Result |
|------|-------|-----------------|
| Sample format | Click "Step" | Shows input values and expected output |
| XOR samples cycle | Click "Step" 8 times | See [0,0], [0,1], [1,0], [1,1] cycle twice |
| Sample clears on reset | Click "Reset" | No sample displayed or shows "Ready to train" |

### User Story 3: Per-Sample Error Display (P1)

**Setup**: Observe error display in training panel

| Test | Steps | Expected Result |
|------|-------|-----------------|
| Error format | Click "Step" | Shows "Output: X.XX, Expected: Y, Error: Z.ZZ" |
| Green for low error | Train until loss < 0.1 | Error display has green coloring |
| Red for high error | Reset, click "Step" once | Error display has red/yellow coloring |
| Error updates each sample | Click "Step" | Error value changes as samples process |

### User Story 4: Weight Change Highlighting (P2)

**Setup**: Observe weight lines in visualization during training

| Test | Steps | Expected Result |
|------|-------|-----------------|
| Highlight appears | Click "Step" | Some weight lines briefly highlight |
| Large changes prominent | Click "Step" early in training | Most-changed weights more visible |
| Highlight fades | Wait after step | Highlights fade within 500ms |
| Hover shows delta | Hover over weight during training | Tooltip shows recent change value |
| Convergence reduces highlights | Train until loss < 0.01 | Highlights become less intense |

### User Story 5: Gradient Direction Indicators (P2)

**Setup**: Observe weight lines closely during training

| Test | Steps | Expected Result |
|------|-------|-----------------|
| Up arrow for increase | Click "Step", observe | Increasing weights show upward indicator |
| Down arrow for decrease | Click "Step", observe | Decreasing weights show downward indicator |
| No arrow for stable | Train to convergence | Near-zero changes show no indicator |
| Arrow size varies | Compare different weights | Larger changes = larger arrows |

### User Story 6: Training Forward Pass Animation (P3)

**Setup**: Enable animated training mode (toggle in training panel)

| Test | Steps | Expected Result |
|------|-------|-----------------|
| Toggle available | Look in training panel | "Animate Training" toggle visible |
| Animation disabled by default | Start training | No animation, training runs at full speed |
| Animation when enabled | Toggle on, click "Step" | Pulses flow from input to output |
| Output highlights | Watch animation complete | Output neuron highlights at end |
| Animation slows training | Toggle on, click "Play" | Steps are visibly slower |
| Animation during play | Play with animation on | Each step animates before next |

### Edge Cases

| Test | Steps | Expected Result |
|------|-------|-----------------|
| Rapid clicking | Click "Step" rapidly 10 times | No UI glitches, updates are readable |
| Max speed + animation | Toggle animation, Play, max speed | Animation skips or auto-disables |
| Hover during training | Hover weight, click "Play" | Tooltip updates dynamically |
| Convergence display | Train until loss ~0 | Shows "Converged" or similar |
| Reset during play | Click "Reset" while playing | Training stops, display clears |

---

## Key Files to Modify

### New Files

| File | Purpose |
|------|---------|
| `src/visualisation/training-panel.ts` | Training summary UI component |
| `tests/unit/training-panel.test.ts` | Unit tests for panel |

### Modified Files

| File | Changes |
|------|---------|
| `src/network/types.ts` | Add TrainingStepResult, TrainingStepSummary interfaces |
| `src/network/training.ts` | Emit per-sample results during trainStep() |
| `src/controls/playback.ts` | Add onSampleProcessed callback |
| `src/visualisation/weight-delta.ts` | Add direction field to WeightDelta |
| `src/visualisation/renderer.ts` | Add gradient direction arrow markers |
| `src/main.ts` | Wire up TrainingPanel, handle callbacks |
| `src/styles.css` | Error color classes, arrow marker styles |
| `src/index.html` | Add container for training display elements |

---

## Debugging Tips

### Training Panel Not Updating

1. Check browser console for errors
2. Verify `onSampleProcessed` callback is wired in `main.ts`
3. Ensure throttle (100ms) isn't blocking all updates

### Weight Highlights Not Visible

1. Check CSS classes are applied (`weight-increase`, `weight-decrease`)
2. Verify `highlightWeightChanges()` is called after each step
3. Check delta magnitudes - 'none' magnitude won't highlight

### Animation Not Playing

1. Verify `isAnimated` state is true
2. Check `animationCancelled` flag isn't stuck true
3. Ensure animation promises resolve correctly

### Color Coding Wrong

1. Verify error calculation: `output - expected` (signed)
2. Check threshold values: good < 0.1, moderate < 0.3, poor >= 0.3
3. Ensure CSS variables for colors are defined

---

## Performance Notes

- Training panel updates throttled to 100ms minimum
- Weight highlights use CSS transitions (hardware accelerated)
- Animation mode adds ~500ms per step (configurable via speed)
- All computation remains client-side (no network requests)
