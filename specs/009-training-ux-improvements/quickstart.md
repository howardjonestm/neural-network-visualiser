# Quickstart: Training UX Improvements

**Feature**: 009-training-ux-improvements
**Date**: 2025-12-13

## Prerequisites

- Node.js 18+ installed
- Git clone of neural-network-visualiser repository
- On branch `009-training-ux-improvements`

## Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Open in browser
open http://localhost:5173/neural-network-visualiser/
```

## Validation Checklist

### User Story 1: Synchronized Training Step Visualizations

1. Navigate to Section 2 (Training)
2. Scroll to "Understanding Training" subsection
3. Click "Next" to view Forward Pass step
4. **Verify**: Neurons animate sequentially from input to output (2-3 seconds)
5. Click "Next" to view Calculate Loss step
6. **Verify**: Output layer neurons are highlighted with glow effect
7. Click "Next" to view Backpropagation step
8. **Verify**: Weight lines animate backward from output to input
9. Click "Previous" to return to Forward Pass
10. **Verify**: Forward pass animation replays

### User Story 2: Contextual Math Explanations

1. In "Understanding Training", view Forward Pass step
2. **Verify**: Expandable "Show Math" section appears within the step
3. Expand the math section
4. **Verify**: Sigmoid formula is displayed: σ(z) = 1 / (1 + e^-z)
5. Navigate to Calculate Loss step
6. **Verify**: Math section shows MSE loss formula
7. Navigate to Backpropagation step
8. **Verify**: Math section shows weight update formula and learning rate explanation

### User Story 3: Simplified Training Controls

1. View the training controls panel
2. **Verify**: Play and Reset buttons are horizontal, side-by-side
3. **Verify**: Both buttons are styled in blue (primary color)
4. **Verify**: No "Training Controls" section title
5. **Verify**: No "Reset Network" section title
6. **Verify**: No `[1, 1] -> expects 0` sample display (or simplified text only)
7. **Verify**: Steps and Loss displayed only once (no duplicates)
8. Train the network until convergence
9. **Verify**: Green indicator shows trained/converged state

### User Story 4: Clean Trained Network Section

1. Train the network (click Play, wait for convergence)
2. Scroll to Section 3 (The Trained Network)
3. **Verify**: No "Network not yet trained" message appears
4. **Verify**: No "Highlight strong weights" button
5. **Verify**: Weights pulsate subtly indicating trained state
6. **Verify**: Periodic signal/pulse flows through the network (every ~3 seconds)

### User Story 5: Streamlined Run Network Controls

1. Scroll to Section 4 (Running Inference / Run Network)
2. **Verify**: No speed selector (1x, 2x, 4x options)
3. **Verify**: No Previous/Next step buttons
4. Select an input (e.g., [0, 1])
5. Click "Run Demo"
6. **Verify**: Calculations section is collapsed by default
7. **Verify**: Can expand calculations by clicking
8. **Verify**: Predicted value prominently displayed in left panel (large font)
9. **Verify**: Predicted value appears on/near output neuron in visualization
10. **Verify**: Green color for correct prediction, red for incorrect

### User Story 6: Interactive Training Encouragement

1. Clear localStorage: `localStorage.removeItem('nn-visualiser-hint-dismissed')`
2. Refresh the page
3. Scroll to Section 2 (Training)
4. **Verify**: After ~2 seconds, hint appears encouraging weight/node interaction
5. Dismiss the hint
6. Refresh the page
7. **Verify**: Hint does NOT appear again (localStorage remembers dismissal)

### User Story 7: Real-time Signal Visualization

1. Navigate to Section 3 (Trained Network) after training
2. **Verify**: Subtle pulse animation flows through network periodically
3. **Verify**: Signal animation doesn't interfere with other interactions
4. Hover over a weight
5. **Verify**: Tooltip still works correctly during signal animation

## Quick Test Commands

```bash
# Type check
npx tsc --noEmit

# Build for production
npm run build

# Preview production build
npm run preview
```

## Files Modified in This Feature

| File | Changes |
|------|---------|
| `src/tutorial/sections/training.ts` | Auto-trigger animations, contextual math |
| `src/tutorial/sections/tour.ts` | Remove messages/buttons, add signal animation |
| `src/tutorial/sections/inference.ts` | Simplify controls, prominent prediction |
| `src/controls/playback.ts` | Horizontal layout, remove title |
| `src/controls/reset.ts` | Horizontal layout, remove title |
| `src/controls/parameters.ts` | Ensure hidden by default |
| `src/demo/controls.ts` | Remove speed/step controls, collapsible calcs |
| `src/education/content.ts` | Reorganize math content per step |
| `src/visualisation/renderer.ts` | Signal flow animation, prediction overlay |
| `src/tutorial/state.ts` | Hint dismissal state |
| `src/styles.css` | Horizontal buttons, signal animation styles |

## Success Criteria Reference

| SC | Metric | How to Verify |
|----|--------|---------------|
| SM-001 | Training control buttons = 2 | Count visible buttons (Play, Reset only) |
| SM-002 | Section titles removed = 2 | Visual inspection |
| SM-003 | Run Network controls = 2 | Count controls (input selector, run button) |
| SM-004 | Animation sync = 100% | Each training step triggers its animation |
| SM-005 | Prediction visible <1s | Time from demo completion to seeing prediction |

## Troubleshooting

**Animation not playing:**
- Check browser console for errors
- Verify `prefers-reduced-motion` is not set to `reduce`
- Check that previous animation completed or was cancelled

**Hint keeps appearing:**
- Check localStorage: `localStorage.getItem('nn-visualiser-hint-dismissed')`
- Try in regular (non-private) browsing mode

**Prediction not showing on network:**
- Verify inference completed (check console for errors)
- Check that SVG container has correct viewBox
