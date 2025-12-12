# Quickstart: UI Layout Improvements

**Feature**: 005-ui-layout-improvements
**Date**: 2025-12-11

## Prerequisites

- Node.js 18+ installed
- Project dependencies installed: `npm install`
- Development server available: `npm run dev`

## Development Workflow

### Starting Development

```bash
# Start development server
npm run dev

# Open browser to http://localhost:5173
```

### Running Tests

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch
```

### Building

```bash
# Type check and build for production
npm run build

# Preview production build
npm run preview
```

## Manual Testing Checklist

### User Story 1: Streamlined Interface (P1)

| Test | Steps | Expected Result |
|------|-------|-----------------|
| Legend panel removed | Load application | No legend panel visible on left side |
| Resources panel removed | Load application | No "How this relates to AI" or "Learn More" panels visible |
| Title position | Load application | Page title "Neural Network Visualiser" appears in top-left corner |
| Visualization space | Load application | Network visualization has more horizontal space |

### User Story 2: Reorganized Control Layout (P1)

| Test | Steps | Expected Result |
|------|-------|-----------------|
| Training controls left | View control area | Step, Play/Pause, learning rate, reset appear on LEFT side |
| Run controls right | View control area | Input selector, run button, step controls appear on RIGHT side |
| Section labels | View control panels | "Train Network" header on left, "Run Network" header on right |
| No "Demo" label | Search UI for "Demo" | Should not find any "Demo" label; replaced with "Run Network" |
| Responsive stacking | Resize window to <768px | Controls stack vertically (training above run) |

### User Story 3: Enhanced Neuron Visualization (P2)

| Test | Steps | Expected Result |
|------|-------|-----------------|
| Solid neurons | Load application | Neurons appear as solid filled circles, not transparent |
| Low activation | Set input [0,0], run network | Neurons with low activation appear lighter blue |
| High activation | Set input [1,0], run network | Activated neurons appear darker blue |
| Intensity transition | Run training step | Neuron colors smoothly transition when activations change |
| Color contrast | Inspect neurons | Both light and dark neurons visible against background |

### User Story 4: Weight and Bias Understanding (P2)

| Test | Steps | Expected Result |
|------|-------|-----------------|
| Weight hover | Hover over any weight line | Tooltip shows weight value |
| Weight explanation | Hover over weight | Tooltip includes brief explanation of weights |
| Bias hover | Hover over hidden/output neuron | Tooltip shows bias value |
| Bias explanation | Hover over neuron | Tooltip includes brief explanation of biases |
| Updated values | Train one step, hover weight | Weight value and delta reflect latest training |
| Input neuron bias | Hover over input neuron | No bias shown (input neurons don't have bias) |

### User Story 5: Real-time Value Display (P3) - Optional

| Test | Steps | Expected Result |
|------|-------|-----------------|
| Input values | Run input through network | Input values visible on input neurons |
| Intermediate values | View calculation panel | Layer-by-layer values shown |

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `Space` | Play/Pause training |
| `S` | Single training step |
| `R` | Reset network |
| `D` | Start demo (run network) |
| `N` | Next step (during demo) |
| `P` | Previous step (during demo) |
| `Escape` | Cancel demo |

## Accessibility Testing

### Screen Reader

1. Open application with screen reader (VoiceOver/NVDA)
2. Tab through all controls
3. Verify: All buttons and controls are announced
4. Verify: Section headers ("Train Network", "Run Network") are announced

### Keyboard Navigation

1. Tab through entire application
2. Verify: All interactive elements reachable
3. Verify: Focus visible on all elements
4. Verify: Enter/Space activates buttons

### Color Contrast

1. Use browser developer tools or aXe extension
2. Check neuron colors against background
3. Verify: WCAG AA compliance (4.5:1 ratio minimum)

## Performance Testing

### Frame Rate

1. Start continuous training (Play button)
2. Open browser DevTools > Performance
3. Record 5 seconds
4. Verify: Frame rate stays above 30fps

### Initial Load

1. Clear cache, hard reload
2. Open DevTools > Network
3. Verify: Initial render < 1 second
4. Verify: Bundle size < 500KB gzipped

## File Locations

| Component | File |
|-----------|------|
| HTML structure | `src/index.html` |
| Main styles | `src/styles.css` |
| App initialization | `src/main.ts` |
| Network renderer | `src/visualisation/renderer.ts` |
| Tooltip | `src/visualisation/tooltip.ts` |
| Layout calculations | `src/visualisation/layout.ts` |

## Common Issues

### Neurons not changing color
- Check: `getNeuronFill()` function returns HSL color based on activation
- Check: D3 selection updates `fill` attribute on update

### Controls not side-by-side
- Check: CSS Grid applied to `#controls-container`
- Check: No conflicting flexbox rules
- Check: Window width > 768px (otherwise stacked)

### Tooltip not showing weight explanation
- Check: `showWeight()` method includes explanation text
- Check: Tooltip CSS can accommodate longer content

### Legend still visible
- Check: `#legend-container` removed from HTML
- Check: Legend import/initialization removed from main.ts
