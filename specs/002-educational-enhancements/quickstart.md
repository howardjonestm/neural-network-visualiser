# Quickstart: Educational Enhancements

**Feature**: 002-educational-enhancements
**Date**: 2025-12-09

## Prerequisites

- Node.js 18+ installed
- npm installed
- Repository cloned and on branch `002-educational-enhancements`

## Setup

```bash
# Install dependencies (if not already done)
npm install

# Start development server
npm run dev
```

Open http://localhost:5173 in your browser.

## Development Workflow

### 1. Run Tests

```bash
# Run all tests once
npm run test

# Watch mode during development
npm run test:watch
```

### 2. Build for Production

```bash
npm run build
```

Output goes to `dist/` folder, ready for GitHub Pages deployment.

### 3. Preview Production Build

```bash
npm run preview
```

## Key Files to Modify

### Network Architecture (US2)

**File**: `src/network/network.ts`

Change the default architecture from `[2, 2, 1]` to `[2, 4, 3, 2, 1]`:

```typescript
// Update createNetwork default or main.ts initialization
network = createNetwork([2, 4, 3, 2, 1]);
```

### Educational Module (US1, US3, US4, US5)

Create new directory: `src/education/`

**Files to create**:
- `content.ts` - Static text content for all explanations
- `legend.ts` - Legend component class
- `hints.ts` - Hint system with localStorage persistence
- `loss-indicator.ts` - Loss trend display component
- `resources.ts` - External learning resources panel

### Layout Adjustments (US2)

**File**: `src/visualisation/layout.ts`

Update `getResponsiveConfig()` to accommodate 5 layers:
- Adjust spacing calculations for more layers
- Ensure neurons don't overlap

### HTML Structure

**File**: `src/index.html`

Add containers for:
- Legend sidebar (left)
- Resources panel (collapsible section in controls)
- Hint container (positioned overlay)

### Styles

**File**: `src/styles.css`

Add styles for:
- `.legend` - Sidebar legend
- `.hint` - Callout bubbles with arrows
- `.loss-trend` - Traffic light indicator
- `.resources` - External links panel

## Implementation Order

1. **Network Architecture** (T001-T003)
   - Modify default architecture
   - Update layout calculations
   - Verify training still works

2. **Legend Component** (T004-T008)
   - Create legend data structure
   - Build collapsible sidebar UI
   - Add visual samples

3. **Hint System** (T009-T015)
   - Create hint data structure
   - Build positioning logic
   - Implement localStorage persistence
   - Add dismiss functionality

4. **Loss Indicator** (T016-T018)
   - Track previous loss
   - Compute trend direction
   - Display with traffic light UI

5. **Resources & Content** (T019-T024)
   - Add LLM connection content
   - Build resources panel
   - Curate external links

6. **Integration & Polish** (T025-T030)
   - Wire all components to main.ts
   - Test responsive behavior
   - Verify accessibility

## Testing Checklist

- [ ] Network renders with 5 layers (12 neurons, 26 weights)
- [ ] Training still converges on XOR
- [ ] Legend displays all categories
- [ ] Legend collapses on smaller screens
- [ ] Hints appear on first load (network, weights)
- [ ] Hints appear on first interaction (controls)
- [ ] Dismissed hints don't reappear
- [ ] "Reset hints" shows all hints again
- [ ] Loss trend shows correct direction
- [ ] Resources panel has all links
- [ ] All links open in new tab
- [ ] Keyboard navigation works for all new elements
- [ ] Bundle size still under 500KB gzipped

## Common Issues

### Hints Not Showing

Check:
1. localStorage not blocking (`nn-viz-hints` key)
2. Target selector matches element
3. Element is visible in DOM when hint triggers

### Layout Broken with 5 Layers

Check:
1. `getResponsiveConfig()` returns adequate width
2. Neuron positions don't overlap
3. Weight lines render between correct neurons

### Training Fails to Converge

With deeper network:
1. May need more training steps (5000+)
2. Learning rate 0.5 should work
3. Check Xavier initialization is applied to all layers
